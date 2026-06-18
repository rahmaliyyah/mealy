"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { getMealsByLetter, type Meal } from "@/lib/api";
import MealCard from "@/components/cards/MealCard";
import MealCardSkeleton from "@/components/cards/MealCardSkeleton";

const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export default function AZPage() {
  const [activeLetter, setActiveLetter] = useState("A");
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getMealsByLetter(activeLetter.toLowerCase()).then((data) => {
      setMeals(data);
      setLoading(false);
    });
  }, [activeLetter]);

  return (
    <div className="bg-[#0F0F0F] min-h-screen pt-28 pb-24">
      <div className="max-w-7xl mx-auto px-6">

        {/* Header */}
        <div className="mb-12">
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
            "sticky top-24 z-40 mb-10",
            "bg-[#0F0F0F]/95 backdrop-blur-xl",
            "py-4 -mx-6 px-6",
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
                  "border transition-all duration-200",
                  "hover:scale-110",
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

        {/* Active Letter Header */}
        <div className="flex items-end gap-4 mb-8">
          <span className="font-bold font-poppins text-white/10 text-8xl leading-none">
            {activeLetter}
          </span>
          <div className="pb-2">
            <p className="text-[#9E9E9E] text-sm font-poppins">
              {!loading && `${meals.length} meals found`}
            </p>
          </div>
        </div>

        {/* Meals Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <MealCardSkeleton key={i} />
            ))}
          </div>
        ) : meals.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {meals.map((meal) => (
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
            <p className="font-bold text-white font-poppins text-xl">
              No meals found
            </p>
            <p className="text-[#9E9E9E] text-sm font-poppins">
              No meals start with the letter &quot;{activeLetter}&quot;
            </p>
          </div>
        )}
      </div>
    </div>
  );
}