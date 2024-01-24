import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function Education({ item }) { 
    return (
        <div className='card'>
            <div className='card-title'>
                {item[1]}
            </div>

            <div className='card-desc'>
                <p><FontAwesomeIcon icon="fa-solid fa-calendar-days" /> {item[0]}</p>
                <p><FontAwesomeIcon icon="fa-solid fa-building-columns" /> <a href={item[4]} target="_blank">{item[2]}</a></p>
            </div>
            
            <div className='card-partition'></div>
            <ul>
                {
                    item[3].map((desc) => (
                        <li><FontAwesomeIcon icon="fa-solid fa-chevron-right" /> {
                            Array.isArray(desc) ? <a href={desc[1]}>{desc[0]}</a> : desc
                        }</li>
                    ))
                }
            </ul>
        </div>
    )
}