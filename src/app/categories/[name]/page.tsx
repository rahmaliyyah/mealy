"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { getMealsByCategory, getMealById, type Meal } from "@/lib/api";
import MealCard from "@/components/cards/MealCard";
import MealCardSkeleton from "@/components/cards/MealCardSkeleton";

export default function CategoryDetailPage() {
  const params = useParams();
  const name = decodeURIComponent(params.name as string);

  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMealsByCategory(name).then(async (previews) => {
      const details = await Promise.all(
        previews.slice(0, 12).map((p) => getMealById(p.idMeal))
      );
      setMeals(details.filter(Boolean) as Meal[]);
      setLoading(false);
    });
  }, [name]);

  return (
    <div className="bg-[#0F0F0F] min-h-screen pt-28 pb-24">
      <div className="max-w-7xl mx-auto px-6">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-8">
          <Link
            href="/"
            className="text-[#9E9E9E] text-sm font-poppins hover:text-white transition-colors"
          >
            Home
          </Link>
          <ChevronRight size={14} className="text-[#9E9E9E]" />
          <Link
            href="/categories"
            className="text-[#9E9E9E] text-sm font-poppins hover:text-white transition-colors"
          >
            Categories
          </Link>
          <ChevronRight size={14} className="text-[#9E9E9E]" />
          <span className="text-[#E0E0E0] text-sm font-poppins">{name}</span>
        </div>

        {/* Header */}
        <div className="mb-12">
          <p className="text-[#FF6B2C] text-xs font-bold font-poppins uppercase tracking-widest mb-2">
            Category
          </p>
          <h1 className="font-bold text-white font-poppins text-4xl md:text-5xl">
            {name}
          </h1>
          {!loading && (
            <p className="text-[#9E9E9E] text-sm font-poppins mt-3">
              {meals.length} recipes in this category
            </p>
          )}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {loading
            ? Array.from({ length: 8 }).map((_, i) => (
                <MealCardSkeleton key={i} />
              ))
            : meals.map((meal) => (
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
      </div>
    </div>
  );
}