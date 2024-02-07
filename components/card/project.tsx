import styles from '@/components/card/card.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';


function ProjectGroup({ item }) { 
    return (
        <div className={styles.card}>
            <div className={styles.cardTitle}>
                {item[0]}
            </div>

            <div className={styles.cardDesc}>
                <p><FontAwesomeIcon icon={"fa-solid fa-calendar-days" as IconProp} /> {item[1]}</p>
                <p><FontAwesomeIcon icon={"fa-regular fa-building" as IconProp} /> <a href={item[3]} target="_blank">{item[2]}</a></p>
                {
                    item[4] === "" ? null : <p><FontAwesomeIcon icon={"fa-regular fa-file" as IconProp} /> <a href={item[4]} target="_blank">View Project</a></p>
                }
            </div>
            
            <div className={styles.cardPartition}></div>
            <ul>
                {
                    item[5].slice(0, item[5].length - 1).map((desc) => (
                        <li key={desc}><FontAwesomeIcon icon={"fa-solid fa-chevron-right" as IconProp} /> {
                            Array.isArray(desc) ? <a href={desc[1]}>{desc[0]}</a> : desc
                        }</li>
                    ))
                }
                {
                    <li className='font-bold'><FontAwesomeIcon icon={"fa-solid fa-chevron-right" as IconProp} /> {
                        item[5][item[5].length - 1]
                    }
                    </li>
                }
            </ul>
        </div>
    )
}


export default function Project({ item }) { 
    return (
        <div>
            <div id={item[0]} className='item-anchor'></div>
            <div className='component-title'>{item[0]}</div>
            <div className="component-gallery">
                {
                    item[1].map((desc) => (
                        <ProjectGroup key={desc[0]} item={desc} />
                    ))
                }
            </div>
        </div>
    )
}