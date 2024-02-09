import { Inter } from "next/font/google";

import MaggieImageList from "@/components/MaggieImageList";
import { S3Client, paginateListObjectsV2 } from "@aws-sdk/client-s3";
import { LoginButton, LogoutButton } from "./components/Buttons";
import { getServerSession } from "next-auth";
import { options } from "./api/auth/[...nextauth]/options";

const inter = Inter({ subsets: ["latin"] });
const bucket = 'the-maggie-zone-images'
const Page: React.FC = async () => {

    const s3Client = new S3Client({ region: 'eu-west-1', });
    const s3Url = `https://${bucket}.s3.eu-west-1.amazonaws.com`
    const paginator = paginateListObjectsV2(
        { client: s3Client },
        { Bucket: bucket }
    );
    const getImages = async () => {
        for await (const page of paginator) {
            const objects = page.Contents;
            if (objects) {
                return objects.map((o) => { return { title: o.Key!, img: `${s3Url}/${o.Key}` } })
            }
        }
    }

    const imagesData = await getImages();
    const session = await getServerSession(options);
    return imagesData && (

        <main className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`} >
            <div>
                <div className="authButton">
                    {session ? <LogoutButton /> : <LoginButton /> }
                </div>
                <div className='flex mx-auto'>
                    <div className='flex-col text-center'>
                        <h1 className='text-5xl text-white justify-center text-center'>
                            Welcome to the Maggie Zone
                        </h1>
                    </div>
                </div>
                <MaggieImageList images={imagesData} />
            </div>
        </main>
    );
};

export default Page;
