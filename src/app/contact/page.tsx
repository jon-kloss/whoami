import type { Metadata } from "next";
import { ContactForm } from "@/components/ContactForm";
import styles from "./contact.module.css";

export const metadata: Metadata = {
  title: "Contact — Jon Kloss",
  description: "Get in touch with Jon Kloss.",
};

export default function ContactPage() {
  return (
    <div className="section">
      <div className="sectionInner">
        <div className="prose">
          <span className="sectionLabel">Contact</span>
          <h1 className="sectionHeading">
            Get in <em>Touch</em>
          </h1>
          <p className={styles.intro}>
            Have a project in mind, want to collaborate, or just want to say hello?
            I&rsquo;d love to hear from you.
          </p>

          <ContactForm />
        </div>
      </div>
    </div>
  );
}
