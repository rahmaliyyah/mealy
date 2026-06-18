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
        className={cn(
          "max-w-7xl mx-auto",
          "px-6 py-12",
          "flex flex-col md:flex-row justify-between items-center gap-6"
        )}
      >
        <div className={cn("flex flex-col items-center md:items-start gap-2")}>
          <div className="flex items-center gap-2">
            <Image
              src="/assets/logo.svg"
              alt="Mealy Logo"
              width={28}
              height={28}
            />
            <span className={cn("font-bold text-lg text-white font-poppins")}>
              Mealy
            </span>
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

        <div className={cn("flex flex-wrap justify-center gap-6")}>
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