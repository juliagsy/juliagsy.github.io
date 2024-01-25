import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import data from "@/components/data.json";
import styles from "@/components/bar/bar.module.css";


function FooterItem({ item }) {
    return (
        <div className={`${styles.item} px-[1%]`}>
            <a href={item[2]} target='_blank'><FontAwesomeIcon icon={item[1]} /> {item[0]}</a> 
        </div>
    )
}

export default function Footer() {
    return (
        <div className={`${styles.bar} bottom-0 p-[2%] gap-2`}>
                <p>Contacts:</p>
                {
                    data.contacts.map((item) => (
                        <FooterItem key={item[0]} item={item} />
                    ))
                }
        </div>
    )
}