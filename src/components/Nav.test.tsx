import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Nav } from "./Nav";

describe("Nav", () => {
  // Scenario: Navigation renders on all pages
  it("shows links to Projects, Blog, About, Resume, Contact with correct hrefs", () => {
    render(<Nav />);

    expect(screen.getByRole("link", { name: /projects/i })).toHaveAttribute("href", "/projects");
    expect(screen.getByRole("link", { name: /blog/i })).toHaveAttribute("href", "/blog");
    expect(screen.getByRole("link", { name: /about/i })).toHaveAttribute("href", "/about");
    expect(screen.getByRole("link", { name: /resume/i })).toHaveAttribute("href", "/resume");
    expect(screen.getByRole("link", { name: /contact/i })).toHaveAttribute("href", "/contact");
  });

  it("shows site name 'Jon Kloss' linking to home page", () => {
    render(<Nav />);

    const nameLink = screen.getByRole("link", { name: /jon kloss/i });
    expect(nameLink).toHaveAttribute("href", "/");
  });

  // Regression: ThemeToggle removed in respec 2026-05-09
  it("does not render a theme toggle button", () => {
    render(<Nav />);

    expect(screen.queryByRole("button", { name: /toggle theme/i })).not.toBeInTheDocument();
  });

  // Scenario: Navigation hides on scroll down
  it("hides nav when scrolling down past 120px", () => {
    render(<Nav />);
    const nav = screen.getByRole("navigation");

    // Set initial scroll position
    Object.defineProperty(window, "scrollY", { value: 130, writable: true, configurable: true });
    fireEvent.scroll(window);

    // Scroll further down to trigger hide (y > lastY && y > 120)
    Object.defineProperty(window, "scrollY", { value: 200, writable: true, configurable: true });
    fireEvent.scroll(window);

    expect(nav.className).toContain("hidden");
  });

  // Scenario: Navigation shows on scroll up
  it("shows nav when scrolling back up", () => {
    render(<Nav />);
    const nav = screen.getByRole("navigation");

    // Scroll down past 120px
    Object.defineProperty(window, "scrollY", { value: 130, writable: true, configurable: true });
    fireEvent.scroll(window);
    Object.defineProperty(window, "scrollY", { value: 200, writable: true, configurable: true });
    fireEvent.scroll(window);

    expect(nav.className).toContain("hidden");

    // Scroll back up
    Object.defineProperty(window, "scrollY", { value: 100, writable: true, configurable: true });
    fireEvent.scroll(window);

    expect(nav.className).not.toContain("hidden");
  });

  it("applies scrolled style with backdrop blur after scrolling", () => {
    render(<Nav />);
    const nav = screen.getByRole("navigation");

    Object.defineProperty(window, "scrollY", { value: 80, writable: true, configurable: true });
    fireEvent.scroll(window);

    expect(nav.className).toContain("scrolled");
  });
});
