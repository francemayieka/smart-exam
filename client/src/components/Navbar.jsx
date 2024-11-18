import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="bg-blue-dark text-white p-6">
      <div className="container mx-auto flex justify-between">
        <Link to="/" className="text-xl font-bold">SmartExam</Link>
        <div>
          <Link to="/courses" className="px-4">Courses</Link>
          <Link to="/exams" className="px-4">Exams</Link>
          <Link to="/about-us" className="px-4">About Us</Link>
          <Link to="/contact-us" className="px-4">Contact Us</Link>
          <Link to="/login" className="px-4">Login</Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;