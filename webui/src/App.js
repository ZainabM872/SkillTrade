import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Intro from "./pages/intro";
import Booking from "./pages/booking";
import Sessions from "./pages/sessions"
import Session_Details from "./pages/session_detail"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Intro />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="/sessions" element={<Sessions />} />
        <Route path="/sessions/:id" element= {<Session_Details />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
