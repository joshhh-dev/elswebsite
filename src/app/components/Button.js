import Link from "next/link";

const VARIANTS = {
  primary:
    "bg-brand-blue text-white hover:bg-brand-blue-dark shadow-lg",
  secondary:
    "bg-white text-brand-navy hover:bg-gray-100 shadow-lg",
  outline:
    "bg-transparent border border-white/60 text-white hover:bg-white/10",
  dark:
    "bg-brand-navy text-white hover:bg-black shadow-lg",
};

const SIZES = {
  sm: "px-5 py-2.5 text-sm",
  md: "px-8 py-3.5 text-base md:text-lg",
  lg: "px-12 py-6 text-xl",
};

/**
 * Shared CTA button/link. Renders a <Link> when `href` is given, otherwise a <button>.
 * Use this instead of re-declaring one-off Tailwind button classes per page.
 */
export default function Button({
  href,
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...props
}) {
  const classes = `inline-flex items-center justify-center gap-2 rounded-xl font-semibold
    transition-all duration-300 hover:scale-105 active:scale-95 ${VARIANTS[variant]} ${SIZES[size]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={classes} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}
