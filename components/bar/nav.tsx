import data from "@/components/data.json";
import styles from "@/components/bar/bar.module.css";


function NavBarItem({ item }) {
    return (
        <div className="mx-[3%] my-[3%]">
            <a className='' href={item[1]}>{item[0]}</a>
        </div>
    )
}

export default function NavBar() {
    return (
        <div className={`${styles.bar} top-0`}>
            {
                data.nav.map((item) => (
                    <NavBarItem key={item[0]} item={item} />
                ))
            }
        </div>
    )
}