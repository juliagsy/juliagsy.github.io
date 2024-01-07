import NavBarItem from "@/components/navbar/item";
import data from "@/components/data.json";

export default function NavBar() {
    return (
        <div className="fixed top-0 w-[100%] flex flex-row justify-center bg-white">
            {
                data.nav.map((item) => (
                    <NavBarItem key={item[0]} item={item} />
                ))
            }
        </div>
    )
}