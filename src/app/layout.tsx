import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";
import { cn } from "@/lib/utils";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "600", "700"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "Mealy | Discover Your Next Favorite Meal",
  description: "A food recipe discovery website powered by TheMealDB API",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={cn(poppins.variable, "font-poppins bg-[#0F0F0F] text-white antialiased")}>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}