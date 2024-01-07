import Head from "next/head";
import Photo from "@/components/about/photo";
import Profile from "@/components/about/profile";
import data from "@/components/data.json";

export default function Home() {
  return (
    <div className="my-[8%]">
      <Head>
        <title>{`${data.name} - Home`}</title>
      </Head>
      <div className="flex flex-row p-[2%]">
        <Photo />
        <Profile />
      </div>
    </div>
  )
}
