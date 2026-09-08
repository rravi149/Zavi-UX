import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Zavi, the growth agent that finds the constraint and proves the lift",
  description:
    "Tell Zavi the number you want to move. Zavi works out what is holding it back, does the work, and shows you what moved and why.",
  openGraph: {
    title:
      "Zavi, the growth agent that finds the constraint and proves the lift",
    description:
      "Tell Zavi the number you want to move. Zavi works out what is holding it back, does the work, and shows you what moved and why.",
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
