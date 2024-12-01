import { BrowserRouter, Route, Routes } from "react-router-dom";
import Benifits from "./components/Benifits";
import About from "./components/About";
import Home from "./components/Home";
import Navbar from "./components/Navbar";
import Registration from "./components/Singup/Registration";
import Login from "./components/Singup/Login";
import StartWorkout from "./components/workouts/StartWorkout";
import ProfilePage from "./components/Profile";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { UserProvider } from "./context/userContext";

const App = () => {
  const clientid = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  return (
    <GoogleOAuthProvider clientId={clientid}>
      <UserProvider>
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/benefits" element={<Benifits />} />
            <Route path="/registration" element={<Registration />} />
            <Route path="/login" element={<Login />} />
            <Route path="/start-workout" element={<StartWorkout />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/workout" element={<StartWorkout />} />
          </Routes>
        </BrowserRouter>
      </UserProvider>
    </GoogleOAuthProvider>
  );
};

export default App;
