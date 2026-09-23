const COLORS = [
  "bg-brand-navy",
  "bg-brand-blue",
  "bg-brand-teal",
  "bg-blue-700",
];

function initialsOf(name) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

/**
 * Circular initials avatar — used in place of a dealer logo image.
 * Several dealer logo files (partner1/2/3.png) don't exist in /public/assets,
 * so this avoids broken-image icons until real logos are supplied.
 */
export default function DealerAvatar({ name, size = 100, className = "" }) {
  const colorIndex = name.charCodeAt(0) % COLORS.length;
  return (
    <div
      style={{ width: size, height: size }}
      className={`flex items-center justify-center rounded-full text-white font-bold ${COLORS[colorIndex]} ${className}`}
    >
      <span style={{ fontSize: size * 0.32 }}>{initialsOf(name)}</span>
    </div>
  );
}
