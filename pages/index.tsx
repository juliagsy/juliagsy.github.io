import Head from "next/head";
import Photo from "@/components/about/photo";
import Profile from "@/components/about/profile";
import data from "@/components/data.json";
import Education from "@/components/card/education";
import Experience from "@/components/card/experience";
import Recent from "@/components/card/recent";
import styles from "@/components/about/about.module.css";
import Tech from "@/components/about/tech";
import Language from "@/components/about/language";
import Cert from "@/components/about/cert";
import { Key } from "react";


export default function Home() {
  return (
    <div className="grid grid-cols-1 gap-10 content">
      <Head>
        <title>{`${data.name} - Home`}</title>
      </Head>

      {/* <div className="grid grid-cols-3">
          <div className="main-partition-left"></div>
          <div className="main-title">Summary</div>
          <div className="main-partition-right"></div>
      </div> */}

      <div className="grid grid-cols-4">
        <div className="col-span-1"><Photo /></div>
        <div className="col-span-3"><Profile /></div>
      </div>

      <div className="grid grid-cols-3">
          <div className="main-partition-left"></div>
          <div className="main-title">Recent</div>
          <div className="main-partition-right"></div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        <p className="component-title">Education</p>
        {
          <Education item={data.educations[0]} />
        }

        <p className="component-title">Experiences</p>
        {
          data.experiences.slice(0, 2).map((item) => (
            <Experience key={item[0] as Key} item={item} />
          ))
        }
        
        <p className="component-title">Projects</p>
        {
          <Recent item={data.projects[0][1][0]} />
        }
        {
          <Recent item={data.projects[0][1][1]} />
        }
        {
          <Recent item={data.projects[1][1][0]} />
        }
      </div>

      <div className="grid grid-cols-3">
          <div className="main-partition-left"></div>
          <div className="main-title">Others</div>
          <div className="main-partition-right"></div>
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
  )
}
