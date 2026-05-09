import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import Home from "./page";

// Mock the async data fetchers
vi.mock("@/lib/posts", () => ({
  getAllPosts: () => [
    { slug: "featured-post", title: "Featured Post", date: "2026-04-15", excerpt: "Featured excerpt", featured: true, draft: false },
    { slug: "recent-post", title: "Recent Post", date: "2026-03-20", excerpt: "Recent excerpt", featured: false, draft: false },
  ],
}));

vi.mock("@/lib/projects", () => ({
  getCuratedProjects: () => [
    { title: "Project A", description: "Description A", tags: ["React"], url: "https://example.com", featured: true, order: 1 },
  ],
  getGitHubRepos: () => Promise.resolve([]),
}));

vi.mock("@/components/ScrollReveal", () => ({
  ScrollReveal: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

vi.mock("@/components/ContactForm", () => ({
  ContactForm: () => <form data-testid="contact-form"><button type="submit">Send Message</button></form>,
}));

describe("Home page", () => {
  beforeEach(() => {
    vi.stubEnv("NEXT_PUBLIC_FORMSPREE_ID", "test123");
  });

  // Scenario: Hero renders with name and storytelling tagline
  it("renders hero with name and tagline", async () => {
    const page = await Home();
    render(page);

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Jon Kloss");
    expect(screen.getByText(/build tools that disappear/i)).toBeInTheDocument();
  });

  it("renders primary and secondary CTAs", async () => {
    const page = await Home();
    render(page);

    expect(screen.getByRole("link", { name: /get in touch/i })).toHaveAttribute("href", "/contact");
    expect(screen.getByRole("link", { name: /view projects/i })).toHaveAttribute("href", "/projects");
  });

  // Scenario: Featured projects appear on home page
  it("shows featured projects in Selected Work section", async () => {
    const page = await Home();
    render(page);

    expect(screen.getByText("Project A")).toBeInTheDocument();
    expect(screen.getByText("Description A")).toBeInTheDocument();
    expect(screen.getByText("React")).toBeInTheDocument();
  });

  // Scenario: Featured and recent posts appear
  it("shows featured post and recent posts", async () => {
    const page = await Home();
    render(page);

    expect(screen.getByText("Featured Post")).toBeInTheDocument();
    expect(screen.getByText("Recent Post")).toBeInTheDocument();
  });

  // Scenario: Contact form on home page
  it("renders contact form", async () => {
    const page = await Home();
    render(page);

    expect(screen.getByTestId("contact-form")).toBeInTheDocument();
  });

  // Section numbering
  it("has numbered section labels", async () => {
    const page = await Home();
    render(page);

    expect(screen.getByText("01")).toBeInTheDocument();
    expect(screen.getByText("02")).toBeInTheDocument();
    expect(screen.getByText("03")).toBeInTheDocument();
  });
});
