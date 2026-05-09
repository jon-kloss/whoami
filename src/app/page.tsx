import { getAllPosts } from "@/lib/posts";
import { getCuratedProjects, getGitHubRepos } from "@/lib/projects";
import { formatDate } from "@/lib/format";
import { ScrollReveal } from "@/components/ScrollReveal";
import { ContactForm } from "@/components/ContactForm";
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
          I build tools that disappear into the workflow. Software engineer
          exploring the craft of making things that just work.
        </p>
        <div className={styles.heroCtas}>
          <a href="/contact" className="btnPrimary">
            Get in Touch
          </a>
          <a href="/projects" className="btnSecondary">
            View Projects
          </a>
        </div>
      </section>

      {/* Selected Work */}
      <ScrollReveal>
        <section className="section">
          <div className="sectionInner">
            <span className="sectionLabel">01</span>
            <h2 className="sectionHeading">
              Selected <em>Work</em>
            </h2>

            <div className={styles.projectList}>
              {projects.map((project) => (
                <a
                  key={project.title}
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
              ))}
            </div>

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
      <ScrollReveal>
        <section className="section sectionSurface">
          <div className="sectionInner">
            <span className="sectionLabel">02</span>
            <h2 className="sectionHeading">
              Latest <em>Writing</em>
            </h2>

            {featured && (
              <article className={styles.featured}>
                <a href={`/blog/${featured.slug}`}>
                  <time className={styles.date}>
                    {formatDate(featured.date)}
                  </time>
                  <h3 className={styles.featuredTitle}>{featured.title}</h3>
                  <p className={styles.excerpt}>{featured.excerpt}</p>
                </a>
              </article>
            )}

            <div className={styles.postList}>
              {recentPosts.map((post) => (
                <article key={post.slug} className={styles.postItem}>
                  <a href={`/blog/${post.slug}`}>
                    <time className={styles.date}>
                      {formatDate(post.date)}
                    </time>
                    <h3 className={styles.postTitle}>{post.title}</h3>
                    <p className={styles.excerpt}>{post.excerpt}</p>
                  </a>
                </article>
              ))}
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* Contact */}
      <ScrollReveal>
        <section className="section">
          <div className="sectionInner">
            <div className="prose">
              <span className="sectionLabel">03</span>
              <h2 className="sectionHeading">
                Get in <em>Touch</em>
              </h2>
              <p className={styles.contactIntro}>
                Have a project in mind or just want to say hello? I&rsquo;d love
                to hear from you.
              </p>
              <ContactForm />
            </div>
          </div>
        </section>
      </ScrollReveal>
    </>
  );
}
