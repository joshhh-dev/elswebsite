"use client";

import Link from "next/link";
import Image from "next/image";
import { FaFacebookF, FaInstagram } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-gray-50 to-gray-100 text-gray-700 border-t border-gray-200 py-14 px-6 md:px-14 lg:px-24">
      {/* Top Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        {/* ==== Left Section - Logo & Company Info ==== */}
        <div>
          <div className="flex items-center gap-3 mb-5">
            <Image
              src="/assets/ELS_PLAIN_COLORED.png"
              alt="ELS Logo"
              width={60}
              height={60}
              className="rounded-md shadow-sm"
            />
            <h3 className="text-xl font-bold tracking-wide text-gray-800">
              ELS Philippines Inc.
            </h3>
          </div>
          <p className="text-sm leading-relaxed text-gray-600">
            Providing premium commercial laundry solutions for hospitality,
            healthcare, and industrial sectors in the Philippines.
          </p>
        </div>

        {/* ==== Middle Section - Contact Info ==== */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-gray-800">
            Contact Information
          </h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>
              <span className="font-medium">Email: </span>
              <a
                href="mailto:info@elsphilippines.com"
                className="text-blue-600 hover:underline"
              >
                info@elsphilippines.com
              </a>
            </li>
            <li>Customer Inquiry: (+63) 917 128 0215</li>
            <li>Technical Assistance: (+63) 917 179 0032</li>
            <li>Office Landline: (02) 8721 8595</li>
            <li>
              Address: M4 & M5 Goldland Tower, 10 Eisenhower St., Greenhills,
              San Juan City
            </li>
          </ul>
        </div>

        {/* ==== Right Section - Quick Links ==== */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-gray-800">
            Quick Links
          </h3>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 text-sm text-gray-600">
            {[
              "About Us",
              "Articles",
              "Laundry for Hospitality (HoReCa)",
              "Laundry for Healthcare (Hospitals)",
              "Laundry for Spas, Gyms, and Salons",
              "Laundry for Firefighters",
              "Lagoon Professional",
              "Preventive Maintenance Program",
            ].map((item, idx) => (
              <li key={idx}>
                <Link
                  href="#"
                  className="hover:text-blue-600 transition-colors duration-200"
                >
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* ==== Bottom Bar ==== */}
      <div className="border-t border-gray-200 mt-10 pt-6 flex flex-col md:flex-row items-center justify-between text-sm text-gray-500">
        <p className="text-center md:text-left">
          © {new Date().getFullYear()} ELS Phils., Inc. – All Rights Reserved.
        </p>

        {/* Social Links */}
        <div className="flex space-x-5 mt-4 md:mt-0">
          <Link
            href="https://www.facebook.com/lagoonprofessional"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Visit our Facebook"
            className="hover:text-blue-600 transition-transform duration-200 hover:scale-110"
          >
            <FaFacebookF size={18} />
          </Link>
          <Link
            href="https://www.instagram.com/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Visit our Instagram"
            className="hover:text-pink-500 transition-transform duration-200 hover:scale-110"
          >
            <FaInstagram size={18} />
          </Link>
        </div>
      </div>
    </footer>
  );
}
