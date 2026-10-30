import { useState, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { ResumeForm } from "@/components/resume/resume-form";
import { ResumePreview } from "@/components/resume/resume-preview";
import { ResumeData } from "@/types";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";

const initialResumeData: ResumeData = {
    firstName: "",
    lastName: "",
    email: "",
    countryCode: "+91",
    phone: "",
    location: "",
    linkedin: "",
    github: "",
    portfolio: "",
    summary: "",
    objective: "",
    experience: [],
    education: [],
    skills: [],
    projects: [],
    certifications: [],
    languages: [],
    isFresher: false,
};

export const ResumeBuilder = () => {
    const [resumeData, setResumeData] = useState<ResumeData>(initialResumeData);
    const printRef = useRef<HTMLDivElement>(null);

    const handlePrint = useReactToPrint({
        contentRef: printRef,
        documentTitle: `${resumeData.firstName || "My"}_${resumeData.lastName || "Resume"}`,
    });

    return (
        <div className="flex flex-col lg:flex-row gap-8 w-full h-[calc(100vh-100px)]">
            {/* Left side: Form */}
            <div className="flex-1 overflow-y-auto pr-4 custom-scrollbar">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-3xl font-bold">Resume Builder</h1>
                    <Button onClick={() => handlePrint()} className="flex items-center gap-2">
                        <Printer className="w-4 h-4" /> Download PDF
                    </Button>
                </div>
                <p className="text-muted-foreground mb-6">
                    Fill in your details below to instantly generate a professional, ATS-friendly resume.
                </p>

                <ResumeForm initialData={resumeData} onChange={setResumeData} />
            </div>

            {/* Right side: Live Preview */}
            <div className="flex-1 bg-gray-100/50 rounded-xl border p-4 overflow-y-auto custom-scrollbar flex justify-center items-start">
                <div className="scale-[0.85] origin-top md:scale-95 xl:scale-100 transition-transform">
                    {/* We pass innerRef so useReactToPrint can target this specific element */}
                    <ResumePreview data={resumeData} innerRef={printRef} />
                </div>
            </div>
        </div>
    );
};
