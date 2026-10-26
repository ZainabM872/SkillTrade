
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Intro from "./pages/intro";
import Signup from "./pages/signup";
import Guidelines from "./pages/community-guidelines";
import Profile from "./pages/profile";
import Settings from "./pages/settings";
import Help from "./pages/help";
import ResetPassword from "./pages/reset-password";
import ResetSent from "./pages/reset-sent";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Intro />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/guidelines" element={<Guidelines />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/help" element={<Help />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/reset-sent" element={<ResetSent />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
