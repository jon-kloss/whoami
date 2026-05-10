import { getAllPosts } from "@/lib/posts";
import { getCuratedProjects, getGitHubRepos } from "@/lib/projects";
import { formatDate } from "@/lib/format";
import { ScrollReveal, StaggerItem } from "@/components/ScrollReveal";
import { ContactForm } from "@/components/ContactForm";
import Link from "next/link";
import styles from "./home.module.css";

export default async function Home() {
  const posts = getAllPosts();
  const projects = getCuratedProjects().filter((p) => p.featured);
  const repos = await getGitHubRepos();
  const featured = posts.find((p) => p.featured);
  const recentPosts = posts.filter((p) => !p.featured).slice(0, 3);

  return (
    <>
      {/* Hero */}
      <section className={styles.hero}>
        <h1 className={styles.heroName}>Jon Kloss</h1>
        <p className={styles.heroTagline}>
          Software engineer building AI tooling, agents, and workflows
          &mdash; plus indie games and developer tools along the way.
        </p>
        <div className={styles.heroCtas}>
          <Link href="/contact" className="btnPrimary">
            Get in Touch
          </Link>
          <Link href="/projects" className="btnSecondary">
            View Projects
          </Link>
        </div>
      </section>

      {/* Selected Work */}
      <ScrollReveal animation="fade-up">
        <section className="section">
          <div className="sectionInner">
            <ScrollReveal animation="fade-right">
              <span className="sectionLabel">01</span>
              <h2 className="sectionHeading">
                Selected <em>Work</em>
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
              <div>
                <span
                  className="sectionLabel"
                  style={{ marginTop: "var(--space-xl)", display: "block" }}
                >
                  Open Source
                </span>
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
                        <span className={styles.repoDesc}>
                          {repo.description}
                        </span>
                      )}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      </ScrollReveal>

      {/* Latest Writing */}
      <ScrollReveal animation="fade-up">
        <section className="section sectionSurface">
          <div className="sectionInner">
            <ScrollReveal animation="fade-left">
              <span className="sectionLabel">02</span>
              <h2 className="sectionHeading">
                Latest <em>Writing</em>
              </h2>
            </ScrollReveal>

            {featured && (
              <ScrollReveal animation="fade-up" delay={100}>
                <article className={styles.featured}>
                  <Link href={`/blog/${featured.slug}`}>
                    <time className={styles.date}>
                      {formatDate(featured.date)}
                    </time>
                    <h3 className={styles.featuredTitle}>{featured.title}</h3>
                    <p className={styles.excerpt}>{featured.excerpt}</p>
                  </Link>
                </article>
              </ScrollReveal>
            )}

            <ScrollReveal animation="fade-up" stagger>
              <div className={styles.postList}>
                {recentPosts.map((post) => (
                  <StaggerItem key={post.slug}>
                    <article className={styles.postItem}>
                      <Link href={`/blog/${post.slug}`}>
                        <time className={styles.date}>
                          {formatDate(post.date)}
                        </time>
                        <h3 className={styles.postTitle}>{post.title}</h3>
                        <p className={styles.excerpt}>{post.excerpt}</p>
                      </Link>
                    </article>
                  </StaggerItem>
                ))}
              </div>
            </ScrollReveal>
          </div>
        </section>
      </ScrollReveal>

      {/* Contact */}
      <ScrollReveal animation="scale-in">
        <section className="section">
          <div className="sectionInner">
            <div className={styles.contactWrapper}>
              <ScrollReveal animation="fade-up">
                <span className="sectionLabel">03</span>
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
      </ScrollReveal>
    </>
  );
}
