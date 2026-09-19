import Link from "next/link";
import data from "@/components/data.json";
import Links from "@/components/about/links";
import style from "@/components/about/about.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconProp } from "@fortawesome/fontawesome-svg-core";

export default function Profile() {
    return (
        <div className="mx-[5%]">
            <p className="text-2xl md:text-3xl lg:text-4xl">{data.name}</p>
            <div className="flex flex-row">
                <Links />
            </div>
            {/* Below sm the label sits on its own line with the links grouped beneath
                it, rather than everything wrapping as one run — at phone widths that
                stranded the last link alone on a second line. The inner flex keeps the
                links together so they wrap as a group, not one per line. */}
            <div className="flex flex-col sm:flex-row sm:flex-wrap gap-1 sm:gap-3">
                <p><FontAwesomeIcon icon={"fa-solid fa-envelope-open-text" as IconProp} /> Resume/CV: </p>
                <div className="flex flex-row flex-wrap gap-3">
                    <p className={`${style.item}`}><Link href="/resume" target="_blank">English</Link></p>
                    <p className={`${style.item}`}><Link href="/resume/zh" target="_blank">中文</Link></p>
                </div>
            </div>
            <div className="flex flex-col sm:flex-row sm:flex-wrap gap-1 sm:gap-3">
                <p><FontAwesomeIcon icon={"fa-solid fa-envelope-open-text" as IconProp} /> Referrals:</p>
                <div className="flex flex-row flex-wrap gap-3">
                    {
                        data.referrals.map((item) => (
                            <p key={item[0]} className={`${style.item}`}><a href={item[1]} target="_blank">{item[0]}</a></p>
                        ))
                    }
                </div>
            </div>
        </div>
    )
}