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
          alignItems: "center",
          gap: "24px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <Image
              src="/assets/logo.svg"
              alt="Mealy Logo"
              width={28}
              height={28}
            />

          </div>

          <p className={cn("text-xs text-[#9E9E9E] font-poppins")}>
            Discover your next favorite meal
          </p>

          <p className={cn("text-xs text-[#9E9E9E]/60 font-poppins")}>
            Powered by{" "}
            <a
              href="https://www.themealdb.com/api.php"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors underline underline-offset-2"
            >
              TheMealDB API
            </a>
          </p>
        </div>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "24px",
          }}
        >
          {footerLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className={cn(
                "text-sm text-[#9E9E9E] font-poppins",
                "hover:text-primary transition-colors duration-200"
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <p className={cn("text-xs text-[#9E9E9E]/60 font-poppins")}>
          © 2025 Mealy
        </p>
      </div>
    </footer>
  );
}