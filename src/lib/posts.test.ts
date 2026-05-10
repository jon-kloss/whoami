import { describe, it, expect } from "vitest";
import { getAllPosts, getPost, getAllSlugs } from "./posts";

describe("Blog posts library", () => {
  // Scenario: Listing page renders posts by date
  it("returns posts sorted by date descending", () => {
    const posts = getAllPosts();

    expect(posts.length).toBeGreaterThanOrEqual(3);
    // Verify sorted by date descending
    for (let i = 1; i < posts.length; i++) {
      expect(posts[i - 1].date >= posts[i].date).toBe(true);
    }
  });

  it("each post has required fields", () => {
    const posts = getAllPosts();
    const first = posts[0];

    expect(first.title).toBeDefined();
    expect(first.date).toBeDefined();
    expect(first.excerpt).toBeDefined();
    expect(first.slug).toBeDefined();
  });

  // Scenario: Featured post gets prominent treatment
  it("marks exactly one post as featured", () => {
    const posts = getAllPosts();
    const featured = posts.filter((p) => p.featured);

    expect(featured).toHaveLength(1);
    expect(featured[0].slug).toBe("when-your-ai-wont-parallelize");

    const nonFeatured = posts.filter((p) => !p.featured);
    expect(nonFeatured.length).toBe(posts.length - 1);
    nonFeatured.forEach((p) => expect(p.featured).toBe(false));
  });

  // Scenario: Draft posts are excluded
  it("excludes draft posts from listing", () => {
    const posts = getAllPosts();
    const drafts = posts.filter((p) => p.draft);

    expect(drafts).toHaveLength(0);
    expect(posts.find((p) => p.title === "Work in Progress")).toBeUndefined();
  });

  // Scenario: Post page displays formatted content
  it("returns rendered HTML content for a post", async () => {
    const post = await getPost("when-your-ai-wont-parallelize");

    expect(post.title).toContain("Parallelize");
    expect(post.contentHtml).toContain("<p>");
    expect(post.readTime).toBeDefined();
  });

  // Scenario: Code blocks have syntax highlighting
  it("renders code blocks with syntax highlighting", async () => {
    const post = await getPost("semantic-caching-for-llms");

    expect(post.contentHtml).toContain("<code");
    expect(post.contentHtml).toContain("data-language");
  });

  // Scenario: Post with prose renders correctly
  it("renders posts with prose content", async () => {
    const post = await getPost("when-your-ai-wont-parallelize");

    expect(post.title).toContain("Parallelize");
    expect(post.contentHtml).toContain("<p>");
  });

  it("returns all slugs for static generation", () => {
    const slugs = getAllSlugs();

    expect(slugs).toContain("when-your-ai-wont-parallelize");
    expect(slugs).toContain("semantic-caching-for-llms");
    expect(slugs).not.toContain("draft-post");
  });

  // Edge case: draft post rejected by getPost
  it("rejects draft posts via getPost", async () => {
    await expect(getPost("draft-post")).rejects.toThrow("draft");
  });
});
