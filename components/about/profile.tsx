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
            <div className="flex flex-row gap-3">
                <p><FontAwesomeIcon icon={"fa-solid fa-envelope-open-text" as IconProp} /> Resume/CV: </p>
                <p className={`${style.item}`}><a href="/static/JuliaGoh_CV.pdf" target="_blank">English</a></p>
                {/* <p className={`${style.item}`}><a href="/static/JuliaGoh_CVChi.pdf" target="_blank">Chinese</a></p> */}
            </div>
            <div className="flex flex-row gap-3">
                <p><FontAwesomeIcon icon={"fa-solid fa-envelope-open-text" as IconProp} /> Referral Letters:</p>
                <p className={`${style.item}`}><a href="/static/pdsb_ref.pdf" target="_blank">Petronas</a></p>
                <p className={`${style.item}`}><a href="/static/unify_ref.pdf" target="_blank">Unify</a></p>
                <p className={`${style.item}`}><a href="/static/ucl_ref.pdf" target="_blank">UCL</a></p>
            </div>
        </div>
    )
}