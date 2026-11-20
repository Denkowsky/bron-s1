import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "latin-ext"],
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin", "latin-ext"],
});

const description =
  "Policz pełny koszt pozwolenia na broń w 2026 roku i dobierz szafę klasy S1 do swojej kolekcji: pojemność, głębokość pod lunetę, rodzaj zamka.";

export const metadata: Metadata = {
  title: {
    default: "SEJF//S1: kalkulator pozwolenia na broń i konfigurator szafy S1",
    template: "%s | SEJF//S1",
  },
  description,
  openGraph: {
    title: "SEJF//S1: kalkulator pozwolenia na broń i konfigurator szafy S1",
    description,
    locale: "pl_PL",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pl"
      className={`${inter.variable} ${jetbrains.variable} dark h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
