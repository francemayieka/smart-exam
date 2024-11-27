import { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/login/', { username, password });

      const { access_token, message } = response.data;

      localStorage.setItem('authToken', access_token);
      onLogin(); // Update state in App.jsx

      toast.success(`${message} You are logged in successfully!`);
      setUsername('');
      setPassword('');
      navigate('/');
    } catch (error) {
      toast.error('Login failed. Please check your credentials and try again.');
      console.error('Error during login:', error);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-blue-600 mb-4">Login</h2>
      <form onSubmit={handleLogin}>
        <div className="mb-4">
          <label className="block mb-2">Username</label>
          <input
            type="text"
            className="border w-full p-2 rounded"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Password</label>
          <input
            type="password"
            className="border w-full p-2 rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="bg-blue-600 text-white w-full p-2 rounded">
          Login
        </button>
      </form>
      <div className="mt-4 text-center">
        <p>
          Don't have an Account? <Link to="/signup" className="text-blue-600">Sign Up</Link>
        </p>
        <p>
          <Link to="/forgot-password" className="text-blue-600">Forgot Password?</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
