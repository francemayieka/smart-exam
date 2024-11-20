import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jsPDF } from 'jspdf';

const ExamDetails = () => {
    const { examName } = useParams();
    const [exam, setExam] = useState(null);
    const [showUpdateForm, setShowUpdateForm] = useState(false);
    const [updatedExam, setUpdatedExam] = useState({
        exam_name: '',
        course_code: '',
        exam_questions: '',
        marking_scheme: '',
    });
    const navigate = useNavigate();

    useEffect(() => {
        const fetchExamDetails = async () => {
            const token = localStorage.getItem('authToken');
            if (!token) {
                console.error('No authorization token found');
                return;
            }

            try {
                const response = await axios.get(
                    `http://localhost:8000/api/list-exams/`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );
                const foundExam = response.data.exams.find(exam => exam.exam_name === examName);
                if (foundExam) {
                    setExam(foundExam);
                    setUpdatedExam(foundExam);
                } else {
                    console.error('No exam found for the given exam name');
                }
            } catch (error) {
                console.error('Error fetching exam details:', error);
            }
        };

        fetchExamDetails();
    }, [examName]);


    const generatePDF = (title, content, universityName, examDate) => {
        const doc = new jsPDF();
    
        // Ensure content is a string and handle cases where it's null or undefined
        content = content ? String(content) : '';
        universityName = universityName ? String(universityName) : 'Unknown University';
        examDate = examDate ? new Date(examDate).toLocaleDateString() : 'Date not available';
    
        // Add SmartExam branding at the top
        doc.setFontSize(10);
        doc.setFont('times', 'italic');
        doc.text('SmartExam', 10, 8); // Display SmartExam in small text at the top-left corner
    
        // Set up university name, title, and exam date with proper formatting
        doc.setFontSize(18);
        doc.setFont('times', 'bold');
        doc.text(universityName, 10, 18); // Display university name below SmartExam
    
        // Add exam date below university name
        doc.setFontSize(12);
        doc.setFont('times', 'italic');
        doc.text(`Exam Date: ${examDate}`, 10, 24); // Display exam date in italics
    
        // Add space between the title and content
        doc.setFontSize(16);
        doc.setFont('times', 'bold');
        doc.text(title, 10, 30); // Display title of exam
    
        // Add a horizontal line under the title for separation
        doc.setLineWidth(0.5);
        doc.line(10, 32, 200, 32); // Horizontal line
    
        // Add content with normal word spacing and word wrapping
        doc.setFontSize(12);
        doc.setFont('times', 'normal');
        const contentLines = doc.splitTextToSize(content, 180); // Word wrap to fit within the page width
        doc.text(contentLines, 10, 38); // Display content with word wrap
    
        // Save the PDF with the title name
        doc.save(`${title}.pdf`);
    };    
    
    const handleViewExamPDF = () => {
        if (exam && exam.exam_questions) {
            // Ensure the content is trimmed and not empty
            const examQuestions = exam.exam_questions.trim();
            if (examQuestions) {
                const universityName = exam.university_name || 'Unknown University';
                const examDate = exam.created_at || null;
                generatePDF(`${exam.course_code}: ${exam.exam_name} - Questions`, examQuestions, universityName, examDate);
            } else {
                alert('Exam questions are empty.');
            }
        } else {
            alert('Exam questions not available.');
        }
    };
    
    const handleViewMarkingSchemePDF = () => {
        if (exam && exam.marking_scheme) {
            // Ensure the content is trimmed and not empty
            const markingScheme = exam.marking_scheme.trim();
            if (markingScheme) {
                const universityName = exam.university_name || 'Unknown University';
                const examDate = exam.created_at || null;
                generatePDF(`${exam.exam_name} - Marking Scheme`, markingScheme, universityName, examDate);
            } else {
                alert('Marking scheme is empty.');
            }
        } else {
            alert('Marking scheme not available.');
        }
    };
    
    


    const handleUpdateClick = () => setShowUpdateForm(true);

    const handleUpdateChange = (e) => {
        const { name, value } = e.target;
        setUpdatedExam({ ...updatedExam, [name]: value });
    };

    const handleUpdateSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('authToken');
        if (!token) {
            alert('Please login to update the exam.');
            return;
        }

        try {
            await axios.patch(
                `http://localhost:8000/api/update-exam/${encodeURIComponent(examName)}/`,
                updatedExam,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );
            setShowUpdateForm(false);
            setExam({ ...exam, ...updatedExam });
            alert('Exam updated successfully!');
        } catch (error) {
            console.error('Error updating exam:', error);
            alert('Failed to update the exam.');
        }
    };

    const handleDelete = async () => {
        const token = localStorage.getItem('authToken');
        if (!token) {
            alert('Please login to delete the exam.');
            return;
        }

        if (window.confirm('Are you sure you want to delete this exam?')) {
            try {
                await axios.delete(
                    `http://localhost:8000/api/delete-exam/${encodeURIComponent(examName)}/`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                alert('Exam deleted successfully!');
                navigate('/exams');
            } catch (error) {
                console.error('Error deleting exam:', error);
                alert('Failed to delete the exam.');
            }
        }
    };

    if (!exam) return <div className="text-center py-10 text-lg">Loading...</div>;

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg mt-8">
            <h1 className="text-3xl font-bold mb-4 text-center">{exam.exam_name}</h1>
            <p className="text-gray-700 mb-2"><strong>Course Code:</strong> {exam.course_code}</p>
    
            <div className="flex justify-center space-x-4 mt-6">
                <button
                    onClick={handleViewExamPDF}
                    className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition"
                >
                    Download Exam
                </button>
                <button
                    onClick={handleViewMarkingSchemePDF}
                    className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition"
                >
                    Download Marking Scheme
                </button>
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
                        <h2 className="text-2xl font-bold mb-4 text-center">Update Exam</h2>
                        <form onSubmit={handleUpdateSubmit}>
                            {['exam_name', 'exam_questions', 'marking_scheme'].map((field, idx) => (
                                <div className="mb-4" key={idx}>
                                    <label htmlFor={field} className="block text-sm font-medium text-gray-700">
                                        {field.replace('_', ' ').toUpperCase()}
                                    </label>
                                    {field === 'course_code' ? (
                                        <input
                                            type="text"
                                            name={field}
                                            value={updatedExam[field]}
                                            onChange={handleUpdateChange}
                                            className="mt-1 block w-full px-4 py-2 border rounded-md"
                                            disabled
                                        />
                                    ) : (
                                        <textarea
                                            name={field}
                                            value={updatedExam[field]}
                                            onChange={handleUpdateChange}
                                            className="mt-1 block w-full px-4 py-2 border rounded-md"
                                            required={field !== 'course_code'}
                                        />
                                    )}
                                </div>
                            ))}
    
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

export default ExamDetails;
