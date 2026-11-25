import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import Booking from "./booking";
import MeetingLocation from "./meeting-location";
import LocationShared from "./location-shared";
import Arrived from "./arrived";
import SessionStarted from "./session-started";
import RateSession from "./rate-session";
import SessionDetails from "./session_detail";
import TeachingLocations from "./teaching-locations";
import ReviewListing from "./review_listing";
import Availability from "./availability";

beforeAll(() => {
  HTMLDialogElement.prototype.showModal = function () { this.setAttribute("open", ""); };
  HTMLDialogElement.prototype.close = function () { this.removeAttribute("open"); };
});
afterAll(() => {
  delete HTMLDialogElement.prototype.showModal;
  delete HTMLDialogElement.prototype.close;
});
const originalFetch = global.fetch;
beforeEach(() => {
  localStorage.clear();
  global.fetch = jest.fn().mockResolvedValue({ ok: true, json: async () => [{ ...listing, listing_id: 7 }] });
});
afterEach(() => { global.fetch = originalFetch; });
function flow(entry) {
  return render(<MemoryRouter initialEntries={[entry]}><Routes>
    <Route path="/booking" element={<Booking />} />
    <Route path="/meeting-location" element={<MeetingLocation />} />
    <Route path="/location-shared" element={<LocationShared />} />
    <Route path="/arrived" element={<Arrived />} />
    <Route path="/session-started" element={<SessionStarted />} />
    <Route path="/rate-session" element={<RateSession />} />
    <Route path="/sessions/:id" element={<SessionDetails />} />
    <Route path="/sessions" element={<h1>Your sessions</h1>} />
    <Route path="/teach/availability" element={<Availability />} />
    <Route path="/teach/meeting-details" element={<TeachingLocations />} />
    <Route path="/teach/review-listing" element={<ReviewListing />} />
  </Routes></MemoryRouter>);
}
const listing = {
  listing_id: "preview-ceramics", title: "Ceramics", teacher_name: "Casey Lee",
  duration_minutes: 90, point_cost: 25, session_mode: "in-person",
  meetingLocations: [{ name: "Studio entrance", note: "Meet by the blue door." }],
};

test("booking carries the chosen listing through meeting, arrival, completion, and rating", async () => {
  flow("/booking?listing=7");
  userEvent.click(await screen.findByRole("link", { name: "Choose meeting location" }));
  userEvent.click(screen.getByRole("radio", { name: "Studio entrance" }));
  userEvent.click(screen.getByRole("button", { name: "Confirm meeting location" }));
  userEvent.click(await screen.findByRole("link", { name: "Continue to finding each other" }));
  expect(screen.getByRole("heading", { name: "Shared with Casey" })).toBeInTheDocument();
  userEvent.click(screen.getByRole("button", { name: "I’ve arrived" }));
  expect(screen.getByRole("heading", { name: "Studio entrance" })).toBeInTheDocument();
  userEvent.click(screen.getByRole("button", { name: "We found each other" }));
  userEvent.click(screen.getByRole("button", { name: "Yes, we’re together" }));
  userEvent.click(await screen.findByRole("link", { name: "Start the demo session" }));
  expect(screen.getByText("90 minutes")).toBeInTheDocument();
  expect(screen.getByText("25 points")).toBeInTheDocument();
  userEvent.click(screen.getByRole("button", { name: "Finish session" }));
  userEvent.click(screen.getByRole("button", { name: "Yes, finish session" }));
  userEvent.click(await screen.findByRole("link", { name: "Rate your session" }));
  expect(screen.getByRole("heading", { name: "How was your session with Casey?" })).toBeInTheDocument();
  expect(screen.getByRole("heading", { name: "Ceramics" })).toBeInTheDocument();
  userEvent.click(screen.getByRole("radio", { name: "4 stars — Very good" }));
  userEvent.click(screen.getByRole("button", { name: "Submit rating" }));
  await screen.findByRole("heading", { name: "Thanks for sharing." });
  expect(JSON.parse(localStorage.getItem("skilltrade.sessionRating.7.v1")).rating).toBe(4);
});

test.each(["I’ve arrived", "Share location"])("session details connects %s to the correct participant", async (action) => {
  flow("/sessions/ses_001");
  userEvent.click(await screen.findByRole("button", { name: action }));
  if (action === "I’ve arrived") expect(screen.getByRole("heading", { name: "Alex Morgan" })).toBeInTheDocument();
  else expect(screen.getByRole("heading", { name: "Shared with Alex" })).toBeInTheDocument();
  expect(screen.getAllByText("Meet by the reception desk in the lobby.").length).toBeGreaterThan(0);
});

test("teaching locations saves and carries the skill and availability into listing review", async () => {
  flow({ pathname: "/teach/meeting-details", state: {
    skill: { title: "Pottery", category: "art", difficulty: "beginner", description: "Make a bowl.", format: "in-person" },
    duration: 90, availability: { Tue: ["14:00"] },
  } });
  expect(screen.queryByRole("link", { name: /Continue to listing review/ })).not.toBeInTheDocument();
  fireEvent.change(screen.getByRole("textbox", { name: "Location name" }), { target: { value: "Art studio" } });
  userEvent.click(screen.getByRole("button", { name: "Save locations" }));
  userEvent.click(await screen.findByRole("link", { name: /Continue to listing review/ }));
  expect(screen.getByText("Pottery")).toBeInTheDocument();
  expect(screen.getByText("Art studio")).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Publish skill" })).toBeInTheDocument();
  expect(localStorage.getItem("skilltrade.listingDraft.v1")).toBeNull();
});

test("online booking retains the teammate's existing request and Sessions flow", async () => {
  global.fetch.mockResolvedValue({ ok: true, json: async () => [{ ...listing, listing_id: 7, session_mode: "online" }] });
  flow("/booking?listing=7");
  const requestButton = screen.getByRole("button", { name: "Request session" });
  await waitFor(() => expect(requestButton).toBeEnabled());
  expect(screen.queryByRole("link", { name: "Choose meeting location" })).not.toBeInTheDocument();
  userEvent.click(requestButton);
  userEvent.click(screen.getByRole("button", { name: "View Sessions" }));
  expect(screen.getByRole("heading", { name: "Your sessions" })).toBeInTheDocument();
});

test("database-backed booking opens the matching listing's location preview", async () => {
  const originalFetch = global.fetch;
  global.fetch = jest.fn().mockResolvedValue({ ok: true, json: async () => [{ ...listing, listing_id: 7, title: "Photography", teacher_name: "Riley Park", meetingLocations: undefined }] });
  try {
    flow("/booking?listing=7");
    const continueButton = await screen.findByRole("link", { name: "Choose meeting location" });
    userEvent.click(continueButton);
    expect(screen.getByRole("heading", { name: "Photography" })).toBeInTheDocument();
    expect(screen.getByText("with Riley Park")).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: "Mac Hall, food court" })).toBeInTheDocument();
    expect(global.fetch).toHaveBeenCalledWith("/api/listings", expect.objectContaining({ headers: { Accept: "application/json" } }));
  } finally {
    global.fetch = originalFetch;
  }
});


test("in-person booking keeps its original request popup alongside the new location link", async () => {
  flow("/booking?listing=7");
  await screen.findByRole("link", { name: "Choose meeting location" });
  userEvent.click(screen.getByRole("button", { name: "Request session" }));
  expect(screen.getByRole("button", { name: "View Sessions" })).toBeInTheDocument();
});

test("returning from Teaching locations restores the teammate's existing availability form", () => {
  flow({ pathname: "/teach/meeting-details", state: {
    skill: { title: "Pottery" }, duration: 90, availability: { Tue: ["14:00"] },
  } });
  userEvent.click(screen.getByRole("link", { name: "Back to profile" }));
  expect(screen.getByRole("button", { name: "90 minutes" })).toHaveAttribute("aria-pressed", "true");
  expect(screen.getByRole("button", { name: "Tue" })).toHaveAttribute("aria-pressed", "true");
  expect(screen.getByRole("button", { name: "Remove 2:00 PM on Tue" })).toBeInTheDocument();
});
