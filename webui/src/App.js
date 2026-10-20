import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Intro from "./pages/intro";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Intro />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
