import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import Home from "./page";

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

vi.mock("@/lib/resume", () => ({
  getResumeData: () => ({
    experience: [
      {
        company: "Test Company",
        type: "Full-time",
        startDate: "Jan 2023",
        endDate: "Present",
        roles: [{ title: "Software Engineer", startDate: "Jan 2023", endDate: "Present" }],
      },
    ],
    education: [{ institution: "Test University", startDate: "2012", endDate: "2017" }],
    skills: ["TypeScript", "React"],
  }),
}));

vi.mock("@/components/ScrollReveal", () => ({
  ScrollReveal: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  StaggerItem: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

vi.mock("@/components/DotNav", () => ({
  DotNav: () => <nav data-testid="dot-nav" />,
}));

vi.mock("@/components/ContactForm", () => ({
  ContactForm: () => <form data-testid="contact-form"><button type="submit">Send Message</button></form>,
}));

vi.mock("@/components/PostList", () => ({
  PostList: ({ posts }: { posts: { slug: string; title: string }[] }) => (
    <div data-testid="post-list">{posts.map((p) => <div key={p.slug}>{p.title}</div>)}</div>
  ),
}));

describe("Home page (SPA)", () => {
  beforeEach(() => {
    vi.stubEnv("NEXT_PUBLIC_FORMSPREE_ID", "test123");
  });

  it("renders hero with name and tagline", async () => {
    render(await Home());
    expect(screen.getByText("Jon Kloss")).toBeInTheDocument();
    expect(screen.getByText(/AI tooling, agents, and workflows/i)).toBeInTheDocument();
  });

  it("renders about section with bio", async () => {
    render(await Home());
    expect(screen.getByText(/Hey, I.m Jon/i)).toBeInTheDocument();
  });

  it("renders experience timeline", async () => {
    render(await Home());
    expect(screen.getByText("Test Company")).toBeInTheDocument();
    expect(screen.getByText("Software Engineer")).toBeInTheDocument();
  });

  it("renders education", async () => {
    render(await Home());
    expect(screen.getByText("Test University")).toBeInTheDocument();
  });

  it("renders projects section", async () => {
    render(await Home());
    expect(screen.getByText("Project A")).toBeInTheDocument();
    expect(screen.getByText("Description A")).toBeInTheDocument();
  });

  it("renders featured blog post", async () => {
    render(await Home());
    expect(screen.getByText("Featured Post")).toBeInTheDocument();
  });

  it("renders contact form", async () => {
    render(await Home());
    expect(screen.getByTestId("contact-form")).toBeInTheDocument();
    expect(screen.getByText("Send Message")).toBeInTheDocument();
  });

  it("renders dot navigation", async () => {
    render(await Home());
    expect(screen.getByTestId("dot-nav")).toBeInTheDocument();
  });

  it("has section anchors for navigation", async () => {
    const { container } = render(await Home());
    expect(container.querySelector("#hero")).toBeInTheDocument();
    expect(container.querySelector("#about")).toBeInTheDocument();
    expect(container.querySelector("#experience")).toBeInTheDocument();
    expect(container.querySelector("#projects")).toBeInTheDocument();
    expect(container.querySelector("#writing")).toBeInTheDocument();
    expect(container.querySelector("#contact")).toBeInTheDocument();
  });

  it("renders skills tags", async () => {
    render(await Home());
    expect(screen.getByText("TypeScript")).toBeInTheDocument();
    expect(screen.getAllByText("React").length).toBeGreaterThanOrEqual(1);
  });
});
