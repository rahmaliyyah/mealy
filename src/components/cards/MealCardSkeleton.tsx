import { cn } from "@/lib/utils";

export default function MealCardSkeleton() {
  return (
    <div
      className={cn(
        "overflow-hidden",
        "bg-[#1A1A1A] rounded-card",
        "border border-white/5",
        "animate-pulse"
      )}
    >
      <div className="h-52 bg-[#242424]" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-[#242424] rounded-full w-3/4" />
        <div className="flex gap-2">
          <div className="h-6 bg-[#242424] rounded-full w-20" />
          <div className="h-6 bg-[#242424] rounded-full w-16" />
        </div>
      </div>
    </div>
  );
}