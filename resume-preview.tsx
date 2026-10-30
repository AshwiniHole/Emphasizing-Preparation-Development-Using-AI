import React from "react";
import { ResumeData } from "@/types";
import { Mail, Phone, Linkedin, Link as LinkIcon, MapPin } from "lucide-react";

interface ResumePreviewProps {
    data: ResumeData;
    innerRef?: React.Ref<HTMLDivElement>;
}

export const ResumePreview: React.FC<ResumePreviewProps> = ({ data, innerRef }) => {
    return (
        <div
            ref={innerRef}
            className="bg-white p-10 w-full max-w-[210mm] min-h-[297mm] mx-auto shadow-sm text-neutral-800 font-serif break-words print:shadow-none print:p-8"
            style={{ boxSizing: "border-box" }}
        >
            {/* Header / Contact Info */}
            <header className="mb-8 flex items-center">
                {/* Photo Placeholder */}
                <div className="w-28 h-28 rounded-full bg-neutral-200 flex-shrink-0 flex items-center justify-center text-neutral-400 mr-8 overflow-hidden border border-neutral-300">
                    {data.photoUrl ? (
                        <img src={data.photoUrl} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                        <span className="text-4xl font-bold">
                            {data.firstName?.charAt(0)}{data.lastName?.charAt(0)}
                        </span>
                    )}
                </div>

                <div className="flex flex-col">
                    <h1 className="text-[40px] font-extrabold tracking-tight text-neutral-900 leading-none mb-2">
                        {data.firstName} {data.lastName}
                    </h1>

                    <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-2 text-[13px] text-neutral-700">
                        {data.location && (
                            <div className="flex items-center gap-1.5 break-all">
                                <MapPin className="w-3.5 h-3.5 shrink-0" />
                                <span>{data.location}</span>
                            </div>
                        )}
                        {data.email && (
                            <div className="flex items-center gap-1.5 break-all">
                                <Mail className="w-3.5 h-3.5 shrink-0" />
                                <span>{data.email}</span>
                            </div>
                        )}
                        {data.phone && (
                            <div className="flex items-center gap-1.5 break-all">
                                <Phone className="w-3.5 h-3.5 shrink-0" />
                                <span>{data.countryCode ? `${data.countryCode} ` : ''}{data.phone}</span>
                            </div>
                        )}
                        {data.linkedin && (
                            <div className="flex items-center gap-1.5 break-all">
                                <Linkedin className="w-3.5 h-3.5 shrink-0" />
                                <span>{data.linkedin.replace(/^https?:\/\/(www\.)?/, '')}</span>
                            </div>
                        )}
                        {data.github && (
                            <div className="flex items-center gap-1.5 break-all">
                                <LinkIcon className="w-3.5 h-3.5 shrink-0" />
                                <span>{data.github.replace(/^https?:\/\/(www\.)?/, '')}</span>
                            </div>
                        )}
                        {data.portfolio && (
                            <div className="flex items-center gap-1.5 break-all">
                                <LinkIcon className="w-3.5 h-3.5 shrink-0" />
                                <span>{data.portfolio.replace(/^https?:\/\/(www\.)?/, '')}</span>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            {/* Professional Summary */}
            {data.summary && (
                <section className="mb-6">
                    <h2 className="bg-neutral-100 text-center py-1.5 mb-4 font-bold text-neutral-900 text-[15px]">
                        Profile
                    </h2>
                    <p className="text-[14px] leading-relaxed text-neutral-700">{data.summary}</p>
                </section>
            )}

            {/* Career Objective */}
            {data.objective && (
                <section className="mb-6">
                    <h2 className="bg-neutral-100 text-center py-1.5 mb-4 font-bold text-neutral-900 text-[15px]">
                        Career Objective
                    </h2>
                    <p className="text-[14px] leading-relaxed text-neutral-700">{data.objective}</p>
                </section>
            )}

            {/* Experience */}
            {data.experience.length > 0 && (
                <section className="mb-6">
                    <h2 className="bg-neutral-100 text-center py-1.5 mb-4 font-bold text-neutral-900 text-[15px]">
                        Work Experience
                    </h2>
                    <div className="flex flex-col gap-5">
                        {data.experience.map((exp) => (
                            <div key={exp.id} className="flex flex-row">
                                <div className="w-1/4 pr-4 flex flex-col pt-0.5">
                                    <span className="text-[13px] text-neutral-600">
                                        {exp.startDate} – {exp.endDate}
                                    </span>
                                </div>
                                <div className="w-3/4">
                                    <h3 className="text-[15px] font-bold text-neutral-900">{exp.company}</h3>
                                    <div className="text-[14px] text-neutral-600 mb-2">{exp.role}</div>
                                    <div className="text-[13.5px] leading-relaxed text-neutral-700">
                                        {exp.description && exp.description.split('\n').filter(line => line.trim()).length > 1 ? (
                                            <ul className="list-disc pl-5 space-y-1">
                                                {exp.description.split('\n').filter(line => line.trim()).map((line, i) => (
                                                    <li key={i}>{line.replace(/^- /, '').trim()}</li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <p className="whitespace-pre-wrap">{exp.description}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Projects */}
            {data.projects.length > 0 && (
                <section className="mb-6">
                    <h2 className="bg-neutral-100 text-center py-1.5 mb-4 font-bold text-neutral-900 text-[15px]">
                        Projects
                    </h2>
                    <div className="flex flex-col gap-5">
                        {data.projects.map((proj) => (
                            <div key={proj.id} className="flex flex-row">
                                <div className="w-1/4 pr-4 flex flex-col pt-0.5 text-[13px] text-neutral-600 break-all">
                                    {proj.link && (
                                        <span>
                                            {proj.link.replace(/^https?:\/\/(www\.)?/, '')}
                                        </span>
                                    )}
                                </div>
                                <div className="w-3/4">
                                    <h3 className="text-[15px] font-bold text-neutral-900">{proj.name}</h3>
                                    <div className="text-[13.5px] leading-relaxed text-neutral-700 mt-2">
                                        {proj.description && proj.description.split('\n').filter(line => line.trim()).length > 1 ? (
                                            <ul className="list-disc pl-5 space-y-1">
                                                {proj.description.split('\n').filter(line => line.trim()).map((line, i) => (
                                                    <li key={i}>{line.replace(/^- /, '').trim()}</li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <p className="whitespace-pre-wrap">{proj.description}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Education */}
            {data.education.length > 0 && (
                <section className="mb-6">
                    <h2 className="bg-neutral-100 text-center py-1.5 mb-4 font-bold text-neutral-900 text-[15px]">
                        Education
                    </h2>
                    <div className="flex flex-col gap-4">
                        {data.education.map((edu) => (
                            <div key={edu.id} className="flex flex-row">
                                <div className="w-1/4 pr-4 pt-0.5">
                                    <span className="text-[13px] text-neutral-600">
                                        {edu.startDate} – {edu.endDate}
                                    </span>
                                </div>
                                <div className="w-3/4">
                                    <h3 className="text-[15px] font-bold text-neutral-900">
                                        {edu.degree} {edu.fieldOfStudy ? ` - ${edu.fieldOfStudy}` : ""}
                                    </h3>
                                    <p className="text-[14px] text-neutral-700 mt-0.5">
                                        {edu.school}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Skills */}
            {data.skills.length > 0 && (
                <section className="mb-6">
                    <h2 className="bg-neutral-100 text-center py-1.5 mb-4 font-bold text-neutral-900 text-[15px]">
                        Skills
                    </h2>
                    <div className="grid grid-cols-3 gap-x-4 gap-y-2 text-[13.5px] text-neutral-700">
                        {data.skills.map((skill) => (
                            <div key={skill.id} className="flex items-start">
                                <span className="mr-2 mt-1.5 block w-1 h-1 bg-neutral-800 rounded-full shrink-0"></span>
                                <span>
                                    <span className="font-semibold text-neutral-900">{skill.name}</span>
                                    {skill.level && <span className="text-neutral-600"> – {skill.level}</span>}
                                </span>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Certifications */}
            {data.certifications && data.certifications.length > 0 && (
                <section className="mb-6">
                    <h2 className="bg-neutral-100 text-center py-1.5 mb-4 font-bold text-neutral-900 text-[15px]">
                        Certifications
                    </h2>
                    <div className="flex flex-col gap-4">
                        {data.certifications.map((cert) => (
                            <div key={cert.id} className="flex flex-row">
                                <div className="w-1/4 pr-4 flex flex-col pt-0.5"></div>
                                <div className="w-3/4">
                                    <h3 className="text-[15px] font-bold text-neutral-900">
                                        {cert.name}
                                    </h3>
                                    <div className="text-[14px] text-neutral-700 mt-0.5 flex justify-between items-center">
                                        <span>{cert.issuer}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Languages */}
            {data.languages && data.languages.length > 0 && (
                <section className="mb-6">
                    <h2 className="bg-neutral-100 text-center py-1.5 mb-4 font-bold text-neutral-900 text-[15px]">
                        Languages
                    </h2>
                    <div className="grid grid-cols-3 gap-x-4 gap-y-2 text-[13.5px] text-neutral-700">
                        {data.languages.map((lang) => (
                            <div key={lang.id} className="flex items-start">
                                <span className="mr-2 mt-1.5 block w-1 h-1 bg-neutral-800 rounded-full shrink-0"></span>
                                <span>
                                    <span className="font-semibold text-neutral-900">{lang.name}</span>
                                    {lang.proficiency && <span className="text-neutral-600"> – {lang.proficiency}</span>}
                                </span>
                            </div>
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
};
