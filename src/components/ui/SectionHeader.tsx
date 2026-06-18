import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  centered?: boolean;
  children?: React.ReactNode;
}

export default function SectionHeader({
  title,
  subtitle,
  centered = false,
  children,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "flex items-end justify-between mb-10",
        centered && "flex-col items-center text-center"
      )}
    >
      <div>
        <h2
          className={cn(
            "font-bold text-white font-poppins",
            "text-3xl md:text-4xl"
          )}
        >
          {title}
        </h2>
        {subtitle && (
          <p className={cn("mt-2 text-[#9E9E9E] text-sm font-poppins")}>
            {subtitle}
          </p>
        )}
      </div>
      {children && <div>{children}</div>}
    </div>
  );
}