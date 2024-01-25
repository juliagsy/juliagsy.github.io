import Head from "next/head";
import Profile from "@/components/about/profile";
import Photo from "@/components/about/photo";
import data from "@/components/data.json";
import Tech from "@/components/about/tech";
import Language from "@/components/about/language";
import Cert from "@/components/about/cert";
import styles from '@/components/about/about.module.css';

export default function About() {
    return (
        <div className="content">
            <div className="grid grid-cols-3">
                <div className="main-partition-left"></div>
                <div className="main-title">About</div>
                <div className="main-partition-right"></div>
            </div>
            <Head>
                <title>{`${data.name} - About`}</title>
            </Head>
            <div className="px-[2%]">
                <div className="grid grid-cols-4 py-[3%]">
                    <div className="col-span-1"><Photo /></div>
                    <div className="col-span-3"><Profile /></div>
                </div>
                <div className="grid grid-cols-3">
                    <div>
                        <p className={styles.title}>Tech Stack</p>
                        <Tech />
                    </div>
                    <div>
                        <p className={styles.title}>Languages</p>
                        <Language />
                    </div>
                    <div>
                        <p className={styles.title}>Certifications</p>
                        <Cert />
                    </div>
                </div>
            </div>
        </div>
    )
}