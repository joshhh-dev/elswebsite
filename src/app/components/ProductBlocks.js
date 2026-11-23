import Link from "next/link";
import { Check } from "lucide-react";

// Shared renderers for the 4 new product-page block types added for the
// Figma redesign (project_figma_redesign_phases.md, Phase 1) — used by both
// ContentBlock.js (stacked template) and ProductSplitLayout.js (split
// template) so a product looks the same regardless of which template an
// admin picks. Each always lays itself out in its own left-label/
// right-content grid, independent of the outer template.

function BlockLabelHeadline({ label, headline }) {
  return (
    <div>
      {label && (
        <p className="text-brand-blue text-sm font-semibold tracking-wide uppercase mb-2">{label}</p>
      )}
      {headline && <h3 className="text-2xl md:text-3xl font-bold text-gray-900">{headline}</h3>}
    </div>
  );
}

export function KeyFeaturesBlock({ block }) {
  const items = block.items || [];
  const columns = block.columns === 3 ? 3 : 2;
  const cols = Array.from({ length: columns }, () => []);
  items.forEach((item, i) => cols[i % columns].push(item));

  return (
    <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-8 items-start">
      <BlockLabelHeadline label={block.label} headline={block.headline} />
      <div
        className={
          columns === 3
            ? "grid grid-cols-1 sm:grid-cols-3 gap-x-8 gap-y-2"
            : "grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2"
        }
      >
        {cols.map((col, ci) => (
          <ul key={ci} className="space-y-2 text-gray-700">
            {col.map((item, ii) => (
              <li key={ii} className="flex gap-2">
                <span aria-hidden="true">·</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}

export function AdvantagesBlock({ block }) {
  const items = block.items || [];
  return (
    <div className="bg-blue-50 rounded-2xl p-8 md:p-10 grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-8 items-start">
      <BlockLabelHeadline label={block.label} headline={block.headline} />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
        {items.map((item, i) => (
          <div key={i} className="flex items-start gap-3">
            <span className="shrink-0 w-6 h-6 rounded-full bg-brand-blue text-white flex items-center justify-center">
              <Check size={14} />
            </span>
            <span className="text-gray-700">{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function BenefitsBlock({ block }) {
  const items = block.items || [];
  return (
    <div>
      <BlockLabelHeadline label={block.label} headline={block.headline} />
      <div className="space-y-5 mt-6">
        {items.map((item, i) => (
          <div key={i}>
            <p className="font-bold text-gray-900 uppercase text-sm tracking-wide">{item.title}</p>
            <p className="text-gray-700 mt-1">{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// relatedProducts has no admin-entered data — it's a position marker. The
// actual sibling products (same category, published, excluding itself) are
// looked up by the page server-side (see [slug]/page.js) and passed in here.
export function RelatedProductsBlock({ relatedProducts = [] }) {
  if (relatedProducts.length === 0) return null;
  return (
    <div>
      <p className="text-brand-blue text-sm font-semibold tracking-wide uppercase mb-6">
        Related Products
      </p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
        {relatedProducts.map((p) => (
          <Link
            key={p.id}
            href={`/${p.slug}`}
            className="block bg-gray-50 rounded-xl p-4 hover:shadow-md transition"
          >
            {p.heroImage && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={p.heroImage} alt={p.name} className="w-full h-28 object-cover rounded-lg mb-3" />
            )}
            <p className="font-semibold text-gray-900">{p.name}</p>
            {p.tagline && <p className="text-xs text-gray-500 mt-1">{p.tagline}</p>}
          </Link>
        ))}
      </div>
    </div>
  );
}
