import { StaticImageData } from "next/image"

export type imageWithTitle = {
  img: StaticImageData;
  title: string;
};

export type Post = {
    title: string;
    date: Date;
};

