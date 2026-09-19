import data from "@/components/data.zh.json";
import ResumeSheet from "@/components/resume/sheet";
import { ZH } from "@/components/resume/lang";

export default function ResumeZh() {
    return <ResumeSheet data={data} lang={ZH} />
}
