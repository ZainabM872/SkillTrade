import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import RateSession from "./rate-session";
import CompletedSessionDetails from "./completed-session-details";

const storageKey = "skilltrade.sessionRating.taylor-korean-2026-11-04.v1";
function renderPage() {
  return render(<MemoryRouter><RateSession /></MemoryRouter>);
}
beforeEach(() => localStorage.clear());
afterEach(() => jest.restoreAllMocks());

test("requires a rating, keeps the comment optional, and saves the selected feedback", async () => {
  renderPage();
  fireEvent.click(screen.getByRole("button", { name: "Submit rating" }));
  expect(screen.getByRole("alert")).toHaveTextContent("Please choose a rating");
  expect(screen.getByRole("radio", { name: "1 star — Poor" })).toHaveFocus();
  expect(localStorage.getItem(storageKey)).toBeNull();
  userEvent.click(screen.getByRole("radio", { name: "4 stars — Very good" }));
  expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "Submit rating" }));
  expect(screen.getByRole("button", { name: "Saving your rating…" })).toBeDisabled();
  expect(screen.getByRole("textbox")).toBeDisabled();
  await screen.findByRole("heading", { name: "Thanks for sharing." });
  expect(JSON.parse(localStorage.getItem(storageKey))).toEqual({ rating: 4, comment: "" });
  expect(screen.getByRole("heading", { name: "Thanks for sharing." })).toHaveFocus();
});

test("restores feedback after remount and edits the existing rating", async () => {
  localStorage.setItem(storageKey, JSON.stringify({ rating: 3, comment: "Helpful examples" }));
  const page = renderPage();
  expect(screen.getByText(/Taylor 3 out of 5/)).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "Edit your rating" }));
  expect(screen.getByRole("radio", { name: "3 stars — Good" })).toBeChecked();
  expect(screen.getByRole("textbox")).toHaveValue("Helpful examples");
  fireEvent.change(screen.getByRole("textbox"), { target: { value: "  Clear explanations  " } });
  expect(screen.getByText("22 / 500")).toBeInTheDocument();
  userEvent.click(screen.getByRole("radio", { name: "5 stars — Excellent" }));
  fireEvent.click(screen.getByRole("button", { name: "Submit rating" }));
  await screen.findByRole("heading", { name: "Thanks for sharing." });
  page.unmount();
  renderPage();
  expect(screen.getByText(/Taylor 5 out of 5/)).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "Edit your rating" }));
  expect(screen.getByRole("textbox")).toHaveValue("Clear explanations");
});

test("recovers from malformed storage and keeps feedback when saving fails", async () => {
  localStorage.setItem(storageKey, "broken JSON");
  renderPage();
  userEvent.click(screen.getByRole("radio", { name: "2 stars — Fair" }));
  fireEvent.change(screen.getByRole("textbox"), { target: { value: "More practice time" } });
  const write = jest.spyOn(Storage.prototype, "setItem").mockImplementation(() => { throw new Error("Storage unavailable"); });
  fireEvent.click(screen.getByRole("button", { name: "Submit rating" }));
  await waitFor(() => expect(screen.getByRole("status")).toHaveTextContent("couldn’t be saved"));
  expect(screen.getByRole("textbox")).toHaveValue("More practice time");
  expect(screen.getByRole("radio", { name: "2 stars — Fair" })).toBeChecked();
  write.mockRestore();
  fireEvent.click(screen.getByRole("button", { name: "Submit rating" }));
  await screen.findByRole("heading", { name: "Thanks for sharing." });
});

test("connects the completed session to the rating page and back", () => {
  render(
    <MemoryRouter initialEntries={["/completed-session-details"]}>
      <Routes>
        <Route path="/completed-session-details" element={<CompletedSessionDetails />} />
        <Route path="/rate-session" element={<RateSession />} />
      </Routes>
    </MemoryRouter>
  );
  userEvent.click(screen.getByRole("link", { name: "Rate this session" }));
  expect(screen.getByRole("heading", { name: "Rate your session" })).toBeInTheDocument();
  expect(screen.getByRole("heading", { name: "Conversational Korean" })).toBeInTheDocument();
  userEvent.click(screen.getByRole("link", { name: "Back to completed session" }));
  expect(screen.getByRole("heading", { name: "Conversational Korean with Taylor Reed" })).toBeInTheDocument();
});
