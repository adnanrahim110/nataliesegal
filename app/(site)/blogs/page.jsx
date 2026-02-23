import BlogsList from "@/components/blogs/BlogsList";
import Prs from "@/components/blogs/Prs";

export const metadata = {
  title: "Blogs | Natalie Segal",
};

export default function BlogsPage() {
  return (
    <>
      <BlogsList />
      <Prs />
    </>
  );
}
