import PdfRedirect from "@/components/resume/pdf-redirect";
import { EN_CV_PDF } from "@/components/resume/paths";

export default function Resume() {
    return (
        <PdfRedirect
            pdf={EN_CV_PDF}
            title="Julia Goh - Resume"
            linkLabel="Julia Goh - Resume (PDF)"
        />
    );
}
