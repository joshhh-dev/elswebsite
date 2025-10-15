"use client";

import Image from "next/image";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { motion } from "framer-motion";

export default function LgPage() {
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
    <main className="relative flex flex-col overflow-hidden">
      <Header />

      {/* ===== HERO SECTION (Full-Screen Background) ===== */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 md:px-12">
        {/* Background Image */}
        <motion.div
          initial={{ scale: 1.05, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 2, ease: "easeOut" }}
          className="absolute inset-0 -z-10"
        >
          <Image
            src="/assets/lg_web.webp"
            alt="Laundry background"
            fill
            priority
            quality={100}
            className="object-cover object-center scale-110"
            sizes="100vw"
          />
        </motion.div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/5 via-black/10 to-black/40 -z-10" />

        {/* Hero Text */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="text-5xl md:text-7xl font-bold text-white drop-shadow-2xl mb-6"
        >
          Start your business with the experts!
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 1 }}
          className="text-xl md:text-2xl text-gray-100 max-w-9xl leading-relaxed drop-shadow-lg"
        >
          Equipment purchasing is just 20% of the investment. In order to start a
          successful laundry business long-term, it is important to consider the
          other aspects of the business, like human resources, operations
          management, income and expenses, sales, marketing & promotions, and a
          lot more! In{" "}
          <span className="font-semibold text-white">ELS Phils., Inc.</span>, our
          goal is to help you with everything you need.
        </motion.p>
      </section>

      {/* ===== PRODUCT SECTION (Text Left, Image Right) ===== */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="relative py-20 px-6 md:px-12 lg:px-20 bg-white"
      >
        {/* Text + Image Grid */}
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
              Start Your Laundry Business Like A Veteran
            </h2>
            <p className="text-lg md:text-xl text-gray-700 leading-relaxed mb-4">
              At <span className="font-semibold">ELS Phils., Inc.</span>, we focus
              on your success. Our goal is to provide the best laundry business
              experience possible, helping you gain a competitive edge,
              cost-savings, and higher profitability.
            </p>
            <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
              Along with free trainings, seminars, and preventive maintenance
              services, we also guide our clients on how to expand their services
              to generate more income and ensure a faster return on investment.
            </p>
          </motion.div>

          {/* Image Section */}
          <motion.div
            initial={{ opacity: 0, x: 40, scale: 0.95 }}
            whileInView={{ opacity: 1, x: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 1 }}
            className="relative h-[400px] md:h-[500px] rounded-2xl overflow-hidden shadow-lg"
          >
            <motion.div
              initial={{ scale: 1 }}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.5 }}
              className="w-full h-full"
            >
              <Image
                src="/assets/lg.webp"
                alt="LG Commercial Laundry Equipment"
                fill
                className="object-cover object-center"
              />
            </motion.div>
          </motion.div>
        </div>

        {/* ===== List + Contact Info Grid ===== */}
        <div className="max-w-6xl mx-auto mt-16 grid grid-cols-1 md:grid-cols-2 gap-12 items-start text-left">
          {/* List Section */}
          <motion.div
            variants={listVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-6">
              Setting up your laundry business with ELS Phils., Inc., is a surefire
              way to achieve incredible long-term results!
            </h3>
            <motion.ul
              variants={listVariants}
              className="list-disc list-inside text-gray-700 text-lg space-y-2"
            >
              {[
                "Efficient and fast ROI",
                "Low operating expense",
                "Reliable and quick to respond after-sales",
                "Innovative seminars and trainings",
                "Sales, promotions, and marketing assistance",
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
          >
            <h4 className="text-lg md:text-3xl font-semibold text-gray-800 mb-2">
              Need Help?
            </h4>
            <p className="text-gray-700 text-lg leading-relaxed mb-4">
              Do you have any questions, or would you like to inquire directly to
              our product line specialist? Contact us using the details below!
            </p>
            <p className="text-gray-700 text-lg leading-relaxed pt-3">
              <span className="font-semibold">Name:</span> Kevin Aquino
            </p>
            <p className="text-gray-700 text-lg leading-relaxed">
              <span className="font-semibold">Product Line:</span> LG Commercial
              Washer & Dryer
            </p>
            <p className="text-gray-700 text-lg leading-relaxed">
              <span className="font-semibold">Contact No:</span> 0917-194-0028
            </p>
          </motion.div>
        </div>
      </motion.section>
      
      <Footer />
    </main>
  );
}
