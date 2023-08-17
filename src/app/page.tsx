import { Inter } from "next/font/google";

import MaggieImageList from "@/components/MaggieImageList";
import { PrismaClient } from "@prisma/client";

const inter = Inter({ subsets: ["latin"] });

const Page: React.FC = async () => {
    const prisma = new PrismaClient();


    const imagesData = await prisma.image.findMany();
    return (
        <main className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`} >
        <div>
            <div className='flex mx-auto'>
            <div className='flex-col text-center'>
                <h1 className='text-5xl text-white justify-center text-center'>
                Welcome to the Maggie Zone
                </h1>
            </div>
            </div>
            <MaggieImageList images={imagesData.map(img => {return {img: img.path.replace('public/', '/Images/'), title: img.title}})} />
        </div>
        </main>
    );
};

export default Page;
