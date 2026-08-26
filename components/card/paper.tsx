import styles from '@/components/card/card.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { useState } from 'react';


const PREVIEW = 240;


function Summary({ text }) {
    const [expanded, setExpanded] = useState(false);

    if (text.length <= PREVIEW) return <p>{text}</p>;

    const cut = text.slice(0, PREVIEW);
    const boundary = cut.lastIndexOf(" ");
    const preview = cut.slice(0, boundary > 0 ? boundary : PREVIEW).replace(/[,;:.]$/, "");

    return (
        <p>
            {expanded ? text : `${preview}...`}{" "}
            <button type="button" className="show-toggle" onClick={() => setExpanded(!expanded)}>
                {expanded ? "show less" : "show more"}
            </button>
        </p>
    )
}


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
                    item.cats.length === 0 ? null : <p><FontAwesomeIcon icon={"fa-solid fa-tags" as IconProp} /> {item.cats.join(", ")}</p>
                }
            </div>

            <div className={styles.cardPartition}></div>
            <Summary text={item.summary} />
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
