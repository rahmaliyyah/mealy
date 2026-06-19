"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { SlidersHorizontal, X, ChevronLeft, ChevronRight, Search, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  getMealsByLetter,
  getCategories,
  getAreas,
  type Meal,
  type Category,
  type Area,
} from "@/lib/api";
import MealCard from "@/components/cards/MealCard";
import MealCardSkeleton from "@/components/cards/MealCardSkeleton";

const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const ITEMS_PER_PAGE_DESKTOP = 8;
const ITEMS_PER_PAGE_MOBILE = 1;


export default function AZPage() {
  const searchParams = useSearchParams();
  const [activeLetter, setActiveLetter] = useState(
    searchParams.get("letter") || "A"
  );
  const [allMeals, setAllMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [areas, setAreas] = useState<Area[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedArea, setSelectedArea] = useState("");
  const [ingredientSearch, setIngredientSearch] = useState("");
  const [ingredientQuery, setIngredientQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showAreaDropdown, setShowAreaDropdown] = useState(false);
  const [areaSearch, setAreaSearch] = useState("");
  

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
    setLoading(true);
    setSelectedCategory("");
    setSelectedArea("");
    setIngredientSearch("");
    setIngredientQuery("");
    setCurrentPage(1);
    getMealsByLetter(activeLetter.toLowerCase()).then((data) => {
      setAllMeals(data);
      setLoading(false);
    });
  }, [activeLetter]);

  const filteredMeals = allMeals.filter((meal) => {
    const matchCategory = selectedCategory ? meal.strCategory === selectedCategory : true;
    const matchArea = selectedArea ? meal.strArea === selectedArea : true;
    const matchIngredient = ingredientQuery
      ? Array.from({ length: 20 }, (_, i) => i + 1).some((i) => {
          const ing = meal[`strIngredient${i}` as keyof Meal];
          return ing?.toLowerCase().includes(ingredientQuery.toLowerCase());
        })
      : true;
    return matchCategory && matchArea && matchIngredient;
  });
  const [isMobile, setIsMobile] = useState(false);

useEffect(() => {
  const check = () => setIsMobile(window.innerWidth < 768);
  check();
  window.addEventListener("resize", check);
  return () => window.removeEventListener("resize", check);
}, []);

  const itemsPerPage = isMobile ? ITEMS_PER_PAGE_MOBILE : ITEMS_PER_PAGE_DESKTOP;
const totalPages = Math.ceil(filteredMeals.length / itemsPerPage);
const paginatedMeals = filteredMeals.slice(
  (currentPage - 1) * itemsPerPage,
  currentPage * itemsPerPage
);

  const clearFilters = () => {
    setSelectedCategory("");
    setSelectedArea("");
    setIngredientSearch("");
    setIngredientQuery("");
    setCurrentPage(1);
  };

  const hasActiveFilters = selectedCategory || selectedArea || ingredientQuery;

  return (
    <div className="bg-[#0F0F0F] min-h-screen pt-28 pb-24">
      <div className="max-w-7xl mx-auto px-6">

        {/* Header */}
        <div className="mb-4">
          <p className="text-[#FF6B2C] text-xs font-bold font-poppins uppercase tracking-widest mb-2">
            Browse
          </p>
          <h1 className="font-bold text-white font-poppins text-4xl md:text-5xl">
            A-Z Index
          </h1>
          <p className="text-[#9E9E9E] font-poppins text-base mt-3 max-w-xl">
            Browse all meals alphabetically and find exactly what you are looking for.
          </p>
        </div>

        {/* Letter Nav */}
        <div className={cn("mb-8", "py-4", "border-b border-white/5")}>
          <div className="flex flex-wrap gap-2">
            {LETTERS.map((letter) => (
              <button
                key={letter}
                onClick={() => setActiveLetter(letter)}
                className={cn(
                  "w-10 h-10 rounded-xl",
                  "font-bold text-sm font-poppins",
                  "border transition-all duration-200 hover:scale-110",
                  activeLetter === letter
                    ? "bg-[#FF6B2C] border-[#FF6B2C] text-white shadow-[0_0_20px_rgba(255,107,44,0.4)]"
                    : "bg-[#1A1A1A] border-white/5 text-[#9E9E9E] hover:border-[#FF6B2C]/50 hover:text-white"
                )}
              >
                {letter}
              </button>
            ))}
          </div>
        </div>

        {/* Active Letter Header + Filter Toggle */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-end gap-4">
            <span className="font-bold font-poppins text-white/10 text-8xl leading-none">
              {activeLetter}
            </span>
            <p className="text-[#9E9E9E] text-sm font-poppins pb-2">
              {!loading && `${filteredMeals.length} of ${allMeals.length} meals`}
            </p>
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              "flex items-center gap-2 px-5 py-2.5 rounded-pill",
              "text-sm font-medium font-poppins border transition-all duration-200",
              showFilters
                ? "bg-[#FF6B2C] border-[#FF6B2C] text-white"
                : "bg-[#1A1A1A] border-white/10 text-[#E0E0E0] hover:border-[#FF6B2C]/50"
            )}
          >
            <SlidersHorizontal size={14} />
            Filters
          </button>
        </div>

        {/* Active Filter Chips */}
        {hasActiveFilters && (
          <div className="flex flex-wrap gap-2 mb-6">
            {selectedCategory && (
              <span className={cn("flex items-center gap-2 px-4 py-2 rounded-pill", "bg-[#FF6B2C]/10 border border-[#FF6B2C]/30 text-[#FF6B2C] text-sm font-poppins")}>
                Category: {selectedCategory}
                <button onClick={() => { setSelectedCategory(""); setCurrentPage(1); }}><X size={12} /></button>
              </span>
            )}
            {selectedArea && (
              <span className={cn("flex items-center gap-2 px-4 py-2 rounded-pill", "bg-[#00FFD1]/10 border border-[#00FFD1]/30 text-[#00FFD1] text-sm font-poppins")}>
                Area: {selectedArea}
                <button onClick={() => { setSelectedArea(""); setCurrentPage(1); }}><X size={12} /></button>
              </span>
            )}
            {ingredientQuery && (
              <span className={cn("flex items-center gap-2 px-4 py-2 rounded-pill", "bg-[#00E65C]/10 border border-[#00E65C]/30 text-[#00E65C] text-sm font-poppins")}>
                Ingredient: {ingredientQuery}
                <button onClick={() => { setIngredientSearch(""); setIngredientQuery(""); setCurrentPage(1); }}><X size={12} /></button>
              </span>
            )}
            <button onClick={clearFilters} className="text-[#9E9E9E] text-sm font-poppins hover:text-white transition-colors">
              Clear all
            </button>
          </div>
        )}

        {/* Filter Panel */}
        {showFilters && (
          <div className={cn("mb-8 p-6 rounded-2xl", "bg-[#1A1A1A] border border-white/5", "space-y-6")}>
            <div>
              <p className="text-[#9E9E9E] text-xs font-poppins uppercase tracking-widest mb-3">
                Filter by Category
              </p>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat.idCategory}
                    onClick={() => { setSelectedCategory(selectedCategory === cat.strCategory ? "" : cat.strCategory); setCurrentPage(1); }}
                    className={cn(
                      "px-4 py-2 rounded-pill text-xs font-medium font-poppins",
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

            {/* Filter by Area — Searchable Dropdown */}
            <div>
              <p className="text-[#9E9E9E] text-xs font-poppins uppercase tracking-widest mb-3">
                Filter by Area
              </p>
              <div className="relative max-w-xs">
                <button
                  onClick={() => setShowAreaDropdown(!showAreaDropdown)}
                  className={cn(
                    "w-full flex items-center justify-between",
                    "px-4 py-3 rounded-xl",
                    "bg-[#242424] border border-white/10",
                    "text-sm font-poppins",
                    selectedArea ? "text-white" : "text-[#9E9E9E]",
                    "hover:border-[#00FFD1]/50 transition-colors duration-200"
                  )}
                >
                  {selectedArea || "Select area..."}
                  <ChevronDown
                    size={14}
                    className={cn("transition-transform duration-200", showAreaDropdown && "rotate-180")}
                  />
                </button>

                {showAreaDropdown && (
                  <div className={cn("absolute top-full left-0 right-0 mt-2 z-10", "bg-[#242424] border border-white/10 rounded-xl", "shadow-card overflow-hidden")}>
                    <div className="p-2 border-b border-white/5">
                      <div className="relative">
                        <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9E9E9E]" />
                        <input
                          type="text"
                          value={areaSearch}
                          onChange={(e) => setAreaSearch(e.target.value)}
                          placeholder="Search area..."
                          className="w-full bg-transparent pl-8 pr-3 py-2 text-xs font-poppins text-white placeholder:text-[#9E9E9E] outline-none"
                        />
                      </div>
                    </div>
                    <div className="max-h-48 overflow-y-auto">
                      {areas
                        .filter((a) => a.strArea.toLowerCase().includes(areaSearch.toLowerCase()))
                        .map((area) => (
                          <button
                            key={area.strArea}
                            onClick={() => {
                              setSelectedArea(selectedArea === area.strArea ? "" : area.strArea);
                              setCurrentPage(1);
                              setShowAreaDropdown(false);
                            }}
                            className={cn(
                              "w-full text-left px-4 py-2.5",
                              "text-sm font-poppins",
                              "hover:bg-white/10 transition-colors duration-150",
                              selectedArea === area.strArea ? "text-[#00FFD1] font-semibold" : "text-[#E0E0E0]"
                            )}
                          >
                            {area.strArea}
                          </button>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div>
              <p className="text-[#9E9E9E] text-xs font-poppins uppercase tracking-widest mb-3">
                Filter by Ingredient
              </p>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setIngredientQuery(ingredientSearch.trim());
                  setCurrentPage(1);
                }}
                className="flex gap-3 max-w-sm"
              >
                <div className="relative flex-1">
                  <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9E9E9E]" />
                  <input
                    type="text"
                    value={ingredientSearch}
                    onChange={(e) => setIngredientSearch(e.target.value)}
                    placeholder="e.g. garlic, chicken..."
                    className={cn(
                      "w-full rounded-xl pl-8 pr-4 py-3",
                      "bg-[#242424] border border-white/10",
                      "text-white placeholder:text-[#9E9E9E]",
                      "font-poppins text-sm outline-none",
                      "focus:border-[#FF6B2C] transition-colors duration-200"
                    )}
                  />
                </div>
                <button
                  type="submit"
                  className={cn(
                    "px-5 py-3 rounded-xl",
                    "bg-[#FF6B2C] text-white",
                    "text-sm font-semibold font-poppins",
                    "hover:brightness-110 transition-all duration-200"
                  )}
                >
                  Apply
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Meals Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <MealCardSkeleton key={i} />
            ))}
          </div>
        ) : paginatedMeals.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {paginatedMeals.map((meal) => (
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
        ) : (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <span className="text-6xl font-bold text-white/10 font-poppins">
              {activeLetter}
            </span>
            <p className="font-bold text-white font-poppins text-xl">No meals found</p>
            <p className="text-[#9E9E9E] text-sm font-poppins">
              {hasActiveFilters ? "Try adjusting your filters" : `No meals start with "${activeLetter}"`}
            </p>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className={cn("px-6 py-3 rounded-pill", "bg-[#FF6B2C] text-white", "text-sm font-semibold font-poppins", "hover:brightness-110 transition-all duration-200")}
              >
                Clear Filters
              </button>
            )}
          </div>
        )}

        {/* Pagination */}
        {!loading && totalPages > 1 && (
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
      </div>
    </div>
  );
}