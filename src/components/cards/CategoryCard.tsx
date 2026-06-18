import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface CategoryCardProps {
  name: string;
  thumbnail: string;
  description?: string;
  large?: boolean;
}

export default function CategoryCard({
  name,
  thumbnail,
  large = false,
}: CategoryCardProps) {
  return (
    <Link href={`/categories/${name}`}>
      <div
        className={cn(
          "group relative overflow-hidden rounded-3xl cursor-pointer",
          large ? "aspect-square" : "aspect-square"
        )}
      >
        <Image
          src={thumbnail}
          alt={name}
          fill
          className={cn(
            "object-cover",
            "group-hover:scale-110",
            "transition-transform duration-500"
          )}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <div
          className={cn(
            "absolute bottom-0 left-0 right-0",
            "p-4 md:p-6"
          )}
        >
          <p
            className={cn(
              "font-bold text-white font-poppins",
              large ? "text-2xl" : "text-base"
            )}
          >
            {name}
          </p>
        </div>

        {/* Hover Overlay */}
        <div
          className={cn(
            "absolute inset-0",
            "flex items-center justify-center",
            "bg-[#FF6B2C]/20",
            "opacity-0 group-hover:opacity-100",
            "transition-opacity duration-300"
          )}
        >
          <span
            className={cn(
              "px-6 py-2 rounded-pill",
              "bg-[#FF6B2C] text-white",
              "text-sm font-semibold font-poppins",
              "shadow-[0_0_20px_rgba(255,107,44,0.4)]"
            )}
          >
            Explore
          </span>
        </div>
      </div>
    </Link>
  );
}