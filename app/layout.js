import { Mr_De_Haviland, Noticia_Text, Questrial } from "next/font/google";
import "./globals.css";

const questrial = Questrial({
  variable: "--font-questrial",
  subsets: ["latin"],
  weight: ["400"],
});

const noticiaText = Noticia_Text({
  variable: "--font-noticia-text",
  subsets: ["latin"],
  weight: ["400", "700"],
})

const mrDeHaviland = Mr_De_Haviland({
  variable: "--font-mr-de-haviland",
  subsets: ["latin"],
  weight: ["400"],
})

export const metadata = {
  title: "Natalie Segal",
  description: "Author, Speaker, Coach, Podcaster, and Writer",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${questrial.variable} ${noticiaText.variable} ${mrDeHaviland.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
