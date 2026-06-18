import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface MealCardProps {
  id: string;
  name: string;
  thumbnail: string;
  category?: string;
  area?: string;
}

export default function MealCard({
  id,
  name,
  thumbnail,
  category,
  area,
}: MealCardProps) {
  return (
    <Link href={`/meal/${id}`}>
      <div
        className={cn(
          "group relative overflow-hidden",
          "bg-[#1A1A1A] rounded-card",
          "border border-white/5",
          "hover:border-white/10",
          "hover:shadow-card hover:scale-[1.02]",
          "transition-all duration-300 cursor-pointer"
        )}
      >
        {/* Image */}
        <div className="relative h-52 overflow-hidden">
          <Image
            src={`${thumbnail}/medium`}
            alt={name}
            fill
            className={cn(
              "object-cover",
              "group-hover:scale-110",
              "transition-transform duration-500"
            )}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A] via-transparent to-transparent" />
        </div>

        {/* Content */}
        <div className={cn("p-4 space-y-2")}>
          <h4
            className={cn(
              "font-semibold text-base text-white font-poppins",
              "line-clamp-1"
            )}
          >
            {name}
          </h4>
          <div className="flex items-center gap-2 flex-wrap">
            {category && (
              <span
                className={cn(
                  "px-3 py-1 rounded-badge",
                  "bg-[#FF6B2C]/10 text-[#FF6B2C]",
                  "text-xs font-semibold font-poppins"
                )}
              >
                {category}
              </span>
            )}
            {area && (
              <span
                className={cn(
                  "px-3 py-1 rounded-badge",
                  "bg-[#00FFD1]/10 text-[#00FFD1]",
                  "text-xs font-semibold font-poppins"
                )}
              >
                {area}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}