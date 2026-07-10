import { Inter } from "next/font/google";
import { unstable_cache } from "next/cache";

import MaggieImageList from "@/components/MaggieImageList";
import { S3Client, paginateListObjectsV2 } from "@aws-sdk/client-s3";
import { LoginButton, LogoutButton } from "./components/Buttons";
import { getServerSession } from "next-auth";
import { options } from "./api/auth/[...nextauth]/options";

const NUM_IMAGES = 10;

const shuffle = <T,>(items: T[]): T[] => {
    const result = [...items];
    for (let i = result.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
};
const inter = Inter({ subsets: ["latin"] });
const bucket = 'the-maggie-zone-images'
const s3Url = `https://${bucket}.s3.eu-west-1.amazonaws.com`

// The bucket policy grants public ListBucket/GetObject, so requests are
// sent unsigned and the app needs no AWS credentials.
const s3Client = new S3Client({
    region: 'eu-west-1',
    signer: { sign: async (request) => request },
    credentials: { accessKeyId: '', secretAccessKey: '' },
});

const listImageKeys = unstable_cache(
    async (): Promise<string[]> => {
        const paginator = paginateListObjectsV2(
            { client: s3Client },
            { Bucket: bucket }
        );
        const keys: string[] = [];
        for await (const page of paginator) {
            for (const object of page.Contents ?? []) {
                if (object.Key) {
                    keys.push(object.Key);
                }
            }
        }
        return keys;
    },
    ['s3-image-keys'],
    { revalidate: 3600, tags: ['s3-image-keys'] }
);

const Page: React.FC = async () => {

    // Catch here rather than inside listImageKeys: unstable_cache doesn't
    // cache rejections, so a transient S3 failure renders without the
    // gallery once instead of caching an empty list for an hour.
    const keys = await listImageKeys().catch((error) => {
        console.error('Failed to list gallery images', error);
        return [] as string[];
    });
    const imagesData = shuffle(keys).slice(1, NUM_IMAGES).map((key) => { return { title: key, img: `${s3Url}/${key}` } });
    const session = await getServerSession(options);
    return imagesData.length > 0 && (

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
