"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal, X, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  searchMealByName,
  getMealsByLetter,
  getMealsByCategory,
  getMealsByArea,
  getMealsByIngredient,
  getCategories,
  getAreas,
  getMealById,
  type Meal,
  type Category,
  type Area,
} from "@/lib/api";
import MealCard from "@/components/cards/MealCard";
import MealCardSkeleton from "@/components/cards/MealCardSkeleton";

const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";

  const [searchQuery, setSearchQuery] = useState(query);
  const [results, setResults] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [areas, setAreas] = useState<Area[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedArea, setSelectedArea] = useState("");
  const [selectedLetter, setSelectedLetter] = useState("");
  const [ingredientSearch, setIngredientSearch] = useState("");
  const [areaSearch, setAreaSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [showAreaDropdown, setShowAreaDropdown] = useState(false);
  const [filterMode, setFilterMode] = useState<"search" | "letter" | "category" | "area" | "ingredient">("search");

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
    if (!query) return;
    setLoading(true);
    setFilterMode("search");
    searchMealByName(query).then((data) => {
      setResults(data);
      setLoading(false);
    });
  }, [query]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  const handleCategoryFilter = async (cat: string) => {
    if (selectedCategory === cat) {
      setSelectedCategory("");
      setFilterMode("search");
      if (query) {
        setLoading(true);
        const data = await searchMealByName(query);
        setResults(data);
        setLoading(false);
      }
      return;
    }
    setSelectedCategory(cat);
    setSelectedArea("");
    setSelectedLetter("");
    setIngredientSearch("");
    setFilterMode("category");
    setLoading(true);
    const previews = await getMealsByCategory(cat);
    const details = await Promise.all(
      previews.slice(0, 20).map((p) => getMealById(p.idMeal))
    );
    setResults(details.filter(Boolean) as Meal[]);
    setLoading(false);
  };

  const handleAreaFilter = async (area: string) => {
    setSelectedArea(area);
    setSelectedCategory("");
    setSelectedLetter("");
    setIngredientSearch("");
    setFilterMode("area");
    setShowAreaDropdown(false);
    setLoading(true);
    const previews = await getMealsByArea(area);
    const details = await Promise.all(
      previews.slice(0, 20).map((p) => getMealById(p.idMeal))
    );
    setResults(details.filter(Boolean) as Meal[]);
    setLoading(false);
  };

  const handleLetterFilter = async (letter: string) => {
    if (selectedLetter === letter) {
      setSelectedLetter("");
      setFilterMode("search");
      return;
    }
    setSelectedLetter(letter);
    setSelectedCategory("");
    setSelectedArea("");
    setIngredientSearch("");
    setFilterMode("letter");
    setLoading(true);
    const data = await getMealsByLetter(letter.toLowerCase());
    setResults(data);
    setLoading(false);
  };

  const handleIngredientFilter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ingredientSearch.trim()) return;
    setFilterMode("ingredient");
    setSelectedCategory("");
    setSelectedArea("");
    setSelectedLetter("");
    setLoading(true);
    const previews = await getMealsByIngredient(ingredientSearch.trim());
    const details = await Promise.all(
      previews.slice(0, 20).map((p) => getMealById(p.idMeal))
    );
    setResults(details.filter(Boolean) as Meal[]);
    setLoading(false);
  };

  const clearFilters = () => {
    setSelectedCategory("");
    setSelectedArea("");
    setSelectedLetter("");
    setIngredientSearch("");
    setFilterMode("search");
    if (query) {
      setLoading(true);
      searchMealByName(query).then((data) => {
        setResults(data);
        setLoading(false);
      });
    }
  };

  const filteredAreas = areas.filter((a) =>
    a.strArea.toLowerCase().includes(areaSearch.toLowerCase())
  );

  const hasActiveFilters = selectedCategory || selectedArea || selectedLetter || ingredientSearch;

  const getResultTitle = () => {
    if (filterMode === "category") return `Category: ${selectedCategory}`;
    if (filterMode === "area") return `Area: ${selectedArea}`;
    if (filterMode === "letter") return `Meals starting with "${selectedLetter}"`;
    if (filterMode === "ingredient") return `Meals with "${ingredientSearch}"`;
    return `"${query}"`;
  };

  return (
    <div className="bg-[#0F0F0F] min-h-screen pt-28 pb-24">
      <div className="max-w-7xl mx-auto px-6">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-6">
          <a href="/" className="text-[#9E9E9E] text-sm font-poppins hover:text-white transition-colors">
            Home
          </a>
          <span className="text-[#9E9E9E] text-sm">›</span>
          <span className="text-[#E0E0E0] text-sm font-poppins">Search Results</span>
        </div>

        {/* Title */}
        <div className="mb-8">
          <h1 className="font-bold font-poppins text-4xl md:text-5xl mb-2">
            <span className="text-white">Results for: </span>
            <span className="text-[#FF6B2C]">{getResultTitle()}</span>
          </h1>
          {!loading && (
            <p className="text-[#9E9E9E] text-sm font-poppins">
              Found {results.length} recipe{results.length !== 1 ? "s" : ""}
            </p>
          )}
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="relative max-w-2xl mb-6">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search any meal..."
            className={cn(
              "w-full rounded-pill",
              "bg-[#1A1A1A] border border-white/10",
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
              "w-10 h-10 rounded-full bg-[#FF6B2C] text-white",
              "flex items-center justify-center",
              "hover:brightness-110 transition-all duration-200"
            )}
          >
            <Search size={16} />
          </button>
        </form>

        {/* Filter Row */}
        <div className="flex flex-wrap items-center gap-3 mb-4">
          {/* All Results */}
          <button
            onClick={clearFilters}
            className={cn(
              "px-5 py-2.5 rounded-pill text-sm font-semibold font-poppins",
              "transition-all duration-200",
              !hasActiveFilters
                ? "bg-[#FF6B2C] text-white shadow-[0_0_20px_rgba(255,107,44,0.3)]"
                : "bg-[#1A1A1A] border border-white/10 text-[#E0E0E0] hover:border-[#FF6B2C]/50"
            )}
          >
            All Results
          </button>

          {/* Category Quick Filters */}
          {categories.slice(0, 5).map((cat) => (
            <button
              key={cat.idCategory}
              onClick={() => handleCategoryFilter(cat.strCategory)}
              className={cn(
                "px-5 py-2.5 rounded-pill text-sm font-medium font-poppins",
                "border transition-all duration-200",
                selectedCategory === cat.strCategory
                  ? "bg-[#FF6B2C] border-[#FF6B2C] text-white"
                  : "bg-transparent border-white/10 text-[#E0E0E0] hover:border-[#FF6B2C]/50"
              )}
            >
              {cat.strCategory}
            </button>
          ))}

          {/* More Filters Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              "flex items-center gap-2 px-5 py-2.5 rounded-pill",
              "text-sm font-medium font-poppins border transition-all duration-200",
              showFilters
                ? "bg-white/10 border-white/20 text-white"
                : "bg-transparent border-white/10 text-[#9E9E9E] hover:border-white/20"
            )}
          >
            <SlidersHorizontal size={14} />
            More Filters
          </button>
        </div>

        {/* Active Filter Chips */}
        {hasActiveFilters && (
          <div className="flex flex-wrap gap-2 mb-6">
            {selectedCategory && (
              <span className={cn("flex items-center gap-2 px-4 py-2 rounded-pill", "bg-[#FF6B2C]/10 border border-[#FF6B2C]/30", "text-[#FF6B2C] text-sm font-poppins")}>
                Category: {selectedCategory}
                <button onClick={() => handleCategoryFilter(selectedCategory)}><X size={12} /></button>
              </span>
            )}
            {selectedArea && (
              <span className={cn("flex items-center gap-2 px-4 py-2 rounded-pill", "bg-[#00FFD1]/10 border border-[#00FFD1]/30", "text-[#00FFD1] text-sm font-poppins")}>
                Area: {selectedArea}
                <button onClick={clearFilters}><X size={12} /></button>
              </span>
            )}
            {selectedLetter && (
              <span className={cn("flex items-center gap-2 px-4 py-2 rounded-pill", "bg-[#FFB800]/10 border border-[#FFB800]/30", "text-[#FFB800] text-sm font-poppins")}>
                Letter: {selectedLetter}
                <button onClick={clearFilters}><X size={12} /></button>
              </span>
            )}
            {ingredientSearch && (
              <span className={cn("flex items-center gap-2 px-4 py-2 rounded-pill", "bg-[#00E65C]/10 border border-[#00E65C]/30", "text-[#00E65C] text-sm font-poppins")}>
                Ingredient: {ingredientSearch}
                <button onClick={clearFilters}><X size={12} /></button>
              </span>
            )}
            <button onClick={clearFilters} className="text-[#9E9E9E] text-sm font-poppins hover:text-white transition-colors">
              Clear all
            </button>
          </div>
        )}

        {/* Expanded Filter Panel */}
        {showFilters && (
          <div className={cn("mb-8 p-6 rounded-2xl", "bg-[#1A1A1A] border border-white/5", "space-y-6")}>

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
                    "hover:border-[#FF6B2C]/50 transition-colors duration-200"
                  )}
                >
                  {selectedArea || "Select area..."}
                  <ChevronDown size={14} className={cn("transition-transform duration-200", showAreaDropdown && "rotate-180")} />
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
                      {filteredAreas.map((area) => (
                        <button
                          key={area.strArea}
                          onClick={() => handleAreaFilter(area.strArea)}
                          className={cn(
                            "w-full text-left px-4 py-2.5",
                            "text-sm font-poppins",
                            "hover:bg-white/10 transition-colors duration-150",
                            selectedArea === area.strArea ? "text-[#FF6B2C] font-semibold" : "text-[#E0E0E0]"
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

            {/* Filter by A-Z */}
            <div>
              <p className="text-[#9E9E9E] text-xs font-poppins uppercase tracking-widest mb-3">
                Filter by First Letter
              </p>
              <div className="flex flex-wrap gap-2">
                {LETTERS.map((letter) => (
                  <button
                    key={letter}
                    onClick={() => handleLetterFilter(letter)}
                    className={cn(
                      "w-9 h-9 rounded-xl",
                      "text-sm font-bold font-poppins",
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
              <form onSubmit={handleIngredientFilter} className="flex gap-3 max-w-sm">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={ingredientSearch}
                    onChange={(e) => setIngredientSearch(e.target.value)}
                    placeholder="e.g. chicken, salmon..."
                    className={cn(
                      "w-full rounded-xl px-4 py-3",
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
                  Search
                </button>
              </form>
            </div>

            {/* All Categories */}
            <div>
              <p className="text-[#9E9E9E] text-xs font-poppins uppercase tracking-widest mb-3">
                Filter by Category
              </p>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat.idCategory}
                    onClick={() => handleCategoryFilter(cat.strCategory)}
                    className={cn(
                      "px-4 py-2 rounded-pill",
                      "text-xs font-medium font-poppins",
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
          </div>
        )}

        {/* Results Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <MealCardSkeleton key={i} />
            ))}
          </div>
        ) : results.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {results.map((meal) => (
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
          <div className="flex flex-col items-center justify-center py-32 gap-6">
            <div className={cn("w-24 h-24 rounded-full", "bg-[#1A1A1A] border border-white/5", "flex items-center justify-center text-4xl")}>
              🍽️
            </div>
            <div className="text-center space-y-2">
              <h3 className="font-bold text-white font-poppins text-xl">No meals found</h3>
              <p className="text-[#9E9E9E] text-sm font-poppins">Try searching with a different keyword</p>
            </div>
            <button
              onClick={clearFilters}
              className={cn("px-6 py-3 rounded-pill", "bg-[#FF6B2C] text-white", "text-sm font-semibold font-poppins", "hover:brightness-110 transition-all duration-200", "shadow-[0_0_20px_rgba(255,107,44,0.3)]")}
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}