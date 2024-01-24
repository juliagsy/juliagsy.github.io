import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function AwardGroup({ item }) {
    return (
        <div className='card'>
            <div className='card-title'>
                {item[1]}
            </div>

            <div className='card-desc'>
                <p><FontAwesomeIcon icon="fa-solid fa-calendar-days" /> {item[0]}</p>
                <p><FontAwesomeIcon icon="fa-solid fa-award" /> <a href={item[4]} target="_blank">{item[2]}</a></p>
            </div>
            
            <div className='card-partition'></div>
            <ul>
                {
                    item[3].map((desc) => (
                        <li key={desc}><FontAwesomeIcon icon="fa-solid fa-chevron-right" /> {desc}</li>
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