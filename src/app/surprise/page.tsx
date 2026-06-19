"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Shuffle, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { getRandomMeal, getIngredients, type Meal } from "@/lib/api";

export default function SurprisePage() {
  const [meal, setMeal] = useState<Meal | null>(null);
  const [loading, setLoading] = useState(true);
  const [spinning, setSpinning] = useState(false);

  const fetchRandom = async () => {
    setSpinning(true);
    setLoading(true);

    try {
      const data = await getRandomMeal();
      setMeal(data);
    } catch (error) {
      console.error("Failed to fetch random meal:", error);
    } finally {
      setLoading(false);
      setTimeout(() => setSpinning(false), 500);
    }
  };

  useEffect(() => {
    fetchRandom();
  }, []);

  const ingredients = meal ? getIngredients(meal) : [];
  const youtubeId = meal?.strYoutube?.split("v=")?.[1];

  return (
    <div className="bg-[#0F0F0F] min-h-screen pt-28 pb-24">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12 space-y-4">
          <p className="text-[#FF6B2C] text-xs font-bold font-poppins uppercase tracking-widest">
            Feeling Adventurous?
          </p>

          <h1 className="font-bold text-white font-poppins text-4xl md:text-6xl">
            Your Random Meal
          </h1>

          <p className="text-[#9E9E9E] font-poppins text-base max-w-xl mx-auto">
            Not sure what to cook? Let us decide for you. Hit role for a new
            one!
          </p>

          {/* Shuffle Button */}
          <button
            onClick={fetchRandom}
            disabled={loading}
            className={cn(
              "inline-flex items-center gap-3",
              "px-8 py-4 rounded-full",
              "bg-[#FF6B2C] text-white",
              "font-bold text-base font-poppins",
              "shadow-[0_0_30px_rgba(255,107,44,0.5)]",
              "hover:brightness-110 hover:scale-105",
              "active:scale-95",
              "transition-all duration-200",
              "disabled:opacity-50 disabled:cursor-not-allowed"
            )}
          >
            <span className={cn("inline-block text-xl", spinning && "animate-spin")}>
              🎲
            </span>
            Role Again
          </button>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-6">
            <div className="w-16 h-16 border-4 border-[#FF6B2C] border-t-transparent rounded-full animate-spin" />
            <p className="text-[#9E9E9E] font-poppins text-sm">
              Finding your next favorite meal...
            </p>
          </div>
        ) : meal ? (
          <div className="space-y-10">
            {/* Hero Card */}
            <div
              className={cn(
                "grid grid-cols-1 lg:grid-cols-2 gap-0",
                "bg-[#1A1A1A] rounded-[32px] overflow-hidden",
                "border border-white/5 shadow-card"
              )}
            >
              {/* Image */}
              <div className="relative h-80 lg:h-auto min-h-[400px] bg-[#242424]">
                {meal.strMealThumb ? (
                  <Image
                    src={`${meal.strMealThumb}/large`}
                    alt={meal.strMeal}
                    fill
                    className="object-cover"
                    priority
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-[#9E9E9E] text-sm font-poppins">
                    No image available
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#1A1A1A]/20" />
              </div>

              {/* Content */}
              <div className="p-8 md:p-12 flex flex-col justify-center space-y-6">
                <div className="flex gap-2 flex-wrap">
                  {meal.strCategory && (
                    <span
                      className={cn(
                        "px-4 py-1.5 rounded-full",
                        "bg-[#FF6B2C]/10 text-[#FF6B2C]",
                        "text-xs font-bold font-poppins uppercase tracking-wider",
                        "border border-[#FF6B2C]/20"
                      )}
                    >
                      {meal.strCategory}
                    </span>
                  )}

                  {meal.strArea && (
                    <span
                      className={cn(
                        "px-4 py-1.5 rounded-full",
                        "bg-[#00FFD1]/10 text-[#00FFD1]",
                        "text-xs font-bold font-poppins uppercase tracking-wider",
                        "border border-[#00FFD1]/20"
                      )}
                    >
                      {meal.strArea}
                    </span>
                  )}
                </div>

                <h2 className="font-bold text-white font-poppins text-3xl md:text-4xl leading-tight">
                  {meal.strMeal}
                </h2>

                <p className="text-[#9E9E9E] font-poppins text-sm leading-relaxed line-clamp-4">
                  {meal.strInstructions}
                </p>

                <div className="flex gap-3 flex-wrap">
                  <Link
                    href={`/meal/${meal.idMeal}`}
                    className={cn(
                      "inline-flex items-center gap-2",
                      "px-6 py-3 rounded-full",
                      "bg-[#FF6B2C] text-white",
                      "font-semibold text-sm font-poppins",
                      "shadow-[0_0_20px_rgba(255,107,44,0.4)]",
                      "hover:brightness-110 hover:scale-105",
                      "active:scale-95 transition-all duration-200"
                    )}
                  >
                    View Full Recipe
                    <ChevronRight size={16} />
                  </Link>

                  {youtubeId && (
                    <a
                      href={meal.strYoutube}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cn(
                        "inline-flex items-center gap-2",
                        "px-6 py-3 rounded-full",
                        "bg-white/5 border border-white/10 text-white",
                        "font-semibold text-sm font-poppins",
                        "hover:bg-white/10 transition-all duration-200"
                      )}
                    >
                      Watch on YouTube
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Ingredients Preview */}
            <div>
              <h3 className="font-bold text-white font-poppins text-2xl mb-6">
                Ingredients Needed
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {ingredients.map(({ ingredient, measure }, index) => (
                  <div
                    key={`${ingredient}-${index}`}
                    className={cn(
                      "flex flex-col items-center gap-2 p-4",
                      "bg-[#1A1A1A] rounded-2xl",
                      "border border-white/5",
                      "hover:border-[#FF6B2C]/30",
                      "transition-colors duration-200"
                    )}
                  >
                    <div className="relative w-14 h-14 bg-[#242424] rounded-lg overflow-hidden">
                      <Image
                        src={`https://www.themealdb.com/images/ingredients/${ingredient.replace(
                          / /g,
                          "_"
                        )}-small.png`}
                        alt={ingredient}
                        fill
                        className="object-contain"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                        }}
                      />
                    </div>

                    <p className="text-white text-xs font-semibold font-poppins text-center line-clamp-2">
                      {ingredient}
                    </p>

                    <p className="text-[#FF6B2C] text-xs font-bold font-poppins text-center">
                      {measure}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}