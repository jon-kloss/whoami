import { getAllPosts } from "@/lib/posts";
import { getCuratedProjects, getGitHubRepos } from "@/lib/projects";
import { getResumeData } from "@/lib/resume";
import { formatDate } from "@/lib/format";
import { ScrollReveal, StaggerItem } from "@/components/ScrollReveal";
import { ContactForm } from "@/components/ContactForm";
import { DotNav } from "@/components/DotNav";
import { PostList } from "@/components/PostList";
import Link from "next/link";
import styles from "./home.module.css";

export default async function Home() {
  const posts = getAllPosts();
  const projects = getCuratedProjects();
  const repos = await getGitHubRepos();
  const { experience, education, skills } = getResumeData();
  const featured = posts.find((p) => p.featured);
  const recentPosts = posts.filter((p) => !p.featured);

  return (
    <>
      <DotNav />

      {/* Hero */}
      <section id="hero" className={styles.hero}>
        <h1 className={styles.heroName}>Jon Kloss</h1>
        <p className={styles.heroTagline}>
          Software engineer building AI tooling, agents, and workflows
          &mdash; plus indie games and developer tools along the way.
        </p>
        <div className={styles.heroCtas}>
          <a href="#contact" className="btnPrimary">
            Get in Touch
          </a>
          <a href="#projects" className="btnSecondary">
            View Projects
          </a>
        </div>
      </section>

      {/* About */}
      <section id="about" className="section">
        <div className="sectionInner">
          <ScrollReveal animation="fade-up">
            <span className="sectionLabel">About</span>
            <h2 className="sectionHeading">
              About <em>Me</em>
            </h2>
          </ScrollReveal>

          <div className={styles.bioHeader}>
            <ScrollReveal animation="fade-right">
              <div className={styles.bio}>
                <p>
                  Hey, I&rsquo;m Jon &mdash; a software engineer with about a decade of
                  experience building across the full stack. By day I ship production
                  software; by night I&rsquo;m usually tinkering on side projects just
                  because they sound fun.
                </p>
                <p>
                  Right now I&rsquo;m especially drawn to <strong>AI tooling</strong> and{" "}
                  <strong>indie games</strong>. I love making tools that help other
                  developers move faster, and I&rsquo;ll pick up whatever language or
                  framework the problem calls for.
                </p>
                <p>
                  Outside of code, you&rsquo;ll find me camping, gaming, or hanging
                  out with my dog.
                </p>
              </div>
            </ScrollReveal>
            <ScrollReveal animation="fade-left" delay={200}>
              <img
                src="/whoami/images/headshot.jpg"
                alt="Jon Kloss"
                className={styles.headshot}
              />
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Experience */}
      <section id="experience" className="section sectionSurface">
        <div className="sectionInner">
          <ScrollReveal animation="fade-up">
            <span className="sectionLabel">Experience</span>
            <h2 className="sectionHeading">
              Where I&rsquo;ve <em>Worked</em>
            </h2>
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
                <h3 className={styles.subheading}>Education</h3>
              </ScrollReveal>
              {education.map((edu) => (
                <ScrollReveal key={edu.institution} animation="fade-up" delay={100}>
                  <div className={styles.educationEntry}>
                    <span className={styles.educationName}>{edu.institution}</span>
                    <span className={styles.educationDates}>
                      {edu.startDate} &ndash; {edu.endDate}
                    </span>
                  </div>
                </ScrollReveal>
              ))}
            </>
          )}

          <ScrollReveal animation="fade-up">
            <h3 className={styles.subheading}>Skills</h3>
          </ScrollReveal>
          <ScrollReveal animation="fade-up" stagger>
            <div className={styles.skills}>
              {skills.map((skill) => (
                <StaggerItem key={skill}>
                  <span className="tag">{skill}</span>
                </StaggerItem>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Projects */}
      <section id="projects" className="section">
        <div className="sectionInner">
          <ScrollReveal animation="fade-up">
            <span className="sectionLabel">Projects</span>
            <h2 className="sectionHeading">
              Things I&rsquo;ve <em>Built</em>
            </h2>
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
                      <h3 className={styles.projectTitle}>{project.title}</h3>
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
      </section>

      {/* Writing */}
      <section id="writing" className="section sectionSurface">
        <div className="sectionInner">
          <ScrollReveal animation="fade-up">
            <span className="sectionLabel">Blog</span>
            <h2 className="sectionHeading">
              Writing &amp; <em>Thinking</em>
            </h2>
          </ScrollReveal>

          {featured && (
            <ScrollReveal animation="fade-right">
              <article className={styles.featured}>
                <Link href={`/blog/${featured.slug}`}>
                  <time className={styles.date}>{formatDate(featured.date)}</time>
                  <h3 className={styles.featuredTitle}>{featured.title}</h3>
                  <p className={styles.excerpt}>{featured.excerpt}</p>
                </Link>
              </article>
            </ScrollReveal>
          )}

          <ScrollReveal animation="fade-up" delay={100}>
            <PostList posts={recentPosts.map(({ slug, title, date, excerpt }) => ({ slug, title, date, excerpt }))} />
          </ScrollReveal>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="section">
        <div className="sectionInner">
          <div className={styles.contactWrapper}>
            <ScrollReveal animation="fade-up">
              <span className="sectionLabel">Contact</span>
              <h2 className="sectionHeading">
                Get in <em>Touch</em>
              </h2>
              <p className={styles.contactIntro}>
                Have a project in mind or just want to say hello? I&rsquo;d love
                to hear from you.
              </p>
            </ScrollReveal>
            <ScrollReveal animation="fade-up" delay={150}>
              <div className={styles.contactFormWrapper}>
                <ContactForm />
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>
    </>
  );
}
