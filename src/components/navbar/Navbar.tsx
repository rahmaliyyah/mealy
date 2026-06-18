"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Search, Shuffle, Menu, X, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "Home", href: "/" },
  {
    label: "Browse",
    href: "#",
    dropdown: [
      { label: "Categories", href: "/categories" },
      { label: "Area", href: "/areas" },
      { label: "Ingredients", href: "/ingredients" },
      { label: "A-Z Index", href: "/az" },
    ],
  },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [browseOpen, setBrowseOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <>
      <nav
        className={cn(
          // Layout
          "fixed top-4 left-1/2 -translate-x-1/2 z-50",
          "w-[calc(100%-2rem)] max-w-6xl",
          // Shape
          "rounded-pill",
          // Surface
          "border border-white/10",
          // Spacing
          "px-6 py-3",
          // Flex
          "flex items-center justify-between gap-4",
          // Transition
          "transition-all duration-300",
          // Conditional scroll
          scrolled
            ? "bg-[rgba(26,26,26,0.95)] shadow-navbar backdrop-blur-xl"
            : "bg-[rgba(255,255,255,0.05)] backdrop-blur-xl shadow-navbar"
        )}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 flex-shrink-0">
          <Image
            src="/assets/logo.svg"
            alt="Mealy Logo"
            width={32}
            height={32}
          />
          <span
            className={cn(
              "font-bold text-xl text-white",
              "font-poppins tracking-tight"
            )}
          >
            Mealy
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className={cn("hidden md:flex items-center gap-6")}>
          {navLinks.map((link) =>
            link.dropdown ? (
              <div
                key={link.label}
                className="relative"
                onMouseEnter={() => setBrowseOpen(true)}
                onMouseLeave={() => setBrowseOpen(false)}
              >
                <button
                  className={cn(
                    "flex items-center gap-1",
                    "text-[#E0E0E0] hover:text-primary",
                    "font-medium text-sm font-poppins",
                    "transition-colors duration-200"
                  )}
                >
                  {link.label}
                  <ChevronDown
                    size={14}
                    className={cn(
                      "transition-transform duration-200",
                      browseOpen && "rotate-180"
                    )}
                  />
                </button>

                {/* Dropdown */}
                {browseOpen && (
                  <div
                    className={cn(
                      // Position
                      "absolute top-full left-1/2 -translate-x-1/2 mt-3",
                      // Size
                      "w-48",
                      // Shape
                      "rounded-2xl",
                      // Surface glassmorphism
                      "bg-[rgba(255,255,255,0.05)] backdrop-blur-xl",
                      "border border-white/10",
                      // Shadow
                      "shadow-card",
                      // Padding
                      "p-2",
                      // Animation
                      "animate-in fade-in slide-in-from-top-2 duration-200"
                    )}
                  >
                    {link.dropdown.map((item) => (
                      <Link
                        key={item.label}
                        href={item.href}
                        className={cn(
                          "block px-4 py-2.5",
                          "rounded-xl",
                          "text-[#E0E0E0] hover:text-white hover:bg-white/10",
                          "text-sm font-medium font-poppins",
                          "transition-all duration-150"
                        )}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Link
                key={link.label}
                href={link.href}
                className={cn(
                  "text-[#E0E0E0] hover:text-primary",
                  "font-medium text-sm font-poppins",
                  "transition-colors duration-200"
                )}
              >
                {link.label}
              </Link>
            )
          )}
        </div>

        {/* Right Side */}
        <div className={cn("flex items-center gap-3")}>
          {/* Search */}
          <form onSubmit={handleSearch}>
            <div
              className={cn(
                "flex items-center",
                "rounded-pill overflow-hidden",
                "border border-white/10",
                "transition-all duration-300",
                searchOpen ? "w-48 bg-[rgba(255,255,255,0.08)]" : "w-9 bg-transparent border-transparent"
              )}
            >
              <button
                type="button"
                onClick={() => setSearchOpen(!searchOpen)}
                className={cn(
                  "flex-shrink-0 w-9 h-9",
                  "flex items-center justify-center",
                  "text-[#9E9E9E] hover:text-white",
                  "transition-colors duration-200"
                )}
              >
                <Search size={16} />
              </button>
              {searchOpen && (
                <input
                  autoFocus
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search meals..."
                  className={cn(
                    "flex-1 bg-transparent outline-none",
                    "text-white text-sm font-poppins",
                    "placeholder:text-[#9E9E9E]",
                    "pr-3"
                  )}
                />
              )}
            </div>
          </form>

          {/* Surprise Me Button */}
          <Link
            href="/surprise"
            className={cn(
              // Layout
              "hidden md:flex items-center gap-2",
              // Spacing
              "px-5 py-2.5",
              // Shape
              "rounded-pill",
              // Colors
              "bg-primary text-white",
              // Typography
              "text-sm font-semibold font-poppins",
              // Effects
              "shadow-glow",
              "hover:brightness-110 hover:scale-105",
              "active:scale-95",
              "transition-all duration-200"
            )}
          >
            <Shuffle size={14} />
            Surprise Me
          </Link>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className={cn(
              "md:hidden w-9 h-9",
              "flex items-center justify-center",
              "text-[#E0E0E0] hover:text-white",
              "transition-colors duration-200"
            )}
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </nav>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className={cn(
            "fixed inset-0 z-40",
            "bg-[#0F0F0F]/95 backdrop-blur-xl",
            "flex flex-col items-center justify-center gap-8"
          )}
        >
          {navLinks.map((link) =>
            link.dropdown ? (
              <div key={link.label} className="text-center space-y-4">
                <p
                  className={cn(
                    "text-[#9E9E9E] text-sm font-poppins uppercase tracking-widest"
                  )}
                >
                  {link.label}
                </p>
                {link.dropdown.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "block text-2xl font-bold text-white font-poppins",
                      "hover:text-primary transition-colors duration-200"
                    )}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            ) : (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "text-3xl font-bold text-white font-poppins",
                  "hover:text-primary transition-colors duration-200"
                )}
              >
                {link.label}
              </Link>
            )
          )}
          <Link
            href="/surprise"
            onClick={() => setMobileOpen(false)}
            className={cn(
              "mt-4 px-8 py-4 rounded-pill",
              "bg-primary text-white",
              "text-lg font-bold font-poppins",
              "shadow-glow",
              "flex items-center gap-2"
            )}
          >
            <Shuffle size={18} />
            Surprise Me
          </Link>
        </div>
      )}
    </>
  );
}