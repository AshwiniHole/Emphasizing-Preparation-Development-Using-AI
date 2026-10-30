import { FieldValue, Timestamp } from "firebase/firestore";

export interface User {
  id: string;
  name: string;
  email: string;
  imageUrl: string;
  createdAt: Timestamp | FieldValue;
  updateAt: Timestamp | FieldValue;
}

export interface Interview {
  id: string;
  position: string;
  description: string;
  experience: number;
  userId: string;
  techStack: string;
  jobIndustry: string;
  level?: string;
  questions: { question: string; answer: string }[];
  createdAt: Timestamp;
  updateAt: Timestamp;
}

export interface UserAnswer {
  id: string;
  mockIdRef: string;
  question: string;
  correct_ans: string;
  user_ans: string;
  feedback: string;
  rating: number;
  userId: string;
  createdAt: Timestamp;
  updateAt: Timestamp;
  emotion?: string;
  improvementTips?: string;
}

export interface Experience {
  id: string;
  company: string;
  role: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface Education {
  id: string;
  school: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate: string;
}

export interface Skill {
  id: string;
  name: string;
  level: string; // e.g., Beginner, Intermediate, Expert
}

export interface Project {
  id: string;
  name: string;
  description: string;
  link?: string;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
}

export interface Language {
  id: string;
  name: string;
  proficiency: string; // e.g., Native, Fluent, Beginner
}

export interface ResumeData {
  firstName: string;
  lastName: string;
  email: string;
  countryCode?: string;
  phone: string;
  location?: string;
  linkedin?: string;
  github?: string;
  portfolio?: string;
  photoUrl?: string;
  summary: string;
  objective?: string;
  experience: Experience[];
  education: Education[];
  skills: Skill[];
  projects: Project[];
  certifications: Certification[];
  languages: Language[];
  isFresher?: boolean;
}
