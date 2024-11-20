import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const CourseDetails = () => {
    const { courseId } = useParams(); // Extract course code from the URL
    const [course, setCourse] = useState(null);
    const [showUpdateForm, setShowUpdateForm] = useState(false);
    const [updatedCourse, setUpdatedCourse] = useState({
        course_code: '',
        course_name: '',
        course_outline: '',
    });

    // Fetch the course details
    useEffect(() => {
        const fetchCourseDetails = async () => {
            const token = localStorage.getItem('authToken'); // Get token from localStorage
            if (!token) {
                console.error('No authorization token found');
                return;
            }

            try {
                const response = await axios.get(
                    `http://localhost:8000/api/search-course/?search_query=${encodeURIComponent(courseId)}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                console.log('Course details response:', response.data);
                if (response.data && response.data.length > 0) {
                    setCourse(response.data[0]);
                    setUpdatedCourse(response.data[0]);
                } else {
                    console.error('No course found for the given course code');
                }
            } catch (error) {
                console.error('Error fetching course details:', error);
            }
        };

        fetchCourseDetails();
    }, [courseId]);

    // Handle the update form visibility
    const handleUpdateClick = () => {
        setShowUpdateForm(true);
    };

    const handleUpdateChange = (e) => {
        const { name, value } = e.target;
        setUpdatedCourse({
            ...updatedCourse,
            [name]: value,
        });
    };

    const handleUpdateSubmit = async (e) => {
        e.preventDefault();
    
        const token = localStorage.getItem('authToken');
        if (!token) {
            alert('Please login to update the course.');
            return;
        }
    
        // Prepare the payload with only the fields that have been updated
        const updatedData = {};
    
        // Only add properties that are changed
        if (updatedCourse.course_name !== course.course_name) {
            updatedData.course_name = updatedCourse.course_name;
        }
        if (updatedCourse.course_outline !== course.course_outline) {
            updatedData.course_outline = updatedCourse.course_outline;
        }
    
        // If nothing has changed, don't send the request
        if (Object.keys(updatedData).length === 0) {
            alert('No changes made.');
            return;
        }
    
        try {
            // Make the PATCH request with only the updated fields
            await axios.patch(
                `http://localhost:8000/api/update-course/${encodeURIComponent(courseId)}/`,
                updatedData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            // After updating, close the form and refresh course details
            setShowUpdateForm(false);
            setCourse((prevCourse) => ({
                ...prevCourse,
                ...updatedData, // Update only the changed fields
            }));
            alert('Course updated successfully!');
        } catch (error) {
            console.error('Error updating course:', error);
            alert('Failed to update the course.');
        }
    };

    const handleDelete = async () => {
        const token = localStorage.getItem('authToken');
        if (!token) {
            alert('Please login to delete the course.');
            return;
        }

        const confirmDelete = window.confirm('Are you sure you want to delete this course?');
        if (confirmDelete) {
            try {
                await axios.delete(
                    `http://localhost:8000/api/delete-course/${encodeURIComponent(courseId)}/`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                alert('Course deleted successfully!');
                // Redirect to courses list after deletion
                window.location.href = '/courses';
            } catch (error) {
                console.error('Error deleting course:', error);
                alert('Failed to delete the course.');
            }
        }
    };

    // If course is not loaded yet, show loading
    if (!course) {
        return <div className="text-center py-10 text-lg">Loading...</div>;
    }

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg mt-8">
            <h1 className="text-3xl font-bold mb-4 text-center">{course.course_name}</h1>
            <p className="text-gray-700 mb-2"><strong>Course Code:</strong> {course.course_code}</p>
            <p className="text-gray-700 mb-4"><strong>Outline:</strong> {course.course_outline}</p>
            <p className="text-gray-700 mb-4"><strong>Institution:</strong> {course.university_name}</p>

            <div className="flex justify-center space-x-6 mt-6">
                <button
                    onClick={handleUpdateClick}
                    className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition"
                >
                    Update
                </button>
                <button
                    onClick={handleDelete}
                    className="bg-red-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition"
                >
                    Delete
                </button>
            </div>

            {showUpdateForm && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                        <h2 className="text-2xl font-bold mb-4 text-center">Update Course</h2>
                        <form onSubmit={handleUpdateSubmit}>
                            <div className="mb-4">
                                <label htmlFor="course_code" className="block text-sm font-medium text-gray-700">Course Code</label>
                                <input
                                    type="text"
                                    name="course_code"
                                    value={updatedCourse.course_code}
                                    onChange={handleUpdateChange}
                                    className="mt-1 block w-full px-4 py-2 border rounded-md"
                                    disabled
                                />
                            </div>

                            <div className="mb-4">
                                <label htmlFor="course_name" className="block text-sm font-medium text-gray-700">Course Name</label>
                                <input
                                    type="text"
                                    name="course_name"
                                    value={updatedCourse.course_name}
                                    onChange={handleUpdateChange}
                                    className="mt-1 block w-full px-4 py-2 border rounded-md"
                                    required
                                />
                            </div>

                            <div className="mb-4">
                                <label htmlFor="course_outline" className="block text-sm font-medium text-gray-700">Course Outline</label>
                                <textarea
                                    name="course_outline"
                                    value={updatedCourse.course_outline}
                                    onChange={handleUpdateChange}
                                    className="mt-1 block w-full px-4 py-2 border rounded-md"
                                    required
                                />
                            </div>

                            <div className="flex justify-center space-x-4 mt-6">
                                <button
                                    type="submit"
                                    className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition"
                                >
                                    Update
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowUpdateForm(false)}
                                    className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CourseDetails;