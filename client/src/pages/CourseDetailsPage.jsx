import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const CourseDetailsPage = () => {
  const { courseCode } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);

  useEffect(() => {
    axios
      .get(`/api/search-course/${courseCode}/`)
      .then((response) => {
        setCourse(response.data);
      })
      .catch((error) => {
        toast.error("Course not found!");
      });
  }, [courseCode]);

  const handleDelete = () => {
    axios
      .delete(`/api/delete-course/${courseCode}/`)
      .then(() => {
        toast.success("Course deleted successfully");
        navigate("/");
      })
      .catch(() => toast.error("Failed to delete course"));
  };

  const handleUpdate = () => {
    navigate(`/update-course/${courseCode}`);
  };

  if (!course) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-3xl font-bold">{course.course_name}</h2>
      <p className="text-lg">{course.course_code}</p>
      <a href={course.course_outline} className="text-blue-500 hover:underline">
        View Course Outline
      </a>
      <div className="flex mt-4">
        <button onClick={handleUpdate} className="bg-blue-500 text-white py-2 px-4 rounded mr-4">
          Update Course
        </button>
        <button onClick={handleDelete} className="bg-red-500 text-white py-2 px-4 rounded">
          Delete Course
        </button>
      </div>
    </div>
  );
};

export default CourseDetailsPage;
