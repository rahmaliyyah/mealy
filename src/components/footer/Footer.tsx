import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

const footerLinks = [
  { label: "Categories", href: "/categories" },
  { label: "Areas", href: "/areas" },
  { label: "Ingredients", href: "/ingredients" },
  { label: "A-Z Index", href: "/az" },
];

export default function Footer() {
  return (
    <footer className={cn("bg-[#0A0A0A]", "border-t border-white/5")}>
      <div
        style={{
          maxWidth: "80rem",
          margin: "0 auto",
          padding: "48px 24px",
          display: "flex",
          flexDirection: "column",
          gap: "40px",
        }}
      >
        {/* Top Row */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            flexWrap: "wrap",
            gap: "32px",
          }}
        >
          {/* Brand */}
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <Image
              src="/assets/logo.svg"
              alt="Mealy Logo"
              width={80}
              height={80}
            />
            <p className="text-sm text-[#9E9E9E] font-poppins max-w-xs">
              Discover your next favorite meal, powered by thousands of recipes from around the world.
            </p>
          </div>

          {/* Links */}
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <p className="text-xs font-bold text-white font-poppins uppercase tracking-widest">
              Explore
            </p>
            {footerLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className={cn(
                  "text-sm text-[#9E9E9E] font-poppins",
                  "hover:text-[#FF6B2C] transition-colors duration-200"
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Bottom Row */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "12px",
            borderTop: "1px solid rgba(255,255,255,0.05)",
            paddingTop: "24px",
          }}
        >
          <p className="text-xs text-[#9E9E9E]/60 font-poppins">
            © 2025 Mealy. All rights reserved.
          </p>
          <p className="text-xs text-[#9E9E9E]/60 font-poppins">
            Powered by{" "}
            <a
              href="https://www.themealdb.com/api.php"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#FF6B2C] transition-colors underline underline-offset-2"
            >
              TheMealDB API
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}