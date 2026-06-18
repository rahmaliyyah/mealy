"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Search, Shuffle, Menu, X, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "Home", href: "/" },
  {
    label: "Explore Meals",
    href: "#",
    dropdown: [
      { label: "by Categories", href: "/categories" },
      { label: "by Area", href: "/areas" },
      { label: "by Ingredients", href: "/ingredients" },
      { label: "by A-Z Index", href: "/az" },
    ],
  },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [browseOpen, setBrowseOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
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
        style={{ padding: "12px 40px" }}
        className={cn(
          "fixed top-4 left-1/2 -translate-x-1/2 z-50",
          "w-[80%] max-w-7xl",
          "rounded-full",
          "border border-white/10",
          "grid grid-cols-[auto_1fr_auto]",
          "items-center",
          "transition-all duration-300",
          scrolled
            ? "bg-[rgba(26,26,26,0.95)] backdrop-blur-xl shadow-navbar"
            : "bg-[rgba(255,255,255,0.05)] backdrop-blur-xl shadow-navbar"
        )}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image
            src="/assets/logo.svg"
            alt="Mealy Logo"
            width={78}
            height={78}
            priority
          />
        </Link>

        {/* Center Navigation */}
        <div
          style={{
            display: isMobile ? "none" : "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "56px" }}>
            {navLinks.map((link) =>
              link.dropdown ? (
                <div
                  key={link.label}
                  style={{ position: "relative" }}
                  onMouseEnter={() => setBrowseOpen(true)}
                  onMouseLeave={() => setBrowseOpen(false)}
                >
                  <button
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      color: "#E0E0E0",
                      fontWeight: 500,
                      fontSize: "16px",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      fontFamily: "var(--font-poppins)",
                    }}
                  >
                    {link.label}
                    <ChevronDown
                      size={16}
                      style={{
                        transition: "transform 0.2s ease",
                        transform: browseOpen ? "rotate(180deg)" : "rotate(0deg)",
                      }}
                    />
                  </button>

                  {browseOpen && (
                    <div
                      style={{
                        position: "absolute",
                        top: "100%",
                        left: "50%",
                        transform: "translateX(-50%)",
                        marginTop: "0px",
                        paddingTop: "16px",
                        width: "224px",
                        zIndex: 10,
                      }}
                    >
                      <div
                        style={{
                          borderRadius: "16px",
                          backgroundColor: "rgba(26,26,26,0.98)",
                          backdropFilter: "blur(20px)",
                          border: "1px solid rgba(255,255,255,0.1)",
                          boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
                          padding: "8px",
                        }}
                      >
                        {link.dropdown.map((item) => (
                          <Link
                            key={item.label}
                            href={item.href}
                            style={{
                              display: "block",
                              padding: "12px 16px",
                              borderRadius: "12px",
                              color: "#E0E0E0",
                              fontSize: "14px",
                              fontWeight: 500,
                              fontFamily: "var(--font-poppins)",
                              textDecoration: "none",
                              transition: "all 0.15s ease",
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.1)";
                              e.currentTarget.style.color = "#FFFFFF";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = "transparent";
                              e.currentTarget.style.color = "#E0E0E0";
                            }}
                          >
                            {item.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={link.label}
                  href={link.href}
                  style={{
                    color: "#E0E0E0",
                    fontWeight: 500,
                    fontSize: "16px",
                    fontFamily: "var(--font-poppins)",
                    textDecoration: "none",
                    transition: "color 0.2s ease",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#FF6B2C")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "#E0E0E0")}
                >
                  {link.label}
                </Link>
              )
            )}
          </div>
        </div>

        {/* Right Side */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>

          {/* Search Bar */}
          <form
            onSubmit={handleSearch}
            style={{
              display: "flex",
              alignItems: "center",
              backgroundColor: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "9999px",
              overflow: "hidden",
              width: searchOpen ? "240px" : "44px",
              height: "44px",
              transition: "width 0.3s ease",
            }}
          >
            <button
              type={searchOpen ? "submit" : "button"}
              onClick={() => !searchOpen && setSearchOpen(true)}
              style={{
                width: "44px",
                height: "44px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                background: "none",
                border: "none",
                cursor: "pointer",
              }}
            >
              <Search size={18} color="#9E9E9E" />
            </button>

            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search meals..."
              style={{
                flex: 1,
                background: "transparent",
                border: "none",
                outline: "none",
                color: "white",
                fontSize: "14px",
                fontFamily: "var(--font-poppins)",
                paddingRight: "12px",
                opacity: searchOpen ? 1 : 0,
                transition: "opacity 0.2s ease",
                width: searchOpen ? "auto" : "0px",
              }}
            />

            {searchOpen && (
              <button
                type="button"
                onClick={() => { setSearchOpen(false); setSearchQuery(""); }}
                style={{
                  width: "32px",
                  height: "32px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#9E9E9E",
                  flexShrink: 0,
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  marginRight: "4px",
                }}
              >
                <X size={14} />
              </button>
            )}
          </form>

          {/* Surprise Me */}
          {!isMobile && (
            <Link
              href="/surprise"
              style={{
                padding: "12px 28px",
                borderRadius: "9999px",
                backgroundColor: "#FF6B2C",
                color: "white",
                fontWeight: 600,
                fontFamily: "var(--font-poppins)",
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                boxShadow: "0 0 20px rgba(255,107,44,0.4)",
                transition: "filter 0.2s ease",
                whiteSpace: "nowrap",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.filter = "brightness(1.1)")}
              onMouseLeave={(e) => (e.currentTarget.style.filter = "brightness(1)")}
            >
              <Shuffle size={16} />
              Surprise Me
            </Link>
          )}

          {/* Mobile Menu Button */}
          {isMobile && (
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              style={{
                width: "40px",
                height: "40px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                background: "none",
                border: "none",
                cursor: "pointer",
              }}
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          )}
        </div>
      </nav>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 40,
            backgroundColor: "rgba(15,15,15,0.95)",
            backdropFilter: "blur(20px)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "32px",
          }}
        >
          {navLinks.map((link) =>
            link.dropdown ? (
              <div key={link.label} style={{ textAlign: "center" }}>
                <p
                  style={{
                    color: "#9E9E9E",
                    fontSize: "12px",
                    fontFamily: "var(--font-poppins)",
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    marginBottom: "16px",
                  }}
                >
                  {link.label}
                </p>
                {link.dropdown.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    style={{
                      display: "block",
                      fontSize: "24px",
                      fontWeight: 700,
                      color: "white",
                      fontFamily: "var(--font-poppins)",
                      textDecoration: "none",
                      marginBottom: "12px",
                    }}
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
                style={{
                  fontSize: "30px",
                  fontWeight: 700,
                  color: "white",
                  fontFamily: "var(--font-poppins)",
                  textDecoration: "none",
                }}
              >
                {link.label}
              </Link>
            )
          )}
          <Link
            href="/surprise"
            onClick={() => setMobileOpen(false)}
            style={{
              marginTop: "16px",
              padding: "16px 32px",
              borderRadius: "9999px",
              backgroundColor: "#FF6B2C",
              color: "white",
              fontSize: "18px",
              fontWeight: 700,
              fontFamily: "var(--font-poppins)",
              boxShadow: "0 0 20px rgba(255,107,44,0.4)",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              textDecoration: "none",
            }}
          >
            <Shuffle size={18} />
            Surprise Me
          </Link>
        </div>
      )}
    </>
  );
}