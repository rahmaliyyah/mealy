"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Search, SlidersHorizontal, X, ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { getMealsByIngredient, getMealById, type Meal } from "@/lib/api";
import MealCard from "@/components/cards/MealCard";
import MealCardSkeleton from "@/components/cards/MealCardSkeleton";

const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export default function IngredientDetailPage() {
  const params = useParams();
  const name = decodeURIComponent(params.name as string);

  const [allMeals, setAllMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedArea, setSelectedArea] = useState("");
  const [selectedLetter, setSelectedLetter] = useState("");
  const [ingredientSearch, setIngredientSearch] = useState("");
  const [ingredientQuery, setIngredientQuery] = useState("");
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    getMealsByIngredient(name).then(async (previews) => {
      const details = await Promise.all(
        previews.slice(0, 20).map((p) => getMealById(p.idMeal))
      );
      setAllMeals(details.filter(Boolean) as Meal[]);
      setLoading(false);
    });
  }, [name]);

  useEffect(() => {
    const handleScroll = () => setShowBackToTop(window.scrollY > 400);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  // All unique areas from fetched meals
  const availableAreas = Array.from(
    new Set(allMeals.map((m) => m.strArea).filter(Boolean))
  ).sort();

  // Filter meals on frontend
  const filteredMeals = allMeals.filter((meal) => {
    const matchArea = selectedArea ? meal.strArea === selectedArea : true;
    const matchLetter = selectedLetter
      ? meal.strMeal.toUpperCase().startsWith(selectedLetter)
      : true;
    const matchIngredient = ingredientQuery
      ? Array.from({ length: 20 }, (_, i) => i + 1).some((i) => {
          const ing = meal[`strIngredient${i}` as keyof Meal];
          return ing?.toLowerCase().includes(ingredientQuery.toLowerCase());
        })
      : true;
    return matchArea && matchLetter && matchIngredient;
  });

  const clearFilters = () => {
    setSelectedArea("");
    setSelectedLetter("");
    setIngredientSearch("");
    setIngredientQuery("");
  };

  const hasActiveFilters = selectedArea || selectedLetter || ingredientQuery;

  return (
    <div className="bg-[#0F0F0F] min-h-screen pt-28 pb-24">
      <div className="max-w-7xl mx-auto px-6">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-8">
          <Link href="/" className="text-[#9E9E9E] text-sm font-poppins hover:text-white transition-colors">
            Home
          </Link>
          <ChevronRight size={14} className="text-[#9E9E9E]" />
          <Link href="/ingredients" className="text-[#9E9E9E] text-sm font-poppins hover:text-white transition-colors">
            Ingredients
          </Link>
          <ChevronRight size={14} className="text-[#9E9E9E]" />
          <span className="text-[#E0E0E0] text-sm font-poppins">{name}</span>
        </div>

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center gap-8">
            <div className="relative w-32 h-32 flex-shrink-0">
              <Image
                src={`https://www.themealdb.com/images/ingredients/${name.replace(/ /g, "_")}-medium.png`}
                alt={name}
                fill
                className="object-contain"
              />
            </div>
            <div>
              <p className="text-[#FF6B2C] text-xs font-bold font-poppins uppercase tracking-widest mb-2">
                Ingredient
              </p>
              <h1 className="font-bold text-white font-poppins text-4xl md:text-5xl">
                {name}
              </h1>
              {!loading && (
                <p className="text-[#9E9E9E] text-sm font-poppins mt-3">
                  {filteredMeals.length} of {allMeals.length} recipes using {name}
                </p>
              )}
            </div>
          </div>

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              "flex items-center gap-2 px-5 py-2.5 rounded-pill self-start md:self-auto",
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
            {selectedArea && (
              <span className={cn("flex items-center gap-2 px-4 py-2 rounded-pill", "bg-[#00FFD1]/10 border border-[#00FFD1]/30 text-[#00FFD1] text-sm font-poppins")}>
                Area: {selectedArea}
                <button onClick={() => setSelectedArea("")}><X size={12} /></button>
              </span>
            )}
            {selectedLetter && (
              <span className={cn("flex items-center gap-2 px-4 py-2 rounded-pill", "bg-[#FFB800]/10 border border-[#FFB800]/30 text-[#FFB800] text-sm font-poppins")}>
                Letter: {selectedLetter}
                <button onClick={() => setSelectedLetter("")}><X size={12} /></button>
              </span>
            )}
            {ingredientQuery && (
              <span className={cn("flex items-center gap-2 px-4 py-2 rounded-pill", "bg-[#00E65C]/10 border border-[#00E65C]/30 text-[#00E65C] text-sm font-poppins")}>
                Ingredient: {ingredientQuery}
                <button onClick={() => { setIngredientSearch(""); setIngredientQuery(""); }}><X size={12} /></button>
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

            {/* Filter by Area */}
            <div>
              <p className="text-[#9E9E9E] text-xs font-poppins uppercase tracking-widest mb-3">
                Filter by Area
              </p>
              <div className="flex flex-wrap gap-2">
                {availableAreas.length > 0 ? availableAreas.map((area) => (
                  <button
                    key={area}
                    onClick={() => setSelectedArea(selectedArea === area ? "" : area)}
                    className={cn(
                      "px-4 py-2 rounded-pill text-xs font-medium font-poppins",
                      "border transition-all duration-200",
                      selectedArea === area
                        ? "bg-[#00FFD1] border-[#00FFD1] text-[#0F0F0F] font-bold"
                        : "bg-transparent border-white/10 text-[#E0E0E0] hover:border-[#00FFD1]/50"
                    )}
                  >
                    {area}
                  </button>
                )) : (
                  <p className="text-[#9E9E9E] text-xs font-poppins">
                    {loading ? "Loading areas..." : "No area data available"}
                  </p>
                )}
              </div>
            </div>

            {/* Filter by First Letter */}
            <div>
              <p className="text-[#9E9E9E] text-xs font-poppins uppercase tracking-widest mb-3">
                Filter by First Letter
              </p>
              <div className="flex flex-wrap gap-2">
                {LETTERS.map((letter) => (
                  <button
                    key={letter}
                    onClick={() => setSelectedLetter(selectedLetter === letter ? "" : letter)}
                    className={cn(
                      "w-9 h-9 rounded-xl text-sm font-bold font-poppins",
                      "border transition-all duration-200 hover:scale-110",
                      selectedLetter === letter
                        ? "bg-[#FFB800] border-[#FFB800] text-[#0F0F0F]"
                        : "bg-transparent border-white/10 text-[#9E9E9E] hover:border-[#FFB800]/50 hover:text-white"
                    )}
                  >
                    {letter}
                  </button>
                ))}
              </div>
            </div>

            {/* Filter by Ingredient */}
            <div>
              <p className="text-[#9E9E9E] text-xs font-poppins uppercase tracking-widest mb-3">
                Filter by Ingredient
              </p>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setIngredientQuery(ingredientSearch.trim());
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
              <p className="text-[#9E9E9E] text-xs font-poppins mt-2">
                Filter meals that contain this ingredient
              </p>
            </div>
          </div>
        )}

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {loading ? (
            Array.from({ length: 8 }).map((_, i) => (
              <MealCardSkeleton key={i} />
            ))
          ) : filteredMeals.length > 0 ? (
            filteredMeals.map((meal) => (
              <MealCard
                key={meal.idMeal}
                id={meal.idMeal}
                name={meal.strMeal}
                thumbnail={meal.strMealThumb}
                category={meal.strCategory}
                area={meal.strArea}
              />
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center py-32 gap-4">
              <span className="text-5xl">🍽️</span>
              <p className="font-bold text-white font-poppins text-xl">No meals found</p>
              <p className="text-[#9E9E9E] text-sm font-poppins">Try adjusting your filters</p>
              <button
                onClick={clearFilters}
                className={cn("px-6 py-3 rounded-pill", "bg-[#FF6B2C] text-white", "text-sm font-semibold font-poppins", "hover:brightness-110 transition-all duration-200")}
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Back to Top Button */}
      <button
        onClick={scrollToTop}
        className={cn(
          "fixed bottom-8 right-8 z-50",
          "w-12 h-12 rounded-full",
          "bg-[#FF6B2C] text-white",
          "flex items-center justify-center",
          "shadow-[0_0_20px_rgba(255,107,44,0.5)]",
          "transition-all duration-300",
          showBackToTop
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 translate-y-4 pointer-events-none"
        )}
        aria-label="Back to top"
      >
        <ArrowUp size={20} />
      </button>
    </div>
  );
}