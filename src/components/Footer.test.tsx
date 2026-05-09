import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Footer } from "./Footer";

describe("Footer", () => {
  // Scenario: Footer renders consistently
  it("shows copyright text", () => {
    render(<Footer />);

    expect(screen.getByText(/© 2026 Jon Kloss/)).toBeInTheDocument();
  });

  it("shows links to GitHub, LinkedIn, RSS with correct hrefs", () => {
    render(<Footer />);

    expect(screen.getByRole("link", { name: /github/i })).toHaveAttribute(
      "href",
      "https://github.com/jon-kloss"
    );
    expect(screen.getByRole("link", { name: /linkedin/i })).toHaveAttribute(
      "href",
      "https://linkedin.com/in/jon-kloss"
    );
    expect(screen.getByRole("link", { name: /rss/i })).toHaveAttribute("href", "/rss.xml");
  });

  it("opens external links in new tabs with security attributes", () => {
    render(<Footer />);

    const github = screen.getByRole("link", { name: /github/i });
    expect(github).toHaveAttribute("target", "_blank");
    expect(github).toHaveAttribute("rel", "noopener noreferrer");

    const linkedin = screen.getByRole("link", { name: /linkedin/i });
    expect(linkedin).toHaveAttribute("target", "_blank");
    expect(linkedin).toHaveAttribute("rel", "noopener noreferrer");
  });
});
