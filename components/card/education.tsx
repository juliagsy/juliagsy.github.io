import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function Education({ item }) { 
    return (
        <div className='border-solid border-[3px] rounded-lg p-[2%]'>
            <div className='relative text-3xl'>
                {item[1]}
            </div>

            <div className='grid grid-cols-1'>
                <p><FontAwesomeIcon icon="fa-solid fa-calendar-days" /> {item[0]}</p>
                <p><FontAwesomeIcon icon="fa-solid fa-building-columns" /> <a className='underline hover:text-gray-300' href={item[4]} target="_blank">{item[2]}</a></p>
            </div>
            
            <div className='h-[2px] my-[1%] bg-gradient-to-r from-purple-400'></div>
            <ul>
                {
                    item[3].map((desc) => (
                        <li><FontAwesomeIcon icon="fa-solid fa-chevron-right" /> {desc}</li>
                    ))
                }
            </ul>
        </div>
    )
}