"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Shuffle, Search, ArrowUp, ChevronLeft, ChevronRight, X } from "lucide-react";
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

const AREAS_PREVIEW = 16;
const AREAS_PREVIEW_MOBILE = 8;
const CATEGORIES_PER_PAGE_MOBILE = 6;

export default function HomePage() {
  const [heroMeal, setHeroMeal] = useState<Meal | null>(null);
  const [motdMeal, setMotdMeal] = useState<Meal | null>(null);
  const [randomMeals, setRandomMeals] = useState<Meal[]>([]);
  const [loadingRandom, setLoadingRandom] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [areas, setAreas] = useState<Area[]>([]);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<{ idMeal: string; strMeal: string; strMealThumb: string }[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [categoriesPage, setCategoriesPage] = useState(1);

  const heroDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const heroSearchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getRandomMeal().then(setHeroMeal);
  }, []);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    const handleScroll = () => setShowBackToTop(window.scrollY > 600);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
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

  // Hero live search debounce
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    setSearchLoading(true);
    if (heroDebounceRef.current) clearTimeout(heroDebounceRef.current);
    heroDebounceRef.current = setTimeout(async () => {
      const res = await fetch(
        `https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(searchQuery)}`
      );
      const data = await res.json();
      setSearchResults(data.meals?.slice(0, 3) || []);
      setSearchLoading(false);
    }, 400);
    return () => {
      if (heroDebounceRef.current) clearTimeout(heroDebounceRef.current);
    };
  }, [searchQuery]);

  // Close hero dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (heroSearchRef.current && !heroSearchRef.current.contains(e.target as Node)) {
        setSearchResults([]);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  const clearHeroSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
  };

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const totalCategoriesPages = Math.ceil(categories.length / CATEGORIES_PER_PAGE_MOBILE);
  const displayedCategories = isMobile
    ? categories.slice(
        (categoriesPage - 1) * CATEGORIES_PER_PAGE_MOBILE,
        categoriesPage * CATEGORIES_PER_PAGE_MOBILE
      )
    : categories;

  return (
    <div className="bg-[#0F0F0F] min-h-screen">

      {/* ===== HERO ===== */}
      <section id="hero" className="relative w-full min-h-[85vh] md:h-screen flex items-center overflow-hidden">
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

        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full grid md:grid-cols-2 gap-8 md:gap-12 items-center py-28 md:py-0">
          <div className="space-y-5 md:space-y-8">
            <h1 className="font-bold text-white font-poppins text-3xl sm:text-4xl md:text-6xl leading-tight">
              Discover Your Next{" "}
              <span className="text-[#FF6B2C]">Favorite Meal</span>
            </h1>
            <p className="text-[#9E9E9E] text-base md:text-lg font-poppins max-w-md">
              Explore thousands of recipes from around the world. Find your next culinary adventure.
            </p>

            {/* Hero Search with Live Dropdown */}
            <div ref={heroSearchRef} className="relative max-w-md">
              <form onSubmit={handleSearch}>
                <div className={cn(
                  "flex items-center",
                  "rounded-pill",
                  "bg-white/10 backdrop-blur-sm",
                  "border border-white/10",
                  "focus-within:border-[#FF6B2C]",
                  "transition-colors duration-200",
                  "pr-2"
                )}>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search any meal..."
                    className={cn(
                      "flex-1 bg-transparent",
                      "px-5 py-3.5 md:px-6 md:py-4",
                      "text-white placeholder:text-[#9E9E9E]",
                      "font-poppins text-sm",
                      "outline-none"
                    )}
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={clearHeroSearch}
                      className="w-8 h-8 flex items-center justify-center text-[#9E9E9E] hover:text-white transition-colors flex-shrink-0"
                    >
                      <X size={14} />
                    </button>
                  )}
                  <button
                    type="submit"
                    className={cn(
                      "w-9 h-9 md:w-10 md:h-10 rounded-full flex-shrink-0",
                      "bg-[#FF6B2C] text-white",
                      "flex items-center justify-center",
                      "hover:brightness-110 transition-all duration-200"
                    )}
                  >
                    <Search size={16} />
                  </button>
                </div>
              </form>

              {/* Hero Live Search Dropdown */}
              {searchQuery.trim() && (
                <div className={cn(
                  "absolute top-full left-0 right-0 mt-2 z-20",
                  "bg-[rgba(26,26,26,0.98)] backdrop-blur-xl",
                  "border border-white/10 rounded-2xl",
                  "overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
                )}>
                  {searchLoading ? (
                    <p className="px-4 py-4 text-[#9E9E9E] text-sm font-poppins">
                      Searching...
                    </p>
                  ) : searchResults.length > 0 ? (
                    <>
                      {searchResults.map((meal) => (
                        <Link
                          key={meal.idMeal}
                          href={`/meal/${meal.idMeal}`}
                          onClick={clearHeroSearch}
                          className={cn(
                            "flex items-center gap-3 px-4 py-2.5",
                            "hover:bg-white/5 transition-colors duration-150"
                          )}
                        >
                          <img
                            src={`${meal.strMealThumb}/small`}
                            alt={meal.strMeal}
                            className="w-9 h-9 rounded-lg object-cover flex-shrink-0"
                          />
                          <span className="text-[#E0E0E0] text-sm font-poppins font-medium truncate">
                            {meal.strMeal}
                          </span>
                        </Link>
                      ))}
                      <div className="border-t border-white/5 px-4 py-2.5">
                        <button
                          onClick={() => {
                            window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
                            clearHeroSearch();
                          }}
                          className="text-[#FF6B2C] text-[13px] font-poppins font-semibold hover:underline"
                        >
                          See all results for "{searchQuery}"
                        </button>
                      </div>
                    </>
                  ) : (
                    <p className="px-4 py-4 text-[#9E9E9E] text-sm font-poppins">
                      No results found
                    </p>
                  )}
                </div>
              )}
            </div>
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

      </section>

      {/* ===== MEAL OF THE DAY ===== */}
      {motdMeal && (
        <section className="max-w-7xl mx-auto px-6 py-10 md:py-24">
          <div className="grid md:grid-cols-2 gap-0 bg-[#1A1A1A] rounded-[28px] md:rounded-[40px] overflow-hidden border border-white/5 shadow-card">
            <div className="relative h-56 md:h-auto md:min-h-[400px] bg-[#242424]">
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
            <div className="p-6 md:p-12 space-y-4 md:space-y-6 flex flex-col justify-center">
              <span className="text-[#FF6B2C] font-bold tracking-widest uppercase text-xs font-poppins">
                Meal of the Day
              </span>
              <h2 className="font-bold text-white font-poppins text-2xl md:text-4xl leading-tight">
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
              <p className="hidden md:block text-[#9E9E9E] text-sm font-poppins leading-relaxed">
                {motdMeal.strInstructions?.slice(0, 150)}...
              </p>
              <Link
                href={`/meal/${motdMeal.idMeal}`}
                className={cn(
                  "inline-flex items-center gap-2 w-fit",
                  "px-6 py-3 md:px-8 md:py-3.5 rounded-pill",
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
      <section className="max-w-7xl mx-auto px-6 py-6 md:py-10">
        <SectionHeader title="What Are You Craving?" />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
          {displayedCategories.map((cat) => (
            <CategoryCard
              key={cat.idCategory}
              name={cat.strCategory}
              thumbnail={cat.strCategoryThumb}
              description={cat.strCategoryDescription}
            />
          ))}
        </div>

        {/* Mobile Pagination */}
        {isMobile && categories.length > CATEGORIES_PER_PAGE_MOBILE && (
          <div className="flex items-center justify-center gap-3 mt-5">
            <button
              onClick={() => setCategoriesPage((p) => Math.max(p - 1, 1))}
              disabled={categoriesPage === 1}
              className={cn(
                "w-9 h-9 rounded-full flex items-center justify-center",
                "border transition-all duration-200",
                categoriesPage === 1
                  ? "border-white/5 text-[#9E9E9E]/30 cursor-not-allowed"
                  : "border-white/10 text-[#E0E0E0] hover:border-[#FF6B2C]/50 hover:text-[#FF6B2C]"
              )}
            >
              <ChevronLeft size={14} />
            </button>
            <span className="text-xs text-[#9E9E9E] font-poppins">
              {categoriesPage} / {totalCategoriesPages}
            </span>
            <button
              onClick={() => setCategoriesPage((p) => Math.min(p + 1, totalCategoriesPages))}
              disabled={categoriesPage === totalCategoriesPages}
              className={cn(
                "w-9 h-9 rounded-full flex items-center justify-center",
                "border transition-all duration-200",
                categoriesPage === totalCategoriesPages
                  ? "border-white/5 text-[#9E9E9E]/30 cursor-not-allowed"
                  : "border-white/10 text-[#E0E0E0] hover:border-[#FF6B2C]/50 hover:text-[#FF6B2C]"
              )}
            >
              <ChevronRight size={14} />
            </button>
          </div>
        )}
      </section>

      {/* ===== FOOD AROUND THE WORLD ===== */}
      <section className="bg-[#0A0A0A] py-10 md:py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-6 md:mb-10">
            <h2 className="font-bold text-white font-poppins text-2xl md:text-4xl">
              Food Around The World
            </h2>
            <p className="mt-2 text-[#9E9E9E] text-sm font-poppins">
              Explore cuisines from every corner of the globe
            </p>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-8 gap-2 md:gap-3">
            {areas.slice(0, isMobile ? AREAS_PREVIEW_MOBILE : AREAS_PREVIEW).map((area) => (
              <Link
                key={area.strArea}
                href={`/areas/${area.strArea}`}
                className={cn(
                  "group flex flex-col items-center justify-center gap-2 p-3 md:p-4",
                  "rounded-xl md:rounded-2xl min-h-[60px] md:min-h-[80px]",
                  "bg-[#1A1A1A] border border-white/5",
                  "hover:border-[#FF6B2C]/30 hover:bg-[#242424]",
                  "transition-all duration-300 cursor-pointer"
                )}
              >
                <p className={cn(
                  "text-[11px] md:text-xs font-medium text-[#E0E0E0] font-poppins text-center",
                  "group-hover:text-[#FF6B2C] transition-colors duration-200"
                )}>
                  {area.strArea}
                </p>
              </Link>
            ))}
          </div>

          <div className="flex justify-center mt-6 md:mt-10">
            <Link
              href="/areas"
              className={cn(
                "flex items-center gap-2",
                "px-6 py-3 md:px-8 md:py-3.5 rounded-pill",
                "bg-[#1A1A1A] border border-white/10",
                "text-sm font-semibold text-[#E0E0E0] font-poppins",
                "hover:border-[#FF6B2C]/50 hover:text-[#FF6B2C]",
                "transition-all duration-200"
              )}
            >
              Browse All Areas →
            </Link>
          </div>
        </div>
      </section>

      {/* ===== YOU MIGHT LIKE THESE ===== */}
      <section className="max-w-7xl mx-auto px-6 py-10 md:py-24">
        <SectionHeader
          title="You Might Like These"
          subtitle="Random picks refreshed just for you"
        >
          <button
            onClick={fetchRandomMeals}
            className={cn(
              "flex items-center gap-2",
              "px-4 py-2 md:px-5 md:py-2.5 rounded-pill",
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

        {isMobile ? (
          <div className="flex gap-4 overflow-x-auto pb-2 -mx-6 px-6 scrollbar-hide snap-x snap-mandatory">
            {loadingRandom
              ? Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex-shrink-0 w-[75%] snap-start">
                    <MealCardSkeleton />
                  </div>
                ))
              : randomMeals.map((meal) => (
                  <div key={meal.idMeal} className="flex-shrink-0 w-[75%] snap-start">
                    <MealCard
                      id={meal.idMeal}
                      name={meal.strMeal}
                      thumbnail={meal.strMealThumb}
                      category={meal.strCategory}
                      area={meal.strArea}
                    />
                  </div>
                ))}
          </div>
        ) : (
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
        )}
      </section>

      {/* ===== SEARCH BY INGREDIENT ===== */}
      <section className="bg-[#0A0A0A] py-10 md:py-24">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeader title="Search by Ingredient" centered />
          <div className="flex flex-wrap justify-center gap-2 md:gap-3 max-w-4xl mx-auto">
            {(isMobile ? ingredients.slice(0, 10) : ingredients).map((ing) => (
              <Link
                key={ing.idIngredient}
                href={`/ingredients/${encodeURIComponent(ing.strIngredient)}`}
                className={cn(
                  "flex items-center gap-2",
                  "px-4 py-2 md:px-5 md:py-2.5 rounded-pill",
                  "bg-[#1A1A1A] border border-white/5",
                  "text-xs md:text-sm font-medium text-[#E0E0E0] font-poppins",
                  "hover:border-[#FF6B2C]/50 hover:text-[#FF6B2C]",
                  "transition-all duration-200"
                )}
              >
                <div className="relative w-4 h-4 md:w-5 md:h-5 flex-shrink-0">
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

          <div className="flex justify-center mt-6 md:mt-10">
            <Link
              href="/ingredients"
              className={cn(
                "flex items-center gap-2",
                "px-6 py-3 md:px-8 md:py-3.5 rounded-pill",
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
      <section className="max-w-7xl mx-auto px-6 py-10 md:py-24">
        <SectionHeader title="Explore Alphabetically" />
        <div className="grid grid-cols-6 sm:grid-cols-9 md:grid-cols-13 gap-2 md:gap-3">
          {LETTERS.map((letter, i) => (
            <Link
              key={letter}
              href={`/az?letter=${letter}`}
              className={cn(
                "aspect-square flex items-center justify-center",
                "rounded-lg md:rounded-xl",
                "text-base md:text-xl font-bold font-poppins",
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
      <section className="max-w-7xl mx-auto px-6 py-10 md:py-24">
        <div
          className={cn(
            "relative overflow-hidden",
            "bg-[#FF6B2C] rounded-[28px] md:rounded-[40px]",
            "p-8 md:p-12 lg:p-20",
            "flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8"
          )}
        >
          <div className="absolute inset-0 opacity-10">
            <div className="w-full h-full bg-[radial-gradient(circle_at_30%_50%,_white,_transparent_70%)]" />
          </div>
          <div className="relative z-10 space-y-3 md:space-y-4 text-center md:text-left">
            <h2 className="font-bold text-white font-poppins text-2xl md:text-5xl">
              Feeling Adventurous?
            </h2>
            <p className="text-white/80 font-poppins text-sm md:text-lg max-w-xl">
              Not sure what to cook tonight? Let us pick a random recipe just for you!
            </p>
          </div>
          <Link
            href="/surprise"
            className={cn(
              "relative z-10 flex-shrink-0",
              "px-8 py-4 md:px-10 md:py-5 rounded-pill",
              "bg-white text-[#FF6B2C]",
              "font-bold text-base md:text-xl font-poppins",
              "hover:scale-105 active:scale-95",
              "transition-all duration-200 shadow-xl"
            )}
          >
            Surprise Me 🎲
          </Link>
        </div>
      </section>

      {/* Back to Top — mobile only */}
      <button
        onClick={scrollToTop}
        className={cn(
          "md:hidden fixed bottom-6 right-6 z-50",
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

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}