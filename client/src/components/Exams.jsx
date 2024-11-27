import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Exams() {
  const [exams, setExams] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  // Function to fetch exams (all or filtered by search)
  const fetchExams = async (query = '') => {
    const authToken = localStorage.getItem('authToken');
    const endpoint = query
      ? `http://127.0.0.1:8000/api/search-exam/?search=${encodeURIComponent(query)}`
      : 'http://127.0.0.1:8000/api/list-exams/';
    try {
      const response = await axios.get(endpoint, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      setExams(response.data.exams);
    } catch (error) {
      console.error('Error fetching exams:', error);
    }
  };

  // Check if user is logged in and handle redirection
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const authToken = localStorage.getItem('authToken');

    if (!isLoggedIn || !authToken) {
      navigate('/login'); // Redirect to login if not logged in
    } else {
      // Attempt to validate the token by making a protected API call
      axios
        .get('http://127.0.0.1:8000/api/list-exams/', {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        })
        .then(() => {
          fetchExams(); // Fetch exams if token is valid
        })
        .catch(() => {
          localStorage.removeItem('authToken'); // Remove invalid token
          localStorage.setItem('isLoggedIn', 'false'); // Update login state
          navigate('/'); // Redirect to login
        });
    }
  }, [navigate]);

  // Handle search submission
  const handleSearch = () => {
    fetchExams(searchQuery);
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <div className="flex justify-between mb-4">
        <button
          onClick={() => navigate('/add-exam')}
          className="bg-blue-600 text-white px-4 py-2 rounded-md"
        >
          Add Exam
        </button>
        <div className="flex items-center">
          <input
            type="text"
            placeholder="Search exam..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border px-3 py-2 rounded-l-md"
          />
          <button
            onClick={handleSearch}
            className="bg-blue-600 text-white px-4 py-2 rounded-r-md"
          >
            Search
          </button>
        </div>
      </div>
      <h2 className="text-2xl font-bold mb-4 text-blue-600">Exams</h2>
      {exams.length > 0 ? (
        <ul>
          {exams.map((exam, index) => (
            <li
              key={index}
              className="border p-4 mb-2 rounded shadow cursor-pointer hover:bg-gray-100"
              onClick={() => navigate(`/exam/${exam.exam_name}`)}
            >
              <h3 className="text-lg font-semibold">{exam.exam_name}</h3>
              <p className="text-gray-600"><strong>Course Code:</strong> {exam.course_code}</p>
              <p className="text-gray-500 text-sm"><strong>Generated On:</strong> {new Date(exam.created_at).toLocaleDateString()}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No exams available.</p>
      )}
    </div>
  );
}

export default Exams;