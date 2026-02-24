import BlogsList from "@/components/blogs/BlogsList";
import Prs from "@/components/blogs/Prs";
import { getPublishedPosts } from "@/lib/blogs";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Blogs | Natalie Segal",
};

export default async function BlogsPage() {
  const posts = await getPublishedPosts();
  return (
    <>
      <BlogsList initialPosts={posts} />
      <Prs />
    </>
  );
}
