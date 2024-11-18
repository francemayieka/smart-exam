import React from 'react';

function Footer() {
  return (
    <footer className="bg-blue-dark text-white py-6 shadow-md">
      <div className="container mx-auto text-center">
        <p className="text-sm">
          &copy; {new Date().getFullYear()} <span className="font-semibold">SmartExam</span>. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
