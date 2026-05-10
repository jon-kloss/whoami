"use client";

import { useState } from "react";
import { formatDate } from "@/lib/format";
import Link from "next/link";
import styles from "./blog.module.css";

interface Post {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
}

const PAGE_SIZE = 5;

export function PostList({ posts }: { posts: Post[] }) {
  const [visible, setVisible] = useState(PAGE_SIZE);
  const hasMore = visible < posts.length;

  return (
    <>
      <div className={styles.postList}>
        {posts.slice(0, visible).map((post) => (
          <article key={post.slug} className={styles.postItem}>
            <Link href={`/blog/${post.slug}`} className={styles.postLink}>
              <time className={styles.date}>{formatDate(post.date)}</time>
              <h2 className={styles.postTitle}>{post.title}</h2>
              <p className={styles.excerpt}>{post.excerpt}</p>
            </Link>
          </article>
        ))}
      </div>
      {hasMore && (
        <button
          onClick={() => setVisible((v) => v + PAGE_SIZE)}
          className={styles.showMore}
        >
          Show More
        </button>
      )}
    </>
  );
}
