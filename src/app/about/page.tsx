import type { Metadata } from "next";
import styles from "./about.module.css";

export const metadata: Metadata = {
  title: "About — Jon Kloss",
  description: "Software engineer building tools that work.",
};

export default function AboutPage() {
  return (
    <div className="section">
      <div className="sectionInner">
        <div className="prose">
          <span className="sectionLabel">About</span>
          <h1 className="sectionHeading">
            About <em>Me</em>
          </h1>

          <div className={styles.bio}>
            <p>
              I&rsquo;m Jon Kloss, a software engineer who believes the best tools are the ones
              you forget you&rsquo;re using. I build things that work reliably, communicate clearly,
              and get out of the way.
            </p>
            <p>
              I&rsquo;m drawn to problems at the intersection of developer experience and system
              design — the kind of work where getting the abstractions right makes everything
              downstream simpler.
            </p>
            <p>
              When I&rsquo;m not writing code, I&rsquo;m usually reading about systems thinking,
              exploring new tools, or writing about what I&rsquo;m learning.
            </p>
          </div>

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
                href="https://linkedin.com/in/jon-kloss"
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
      </div>
    </div>
  );
}
