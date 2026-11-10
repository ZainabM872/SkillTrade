import React from "react";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import MeetingLocation from "./meeting-location";
import LocationShared from "./location-shared";

const storageKey = "skilltrade.meetingLocation.demo.v1";
function renderPage() {
  return render(<MemoryRouter><MeetingLocation /></MemoryRouter>);
}
beforeEach(() => localStorage.clear());
afterEach(() => jest.restoreAllMocks());

test("requires a location and updates the live booking preview", () => {
  renderPage();
  userEvent.click(screen.getByRole("button", { name: "Confirm meeting location" }));
  expect(screen.getByRole("alert")).toHaveTextContent("Choose a meeting location");
  expect(screen.getByRole("radio", { name: "Mac Hall, food court" })).toHaveFocus();
  expect(localStorage.getItem(storageKey)).toBeNull();
  userEvent.click(screen.getByRole("radio", { name: "TFDL, second floor" }));
  expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  const preview = screen.getByRole("complementary", { name: "Booking preview" });
  expect(within(preview).getByRole("heading", { name: "TFDL, second floor" })).toBeInTheDocument();
  expect(within(preview).getByText("Meet by the elevators on the second floor.")).toBeInTheDocument();
});

test("saves, restores after remount, and changes a confirmed choice", async () => {
  const page = renderPage();
  userEvent.click(screen.getByRole("radio", { name: "Mac Hall, food court" }));
  userEvent.click(screen.getByRole("button", { name: "Confirm meeting location" }));
  expect(screen.getByRole("button", { name: "Saving location…" })).toBeDisabled();
  expect(screen.getByRole("radio", { name: "Mac Hall, food court" })).toBeDisabled();
  await screen.findByRole("heading", { name: "You know where to meet." });
  expect(localStorage.getItem(storageKey)).toBe("mac");
  expect(screen.getByRole("heading", { name: "You know where to meet." })).toHaveFocus();
  page.unmount();
  renderPage();
  expect(screen.getByRole("heading", { name: "You know where to meet." })).toBeInTheDocument();
  userEvent.click(screen.getByRole("button", { name: "Change location" }));
  expect(screen.getByRole("radio", { name: "Mac Hall, food court" })).toBeChecked();
  expect(screen.getByRole("radio", { name: "Mac Hall, food court" })).toHaveFocus();
  userEvent.click(screen.getByRole("radio", { name: "TFDL, second floor" }));
  expect(localStorage.getItem(storageKey)).toBe("mac");
  userEvent.click(screen.getByRole("button", { name: "Confirm meeting location" }));
  await screen.findByRole("heading", { name: "You know where to meet." });
  expect(localStorage.getItem(storageKey)).toBe("tfdl");
});

test("ignores an invalid saved ID and preserves the selection after a failed save", async () => {
  localStorage.setItem(storageKey, "unknown");
  renderPage();
  expect(screen.getByRole("radio", { name: "Mac Hall, food court" })).not.toBeChecked();
  userEvent.click(screen.getByRole("radio", { name: "TFDL, second floor" }));
  const write = jest.spyOn(Storage.prototype, "setItem").mockImplementation(() => { throw new Error("Storage unavailable"); });
  userEvent.click(screen.getByRole("button", { name: "Confirm meeting location" }));
  await waitFor(() => expect(screen.getByRole("status")).toHaveTextContent("Couldn’t save"));
  expect(screen.getByRole("radio", { name: "TFDL, second floor" })).toBeChecked();
  expect(screen.getByRole("button", { name: "Confirm meeting location" })).toBeEnabled();
  write.mockRestore();
  userEvent.click(screen.getByRole("button", { name: "Confirm meeting location" }));
  await screen.findByRole("heading", { name: "You know where to meet." });
});

test.each([
  ["Mac Hall, food court", "Meet by the Dairy Queen in Mac Hall."],
  ["TFDL, second floor", "Meet by the elevators on the second floor."],
])("carries %s and Alex's session into the sharing view", async (name, instructions) => {
  render(
    <MemoryRouter initialEntries={["/meeting-location"]}>
      <Routes>
        <Route path="/meeting-location" element={<MeetingLocation />} />
        <Route path="/location-shared" element={<LocationShared />} />
      </Routes>
    </MemoryRouter>
  );
  userEvent.click(screen.getByRole("radio", { name }));
  userEvent.click(screen.getByRole("button", { name: "Confirm meeting location" }));
  await screen.findByRole("heading", { name: "You know where to meet." });
  userEvent.click(screen.getByRole("link", { name: "Continue to finding each other" }));
  expect(screen.getByRole("heading", { name: "Shared with Alex" })).toBeInTheDocument();
  expect(screen.getByRole("heading", { name })).toBeInTheDocument();
  expect(screen.getAllByText(instructions)).toHaveLength(2);
  expect(screen.getByText("Acoustic Guitar · In person")).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Alex", exact: true })).toBeInTheDocument();
  userEvent.click(screen.getByRole("link", { name: "Back to meeting location" }));
  userEvent.click(screen.getByRole("button", { name: "Change location" }));
  expect(screen.getByRole("radio", { name })).toBeChecked();
});
