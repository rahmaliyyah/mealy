"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { getIngredientsList, type Ingredient } from "@/lib/api";

export default function IngredientsPage() {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getIngredientsList().then((data) => {
      setIngredients(data);
      setLoading(false);
    });
  }, []);

  const filtered = ingredients.filter((i) =>
    i.strIngredient.toLowerCase().includes(search.toLowerCase())
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
              onChange={(e) => setSearch(e.target.value)}
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
            {Array.from({ length: 24 }).map((_, i) => (
              <div
                key={i}
                className="animate-pulse bg-[#1A1A1A] rounded-2xl h-44"
              />
            ))}
          </div>
        ) : filtered.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {filtered.map((ing) => (
              <Link
                key={ing.idIngredient}
                href={`/ingredients/${ing.strIngredient}`}
                className={cn(
                  "group flex flex-col items-center gap-3",
                  "bg-[#1A1A1A] rounded-2xl p-5",
                  "border border-white/5",
                  "hover:border-[#FF6B2C]/40 hover:shadow-card",
                  "transition-all duration-300 cursor-pointer"
                )}
              >
                {/* Image */}
                <div className="relative w-20 h-20 flex-shrink-0">
                  <Image
                    src={`https://www.themealdb.com/images/ingredients/${ing.strIngredient.replace(/ /g, "_")}-medium.png`}
                    alt={ing.strIngredient}
                    fill
                    className="object-contain group-hover:scale-110 transition-transform duration-300"
                  />
                </div>

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