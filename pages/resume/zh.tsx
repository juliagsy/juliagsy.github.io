import PdfRedirect from "@/components/resume/pdf-redirect";
import { ZH_CV_PDF } from "@/components/resume/paths";

export default function ResumeZh() {
    return (
        <PdfRedirect
            pdf={ZH_CV_PDF}
            title="Julia Goh - 简历"
            linkLabel="Julia Goh - 简历 (PDF)"
        />
    );
}
