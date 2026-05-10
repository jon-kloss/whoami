"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "./ThemeToggle";
import styles from "./Nav.module.css";

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);
  const pathname = usePathname();
  const isHome = pathname === "/" || pathname === "";

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
      <ul className={styles.navLinks}>
        <li>
          {isHome ? <a href="#about">About</a> : <Link href="/#about">About</Link>}
        </li>
        <li>
          {isHome ? <a href="#experience">Experience</a> : <Link href="/#experience">Experience</Link>}
        </li>
        <li>
          {isHome ? <a href="#projects">Projects</a> : <Link href="/#projects">Projects</Link>}
        </li>
        <li>
          {isHome ? <a href="#writing">Blog</a> : <Link href="/#writing">Blog</Link>}
        </li>
        <li>
          {isHome ? <a href="#contact">Contact</a> : <Link href="/#contact">Contact</Link>}
        </li>
        <li>
          <ThemeToggle />
        </li>
      </ul>
    </nav>
  );
}
