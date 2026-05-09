import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import ResumePage from "./page";

describe("Resume page", () => {
  // Scenario: Resume page renders experience entries
  it("renders experience entries with title, company, and dates", () => {
    render(<ResumePage />);

    expect(screen.getByText("Anthropic")).toBeInTheDocument();
    expect(screen.getByText("Previous Company")).toBeInTheDocument();
    expect(screen.getByText("First Job")).toBeInTheDocument();
  });

  it("renders entries in chronological order (most recent first)", () => {
    render(<ResumePage />);

    const companies = screen.getAllByText(/(Anthropic|Previous Company|First Job)/);
    expect(companies[0]).toHaveTextContent("Anthropic");
    expect(companies[1]).toHaveTextContent("Previous Company");
    expect(companies[2]).toHaveTextContent("First Job");
  });

  // Scenario: PDF download is available
  it("provides a PDF download link", () => {
    render(<ResumePage />);

    const downloadLink = screen.getByRole("link", { name: /download pdf/i });
    expect(downloadLink).toHaveAttribute("href", "/resume.pdf");
    expect(downloadLink).toHaveAttribute("download");
  });

  // Scenario: Skills section shows tech tags
  it("renders skills as tags", () => {
    render(<ResumePage />);

    expect(screen.getByText("TypeScript")).toBeInTheDocument();
    expect(screen.getByText("React")).toBeInTheDocument();
    expect(screen.getByText("Go")).toBeInTheDocument();
    expect(screen.getByText("PostgreSQL")).toBeInTheDocument();
  });

  // Scenario: Semantic heading structure
  it("renders heading hierarchy", () => {
    render(<ResumePage />);

    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: /experience/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: /skills/i })).toBeInTheDocument();
  });
});
