import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Login from './components/Login';
import Courses from './components/Courses';
import AddCourse from './components/AddCourse';
import CourseDetails from './components/CourseDetails';
import Exams from './components/Exams';
import AddExam from './components/AddExam';
import ExamDetails from './components/ExamDetails';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/add-course" element={<AddCourse />} />
        <Route path="/course/:courseId" element={<CourseDetails />} />
        <Route path="exams" element={<Exams />} />
        <Route path="add-exam" element={<AddExam />} />
        <Route path="exam/:examName" element={<ExamDetails />} />
      </Routes>
    </Router>
  );
}

export default App;
