"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FaPaperPlane, FaMapMarkedAlt, FaClock, FaShieldAlt, FaPaperclip } from "react-icons/fa";
import { phLocations } from "@/lib/phLocations";
import { INQUIRY_TYPES } from "@/app/components/InquiryCard";

const MAX_ATTACHMENT_BYTES = 10 * 1024 * 1024;
const ALLOWED_ATTACHMENT_TYPES = new Set([
  "application/pdf",
  "image/png",
  "image/jpeg",
  "image/webp",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);

const FEATURES = [
  { icon: FaMapMarkedAlt, label: "Matched to the nearest RBPN partner" },
  { icon: FaClock, label: "Fast response from a real dealer" },
  { icon: FaShieldAlt, label: "No obligation, just information" },
];

/**
 * Reusable "Inquire about this department" form — dropped into each
 * department page (LG, Scarpavapor, ProLS, LAC, LMS) with a fixed `product`
 * (department name) label. If the department has specific products listed
 * (`items`), the customer must pick which one they're after — that's what
 * the prospect/inquiry is based on, together with their location. The
 * server (/api/product-inquiry) figures out which RBPN partner to route the
 * inquiry to (exact area match, or nearest by distance) — see
 * src/lib/matchDealer.js.
 */
export default function ProductInquiryForm({ product, items = [] }) {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    location: "",
    productItem: "",
    inquiryType: "general",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(false);
  const [attachment, setAttachment] = useState(null);
  const [attachmentError, setAttachmentError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAttachmentChange = (e) => {
    const file = e.target.files?.[0] || null;
    if (!file) {
      setAttachment(null);
      setAttachmentError("");
      return;
    }
    if (file.size > MAX_ATTACHMENT_BYTES) {
      setAttachment(null);
      setAttachmentError("File is too large (max 10MB).");
      e.target.value = "";
      return;
    }
    if (!ALLOWED_ATTACHMENT_TYPES.has(file.type)) {
      setAttachment(null);
      setAttachmentError("Unsupported file type — PDF, Word doc, or image only.");
      e.target.value = "";
      return;
    }
    setAttachment(file);
    setAttachmentError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    setError(false);
    try {
      const body = new FormData();
      body.set("name", `${form.firstName} ${form.lastName}`.trim());
      body.set("email", form.email);
      body.set("phone", form.phone);
      body.set("location", form.location);
      body.set("product", product);
      body.set("productItem", items.length > 0 ? form.productItem : "");
      body.set("inquiryType", form.inquiryType);
      body.set("message", form.message);
      if (attachment) body.set("attachment", attachment);

      const res = await fetch("/api/product-inquiry", { method: "POST", body });

      if (!res.ok) throw new Error("Request failed");

      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 4000);
      setForm({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        location: "",
        productItem: "",
        inquiryType: "general",
        message: "",
      });
      setAttachment(null);
      setAttachmentError("");
    } catch (err) {
      console.error(err);
      setError(true);
    } finally {
      setSending(false);
    }
  };

  return (
    <section className="w-full bg-gray-50 py-16 px-6 md:px-12">
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 rounded-3xl overflow-hidden shadow-xl">
        {/* ===== Left panel — dark, info ===== */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="bg-brand-navy text-white p-10 md:p-12 flex flex-col justify-center"
        >
          <span className="inline-block self-start bg-brand-blue text-white text-sm font-semibold px-5 py-2 rounded-full mb-6">
            Inquire
          </span>
          <h2 className="text-3xl md:text-4xl font-bold leading-tight mb-4">
            Interested in {product}?
          </h2>
          <p className="text-gray-300 leading-relaxed mb-8">
            Tell us your location and we&apos;ll connect you with the RBPN
            partner nearest you.
          </p>

          <div className="flex flex-col gap-4">
            {FEATURES.map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-3">
                <span className="shrink-0 w-9 h-9 rounded-full bg-white/10 flex items-center justify-center">
                  <Icon className="text-brand-cyan" />
                </span>
                <span className="text-gray-200">{label}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ===== Right panel — light, form ===== */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="bg-white p-10 md:p-12"
        >
          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="text"
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              placeholder="First Name*"
              required
              suppressHydrationWarning
              className="border border-gray-300 bg-gray-100 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <input
              type="text"
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
              placeholder="Last Name*"
              required
              suppressHydrationWarning
              className="border border-gray-300 bg-gray-100 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email*"
              required
              suppressHydrationWarning
              className="border border-gray-300 bg-gray-100 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="Phone*"
              required
              suppressHydrationWarning
              className="border border-gray-300 bg-gray-100 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <select
              name="location"
              value={form.location}
              onChange={handleChange}
              required
              suppressHydrationWarning
              className="border border-gray-300 bg-gray-100 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-700 sm:col-span-2"
            >
              <option value="">Select your city/province*</option>
              {phLocations.map((loc) => (
                <option key={loc.name} value={loc.name}>
                  {loc.name}
                </option>
              ))}
            </select>
            {items.length > 0 && (
              <select
                name="productItem"
                value={form.productItem}
                onChange={handleChange}
                required
                suppressHydrationWarning
                className="border border-gray-300 bg-gray-100 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-700 sm:col-span-2"
              >
                <option value="">Which product are you interested in?*</option>
                {items.map((item, i) => (
                  <option key={i} value={item.name}>
                    {item.name}
                  </option>
                ))}
              </select>
            )}
            <select
              name="inquiryType"
              value={form.inquiryType}
              onChange={handleChange}
              suppressHydrationWarning
              className="border border-gray-300 bg-gray-100 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-700 sm:col-span-2"
            >
              {INQUIRY_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              placeholder="Write Message"
              rows="5"
              suppressHydrationWarning
              className="border border-gray-300 bg-gray-100 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none sm:col-span-2"
            ></textarea>

            <label className="sm:col-span-2 flex items-center gap-2 border border-dashed border-gray-300 bg-gray-100 p-3 rounded-lg cursor-pointer text-gray-600 text-sm">
              <FaPaperclip className="shrink-0" />
              <span className="truncate">
                {attachment ? attachment.name : "Attach a PO or design file (optional, max 10MB)"}
              </span>
              <input
                type="file"
                accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.webp"
                onChange={handleAttachmentChange}
                className="hidden"
              />
            </label>
            {attachmentError && (
              <p className="sm:col-span-2 text-red-600 text-sm -mt-2">{attachmentError}</p>
            )}

            <button
              type="submit"
              disabled={sending}
              suppressHydrationWarning
              className="justify-self-start bg-brand-blue text-white font-semibold py-3 px-8 rounded-full hover:bg-brand-blue-dark transition flex items-center justify-center gap-2 sm:col-span-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <FaPaperPlane /> {sending ? "Sending..." : "Send Message"}
            </button>
          </form>

          {submitted && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-green-600 mt-6 font-medium"
            >
              ✅ Your inquiry has been sent! The nearest RBPN partner will reach out to you soon.
            </motion.p>
          )}

          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-600 mt-6 font-medium"
            >
              Something went wrong. Please try again, or reach us through our Contact page.
            </motion.p>
          )}
        </motion.div>
      </div>
    </section>
  );
}
