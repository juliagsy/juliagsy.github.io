import styles from '@/components/card/card.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';


export default function Education({ item }) { 
    return (
        <div className={styles.card}>
            <div className={styles.cardTitle}>
                {item[1]}
            </div>

            <div className={styles.cardDesc}>
                <p><FontAwesomeIcon icon={"fa-solid fa-calendar-days" as IconProp} /> {item[0]}</p>
                <p><FontAwesomeIcon icon={"fa-solid fa-building-columns" as IconProp} /> <a href={item[4]} target="_blank">{item[2]}</a></p>
                <p><FontAwesomeIcon icon={"fa-solid fa-award" as IconProp} /> {Array.isArray(item[3]) ? <a href={item[3][1]}>{item[3][0]}</a> : item[3]}</p>
            </div>
            
            <div className={styles.cardPartition}></div>
            <ul>
                {
                    item[4].map((desc) => (
                        <li key={desc}><FontAwesomeIcon icon={"fa-solid fa-chevron-right" as IconProp} /> {
                            Array.isArray(desc) ? <a href={desc[1]}>{desc[0]}</a> : desc
                        }</li>
                    ))
                }
            </ul>
        </div>
    )
}