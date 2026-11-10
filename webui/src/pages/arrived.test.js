import React from "react";
import { render, screen, within, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import Arrived from "./arrived";
import LocationShared from "./location-shared";
import MeetingLocation from "./meeting-location";

// JSDOM needs dialog stand-ins; native focus and Escape are checked in the browser.
beforeAll(() => {
  HTMLDialogElement.prototype.showModal = function () { this.setAttribute("open", ""); };
  HTMLDialogElement.prototype.close = function () { this.removeAttribute("open"); };
});
afterAll(() => {
  delete HTMLDialogElement.prototype.showModal;
  delete HTMLDialogElement.prototype.close;
});
beforeEach(() => localStorage.clear());
function renderPage() {
  return render(<MemoryRouter><Arrived /></MemoryRouter>);
}

test("opens a confirmation and lets the user say not yet", () => {
  renderPage();
  expect(screen.getByText("Not confirmed")).toBeInTheDocument();
  userEvent.click(screen.getByRole("button", { name: "We found each other" }));
  const dialog = screen.getByRole("dialog", { name: "Have you found Alex?" });
  userEvent.click(within(dialog).getByRole("button", { name: "Not yet" }));
  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  expect(screen.getByText("Not confirmed")).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "We found each other" })).toHaveFocus();
});

test("confirms the meetup with a busy state and prevents duplicate confirmation", async () => {
  renderPage();
  userEvent.click(screen.getByRole("button", { name: "We found each other" }));
  userEvent.click(screen.getByRole("button", { name: "Yes, we’re together" }));
  expect(screen.getByRole("button", { name: "Confirming…" })).toBeDisabled();
  expect(screen.getByRole("button", { name: "Not yet" })).toBeDisabled();
  await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
  expect(screen.getByRole("heading", { name: "You found each other!" })).toHaveFocus();
  expect(screen.getByRole("button", { name: "Meetup confirmed" })).toBeDisabled();
  expect(screen.getByText("Met in person")).toBeInTheDocument();
  expect(screen.getByRole("status")).toHaveTextContent("No attendance record or notification has been sent");
});

test.each([
  ["Mac Hall, food court", "Meet by the Dairy Queen in Mac Hall."],
  ["TFDL, second floor", "Meet by the elevators on the second floor."],
])("keeps %s through arrival, confirmation, and return to the location view", async (place, instructions) => {
  render(
    <MemoryRouter initialEntries={["/meeting-location"]}>
      <Routes>
        <Route path="/meeting-location" element={<MeetingLocation />} />
        <Route path="/location-shared" element={<LocationShared />} />
        <Route path="/arrived" element={<Arrived />} />
      </Routes>
    </MemoryRouter>
  );
  userEvent.click(screen.getByRole("radio", { name: place }));
  userEvent.click(screen.getByRole("button", { name: "Confirm meeting location" }));
  await screen.findByRole("heading", { name: "You know where to meet." });
  userEvent.click(screen.getByRole("link", { name: "Continue to finding each other" }));
  userEvent.click(screen.getByRole("button", { name: "I’ve arrived" }));
  expect(screen.getByRole("heading", { name: "You’ve arrived" })).toBeInTheDocument();
  expect(screen.getByRole("heading", { name: place })).toBeInTheDocument();
  expect(screen.getByText(instructions)).toBeInTheDocument();
  userEvent.click(screen.getByRole("button", { name: "We found each other" }));
  userEvent.click(screen.getByRole("button", { name: "Yes, we’re together" }));
  await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
  userEvent.click(screen.getByRole("link", { name: "View meeting location" }));
  expect(screen.getByRole("heading", { name: place })).toBeInTheDocument();
  expect(screen.getByRole("heading", { name: "Shared with Alex" })).toBeInTheDocument();
  userEvent.click(screen.getByRole("button", { name: "View arrival details" }));
  expect(screen.getByRole("button", { name: "Meetup confirmed" })).toBeDisabled();
});
