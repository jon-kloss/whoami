import { describe, it, expect, vi } from "vitest";
import { getCuratedProjects, getGitHubRepos } from "./projects";

describe("Projects library", () => {
  // Scenario: Projects page shows curated projects
  it("returns curated projects sorted by order", () => {
    const projects = getCuratedProjects();

    expect(projects.length).toBeGreaterThanOrEqual(3);
    for (let i = 1; i < projects.length; i++) {
      expect(projects[i - 1].order).toBeLessThanOrEqual(projects[i].order);
    }
  });

  it("each project has title, description, and tags", () => {
    const projects = getCuratedProjects();

    for (const project of projects) {
      expect(project.title).toBeTruthy();
      expect(project.description).toBeTruthy();
      expect(project.tags.length).toBeGreaterThan(0);
    }
  });

  // Scenario: Project links work
  it("each project has a url", () => {
    const projects = getCuratedProjects();

    for (const project of projects) {
      expect(project.url).toMatch(/^https?:\/\//);
    }
  });

  // Scenario: GitHub API failure is handled gracefully
  it("returns empty array when GitHub API fails", async () => {
    const originalFetch = globalThis.fetch;
    globalThis.fetch = vi.fn().mockRejectedValue(new Error("Network error"));

    const repos = await getGitHubRepos();
    expect(repos).toEqual([]);

    globalThis.fetch = originalFetch;
  });

  it("returns empty array when GitHub API returns non-ok status", async () => {
    const originalFetch = globalThis.fetch;
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 403,
    });

    const repos = await getGitHubRepos();
    expect(repos).toEqual([]);

    globalThis.fetch = originalFetch;
  });

  // Scenario: Open source repos are listed
  it("returns repos from GitHub API sorted by stars", async () => {
    const mockRepos = [
      { name: "repo-a", full_name: "jon-kloss/repo-a", description: "Desc A", html_url: "https://github.com/jon-kloss/repo-a", stargazers_count: 5 },
      { name: "repo-b", full_name: "jon-kloss/repo-b", description: "Desc B", html_url: "https://github.com/jon-kloss/repo-b", stargazers_count: 20 },
    ];

    const originalFetch = globalThis.fetch;
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockRepos),
    });

    const repos = await getGitHubRepos();
    expect(repos).toHaveLength(2);
    expect(repos[0].name).toBe("repo-b");
    expect(repos[1].name).toBe("repo-a");

    globalThis.fetch = originalFetch;
  });
});
