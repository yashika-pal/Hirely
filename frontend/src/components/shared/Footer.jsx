import React from 'react';
import { FaLinkedin, FaGithub, FaTelegramPlane, FaEnvelope } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-5">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left gap-6">

          <div>
            <p className="text-medium mt-2 text-gray-200">
              © {new Date().getFullYear()} JobPortal. All rights reserved.
            </p>
          </div>

          <div className="flex space-x-6">
            <Link to="/" className="hover:text-[#6A38C2] transition-colors">
              About Us
            </Link>
            <Link to="/" className="hover:text-[#6A38C2] transition-colors">
              Contact
            </Link>
            <Link to="/" className="hover:text-[#6A38C2] transition-colors">
              Terms of Service
            </Link>
          </div>

          <div className="flex space-x-5">
            <a
              href="https://linkedin.com/in/yashikapal"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#6A38C2] transition-colors"
              aria-label="LinkedIn"
            >
              <FaLinkedin size={22} />
            </a>
            <a
              href="mailto:yashikapal2004@gmail.com"
              className="hover:text-[#6A38C2] transition-colors"
              aria-label="Email"
            >
              <FaEnvelope size={22} />
            </a>
            <a
              href="https://github.com/yashika-pal"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#6A38C2] transition-colors"
              aria-label="GitHub"
            >
              <FaGithub size={22} />
            </a>
            <a
              href="https://t.me/yashikaapal"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#6A38C2] transition-colors"
              aria-label="Telegram"
            >
              <FaTelegramPlane size={22} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
