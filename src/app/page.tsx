import { Inter } from "next/font/google";
import { unstable_cache } from "next/cache";

import MaggieImageList from "@/components/MaggieImageList";
import { list } from "@vercel/blob";
import { LoginButton, LogoutButton } from "./components/Buttons";
import { getServerSession } from "next-auth";
import { options } from "./api/auth/[...nextauth]/options";
import { imageWithTitle } from "@/types";
import { captionFor } from "@/lib/captions";
import sharp from "sharp";

const BLUR_WIDTH = 16;
// Bounds parallel downloads + sharp decodes on a cold cache; once every
// photo's measurement is cached this loop is effectively free.
const MEASURE_CONCURRENCY = 8;
// On a cold cache, stop measuring new photos once this much time has been
// spent and render what's ready. Measurements are cached permanently, so
// later requests finish the remainder incrementally instead of one visitor
// paying for the whole library (or timing out the function).
const MEASURE_TIME_BUDGET_MS = 15_000;

const shuffle = <T,>(items: T[]): T[] => {
    const result = [...items];
    for (let i = result.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
};
const inter = Inter({ subsets: ["latin"] });

type GalleryBlob = { pathname: string; url: string };

const listGalleryBlobs = unstable_cache(
    async (): Promise<GalleryBlob[]> => {
        const images: GalleryBlob[] = [];
        let cursor: string | undefined;
        do {
            const page = await list({ cursor });
            for (const blob of page.blobs) {
                if (!blob.pathname.endsWith('/')) {
                    images.push({ pathname: blob.pathname, url: blob.url });
                }
            }
            cursor = page.hasMore ? page.cursor : undefined;
        } while (cursor);
        return images;
    },
    ['blob-image-list'],
    { revalidate: 3600, tags: ['blob-image-list'] }
);

// Measures a photo's real dimensions and builds a blur placeholder.
// Photos are immutable (a new photo gets a new key), so entries are
// cached without revalidation; each image is downloaded at most once
// per deployment.
const measureImage = ({ pathname, url }: GalleryBlob) =>
    unstable_cache(
        async () => {
            // Fail fast on a stalled connection so the photo is dropped from
            // the render instead of hanging the whole page.
            const response = await fetch(url, {
                signal: AbortSignal.timeout(10_000),
            });
            if (!response.ok) {
                throw new Error(`Fetching ${pathname} failed: ${response.status}`);
            }
            const image = sharp(Buffer.from(await response.arrayBuffer()));
            const { width, height, orientation } = await image.metadata();
            if (!width || !height) {
                throw new Error(`Could not read dimensions of ${pathname}`);
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
        ['image-meta', pathname],
        { revalidate: false }
    )();

const Page: React.FC = async () => {

    // Catch here rather than inside listGalleryBlobs: unstable_cache doesn't
    // cache rejections, so a transient Blob failure renders without the
    // gallery once instead of caching an empty list for an hour.
    const blobs = await listGalleryBlobs().catch((error) => {
        console.error('Failed to list gallery images', error);
        return [] as GalleryBlob[];
    });
    const shuffled = shuffle(blobs);
    const imagesData: imageWithTitle[] = [];
    const deadline = Date.now() + MEASURE_TIME_BUDGET_MS;
    for (let i = 0; i < shuffled.length; i += MEASURE_CONCURRENCY) {
        if (i > 0 && Date.now() > deadline) {
            console.warn(`Measuring budget exhausted after ${i} of ${shuffled.length} photos`);
            break;
        }
        const batch = await Promise.all(
            shuffled.slice(i, i + MEASURE_CONCURRENCY).map(async (blob): Promise<imageWithTitle | null> => {
                try {
                    const meta = await measureImage(blob);
                    return { title: captionFor(blob.pathname), img: blob.url, ...meta };
                } catch (error) {
                    console.error(`Failed to measure gallery image ${blob.pathname}`, error);
                    return null;
                }
            })
        );
        imagesData.push(...batch.filter((image): image is imageWithTitle => image !== null));
    }
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
