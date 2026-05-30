import "./globals.css";

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata = {
  title: "ThemeCraft Celebrations | Hyderabad's Trusted Birthday Party & Balloon Planners",
  description: "Creative birthday themes, customized balloon decorations, baby showers, bouncy castles, cartoon characters, popcorn stalls, magic shows, and complete party setups for unforgettable Hyderabad family celebrations.",
  keywords: "birthday party planner hyderabad, balloon decoration hyderabad, kids theme party organizers, baby shower decorators, home decoration ideas, bouncy castle rental hyderabad, party organizers",
  robots: "index, follow",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className="h-full antialiased scroll-smooth"
    >
      <body className="min-h-full flex flex-col text-slate-900 bg-white">
        {children}
      </body>
    </html>
  );
}
