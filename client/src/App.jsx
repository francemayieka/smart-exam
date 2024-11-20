import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Navbar from './components/Navbar';
import Home from './components/Home';
import AboutUs from './components/AboutUs';
import ContactUs from './components/ContactUs';
import Footer from './components/Footer';
import Login from './components/Login';
import SignUp from './components/SignUp';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import Courses from './components/Courses';
import AddCourse from './components/AddCourse';
import CourseDetails from './components/CourseDetails';
import Exams from './components/Exams';
import AddExam from './components/AddExam';
import ExamDetails from './components/ExamDetails';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem('isLoggedIn') === 'true'
  );
  const navigate = useNavigate(); // Hook for navigation

  const handleLogin = () => {
    localStorage.setItem('isLoggedIn', 'true');
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.setItem('isLoggedIn', 'false');
    setIsLoggedIn(false);
    navigate('/'); // Redirect to the home page
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <Navbar isLoggedIn={isLoggedIn} handleLogout={handleLogout} />

      {/* Main Content */}
      <div className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/contact-us" element={<ContactUs />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route
            path="/login"
            element={<Login onLogin={handleLogin} />}
          />
          <Route path="/courses" element={<Courses />} />
          <Route path="/add-course" element={<AddCourse />} />
          <Route path="/course/:courseId" element={<CourseDetails />} />
          <Route path="/exams" element={<Exams />} />
          <Route path="/add-exam" element={<AddExam />} />
          <Route path="/exam/:examName" element={<ExamDetails />} />
        </Routes>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}
