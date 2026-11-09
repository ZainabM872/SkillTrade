
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Intro from "./pages/intro";
import Booking from "./pages/booking";
import Sessions from "./pages/sessions"
import Session_Details from "./pages/session_detail"
import Teach from "./pages/teach"
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

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Intro />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="/sessions" element={<Sessions />} />
        <Route path="/sessions/:id" element= {<Session_Details />} />
        <Route path="/teach" element= {<Teach />} />
        <Route path="/teach/availability" element= {<Availability />} />


        <Route path="/signup" element={<Signup />} />
        <Route path="/guidelines" element={<Guidelines />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/help" element={<Help />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/reset-sent" element={<ResetSent />} />
        <Route path="/support-sent" element={<SupportSent />} />
        <Route path="/contact-support" element={<ContactSupport />} />
        <Route path="/teaching-session-details" element={<TeachingSessionDetails />} />
        <Route path="/completed-session-details" element={<CompletedSessionDetails />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
