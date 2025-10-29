"use client";

import Image from "next/image";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { motion } from "framer-motion";

export default function LacPage() {
  // Variants for animated list
  const listVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <main className="relative min-h-screen flex flex-col overflow-hidden pt-[40px]">
      <Header />

      {/* ===== Animated Background ===== */}
      <motion.div
        initial={{ scale: 1.05, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 2.5, ease: "easeOut" }}
        className="absolute inset-0 -z-10"
      >
        <Image
          src="/assets/lac_bg.webp"
          alt="Lagoon Advanced Care background"
          fill
          priority
          quality={100}
          className="object-contain object-[50%_0%] md:object-[50%_-10%]"
          sizes="100vw"
        />

        {/* Gradient overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80 pointer-events-none" />
      </motion.div>

      {/* ===== Hero Section ===== */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="flex flex-col items-center justify-center text-center flex-1 px-6 md:px-12 pt-48 md:pt-56 pb-24"
      >
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: "easeOut", delay: 0.4 }}
          className="text-4xl md:text-6xl font-extrabold text-white leading-tight 
                     drop-shadow-[0_4px_20px_rgba(0,0,0,0.8)] mb-6 max-w-9xl
                     px-4 py-2 rounded-lg"
        >
          The ultimate solution for cleaning delicate garments, leathers, and more.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8, duration: 1 }}
          className="text-lg md:text-2xl text-gray-100 max-w-7xl leading-relaxed drop-shadow-[0_4px_20px_rgba(0,0,0,0.6)]"
        >
          When you choose{" "}
          <span className="font-semibold text-gray-300">
            lagoon® Advanced Care (LAC)
          </span>
          , you embrace a new level of unique benefits and advantages — all while
          staying{" "}
          <span className="font-semibold text-gray-300">
            environmentally friendly
          </span>
          .
        </motion.p>
      </motion.section>

      {/* ===== Product Section (Text Left, Image Right) ===== */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
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
            <h2 className="text-3xl md:text-5xl font-bold text-gray-800 mb-6">
              <span className="text-teal-600">lagoon® Advanced Care</span> — It’s a
              Game Changer!
            </h2>
            <p className="text-lg md:text-xl text-gray-700 leading-relaxed mb-4 max-w-3xl">
              lagoon® Advanced Care works hand-in-hand with you to boost your
              business. Resulting from over 20 years of expertise in professional
              textile care, lagoon® Advanced Care is the first{" "}
              <span className="font-semibold text-gray-900">1-hour-Dry2Dry</span>{" "}
              process.
            </p>
            <p className="text-lg md:text-xl text-gray-700 leading-relaxed max-w-3xl">
              That means your customers can simply wait for their clothes to be
              fully cleaned — say goodbye to long waiting times!
            </p>
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
                src="/assets/lac.webp"
                alt="Lagoon Advanced Care professional laundry equipment"
                fill
                className="object-cover object-center"
              />
            </motion.div>
          </motion.div>
        </div>

        {/* ===== Features + Contact Grid ===== */}
        <div className="max-w-6xl mx-auto mt-20 grid grid-cols-1 md:grid-cols-2 gap-12 items-start text-left">
          {/* List Section */}
          <motion.div
            variants={listVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
              Main Features & Functions
            </h3>
            <motion.ul
              variants={listVariants}
              className="list-disc list-inside text-gray-700 text-lg space-y-3 max-w-3xl"
            >
              {[
                "Perfect and Fast Results — Dry-to-Dry in 1 hour. Smart detergents and innovative processes enable garments to be dried directly, with no hang-drying required. Fully dried garments are wrinkle-free and easy to finish.",
                "Unique User Experience — The new ClarusVibe control guarantees a modern, intuitive interface for smooth interaction and effortless operation.",
                "Rapid Return on Investment — lagoon® Advanced Care supports your business with higher loading factors, less pre-spotting, easier finishing, and faster processing times.",
                "Smart and Green — Say goodbye to solvent-based cleaning! Every garment type, including leathers and shoes, can be treated with lagoon® Advanced Care in a truly eco-friendly way.",
              ].map((text, index) => (
                <motion.li key={index} variants={itemVariants}>
                  {text}
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>

          {/* Contact Info Section */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 1 }}
            className="bg-gray-50 border border-gray-200 rounded-2xl p-8 shadow-md"
          >
            <h4 className="text-2xl font-semibold text-gray-800 mb-4">
              Need Help?
            </h4>
            <p className="text-gray-700 text-lg leading-relaxed mb-4">
              Have any questions, or would you like to speak directly with our
              product line specialist? Contact us below!
            </p>
            <div className="space-y-2 text-lg text-gray-700">
              <p>
                <span className="font-semibold">Name:</span> Cobe Ponce
              </p>
              <p>
                <span className="font-semibold">Product Line:</span> Lagoon Advanced Care
              </p>
              <p>
                <span className="font-semibold">Contact No:</span>{" "}
                <a
                  href="viber://chat?number=09171940015"
                  className="text-teal-600 hover:underline"
                >
                  0917-194-0015
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
