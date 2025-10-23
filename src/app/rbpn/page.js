"use client";

import React, { useState } from "react";
import Image from "next/image";
import Footer from "../components/Footer";
import { motion } from "framer-motion";

export default function PartnershipPage() {
  const partners = [
    { name: "MRP Laundry Setup", logo: "/assets/partner1.png" },
    { name: "Lucky 8 Laundry", logo: "/assets/partner2.png" },
    { name: "BigZe Corporation", logo: "/assets/partner3.png" },
    { name: "One RockFord Industries", logo: "/assets/partner1.png" },
    { name: "Integrated Biz Solutions", logo: "/assets/partner1.png" },
    { name: "Bubble Bee Laundry", logo: "/assets/partner1.png" },
    { name: "LabaXpress", logo: "/assets/partner1.png" },
    { name: "HannWash", logo: "/assets/partner1.png" },
    { name: "Electro Multi Sales and Services", logo: "/assets/partner1.png" },
    { name: "Esprutinkle Laundry", logo: "/assets/partner1.png" },
    { name: "Laba Box", logo: "/assets/partner1.png" },
    { name: "Laundries Laundry", logo: "/assets/partner1.png" },
    { name: "Spotless", logo: "/assets/partner1.png" },
    { name: "JAMS Laundry Supplies and Equipment", logo: "/assets/partner1.png" },
    { name: "Racines Corporation", logo: "/assets/partner1.png" },
    { name: "UCAN Laundry Self-Service Laundromat", logo: "/assets/partner1.png" },
    { name: "Quezon Laundry Machine Trading", logo: "/assets/partner1.png" },
    { name: "WISH WASH Laundry", logo: "/assets/partner1.png" },
    { name: "Prime Kinetic - Laundry Setup-PH", logo: "/assets/partner1.png" },

  ];

  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Thank you for your interest! We'll get back to you soon.");
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-50 to-white text-gray-800">
      {/* ===== HERO / INTRO SECTION ===== */}
      <section className="w-full max-w-5xl text-center py-20 px-6">
        <motion.h1
          className="text-5xl font-extrabold mb-6 text-blue-800"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          Building Strong Partnerships for a Sustainable Future
        </motion.h1>

        <motion.p
          className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.7 }}
        >
          We collaborate with forward-thinking organizations around the world
          to drive innovation, sustainability, and growth. Together, we’re
          shaping a smarter and greener tomorrow.
        </motion.p>
      </section>

      {/* ===== PARTNER CARDS SECTION ===== */}
      <section className="w-full max-w-6xl py-10 px-8">
        <h2 className="text-3xl font-bold text-center mb-10 text-blue-700">
          Our Partners
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12 justify-items-center">
          {partners.map((partner, index) => (
            <motion.div
              key={index}
              className="p-5 bg-white rounded-2xl shadow-md hover:shadow-xl transition-transform hover:-translate-y-2 flex flex-col items-center"
              whileHover={{ scale: 1.05 }}
            >
              <Image
                src={partner.logo}
                alt={partner.name}
                width={200}
                height={200}
                className="rounded-lg mb-5 object-contain"
              />
              <h3 className="text-xl font-semibold text-gray-800">
                {partner.name}
              </h3>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ===== FOOTER (Optional) ===== */}
        <Footer />
    </main>
  );
}
