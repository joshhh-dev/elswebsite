"use client";

import Image from "next/image";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { motion } from "framer-motion";

export default function LmsPage() {
  const listVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <main className="relative min-h-screen flex flex-col overflow-hidden pt-[100px]">
      <Header />

      {/* ===== HERO BACKGROUND ===== */}
      <motion.div
        initial={{ opacity: 0, scale: 1.05 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 2.5, ease: "easeOut" }}
        className="absolute inset-0 -z-10"
      >
        <Image
          src="/assets/LMS.webp"
          alt="Laundry Management System"
          fill
          priority
          quality={100}
          className="object-contain object-[50%_-10%] md:object-[50%_-15%]"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/50 to-black/80" />
      </motion.div>

      {/* ===== HERO SECTION ===== */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
        className="flex flex-col items-center justify-center text-center min-h-[90vh] px-6 md:px-10 translate-y-[5%] relative z-10"
      >
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: "easeOut", delay: 0.4 }}
          className="text-5xl md:text-6xl font-extrabold text-white drop-shadow-[0_4px_25px_rgba(0,0,0,0.6)] mb-6 leading-tight"
        >
          The Laundry Management System (LMS)
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 1 }}
          className="text-lg md:text-2xl text-gray-100 max-w-5xl leading-relaxed mb-10"
        >
          ELS continues to make a difference in people&apos;s lives with customer-centric
          innovations. Our latest breakthrough — the{" "}
          <span className="font-semibold text-white">
            Laundry Management System
          </span>{" "}
          — is the key to managing your laundry business with precision, ease, and confidence.
        </motion.p>
      </motion.section>

      {/* ===== PRODUCT SECTION ===== */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="relative py-20 px-6 md:px-12 lg:px-20 bg-white"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-12 max-w-6xl mx-auto">
          {/* Text Section */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 1 }}
            className="text-left"
          >
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
              Comes With a FREE Smart Tablet & Thermal Printer
            </h2>
            <p className="text-lg md:text-xl text-gray-700 leading-relaxed mb-4">
              After the many challenges laundry owners face — from difficult audits to unclear
              profits — our LMS offers a fully connected experience that fits the way you work.
              Even when you&apos;re away, you&apos;re always in control. And if anything comes up,
              our CSI Technical Online Support Team is always ready to help!
            </p>
            <ul className="list-disc list-inside text-gray-700 text-lg space-y-2">
              <li>Almost paperless operation for environmental care</li>
              <li>No more confusing manual logbooks</li>
              <li>Customizable promos and discounts</li>
              <li>Prevents theft and unauthorized transactions</li>
              <li>...and many more!</li>
            </ul>
          </motion.div>

          {/* Image Section */}
          <motion.div
            initial={{ opacity: 0, x: 40, scale: 0.95 }}
            whileInView={{ opacity: 1, x: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 1 }}
            className="relative h-[400px] md:h-[500px] rounded-2xl overflow-hidden shadow-2xl"
          >
            <motion.div
              initial={{ scale: 1 }}
              transition={{ duration: 0.5 }}
              className="w-full h-full"
            >
              <Image
                src="/assets/lms_2.webp"
                alt="LMS Equipment Display"
                fill
                className="object-cover object-center"
              />
            </motion.div>
          </motion.div>
        </div>

        {/* ===== FEATURES LIST + CONTACT ===== */}
        <div
          id="contact"
          className="max-w-6xl mx-auto mt-20 grid grid-cols-1 md:grid-cols-2 gap-12 items-start text-left"
        >
          {/* Features List */}
          <motion.div
            variants={listVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
              Main Features & Functions
            </h3>
            <motion.ul
              variants={listVariants}
              className="list-disc list-inside text-gray-700 text-lg space-y-2"
            >
              {[
                "CSI Version 3.5 – Advanced app for fast transactions, promos, and reporting",
                "Processing Console – Wireless activation with authentic machine usage data",
                "Boss Management System – Real-time business dashboard with cloud backup",
                "Remote Activator – Uninterrupted communication without complex cabling",
                "Key Card Activation – Easy top-up wallet for customer loyalty & convenience",
              ].map((text, index) => (
                <motion.li key={index} variants={itemVariants}>
                  {text}
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 1 }}
            className="bg-blue-50 border border-blue-100 rounded-2xl p-8 shadow-sm hover:shadow-lg transition"
          >
            <h4 className="text-2xl font-semibold text-gray-900 mb-3">
              Need Help?
            </h4>
            <p className="text-gray-700 text-lg leading-relaxed mb-5">
              Have questions or want to inquire directly with our product specialist?
              We’re happy to assist!
            </p>
            <div className="space-y-2 text-gray-800 text-lg">
              <p>
                <span className="font-semibold">Name:</span> James Robert D. Naluz
              </p>
              <p>
                <span className="font-semibold">Product Line:</span> Laundry Management System
              </p>
              <p>
                <span className="font-semibold">Contact No:</span>{" "}
                <a
                  href="viber://chat?number=09761337196"
                  className="text-blue-600 hover:underline"
                >
                  0976-133-7196 (Viber)
                </a>
              </p>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* ===== Footer ===== */}
      <div className="bg-white">
        <Footer />
      </div>
    </main>
  );
}
