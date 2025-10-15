"use client";
import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaPaperPlane } from "react-icons/fa";
import { toast, ToastContainer, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Footer from "../components/Footer";

export default function ContactUsPage() {
  const form = useRef();
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

const sendEmail = async (e) => {
  e.preventDefault();
  setSending(true);
  const formData = new FormData(form.current);
  const data = Object.fromEntries(formData.entries());

  try {
    const res = await fetch("/api/send-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      // Let the plane fly off first before showing toast
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
            closeOnClick: true,
            pauseOnHover: true,
            draggable: false,
            theme: "colored",
            transition: Slide,
          }
        );

        form.current.reset();
        setTimeout(() => setSent(false), 1500);
      }, 1000); // delay matches plane animation
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
    <main className="relative min-h-screen flex flex-col overflow-hidden bg-gray-50">
<ToastContainer
  position="top-center"
  autoClose={3000}
  hideProgressBar={false}
  newestOnTop
  closeOnClick
  pauseOnHover
  draggable
  transition={Slide}
  theme="colored"
/>
      {/* ===== HERO SECTION ===== */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-center py-20 px-6 md:px-12 bg-gradient-to-b from-blue-900 via-blue-800 to-blue-700 text-white"
      >
        <h1 className="text-4xl md:text-6xl font-extrabold mb-4">
          Contact <span className="text-white-400">ELS Philippines Inc.</span>
        </h1>
        <p className="text-lg md:text-2xl max-w-3xl mx-auto leading-relaxed text-gray-200">
          Have a question about our products, services, or need expert advice?
          We’re here to help you every step of the way.
        </p>
      </motion.section>

      {/* ===== CONTACT SECTION ===== */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 1 }}
        className="py-20 px-6 md:px-12 lg:px-20 bg-white flex-1"
      >
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16">
          {/* ===== LEFT: CONTACT FORM ===== */}
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-6">
              Inquire now
            </h2>
            <form ref={form} onSubmit={sendEmail} className="space-y-5">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Name
                </label>
                <input
                  type="text"
                  name="user_name"
                  placeholder="Your full name"
                  required
                  className="w-full border text-black border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="user_email"
                  placeholder="you@example.com"
                  required
                  className="w-full border text-black border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Message
                </label>
                <textarea
                  name="message"
                  rows="5"
                  placeholder="How can we help you?"
                  required
                  className="w-full border text-black border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none"
                ></textarea>
              </div>

{/* ===== BUTTON WITH AIRPLANE TRAIL ANIMATION ===== */}
<motion.button
  whileHover={!sending ? { scale: 1.05 } : {}}
  whileTap={!sending ? { scale: 0.97 } : {}}
  transition={{ type: "spring", stiffness: 300 }}
  type="submit"
  disabled={sending}
  className={`relative overflow-hidden w-full flex items-center justify-center gap-3 py-3 rounded-xl font-semibold text-lg transition-colors ${
    sending
      ? "bg-blue-800 cursor-not-allowed text-white"
      : "bg-blue-900 hover:bg-blue-800 text-white"
  }`}
>
  {sending ? (
    <div className="relative">
      {/* Airplane Icon */}
      <motion.div
        key="plane"
        initial={{ x: 0, y: 0, rotate: 0, opacity: 1 }}
        animate={{
          x: [0, 50, 100, 200, 250],
          y: [0, -30, -80, -160, -220],
          rotate: [0, 20, 45, 60, 80],
          opacity: [1, 0.9, 0.7, 0.4, 0],
        }}
        transition={{ duration: 1.2, ease: "easeInOut" }}
        className="absolute"
      >
        <FaPaperPlane className="text-2xl text-white" />
      </motion.div>

      {/* ✨ Trail Effect */}
      {[...Array(4)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ x: 0, y: 0, opacity: 0.3 }}
          animate={{
            x: [0, 40 * (i + 1), 80 * (i + 1), 160 * (i + 1)],
            y: [0, -20 * (i + 1), -60 * (i + 1), -100 * (i + 1)],
            opacity: [0.3, 0.2, 0.1, 0],
          }}
          transition={{
            duration: 1.2,
            ease: "easeInOut",
            delay: i * 0.05,
          }}
          className="absolute w-8 h-1 rounded-full"
          style={{
            background: "linear-gradient(to right, rgba(255,255,255,0.5), transparent)",
            filter: "blur(2px)",
          }}
        />
      ))}
    </div>
  ) : sent ? (
    <motion.span
      key="sent"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
    >
      Sent ✅
    </motion.span>
  ) : (
    <>
      <FaPaperPlane className="text-xl transition-transform duration-300 group-hover:translate-x-1" />
      Send Message
    </>
  )}
</motion.button>

{sending && (
  <p className="text-sm text-blue-700 text-center mt-2 animate-pulse">
    Sending your message...
  </p>
)}

            </form>
          </div>

          {/* ===== RIGHT: CONTACT INFO ===== */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 1 }}
            className="bg-gray-50 border border-gray-200 rounded-2xl p-8 shadow-md"
          >
            <h3 className="text-2xl font-semibold text-gray-800 mb-6">
              Contact Information
            </h3>
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <FaPhoneAlt className="text-blue-600 text-2xl" />
                <div>
                  <p className="text-gray-800 font-semibold">Phone</p>
                  <p className="text-gray-600">+63 917 628 9839</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <FaEnvelope className="text-blue-600 text-2xl" />
                <div>
                  <p className="text-gray-800 font-semibold">Email</p>
                  <p className="text-gray-600">Elsevents35@gmail.com</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <FaMapMarkerAlt className="text-blue-600 text-2xl" />
                <div>
                  <p className="text-gray-800 font-semibold">Office</p>
                  <p className="text-gray-600">
                    M4 & M5 Goldland Tower 10 Eisenhower St. Greenhills, San Juan City
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.section>
    </main>
  );
}
