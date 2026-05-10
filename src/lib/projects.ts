import fs from "fs";
import path from "path";

export interface CuratedProject {
  title: string;
  description: string;
  tags: string[];
  url: string;
  repo?: string;
  featured: boolean;
  order: number;
}

export interface GitHubRepo {
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
}

export function getCuratedProjects(): CuratedProject[] {
  const filePath = path.join(process.cwd(), "content/projects.json");
  const data = fs.readFileSync(filePath, "utf8");
  const projects: CuratedProject[] = JSON.parse(data);
  return projects.sort((a, b) => a.order - b.order);
}

export async function getGitHubRepos(): Promise<GitHubRepo[]> {
  try {
    const res = await fetch(
      "https://api.github.com/users/jon-kloss/repos?sort=updated&per_page=10",
      { next: { revalidate: 3600 } }
    );

    if (!res.ok) return [];

    const repos: GitHubRepo[] = await res.json();
    return repos
      .filter((r) => !r.name.startsWith(".") && r.name !== "whoami")
      .sort((a, b) => b.stargazers_count - a.stargazers_count);
  } catch {
    return [];
  }
}
