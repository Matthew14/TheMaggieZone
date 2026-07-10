"use client";

import { imageWithTitle } from "@/types";
import Image from "next/image";
import { FC, useEffect, useRef } from "react";

interface ImageModalProps {
  image: imageWithTitle | null;
  onClose: () => void;
}

const ImageModal: FC<ImageModalProps> = ({ image, onClose }) => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) {
      return;
    }
    if (image && !dialog.open) {
      dialog.showModal();
    } else if (!image && dialog.open) {
      dialog.close();
    }
  }, [image]);

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      // Clicks on the backdrop hit the dialog element itself; clicks on the
      // image hit the img, so only backdrop clicks close.
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          dialogRef.current?.close();
        }
      }}
      aria-label={image?.title}
      className='m-auto bg-transparent p-0 backdrop:bg-black/70'
    >
      {image && (
        <Image
          src={image.img}
          alt={image.title}
          width={image.width}
          height={image.height}
          sizes='90vw'
          placeholder='blur'
          blurDataURL={image.blurDataURL}
          className='max-h-[90vh] max-w-[90vw] w-auto h-auto'
        />
      )}
    </dialog>
  );
};

export default ImageModal;
