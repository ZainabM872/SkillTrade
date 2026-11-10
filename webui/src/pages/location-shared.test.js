import React from "react";
import { fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import LocationShared from "./location-shared";
import Arrived from "./arrived";
import TeachingSessionDetails from "./teaching-session-details";

// JSDOM does not implement native modal dialogs; the browser check covers focus/Escape.
beforeAll(() => {
  HTMLDialogElement.prototype.showModal = function () { this.setAttribute("open", ""); };
  HTMLDialogElement.prototype.close = function () { this.removeAttribute("open"); };
});
afterAll(() => {
  delete HTMLDialogElement.prototype.showModal;
  delete HTMLDialogElement.prototype.close;
});
function renderPage() {
  return render(
    <MemoryRouter initialEntries={["/location-shared"]}>
      <Routes>
        <Route path="/location-shared" element={<LocationShared />} />
        <Route path="/arrived" element={<Arrived />} />
      </Routes>
    </MemoryRouter>
  );
}

test("selects sample markers and shows the matching description", () => {
  renderPage();
  expect(screen.getByRole("button", { name: "Meeting spot" })).toHaveAttribute("aria-pressed", "true");
  userEvent.click(screen.getByRole("button", { name: "Sara", exact: true }));
  expect(screen.getByRole("heading", { name: "Sara Moon", exact: true })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Meeting spot" })).toHaveAttribute("aria-pressed", "false");
  userEvent.click(screen.getByRole("button", { name: "You", exact: true }));
  expect(screen.getByRole("heading", { name: "Your sample position" })).toBeInTheDocument();
  expect(screen.getByText(/Your device location is not being used/)).toBeInTheDocument();
});

test("cancels stopping, confirms stopping, and resumes sharing", () => {
  renderPage();
  userEvent.click(screen.getByRole("button", { name: "Stop sharing", exact: true }));
  let dialog = screen.getByRole("dialog", { name: "Stop sharing your location?" });
  userEvent.click(within(dialog).getByRole("button", { name: "Keep sharing" }));
  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  expect(screen.getByText("Demo sharing on")).toBeInTheDocument();
  userEvent.click(screen.getByRole("button", { name: "Stop sharing", exact: true }));
  dialog = screen.getByRole("dialog");
  userEvent.click(within(dialog).getByRole("button", { name: "Stop sharing", exact: true }));
  expect(screen.getByRole("heading", { name: "Your location is private" })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "You", exact: true })).toBeDisabled();
  expect(screen.getByText("Your location is hidden")).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Share location again" })).toHaveFocus();
  userEvent.click(screen.getByRole("button", { name: "Share location again" }));
  expect(screen.getByText("Demo sharing on")).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Meeting spot" })).toBeEnabled();
  expect(screen.getByRole("button", { name: "Meeting spot" })).toHaveAttribute("aria-pressed", "true");
});

test("marks arrival once and explains that no notification was sent", () => {
  renderPage();
  userEvent.click(screen.getByRole("button", { name: "I’ve arrived" }));
  expect(screen.getByRole("heading", { name: "You’ve arrived" })).toBeInTheDocument();
  expect(screen.getByRole("heading", { name: "Sara Moon" })).toBeInTheDocument();
  userEvent.click(screen.getByRole("link", { name: "View meeting location" }));
  expect(screen.getByRole("button", { name: "View arrival details" })).toBeInTheDocument();
  expect(screen.getByText(/No notification has been sent to Sara/)).toBeInTheDocument();
  expect(screen.getByRole("link", { name: "Help" })).toHaveAttribute("href", "/help");
});

test("opens from the session with the latest meeting instructions and returns", () => {
  render(
    <MemoryRouter initialEntries={["/teaching-session-details"]}>
      <Routes>
        <Route path="/teaching-session-details" element={<TeachingSessionDetails />} />
        <Route path="/location-shared" element={<LocationShared />} />
        <Route path="/arrived" element={<Arrived />} />
      </Routes>
    </MemoryRouter>
  );
  userEvent.click(screen.getByRole("button", { name: "Edit meeting instructions" }));
  fireEvent.change(screen.getByRole("textbox", { name: "Meeting instructions" }), { target: { value: "Meet inside the main entrance." } });
  userEvent.click(screen.getByRole("button", { name: "Save instructions" }));
  expect(screen.getByText("Meet inside the main entrance.")).toBeInTheDocument();
  userEvent.click(screen.getByRole("link", { name: "Share / view location" }));
  expect(screen.getByRole("heading", { name: "Find each other" })).toBeInTheDocument();
  expect(screen.getAllByText("Meet inside the main entrance.")).toHaveLength(2);
  userEvent.click(screen.getByRole("button", { name: "I’ve arrived" }));
  userEvent.click(screen.getByRole("link", { name: "View meeting location" }));
  userEvent.click(screen.getByRole("link", { name: "Back to session details" }));
  expect(screen.getByRole("heading", { name: "Skating basics with Sara Moon" })).toBeInTheDocument();
  expect(screen.getByText("Meet inside the main entrance.")).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "✓ Arrival marked" })).toBeDisabled();
});
