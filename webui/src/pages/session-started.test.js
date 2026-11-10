import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import SessionStarted from "./session-started";
import Arrived from "./arrived";
import RateSession from "./rate-session";

beforeAll(() => {
  HTMLDialogElement.prototype.showModal = function () { this.setAttribute("open", ""); };
  HTMLDialogElement.prototype.close = function () { this.removeAttribute("open"); };
});
afterAll(() => {
  delete HTMLDialogElement.prototype.showModal;
  delete HTMLDialogElement.prototype.close;
});
beforeEach(() => localStorage.clear());
function renderFlow(entry = "/session-started") {
  return render(
    <MemoryRouter initialEntries={[entry]}>
      <Routes>
        <Route path="/arrived" element={<Arrived />} />
        <Route path="/session-started" element={<SessionStarted />} />
        <Route path="/rate-session" element={<RateSession />} />
      </Routes>
    </MemoryRouter>
  );
}
async function finish() {
  userEvent.click(screen.getByRole("button", { name: "Finish session" }));
  userEvent.click(screen.getByRole("button", { name: "Yes, finish session" }));
  await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
}

test("cancels finishing and leaves the session in progress", () => {
  renderFlow();
  expect(screen.queryByRole("link", { name: "Rate your session" })).not.toBeInTheDocument();
  userEvent.click(screen.getByRole("button", { name: "Finish session" }));
  userEvent.click(screen.getByRole("button", { name: "Keep learning" }));
  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Finish session" })).toHaveFocus();
  expect(screen.getByText("Session in progress · Demo")).toBeInTheDocument();
});

test("finishes with a busy state, updates progress, and prevents repeat completion", async () => {
  renderFlow();
  userEvent.click(screen.getByRole("button", { name: "Finish session" }));
  userEvent.click(screen.getByRole("button", { name: "Yes, finish session" }));
  expect(screen.getByRole("button", { name: "Finishing…" })).toBeDisabled();
  expect(screen.getByRole("button", { name: "Keep learning" })).toBeDisabled();
  await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
  expect(screen.getByRole("button", { name: "Session finished" })).toBeDisabled();
  await waitFor(() => expect(screen.getByRole("region", { name: "Ready to share your experience?" })).toHaveFocus());
  expect(screen.getByRole("status")).toHaveTextContent("No attendance record or points have changed");
  expect(screen.getByText("Review").parentElement).toHaveAttribute("aria-current", "step");
});

test("starts after arrival confirmation and keeps the completed state when returning", async () => {
  renderFlow("/arrived");
  expect(screen.queryByRole("link", { name: "Start the demo session" })).not.toBeInTheDocument();
  userEvent.click(screen.getByRole("button", { name: "We found each other" }));
  userEvent.click(screen.getByRole("button", { name: "Yes, we’re together" }));
  await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
  userEvent.click(screen.getByRole("link", { name: "Start the demo session" }));
  expect(screen.getByRole("heading", { name: "Your session has started" })).toBeInTheDocument();
  await finish();
  userEvent.click(screen.getByRole("link", { name: "Back to arrival details" }));
  userEvent.click(screen.getByRole("link", { name: "View completed session" }));
  expect(screen.getByRole("button", { name: "Session finished" })).toBeDisabled();
});

test.each([
  ["Alex Morgan", "Alex", "AM", "Teacher", "Acoustic Guitar", "TFDL, second floor"],
  ["Sara Moon", "Sara", "SM", "Learner", "Skating basics", "Community centre lobby"],
])("carries %s's session into rating without changing Taylor's stored feedback", async (partner, firstName, initials, role, skill, placeName) => {
  const taylorKey = "skilltrade.sessionRating.taylor-korean-2026-11-04.v1";
  localStorage.setItem(taylorKey, JSON.stringify({ rating: 2, comment: "Existing Korean review" }));
  const session = { partner, firstName, initials, role, skill, placeName };
  renderFlow({ pathname: "/session-started", state: { session, instructions: "Meet at the entrance." } });
  expect(screen.getByText(role === "Teacher" ? "You · Learner" : "You · Teacher")).toBeInTheDocument();
  expect(screen.getByText("Meet at the entrance.")).toBeInTheDocument();
  await finish();
  userEvent.click(screen.getByRole("link", { name: "Rate your session" }));
  expect(screen.getByRole("heading", { name: `How was your session with ${firstName}?` })).toBeInTheDocument();
  expect(screen.getByRole("heading", { name: skill })).toBeInTheDocument();
  userEvent.click(screen.getByRole("radio", { name: "5 stars — Excellent" }));
  userEvent.click(screen.getByRole("button", { name: "Submit rating" }));
  await screen.findByRole("heading", { name: "Thanks for sharing." });
  expect(JSON.parse(localStorage.getItem(taylorKey)).rating).toBe(2);
  expect(JSON.parse(localStorage.getItem(`skilltrade.sessionRating.${partner}.${skill}.v1`)).rating).toBe(5);
  userEvent.click(screen.getByRole("link", { name: "Back to session" }));
  expect(screen.getByRole("button", { name: "Session finished" })).toBeDisabled();
});
