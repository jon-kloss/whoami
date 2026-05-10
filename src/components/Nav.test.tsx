import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Nav } from "./Nav";

describe("Nav", () => {
  it("shows site logo '{/}' linking to home page", () => {
    render(<Nav />);

    const nameLink = screen.getByRole("link", { name: /\{\/\}/ });
    expect(nameLink).toHaveAttribute("href", "/");
  });

  it("renders a theme toggle button", () => {
    render(<Nav />);

    expect(screen.getByRole("button", { name: /toggle theme/i })).toBeInTheDocument();
  });

  it("hides nav when scrolling down past 120px", () => {
    render(<Nav />);
    const nav = screen.getByRole("navigation");

    Object.defineProperty(window, "scrollY", { value: 130, writable: true, configurable: true });
    fireEvent.scroll(window);

    Object.defineProperty(window, "scrollY", { value: 200, writable: true, configurable: true });
    fireEvent.scroll(window);

    expect(nav.className).toContain("hidden");
  });

  it("shows nav when scrolling back up", () => {
    render(<Nav />);
    const nav = screen.getByRole("navigation");

    Object.defineProperty(window, "scrollY", { value: 130, writable: true, configurable: true });
    fireEvent.scroll(window);
    Object.defineProperty(window, "scrollY", { value: 200, writable: true, configurable: true });
    fireEvent.scroll(window);

    expect(nav.className).toContain("hidden");

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
