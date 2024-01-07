export default function NavBarItem({ item }) {
    return (
        <div className="mx-[3%] my-[3%] text-black">
            <a className='hover:text-indigo-600' href={item[1]}>{item[0]}</a>
        </div>
    )
}