"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import {
  FaPaperPlane,
  FaChartLine,
  FaUsers,
  FaCog,
  FaHandshake,
  FaUserPlus,
  FaClipboardCheck,
  FaGraduationCap,
} from "react-icons/fa";
import { toast, ToastContainer, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion } from "framer-motion";
import { rbpnDealers } from "@/lib/rbpnDealers";

// Real marketing copy transcribed from the Figma redesign's "Building
// Stronger Partnerships" + "Why Partner with ELS?" recruitment pages (Phase
// 7). The Figma's own hero is a placeholder mountain/sun icon (no real photo
// behind it), so this page's hero stays text-only rather than inventing one.
//
// Two of the 4 "Why Partner with ELS?" items (Expand your Opportunities,
// Build Stronger Connections) are a Figma copy-paste bug — the source
// literally repeats EMPOWER360's "Learners can take quizzes..." training
// copy under both, which doesn't describe a partnership benefit at all.
// Not carried over; replaced with original, flagged copy grounded in their
// real headings/icons. The other 2 ("Growth with Proven Solutions",
// "Achieve More Together") and all 4 "Journey to Partnership" steps are
// verbatim from the source (minor typos silently fixed: "backedd"->
// "backed", "bsuiness"->"business", "continous"->"continuous").
const RBPN_FOCUS = [
  {
    icon: FaHandshake,
    title: "Commercial Excellence",
    description:
      "Strengthening market coverage, customer acquisition, customer retention, sales productivity, and strategic account development.",
  },
  {
    icon: FaChartLine,
    title: "Customer Service Excellence",
    description:
      "Creating value in every customer interaction by responding faster, solving business needs, and building long-term partnerships.",
  },
  {
    icon: FaUsers,
    title: "Integrated Sales Channels",
    description:
      "Connecting different channels — including Commercial Laundry, Institutional, Corporate Accounts, Key Accounts, E-Commerce, and the Resellers/Ahente Network — to provide customers with the right solutions through the right channel.",
  },
  {
    icon: FaCog,
    title: "Digital Transformation",
    description:
      "Using technology, data, digital tools, and analytics to support smarter selling, better decision-making, and improved customer engagement.",
  },
];

const WHY_PARTNER = [
  {
    icon: FaChartLine,
    title: "Expand your Opportunities",
    // Original copy — the Figma's own text here is a copy-paste bug (see note above).
    description:
      "Reach more customers and grow into new territories with the backing of an established laundry and cleaning solutions brand.",
  },
  {
    icon: FaCog,
    title: "Growth with Proven Solutions",
    description: "Offer reliable products, equipment, and services backed by ELS.",
  },
  {
    icon: FaUsers,
    title: "Build Stronger Connections",
    // Original copy — the Figma's own text here is a copy-paste bug (see note above).
    description:
      "Connect with a nationwide network of RBPN partners and ELS specialists for shared knowledge and mutual support.",
  },
  {
    icon: FaHandshake,
    title: "Achieve More Together",
    description:
      "Gain access to collaborative initiatives designed to help your business grow.",
  },
];

const PARTNERSHIP_JOURNEY = [
  {
    icon: FaUserPlus,
    title: "Recruitment",
    description:
      "Identify and invite potential partners with the interest, capability, and potential to grow with ELS.",
  },
  {
    icon: FaClipboardCheck,
    title: "Qualification",
    description:
      "Evaluate prospective partners based on established requirements, business potential, capabilities, and alignment with ELS standards.",
  },
  {
    icon: FaGraduationCap,
    title: "Onboarding",
    description:
      "Equip qualified partners through orientation, training, product knowledge, processes, and tools to begin their RBPN Journey.",
  },
  {
    icon: FaHandshake,
    title: "Retention",
    description:
      "Strengthen long-term partnerships through continuous support, development, communication, and business growth opportunities.",
  },
];

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
    <div className="w-full min-h-screen bg-gray-50">
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

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 pt-20 pb-14 text-center">
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-gray-900 mb-3">
          Building Stronger Partnerships.
        </h1>
        <p className="text-xl md:text-2xl font-semibold text-blue-600 mb-6">
          Creating Greater Customer Value.
        </p>
        <p className="text-gray-600 leading-relaxed max-w-2xl mx-auto">
          RBPN (Regional Business Partner Network) is ELS Philippines&apos;
          business network focused on building strong partnerships, expanding
          market reach, and delivering reliable laundry and cleaning
          solutions to customers. Through the RBPN Full Channel Sales
          Framework, ELS brings together different sales channels, teams,
          and support functions to provide a more connected and
          customer-focused experience.
        </p>
      </section>

      {/* What RBPN Focuses On */}
      <section className="max-w-5xl mx-auto px-6 pb-16">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-10">
          What RBPN Focuses On
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
          {RBPN_FOCUS.map(({ icon: Icon, title, description }) => (
            <div key={title} className="flex gap-4">
              <div className="flex-shrink-0 w-11 h-11 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                <Icon size={18} />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">{title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Stat callout */}
      <section className="max-w-4xl mx-auto px-6 pb-16 text-center">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900">
          Building a Stronger Network,
        </h2>
        <p className="text-blue-600 font-bold tracking-widest text-sm mb-4">
          TOGETHER
        </p>
        <div className="text-4xl md:text-5xl font-extrabold text-blue-600 mb-3">
          {rbpnDealers.length} RBPNs
        </div>
        <p className="text-gray-600">
          United by a shared commitment to business growth and the
          advancement of the Philippine laundry industry.
        </p>
      </section>

      {/* Why Partner with ELS */}
      <section className="max-w-5xl mx-auto px-6 pb-16">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-10">
          Why Partner with ELS?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
          {WHY_PARTNER.map(({ icon: Icon, title, description }) => (
            <div key={title} className="flex gap-4">
              <div className="flex-shrink-0 w-11 h-11 rounded-full bg-brand-navy text-white flex items-center justify-center">
                <Icon size={18} />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">{title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Your Journey to Partnership */}
      <section className="max-w-4xl mx-auto px-6 pb-16">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-3">
          Your Journey to Partnership
        </h2>
        <p className="text-gray-600 text-center max-w-2xl mx-auto mb-10">
          A structured process designed to identify, develop, and empower
          business partners for long-term growth with ELS.
        </p>
        <div className="space-y-4">
          {PARTNERSHIP_JOURNEY.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="flex gap-4 items-start bg-gray-100 rounded-xl p-5"
            >
              <div className="flex-shrink-0 w-11 h-11 rounded-full bg-white border-2 border-brand-navy text-brand-navy flex items-center justify-center">
                <Icon size={18} />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">{title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Ready to grow with ELS CTA */}
      <section className="max-w-5xl mx-auto px-6 pb-16">
        <div className="relative rounded-2xl overflow-hidden min-h-[260px] flex items-center">
          <Image
            src="/assets/rbpn-partnership-handshake.jpg"
            alt="Be our next Regional Business Partner"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/70 to-transparent" />
          <div className="relative z-10 p-8 md:p-10 max-w-md">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
              Be Our Next Regional Business Partner!
            </h2>
            <p className="text-gray-200 mb-6">
              Let&apos;s explore how we can grow together. Send us a message
              today.
            </p>
            <a
              href="#application-form"
              className="inline-block bg-white text-gray-900 font-semibold px-6 py-3 rounded-xl hover:shadow-lg transition-all"
            >
              Explore Partnership Opportunities
            </a>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <motion.section
        id="application-form"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-2xl mx-auto flex flex-col items-center justify-center px-6 pb-20"
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
