import styles from '@/components/card/card.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';


function ToolLinks({ item, chips }) {
    return (
        <div className={styles.cardDesc}>
            {
                chips.map((chip) => (
                    <p key={chip[0]}>
                        <a href={chip[0] === "all" ? item[1] : `${item[1]}#${chip[0]}`}>{chip[1]}</a>
                    </p>
                ))
            }
        </div>
    )
}


export default function Tool({ item, chips }) { 
    return (
        <div className={styles.card}>
            <div className={styles.cardTitle}>
                <FontAwesomeIcon icon={item[2] as IconProp} /> {item[0]}
            </div>

            <div className={styles.cardPartition}></div>
            {
                chips
                ? <ToolLinks item={item} chips={chips} />
                : <p><FontAwesomeIcon icon={"fa-solid fa-chevron-right" as IconProp} /> {item[3]}</p>
            }
        </div>
    )
}
