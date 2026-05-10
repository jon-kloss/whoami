"use client";

import { useEffect, useState } from "react";
import styles from "./DotNav.module.css";

const sections = [
  { id: "hero", label: "Top" },
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "writing", label: "Writing" },
  { id: "contact", label: "Contact" },
];

export function DotNav() {
  const [active, setActive] = useState("hero");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
          }
        }
      },
      { rootMargin: "-40% 0px -40% 0px" }
    );

    for (const { id } of sections) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <nav className={styles.dotNav} aria-label="Section navigation">
      {sections.map(({ id, label }) => (
        <a
          key={id}
          href={`#${id}`}
          className={`${styles.dot} ${active === id ? styles.active : ""}`}
          aria-label={label}
          title={label}
        >
          <span className={styles.label}>{label}</span>
        </a>
      ))}
    </nav>
  );
}
