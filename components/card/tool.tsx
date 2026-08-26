import styles from '@/components/card/card.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';


function ToolChips({ chips }) {
    return (
        <div className="grid grid-cols-1">
            {
                chips.map((chip) => (
                    <p key={chip}>{chip}</p>
                ))
            }
        </div>
    )
}


export default function Tool({ item, chips }) { 
    return (
        <a className={styles.cardLink} href={item[1]}>
            <div className={styles.card}>
                <div className={styles.cardTitle}>
                    <FontAwesomeIcon icon={item[2] as IconProp} /> {item[0]}
                </div>

                <div className={styles.cardPartition}></div>
                {
                    chips
                    ? <ToolChips chips={chips} />
                    : <p><FontAwesomeIcon icon={"fa-solid fa-chevron-right" as IconProp} /> {item[3]}</p>
                }
            </div>
        </a>
    )
}
