import { getCuratedProjects, getGitHubRepos } from "@/lib/projects";
import type { Metadata } from "next";
import { ScrollReveal, StaggerItem } from "@/components/ScrollReveal";
import styles from "./projects.module.css";

export const metadata: Metadata = {
  title: "Projects — Jon Kloss",
  description: "Things I've built — curated projects and open source work.",
};

export default async function ProjectsPage() {
  const projects = getCuratedProjects();
  const repos = await getGitHubRepos();

  return (
    <div className="section">
      <div className="sectionInner">
        <ScrollReveal animation="fade-up">
          <span className="sectionLabel">Projects</span>
          <h1 className="sectionHeading">
            Things I&rsquo;ve <em>Built</em>
          </h1>
        </ScrollReveal>

        <ScrollReveal animation="fade-up" stagger>
          <div className={styles.projectList}>
            {projects.map((project) => (
              <StaggerItem key={project.title}>
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.projectItem}
                >
                  <div className={styles.projectInfo}>
                    <h2 className={styles.projectTitle}>{project.title}</h2>
                    <p className={styles.projectDesc}>{project.description}</p>
                    <div className={styles.tags}>
                      {project.tags.map((tag) => (
                        <span key={tag} className="tag">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <span className={styles.arrow} aria-hidden="true">
                    &rarr;
                  </span>
                </a>
              </StaggerItem>
            ))}
          </div>
        </ScrollReveal>

        {repos.length > 0 && (
          <ScrollReveal animation="fade-up" delay={200}>
            <div className={styles.openSource}>
              <span className="sectionLabel">Open Source</span>
              <div className={styles.repoList}>
                {repos.map((repo) => (
                  <a
                    key={repo.full_name}
                    href={repo.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.repoItem}
                  >
                    <span className={styles.repoName}>{repo.name}</span>
                    {repo.description && (
                      <span className={styles.repoDesc}>{repo.description}</span>
                    )}
                  </a>
                ))}
              </div>
            </div>
          </ScrollReveal>
        )}
      </div>
    </div>
  );
}
