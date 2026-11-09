"use client";

import { motion } from "framer-motion";

// "split" product template — recreates the original per-product pages'
// alternating two-column design (text/image side by side, flipping sides
// row to row) generically from the same text/list/image blocks the admin
// already authors for the default "stacked" template. A text/list block
// immediately followed by an image block becomes one two-column row;
// anything that doesn't pair up falls back to full-width.
function pairBlocks(blocks) {
  const sections = [];
  let i = 0;
  while (i < blocks.length) {
    const current = blocks[i];
    const next = blocks[i + 1];
    if ((current.type === "text" || current.type === "list") && next?.type === "image" && next.url) {
      sections.push({ type: "pair", textBlock: current, imageBlock: next });
      i += 2;
    } else {
      sections.push({ type: "single", block: current });
      i += 1;
    }
  }
  return sections;
}

function TextContent({ block }) {
  if (block.type === "text") {
    return (
      <p className="text-gray-700 text-lg leading-relaxed whitespace-pre-wrap">{block.content}</p>
    );
  }
  return (
    <div>
      {block.heading && (
        <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">{block.heading}</h3>
      )}
      <ul className="list-disc list-inside text-gray-700 text-lg space-y-2">
        {(block.items || []).map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

function SingleBlock({ block }) {
  return (
    <div className="max-w-4xl mx-auto w-full">
      {block.type === "image" && block.url ? (
        <figure>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={block.url} alt={block.caption || ""} className="w-full h-auto rounded-xl" />
          {block.caption && (
            <figcaption className="text-sm text-gray-500 mt-2 text-center">{block.caption}</figcaption>
          )}
        </figure>
      ) : (
        <TextContent block={block} />
      )}
    </div>
  );
}

export default function ProductSplitLayout({ blocks = [] }) {
  const sections = pairBlocks(blocks);

  return (
    <section className="relative py-16 px-6 md:px-12 lg:px-20 bg-white">
      <div className="max-w-6xl mx-auto flex flex-col gap-16">
        {sections.map((section, i) => {
          if (section.type === "single") {
            return <SingleBlock key={i} block={section.block} />;
          }

          const reverse = i % 2 === 1;
          const textCol = (
            <motion.div
              key="text"
              initial={{ opacity: 0, x: reverse ? 40 : -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <TextContent block={section.textBlock} />
            </motion.div>
          );
          const imageCol = (
            <motion.div
              key="image"
              initial={{ opacity: 0, x: reverse ? -40 : 40, scale: 0.95 }}
              whileInView={{ opacity: 1, x: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="relative h-[320px] md:h-[420px] rounded-2xl overflow-hidden shadow-lg"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={section.imageBlock.url}
                alt={section.imageBlock.caption || ""}
                className="w-full h-full object-cover object-center"
              />
            </motion.div>
          );

          return (
            <div key={i} className="grid grid-cols-1 md:grid-cols-2 items-center gap-10">
              {reverse ? imageCol : textCol}
              {reverse ? textCol : imageCol}
            </div>
          );
        })}
      </div>
    </section>
  );
}
