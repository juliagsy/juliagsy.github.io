// "September 2020 - June 2024" -> "September '20 – June '24", as the PDF has it.
const shortDate = (text) => String(text)
    .replace(/\b\d{2}(\d{2})\b/g, "'$1")
    .replace(/\s+-\s+/g, " – ");

const MONTHS = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
];

// "September 2020 - June 2024" -> "09/2020 – 06/2024", the numeric form the
// Chinese CV uses. Anything unrecognised is passed through untouched.
const numericDate = (text) => String(text)
    .split(/\s+-\s+/)
    .map((part) => {
        const side = part.trim();
        if (side === "Present") return "至今";
        const match = side.match(/^([A-Za-z]+)\s+(\d{4})$/);
        if (!match) return side;
        const month = MONTHS.indexOf(match[1]);
        if (month < 0) return side;
        return `${String(month + 1).padStart(2, "0")}/${match[2]}`;
    })
    .join(" – ");

export const EN = {
    // Left unset: the document is already served as English, so an explicit
    // lang="en" here would only add a redundant attribute.
    htmlLang: undefined,
    sheetClass: "resume",
    cjk: false,
    date: shortDate,
    title: (name: string) => `${name} - Resume`,
    print: "Save as PDF",
    referrals: "Referrals: ",
    grade: "Grade",
    colon: ": ",
    sections: {
        education: "Education",
        experiences: "Experiences",
        research: "Research",
    },
};

// Punctuation follows the 2024 CV: a full-width colon after a Chinese label, an
// ASCII ": " after an English one (the Tech Stack and product-name bullets).
export const ZH = {
    htmlLang: "zh-CN",
    sheetClass: "resume resume-zh",
    cjk: true,
    date: numericDate,
    title: (name: string) => `${name} - 简历`,
    print: "保存为 PDF",
    referrals: "推荐：",
    grade: "成绩",
    colon: "：",
    sections: {
        education: "教育",
        experiences: "经验",
        research: "研究",
    },
};
