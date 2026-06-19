"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { getIngredientsList, type Ingredient } from "@/lib/api";

const ITEMS_PER_PAGE_DESKTOP = 18;
const ITEMS_PER_PAGE_MOBILE = 6;

function IngredientImage({ name }: { name: string }) {
  const [error, setError] = useState(false);

  const url = `https://www.themealdb.com/images/ingredients/${name.replace(/ /g, "_")}-medium.png`;

  return (
    <div className="w-20 h-20 flex-shrink-0 bg-[#242424] rounded-lg overflow-hidden flex items-center justify-center">
      {error ? (
        <svg
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#444444"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <path d="M21 15l-5-5L5 21" />
        </svg>
      ) : (
        <img
          src={url}
          alt={name}
          className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
          onError={() => setError(true)}
        />
      )}
    </div>
  );
}

export default function IngredientsPage() {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    getIngredientsList().then((data) => {
      setIngredients(data);
      setLoading(false);
    });
  }, []);

  const filtered = ingredients.filter((i) =>
    i.strIngredient.toLowerCase().includes(search.toLowerCase())
  );

  const itemsPerPage = isMobile ? ITEMS_PER_PAGE_MOBILE : ITEMS_PER_PAGE_DESKTOP;
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
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
              All Ingredients
            </h1>
            <p className="text-[#9E9E9E] font-poppins text-base mt-3 max-w-xl">
              Browse through hundreds of ingredients and discover meals you can make with them.
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
              placeholder="Search ingredients..."
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

          {!loading && (
            <p className="text-[#9E9E9E] text-sm font-poppins">
              {filtered.length} ingredients found
            </p>
          )}
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {Array.from({ length: itemsPerPage }).map((_, i) => (
              <div
                key={i}
                className="animate-pulse bg-[#1A1A1A] rounded-2xl h-44"
              />
            ))}
          </div>
        ) : paginated.length > 0 ? (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {paginated.map((ing) => (
                <Link
                  key={ing.idIngredient}
                  href={`/ingredients/${encodeURIComponent(ing.strIngredient)}`}
                  className={cn(
                    "group flex flex-col items-center gap-3",
                    "bg-[#1A1A1A] rounded-2xl p-5",
                    "border border-white/5",
                    "hover:border-[#FF6B2C]/40 hover:shadow-card",
                    "transition-all duration-300 cursor-pointer"
                  )}
                >
                  <IngredientImage name={ing.strIngredient} />

                  {/* Name */}
                  <div className="text-center space-y-1">
                    <p
                      className={cn(
                        "font-semibold text-white font-poppins text-sm",
                        "group-hover:text-[#FF6B2C] transition-colors duration-200",
                        "line-clamp-2 text-center leading-tight"
                      )}
                    >
                      {ing.strIngredient}
                    </p>
                    {ing.strType && (
                      <p className="text-[#9E9E9E] text-[10px] font-poppins capitalize">
                        {ing.strType}
                      </p>
                    )}
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
            <span className="text-5xl">🥕</span>
            <p className="font-bold text-white font-poppins text-xl">
              No ingredients found
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