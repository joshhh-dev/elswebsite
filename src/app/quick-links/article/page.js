"use client";
import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

export default function ArticlePage() {
  const relatedArticles = [
    {
      id: 1,
      title: "How Smart Laundry Systems Are Changing the Industry",
      image: "/images/article1.jpg",
    },
    {
      id: 2,
      title: "Top 5 Energy-Saving Tips for Laundry Operations",
      image: "/images/article2.jpg",
    },
    {
      id: 3,
      title: "The Future of Water Efficiency in Commercial Laundries",
      image: "/images/article3.jpg",
    },
  ];

  return (
    <main className="min-h-screen flex flex-col items-center bg-gray-50 text-gray-800">
      {/* ===== HERO SECTION ===== */}
      <section className="relative w-full h-[50vh] flex items-center justify-center overflow-hidden">
        <Image
          src="/images/article-hero.jpg"
          alt="Article Hero"
          fill
          className="object-cover brightness-75"
        />
        <div className="relative z-10 text-center text-black px-6">
          <motion.h1
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-6xl font-bold mb-4"
          >
            The Evolution of Laundry Technology
          </motion.h1>
          <p className="text-lg md:text-xl font-light">
            How innovation reshaped the laundry industry for the modern age.
          </p>
        </div>
      </section>

      {/* ===== ARTICLE CONTENT ===== */}
      <section className="max-w-4xl mx-auto px-6 py-16 leading-relaxed">
        <p className="text-sm text-gray-500 mb-8">
          By <span className="font-semibold text-gray-700">Admin</span> | Oct 23, 2025
        </p>

        <article className="space-y-6 text-justify">
          <p>
            Laundry technology has evolved tremendously over the past few
            decades. From manual washing to fully automated systems, innovation
            continues to drive efficiency and sustainability.
          </p>
          <p>
            With smart sensors and data-driven analytics, modern laundry
            operations can now monitor water consumption, electricity usage, and
            machine performance in real time. This not only saves resources but
            also reduces operational costs.
          </p>
          <Image
            src="/images/article-inside.jpg"
            alt="Modern Laundry"
            width={800}
            height={450}
            className="rounded-xl shadow-md my-6 mx-auto"
          />
          <p>
            The future looks bright with the integration of IoT and AI, helping
            operators predict maintenance schedules and optimize wash cycles for
            each load type. These advancements ensure both sustainability and
            high-quality results.
          </p>
        </article>
      </section>

      {/* ===== RELATED ARTICLES ===== */}
      <section className="bg-white w-full py-16">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-2xl font-bold mb-8 text-gray-800 text-center">
            Related Articles
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {relatedArticles.map((item) => (
              <motion.div
                key={item.id}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
                className="bg-gray-100 rounded-xl overflow-hidden shadow hover:shadow-lg cursor-pointer"
              >
                <Image
                  src={item.image}
                  alt={item.title}
                  width={400}
                  height={250}
                  className="object-cover w-full h-48"
                />
                <div className="p-4">
                  <h3 className="text-lg font-semibold">{item.title}</h3>
                  <p className="text-sm text-gray-600 mt-2">
                    Read more →
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
