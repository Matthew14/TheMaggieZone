import { ImageList, ImageListItem, Modal } from "@mui/material";
import maggie from "../../public/Images/maggie.jpeg";
import sadMaggie from "../../public/Images/sad_maggie.jpeg";
import shoe from "../../public/Images/shoe.jpeg";
import stair from "../../public/Images/stair.jpeg";
import toy from "../../public/Images/toy.jpeg";
import seatbelt from "../../public/Images/seatbelt.jpeg";
import slipper from "../../public/Images/slipper.jpeg";
import angry from "../../public/Images/angry.jpeg";

import Image from "next/image";
import { useState } from "react";
const Page: React.FC = () => {
  const itemData = [
    { title: "Sad Maggie", img: sadMaggie },
    { title: "Shoe Maggie", img: shoe },
    { title: "Stair Maggie", img: stair },
    { title: "Toy Maggie", img: toy },
    { title: "Slipper Maggie", img: slipper },
    { title: "Angry Maggie", img: angry },
    { title: "Seatbelt Maggie", img: seatbelt },
  ];

  const [open, setOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(itemData[0])

  return (
    <>
      <div>
        <div className="flex mx-auto">
          {/* <Image
            className="rounded-full border border-spacing-5 flex drop-shadow-lg mt-10"
            src={maggie}
            alt="a dog"
            width={400}
            height={400}
          /> */}
          <div className="flex-col text-center">
            <h1 className="text-5xl text-white justify-center text-center">
              Welcome to the Maggie Zone
            </h1>
          </div>
        </div>

        <ImageList className="my-10" variant="masonry" cols={3} gap={10}>
          {itemData.map((item) => (
            <ImageListItem
              key={item.img.src}
              onClick={() => {
                setOpen(true)
                setSelectedImage(item)
              }}
            >
              <Image src={item.img} alt={item.title} loading="lazy" />
            </ImageListItem>
          ))}
        </ImageList>
      </div>

      <Modal
        open={open}
        style={{display:'flex',alignItems:'center',justifyContent:'center'}}
        onClose={()=>{setOpen(false)}}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Image src={selectedImage.img} alt={selectedImage.title} />
      </Modal>
    </>
  );
};

export default Page;
