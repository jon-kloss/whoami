import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import AboutPage from "./page";

describe("About page", () => {
  // Scenario: About page renders bio and links
  it("renders bio paragraphs", () => {
    render(<AboutPage />);

    expect(screen.getByText(/Hey, I.m Jon/i)).toBeInTheDocument();
    expect(screen.getByText(/AI tooling/i)).toBeInTheDocument();
  });

  it("shows Elsewhere links to GitHub, LinkedIn, and email", () => {
    render(<AboutPage />);

    const links = screen.getAllByRole("link");
    const github = links.find((l) => l.getAttribute("href") === "https://github.com/jon-kloss");
    const linkedin = links.find((l) => l.getAttribute("href") === "https://www.linkedin.com/in/jonkloss/");
    const email = links.find((l) => l.getAttribute("href") === "mailto:jon.kloss89@gmail.com");

    expect(github).toBeDefined();
    expect(linkedin).toBeDefined();
    expect(email).toBeDefined();
  });

  // Scenario: External links open in new tabs
  it("opens external links in new tabs with security attributes", () => {
    render(<AboutPage />);

    const links = screen.getAllByRole("link");
    const github = links.find((l) => l.getAttribute("href") === "https://github.com/jon-kloss");
    const linkedin = links.find((l) => l.getAttribute("href") === "https://www.linkedin.com/in/jonkloss/");

    expect(github).toHaveAttribute("target", "_blank");
    expect(github).toHaveAttribute("rel", "noopener noreferrer");
    expect(linkedin).toHaveAttribute("target", "_blank");
    expect(linkedin).toHaveAttribute("rel", "noopener noreferrer");
  });

  // Scenario: Semantic heading structure
  it("renders heading hierarchy", () => {
    render(<AboutPage />);

    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: /what i work with/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: /elsewhere/i })).toBeInTheDocument();
  });

  it("shows technology categories", () => {
    render(<AboutPage />);

    expect(screen.getByText(/Rust, TypeScript, C#/)).toBeInTheDocument();
    expect(screen.getByText(/React, Next.js/)).toBeInTheDocument();
  });
});
