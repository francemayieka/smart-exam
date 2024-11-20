import { Link } from 'react-router-dom';

const Navbar = ({ isLoggedIn, handleLogout }) => {
  return (
    <nav className="bg-blue-dark text-white p-6">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">SmartExam</Link>
        <div className="flex items-center space-x-4">
          <Link to="/courses" className="px-4">Courses</Link>
          <Link to="/exams" className="px-4">Exams</Link>
          <Link to="/about-us" className="px-4">About Us</Link>
          <Link to="/contact-us" className="px-4">Contact Us</Link>

          {/* Conditional Login/Logout */}
          {!isLoggedIn ? (
            <Link to="/login" className="px-4">Login</Link>
          ) : (
            <span
              className="px-4 cursor-pointer hover:underline"
              onClick={handleLogout}
            >
              Logout
            </span>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
