import { Inter } from "next/font/google";
import maggie from "../../public/Images/maggie.jpeg";
import sadMaggie from "../../public/Images/sad_maggie.jpeg";
import shoe from "../../public/Images/shoe.jpeg";
import stair from "../../public/Images/stair.jpeg";
import toy from "../../public/Images/toy.jpeg";
import seatbelt from "../../public/Images/seatbelt.jpeg";
import slipper from "../../public/Images/slipper.jpeg";
import angry from "../../public/Images/angry.jpeg";

import MaggieImageList from "@/components/MaggieImageList";

const inter = Inter({ subsets: ["latin"] });

const Page: React.FC = () => {
  const imagesData = [
    { title: "Maggie", img: maggie },
    { title: "Sad Maggie", img: sadMaggie },
    { title: "Shoe Maggie", img: shoe },
    { title: "Stair Maggie", img: stair },
    { title: "Toy Maggie", img: toy },
    { title: "Slipper Maggie", img: slipper },
    { title: "Angry Maggie", img: angry },
    { title: "Seatbelt Maggie", img: seatbelt }
  ];

  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}
    >
      <div>
        <div className="flex mx-auto">
          <div className="flex-col text-center">
            <h1 className="text-5xl text-white justify-center text-center">
              Welcome to the Maggie Zone
            </h1>
          </div>
        </div>

        <MaggieImageList images={imagesData} />
      </div>
    </main>
  );
};

export default Page;
