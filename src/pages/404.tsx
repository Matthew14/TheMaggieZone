import Image from "next/image";
import sad_maggie from "../../public/Images/sad_maggie.jpeg";
export default function Custom404() {
  return (
    <div className="flex items-center justify-center">
      <div>
        <h1 className="text-5xl my-10 text-center">404 - Not Found</h1>
        <Image
          className='my-10 rounded-xl'
          src={sad_maggie}
          width={400}
          height={400}
          alt="A sad looking dog"
        />
      </div>
    </div>
  );
}
