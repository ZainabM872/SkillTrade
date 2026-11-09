import React from "react";
import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import TeachingLocations from "./teaching-locations";

const key = "skilltrade.teachingLocations.v1";
const renderPage = () => render(<MemoryRouter><TeachingLocations /></MemoryRouter>);
const fields = () => screen.getAllByRole("textbox", { name: "Location name" });
beforeEach(() => localStorage.clear());
afterEach(() => jest.restoreAllMocks());

test("adds a location in context and validates names before saving", () => {
  renderPage();
  expect(screen.getByText("Add a location name to see your learner preview.")).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: /Add another location/ }));
  expect(fields()).toHaveLength(2);
  expect(fields()[1]).toHaveFocus();
  fireEvent.click(screen.getByRole("button", { name: "Save locations" }));
  expect(fields()[0]).toHaveFocus();
  expect(fields()[0]).toHaveAttribute("aria-invalid", "true");
  expect(localStorage.getItem(key)).toBeNull();
  fireEvent.change(fields()[0], { target: { value: "Mac Hall" } });
  const preview = screen.getByRole("complementary", { name: "Where will we meet?" });
  expect(within(preview).getByRole("heading", { name: "Mac Hall" })).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "Remove location 2" }));
  expect(fields()).toHaveLength(1);
  expect(screen.queryByRole("button", { name: /Remove location/ })).not.toBeInTheDocument();
});

test("saves trimmed locations, reloads them, and discards later draft changes", async () => {
  const page = renderPage();
  fireEvent.change(fields()[0], { target: { value: "  Mac Hall  " } });
  fireEvent.change(screen.getByRole("textbox", { name: /Meeting instructions/ }), { target: { value: "  Food court entrance  " } });
  fireEvent.click(screen.getByRole("button", { name: "Save locations" }));
  expect(screen.getByRole("button", { name: "Saving…" })).toBeDisabled();
  await waitFor(() => expect(screen.getByRole("status")).toHaveTextContent("Locations saved on this device."));
  expect(JSON.parse(localStorage.getItem(key))).toEqual([{ name: "Mac Hall", note: "Food court entrance" }]);
  page.unmount();
  renderPage();
  expect(fields()[0]).toHaveValue("Mac Hall");
  fireEvent.change(fields()[0], { target: { value: "Unsaved draft" } });
  fireEvent.click(screen.getByRole("button", { name: "Discard changes" }));
  expect(fields()[0]).toHaveValue("Mac Hall");
  expect(screen.getByRole("button", { name: "Save locations" })).toBeDisabled();
});

test("keeps the draft recoverable when browser storage fails", async () => {
  renderPage();
  fireEvent.change(fields()[0], { target: { value: "TFDL" } });
  const write = jest.spyOn(Storage.prototype, "setItem").mockImplementation(() => { throw new Error("Storage full"); });
  fireEvent.click(screen.getByRole("button", { name: "Save locations" }));
  await waitFor(() => expect(screen.getByRole("status")).toHaveTextContent("Couldn’t save"));
  expect(fields()[0]).toHaveValue("TFDL");
  expect(screen.getByRole("button", { name: "Save locations" })).toBeEnabled();
  write.mockRestore();
  fireEvent.click(screen.getByRole("button", { name: "Save locations" }));
  await waitFor(() => expect(screen.getByRole("status")).toHaveTextContent("Locations saved"));
});

test("handles malformed saved data and links to existing app routes", () => {
  localStorage.setItem(key, "invalid JSON");
  renderPage();
  expect(fields()).toHaveLength(1);
  expect(screen.getByRole("link", { name: "Back to profile" })).toHaveAttribute("href", "/profile");
  expect(screen.getByRole("link", { name: "Help" })).toHaveAttribute("href", "/help");
});
