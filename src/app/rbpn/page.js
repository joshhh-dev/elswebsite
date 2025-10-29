"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import Footer from "../components/Footer";
import { motion } from "framer-motion";

export default function FindADealerPage() {
  const dealers = [
    { name: "MRP Laundry Setup", logo: "/assets/partner1.png", location: "Manila", slug: "manila" },
    { name: "Lucky 8 Laundry", logo: "/assets/partner2.png", location: "Marikina", slug: "marikina" },
    { name: "BigZe Corporation", logo: "/assets/partner3.png", location: "Quezon City", slug: "quezoncity" },
    { name: "One RockFord Industries", logo: "/assets/partner1.png", location: "Laguna", slug: "laguna" },
    { name: "Integrated Biz Solutions", logo: "/assets/partner1.png", location: "Cavite", slug: "cavite" },
    { name: "Bubble Bee Laundry", logo: "/assets/partner1.png", location: "Pampanga", slug: "pampanga" },
    { name: "LabaXpress", logo: "/assets/partner1.png", location: "Pangasinan", slug: "pangasina" },
    { name: "HannWash", logo: "/assets/partner1.png", location: "Naga", slug: "naga" },
    { name: "Electro Multi Sales and Services", logo: "/assets/partner1.png", location: "Cebu", slug: "cebu" },
    { name: "Esprutinkle Laundry", logo: "/assets/partner1.png", location: "Antique", slug: "antique" },
    { name: "Laba Box", logo: "/assets/partner1.png", location: "Davao", slug: "davao" },
    { name: "Laundries Laundry", logo: "/assets/partner1.png", location: "Valenzuela", slug: "valenzuela" },
    { name: "Spotless", logo: "/assets/partner1.png", location: "Bataan", slug: "bataan" },
    { name: "JAMS Laundry Supplies and Equipment", logo: "/assets/partner1.png", location: "Ilo-Ilo", slug: "ilo-ilo" },
    { name: "Racines Corporation", logo: "/assets/partner1.png", location: "Batangas", slug: "batangas" },
    { name: "UCAN Laundry Self-Service Laundromat", logo: "/assets/partner1.png", location: "Bohol", slug: "bohol" },
    { name: "Quezon Laundry Machine Trading", logo: "/assets/partner1.png", location: "Quezon Province", slug: "quezonprovince" },
    { name: "WISH WASH Laundry", logo: "/assets/partner1.png", location: "Tarlac", slug: "tarlac" },
    { name: "Prime Kinetic - Laundry Setup-PH", logo: "/assets/partner1.png", location: "Bulacan", slug: "bulacan" },
  ];

  return (
    <main className="min-h-screen flex flex-col bg-gray-50">
      <section className="flex flex-col items-center py-20 px-6 text-center">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl font-bold text-gray-800 mb-8"
        >
          Find A Dealer Near You
        </motion.h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 max-w-7xl">
          {dealers.map((dealer, index) => (
            <motion.div
              key={dealer.name}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white shadow-lg rounded-2xl p-6 hover:shadow-xl transition-all hover:-translate-y-2"
            >
              <Link href={`/rbpn/${dealer.slug}`} className="no-underline">
                <div className="flex flex-col items-center">
                  <Image
                    src={dealer.logo}
                    alt={dealer.name}
                    width={120}
                    height={120}
                    className="rounded-full mb-4 object-cover"
                  />
                  <h3 className="text-lg font-semibold text-gray-800">{dealer.name}</h3>
                  <p className="text-sm text-gray-500 mt-1">{dealer.location}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
}
