"use client";

import Image from "next/image";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { motion } from "framer-motion";

export default function ProLsPage() {
  const listVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <main className="relative flex flex-col min-h-screen overflow-hidden text-gray-800">
      <Header />

      {/* ===== HERO SECTION ===== */}
      <motion.section
        initial={{ scale: 1.05, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 2, ease: "easeOut" }}
        className="relative flex flex-col items-center justify-center text-center min-h-screen px-6 md:px-12 pt-32 md:pt-40"
      >
        <Image
          src="/assets/ProLs_bg.webp"
          alt="Professional Laundry Solutions background"
          fill
          priority
          quality={100}
          className="object-cover object-bottom brightness-[1.1] -z-10"
          sizes="100vw"
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/70 -z-10"
        />

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
          className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight max-w-6xl drop-shadow-[0_4px_20px_rgba(0,0,0,0.6)]"
        >
          Professional Laundry Solutions
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 1 }}
          className="text-lg md:text-2xl text-gray-100 max-w-3xl leading-relaxed"
        >
          Run your laundry business with the right chemicals while remaining{" "}
          <span className="font-semibold text-white">environmentally friendly</span>.
        </motion.p>
      </motion.section>

      {/* ===== PRODUCT SECTION ===== */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="py-24 px-6 md:px-12 lg:px-20"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl mx-auto items-center">
          {/* Text Section */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 1 }}
            className="text-left space-y-6"
          >
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900">
              lagoon® Advanced Care — It’s a Game Changer!
            </h2>

            <p className="text-lg md:text-xl leading-relaxed">
              Running a laundry business involves more than just machines and customers — it’s also about using the right chemicals. Selling laundry essentials such as liquid detergents and fabric softeners is often overlooked as a source of income. Many business owners simply provide these to fill customers’ needs, but without available chemicals, customers may not visit the shop in the first place.
            </p>

            <p className="text-lg md:text-xl leading-relaxed">
              At <strong>ELS Phils., Inc.</strong>, we value both environmental responsibility and product performance. With countless chemical options available, we’ve been selective in choosing what truly delivers results. Through continuous research, we’ve identified the ideal solution for your laundry business — one that’s efficient, sustainable, and profitable.
            </p>

            <p className="text-lg md:text-xl leading-relaxed">
              Run your laundry operations with the right chemicals while staying environmentally friendly. With this approach, you not only ensure cleaner results but also gain a strong revenue stream thanks to highly efficient chemical performance.
            </p>

            <div className="pt-4">
              <h3 className="text-2xl font-semibold mb-3">Our Pro LS chemicals:</h3>
              <ul className="text-lg md:text-xl list-disc list-inside text-gray-700 space-y-2">
                <li>Deliver high potential revenue through superior efficiency</li>
                <li>Extend the lifespan of washers — doubling their service life</li>
                <li>Reduce waste, promoting eco-friendly operations</li>
              </ul>
            </div>
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
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.5 }}
              className="w-full h-full"
            >
              <Image
                src="/assets/prols.webp"
                alt="LG Commercial Laundry Equipment"
                fill
                className="object-cover object-center"
              />
            </motion.div>
          </motion.div>
        </div>

        {/* ===== LIST + CONTACT SECTION ===== */}
        <div className="max-w-6xl mx-auto mt-24 grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* List Section */}
          <motion.div
            variants={listVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
              Why do we need PRO Laundry Solutions?
            </h3>
            <motion.ul
              variants={listVariants}
              className="space-y-4 text-lg text-gray-700"
            >
              {[
                "Over 2 billion plastic containers are consumed every year.",
                "Ordinary detergents can produce excessive suds that damage machines.",
                "Maintenance costs rise due to residues from low-quality detergents.",
                "Poor wash quality can harm your shop’s reputation.",
              ].map((item, index) => (
                <motion.li
                  key={index}
                  variants={itemVariants}
                  className="flex items-start gap-2"
                >
                  <span className="mt-1.5 h-2 w-2 bg-blue-600 rounded-full"></span>
                  {item}
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>

          {/* Contact Section */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 1 }}
            className="bg-gray-50 p-8 rounded-2xl shadow-md"
          >
            <h4 className="text-2xl font-semibold text-gray-900 mb-4">
              Need Help?
            </h4>
            <p className="text-lg text-gray-700 mb-6">
              Have questions or want to talk to our product line specialist? Contact us using the details below.
            </p>
            <div className="space-y-2 text-lg">
              <p>
                <span className="font-semibold">Name:</span> Jomel Galit
              </p>
              <p>
                <span className="font-semibold">Product Line:</span>{" "}
                Professional Laundry Solutions (ProLS)
              </p>
              <p>
                <span className="font-semibold">Contact No:</span> 0917-194-0018
              </p>
            </div>
          </motion.div>
        </div>
      </motion.section>

      <Footer />
    </main>
  );
}
