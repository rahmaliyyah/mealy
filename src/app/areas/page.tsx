"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { getAreas, type Area } from "@/lib/api";

const COUNTRY_FLAGS: Record<string, string> = {
  American: "🇺🇸",
  British: "🇬🇧",
  Canadian: "🇨🇦",
  Chinese: "🇨🇳",
  Croatian: "🇭🇷",
  Dutch: "🇳🇱",
  Egyptian: "🇪🇬",
  Filipino: "🇵🇭",
  French: "🇫🇷",
  Greek: "🇬🇷",
  Indian: "🇮🇳",
  Irish: "🇮🇪",
  Italian: "🇮🇹",
  Jamaican: "🇯🇲",
  Japanese: "🇯🇵",
  Kenyan: "🇰🇪",
  Malaysian: "🇲🇾",
  Mexican: "🇲🇽",
  Moroccan: "🇲🇦",
  Polish: "🇵🇱",
  Portuguese: "🇵🇹",
  Russian: "🇷🇺",
  Spanish: "🇪🇸",
  Thai: "🇹🇭",
  Tunisian: "🇹🇳",
  Turkish: "🇹🇷",
  Ukrainian: "🇺🇦",
  Vietnamese: "🇻🇳",
};

const COUNTRY_CODES: Record<string, string> = {
  American: "US",
  British: "GB",
  Canadian: "CA",
  Chinese: "CN",
  Croatian: "HR",
  Dutch: "NL",
  Egyptian: "EG",
  Filipino: "PH",
  French: "FR",
  Greek: "GR",
  Indian: "IN",
  Irish: "IE",
  Italian: "IT",
  Jamaican: "JM",
  Japanese: "JP",
  Kenyan: "KE",
  Malaysian: "MY",
  Mexican: "MX",
  Moroccan: "MA",
  Polish: "PL",
  Portuguese: "PT",
  Russian: "RU",
  Spanish: "ES",
  Thai: "TH",
  Tunisian: "TN",
  Turkish: "TR",
  Ukrainian: "UA",
  Vietnamese: "VN",
};

export default function AreasPage() {
  const [areas, setAreas] = useState<Area[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const ITEMS_PER_PAGE = 12;

  useEffect(() => {
    getAreas().then((data) => {
      const unique = Array.from(
        new Map(data.map((a) => [a.strArea, a])).values()
      );

      setAreas(unique);
      setLoading(false);
    });
  }, []);

  const filtered = areas.filter((a) =>
    a.strArea.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);

  const paginatedAreas = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="bg-[#0F0F0F] min-h-screen pt-28 pb-24">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="mb-12 space-y-4">
          <div>
            <p className="text-[#FF6B2C] text-xs font-bold font-poppins uppercase tracking-widest mb-2">
              Explore
            </p>

            <h1 className="font-bold text-white font-poppins text-4xl md:text-5xl">
              Food Around The World
            </h1>

            <p className="text-[#9E9E9E] font-poppins text-base mt-3 max-w-xl">
              Discover traditional recipes and exotic flavors categorized by
              their cultural origin.
            </p>
          </div>

          {/* Search */}
          <div className="relative max-w-sm">
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search areas..."
              className={cn(
                "w-full rounded-pill",
                "bg-[#1A1A1A] border border-white/10",
                "px-5 py-3 pr-12",
                "text-white placeholder:text-[#9E9E9E]",
                "font-poppins text-sm",
                "outline-none focus:border-[#FF6B2C]",
                "transition-colors duration-200"
              )}
            />

            <Search
              size={14}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9E9E9E]"
            />
          </div>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className="animate-pulse bg-[#1A1A1A] rounded-2xl h-44"
              />
            ))}
          </div>
        ) : filtered.length > 0 ? (
          <>
            {/* Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {paginatedAreas.map((area) => (
                <Link
                  key={area.strArea}
                  href={`/areas/${area.strArea}`}
                  className={cn(
                    "group relative overflow-hidden",
                    "bg-[#1A1A1A] rounded-2xl",
                    "border border-white/5",
                    "hover:border-[#FF6B2C]/40",
                    "p-6 flex flex-col items-center justify-center gap-3",
                    "transition-all duration-300",
                    "hover:bg-[#1A1A1A]/80 hover:shadow-card",
                    "min-h-[176px]"
                  )}
                >
                  <div className="text-center space-y-1">
                    <p className="font-bold text-white font-poppins text-base group-hover:text-[#FF6B2C] transition-colors duration-200">
                      {area.strArea}
                    </p>
                  </div>
                </Link>
              ))}
            </div>

{/* Pagination */}
{totalPages > 1 && (
  <div className="flex items-center justify-center gap-4 mt-12">
    <button
      onClick={() =>
        setCurrentPage((prev) => Math.max(prev - 1, 1))
      }
      disabled={currentPage === 1}
      className={cn(
        "px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200",
        currentPage === 1
          ? "bg-[#1A1A1A] text-[#666] cursor-not-allowed"
          : "bg-[#1A1A1A] text-white hover:bg-[#FF6B2C]"
      )}
    >
      ← Prev
    </button>

    <div className="px-5 py-2.5 rounded-full bg-[#1A1A1A] border border-white/5">
      <span className="text-sm text-[#9E9E9E] font-poppins">
        Page{" "}
        <span className="text-white font-semibold">
          {currentPage}
        </span>{" "}
        of{" "}
        <span className="text-white font-semibold">
          {totalPages}
        </span>
      </span>
    </div>

    <button
      onClick={() =>
        setCurrentPage((prev) =>
          Math.min(prev + 1, totalPages)
        )
      }
      disabled={currentPage === totalPages}
      className={cn(
        "px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200",
        currentPage === totalPages
          ? "bg-[#1A1A1A] text-[#666] cursor-not-allowed"
          : "bg-[#1A1A1A] text-white hover:bg-[#FF6B2C]"
      )}
    >
      Next →
    </button>
  </div>
)}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <p className="font-bold text-white font-poppins text-xl">
              No areas found
            </p>

            <p className="text-[#9E9E9E] text-sm font-poppins">
              Try a different search term
            </p>
          </div>
        )}
      </div>
    </div>
  );
}