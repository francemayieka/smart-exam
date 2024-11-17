import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AddExam() {
  const [examName, setExamName] = useState('');
  const [courseCode, setCourseCode] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const authToken = localStorage.getItem('authToken');
      // Sending course code and exam name to the backend to generate exam and marking scheme
      const response = await axios.post(
        'http://127.0.0.1:8000/api/generate-exam/',
        {
          course_code: courseCode,
          exam_name: examName,
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            'Content-Type': 'application/json',
          },
        }
      );
      alert('Exam generated successfully!');
      console.log(response.data);
      navigate('/exams');
    } catch (error) {
      console.error('Error generating exam:', error);
      alert('Failed to generate exam.');
    }
  };

  return (
    <div className="max-w-lg mx-auto p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-blue-600">Generate Exam</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Exam Name</label>
          <input
            type="text"
            value={examName}
            onChange={(e) => setExamName(e.target.value)}
            className="mt-1 block w-full border px-4 py-2 rounded-md"
            required
          />
        </div>
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
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded-md"
        >
          Generate Exam
        </button>
      </form>
    </div>
  );
}

export default AddExam;
