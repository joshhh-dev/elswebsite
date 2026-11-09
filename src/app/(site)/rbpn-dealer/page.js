"use client";

import React, { useRef, useState } from "react";
import { FaPaperPlane } from "react-icons/fa";
import { toast, ToastContainer, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion } from "framer-motion";

export default function DealerPage() {
  const form = useRef();
  const [sending, setSending] = useState(false);

  const sendEmail = async (e) => {
    e.preventDefault();
    setSending(true);

    const formData = new FormData(form.current);
    const data = Object.fromEntries(formData.entries());

    const loadingToast = toast.loading("Sending your application...");

    try {
      const res = await fetch("/api/rbpn-application", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        toast.update(loadingToast, {
          render: "Failed to send. Please try again.",
          type: "error",
          isLoading: false,
          autoClose: 2500,
        });
        return;
      }

      toast.update(loadingToast, {
        render: (
          <div className="flex flex-col items-center text-white">
            <FaPaperPlane className="text-3xl animate-bounce mb-2" />
            <span className="font-semibold text-lg">Application Sent!</span>
          </div>
        ),
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });

      form.current.reset();
    } catch (error) {
      console.error(error);
      toast.update(loadingToast, {
        render: "Unexpected error. Please try again later.",
        type: "error",
        isLoading: false,
        autoClose: 2500,
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
      {/* ToastContainer */}
      <ToastContainer
        position="top-center"
        autoClose={2500}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        pauseOnHover={false}
        draggable
        theme="colored"
        transition={Slide}
      />

      {/* Form Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-2xl flex flex-col items-center justify-center"
      >
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6 text-center">
          RBPN Dealer Application Form
        </h2>

        <p className="text-gray-600 mb-10 max-w-2xl text-center">
          Fill out the form below and our team will contact you regarding 
          dealership verification, requirements, and onboarding procedures.
        </p>

        <form
          ref={form}
          onSubmit={sendEmail}
          className="w-full bg-white p-8 rounded-2xl shadow-lg flex flex-col space-y-6"
        >
          {["Full Name", "Business Name", "Email Address", "Contact Number"].map(
            (label, idx) => (
              <div className="flex flex-col" key={idx}>
                <label className="text-black font-medium mb-2">{label}</label>
                <input
                  name={label.toLowerCase().replace(/\s/g, "_")}
                  type={label.includes("Email") ? "email" : "text"}
                  required
                  placeholder={`Enter your ${label.toLowerCase()}`}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-black placeholder-gray-500 focus:ring-2 focus:ring-blue-400 outline-none transition-all"
                />
              </div>
            )
          )}

          {/* Address */}
          <div className="flex flex-col">
            <label className="text-black font-medium mb-2">Business Address</label>
            <textarea
              name="address"
              rows="3"
              required
              placeholder="Enter your complete business address"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-black placeholder-gray-500 focus:ring-2 focus:ring-blue-400 outline-none transition-all"
            />
          </div>

          {/* Dealer Type */}
          <div className="flex flex-col">
            <label className="text-black font-medium mb-2">Dealer Type</label>
            <select
              name="dealer_type"
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-black focus:ring-2 focus:ring-blue-400 outline-none transition-all"
            >
              <option value="">Select dealer type</option>
              <option value="individual">Individual Dealer</option>
              <option value="company">Company Dealer</option>
              <option value="laundry">Laundry Shop Owner</option>
              <option value="distributor">Distributor / Reseller</option>
            </select>
          </div>

          {/* Dealer Intent */}
          <div className="flex flex-col">
            <label className="text-black font-medium mb-2">
              Why do you want to become an RBPN Dealer?
            </label>
            <textarea
              name="intent"
              rows="4"
              placeholder="Tell us a little about your interest and goals."
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-black placeholder-gray-500 focus:ring-2 focus:ring-blue-400 outline-none transition-all"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={sending}
            className={`w-full bg-gradient-to-r from-blue-500 to-teal-400 text-white font-semibold py-3 rounded-full shadow-lg transition-all 
              ${sending ? "opacity-70 cursor-not-allowed" : "hover:shadow-xl"}`}
          >
            {sending ? (
              <div className="flex items-center justify-center gap-2">
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                Sending...
              </div>
            ) : (
              "Submit Application"
            )}
          </button>
        </form>
      </motion.section>
    </div>
  );
}
