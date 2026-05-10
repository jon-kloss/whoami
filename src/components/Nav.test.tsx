import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Nav } from "./Nav";

vi.mock("next/navigation", () => ({
  usePathname: () => "/",
}));

describe("Nav", () => {
  // Scenario: Navigation renders on all pages (SPA anchor links)
  it("shows links to About, Experience, Projects, Blog, Contact with correct hrefs", () => {
    render(<Nav />);

    expect(screen.getByRole("link", { name: /about/i })).toHaveAttribute("href", "#about");
    expect(screen.getByRole("link", { name: /experience/i })).toHaveAttribute("href", "#experience");
    expect(screen.getByRole("link", { name: /projects/i })).toHaveAttribute("href", "#projects");
    expect(screen.getByRole("link", { name: /blog/i })).toHaveAttribute("href", "#writing");
    expect(screen.getByRole("link", { name: /contact/i })).toHaveAttribute("href", "#contact");
  });

  it("shows site logo '{/}' linking to home page", () => {
    render(<Nav />);

    const nameLink = screen.getByRole("link", { name: /\{\/\}/ });
    expect(nameLink).toHaveAttribute("href", "/");
  });

  it("renders a theme toggle button", () => {
    render(<Nav />);

    expect(screen.getByRole("button", { name: /toggle theme/i })).toBeInTheDocument();
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
