import React from 'react';
import { Link } from 'react-router-dom';
import teamWorking from '../assets/team-working.jpg';
import missionImage from '../assets/mission-image.jpg';

function AboutUs() {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <div className="relative">
        <div className="h-[300px] bg-blue-600 flex items-center justify-center text-center text-white px-4">
          <div>
            <h1 className="text-4xl font-bold mb-2">About Us</h1>
            <p className="text-lg">
              Learn more about our mission, vision, and the passionate team behind SmartExam.
            </p>
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="py-12 bg-blue-100">
        <div className="container mx-auto grid md:grid-cols-2 gap-8 items-center px-4 md:px-0">
          <div>
            <h2 className="text-3xl font-bold text-blue-600 mb-4">Our Mission</h2>
            <p className="text-lg text-gray-700 mb-6">
              At SmartExam, our mission is to revolutionize the education sector by providing an intuitive 
              and accessible platform for managing courses and exams. We strive to empower educators and 
              students by simplifying administrative tasks, allowing them to focus on what truly matters — learning.
            </p>
            <Link
              to="/signup"
              className="bg-blue-500 hover:bg-blue-400 text-white px-6 py-3 rounded-lg font-semibold"
            >
              Join Us Today
            </Link>
          </div>
          <div>
            <img
              src={missionImage}
              alt="Our Mission"
              className="rounded-lg shadow-lg w-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="py-12">
        <div className="container mx-auto text-center px-4 md:px-0">
          <h2 className="text-3xl font-bold text-blue-600 mb-8">Meet Our Team</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: 'Francis Mayieka',
                role: 'Software Engineer',
                img: teamWorking, // Replace with appropriate images
              },
              {
                name: 'Lorraine Chelangat',
                role: 'QA Engineer',
                img: teamWorking,
              },
              {
                name: 'Reagan Omondi',
                role: 'Front-End Engineer',
                img: teamWorking,
              },
            ].map((member, index) => (
              <div key={index} className="bg-white shadow-lg rounded-lg p-6">
                <img
                  src={member.img}
                  alt={member.name}
                  className="w-32 h-32 mx-auto rounded-full mb-4 object-cover"
                />
                <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                <p className="text-blue-600">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Vision Section */}
      <div className="py-12 bg-blue-50">
        <div className="container mx-auto grid md:grid-cols-2 gap-8 items-center px-4 md:px-0">
          <div>
            <img
              src={teamWorking}
              alt="Team Collaboration"
              className="rounded-lg shadow-lg w-full object-cover"
            />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-blue-600 mb-4">Our Vision</h2>
            <p className="text-lg text-gray-700 mb-6">
              We envision a future where technology bridges the gap between education and accessibility. 
              Our platform aims to be the gold standard for educational tools, fostering collaboration 
              and innovation in every classroom.
            </p>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-blue-600 text-white py-16">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Be Part of the Change</h2>
          <p className="text-lg mb-6">
            Join us in our journey to make education better and more accessible for everyone.
          </p>
          <Link
            to="/signup"
            className="bg-blue-500 hover:bg-blue-400 transition px-6 py-3 text-lg font-semibold rounded-lg"
          >
            Join the Community
          </Link>
        </div>
      </div>
    </div>
  );
}

export default AboutUs;
