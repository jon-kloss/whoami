import { getResumeData } from "@/lib/resume";
import type { Metadata } from "next";
import styles from "./resume.module.css";

export const metadata: Metadata = {
  title: "Resume — Jon Kloss",
  description: "Professional experience and skills.",
};

export default function ResumePage() {
  const { experience, skills } = getResumeData();

  return (
    <div className="section">
      <div className="sectionInner">
        <div className="prose">
          <div className={styles.header}>
            <div>
              <span className="sectionLabel">Resume</span>
              <h1 className="sectionHeading">
                Experience &amp; <em>Skills</em>
              </h1>
            </div>
            <a href="/resume.pdf" download className="btnSecondary">
              Download PDF
            </a>
          </div>

          <h2 className={styles.subheading}>Experience</h2>
          <div className={styles.entries}>
            {experience.map((entry) => (
              <div key={`${entry.company}-${entry.startDate}`} className={styles.entry}>
                <div className={styles.entryHeader}>
                  <span className={styles.entryTitle}>{entry.title}</span>
                  <span className={styles.entryDates}>
                    {entry.startDate} &ndash; {entry.endDate}
                  </span>
                </div>
                <span className={styles.entryCompany}>{entry.company}</span>
                <p className={styles.entryDesc}>{entry.description}</p>
              </div>
            ))}
          </div>

          <h2 className={styles.subheading}>Skills</h2>
          <div className={styles.skills}>
            {skills.map((skill) => (
              <span key={skill} className="tag">
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
