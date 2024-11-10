import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Courses from "./pages/Courses";
import AddNewCourse from "./pages/AddNewCourse";
import CourseDetailsPage from "./pages/CourseDetailsPage";
import { useState, useEffect } from "react";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [accessToken, setAccessToken] = useState("");  // New state to store the access token

  useEffect(() => {
    const storedToken = localStorage.getItem("access_token");
    const storedUsername = localStorage.getItem("username");

    if (storedToken && storedUsername) {
      setIsLoggedIn(true);
      setUsername(storedUsername);
      setAccessToken(storedToken); // Set access token from localStorage if present
    }
  }, []);

  const handleLogin = (user, token) => {
    setIsLoggedIn(true);
    setUsername(user.username);
    setAccessToken(token);

    // Store the access token and username in localStorage
    localStorage.setItem("access_token", token);
    localStorage.setItem("username", user.username);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername("");
    setAccessToken("");

    // Remove access token and username from localStorage on logout
    localStorage.removeItem("access_token");
    localStorage.removeItem("username");
  };

  return (
    <Router>
      <Toaster position="top-center" />
      <Navbar
        isLoggedIn={isLoggedIn}
        username={username}
        handleLogout={handleLogout}
      />
      <Routes>
        <Route path="/" element={<Home isLoggedIn={isLoggedIn} />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login setLoggedIn={handleLogin} />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/courses" element={<Courses accessToken={accessToken} />} /> {/* Pass accessToken as a prop */}
        <Route path="/add-course" element={<AddNewCourse />} />
        <Route path="/course/:courseCode" element={<CourseDetailsPage />} />
      </Routes>
    </Router>
  );
}

export default App;
