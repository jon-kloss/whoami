import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import ResumePage from "./page";

describe("Resume page", () => {
  it("renders experience entries with company and roles", () => {
    render(<ResumePage />);

    expect(screen.getByText("United Wholesale Mortgage")).toBeInTheDocument();
    expect(screen.getByText("bash.gg")).toBeInTheDocument();
    expect(screen.getByText("Merkle")).toBeInTheDocument();
    expect(screen.getByText("HelloWorld, Inc.")).toBeInTheDocument();
    expect(screen.getByText("Software Developer III")).toBeInTheDocument();
  });

  it("renders entries in chronological order (most recent first)", () => {
    render(<ResumePage />);

    const companies = screen.getAllByText(/(United Wholesale Mortgage|bash\.gg|Merkle|HelloWorld, Inc\.)/);
    expect(companies[0]).toHaveTextContent("United Wholesale Mortgage");
    expect(companies[1]).toHaveTextContent("bash.gg");
    expect(companies[2]).toHaveTextContent("Merkle");
    expect(companies[3]).toHaveTextContent("HelloWorld, Inc.");
  });

  it("provides a PDF download link", () => {
    render(<ResumePage />);

    const downloadLink = screen.getByRole("link", { name: /download pdf/i });
    expect(downloadLink).toHaveAttribute("href", "/whoami/resume.pdf");
    expect(downloadLink).toHaveAttribute("download");
  });

  it("renders skills as tags", () => {
    render(<ResumePage />);

    expect(screen.getByText("Rust")).toBeInTheDocument();
    expect(screen.getByText("TypeScript")).toBeInTheDocument();
    expect(screen.getByText("React")).toBeInTheDocument();
    expect(screen.getByText("PostgreSQL")).toBeInTheDocument();
  });

  it("renders heading hierarchy", () => {
    render(<ResumePage />);

    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: /skills/i })).toBeInTheDocument();
  });

  it("renders education section", () => {
    render(<ResumePage />);

    expect(screen.getByText("Wayne State University")).toBeInTheDocument();
  });
});
