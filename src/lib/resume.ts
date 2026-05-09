import fs from "fs";
import path from "path";

export interface ExperienceEntry {
  title: string;
  company: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface ResumeData {
  experience: ExperienceEntry[];
  skills: string[];
}

export function getResumeData(): ResumeData {
  const filePath = path.join(process.cwd(), "content/resume.json");
  const data = fs.readFileSync(filePath, "utf8");
  return JSON.parse(data);
}
