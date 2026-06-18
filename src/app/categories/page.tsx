"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { getCategories, type Category } from "@/lib/api";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCategories().then((data) => {
      setCategories(data);
      setLoading(false);
    });
  }, []);

  const filtered = categories.filter((c) =>
    c.strCategory.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-[#0F0F0F] min-h-screen pt-28 pb-24">
      <div className="max-w-7xl mx-auto px-6">

        {/* Header */}
        <div className="mb-12 space-y-4">
          <div>
            <p className="text-[#FF6B2C] text-xs font-bold font-poppins uppercase tracking-widest mb-2">
              Browse
            </p>
            <h1 className="font-bold text-white font-poppins text-4xl md:text-5xl">
              All Categories
            </h1>
            <p className="text-[#9E9E9E] font-poppins text-base mt-3 max-w-xl">
              Explore our full collection of meal categories, from hearty mains to indulgent desserts.
            </p>
          </div>

          {/* Search */}
          <div className="relative max-w-sm">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search categories..."
              className={cn(
                "w-full rounded-pill",
                "bg-[#1A1A1A] border border-white/10",
                "px-5 py-3 pr-12",
                "text-white placeholder:text-[#9E9E9E]",
                "font-poppins text-sm",
                "outline-none focus:border-[#FF6B2C]",
                "transition-colors duration-200"
              )}
            />
            <Search
              size={14}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9E9E9E]"
            />
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className="animate-pulse bg-[#1A1A1A] rounded-2xl h-64"
              />
            ))}
          </div>
        ) : filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filtered.map((cat) => (
              <Link
                key={cat.idCategory}
                href={`/categories/${cat.strCategory}`}
                className={cn(
                  "group relative overflow-hidden rounded-2xl cursor-pointer",
                  "bg-[#1A1A1A] border border-white/5",
                  "hover:border-[#FF6B2C]/40 hover:shadow-card",
                  "transition-all duration-300"
                )}
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={cat.strCategoryThumb}
                    alt={cat.strCategory}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A] via-transparent to-transparent" />

                  {/* Left accent on hover */}
                  <div
                    className={cn(
                      "absolute left-0 top-0 bottom-0 w-1",
                      "bg-[#FF6B2C]",
                      "opacity-0 group-hover:opacity-100",
                      "transition-opacity duration-300"
                    )}
                  />
                </div>

                {/* Content */}
                <div className="p-5 space-y-2">
                  <h3 className="font-bold text-white font-poppins text-lg group-hover:text-[#FF6B2C] transition-colors duration-200">
                    {cat.strCategory}
                  </h3>
                  <p className="text-[#9E9E9E] text-xs font-poppins line-clamp-2 leading-relaxed">
                    {cat.strCategoryDescription}
                  </p>
                  <span
                    className={cn(
                      "inline-block mt-2 px-3 py-1 rounded-pill",
                      "bg-[#00FFD1]/10 text-[#00FFD1]",
                      "text-[10px] font-bold font-poppins uppercase tracking-wider"
                    )}
                  >
                    Explore →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <span className="text-5xl">🍽️</span>
            <p className="font-bold text-white font-poppins text-xl">
              No categories found
            </p>
            <p className="text-[#9E9E9E] text-sm font-poppins">
              Try a different search term
            </p>
          </div>
        )}
      </div>
    </div>
  );
}