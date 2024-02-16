import data from "@/components/data.json";
import Links from "@/components/about/links";
import style from "@/components/about/about.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconProp } from "@fortawesome/fontawesome-svg-core";

export default function Profile() {
    return (
        <div className="m-[5%]">
            <p className="text-4xl">{data.name}</p>
            <div className="flex flex-row">
                <Links />
            </div>
            <p>{data.about}</p>
            <div className="flex flex-row gap-3">
                <p><FontAwesomeIcon icon={"fa-solid fa-envelope-open-text" as IconProp} /> Reference Letters:</p>
                <p className={`${style.item}`}><a href="/static/unify_ref.pdf" target="_blank">Unify</a></p>
            </div>
        </div>
    )
}