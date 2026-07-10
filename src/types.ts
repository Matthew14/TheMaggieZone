import { StaticImageData } from "next/image"

export type imageWithTitle = {
  img: string;
  title: string;
  width: number;
  height: number;
  blurDataURL: string;
};

export type Post = {
    title: string;
    date: Date;
};

