"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { getCategories, type Category } from "@/lib/api";

const ITEMS_PER_PAGE = 8;

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    getCategories().then((data) => {
      setCategories(data);
      setLoading(false);
    });
  }, []);

  const filtered = categories.filter((c) =>
    c.strCategory.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
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
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
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
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="animate-pulse bg-[#1A1A1A] rounded-2xl h-64"
              />
            ))}
          </div>
        ) : paginated.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {paginated.map((cat) => (
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

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-12">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center",
                    "border transition-all duration-200",
                    currentPage === 1
                      ? "border-white/5 text-[#9E9E9E]/30 cursor-not-allowed"
                      : "border-white/10 text-[#E0E0E0] hover:border-[#FF6B2C]/50 hover:text-[#FF6B2C]"
                  )}
                >
                  <ChevronLeft size={16} />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter((page) => {
                    if (totalPages <= 5) return true;
                    if (page === 1 || page === totalPages) return true;
                    if (Math.abs(page - currentPage) <= 1) return true;
                    return false;
                  })
                  .map((page, idx, arr) => {
                    const prevPage = arr[idx - 1];
                    const showEllipsis = prevPage && page - prevPage > 1;
                    return (
                      <div key={page} className="flex items-center gap-2">
                        {showEllipsis && (
                          <span className="text-[#9E9E9E] text-sm font-poppins px-1">···</span>
                        )}
                        <button
                          onClick={() => setCurrentPage(page)}
                          className={cn(
                            "w-10 h-10 rounded-full flex items-center justify-center",
                            "text-sm font-semibold font-poppins transition-all duration-200",
                            currentPage === page
                              ? "bg-[#FF6B2C] text-white shadow-[0_0_16px_rgba(255,107,44,0.4)]"
                              : "text-[#E0E0E0] hover:bg-white/5"
                          )}
                        >
                          {page}
                        </button>
                      </div>
                    );
                  })}

                <button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center",
                    "border transition-all duration-200",
                    currentPage === totalPages
                      ? "border-white/5 text-[#9E9E9E]/30 cursor-not-allowed"
                      : "border-white/10 text-[#E0E0E0] hover:border-[#FF6B2C]/50 hover:text-[#FF6B2C]"
                  )}
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </>
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