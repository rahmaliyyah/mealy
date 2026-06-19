"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Shuffle, Search, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  getRandomMeal,
  getCategories,
  getAreas,
  getIngredientsList,
  type Meal,
  type Category,
  type Area,
  type Ingredient,
} from "@/lib/api";
import MealCard from "@/components/cards/MealCard";
import MealCardSkeleton from "@/components/cards/MealCardSkeleton";
import CategoryCard from "@/components/cards/CategoryCard";
import SectionHeader from "@/components/ui/SectionHeader";

const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

const LETTER_COLORS = [
  "bg-[#FF6B2C] text-white",
  "bg-[#FFB800] text-white",
  "bg-[#00FFD1]/20 text-[#00FFD1]",
  "bg-[#FF6B2C]/20 text-[#FF6B2C]",
  "bg-[#FFB800]/20 text-[#FFB800]",
  "bg-[#FF1F1F]/20 text-[#FF1F1F]",
  "bg-[#00E65C]/20 text-[#00E65C]",
];

const AREAS_LIMIT = 16;

export default function HomePage() {
  const [heroMeal, setHeroMeal] = useState<Meal | null>(null);
  const [motdMeal, setMotdMeal] = useState<Meal | null>(null);
  const [randomMeals, setRandomMeals] = useState<Meal[]>([]);
  const [loadingRandom, setLoadingRandom] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [areas, setAreas] = useState<Area[]>([]);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [areaSearch, setAreaSearch] = useState("");
  const [showAllAreas, setShowAllAreas] = useState(false);

  const areasSectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    getRandomMeal().then(setHeroMeal);
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem("mealy_motd");
    const storedDate = localStorage.getItem("mealy_motd_date");
    const today = new Date().toDateString();
    if (stored && storedDate === today) {
      setMotdMeal(JSON.parse(stored));
    } else {
      getRandomMeal().then((meal) => {
        if (meal) {
          localStorage.setItem("mealy_motd", JSON.stringify(meal));
          localStorage.setItem("mealy_motd_date", today);
          setMotdMeal(meal);
        }
      });
    }
  }, []);

  const fetchRandomMeals = async () => {
    setLoadingRandom(true);
    const promises = Array.from({ length: 6 }, () => getRandomMeal());
    const results = await Promise.all(promises);
    const unique = Array.from(
      new Map(results.filter(Boolean).map((meal) => [meal!.idMeal, meal])).values()
    ) as Meal[];
    setRandomMeals(unique);
    setLoadingRandom(false);
  };

  useEffect(() => {
    fetchRandomMeals();
  }, []);

  useEffect(() => {
    getCategories().then(setCategories);
    getAreas().then((data) => {
      const unique = Array.from(
        new Map(data.map((a) => [a.strArea, a])).values()
      );
      setAreas(unique);
    });
    getIngredientsList().then((list) => setIngredients(list.slice(0, 20)));
  }, []);

  const filteredAreas = areas.filter((a) =>
    a.strArea.toLowerCase().includes(areaSearch.toLowerCase())
  );

  const displayedAreas = showAllAreas
    ? filteredAreas
    : filteredAreas.slice(0, AREAS_LIMIT);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  const handleShowLess = () => {
    setShowAllAreas(false);
    setTimeout(() => {
      areasSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  };

  return (
    <div className="bg-[#0F0F0F] min-h-screen">

      {/* ===== HERO ===== */}
      <section className="relative w-full h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0 bg-[#1A1A1A]">
          {heroMeal && heroMeal.strMealThumb && (
            <Image
              src={`${heroMeal.strMealThumb}/large`}
              alt={heroMeal.strMeal}
              fill
              className="object-cover"
              priority
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0F0F0F] via-[#0F0F0F]/70 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0F0F0F] via-transparent to-[#0F0F0F]/30" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <h1 className="font-bold text-white font-poppins text-4xl md:text-6xl leading-tight">
              Discover Your Next{" "}
              <span className="text-[#FF6B2C]">Favorite Meal</span>
            </h1>
            <p className="text-[#9E9E9E] text-lg font-poppins max-w-md">
              Explore thousands of recipes from around the world. Find your next culinary adventure.
            </p>

            <form onSubmit={handleSearch} className="relative max-w-md">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search any meal..."
                className={cn(
                  "w-full rounded-pill",
                  "bg-white/10 backdrop-blur-sm",
                  "border border-white/10",
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
          </div>

          {heroMeal && (
            <div className="hidden md:flex justify-end">
              <div
                className={cn(
                  "w-72 rounded-3xl p-4",
                  "bg-white/5 backdrop-blur-xl",
                  "border border-white/10 shadow-card"
                )}
                style={{ animation: "float 6s ease-in-out infinite" }}
              >
                <div className="relative h-52 rounded-2xl overflow-hidden mb-4 bg-[#242424]">
                  {heroMeal.strMealThumb ? (
                    <Image
                      src={`${heroMeal.strMealThumb}/medium`}
                      alt={heroMeal.strMeal}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-[#9E9E9E] text-xs font-poppins">
                      No image
                    </div>
                  )}
                </div>
                <h4 className="font-semibold text-white font-poppins text-base mb-2 line-clamp-1">
                  {heroMeal.strMeal}
                </h4>
                <div className="flex gap-2 mb-4">
                  {heroMeal.strCategory && (
                    <span className="px-3 py-1 rounded-badge bg-[#FF6B2C]/10 text-[#FF6B2C] text-xs font-semibold font-poppins">
                      {heroMeal.strCategory}
                    </span>
                  )}
                  {heroMeal.strArea && (
                    <span className="px-3 py-1 rounded-badge bg-[#00FFD1]/10 text-[#00FFD1] text-xs font-semibold font-poppins">
                      {heroMeal.strArea}
                    </span>
                  )}
                </div>
                <Link
                  href={`/meal/${heroMeal.idMeal}`}
                  className={cn(
                    "block w-full text-center py-2.5 rounded-pill",
                    "bg-[#FF6B2C] text-white",
                    "text-sm font-semibold font-poppins",
                    "hover:brightness-110 transition-all duration-200",
                    "shadow-[0_0_20px_rgba(255,107,44,0.3)]"
                  )}
                >
                  View Recipe
                </Link>
              </div>
            </div>
          )}
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 animate-bounce">
          <p className="text-[#9E9E9E] text-xs font-poppins">Scroll to explore</p>
          <ChevronDown size={20} className="text-[#9E9E9E]" />
        </div>
      </section>

      {/* ===== MEAL OF THE DAY ===== */}
      {motdMeal && (
        <section className="max-w-7xl mx-auto px-6 py-24">
          <div className="grid md:grid-cols-2 gap-0 bg-[#1A1A1A] rounded-[40px] overflow-hidden border border-white/5 shadow-card">
            <div className="relative h-80 md:h-auto min-h-[400px] bg-[#242424]">
              {motdMeal.strMealThumb ? (
                <Image
                  src={`${motdMeal.strMealThumb}/large`}
                  alt={motdMeal.strMeal}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-[#9E9E9E] text-sm font-poppins">
                  No image available
                </div>
              )}
            </div>
            <div className="p-8 md:p-12 space-y-6 flex flex-col justify-center">
              <span className="text-[#FF6B2C] font-bold tracking-widest uppercase text-xs font-poppins">
                Meal of the Day
              </span>
              <h2 className="font-bold text-white font-poppins text-3xl md:text-4xl leading-tight">
                {motdMeal.strMeal}
              </h2>
              <div className="flex gap-2 flex-wrap">
                {motdMeal.strCategory && (
                  <span className="px-3 py-1 rounded-badge bg-[#FF6B2C]/10 text-[#FF6B2C] text-xs font-semibold font-poppins">
                    {motdMeal.strCategory}
                  </span>
                )}
                {motdMeal.strArea && (
                  <span className="px-3 py-1 rounded-badge bg-[#00FFD1]/10 text-[#00FFD1] text-xs font-semibold font-poppins">
                    {motdMeal.strArea}
                  </span>
                )}
              </div>
              <p className="text-[#9E9E9E] text-sm font-poppins leading-relaxed line-clamp-4">
                {motdMeal.strInstructions}
              </p>
              <Link
                href={`/meal/${motdMeal.idMeal}`}
                className={cn(
                  "inline-flex items-center gap-2 w-fit",
                  "px-8 py-3.5 rounded-pill",
                  "bg-[#FF6B2C] text-white",
                  "font-semibold text-sm font-poppins",
                  "hover:brightness-110 hover:scale-105 active:scale-95",
                  "transition-all duration-200",
                  "shadow-[0_0_20px_rgba(255,107,44,0.4)]"
                )}
              >
                View Full Recipe
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ===== WHAT ARE YOU CRAVING ===== */}
      <section className="max-w-7xl mx-auto px-6 py-10">
        <SectionHeader title="What Are You Craving?" />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {categories.map((cat) => (
            <CategoryCard
              key={cat.idCategory}
              name={cat.strCategory}
              thumbnail={cat.strCategoryThumb}
              description={cat.strCategoryDescription}
            />
          ))}
        </div>
      </section>

      {/* ===== FOOD AROUND THE WORLD ===== */}
      <section ref={areasSectionRef} className="bg-[#0A0A0A] py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div>
              <h2 className="font-bold text-white font-poppins text-3xl md:text-4xl">
                Food Around The World
              </h2>
              <p className="mt-2 text-[#9E9E9E] text-sm font-poppins">
                Explore cuisines from every corner of the globe
              </p>
            </div>
            <div className="relative w-full md:w-64">
              <input
                type="text"
                value={areaSearch}
                onChange={(e) => {
                  setAreaSearch(e.target.value);
                  setShowAllAreas(true);
                }}
                placeholder="Search country..."
                className={cn(
                  "w-full rounded-pill",
                  "bg-white/5 border border-white/10",
                  "px-5 py-3 pr-10",
                  "text-white placeholder:text-[#9E9E9E]",
                  "font-poppins text-sm",
                  "outline-none focus:border-[#FF6B2C]",
                  "transition-colors duration-200"
                )}
              />
              <Search size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9E9E9E]" />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-3">
            {displayedAreas.map((area) => (
              <Link
                key={area.strArea}
                href={`/areas/${area.strArea}`}
                className={cn(
                  "group flex flex-col items-center justify-center gap-2 p-4",
                  "rounded-2xl min-h-[80px]",
                  "bg-[#1A1A1A] border border-white/5",
                  "hover:border-[#FF6B2C]/30 hover:bg-[#242424]",
                  "transition-all duration-300 cursor-pointer"
                )}
              >
                <p className={cn(
                  "text-xs font-medium text-[#E0E0E0] font-poppins text-center",
                  "group-hover:text-[#FF6B2C] transition-colors duration-200"
                )}>
                  {area.strArea}
                </p>
              </Link>
            ))}
          </div>

          {filteredAreas.length > AREAS_LIMIT && (
            <div className="flex justify-center mt-8">
              <button
                onClick={showAllAreas ? handleShowLess : () => setShowAllAreas(true)}
                className={cn(
                  "flex items-center gap-2",
                  "px-6 py-3 rounded-pill",
                  "bg-[#1A1A1A] border border-white/10",
                  "text-sm font-semibold text-[#E0E0E0] font-poppins",
                  "hover:border-[#FF6B2C]/50 hover:text-[#FF6B2C]",
                  "transition-all duration-200"
                )}
              >
                {showAllAreas ? (
                  <>Show Less <ChevronUp size={14} /></>
                ) : (
                  <>Show All {filteredAreas.length} Countries <ChevronDown size={14} /></>
                )}
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ===== YOU MIGHT LIKE THESE ===== */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <SectionHeader
          title="You Might Like These"
          subtitle="Random picks refreshed just for you"
        >
          <button
            onClick={fetchRandomMeals}
            className={cn(
              "flex items-center gap-2",
              "px-5 py-2.5 rounded-pill",
              "bg-[#1A1A1A] border border-white/10",
              "text-sm font-semibold text-white font-poppins",
              "hover:border-[#FF6B2C]/50 hover:text-[#FF6B2C]",
              "transition-all duration-200"
            )}
          >
            <Shuffle size={14} />
            Shuffle
          </button>
        </SectionHeader>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {loadingRandom
            ? Array.from({ length: 6 }).map((_, i) => <MealCardSkeleton key={i} />)
            : randomMeals.map((meal) => (
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
      </section>

      {/* ===== SEARCH BY INGREDIENT ===== */}
      <section className="bg-[#0A0A0A] py-24">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeader title="Search by Ingredient" centered />
          <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
            {ingredients.map((ing) => (
              <Link
                key={ing.idIngredient}
                href={`/ingredients/${encodeURIComponent(ing.strIngredient)}`}
                className={cn(
                  "flex items-center gap-2",
                  "px-5 py-2.5 rounded-pill",
                  "bg-[#1A1A1A] border border-white/5",
                  "text-sm font-medium text-[#E0E0E0] font-poppins",
                  "hover:border-[#FF6B2C]/50 hover:text-[#FF6B2C]",
                  "transition-all duration-200"
                )}
              >
                <div className="relative w-5 h-5 flex-shrink-0">
                  <Image
                    src={`https://www.themealdb.com/images/ingredients/${ing.strIngredient.replace(/ /g, "_")}-small.png`}
                    alt={ing.strIngredient}
                    fill
                    className="object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                </div>
                {ing.strIngredient}
              </Link>
            ))}
          </div>

          <div className="flex justify-center mt-10">
            <Link
              href="/ingredients"
              className={cn(
                "flex items-center gap-2",
                "px-8 py-3.5 rounded-pill",
                "bg-[#1A1A1A] border border-white/10",
                "text-sm font-semibold text-[#E0E0E0] font-poppins",
                "hover:border-[#FF6B2C]/50 hover:text-[#FF6B2C]",
                "transition-all duration-200"
              )}
            >
              Browse All Ingredients →
            </Link>
          </div>
        </div>
      </section>

      {/* ===== EXPLORE ALPHABETICALLY ===== */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <SectionHeader title="Explore Alphabetically" />
        <div className="grid grid-cols-6 sm:grid-cols-9 md:grid-cols-13 gap-3">
          {LETTERS.map((letter, i) => (
            <Link
              key={letter}
              href={`/az?letter=${letter}`}
              className={cn(
                "aspect-square flex items-center justify-center",
                "rounded-xl",
                "text-xl font-bold font-poppins",
                "border border-white/5",
                LETTER_COLORS[i % LETTER_COLORS.length],
                "hover:scale-110 hover:border-[#FF6B2C]/50",
                "transition-all duration-200"
              )}
            >
              {letter}
            </Link>
          ))}
        </div>
      </section>

      {/* ===== CTA BANNER ===== */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div
          className={cn(
            "relative overflow-hidden",
            "bg-[#FF6B2C] rounded-[40px]",
            "p-12 md:p-20",
            "flex flex-col md:flex-row items-center justify-between gap-8"
          )}
        >
          <div className="absolute inset-0 opacity-10">
            <div className="w-full h-full bg-[radial-gradient(circle_at_30%_50%,_white,_transparent_70%)]" />
          </div>
          <div className="relative z-10 space-y-4 text-center md:text-left">
            <h2 className="font-bold text-white font-poppins text-4xl md:text-5xl">
              Feeling Adventurous?
            </h2>
            <p className="text-white/80 font-poppins text-lg max-w-xl">
              Not sure what to cook tonight? Let us pick a random recipe just for you!
            </p>
          </div>
          <Link
            href="/surprise"
            className={cn(
              "relative z-10 flex-shrink-0",
              "px-10 py-5 rounded-pill",
              "bg-white text-[#FF6B2C]",
              "font-bold text-xl font-poppins",
              "hover:scale-105 active:scale-95",
              "transition-all duration-200 shadow-xl"
            )}
          >
            Surprise Me 🎲
          </Link>
        </div>
      </section>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
      `}</style>
    </div>
  );
}