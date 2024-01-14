"use client";

import { FC, useState } from "react";
import { ImageList, ImageListItem, Modal } from "@mui/material";
import Image from "next/image";
import { imageWithTitle } from "@/types";
import ImageModal from "./ImageModal";


interface MaggieImageListProps {
  images: imageWithTitle[];
}

const MaggieImageList: FC<MaggieImageListProps> = ({ images }) => {
  const [open, setOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(images[0]);
  return (
    <>
      <ImageList className='my-10' variant='masonry' cols={3} gap={5}>
        {images.map((item) => (
          <ImageListItem
            key={item.img}
            onClick={() => {
              setOpen(true);
              setSelectedImage(item);
            }}
          >
            <Image
              className='cursor-pointer'
              src={item.img}
              alt={item.title}
              loading='lazy'
              width={1000}
              height={1000}
            />
          </ImageListItem>
        ))}
      </ImageList>

      <ImageModal image={selectedImage} open={open} onClose={() => setOpen(false)}/>

    </>
  );
};

export default MaggieImageList;
