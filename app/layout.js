import { Playfair_Display, Outfit } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "Vivid Celebrations | Premium Luxury Event & Birthday Planner",
  description: "Creating unforgettable, bespoke celebrations. Luxury birthday planning, premium balloon decorations, elegant weddings, and memorable experiences crafted with creativity and sophistication.",
  keywords: "luxury event planner, birthday party coordinator, premium balloon decorator, high-end wedding planning, corporate events, baby shower planner, bespoke celebrations, elegant decorations",
  viewport: "width=device-width, initial-scale=1",
  robots: "index, follow",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${outfit.variable} h-full antialiased scroll-smooth`}
    >
      <body className="min-h-full flex flex-col font-outfit text-slate-100 bg-[#0b0f19]">
        {children}
      </body>
    </html>
  );
}
