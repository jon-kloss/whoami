import { describe, it, expect } from "vitest";
import { getAllPosts, getPost, getAllSlugs } from "./posts";

describe("Blog posts library", () => {
  // Scenario: Listing page renders posts by date
  it("returns posts sorted by date descending", () => {
    const posts = getAllPosts();

    expect(posts).toHaveLength(3);
    expect(posts.map((p) => p.slug)).toEqual([
      "building-tools-that-work",
      "learning-in-public",
      "systems-thinking",
    ]);
  });

  it("each post has correct title, date, and excerpt", () => {
    const posts = getAllPosts();
    const first = posts[0];

    expect(first.title).toBe("Building Tools That Work");
    expect(first.date).toBe("2026-04-15");
    expect(first.excerpt).toContain("building reliable software");
  });

  // Scenario: Featured post gets prominent treatment
  it("marks exactly one post as featured", () => {
    const posts = getAllPosts();
    const featured = posts.filter((p) => p.featured);

    expect(featured).toHaveLength(1);
    expect(featured[0].title).toBe("Building Tools That Work");

    const nonFeatured = posts.filter((p) => !p.featured);
    expect(nonFeatured.length).toBe(2);
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
    const post = await getPost("building-tools-that-work");

    expect(post.title).toBe("Building Tools That Work");
    expect(post.contentHtml).toContain("Start with the problem");
    expect(post.contentHtml).toContain("<p>");
    expect(post.readTime).toBe("1 min read");
  });

  // Scenario: Code blocks have syntax highlighting
  it("renders code blocks with syntax highlighting", async () => {
    const post = await getPost("building-tools-that-work");

    expect(post.contentHtml).toContain("<code");
    expect(post.contentHtml).toContain("data-language");
  });

  // Scenario: Post with no code blocks
  it("renders posts with only prose correctly", async () => {
    const post = await getPost("learning-in-public");

    expect(post.title).toBe("Learning in Public");
    expect(post.contentHtml).toContain("The explanation test");
    expect(post.contentHtml).toContain("It compounds");
  });

  // Scenario: Post with images
  it("renders image references in posts", async () => {
    const post = await getPost("systems-thinking");

    expect(post.contentHtml).toContain("<img");
    expect(post.contentHtml).toContain("/images/system-diagram.png");
  });

  it("returns all slugs for static generation", () => {
    const slugs = getAllSlugs();

    expect(slugs).toContain("building-tools-that-work");
    expect(slugs).toContain("learning-in-public");
    expect(slugs).toContain("systems-thinking");
    expect(slugs).not.toContain("draft-post");
  });

  // Edge case: draft post rejected by getPost
  it("rejects draft posts via getPost", async () => {
    await expect(getPost("draft-post")).rejects.toThrow("draft");
  });
});
