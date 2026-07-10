"use client";

import { FC, useState } from "react";
import Image from "next/image";
import { imageWithTitle } from "@/types";
import ImageModal from "./ImageModal";


interface MaggieImageListProps {
  images: imageWithTitle[];
}

const MaggieImageList: FC<MaggieImageListProps> = ({ images }) => {
  const [selectedImage, setSelectedImage] = useState<imageWithTitle | null>(null);
  return (
    <>
      <ul className='my-10 columns-2 md:columns-3 lg:columns-4 gap-2 list-none p-0'>
        {images.map((item) => (
          <li key={item.img} className='mb-2 break-inside-avoid'>
            <button
              type='button'
              className='block w-full cursor-pointer border-0 bg-transparent p-0'
              onClick={() => setSelectedImage(item)}
              aria-label={`View ${item.title}`}
            >
              <Image
                className='w-full h-auto rounded-lg transition duration-200 hover:scale-[1.02] hover:shadow-lg'
                src={item.img}
                alt={item.title}
                loading='lazy'
                width={item.width}
                height={item.height}
                sizes='(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw'
                placeholder='blur'
                blurDataURL={item.blurDataURL}
              />
            </button>
          </li>
        ))}
      </ul>

      <ImageModal image={selectedImage} onClose={() => setSelectedImage(null)} />

    </>
  );
};

export default MaggieImageList;
