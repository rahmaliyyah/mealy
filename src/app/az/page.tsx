"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { SlidersHorizontal, X } from "lucide-react";
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
    getMealsByLetter(activeLetter.toLowerCase()).then((data) => {
      setAllMeals(data);
      setLoading(false);
    });
  }, [activeLetter]);

  const filteredMeals = allMeals.filter((meal) => {
    const matchCategory = selectedCategory ? meal.strCategory === selectedCategory : true;
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

        {/* Sticky Letter Nav */}
       <div
  className={cn(
    "mb-8",
    "py-4",
    "border-b border-white/5"
  )}
>
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
                <button onClick={() => setSelectedCategory("")}><X size={12} /></button>
              </span>
            )}
            {selectedArea && (
              <span className={cn("flex items-center gap-2 px-4 py-2 rounded-pill", "bg-[#00FFD1]/10 border border-[#00FFD1]/30 text-[#00FFD1] text-sm font-poppins")}>
                Area: {selectedArea}
                <button onClick={() => setSelectedArea("")}><X size={12} /></button>
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
                    onClick={() => setSelectedCategory(selectedCategory === cat.strCategory ? "" : cat.strCategory)}
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
            <div>
              <p className="text-[#9E9E9E] text-xs font-poppins uppercase tracking-widest mb-3">
                Filter by Area
              </p>
              <div className="flex flex-wrap gap-2">
                {areas.map((area) => (
                  <button
                    key={area.strArea}
                    onClick={() => setSelectedArea(selectedArea === area.strArea ? "" : area.strArea)}
                    className={cn(
                      "px-4 py-2 rounded-pill text-xs font-medium font-poppins",
                      "border transition-all duration-200",
                      selectedArea === area.strArea
                        ? "bg-[#00FFD1] border-[#00FFD1] text-[#0F0F0F] font-bold"
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

        {/* Meals Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <MealCardSkeleton key={i} />
            ))}
          </div>
        ) : filteredMeals.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredMeals.map((meal) => (
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
      </div>
    </div>
  );
}