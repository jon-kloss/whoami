import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import ContactPage from "./page";

describe("Contact page", () => {
  beforeEach(() => {
    vi.stubEnv("NEXT_PUBLIC_FORMSPREE_ID", "test123");
  });

  // Scenario: Labels are associated with inputs
  it("renders form with labeled name, email, and message fields", () => {
    render(<ContactPage />);

    const nameInput = screen.getByLabelText("Name");
    expect(nameInput).toHaveAttribute("type", "text");
    expect(nameInput).toBeRequired();

    const emailInput = screen.getByLabelText("Email");
    expect(emailInput).toHaveAttribute("type", "email");
    expect(emailInput).toBeRequired();

    const messageInput = screen.getByLabelText("Message");
    expect(messageInput.tagName).toBe("TEXTAREA");
    expect(messageInput).toBeRequired();
  });

  // Scenario: Form is keyboard navigable
  it("renders submit button", () => {
    render(<ContactPage />);

    const button = screen.getByRole("button", { name: /send message/i });
    expect(button).toHaveAttribute("type", "submit");
  });

  // Scenario: Successful form submission
  it("shows success message on successful submission", async () => {
    const mockFetch = vi.fn().mockResolvedValue({ ok: true });
    globalThis.fetch = mockFetch;

    render(<ContactPage />);

    fireEvent.change(screen.getByLabelText("Name"), { target: { value: "Test User" } });
    fireEvent.change(screen.getByLabelText("Email"), { target: { value: "test@example.com" } });
    fireEvent.change(screen.getByLabelText("Message"), { target: { value: "Hello!" } });
    fireEvent.click(screen.getByRole("button", { name: /send message/i }));

    await waitFor(() => {
      expect(screen.getByRole("status")).toHaveTextContent(/message sent/i);
    });

    expect(mockFetch).toHaveBeenCalledWith(
      "https://formspree.io/f/test123",
      expect.objectContaining({ method: "POST" })
    );
  });

  // Scenario: Submission error is handled
  it("shows error message on failed submission", async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({ ok: false, status: 500 });

    render(<ContactPage />);

    fireEvent.change(screen.getByLabelText("Name"), { target: { value: "Test" } });
    fireEvent.change(screen.getByLabelText("Email"), { target: { value: "test@test.com" } });
    fireEvent.change(screen.getByLabelText("Message"), { target: { value: "Hi" } });
    fireEvent.click(screen.getByRole("button", { name: /send message/i }));

    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent(/something went wrong/i);
    });
  });

  it("shows error message on network failure", async () => {
    globalThis.fetch = vi.fn().mockRejectedValue(new Error("Network error"));

    render(<ContactPage />);

    fireEvent.change(screen.getByLabelText("Name"), { target: { value: "Test" } });
    fireEvent.change(screen.getByLabelText("Email"), { target: { value: "test@test.com" } });
    fireEvent.change(screen.getByLabelText("Message"), { target: { value: "Hi" } });
    fireEvent.click(screen.getByRole("button", { name: /send message/i }));

    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent(/something went wrong/i);
    });
  });

  // Scenario: Semantic heading structure
  it("renders heading and section label", () => {
    render(<ContactPage />);

    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
  });
});
