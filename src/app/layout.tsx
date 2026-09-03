import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Zavi — Dashboard design ideas, ready to ship",
  description:
    "Browse hundreds of dashboard templates and UI kits for SaaS, analytics, and admin panels. Find the layout you need and start building in minutes.",
  openGraph: {
    title: "Zavi — Dashboard design ideas, ready to ship",
    description:
      "Browse hundreds of dashboard templates and UI kits for SaaS, analytics, and admin panels.",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${plusJakarta.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
