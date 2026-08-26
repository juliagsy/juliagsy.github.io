import styles from '@/components/card/card.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';


export default function Tool({ item }) { 
    return (
        <a className={styles.cardLink} href={item[1]}>
            <div className={styles.card}>
                <div className={styles.cardTitle}>
                    <FontAwesomeIcon icon={item[2] as IconProp} /> {item[0]}
                </div>

                <div className={styles.cardPartition}></div>
                <p><FontAwesomeIcon icon={"fa-solid fa-chevron-right" as IconProp} /> {item[3]}</p>
            </div>
        </a>
    )
}
