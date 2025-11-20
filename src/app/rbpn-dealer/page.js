"use client";

import React from "react";
import { useRef } from "react";
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaPaperPlane } from "react-icons/fa";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

function DealerPage() {
  const form = useRef();
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const sendEmail = async (e) => {
    e.preventDefault();
    setSending(true);
    const formData = new FormData(form.current);
    const data = Object.fromEntries(formData.entries());

    try {
      const res = await fetch("/api/rbpn-application", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        // Wait for plane animation before showing toast
        setTimeout(() => {
          setSent(true);
          toast.success(
            <div className="flex flex-col items-center text-white">
              <FaPaperPlane className="text-3xl animate-bounce mb-2" />
              <span className="font-semibold text-lg">Inquiry Sent Successfully!</span>
              <p className="text-sm opacity-90">We’ll get back to you soon.</p>
            </div>,
            {
              position: "top-center",
              autoClose: 3000,
              hideProgressBar: false,
              theme: "colored",
              transition: Slide,
            }
          );

          form.current.reset();
          setTimeout(() => setSent(false), 1500);
        }, 1000);
      } else {
        toast.error("Failed to send message. Please try again.");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred. Please try again later.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="w-full">
      {/* RBPN Dealer Application Form */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full flex flex-col items-start justify-center py-16 px-6 md:px-20 bg-gray-50"
      >
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
          RBPN Dealer Application Form
        </h2>

        <p className="text-gray-600 mb-10 max-w-2xl text-left">
          Fill out the form below and our team will contact you regarding 
          dealership verification, requirements, and onboarding procedures.
        </p>

        <form className="w-full max-w-2xl bg-white p-8 rounded-2xl shadow-lg space-y-6">
          {/* Full Name */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Full Name
            </label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-400"
              placeholder="Enter your full name"
              required
            />
          </div>

          {/* Business Name */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Business Name
            </label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-400"
              placeholder="Enter your business name"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Email Address
            </label>
            <input
              type="email"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-400"
              placeholder="Enter your email"
              required
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Contact Number
            </label>
            <input
              type="tel"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-400"
              placeholder="Enter your contact number"
              required
            />
          </div>

          {/* Address */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Business Address
            </label>
            <textarea
              rows="3"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-400"
              placeholder="Enter your complete business address"
              required
            ></textarea>
          </div>

          {/* Dealer Type */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Dealer Type
            </label>
            <select
              className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-teal-400"
              required
            >
              <option value="">Select dealer type</option>
              <option value="individual">Individual Dealer</option>
              <option value="company">Company Dealer</option>
              <option value="laundry">Laundry Shop Owner</option>
              <option value="distributor">Distributor / Reseller</option>
            </select>
          </div>

          {/* Message / Intent */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Why do you want to become an RBPN Dealer?
            </label>
            <textarea
              rows="4"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-400"
              placeholder="Tell us a little about your interest and goals."
            ></textarea>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            
            className="w-full bg-gradient-to-r from-blue-500 to-teal-400 text-white font-semibold py-3 rounded-full shadow-lg hover:shadow-xl transition-all"
          >
            Submit Application
          </button>
        </form>
      </motion.section>
    </div>
  );
}

export default DealerPage;
