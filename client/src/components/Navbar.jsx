import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="bg-blue-600 text-white p-4">
      <div className="container mx-auto flex justify-between">
        <h1 className="text-xl font-bold">SmartExam</h1>
        <div>
          <Link to="/" className="px-4">Home</Link>
          <Link to="/courses" className="px-4">Courses</Link>
          <Link to="/login" className="px-4">Login</Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
