import React from 'react';
import customerCare from '../assets/customer-care.jpg';

function ContactUs() {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <div className="relative">
        <div className="h-[300px] bg-blue-600 flex items-center justify-center text-center text-white px-4">
          <div>
            <h1 className="text-4xl font-bold mb-2">Contact Us</h1>
            <p className="text-lg">
              Have questions or feedback? We'd love to hear from you!
            </p>
          </div>
        </div>
      </div>

      {/* Contact Details Section */}
      <div className="bg-blue-100 py-12">
        <div className="container mx-auto grid md:grid-cols-2 gap-8 px-4 md:px-0">
          <div>
            <h2 className="text-3xl font-bold text-blue-600 mb-4">Get in Touch</h2>
            <p className="text-lg text-gray-700 mb-6">
              Whether you have a question about our platform, need assistance, or just want to share feedback, our team is here to help.
            </p>
            <div className="space-y-4">
              <p className="text-gray-700">
                <strong>Email:</strong> support@smartexam.com
              </p>
              <p className="text-gray-700">
                <strong>Phone:</strong> +123 456 7890
              </p>
              <p className="text-gray-700">
                <strong>Address:</strong> 123 Learning Lane, Education City, EC123
              </p>
            </div>
          </div>
          <div>
            <img
              src={customerCare}
              alt="Location map"
              className="rounded-lg shadow-lg w-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* Contact Form Section */}
      <div className="py-12">
        <div className="container mx-auto px-4 md:px-0">
          <h2 className="text-3xl font-bold text-blue-600 text-center mb-8">Send Us a Message</h2>
          <form className="max-w-2xl mx-auto space-y-6">
            <div>
              <label htmlFor="name" className="block text-gray-700 font-semibold mb-2">
                Your Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none"
                placeholder="Enter your name"
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-gray-700 font-semibold mb-2">
                Your Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none"
                placeholder="Enter your email"
                required
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-gray-700 font-semibold mb-2">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows="5"
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none"
                placeholder="Write your message"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-500 transition font-semibold"
            >
              Submit
            </button>
          </form>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-blue-600 text-white py-16">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">We’re Here to Help</h2>
          <p className="text-lg mb-6">
            Our support team is available 24/7 to answer your queries and provide assistance.
          </p>
          <a
            href="mailto:support@smartexam.com"
            className="bg-blue-500 hover:bg-blue-400 transition px-6 py-3 text-lg font-semibold rounded-lg"
          >
            Email Us Now
          </a>
        </div>
      </div>
    </div>
  );
}

export default ContactUs;
