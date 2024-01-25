import data from "@/components/data.json";
import styles from "@/components/about/about.module.css"


function CertItem({ item }) {
    return (
        <div className={styles.item}>
            <a href={item[1]} target="_blank">{item[0]}</a>
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