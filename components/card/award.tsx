import styles from '@/components/card/card.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';


function AwardGroup({ item }) {
    return (
        <div className={styles.card}>
            <div className={styles.cardTitle}>
                {item[1]}
            </div>

            <div className={styles.cardDesc}>
                <p><FontAwesomeIcon icon={"fa-solid fa-calendar-days" as IconProp} /> {item[0]}</p>
                <p><FontAwesomeIcon icon={"fa-solid fa-award" as IconProp} /> <a href={item[4]} target="_blank">{item[2]}</a></p>
            </div>
            
            <div className={styles.cardPartition}></div>
            <ul>
                {
                    item[3].map((desc) => (
                        <li key={desc}><FontAwesomeIcon icon={"fa-solid fa-chevron-right" as IconProp} /> {desc}</li>
                    ))
                }
            </ul>
        </div>
    )
}

export default function Award({ item }) { 
    return (
        <div>
            <div id={item[0]} className='item-anchor'></div>
            <div className='component-title'>{item[0]}</div>
            <div className="component-gallery">
                {
                    item[1].map((desc) => (
                        <AwardGroup key={desc[0]} item={desc} />
                    ))
                }
            </div>
        </div>
    )
}