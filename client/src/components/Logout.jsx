import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Clear the authentication token and login status
    localStorage.removeItem('authToken');
    localStorage.setItem('isLoggedIn', 'false'); // Mark the user as logged out

    // Redirect to the login page after logging out
    navigate('/login');
  }, [navigate]);

  return (
    <div>
      <h1>Logging out...</h1>
    </div>
  );
};

export default Logout;