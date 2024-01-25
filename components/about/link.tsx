import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import data from "@/components/data.json";
import styles from "@/components/about/about.module.css"


function LinkItem({ item }) {
    return (
        <div className={styles.item}>
            <a href={item[2]} target='_blank'><FontAwesomeIcon icon={item[1]} /></a> 
        </div>
    )
}

export default function Link() {
    return (
        <div className="grid grid-cols-3 gap-5">
            {
                data.contacts.map((item) => (
                    <LinkItem key={item[0]} item={item} />
                ))
            }
        </div>
    )
}