import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AddCourse() {
  const [courseCode, setCourseCode] = useState('');
  const [courseName, setCourseName] = useState('');
  const [courseOutline, setCourseOutline] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const authToken = localStorage.getItem('authToken');
      await axios.post(
        'http://127.0.0.1:8000/api/add-course/',
        {
          course_code: courseCode,
          course_name: courseName,
          course_outline: courseOutline,
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            'Content-Type': 'application/json',
          },
        }
      );
      alert('Course added successfully!');
      navigate('/courses');
    } catch (error) {
      console.error('Error adding course:', error);
      alert('Failed to add course.');
    }
  };

  return (
    <div className="max-w-lg mx-auto p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-blue-600">Add Course</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Course Code</label>
          <input
            type="text"
            value={courseCode}
            onChange={(e) => setCourseCode(e.target.value)}
            className="mt-1 block w-full border px-4 py-2 rounded-md"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Course Name</label>
          <input
            type="text"
            value={courseName}
            onChange={(e) => setCourseName(e.target.value)}
            className="mt-1 block w-full border px-4 py-2 rounded-md"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Course Outline</label>
          <textarea
            value={courseOutline}
            onChange={(e) => setCourseOutline(e.target.value)}
            className="mt-1 block w-full border px-4 py-2 rounded-md"
            rows="3"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded-md"
        >
          Add Course
        </button>
      </form>
    </div>
  );
}

export default AddCourse;
