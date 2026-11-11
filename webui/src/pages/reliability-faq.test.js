import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import ReliabilityFaq from "./reliability-faq";
import Help from "./help";
import RateSession from "./rate-session";
import SkillPointsFaq from "./skill-points-faq";

function renderPage() {
  return render(<MemoryRouter><ReliabilityFaq /></MemoryRouter>);
}
function searchFor(value) {
  fireEvent.change(screen.getByRole("searchbox", { name: "Find an answer" }), { target: { value } });
}

test("shows the saved seven answers and clearly labels the example score", () => {
  const { container } = renderPage();
  expect(screen.getByRole("status")).toHaveTextContent("7 answers");
  expect(container.querySelectorAll("details")).toHaveLength(7);
  expect(container.querySelectorAll("details[open]")).toHaveLength(1);
  expect(screen.getByText("What does reliability measure?").closest("details")).toHaveAttribute("open");
  expect(screen.getByText("Example only · Not your account score")).toBeInTheDocument();
  expect(screen.getByText(/exact calculation and update timing are not specified/)).toBeInTheDocument();
});

test("searches answer text regardless of case and clear restores the initial disclosure state", () => {
  renderPage();
  searchFor("  PACE  ");
  expect(screen.getByRole("status")).toHaveTextContent("1 matching answer");
  expect(screen.getByText("How is reliability different from a session rating?").closest("details")).toHaveAttribute("open");
  expect(screen.queryByText("What does reliability measure?")).not.toBeInTheDocument();
  userEvent.click(screen.getByRole("button", { name: "Clear", exact: true }));
  expect(screen.getByRole("searchbox")).toHaveFocus();
  expect(screen.getByRole("searchbox")).toHaveValue("");
  expect(screen.getByRole("status")).toHaveTextContent("7 answers");
  expect(screen.getByText("What does reliability measure?").closest("details")).toHaveAttribute("open");
  expect(screen.getByText("How is reliability different from a session rating?").closest("details")).not.toHaveAttribute("open");
});

test("recovers from no matching answers", () => {
  renderPage();
  searchFor("no-such-topic");
  expect(screen.getByRole("heading", { name: "No matching answers" })).toBeInTheDocument();
  expect(screen.getByRole("status")).toHaveTextContent("0 matching answers");
  userEvent.click(screen.getByRole("button", { name: "Show all answers" }));
  expect(screen.queryByRole("heading", { name: "No matching answers" })).not.toBeInTheDocument();
  expect(screen.getByRole("searchbox")).toHaveFocus();
  expect(screen.getByRole("status")).toHaveTextContent("7 answers");
});

test.each([
  ["/help", <Help />, /How does reliability work/],
  ["/rate-session", <RateSession />, /How reliability works/],
  ["/skill-points-faq", <SkillPointsFaq />, /How reliability works/],
])("opens reliability help from %s", (path, page, linkName) => {
  render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path={path} element={page} />
        <Route path="/reliability-faq" element={<ReliabilityFaq />} />
      </Routes>
    </MemoryRouter>
  );
  userEvent.click(screen.getByRole("link", { name: linkName }));
  expect(screen.getByRole("heading", { name: "How does reliability work?", level: 1 })).toBeInTheDocument();
});

test("links to existing meetup, rating, support, and points pages", () => {
  renderPage();
  expect(screen.getByRole("link", { name: "Contact support" })).toHaveAttribute("href", "/contact-support");
  expect(screen.getByRole("link", { name: "How skill points work" })).toHaveAttribute("href", "/skill-points-faq");
  expect(screen.getByRole("link", { name: "Preview confirming a meetup" })).toHaveAttribute("href", "/arrived");
  searchFor("pace");
  expect(screen.getByRole("link", { name: "Preview rating a session" })).toHaveAttribute("href", "/rate-session");
  searchFor("no-show");
  expect(screen.getByRole("link", { name: "Continue to finding each other" })).toHaveAttribute("href", "/location-shared");
  searchFor("dependable");
  expect(screen.getByRole("link", { name: "Preview choosing a meeting spot" })).toHaveAttribute("href", "/meeting-location");
});
