"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  searchMealByName,
  getCategories,
  getAreas,
  type Meal,
  type Category,
  type Area,
} from "@/lib/api";
import MealCard from "@/components/cards/MealCard";
import MealCardSkeleton from "@/components/cards/MealCardSkeleton";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";

  const [searchQuery, setSearchQuery] = useState(query);
  const [results, setResults] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [areas, setAreas] = useState<Area[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedArea, setSelectedArea] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    getCategories().then(setCategories);
    getAreas().then((data) => {
      const unique = Array.from(
        new Map(data.map((a) => [a.strArea, a])).values()
      );
      setAreas(unique);
    });
  }, []);

  useEffect(() => {
    if (!query) return;
    setLoading(true);
    searchMealByName(query).then((data) => {
      setResults(data);
      setLoading(false);
    });
  }, [query]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  const filteredResults = results.filter((meal) => {
    const matchCategory = selectedCategory
      ? meal.strCategory === selectedCategory
      : true;
    const matchArea = selectedArea ? meal.strArea === selectedArea : true;
    return matchCategory && matchArea;
  });

  const clearFilters = () => {
    setSelectedCategory("");
    setSelectedArea("");
  };

  const hasActiveFilters = selectedCategory || selectedArea;

  return (
    <div className="bg-[#0F0F0F] min-h-screen pt-28 pb-24">
      <div className="max-w-7xl mx-auto px-6">

        {/* Search Header */}
        <div className="mb-10 space-y-6">
          <div>
            <p className="text-[#9E9E9E] text-sm font-poppins mb-2">
              {query ? `Showing results for` : "Search for a meal"}
            </p>
            {query && (
              <h1 className="font-bold text-white font-poppins text-3xl md:text-4xl">
                &ldquo;{query}&rdquo;
              </h1>
            )}
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="relative max-w-2xl">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search any meal..."
              className={cn(
                "w-full rounded-pill",
                "bg-[#1A1A1A] border border-white/10",
                "px-6 py-4 pr-14",
                "text-white placeholder:text-[#9E9E9E]",
                "font-poppins text-sm",
                "outline-none focus:border-[#FF6B2C]",
                "transition-colors duration-200"
              )}
            />
            <button
              type="submit"
              className={cn(
                "absolute right-2 top-1/2 -translate-y-1/2",
                "w-10 h-10 rounded-full",
                "bg-[#FF6B2C] text-white",
                "flex items-center justify-center",
                "hover:brightness-110 transition-all duration-200"
              )}
            >
              <Search size={16} />
            </button>
          </form>

          {/* Filter Toggle & Active Filters */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={cn(
                "flex items-center gap-2",
                "px-5 py-2.5 rounded-pill",
                "border transition-all duration-200",
                "text-sm font-medium font-poppins",
                showFilters
                  ? "bg-[#FF6B2C] border-[#FF6B2C] text-white"
                  : "bg-[#1A1A1A] border-white/10 text-[#E0E0E0] hover:border-[#FF6B2C]/50"
              )}
            >
              <SlidersHorizontal size={14} />
              Filters
            </button>

            {hasActiveFilters && (
              <>
                {selectedCategory && (
                  <span
                    className={cn(
                      "flex items-center gap-2",
                      "px-4 py-2 rounded-pill",
                      "bg-[#FF6B2C]/10 border border-[#FF6B2C]/30",
                      "text-[#FF6B2C] text-sm font-medium font-poppins"
                    )}
                  >
                    {selectedCategory}
                    <button onClick={() => setSelectedCategory("")}>
                      <X size={12} />
                    </button>
                  </span>
                )}
                {selectedArea && (
                  <span
                    className={cn(
                      "flex items-center gap-2",
                      "px-4 py-2 rounded-pill",
                      "bg-[#00FFD1]/10 border border-[#00FFD1]/30",
                      "text-[#00FFD1] text-sm font-medium font-poppins"
                    )}
                  >
                    {selectedArea}
                    <button onClick={() => setSelectedArea("")}>
                      <X size={12} />
                    </button>
                  </span>
                )}
                <button
                  onClick={clearFilters}
                  className="text-[#9E9E9E] text-sm font-poppins hover:text-white transition-colors"
                >
                  Clear all
                </button>
              </>
            )}
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <div
              className={cn(
                "p-6 rounded-2xl",
                "bg-[#1A1A1A] border border-white/5",
                "space-y-6"
              )}
            >
              {/* Category Filter */}
              <div>
                <p className="text-[#9E9E9E] text-xs font-poppins uppercase tracking-widest mb-3">
                  Category
                </p>
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat.idCategory}
                      onClick={() =>
                        setSelectedCategory(
                          selectedCategory === cat.strCategory
                            ? ""
                            : cat.strCategory
                        )
                      }
                      className={cn(
                        "px-4 py-2 rounded-pill",
                        "text-xs font-medium font-poppins",
                        "border transition-all duration-200",
                        selectedCategory === cat.strCategory
                          ? "bg-[#FF6B2C] border-[#FF6B2C] text-white"
                          : "bg-transparent border-white/10 text-[#E0E0E0] hover:border-[#FF6B2C]/50"
                      )}
                    >
                      {cat.strCategory}
                    </button>
                  ))}
                </div>
              </div>

              {/* Area Filter */}
              <div>
                <p className="text-[#9E9E9E] text-xs font-poppins uppercase tracking-widest mb-3">
                  Area
                </p>
                <div className="flex flex-wrap gap-2">
                  {areas.map((area) => (
                    <button
                      key={area.strArea}
                      onClick={() =>
                        setSelectedArea(
                          selectedArea === area.strArea ? "" : area.strArea
                        )
                      }
                      className={cn(
                        "px-4 py-2 rounded-pill",
                        "text-xs font-medium font-poppins",
                        "border transition-all duration-200",
                        selectedArea === area.strArea
                          ? "bg-[#00FFD1] border-[#00FFD1] text-[#0F0F0F]"
                          : "bg-transparent border-white/10 text-[#E0E0E0] hover:border-[#00FFD1]/50"
                      )}
                    >
                      {area.strArea}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results Count */}
        {!loading && query && (
          <p className="text-[#9E9E9E] text-sm font-poppins mb-6">
            {filteredResults.length} meal{filteredResults.length !== 1 ? "s" : ""} found
          </p>
        )}

        {/* Results Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <MealCardSkeleton key={i} />
            ))}
          </div>
        ) : filteredResults.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredResults.map((meal) => (
              <MealCard
                key={meal.idMeal}
                id={meal.idMeal}
                name={meal.strMeal}
                thumbnail={meal.strMealThumb}
                category={meal.strCategory}
                area={meal.strArea}
              />
            ))}
          </div>
        ) : query ? (
          // Empty State
          <div className="flex flex-col items-center justify-center py-32 gap-6">
            <div
              className={cn(
                "w-24 h-24 rounded-full",
                "bg-[#1A1A1A] border border-white/5",
                "flex items-center justify-center",
                "text-4xl"
              )}
            >
              🍽️
            </div>
            <div className="text-center space-y-2">
              <h3 className="font-bold text-white font-poppins text-xl">
                No meals found
              </h3>
              <p className="text-[#9E9E9E] text-sm font-poppins">
                Try searching with a different keyword
              </p>
            </div>
            <button
              onClick={clearFilters}
              className={cn(
                "px-6 py-3 rounded-pill",
                "bg-[#FF6B2C] text-white",
                "text-sm font-semibold font-poppins",
                "hover:brightness-110 transition-all duration-200",
                "shadow-[0_0_20px_rgba(255,107,44,0.3)]"
              )}
            >
              Clear Filters
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}