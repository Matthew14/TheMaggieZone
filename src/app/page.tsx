import { Inter } from "next/font/google";
import { unstable_cache } from "next/cache";

import MaggieImageList from "@/components/MaggieImageList";
import { S3Client, paginateListObjectsV2 } from "@aws-sdk/client-s3";
import { LoginButton, LogoutButton } from "./components/Buttons";
import { getServerSession } from "next-auth";
import { options } from "./api/auth/[...nextauth]/options";
import { imageWithTitle } from "@/types";
import { captionFor } from "@/lib/captions";
import sharp from "sharp";

const NUM_IMAGES = 10;
const BLUR_WIDTH = 16;

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
                if (object.Key && !object.Key.endsWith('/')) {
                    keys.push(object.Key);
                }
            }
        }
        return keys;
    },
    ['s3-image-keys'],
    { revalidate: 3600, tags: ['s3-image-keys'] }
);

// Measures a photo's real dimensions and builds a blur placeholder.
// Photos are immutable (a new photo gets a new key), so entries are
// cached without revalidation; each image is downloaded at most once
// per deployment.
const measureImage = (key: string) =>
    unstable_cache(
        async () => {
            // Fail fast on a stalled connection so the photo is dropped from
            // the render instead of hanging the whole page.
            const response = await fetch(`${s3Url}/${encodeURI(key)}`, {
                signal: AbortSignal.timeout(10_000),
            });
            if (!response.ok) {
                throw new Error(`Fetching ${key} failed: ${response.status}`);
            }
            const image = sharp(Buffer.from(await response.arrayBuffer()));
            const { width, height, orientation } = await image.metadata();
            if (!width || !height) {
                throw new Error(`Could not read dimensions of ${key}`);
            }
            // EXIF orientations 5-8 display rotated 90°, swapping the axes;
            // .rotate() bakes the same rotation into the placeholder.
            const displaysRotated = (orientation ?? 1) >= 5;
            const blur = await image.rotate().resize(BLUR_WIDTH).jpeg({ quality: 60 }).toBuffer();
            return {
                width: displaysRotated ? height : width,
                height: displaysRotated ? width : height,
                blurDataURL: `data:image/jpeg;base64,${blur.toString('base64')}`,
            };
        },
        ['image-meta', key],
        { revalidate: false }
    )();

const Page: React.FC = async () => {

    // Catch here rather than inside listImageKeys: unstable_cache doesn't
    // cache rejections, so a transient S3 failure renders without the
    // gallery once instead of caching an empty list for an hour.
    const keys = await listImageKeys().catch((error) => {
        console.error('Failed to list gallery images', error);
        return [] as string[];
    });
    const imagesData = (await Promise.all(
        shuffle(keys).slice(0, NUM_IMAGES).map(async (key): Promise<imageWithTitle | null> => {
            try {
                const meta = await measureImage(key);
                return { title: captionFor(key), img: `${s3Url}/${encodeURI(key)}`, ...meta };
            } catch (error) {
                console.error(`Failed to measure gallery image ${key}`, error);
                return null;
            }
        })
    )).filter((image): image is imageWithTitle => image !== null);
    const session = await getServerSession(options);
    return imagesData.length > 0 && (

        <main className={`flex min-h-screen flex-col items-center justify-between p-6 md:p-24 ${inter.className}`} >
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
