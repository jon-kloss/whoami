import { getAllPosts } from "@/lib/posts";
import { formatDate } from "@/lib/format";
import type { Metadata } from "next";
import { ScrollReveal } from "@/components/ScrollReveal";
import { PostList } from "./PostList";
import styles from "./blog.module.css";

export const metadata: Metadata = {
  title: "Blog — Jon Kloss",
  description: "Writing about systems, craft, and the things I learn along the way.",
};

export default function BlogPage() {
  const posts = getAllPosts();
  const featured = posts.find((p) => p.featured);
  const remaining = posts.filter((p) => !p.featured);

  return (
    <div className="section">
      <div className="sectionInner">
        <ScrollReveal animation="fade-up">
          <span className="sectionLabel">Blog</span>
          <h1 className="sectionHeading">
            Writing &amp; <em>Thinking</em>
          </h1>
        </ScrollReveal>

        {featured && (
          <ScrollReveal animation="fade-right">
            <article className={styles.featured}>
              <a href={`/blog/${featured.slug}`}>
                <time className={styles.date}>{formatDate(featured.date)}</time>
                <h2 className={styles.featuredTitle}>{featured.title}</h2>
                <p className={styles.excerpt}>{featured.excerpt}</p>
              </a>
            </article>
          </ScrollReveal>
        )}

        <ScrollReveal animation="fade-up" delay={100}>
          <PostList posts={remaining.map(({ slug, title, date, excerpt }) => ({ slug, title, date, excerpt }))} />
        </ScrollReveal>
      </div>
    </div>
  );
}

