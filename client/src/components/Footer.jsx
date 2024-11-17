import React from 'react';

function Footer() {
  return (
    <footer className="bg-navy text-white p-4 mt-8 w-full">
      <div className="container mx-auto text-center">
        <p className="text-sm">&copy; {new Date().getFullYear()} SmartExam. All rights reserved.</p>
        <div className="mt-2">
          <a href="/about-us" className="text-white hover:text-gray-300 mx-4 text-lg">About Us</a>
          <a href="/contact-us" className="text-white hover:text-gray-300 mx-4 text-lg">Contact Us</a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
