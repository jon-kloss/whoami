import { getAllPosts } from "@/lib/posts";
import { formatDate } from "@/lib/format";
import type { Metadata } from "next";
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
        <span className="sectionLabel">Blog</span>
        <h1 className="sectionHeading">
          Writing &amp; <em>Thinking</em>
        </h1>

        {featured && (
          <article className={styles.featured}>
            <a href={`/blog/${featured.slug}`}>
              <time className={styles.date}>{formatDate(featured.date)}</time>
              <h2 className={styles.featuredTitle}>{featured.title}</h2>
              <p className={styles.excerpt}>{featured.excerpt}</p>
            </a>
          </article>
        )}

        <div className={styles.postList}>
          {remaining.map((post) => (
            <article key={post.slug} className={styles.postItem}>
              <a href={`/blog/${post.slug}`} className={styles.postLink}>
                <time className={styles.date}>{formatDate(post.date)}</time>
                <h2 className={styles.postTitle}>{post.title}</h2>
                <p className={styles.excerpt}>{post.excerpt}</p>
              </a>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}

