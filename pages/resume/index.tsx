import data from "@/components/data.json";
import ResumeSheet from "@/components/resume/sheet";
import { EN } from "@/components/resume/lang";

export default function Resume() {
    return <ResumeSheet data={data} lang={EN} />
}
