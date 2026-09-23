"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaPaperPlane } from "react-icons/fa";
import DealerAvatar from "@/app/components/DealerAvatar";
import { getDealerBySlug } from "@/lib/rbpnDealers";

/**
 * Shared dealer profile + inquiry form, rendered per RBPN dealer page
 * (src/app/rbpn/{slug}/page.js). Keeps all 19 dealer pages consistent and
 * pulling from the single rbpnDealers.js source of truth, instead of each
 * page re-implementing/hardcoding its own copy.
 */
export default function RbpnDealerPage({ slug }) {
  const dealer = getDealerBySlug(slug);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(false);

  if (!dealer) {
    return (
      <main className="min-h-screen flex items-center justify-center px-6 text-center">
        <p className="text-gray-600">
          Dealer information not found. Please check back later or visit our{" "}
          <a href="/rbpn" className="text-blue-600 underline">
            Find a Dealer
          </a>{" "}
          page.
        </p>
      </main>
    );
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    setError(false);
    try {
      const res = await fetch("/api/rbpn-inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_name: form.name,
          user_email: form.email,
          phone: form.phone,
          dealerSlug: dealer.slug,
          message: `Phone: ${form.phone}\n\n${form.message}\n\n(Dealer: ${dealer.company} (${dealer.aka}), ${dealer.area})`,
        }),
      });

      if (!res.ok) throw new Error("Request failed");

      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 4000);
      setForm({ name: "", email: "", phone: "", message: "" });
    } catch (err) {
      console.error(err);
      setError(true);
    } finally {
      setSending(false);
    }
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
          {dealer.company}
        </motion.h1>

        <DealerAvatar name={dealer.company} size={180} className="mb-6 mx-auto" />

        <p className="text-gray-600 leading-relaxed mb-8">
          {dealer.company} (also known as {dealer.aka}) is your trusted RBPN
          partner for professional laundry equipment and solutions located in{" "}
          {dealer.area}. We provide high-quality machines and support for both
          commercial and self-service laundromats.
        </p>

        <p className="text-gray-700 font-medium">📍 Location: {dealer.area}</p>
        <p className="text-gray-700 font-medium mt-2">
          📞 Contact: {dealer.phone}
        </p>
        {dealer.email && (
          <p className="text-gray-700 font-medium mt-2">
            📧 Email: {dealer.email}
          </p>
        )}
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
              disabled={sending}
              className="bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2 md:col-span-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <FaPaperPlane /> {sending ? "Sending..." : "Send Inquiry"}
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

          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-600 text-center mt-6 font-medium"
            >
              Something went wrong. Please try again, or reach us directly at{" "}
              {dealer.phone}.
            </motion.p>
          )}
        </div>
      </section>
    </main>
  );
}
