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
      <ul className='my-10 columns-3 gap-[5px] list-none p-0'>
        {images.map((item) => (
          <li key={item.img} className='mb-[5px] break-inside-avoid'>
            <button
              type='button'
              className='block w-full cursor-pointer border-0 bg-transparent p-0'
              onClick={() => setSelectedImage(item)}
              aria-label={`View ${item.title}`}
            >
              <Image
                className='w-full h-auto'
                src={item.img}
                alt={item.title}
                loading='lazy'
                width={item.width}
                height={item.height}
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
