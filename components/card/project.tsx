import styles from '@/components/card/card.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';


export default function Project({ item }) { 
    return (
        <div className={styles.card}>
            <div className={styles.cardTitle}>
                {item[0]}
            </div>

            <div className={styles.cardDesc}>
                <p><FontAwesomeIcon icon={"fa-solid fa-calendar-days" as IconProp} /> {item[1]}</p>
                <p><FontAwesomeIcon icon={"fa-regular fa-building" as IconProp} /> <a href={item[3]} target="_blank">{item[2]}</a></p>
                <p><FontAwesomeIcon icon={"fa-regular fa-file" as IconProp} /> <a href={item[4]} target="_blank">View Project</a></p>
            </div>
            
            <div className={styles.cardPartition}></div>
            <ul>
                {
                    item[5].map((desc) => (
                        <li key={desc}><FontAwesomeIcon icon={"fa-solid fa-chevron-right" as IconProp} /> {
                            // Array.isArray(desc) ? <a href={desc[1]}>{desc[0]}</a> : desc
                            desc
                        }</li>
                    ))
                }
            </ul>
        </div>
    )
}