import Author from "@/components/home/Author";
import Book from "@/components/home/Book";
import Cta from "@/components/home/Cta";
import Hero from "@/components/home/Hero";

export const metadata = {
  title: "Home | Natalie Segal",
};

export default function Home() {
  return (
    <>
      <Hero />
      <Book />
      <Author />
      <Cta />
    </>
  );
}

