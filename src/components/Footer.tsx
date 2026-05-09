import styles from "./Footer.module.css";

export function Footer() {
  return (
    <footer className={styles.footer}>
      <span>&copy; 2026 Jon Kloss</span>
      <ul className={styles.footerLinks}>
        <li>
          <a
            href="https://github.com/jon-kloss"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
        </li>
        <li>
          <a
            href="https://linkedin.com/in/jon-kloss"
            target="_blank"
            rel="noopener noreferrer"
          >
            LinkedIn
          </a>
        </li>
        <li>
          <a href="/rss.xml">RSS</a>
        </li>
      </ul>
    </footer>
  );
}
