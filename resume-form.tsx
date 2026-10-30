import React from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ResumeData } from "@/types";
import { Trash2, Plus } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { countryCodes } from "@/lib/country-codes";

interface ResumeFormProps {
    initialData: ResumeData;
    onChange: (data: ResumeData) => void;
}

export const ResumeForm: React.FC<ResumeFormProps> = ({ initialData, onChange }) => {
    const { control, register, handleSubmit, watch, setValue } = useForm<ResumeData>({
        defaultValues: initialData,
    });

    // Watch for changes to update the live preview
    React.useEffect(() => {
        const subscription = watch((value) => {
            onChange(value as ResumeData);
        });
        return () => subscription.unsubscribe();
    }, [watch, onChange]);

    const { fields: expFields, append: appendExp, remove: removeExp } = useFieldArray({ control, name: "experience" });
    const { fields: eduFields, append: appendEdu, remove: removeEdu } = useFieldArray({ control, name: "education" });
    const { fields: skillFields, append: appendSkill, remove: removeSkill } = useFieldArray({ control, name: "skills" });
    const { fields: projFields, append: appendProj, remove: removeProj } = useFieldArray({ control, name: "projects" });
    const { fields: certFields, append: appendCert, remove: removeCert } = useFieldArray({ control, name: "certifications" });
    const { fields: langFields, append: appendLang, remove: removeLang } = useFieldArray({ control, name: "languages" });

    const onSubmit = (data: ResumeData) => {
        onChange(data);
    };

    return (
        <form onChange={handleSubmit(onSubmit)} className="space-y-8 pb-12">

            {/* Personal Info */}
            <section className="space-y-4">
                <div className="flex items-center justify-between border-b pb-2">
                    <h2 className="text-xl font-bold">Personal Information</h2>
                </div>

                <div className="space-y-2 pb-2">
                    <label className="text-sm font-medium">Profile Photo</label>
                    <div className="flex items-center gap-4">
                        <Input
                            type="file"
                            accept="image/*"
                            className="w-full md:w-1/2"
                            onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                    const reader = new FileReader();
                                    reader.onloadend = () => {
                                        setValue("photoUrl", reader.result as string, { shouldDirty: true, shouldTouch: true });
                                        // Trigger onChange manually right away to update preview
                                        const currentData = watch();
                                        onChange({ ...currentData, photoUrl: reader.result as string });
                                    };
                                    reader.readAsDataURL(file);
                                }
                            }}
                        />
                        <span className="text-xs text-neutral-500">Square images work best. Max 2MB.</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">First Name</label>
                        <Input {...register("firstName")} placeholder="John" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Last Name</label>
                        <Input {...register("lastName")} placeholder="Doe" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Email</label>
                        <Input {...register("email")} type="email" placeholder="john@example.com" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Phone</label>
                        <div className="flex gap-2">
                            <Controller
                                control={control}
                                name="countryCode"
                                render={({ field }) => (
                                    <Select value={field.value} onValueChange={(val) => {
                                        field.onChange(val);
                                        // Trigger complete update for preview
                                        const currentData = watch();
                                        onChange({ ...currentData, countryCode: val });
                                    }}>
                                        <SelectTrigger className="w-[110px] sm:w-[140px]">
                                            <SelectValue placeholder="Code" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {countryCodes.map((c) => (
                                                <SelectItem key={c.country + c.code} value={c.code}>
                                                    {c.code} ({c.country})
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            <Input {...register("phone")} placeholder="234 567 890" className="flex-1" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Location</label>
                        <Input {...register("location")} placeholder="City, Country" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">LinkedIn URL (Optional)</label>
                        <Input {...register("linkedin")} placeholder="linkedin.com/in/johndoe" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">GitHub URL (Optional)</label>
                        <Input {...register("github")} placeholder="github.com/johndoe" />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                        <label className="text-sm font-medium">Portfolio URL (Optional)</label>
                        <Input {...register("portfolio")} placeholder="johndoe.com" />
                    </div>
                </div>
            </section>

            {/* Summary */}
            <section className="space-y-4">
                <h2 className="text-xl font-bold border-b pb-2">Professional Summary</h2>
                <div className="space-y-2">
                    <Textarea
                        {...register("summary")}
                        placeholder="A brief summary of your professional background..."
                        className="h-24"
                    />
                </div>
            </section>

            {/* Career Objective */}
            <section className="space-y-4">
                <h2 className="text-xl font-bold border-b pb-2">Career Objective</h2>
                <div className="space-y-2">
                    <Textarea
                        {...register("objective")}
                        placeholder="A brief sentence or two about your career goals..."
                        className="h-24"
                    />
                </div>
            </section>

            {/* Experience */}
            <section className="space-y-4">
                <div className="flex items-center justify-between border-b pb-2">
                    <div className="flex items-center gap-4">
                        <h2 className="text-xl font-bold">Experience</h2>
                        <label className="flex items-center gap-2 cursor-pointer text-sm bg-neutral-100 px-3 py-1 rounded-full border text-neutral-700 hover:bg-neutral-200 transition-colors">
                            <input
                                type="checkbox"
                                className="w-4 h-4 accent-neutral-900 rounded"
                                {...register("isFresher", {
                                    onChange: (e) => {
                                        if (e.target.checked) {
                                            setValue("experience", [], { shouldDirty: true, shouldTouch: true });
                                            const currentData = watch();
                                            onChange({ ...currentData, isFresher: true, experience: [] });
                                        } else {
                                            const currentData = watch();
                                            onChange({ ...currentData, isFresher: false });
                                        }
                                    }
                                })}
                            />
                            I am a fresher (No experience)
                        </label>
                    </div>
                    {!watch("isFresher") && (
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => appendExp({ id: Date.now().toString(), company: "", role: "", startDate: "", endDate: "", description: "" })}
                        >
                            <Plus className="w-4 h-4 mr-2" /> Add Experience
                        </Button>
                    )}
                </div>
                {!watch("isFresher") && (
                    <div className="space-y-6">
                        {expFields.map((field, index) => (
                            <div key={field.id} className="p-4 border rounded-md relative bg-gray-50/50">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="absolute top-2 right-2 text-red-500 hover:text-red-700 hover:bg-red-50"
                                    onClick={() => removeExp(index)}
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Company</label>
                                        <Input {...register(`experience.${index}.company`)} placeholder="Company Name" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Role</label>
                                        <Input {...register(`experience.${index}.role`)} placeholder="Software Engineer" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Start Date</label>
                                        <Input {...register(`experience.${index}.startDate`)} placeholder="Jan 2020" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">End Date</label>
                                        <Input {...register(`experience.${index}.endDate`)} placeholder="Present" />
                                    </div>
                                    <div className="space-y-2 md:col-span-2">
                                        <label className="text-sm font-medium">Description</label>
                                        <Textarea {...register(`experience.${index}.description`)} placeholder="Describe your responsibilities and achievements..." className="h-24" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* Projects */}
            <section className="space-y-4">
                <div className="flex items-center justify-between border-b pb-2">
                    <h2 className="text-xl font-bold">Projects</h2>
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => appendProj({ id: Date.now().toString(), name: "", description: "", link: "" })}
                    >
                        <Plus className="w-4 h-4 mr-2" /> Add Project
                    </Button>
                </div>
                <div className="space-y-4">
                    {projFields.map((field, index) => (
                        <div key={field.id} className="p-4 border rounded-md relative bg-gray-50/50">
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="absolute top-2 right-2 text-red-500 hover:text-red-700 hover:bg-red-50"
                                onClick={() => removeProj(index)}
                            >
                                <Trash2 className="w-4 h-4" />
                            </Button>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                                <div className="space-y-2 md:col-span-1">
                                    <label className="text-sm font-medium">Project Name</label>
                                    <Input {...register(`projects.${index}.name`)} placeholder="Project Name" />
                                </div>
                                <div className="space-y-2 md:col-span-1">
                                    <label className="text-sm font-medium">Project Link</label>
                                    <Input {...register(`projects.${index}.link`)} placeholder="https://..." />
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-sm font-medium">Description</label>
                                    <Textarea {...register(`projects.${index}.description`)} placeholder="Project description..." className="h-20" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Education */}
            <section className="space-y-4">
                <div className="flex items-center justify-between border-b pb-2">
                    <h2 className="text-xl font-bold">Education</h2>
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => appendEdu({ id: Date.now().toString(), school: "", degree: "", fieldOfStudy: "", startDate: "", endDate: "" })}
                    >
                        <Plus className="w-4 h-4 mr-2" /> Add Education
                    </Button>
                </div>
                <div className="space-y-4">
                    {eduFields.map((field, index) => (
                        <div key={field.id} className="p-4 border rounded-md relative bg-gray-50/50">
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="absolute top-2 right-2 text-red-500 hover:text-red-700 hover:bg-red-50"
                                onClick={() => removeEdu(index)}
                            >
                                <Trash2 className="w-4 h-4" />
                            </Button>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-sm font-medium">School / University</label>
                                    <Input {...register(`education.${index}.school`)} placeholder="University Name" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Degree</label>
                                    <Input {...register(`education.${index}.degree`)} placeholder="Bachelor of Science" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Field of Study</label>
                                    <Input {...register(`education.${index}.fieldOfStudy`)} placeholder="Computer Science" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Start Date</label>
                                    <Input {...register(`education.${index}.startDate`)} placeholder="Sep 2018" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">End Date</label>
                                    <Input {...register(`education.${index}.endDate`)} placeholder="May 2022" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Skills */}
            <section className="space-y-4">
                <div className="flex items-center justify-between border-b pb-2">
                    <h2 className="text-xl font-bold">Skills</h2>
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => appendSkill({ id: Date.now().toString(), name: "", level: "" })}
                    >
                        <Plus className="w-4 h-4 mr-2" /> Add Skill
                    </Button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {skillFields.map((field, index) => (
                        <div key={field.id} className="p-3 border rounded-md relative flex items-center gap-2 bg-gray-50/50">
                            <div className="flex-1 space-y-2">
                                <Input {...register(`skills.${index}.name`)} placeholder="Skill (e.g. React)" className="h-8" />
                                <Input {...register(`skills.${index}.level`)} placeholder="Level (e.g. Expert)" className="h-8" />
                            </div>
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="text-red-500 hover:text-red-700 hover:bg-red-50 shrink-0"
                                onClick={() => removeSkill(index)}
                            >
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </div>
                    ))}
                </div>
            </section>

            {/* Certifications */}
            <section className="space-y-4">
                <div className="flex items-center justify-between border-b pb-2">
                    <h2 className="text-xl font-bold">Certifications (Optional)</h2>
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => appendCert({ id: Date.now().toString(), name: "", issuer: "" })}
                    >
                        <Plus className="w-4 h-4 mr-2" /> Add Certification
                    </Button>
                </div>
                <div className="space-y-4">
                    {certFields.map((field, index) => (
                        <div key={field.id} className="p-4 border rounded-md relative bg-gray-50/50">
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="absolute top-2 right-2 text-red-500 hover:text-red-700 hover:bg-red-50"
                                onClick={() => removeCert(index)}
                            >
                                <Trash2 className="w-4 h-4" />
                            </Button>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                                <div className="space-y-2 md:col-span-1">
                                    <label className="text-sm font-medium">Certification Name</label>
                                    <Input {...register(`certifications.${index}.name`)} placeholder="AWS Certified Developer" />
                                </div>
                                <div className="space-y-2 md:col-span-1">
                                    <label className="text-sm font-medium">Issuer</label>
                                    <Input {...register(`certifications.${index}.issuer`)} placeholder="Amazon Web Services" />
                                </div>

                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Languages */}
            <section className="space-y-4">
                <div className="flex items-center justify-between border-b pb-2">
                    <h2 className="text-xl font-bold">Languages (Optional)</h2>
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => appendLang({ id: Date.now().toString(), name: "", proficiency: "" })}
                    >
                        <Plus className="w-4 h-4 mr-2" /> Add Language
                    </Button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {langFields.map((field, index) => (
                        <div key={field.id} className="p-3 border rounded-md relative flex items-center gap-2 bg-gray-50/50">
                            <div className="flex-1 space-y-2">
                                <Input {...register(`languages.${index}.name`)} placeholder="Language (e.g. English)" className="h-8" />
                                <Input {...register(`languages.${index}.proficiency`)} placeholder="Proficiency (e.g. Native)" className="h-8" />
                            </div>
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="text-red-500 hover:text-red-700 hover:bg-red-50 shrink-0"
                                onClick={() => removeLang(index)}
                            >
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </div>
                    ))}
                </div>
            </section>

        </form>
    );
};
