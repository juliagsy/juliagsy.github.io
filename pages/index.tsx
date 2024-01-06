import Head from "next/head";
import Photo from "../components/profile/photo";
import Profile from "../components/profile/profile";
import NavBar from "../components/navbar/bar";
import Footer from "@/components/footer/footer";
import data from "@/components/data.json";

export default function Home() {
  return (
    <div className="mt-[8%]">
      <Head>
        <title>{data.name} - Home</title>
      </Head>
      <NavBar />
      <div className="flex flex-row p-[2%]">
        <Photo />
        <Profile />
      </div>
        <Footer />
    </div>
  )
}
