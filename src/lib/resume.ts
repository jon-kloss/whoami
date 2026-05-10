import fs from "fs";
import path from "path";

export interface Role {
  title: string;
  startDate: string;
  endDate: string;
}

export interface ExperienceEntry {
  company: string;
  type: string;
  startDate: string;
  endDate: string;
  roles: Role[];
}

export interface EducationEntry {
  institution: string;
  startDate: string;
  endDate: string;
}

export interface ResumeData {
  experience: ExperienceEntry[];
  education: EducationEntry[];
  skills: string[];
}

export function getResumeData(): ResumeData {
  const filePath = path.join(process.cwd(), "content/resume.json");
  const data = fs.readFileSync(filePath, "utf8");
  return JSON.parse(data);
}
