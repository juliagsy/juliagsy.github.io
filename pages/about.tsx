import Head from "next/head";
import Profile from "@/components/about/profile";
import Photo from "@/components/about/photo";
import data from "@/components/data.json";
import Tech from "@/components/about/tech";
import Language from "@/components/about/language";
import Cert from "@/components/about/cert";

export default function About() {
    return (
        <div className="my-[8%]">
            <div className="text-5xl px-[3%] pt-[2%]">About</div>
            <Head>
                <title>{`${data.name} - About`}</title>
            </Head>
            <div className="grid grid-cols-4 p-[2%]">
                <div className="col-span-1"><Photo /></div>
                <div className="col-span-3"><Profile /></div>
            </div>
            <div className="grid grid-cols-3 px-[2%]">
                <div className="px-[2%]">
                    <p className="text-2xl py-[1%] font-bold">Tech Stack</p>
                    <Tech />
                </div>
                <div className="px-[2%]">
                    <p className="text-2xl py-[1%] font-bold">Languages</p>
                    <Language />
                </div>
                <div className="px-[2%]">
                    <p className="text-2xl py-[1%] font-bold">Certifications</p>
                    <Cert />
                </div>
            </div>
        </div>
    )
}