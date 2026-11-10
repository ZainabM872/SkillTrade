import React from "react";
import { fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import SkillPointsFaq from "./skill-points-faq";
import Help from "./help";
import Profile from "./profile";

function renderPage() {
  return render(<MemoryRouter><SkillPointsFaq /></MemoryRouter>);
}
function searchFor(value) {
  fireEvent.change(screen.getByRole("searchbox", { name: "Find an answer" }), { target: { value } });
}

test("shows the saved six answers with the introductory answer open", () => {
  const { container } = renderPage();
  expect(screen.getByRole("status")).toHaveTextContent("6 answers");
  expect(container.querySelectorAll("details")).toHaveLength(6);
  expect(container.querySelectorAll("details[open]")).toHaveLength(1);
  expect(screen.getByText("What are skill points?").closest("details")).toHaveAttribute("open");
  expect(screen.getByText("Example listing · Not your balance")).toBeInTheDocument();
  expect(screen.queryByRole("button", { name: "Clear", exact: true })).not.toBeInTheDocument();
});

test("searches answer text case-insensitively and clear restores the initial view", () => {
  renderPage();
  searchFor("  DURATION  ");
  expect(screen.getByRole("status")).toHaveTextContent("1 matching answer");
  const answer = screen.getByText("How many points does a session cost?").closest("details");
  expect(answer).toHaveAttribute("open");
  expect(screen.queryByText("Where can I see my balance?")).not.toBeInTheDocument();
  userEvent.click(screen.getByRole("button", { name: "Clear", exact: true }));
  expect(screen.getByRole("searchbox")).toHaveValue("");
  expect(screen.getByRole("searchbox")).toHaveFocus();
  expect(screen.getByRole("status")).toHaveTextContent("6 answers");
  expect(screen.getByText("What are skill points?").closest("details")).toHaveAttribute("open");
  expect(screen.getByText("How many points does a session cost?").closest("details")).not.toHaveAttribute("open");
});

test("shows an empty state and resets without losing any answers", () => {
  renderPage();
  searchFor("no-such-topic");
  expect(screen.getByRole("status")).toHaveTextContent("0 matching answers");
  expect(screen.getByRole("heading", { name: "No matching answers" })).toBeInTheDocument();
  userEvent.click(screen.getByRole("button", { name: "Show all answers" }));
  expect(screen.queryByRole("heading", { name: "No matching answers" })).not.toBeInTheDocument();
  expect(screen.getByRole("searchbox")).toHaveFocus();
  expect(screen.getByRole("status")).toHaveTextContent("6 answers");
});

test.each([
  ["/help", <Help />, "How do skill points work"],
  ["/profile", <Profile />, "How points work"],
])("opens the article from %s", (path, page, linkName) => {
  render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path={path} element={page} />
        <Route path="/skill-points-faq" element={<SkillPointsFaq />} />
      </Routes>
    </MemoryRouter>
  );
  userEvent.click(screen.getByRole("link", { name: new RegExp(linkName) }));
  expect(screen.getByRole("heading", { name: "How do skill points work?", level: 1 })).toBeInTheDocument();
});

test("links to support, balance, rating, and the existing meeting preview", () => {
  renderPage();
  expect(screen.getByRole("link", { name: "Contact support" })).toHaveAttribute("href", "/contact-support");
  expect(screen.getByRole("link", { name: "Preview choosing a location" })).toHaveAttribute("href", "/meeting-location");
  searchFor("balance");
  const balance = screen.getByText("Where can I see my balance?").closest("details");
  expect(within(balance).getByRole("link", { name: "View your profile" })).toHaveAttribute("href", "/profile");
  searchFor("rating");
  expect(screen.getByRole("link", { name: "Preview rating a session" })).toHaveAttribute("href", "/rate-session");
});
