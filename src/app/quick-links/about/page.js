"use client";

import React from "react";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import { motion } from "framer-motion";
import Image from "next/image";

export default function AboutPage() {
  const productDetails = [
    {
      productName: "Laundry Management Systems",
      description:
        "Our LMS makes running a laundry business easier, helping owners handle auditing, profit/loss tracking, and shop operations efficiently — even remotely.",
      image: "/assets/lms_card.webp",
    },
    {
      productName: "Professional Laundry Solutions",
      description:
        "We provide high-quality detergents, softeners, and cleaning chemicals to help laundry shops improve their service and increase profitability.",
      image: "/assets/prols_card.webp",
    },
    {
      productName: "Scarpavapor",
      description:
        "A powerful steam generator with integrated vacuum and ozone drying system for cleaning shoes, coats, and various fabrics efficiently.",
      image: "/assets/scarpa_card.webp",
    },
    {
      productName: "LG Commercial Laundry Equipment",
      description:
        "Durable, efficient washers and dryers from LG — ideal for laundromats, hotels, hospitals, and industrial facilities.",
      image: "/assets/LG_set_card.webp",
    },
    {
      productName: "Lagoon Advanced Care",
      description:
        "lagoon® Advanced Care works hand-in-hand with you to boost your business. Resulting from over 20 years of expertise in professional textile care, lagoon® Advanced Care is the first 1-hour-Dry2Dry process.",
      image: "/assets/lagoon_card.png",
    },
  ];

  return (
    <div className="relative flex flex-col min-h-screen bg-gray-50 text-gray-800">
      <Header />

      {/* ==== HERO SECTION ==== */}
      <section className="relative flex flex-col items-center justify-center text-center py-32 px-7 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/assets/lg_background.webp"
            alt="ELS Laundry Equipment"
            fill
            className="object-cover brightness-90"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-white/40 to-white"></div>
        </div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-6xl font-bold text-black mb-4 relative z-10 drop-shadow-md"
        >
          About Us
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-base md:text-lg text-black max-w-2xl relative z-10"
        >
          Delivering world-class laundry solutions tailored for hospitality,
          healthcare, and industrial sectors across the Philippines.
        </motion.p>
      </section>

      {/* ==== COMPANY OVERVIEW ==== */}
      <section className="relative py-20 px-6 md:px-14 lg:px-24 bg-gradient-to-b from-white to-blue-50">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          {/* Left Image */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 1 }}
            className="rounded-3xl overflow-hidden shadow-2xl"
          >
            <Image
              src="/assets/Lagoon_ELS_Family.webp"
              alt="ELS Philippines Team"
              width={600}
              height={400}
              className="object-cover w-full h-full"
            />
          </motion.div>

          {/* Right Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 1 }}
            className="bg-white/60 backdrop-blur-lg border border-white/50 p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-transform duration-500"
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-800">
              Who We Are
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              ELS Philippines Inc. provides complete commercial laundry solutions —
              from equipment supply, installation, to after-sales service. We
              partner with leading global brands to deliver reliable and efficient
              laundry systems tailored to our clients’ specific operational needs.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              Our team is composed of experts with years of experience in the
              laundry industry, ensuring that every project meets international
              standards of performance and sustainability.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Since 1987, ELS Phils., Inc. has been the premier laundry supplier in
              the Philippines — continuously innovating through global partnerships
              and technological excellence.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ==== MISSION & VISION ==== */}
      <section className="py-16 sm:py-20 px-4 sm:px-8 md:px-14 lg:px-24 bg-gradient-to-b from-white to-blue-100">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 1 }}
          className="max-w-6xl mx-auto text-center"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-10 sm:mb-14">
            Our Mission & Vision
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 sm:gap-10">
            {[
              {
                title: "Mission",
                text: "We empower our customers and partners by providing innovative solutions that make their operations more profitable, efficient, and sustainable.",
              },
              {
                title: "Vision",
                text: "To be the most innovative leader in the laundry and cleaning industry, offering reliable products and services that give customers the best solutions for their needs.",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 100 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                className="relative group bg-white rounded-3xl shadow-lg overflow-hidden cursor-pointer border border-gray-200"
              >
                <div className="p-8 sm:p-10 bg-gradient-to-t from-blue-50 to-white h-full flex flex-col justify-center items-center transition-all duration-500 group-hover:translate-y-[-100%]">
                  <h3 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-2">
                    {item.title}
                  </h3>
                </div>

                <div className="absolute inset-0 p-8 sm:p-10 bg-blue-600 text-white flex flex-col justify-center items-center transition-all duration-700 translate-y-full group-hover:translate-y-0">
                  <p className="text-sm sm:text-base leading-relaxed">
                    {item.text}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ==== PRODUCT CARDS ==== */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.8 }}
        className="py-20 px-4 sm:px-8 md:px-14 lg:px-24 bg-gradient-to-b from-blue-100 to-white"
      >
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-10 sm:mb-12 text-center">
          ELS Philippines Products
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 sm:gap-10 justify-items-center">
          {productDetails.map((product, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 0.3 }}
              className="group perspective w-full h-[360px] sm:h-96 max-w-sm"
            >
              <div className="relative w-full h-full text-center transition-transform duration-[1000ms] transform-style-preserve-3d group-hover:rotate-y-180 shadow-xl rounded-2xl">
                {/* Front */}
                <div className="absolute inset-0 bg-white flex flex-col items-center justify-center p-6 backface-hidden rounded-2xl">
                  <Image
                    src={product.image}
                    alt={product.productName}
                    width={300}
                    height={300}
                    priority={index}
                    className="rounded-xl mb-4 object-cover shadow-lg transition-transform duration-300 hover:scale-105" 
                    />
                  <h3 className="text-base sm:text-lg font-semibold text-gray-800 text-center">
                    {product.productName}
                  </h3>
                </div>

                {/* Back */}
                <div className="absolute inset-0 bg-blue-600 text-white rounded-2xl p-6 backface-hidden rotate-y-180 flex flex-col justify-center items-center">
                  <h3 className="text-base sm:text-lg font-bold mb-2">
                    {product.productName}
                  </h3>
                  <p className="text-xs sm:text-sm leading-relaxed px-2">
                    {product.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>
      <Footer />
    </div>
  );
}
