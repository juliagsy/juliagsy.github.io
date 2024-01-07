import FooterItem from "@/components/footer/item";
import data from "@/components/data.json";

export default function Footer() {
    return (
        <div className="fixed bottom-0 w-[100%] px-[2%] py-[2%] grid grid-cols-4 text-black text-lg text-center bg-white">
            <p className="col-span-1">Contacts:</p>
            <div className="col-span-3 grid grid-cols-3">
                {
                    data.contacts.map((item) => (
                        <FooterItem key={item[0]} item={item} />
                    ))
                }
            </div>
        </div>
    )
}