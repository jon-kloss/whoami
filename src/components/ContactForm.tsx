"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import styles from "./ContactForm.module.css";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");

    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      const res = await fetch(
        `https://formspree.io/f/${process.env.NEXT_PUBLIC_FORMSPREE_ID}`,
        {
          method: "POST",
          body: formData,
          headers: { Accept: "application/json" },
        }
      );

      if (res.ok) {
        setStatus("success");
        form.reset();
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.field}>
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            required
            autoComplete="name"
            className={styles.input}
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            required
            autoComplete="email"
            className={styles.input}
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="message">Message</label>
          <textarea
            id="message"
            name="message"
            required
            rows={6}
            className={styles.textarea}
          />
        </div>

        <button
          type="submit"
          className="btnPrimary"
          disabled={status === "sending"}
        >
          {status === "sending" ? "Sending..." : "Send Message"}
        </button>
      </form>

      {status === "success" && (
        <p className={styles.success} role="status">
          Message sent! I&rsquo;ll get back to you soon.
        </p>
      )}

      {status === "error" && (
        <p className={styles.error} role="alert">
          Something went wrong. Please try again or email me directly.
        </p>
      )}
    </>
  );
}
