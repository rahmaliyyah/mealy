"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Play } from "lucide-react";
import { cn } from "@/lib/utils";
import { getMealById, getRandomMeal, getIngredients, type Meal } from "@/lib/api";
import MealCardSkeleton from "@/components/cards/MealCardSkeleton";
import MealCard from "@/components/cards/MealCard";

function IngredientItem({
  ingredient,
  measure,
}: {
  ingredient: string;
  measure: string;
}) {
  return (
    <li
      className={cn(
        "flex items-center justify-between",
        "p-3 rounded-xl",
        "hover:bg-white/5",
        "transition-colors duration-200 group"
      )}
    >
      <div className="flex items-center gap-3">
        <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-[#242424] flex-shrink-0">
          <Image
            src={`https://www.themealdb.com/images/ingredients/${ingredient.replace(/ /g, "_")}-small.png`}
            alt={ingredient}
            fill
            className="object-cover"
          />
        </div>
        <p className="font-semibold text-white font-poppins text-sm">
          {ingredient}
        </p>
      </div>
      <span className="text-[#FF6B2C] font-bold text-sm font-poppins flex-shrink-0">
        {measure}
      </span>
    </li>
  );
}

function StepCard({ step, index }: { step: string; index: number }) {
  return (
    <div
      className={cn(
        "flex gap-6 p-6",
        "bg-[#1A1A1A] rounded-2xl",
        "border border-white/5",
        "hover:border-[#FF6B2C]/30",
        "transition-all duration-300 group"
      )}
    >
      <span
        className={cn(
          "text-5xl font-bold font-poppins flex-shrink-0",
          "text-white/10 group-hover:text-[#FF6B2C]/40",
          "transition-colors duration-300 leading-none"
        )}
      >
        {String(index + 1).padStart(2, "0")}
      </span>
      <p className="text-[#E0E0E0] font-poppins text-sm leading-relaxed pt-1">
        {step}
      </p>
    </div>
  );
}

export default function MealDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [meal, setMeal] = useState<Meal | null>(null);
  const [loading, setLoading] = useState(true);
  const [relatedMeals, setRelatedMeals] = useState<Meal[]>([]);
  const [loadingRelated, setLoadingRelated] = useState(true);

  useEffect(() => {
    getMealById(id).then((data) => {
      setMeal(data);
      setLoading(false);
    });
  }, [id]);

  useEffect(() => {
    const fetchRelated = async () => {
      setLoadingRelated(true);
      const promises = Array.from({ length: 4 }, () => getRandomMeal());
      const results = await Promise.all(promises);
      setRelatedMeals(results.filter(Boolean) as Meal[]);
      setLoadingRelated(false);
    };
    fetchRelated();
  }, []);

  if (loading) {
    return (
      <div className="bg-[#0F0F0F] min-h-screen flex items-center justify-center">
        <div className="animate-spin w-10 h-10 border-2 border-[#FF6B2C] border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!meal) {
    return (
      <div className="bg-[#0F0F0F] min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-4xl">🍽️</p>
        <h2 className="font-bold text-white font-poppins text-xl">
          Meal not found
        </h2>
        <Link
          href="/"
          className="px-6 py-3 rounded-pill bg-[#FF6B2C] text-white font-semibold font-poppins text-sm hover:brightness-110 transition-all"
        >
          Back to Home
        </Link>
      </div>
    );
  }

  const ingredients = getIngredients(meal);
  const steps = meal.strInstructions
    .split(/\r\n|\n|\r/)
    .map((s) => s.trim())
    .filter((s) => s.length > 20);

  const youtubeId = meal.strYoutube?.split("v=")?.[1];

  return (
    <div className="bg-[#0F0F0F] min-h-screen">

      {/* ===== HERO ===== */}
      <section className="relative w-full h-[70vh] min-h-[500px] overflow-hidden">
        <Image
          src={`${meal.strMealThumb}/large`}
          alt={meal.strMeal}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F0F0F] via-[#0F0F0F]/50 to-transparent" />

        {/* Content overlay */}
        <div className="absolute bottom-0 left-0 right-0 max-w-7xl mx-auto px-6 pb-16">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 mb-6">
            <Link
              href="/"
              className="text-[#9E9E9E] text-sm font-poppins hover:text-white transition-colors"
            >
              Home
            </Link>
            <ChevronRight size={14} className="text-[#9E9E9E]" />
            <Link
              href={`/categories/${meal.strCategory}`}
              className="text-[#9E9E9E] text-sm font-poppins hover:text-white transition-colors"
            >
              {meal.strCategory}
            </Link>
            <ChevronRight size={14} className="text-[#9E9E9E]" />
            <span className="text-[#E0E0E0] text-sm font-poppins line-clamp-1">
              {meal.strMeal}
            </span>
          </div>

          {/* Badges */}
          <div className="flex gap-2 mb-4">
            <span
              className={cn(
                "px-4 py-1.5 rounded-pill",
                "bg-[#FF6B2C]/20 text-[#FF6B2C]",
                "text-xs font-bold font-poppins uppercase tracking-wider",
                "border border-[#FF6B2C]/30"
              )}
            >
              {meal.strCategory}
            </span>
            <span
              className={cn(
                "px-4 py-1.5 rounded-pill",
                "bg-[#00FFD1]/20 text-[#00FFD1]",
                "text-xs font-bold font-poppins uppercase tracking-wider",
                "border border-[#00FFD1]/30"
              )}
            >
              {meal.strArea}
            </span>
          </div>

          <h1
            className={cn(
              "font-bold text-white font-poppins",
              "text-4xl md:text-6xl",
              "leading-tight max-w-4xl drop-shadow-lg"
            )}
          >
            {meal.strMeal}
          </h1>
        </div>
      </section>

      {/* ===== CONTENT ===== */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

          {/* LEFT — Ingredients */}
          <aside className="lg:col-span-4">
            <div
              className={cn(
                "sticky top-28",
                "bg-[#1A1A1A] rounded-2xl",
                "border border-white/5",
                "overflow-hidden"
              )}
            >
              <div className="p-6 border-b border-white/5">
                <h3 className="font-bold text-white font-poppins text-xl">
                  🛒 Ingredients
                </h3>
                <p className="text-[#9E9E9E] text-xs font-poppins mt-1">
                  {ingredients.length} items needed
                </p>
              </div>
              <ul className="p-4 space-y-1 max-h-[600px] overflow-y-auto">
                {ingredients.map(({ ingredient, measure }) => (
                  <IngredientItem
                    key={ingredient}
                    ingredient={ingredient}
                    measure={measure}
                  />
                ))}
              </ul>
            </div>
          </aside>

          {/* RIGHT — Instructions + Video */}
          <div className="lg:col-span-8 space-y-12">

            {/* Instructions */}
            <div>
              <h2
                className={cn(
                  "font-bold text-white font-poppins",
                  "text-3xl md:text-4xl mb-8",
                  "flex items-center gap-3"
                )}
              >
                <span className="text-[#FF6B2C]">📋</span>
                Step-by-Step
              </h2>
              <div className="space-y-4">
                {steps.map((step, i) => (
                  <StepCard key={i} step={step} index={i} />
                ))}
              </div>
            </div>

            {/* YouTube Video */}
            {youtubeId && (
              <div>
                <h3 className="font-bold text-white font-poppins text-2xl mb-6">
                  🎬 Watch the Tutorial
                </h3>
                <div
                  className={cn(
                    "relative aspect-video rounded-2xl overflow-hidden",
                    "bg-[#1A1A1A] border border-white/5",
                    "group cursor-pointer shadow-card"
                  )}
                  onClick={() =>
                    window.open(meal.strYoutube, "_blank")
                  }
                >
                  <Image
                    src={`https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`}
                    alt="Video thumbnail"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div
                    className={cn(
                      "absolute inset-0 bg-black/40",
                      "flex items-center justify-center",
                      "group-hover:bg-black/20 transition-all duration-300"
                    )}
                  >
                    <div
                      className={cn(
                        "w-20 h-20 rounded-full",
                        "bg-[#FF6B2C] flex items-center justify-center",
                        "shadow-[0_0_40px_rgba(255,107,44,0.6)]",
                        "group-hover:scale-110 transition-transform duration-300"
                      )}
                    >
                      <Play
                        size={32}
                        className="text-white ml-1"
                        fill="white"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ===== YOU MIGHT ALSO LIKE ===== */}
      <section className="max-w-7xl mx-auto px-6 py-16 border-t border-white/5">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="font-bold text-white font-poppins text-3xl md:text-4xl">
              You Might Also Like
            </h2>
            <p className="text-[#9E9E9E] text-sm font-poppins mt-2">
              Similar culinary adventures selected for you
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {loadingRelated
            ? Array.from({ length: 4 }).map((_, i) => (
                <MealCardSkeleton key={i} />
              ))
            : relatedMeals.map((m) => (
                <MealCard
                  key={m.idMeal}
                  id={m.idMeal}
                  name={m.strMeal}
                  thumbnail={m.strMealThumb}
                  category={m.strCategory}
                  area={m.strArea}
                />
              ))}
        </div>
      </section>
    </div>
  );
}