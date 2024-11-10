import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";  // Add useNavigate here
import { toast } from "react-toastify";
import SearchBar from "../components/SearchBar";
import CourseCard from "../components/CourseCard";

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();  // Initialize useNavigate hook
  const accessToken = localStorage.getItem("access_token"); // Assuming the access token is stored in localStorage

  useEffect(() => {
    fetch("http://localhost:8000/api/list-courses/", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch courses");
        }
        return response.json();
      })
      .then((data) => {
        setCourses(data);
      })
      .catch((error) => {
        toast.error("Failed to load courses!");
        console.error("Error:", error);
      });
  }, [accessToken]);

  // Function to handle redirect to the Add Course page
  const handleAddCourse = () => {
    navigate("/add-course");
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        {/* Update button to use handleAddCourse function */}
        <button
          onClick={handleAddCourse}
          className="btn flex items-center bg-blue-500 text-white py-2 px-4 rounded"
        >
          + Add New Course
        </button>
        <SearchBar />
      </div>

      <h2 className="text-2xl font-bold mb-4">Registered Courses</h2>

      <div className="overflow-x-auto">
        <table className="min-w-full table-auto">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left">Course Code</th>
              <th className="px-4 py-2 text-left">Course Name</th>
              <th className="px-4 py-2 text-left">Updated On</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course) => (
              <CourseCard key={course.course_code} course={course} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Courses;
