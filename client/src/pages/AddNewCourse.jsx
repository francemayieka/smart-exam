import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const AddNewCourse = () => {
  const [courseData, setCourseData] = useState({
    course_code: "",
    course_name: "",
    course_outline: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCourseData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Get token from localStorage
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("You must be logged in to add a course");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8000/api/add-course/",
        courseData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Course added successfully!");
      navigate("/courses");
    } catch (error) {
      toast.error("Failed to add course");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Add New Course</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="course_code" className="block text-sm font-medium text-gray-700">
            Course Code
          </label>
          <input
            type="text"
            id="course_code"
            name="course_code"
            value={courseData.course_code}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="course_name" className="block text-sm font-medium text-gray-700">
            Course Name
          </label>
          <input
            type="text"
            id="course_name"
            name="course_name"
            value={courseData.course_name}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="course_outline" className="block text-sm font-medium text-gray-700">
            Course Outline
          </label>
          <textarea
            id="course_outline"
            name="course_outline"
            value={courseData.course_outline}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            required
          ></textarea>
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded shadow-md"
        >
          Add Course
        </button>
      </form>
    </div>
  );
};

export default AddNewCourse;
