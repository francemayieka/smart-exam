import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBook, faClipboardList, faUsers, faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { Carousel } from 'react-responsive-carousel';
import smilingStudents from '../assets/smiling-students.jpg';
import efficientLearning from '../assets/efficient-learning.jpg';
import seamlessIntegration from '../assets/seamless-integration.jpg';

function Home() {
  const [openFAQ, setOpenFAQ] = useState(null);

  const toggleFAQ = (index) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  return (
    <div className="w-full">
      {/* Hero Section with Slider */}
      <div className="relative">
        <Carousel
          autoPlay
          infiniteLoop
          showThumbs={false}
          showStatus={false}
          className="shadow-lg"
        >
          <div>
            <img
              src={smilingStudents}
              alt="Smiling students"
              className="h-[400px] object-cover w-full"
            />
          </div>
          <div>
            <img
              src={efficientLearning}
              alt="Efficient learning"
              className="h-[400px] object-cover w-full"
            />
          </div>
          <div>
            <img
              src={seamlessIntegration}
              alt="Seamless integration"
              className="h-[400px] object-cover w-full"
            />
          </div>
        </Carousel>
        <div className="absolute inset-0 bg-blue-900 bg-opacity-50 flex flex-col justify-center items-center text-white text-center">
          <h1 className="text-4xl font-bold mb-4">Welcome to SmartExam</h1>
          <p className="text-lg mb-6">
            Empowering students and educators with seamless course and exam management.
          </p>
          <Link
            to="/signup"
            className="bg-blue-500 hover:bg-blue-400 transition px-6 py-3 text-lg font-semibold rounded-lg"
          >
            Get Started
          </Link>
        </div>
      </div>

      {/* Why Choose Us Section */}
      <div className="bg-blue-100 py-12">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold text-blue-600 mb-8">Why Choose Us?</h2>
          <div className="grid md:grid-cols-3 gap-8 px-4 md:px-0">
            <div className="p-6 bg-white shadow-lg rounded-lg">
              <FontAwesomeIcon icon={faBook} className="text-blue-600 text-4xl mb-4" />
              <h3 className="text-xl font-semibold mb-2">Comprehensive Course Management</h3>
              <p>Organize and track all your courses efficiently with our intuitive platform.</p>
            </div>
            <div className="p-6 bg-white shadow-lg rounded-lg">
              <FontAwesomeIcon icon={faClipboardList} className="text-blue-600 text-4xl mb-4" />
              <h3 className="text-xl font-semibold mb-2">Seamless Exam Integration</h3>
              <p>Create, manage, and track exams with ease for educators and students alike.</p>
            </div>
            <div className="p-6 bg-white shadow-lg rounded-lg">
              <FontAwesomeIcon icon={faUsers} className="text-blue-600 text-4xl mb-4" />
              <h3 className="text-xl font-semibold mb-2">Community of Learners</h3>
              <p>Join a vibrant community focused on enhancing the learning experience.</p>
            </div>
          </div>
        </div>
      </div>

      {/* FAQs */}
      <div className="container mx-auto py-12 px-4 md:px-0">
        <h2 className="text-3xl font-bold text-blue-600 mb-8 text-center">FAQs</h2>
        <div className="space-y-6">
          {[
            {
              question: 'What is SmartExam?',
              answer:
                'SmartExam is a platform designed to simplify course and exam management for students and educators.',
            },
            {
              question: 'How do I get started?',
              answer: 'Sign up for an account, and you will have access to all our features.',
            },
            {
              question: 'Is it free to use?',
              answer: 'Yes, SmartExam is free for students and educators to use!',
            },
          ].map((faq, index) => (
            <div key={index} className="border-b pb-4">
              <div
                className="cursor-pointer flex justify-between items-center"
                onClick={() => toggleFAQ(index)}
              >
                <h3 className="text-xl">{faq.question}</h3>
                <FontAwesomeIcon
                  icon={openFAQ === index ? faChevronUp : faChevronDown}
                  className="text-blue-600"
                />
              </div>
              {openFAQ === index && <p className="text-gray-600 mt-2">{faq.answer}</p>}
            </div>
          ))}
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-blue-600 text-white py-16">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Simplify Your Learning?</h2>
          <Link
            to="/signup"
            className="bg-blue-500 hover:bg-blue-400 transition px-6 py-3 text-lg font-semibold rounded-lg"
          >
            Join Us Now
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Home;
