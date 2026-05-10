"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";
import styles from "./Nav.module.css";

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 60);
      if (y > lastY.current && y > 120) {
        setHidden(true);
      } else {
        setHidden(false);
      }
      lastY.current = y;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const className = [
    styles.nav,
    scrolled ? styles.scrolled : "",
    hidden ? styles.hidden : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <nav className={className}>
      <Link href="/" className={styles.navName}>
        {"{/}"}
      </Link>
      <ThemeToggle />
    </nav>
  );
}
