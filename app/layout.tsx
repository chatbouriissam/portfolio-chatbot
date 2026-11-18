import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Issam Chatbouri - Portfolio IA & Full-Stack",
  description: "Portfolio interactif d'Issam Chatbouri, étudiant ingénieur en génie informatique spécialisé en IA et Data Science. Discutez avec son assistant IA pour découvrir ses projets et compétences.",
  keywords: ["Issam Chatbouri", "Développeur IA", "Machine Learning", "Deep Learning", "Full-Stack", "Portfolio", "Stage PFE", "Tunisie"],
  authors: [{ name: "Issam Chatbouri" }],
  openGraph: {
    title: "Issam Chatbouri - Portfolio IA & Full-Stack",
    description: "Découvrez le parcours et les projets d'Issam en IA et développement. Portfolio interactif avec assistant IA.",
    type: "website",
    locale: "fr_FR",
    url: "https://portfolio-chatbot.vercel.app",
    siteName: "Portfolio Issam Chatbouri",
  },
  twitter: {
    card: "summary_large_image",
    title: "Issam Chatbouri - Portfolio IA & Full-Stack",
    description: "Portfolio interactif avec assistant IA - Développeur spécialisé en Machine Learning et Full-Stack",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
