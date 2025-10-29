"use client";

import React, { useState } from "react";
import Image from "next/image";
import Footer from "@/app/components/Footer";
import { motion } from "framer-motion";
import { FaPaperPlane } from "react-icons/fa";

export default function MRPPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", form);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000); // Hide success after 3s
    setForm({ name: "", email: "", phone: "", message: "" });
  };

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center">
      <section className="py-20 px-6 max-w-4xl text-center">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl font-bold text-gray-800 mb-6"
        >
          MRP Laundry Setup
        </motion.h1>

        <Image
          src="/assets/partner1.png"
          alt="MRP Laundry Setup"
          width={180}
          height={180}
          className="rounded-full mb-6"
        />

        <p className="text-gray-600 leading-relaxed mb-8">
          MRP Laundry Setup is your trusted partner for professional laundry
          equipment and solutions located in Manila. We provide high-quality
          machines and support for both commercial and self-service laundromats.
        </p>

        <p className="text-gray-700 font-medium">📍 Location: Manila</p>
        <p className="text-gray-700 font-medium mt-2">
          📞 Contact: +63 912 345 6789
        </p>
        <p className="text-gray-700 font-medium mt-2">
          📧 Email: info@mrplaundry.com
        </p>
      </section>

      {/* Inquiry Form Section */}
      <section className="w-full bg-white py-12 px-6 shadow-inner">
        <div className="max-w-3xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-2xl font-semibold text-gray-800 mb-6 text-center"
          >
            Send an Inquiry
          </motion.h2>

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Your Name"
              required
              className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Your Email"
              required
              className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="Phone Number"
              required
              className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none md:col-span-2"
            />
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              placeholder="Write your message here..."
              rows="5"
              required
              className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none md:col-span-2"
            ></textarea>

            <button
              type="submit"
              className="bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2 md:col-span-2"
            >
              <FaPaperPlane /> Send Inquiry
            </button>
          </form>

          {submitted && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-green-600 text-center mt-6 font-medium"
            >
              ✅ Your inquiry has been sent successfully!
            </motion.p>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
