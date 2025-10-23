"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { FaFacebookF, FaInstagram, FaArrowRight } from "react-icons/fa";

export default function Footer() {
  const quickLinks = [
    { name: "About Us", href: "../quick-links/about" },
    { name: "Articles", href: "../quick-links/article" },
    { name: "Laundry for Hospitality (HoReCa)", href: "../quick-links/horeca" },
    { name: "Laundry for Healthcare (Hospitals)", href: "../quick-links/hospitals" },
    { name: "Laundry for Spas, Gyms, and Salons", href: "../quick-links/spa" },
    { name: "Laundry for Firefighters", href: "../quick-links/firefighters" },
    { name: "Lagoon Professional", href: "../quick-links/lagoonP" },
    { name: "Preventive Maintenance Program", href: "../quick-links/pms" },
    {name: "Contact Us", href: "../quick-links/contact" },

  ];

  return (
    <motion.footer
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.8 }}
      className="bg-white/90 backdrop-blur-sm text-gray-700 border-t border-gray-200 py-14 px-6 md:px-14 lg:px-24"
    >
      {/* ==== Top Grid ==== */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        {/* ==== Left Section - Logo & Info ==== */}
        <div>
          <div className="flex items-center gap-[-12px] mb-5">
            <Image
              src="/assets/ELS_Logo_Brand.jpg"
              alt="ELS Logo"
              width={60}
              height={60}
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
                href="mailto:elsinquiries38@gmail.com"
                className="text-blue-600 hover:underline"
              >
                elsinquiries38@gmail.com
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
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 text-sm text-gray-600">
            {quickLinks.map(({ name, href }, idx) => (
              <li key={idx}>
                <Link
                  href={href}
                  className="group flex items-center hover:text-blue-600 transition-all duration-200"
                >
                  <FaArrowRight
                    size={10}
                    className="mr-2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200"
                  />
                  <span className="relative">
                    {name}
                    <span className="absolute left-0 bottom-0 w-0 h-[1px] bg-blue-600 group-hover:w-full transition-all duration-300"></span>
                  </span>
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

        {/* ==== Social Links ==== */}
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
            href="https://www.instagram.com/elsphilsinc"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Visit our Instagram"
            className="hover:text-pink-500 transition-transform duration-200 hover:scale-110"
          >
            <FaInstagram size={18} />
          </Link>
        </div>
      </div>
    </motion.footer>
  );
}
