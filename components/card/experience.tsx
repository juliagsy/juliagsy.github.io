import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from '@/components/card/card.module.css';


export default function Experience({ item }) { 
    return (
        <div className={styles.card}>
            <div className={styles.cardTitle}>
                {item[1]}
            </div>

            <div className={styles.cardDesc}>
                <p><FontAwesomeIcon icon="fa-solid fa-calendar-days" /> {item[0]}</p>
                <p><FontAwesomeIcon icon="fa-solid fa-briefcase" /> <a href={item[3]} target="_blank">{item[2]}</a></p>
            </div>
            
            <div className={styles.cardPartition}></div>
            {/* <ul>
                {
                    item[4].map((desc) => (
                        <li key={desc}><FontAwesomeIcon icon="fa-solid fa-chevron-right" /> {
                            Array.isArray(desc) ? <a href={desc[1]}>{desc[0]}</a> : desc
                        }</li>
                    ))
                }
            </ul> */}
        </div>
    )
}