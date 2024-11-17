import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function ResetPassword() {
  const [username, setUsername] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.patch('http://127.0.0.1:8000/api/reset-password/', { username, otp, new_password: newPassword });
      setMessage(response.data.message || 'Password reset successfully.');
      setLoading(false);
      
      // Redirect to login after a successful password reset
      setTimeout(() => {
        navigate('/login');
      }, 2000); // Wait for 2 seconds before redirecting
    } catch (error) {
      console.error('Error resetting password:', error);
      setMessage('Failed to reset password. Please check the details and try again.');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-blue-600 mb-4">Reset Password</h2>
      <form onSubmit={handleResetPassword}>
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
          <label className="block mb-2">OTP</label>
          <input
            type="text"
            className="border w-full p-2 rounded"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">New Password</label>
          <input
            type="password"
            className="border w-full p-2 rounded"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="bg-blue-600 text-white w-full p-2 rounded" disabled={loading}>
          {loading ? 'Resetting...' : 'Reset Password'}
        </button>
      </form>
      {message && <p className="mt-4 text-center text-gray-600">{message}</p>}
    </div>
  );
}

export default ResetPassword;
