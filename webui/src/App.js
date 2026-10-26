
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Intro from "./pages/intro";
import Signup from "./pages/signup";
import Guidelines from "./pages/community-guidelines";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Intro />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/guidelines" element={<Guidelines />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
