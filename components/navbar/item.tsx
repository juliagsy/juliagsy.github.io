export default function NavBarItem({ name, url }) {
    return (
        <div className="mx-[3%] my-[3%] text-black">
            <a href={url}>{name}</a>
        </div>
    )
}