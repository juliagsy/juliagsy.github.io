import data from "@/components/data.json";
import styles from "@/components/about/about.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconProp } from "@fortawesome/fontawesome-svg-core";


function CertItem({ item }) {
    return (
        <div className={`${styles.item} text-sm md:text-base lg:text-lg`}>
            <FontAwesomeIcon icon={"fa-solid fa-chevron-right" as IconProp} /> <a href={item[1]} target="_blank">{item[0]}</a>
        </div>
    )
}

export default function Cert() {
    return (
        <div className="gap-2">
            {
                data.certifications.map((item) => (
                    <CertItem key={item[0]} item={item} />
                ))
            }
        </div>
    )
}