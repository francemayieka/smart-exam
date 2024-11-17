import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/forgot-password/', { email });
      toast.success(response.data.message || 'Password reset instructions sent to your email.');
      setLoading(false);

      // Redirect to the reset password page
      navigate('/reset-password');
    } catch (error) {
      console.error('Error sending reset password email:', error);
      toast.error('Failed to send password reset instructions. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-blue-600 mb-4">Forgot Password</h2>
      <form onSubmit={handleForgotPassword}>
        <div className="mb-4">
          <label className="block mb-2">Email</label>
          <input
            type="email"
            className="border w-full p-2 rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="bg-blue-600 text-white w-full p-2 rounded" disabled={loading}>
          {loading ? 'Sending...' : 'Send Reset Instructions'}
        </button>
      </form>
      
      {/* Toast container to render toast notifications */}
      <ToastContainer />
    </div>
  );
}

export default ForgotPassword;
