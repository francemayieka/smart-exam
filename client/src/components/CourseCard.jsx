import React from "react";
import { Link } from "react-router-dom";

const CourseCard = ({ course }) => {
  return (
    <tr>
      <td className="px-4 py-2">
        <Link to={`/course/${course.course_code}`} className="text-blue-500 hover:underline">
          {course.course_code}
        </Link>
      </td>
      <td className="px-4 py-2">
        <Link to={`/course/${course.course_code}`} className="text-blue-500 hover:underline">
          {course.course_name}
        </Link>
      </td>
      <td className="px-4 py-2">{new Date(course.last_updated).toLocaleDateString()}</td>
    </tr>
  );
};

export default CourseCard;
