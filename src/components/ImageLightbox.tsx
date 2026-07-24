"use client";

import { imageWithTitle } from "@/types";
import Image from "next/image";
import { FC, useEffect, useRef } from "react";

interface ImageLightboxProps {
  images: imageWithTitle[];
  index: number | null;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

const buttonClasses =
  "absolute z-10 flex h-11 w-11 items-center justify-center rounded-full " +
  "bg-black/50 text-white transition hover:bg-black/80 focus-visible:outline " +
  "focus-visible:outline-2 focus-visible:outline-white";

const ImageLightbox: FC<ImageLightboxProps> = ({ images, index, onClose, onNavigate }) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const image = index !== null ? images[index] : null;

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

  const showPrev = () => onNavigate((index! - 1 + images.length) % images.length);
  const showNext = () => onNavigate((index! + 1) % images.length);

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      onKeyDown={(e) => {
        if (images.length < 2) {
          return;
        }
        if (e.key === "ArrowLeft") {
          showPrev();
        } else if (e.key === "ArrowRight") {
          showNext();
        }
      }}
      // Clicks on the dark area hit the dialog element itself; clicks on the
      // image, caption or buttons hit those elements, so only clicks outside
      // the content close.
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          dialogRef.current?.close();
        }
      }}
      aria-label={image?.title}
      // The dark overlay lives on the full-screen dialog itself (rather than
      // ::backdrop) so a single opacity transition fades overlay and content
      // together via @starting-style.
      className='fixed inset-0 m-0 hidden h-full max-h-none w-full max-w-none items-center
        justify-center bg-black/80 p-0 opacity-100 transition-opacity duration-300
        open:flex starting:opacity-0'
    >
      {image && (
        <>
          <figure className='flex max-h-full max-w-full flex-col items-center gap-3 p-4'>
            {/* Remount per photo so each one fades in from its own blur placeholder. */}
            <Image
              key={image.img}
              src={image.img}
              alt={image.title}
              width={image.width}
              height={image.height}
              sizes='92vw'
              placeholder='blur'
              blurDataURL={image.blurDataURL}
              className='max-h-[85dvh] max-w-[92vw] w-auto h-auto rounded-lg'
            />
            <figcaption className='text-sm text-white/80'>
              {image.title.replace(/\.[^.]+$/, "")}
              {images.length > 1 && (
                <span className='text-white/50'>
                  {" "}&middot; {index! + 1} / {images.length}
                </span>
              )}
            </figcaption>
          </figure>

          <button
            type='button'
            onClick={() => dialogRef.current?.close()}
            aria-label='Close'
            className={`${buttonClasses} right-3 top-3`}
          >
            <svg width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='currentColor'
              strokeWidth='2' strokeLinecap='round' aria-hidden='true'>
              <path d='M6 6l12 12M18 6L6 18' />
            </svg>
          </button>

          {images.length > 1 && (
            <>
              <button
                type='button'
                onClick={showPrev}
                aria-label='Previous image'
                className={`${buttonClasses} left-3 top-1/2 -translate-y-1/2`}
              >
                <svg width='22' height='22' viewBox='0 0 24 24' fill='none' stroke='currentColor'
                  strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' aria-hidden='true'>
                  <path d='M15 5l-7 7 7 7' />
                </svg>
              </button>
              <button
                type='button'
                onClick={showNext}
                aria-label='Next image'
                className={`${buttonClasses} right-3 top-1/2 -translate-y-1/2`}
              >
                <svg width='22' height='22' viewBox='0 0 24 24' fill='none' stroke='currentColor'
                  strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' aria-hidden='true'>
                  <path d='M9 5l7 7-7 7' />
                </svg>
              </button>
            </>
          )}
        </>
      )}
    </dialog>
  );
};

export default ImageLightbox;
