import { getResumeData } from "@/lib/resume";
import type { Metadata } from "next";
import { ScrollReveal, StaggerItem } from "@/components/ScrollReveal";
import styles from "./resume.module.css";

export const metadata: Metadata = {
  title: "Resume — Jon Kloss",
  description: "Professional experience and skills.",
};

export default function ResumePage() {
  const { experience, education, skills } = getResumeData();

  return (
    <div className="section">
      <div className="sectionInner">
        <ScrollReveal animation="fade-up">
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
        </ScrollReveal>

        <div className={styles.timeline}>
          {experience.map((entry, i) => (
            <ScrollReveal
              key={entry.company}
              animation={i % 2 === 0 ? "fade-right" : "fade-left"}
              delay={i * 80}
            >
              <div className={styles.timelineItem}>
                <div className={styles.timelineDot} />
                <div className={styles.timelineCard}>
                  <span className={styles.timelineDates}>
                    {entry.startDate} &ndash; {entry.endDate}
                  </span>
                  <h3 className={styles.timelineCompany}>{entry.company}</h3>
                  <span className={styles.timelineType}>{entry.type}</span>
                  <div className={styles.roles}>
                    {entry.roles.map((role) => (
                      <div key={`${role.title}-${role.startDate}`} className={styles.role}>
                        <span className={styles.roleTitle}>{role.title}</span>
                        <span className={styles.roleDates}>
                          {role.startDate} &ndash; {role.endDate}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {education.length > 0 && (
          <>
            <ScrollReveal animation="fade-up">
              <h2 className={styles.subheading}>Education</h2>
            </ScrollReveal>
            {education.map((edu) => (
              <ScrollReveal key={edu.institution} animation="fade-up" delay={100}>
                <div className={styles.educationEntry}>
                  <h3 className={styles.educationName}>{edu.institution}</h3>
                  <span className={styles.educationDates}>
                    {edu.startDate} &ndash; {edu.endDate}
                  </span>
                </div>
              </ScrollReveal>
            ))}
          </>
        )}

        <ScrollReveal animation="fade-up">
          <h2 className={styles.subheading}>Skills</h2>
        </ScrollReveal>
        <ScrollReveal animation="fade-up" stagger>
          <div className={styles.skills}>
            {skills.map((skill) => (
              <StaggerItem key={skill}>
                <span className="tag">
                  {skill}
                </span>
              </StaggerItem>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
}
