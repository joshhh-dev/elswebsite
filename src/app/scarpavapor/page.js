"use client";

import Image from "next/image";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { motion } from "framer-motion";

export default function ScarpaPage() {
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
    <main className="relative min-h-screen flex flex-col overflow-hidden">
      <Header />

      {/* ===== HERO SECTION ===== */}
      <motion.section
        initial={{ scale: 1.05, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 2, ease: "easeOut" }}
        className="relative flex flex-col items-center justify-center text-center min-h-screen px-6 md:px-12 pt-32 md:pt-40"
      >
        {/* Background Image */}
        <Image
          src="/assets/scarpa_bg.webp"
          alt="Scarpavapor background"
          fill
          priority
          quality={100}
          // 👇 Adjusted to show model's face and gown properly
          className="object-cover object-center brightness-[0.9] -z-10"
          sizes="100vw"
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80 -z-10" />

        {/* Hero Content */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
          className="text-5xl md:text-7xl font-bold text-white drop-shadow-[0_4px_25px_rgba(0,0,0,0.6)] mb-6 leading-tight max-w-9xl"
        >
          The ultimate solution for cleaning shoes, bags, leathers, and other accessories.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 1 }}
          className="text-lg md:text-2xl text-gray-200 max-w-5xl leading-relaxed"
        >
          Choosing the{" "}
          <span className="text-white font-semibold">Scarpavapor® No Limits</span> lets you
          embrace a new level of unique service and potential income like never before.
        </motion.p>
      </motion.section>

      {/* ===== PRODUCT SECTION ===== */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="relative py-24 px-6 md:px-12 lg:px-20 bg-white"
      >
        {/* Text + Image Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-16 max-w-7xl mx-auto">
          {/* Text Section */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 1 }}
            className="text-center md:text-left px-4"
          >
            <h2 className="text-3xl md:text-5xl font-bold text-gray-800 mb-8">
              What is the Scarpavapor®?
            </h2>

            <p className="text-lg md:text-xl text-gray-700 leading-relaxed mb-6">
              A professional, strong, and reliable steam generator, which has complete cleaning of nearly any item as its main function. The integrated vacuum system helps minimize moisture for a faster drying time. The drying compartment uses gentle heat and ozone to dry and sanitize shoes, sneakers, or boots. A larger drying area for coats, jackets, or other large items is also included.
            </p>

            <p className="text-lg md:text-xl text-gray-700 leading-relaxed mb-6">
              Using the Supreme Shoe & Boot Steam Cleaning and Sanitizing Machine, the operator injects steam and detergent, which then dissolves and removes even the most stubborn dirt with its provided special brushes.
            </p>

            <p className="text-lg md:text-xl text-gray-700 leading-relaxed mb-6">
              The drying compartment provides high-quality shoe drying and sanitizing. The hot air drying is quick and restores softness. The ozone lamp eliminates bacteria and bad odors, ensuring shoes are fully cleaned and sanitized.
            </p>

            <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
              Along with free trainings, seminars, and preventive maintenance services, we ensure your business operates seamlessly. With Scarpavapor® No Limits, you can melt and remove the most obstinate dirt using steam and detergent—delivering outstanding cleaning results. It’s a professional system for cleaning, drying, and sanitizing shoes, bags, helmets, leather suits, carpets, and more.
            </p>
          </motion.div>

          {/* Image Section */}
          <motion.div
            initial={{ opacity: 0, x: 40, scale: 0.95 }}
            whileInView={{ opacity: 1, x: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 1 }}
            className="relative h-[400px] md:h-[550px] rounded-2xl overflow-hidden shadow-2xl"
          >
            <motion.div
              transition={{ duration: 0.5 }}
              className="w-full h-full"
            >
              <Image
                src="/assets/scarpa.webp"
                alt="Scarpavapor Machine"
                fill
                className="object-cover object-center"
              />
            </motion.div>
          </motion.div>
        </div>

        {/* ===== List + Contact Info ===== */}
        <div className="max-w-6xl mx-auto mt-24 grid grid-cols-1 md:grid-cols-2 gap-16 items-start text-left">
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
              className="list-disc list-inside text-gray-700 text-lg space-y-3"
            >
              {[
                "Deep cleaning",
                "Steam and vacuum",
                "Foaming injection",
                "Pretreating detergent injection",
                "Steam brushing",
                "Degreasing detergent injection",
                "Finishing protection nebulization",
                "Drying 36°C (shoes, boots, helmets)",
                "Light dryer for (leather jackets, bags )",
                "Ozone sanitization / Odour removal",
                "Drying seats, sofas, carpets (optional)",
                "Steam carpet cleaning (optional)",
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
            className="bg-gray-50 p-8 rounded-2xl shadow-lg"
          >
            <h4 className="text-2xl font-semibold text-gray-800 mb-3">
              Need Help?
            </h4>
            <p className="text-gray-700 text-lg leading-relaxed mb-4">
              Do you have any questions or want to inquire directly to our product specialist? Contact us below!
            </p>
            <div className="space-y-1 text-gray-700 text-lg leading-relaxed">
              <p>
                <span className="font-semibold">Name:</span> Van Domenden
              </p>
              <p>
                <span className="font-semibold">Product Line:</span> Scarpavapor Series
              </p>
              <p>
                <span className="font-semibold">Contact No:</span> 0917-194-0030
              </p>
            </div>
          </motion.div>
        </div>
      </motion.section>

      <Footer />
    </main>
  );
}
