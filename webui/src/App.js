import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Intro from "./pages/intro";
import Book from "./pages/booking";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Intro />} />
        <Route path="/book" element={<Book />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
