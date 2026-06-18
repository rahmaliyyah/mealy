"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ChevronRight, Search, SlidersHorizontal, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { getMealsByArea, getMealById, type Meal } from "@/lib/api";
import MealCard from "@/components/cards/MealCard";
import MealCardSkeleton from "@/components/cards/MealCardSkeleton";

const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

const COUNTRY_FLAGS: Record<string, string> = {
  American: "🇺🇸", British: "🇬🇧", Canadian: "🇨🇦", Chinese: "🇨🇳",
  Croatian: "🇭🇷", Dutch: "🇳🇱", Egyptian: "🇪🇬", Filipino: "🇵🇭",
  French: "🇫🇷", Greek: "🇬🇷", Indian: "🇮🇳", Irish: "🇮🇪",
  Italian: "🇮🇹", Jamaican: "🇯🇲", Japanese: "🇯🇵", Kenyan: "🇰🇪",
  Malaysian: "🇲🇾", Mexican: "🇲🇽", Moroccan: "🇲🇦", Polish: "🇵🇱",
  Portuguese: "🇵🇹", Russian: "🇷🇺", Spanish: "🇪🇸", Thai: "🇹🇭",
  Tunisian: "🇹🇳", Turkish: "🇹🇷", Ukrainian: "🇺🇦", Vietnamese: "🇻🇳",
};

export default function AreaDetailPage() {
  const params = useParams();
  const name = decodeURIComponent(params.name as string);

  const [allMeals, setAllMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedLetter, setSelectedLetter] = useState("");
  const [ingredientSearch, setIngredientSearch] = useState("");
  const [ingredientQuery, setIngredientQuery] = useState("");

  useEffect(() => {
    getMealsByArea(name).then(async (previews) => {
      const details = await Promise.all(
        previews.slice(0, 20).map((p) => getMealById(p.idMeal))
      );
      setAllMeals(details.filter(Boolean) as Meal[]);
      setLoading(false);
    });
  }, [name]);

  const availableCategories = Array.from(
    new Set(allMeals.map((m) => m.strCategory).filter(Boolean))
  ).sort();

  const filteredMeals = allMeals.filter((meal) => {
    const matchCategory = selectedCategory
      ? meal.strCategory === selectedCategory
      : true;
    const matchLetter = selectedLetter
      ? meal.strMeal.toUpperCase().startsWith(selectedLetter)
      : true;
    const matchIngredient = ingredientQuery
      ? Array.from({ length: 20 }, (_, i) => i + 1).some((i) => {
          const ing = meal[`strIngredient${i}` as keyof Meal];
          return ing?.toLowerCase().includes(ingredientQuery.toLowerCase());
        })
      : true;
    return matchCategory && matchLetter && matchIngredient;
  });

  const clearFilters = () => {
    setSelectedCategory("");
    setSelectedLetter("");
    setIngredientSearch("");
    setIngredientQuery("");
  };

  const hasActiveFilters = selectedCategory || selectedLetter || ingredientQuery;

  return (
    <div className="bg-[#0F0F0F] min-h-screen pt-28 pb-24">
      <div className="max-w-7xl mx-auto px-6">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-8">
          <Link href="/" className="text-[#9E9E9E] text-sm font-poppins hover:text-white transition-colors">
            Home
          </Link>
          <ChevronRight size={14} className="text-[#9E9E9E]" />
          <Link href="/areas" className="text-[#9E9E9E] text-sm font-poppins hover:text-white transition-colors">
            Areas
          </Link>
          <ChevronRight size={14} className="text-[#9E9E9E]" />
          <span className="text-[#E0E0E0] text-sm font-poppins">{name}</span>
        </div>

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <div className="flex items-center gap-4 mb-3">
              <div>
                <p className="text-[#9E9E9E] text-xs font-poppins uppercase tracking-widest mb-1">
                  Cuisine
                </p>
                <h1 className="font-bold text-white font-poppins text-4xl md:text-5xl">
                  {name}
                </h1>
              </div>
            </div>
            {!loading && (
              <p className="text-[#9E9E9E] text-sm font-poppins mt-2">
                {filteredMeals.length} of {allMeals.length} recipes
              </p>
            )}
          </div>

          {/* Filter Toggle */}
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

            {/* Filter by Category */}
            <div>
              <p className="text-[#9E9E9E] text-xs font-poppins uppercase tracking-widest mb-3">
                Filter by Category
              </p>
              <div className="flex flex-wrap gap-2">
                {availableCategories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(selectedCategory === cat ? "" : cat)}
                    className={cn(
                      "px-4 py-2 rounded-pill text-xs font-medium font-poppins",
                      "border transition-all duration-200",
                      selectedCategory === cat
                        ? "bg-[#FF6B2C] border-[#FF6B2C] text-white font-bold"
                        : "bg-transparent border-white/10 text-[#E0E0E0] hover:border-[#FF6B2C]/50"
                    )}
                  >
                    {cat}
                  </button>
                ))}
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
              <span className="text-5xl">🌍</span>
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
      
    </div>
    
  );
}