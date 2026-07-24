"use client";

import { FC, useState } from "react";
import Image from "next/image";
import { imageWithTitle } from "@/types";
import ImageLightbox from "./ImageLightbox";


interface MaggieImageListProps {
  images: imageWithTitle[];
}

const INITIAL_COUNT = 10;
const BATCH_SIZE = 10;

const MaggieImageList: FC<MaggieImageListProps> = ({ images }) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [visibleCount, setVisibleCount] = useState(INITIAL_COUNT);
  // The lightbox also only cycles through the revealed photos, so its
  // counter matches what's on screen.
  const visibleImages = images.slice(0, visibleCount);
  return (
    <>
      <ul className='my-10 columns-2 md:columns-3 lg:columns-4 gap-2 list-none p-0'>
        {visibleImages.map((item, i) => (
          <li key={item.img} className='mb-2 break-inside-avoid'>
            <button
              type='button'
              className='block w-full cursor-pointer border-0 bg-transparent p-0'
              onClick={() => setSelectedIndex(i)}
              aria-label={`View ${item.title}`}
            >
              <Image
                // No transforms here: compositing a transformed element
                // inside the CSS multi-column gallery blanks the image in
                // both Chromium (briefly, on hover) and Safari (sometimes
                // permanently). Shadow and ring are plain repaints, which
                // fragmented multicol content handles fine everywhere.
                className='w-full h-auto rounded-lg transition duration-200 hover:shadow-lg hover:ring-2 hover:ring-white/40'
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

      {visibleCount < images.length && (
        <div className='mb-10 flex justify-center'>
          <button
            type='button'
            onClick={() => setVisibleCount((count) => count + BATCH_SIZE)}
            className='cursor-pointer rounded-full bg-white/10 px-6 py-2 text-white transition hover:bg-white/20'
          >
            More Maggie
          </button>
        </div>
      )}

      <ImageLightbox
        images={visibleImages}
        index={selectedIndex}
        onClose={() => setSelectedIndex(null)}
        onNavigate={setSelectedIndex}
      />

    </>
  );
};

export default MaggieImageList;
