import type { Metadata } from "next";
import { ScrollReveal, StaggerItem } from "@/components/ScrollReveal";
import styles from "./about.module.css";

export const metadata: Metadata = {
  title: "About — Jon Kloss",
  description:
    "Full-time engineer, indie builder. A decade of shipping software across AI tooling, games, and the full stack.",
};

export default function AboutPage() {
  return (
    <div className="section">
      <div className="sectionInner">
        <ScrollReveal animation="fade-up">
          <span className="sectionLabel">About</span>
          <h1 className="sectionHeading">
            About <em>Me</em>
          </h1>
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

        <ScrollReveal animation="fade-up">
          <h2 className={styles.subheading}>What I Work With</h2>
        </ScrollReveal>
        <ScrollReveal animation="fade-up" stagger>
          <div className={styles.techGrid}>
            <StaggerItem>
              <h3 className={styles.techCategory}>Languages</h3>
              <p className={styles.techList}>Rust, TypeScript, C#, GDScript, Python, C</p>
            </StaggerItem>
            <StaggerItem>
              <h3 className={styles.techCategory}>Frontend</h3>
              <p className={styles.techList}>React, Next.js, React Native, Tauri</p>
            </StaggerItem>
            <StaggerItem>
              <h3 className={styles.techCategory}>Backend</h3>
              <p className={styles.techList}>Node.js, .NET, Fastify, Express, PostgreSQL, Redis</p>
            </StaggerItem>
            <StaggerItem>
              <h3 className={styles.techCategory}>Game Engines</h3>
              <p className={styles.techList}>Unity, Godot</p>
            </StaggerItem>
            <StaggerItem>
              <h3 className={styles.techCategory}>AI &amp; ML</h3>
              <p className={styles.techList}>Claude Code, OpenAI, Gemini, ONNX, tree-sitter</p>
            </StaggerItem>
          </div>
        </ScrollReveal>

        <ScrollReveal animation="fade-up">
          <div className="prose">
            <h2 className={styles.subheading}>Elsewhere</h2>
            <ul className={styles.elsewhere}>
              <li>
                <span className={styles.platform}>GitHub</span>
                <a
                  href="https://github.com/jon-kloss"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.handle}
                >
                  jon-kloss
                </a>
              </li>
              <li>
                <span className={styles.platform}>LinkedIn</span>
                <a
                  href="https://www.linkedin.com/in/jonkloss/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.handle}
                >
                  jon-kloss
                </a>
              </li>
              <li>
                <span className={styles.platform}>Email</span>
                <a href="mailto:jon.kloss89@gmail.com" className={styles.handle}>
                  jon.kloss89@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
}
