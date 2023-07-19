import { Inter } from "next/font/google";
import Page from "@/components/Page";

const inter = Inter({ subsets: ["latin"] });

const Home: React.FC = () => {
  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}
    >
      <Page />
    </main>
  );
};

export default Home;
