import { BrowserRouter, Route, Routes } from "react-router-dom";
import Benifits from "./components/Benifits";
import About from "./components/About";
import Home from "./components/Home";
import Navbar from "./components/Navbar";
import Registration from "./components/registration";

const App = () => {
  return (
    <div>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/benefits" element={<Benifits />} />
          <Route path="/registration" element={<Registration />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
