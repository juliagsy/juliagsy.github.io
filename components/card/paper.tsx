import styles from '@/components/card/card.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';


function PaperGroup({ item }) {
    return (
        <div className={styles.card}>
            <div className={styles.cardTitle}>
                {item.title}
            </div>

            <div className={styles.cardDesc}>
                <p><FontAwesomeIcon icon={"fa-solid fa-user-group" as IconProp} /> {item.authors}</p>
                <p><FontAwesomeIcon icon={"fa-regular fa-file" as IconProp} /> <a href={item.url} target="_blank">arXiv:{item.id}</a> · <a href={item.pdf} target="_blank">PDF</a></p>
                {
                    item.keywords.length === 0 ? null : <p><FontAwesomeIcon icon={"fa-solid fa-tags" as IconProp} /> {item.keywords.join(", ")}</p>
                }
            </div>

            <div className={styles.cardPartition}></div>
            <p>{item.summary}</p>
        </div>
    )
}


export default function Paper({ item }) { 
    return (
        <div>
            <div id={item.date} className='item-anchor'></div>
            <div className='component-title'>{item.label}</div>
            <div className="component-gallery">
                {
                    item.papers.map((paper) => (
                        <PaperGroup key={paper.id} item={paper} />
                    ))
                }
            </div>
        </div>
    )
}
