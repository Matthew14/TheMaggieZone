import maggie from "../../public/Images/maggie.jpeg";
import Image from "next/image";
const Page: React.FC = () => {
  return (
    <div>
      <h1 className="text-5xl text-white flex text-center">
        Welcome to the Maggie Zone
      </h1>
      <Image
        className="rounded-full border border-spacing-5 flex drop-shadow-lg mx-auto mt-10"
        src={maggie}
        alt="a dog"
      />
    </div>
  );
};

export default Page;
