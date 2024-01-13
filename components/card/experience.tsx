import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function Experience({ item }) { 
    return (
        <div className='border-solid border-[3px] rounded-lg p-[2%]'>
            <div className='relative text-3xl'>
                {item[1]}
            </div>

            <div className='grid grid-cols-1'>
                <p><FontAwesomeIcon icon="fa-solid fa-calendar-days" /> {item[0]}</p>
                <p><FontAwesomeIcon icon="fa-solid fa-briefcase" /> <a className='underline hover:text-indigo-300' href={item[3]} target="_blank">{item[2]}</a></p>
            </div>
            
            <div className='h-[2px] my-[1%] bg-gradient-to-r from-purple-400'></div>
            {/* <ul>
                {
                    item[4].map((desc) => (
                        <li><FontAwesomeIcon icon="fa-solid fa-chevron-right" /> {
                            Array.isArray(desc) ? <a className='underline hover:text-indigo-300' href={desc[1]}>{desc[0]}</a> : desc
                        }</li>
                    ))
                }
            </ul> */}
        </div>
    )
}