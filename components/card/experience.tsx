import styles from '@/components/card/card.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';


export default function Experience({ item }) { 
    return (
        <div className={styles.card}>
            <div className={styles.cardTitle}>
                {item[1]}
            </div>

            <div className={styles.cardDesc}>
                <p><FontAwesomeIcon icon={"fa-solid fa-calendar-days" as IconProp} /> {item[0]}</p>
                <p><FontAwesomeIcon icon={"fa-solid fa-briefcase" as IconProp} /> <a href={item[3]} target="_blank">{item[2]}</a></p>
            </div>
            
            <div className={styles.cardPartition}></div>
            <ul>
                {
                    item[4].slice(0, item[4].length - 1).map((desc) => (
                        <li key={desc}> {
                            Array.isArray(desc) 
                            ? <p className='customLink'><FontAwesomeIcon icon={"fa-solid fa-chevron-right" as IconProp} /> <a className="underline hover:text-violet-700" href={desc[0]}>{desc[1]}</a>: {desc[2]}</p>
                            : <p><FontAwesomeIcon icon={"fa-solid fa-chevron-right" as IconProp} /> {desc}</p>
                        }</li>
                    ))
                }
                {
                    <li className='font-bold'><FontAwesomeIcon icon={"fa-solid fa-chevron-right" as IconProp} /> {
                        item[4][item[4].length - 1]
                    }
                    </li>
                }
            </ul>
        </div>
    )
}