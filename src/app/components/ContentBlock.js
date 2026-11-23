import {
  KeyFeaturesBlock,
  AdvantagesBlock,
  BenefitsBlock,
  RelatedProductsBlock,
} from "@/app/components/ProductBlocks";

// Shared renderer for the block-array content model used by both the
// "posts" (Announcements) and "products" Firestore collections — authored
// in the RBPN Dealer Portal's admin, rendered here as plain server-rendered
// JSX (no HTML/markdown parsing, so this stays safe with no sanitization
// layer needed). The 4 newer block types (keyFeatures/advantages/benefits/
// relatedProducts) are product-only in practice — posts' block editor never
// creates them — but handling them here too costs nothing and keeps one
// renderer in sync with one editor.
export default function ContentBlock({ block, index, relatedProducts }) {
  if (block.type === "keyFeatures") {
    return <KeyFeaturesBlock key={index} block={block} />;
  }

  if (block.type === "advantages") {
    return <AdvantagesBlock key={index} block={block} />;
  }

  if (block.type === "benefits") {
    return <BenefitsBlock key={index} block={block} />;
  }

  if (block.type === "relatedProducts") {
    return <RelatedProductsBlock key={index} relatedProducts={relatedProducts} />;
  }

  if (block.type === "text") {
    return (
      <p key={index} className="text-gray-700 leading-relaxed whitespace-pre-wrap">
        {block.content}
      </p>
    );
  }

  if (block.type === "list") {
    return (
      <div key={index}>
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

  if (block.type === "image" && block.url) {
    return (
      <figure key={index}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={block.url} alt={block.caption || ""} className="w-full h-auto rounded-xl" />
        {block.caption && (
          <figcaption className="text-sm text-gray-500 mt-2 text-center">
            {block.caption}
          </figcaption>
        )}
      </figure>
    );
  }

  return null;
}
