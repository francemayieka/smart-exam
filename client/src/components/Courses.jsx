import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Courses() {
  const [courses, setCourses] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Function to fetch courses (all or filtered by search)
  const fetchCourses = async (query = '') => {
    try {
      setLoading(true);
      const authToken = localStorage.getItem('authToken');
      const endpoint = query
        ? `http://localhost:8000/api/search-course/?search_query=${encodeURIComponent(query)}`
        : 'http://127.0.0.1:8000/api/list-courses/';
      const response = await axios.get(endpoint, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      setCourses(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching courses:', error);
      alert('Failed to fetch courses.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  // Handle search submission
  const handleSearch = () => {
    fetchCourses(searchQuery);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-4">
      <div className="flex justify-between mb-4">
        <button
          onClick={() => navigate('/add-course')}
          className="bg-blue-600 text-white px-4 py-2 rounded-md"
        >
          Add Course
        </button>
        <div className="flex items-center">
          <input
            type="text"
            placeholder="Search course..."
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
      <h2 className="text-2xl font-bold mb-4 text-blue-600">Courses</h2>
      {courses.length > 0 ? (
        <ul>
          {courses.map((course) => (
            <li
              key={course.course_id}
              className="border p-4 mb-2 rounded shadow cursor-pointer hover:bg-gray-100"
              onClick={() => navigate(`/course/${course.course_code}`)}
            >
              <h3 className="text-lg font-semibold">
                {course.course_code}: {course.course_name}
              </h3>
              <p className="text-gray-700">{course.course_outline}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No courses available.</p>
      )}
    </div>
  );
}

export default Courses;
