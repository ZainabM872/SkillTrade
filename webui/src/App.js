import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Intro from "./pages/intro";
import Booking from "./pages/booking";
import Sessions from "./pages/sessions";
import SessionDetails from "./pages/session_detail";
import Teach from "./pages/teach";
import Availability from "./pages/availability";
import Signup from "./pages/signup";
import Guidelines from "./pages/community-guidelines";
import Profile from "./pages/profile";
import Settings from "./pages/settings";
import Help from "./pages/help";
import ResetPassword from "./pages/reset-password";
import ResetSent from "./pages/reset-sent";
import SupportSent from "./pages/support-sent";
import ContactSupport from "./pages/contact-support";
import TeachingSessionDetails from "./pages/teaching-session-details";
import CompletedSessionDetails from "./pages/completed-session-details";
import TeachingLocations from "./pages/teaching-locations";

import RateSession from "./pages/rate-session";
import LocationShared from "./pages/location-shared";
import MeetingLocation from "./pages/meeting-location";
import Arrived from "./pages/arrived";
import SessionStarted from "./pages/session-started";
import SkillPointsFaq from "./pages/skill-points-faq";
import ReviewListing from "./pages/review_listing";
import Notifications from "./pages/notifications";
import ReliabilityFaq from "./pages/reliability-faq";

import Home from "./pages/homepage";
import Explore from "./pages/explore";
import BookingFAQ from "./pages/booking-faq";
import CancellationFAQ from "./pages/cancellation-faq";
import NoShowFAQ from "./pages/noshow-faq";
import TeachingFAQ from "./pages/teaching-faq";
import SkillDetail from "./pages/skill-details";
import UserListing from "./pages/user-listing";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Intro />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="/sessions" element={<Sessions />} />
        <Route path="/sessions/:id" element={<SessionDetails />} />
        <Route path="/teach" element={<Teach />} />
        <Route path="/teach/availability" element={<Availability />} />
        <Route path="/teach/review-listing" element={<ReviewListing />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/guidelines" element={<Guidelines />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/teaching-locations" element={<TeachingLocations />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/reliability-faq" element={<ReliabilityFaq />} />
        <Route path="/skill-points-faq" element={<SkillPointsFaq />} />
        <Route
          path="/points"
          element={<Navigate to="/skill-points-faq" replace />}
        />
        <Route path="/help" element={<Help />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/reset-sent" element={<ResetSent />} />
        <Route path="/support-sent" element={<SupportSent />} />
        <Route path="/contact-support" element={<ContactSupport />} />
        <Route
          path="/teaching-session-details"
          element={<TeachingSessionDetails />}
        />
        <Route path="/session-started" element={<SessionStarted />} />
        <Route path="/arrived" element={<Arrived />} />
        <Route path="/meeting-location" element={<MeetingLocation />} />
        <Route path="/location-shared" element={<LocationShared />} />
        <Route path="/rate-session" element={<RateSession />} />
        <Route
          path="/completed-session-details"
          element={<CompletedSessionDetails />}
        />{" "}
        <Route path="/sessions" element={<Sessions />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="/sessions" element={<Sessions />} />
        <Route path="/sessions/:id" element={<SessionDetails />} />
        <Route path="/teach" element={<Teach />} />
        <Route path="/teach/availability" element={<Availability />} />
        <Route path="/homepage" element={<Home />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/booking-faq" element={<BookingFAQ />} />
        <Route path="/cancellation-faq" element={<CancellationFAQ />} />
        <Route path="/noshow-faq" element={<NoShowFAQ />} />
        <Route path="/teaching-faq" element={<TeachingFAQ />} />
        <Route path="/skills/:skillId" element={<SkillDetail />} />
        <Route path="/mylisting/:listingId" element={<UserListing />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
