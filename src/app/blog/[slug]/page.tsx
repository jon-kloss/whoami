import { getPost, getAllSlugs } from "@/lib/posts";
import { formatDate } from "@/lib/format";
import type { Metadata } from "next";
import styles from "./post.module.css";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = getAllSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  return {
    title: `${post.title} — Jon Kloss`,
    description: post.excerpt,
  };
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPost(slug);

  return (
    <article className="section">
      <div className="sectionInner">
        <div className="prose">
          <header className={styles.header}>
            <div className={styles.meta}>
              <time>{formatDate(post.date)}</time>
              <span>{post.readTime}</span>
            </div>
            <h1 className={styles.title}>{post.title}</h1>
          </header>
          <div
            className={styles.content}
            dangerouslySetInnerHTML={{ __html: post.contentHtml }}
          />
        </div>
      </div>
    </article>
  );
}

