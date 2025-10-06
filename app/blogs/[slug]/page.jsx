import Comments from "@/components/blogs/Comments";
import ReadingProgress from "@/components/blogs/ReadingProgress";
import ShareActions from "@/components/blogs/ShareActions";
import SectionSubtitle from "@/components/ui/SectionSubtitle";
import { BLOG_POSTS, getPostBySlug } from "@/constants/blogs";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FaEye, FaRegComment } from "react-icons/fa";

export function generateStaticParams() {
  return BLOG_POSTS.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }) {
  const post = getPostBySlug(params.slug);
  if (!post) return { title: "Blog Not Found" };
  return {
    title: `${post.title} | Natalie Segal`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [{ url: post.cover }],
    },
  };
}

export default function BlogDetailPage({ params }) {
  const post = getPostBySlug(params.slug);
  if (!post) notFound();

  return (
    <div className="relative">
      <ReadingProgress />

      {/* hero */}
      <header className="relative h-[52vh] min-h-[360px] md:h-[56vh]">
        <Image
          src={post.cover}
          alt={post.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/25 to-transparent" />
        <div className="absolute inset-0">
          <div className="container h-full flex flex-col justify-end pb-10 md:pb-16">
            <nav className="mb-2 text-xs text-neutral-200/90">
              <Link href="/blogs" className="hover:underline">
                Blogs
              </Link>
              <span className="mx-2">•</span>
              <span className="opacity-90">{post.category || "Blog"}</span>
            </nav>
            <h1 className="font-noticia text-white text-4xl md:text-5xl leading-tight tracking-tight">
              {post.title}
            </h1>
            <div className="mt-3 flex flex-wrap items-center gap-2 text-[13px] text-white/90">
              <span className="inline-flex items-center rounded-full bg-white/15 px-2.5 py-1 ring-1 ring-white/20">
                {post.author}
              </span>
              <span className="inline-flex items-center rounded-full bg-white/15 px-2.5 py-1 ring-1 ring-white/20">
                {post.date}
              </span>
              {post.readTime ? (
                <span className="inline-flex items-center rounded-full bg-white/15 px-2.5 py-1 ring-1 ring-white/20">
                  {post.readTime}
                </span>
              ) : null}
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-1 ring-1 ring-white/20">
                <FaEye className="opacity-90" /> {post.views.toLocaleString()}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-1 ring-1 ring-white/20">
                <FaRegComment className="opacity-90" /> {post.comments}
              </span>
              <div className="ml-auto">
                <ShareActions title={post.title} excerpt={post.excerpt} />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* article */}
      <article className="container mt-10 md:mt-12">
        <div className="mx-auto max-w-3xl">
          {post.content?.[0] ? (
            <p className="text-lg leading-relaxed text-neutral-800 first-letter:float-left first-letter:mr-3 first-letter:rounded first-letter:bg-neutral-100 first-letter:px-2 first-letter:py-1 first-letter:text-5xl first-letter:font-serif first-letter:leading-[0.85]">
              {post.content[0]}
            </p>
          ) : null}
          {post.content?.slice(1).map((para, idx) => (
            <p key={idx} className="mt-5 leading-relaxed text-neutral-800">
              {para}
            </p>
          ))}

          <figure className="my-12 border-l-4 border-primary-500 pl-4">
            <blockquote className="font-noticia text-xl md:text-2xl leading-snug text-neutral-900">
              “Stories teach us to pay attention. The magic isn’t elsewhere—it’s
              underneath what we name ordinary.”
            </blockquote>
            <figcaption className="mt-2 text-sm text-neutral-600">
              — Notes from the desk
            </figcaption>
          </figure>
        </div>
      </article>

      <section className="container mt-12 md:mt-16">
        <div className="mx-auto max-w-3xl">
          <Comments slug={post.slug} />
        </div>
      </section>

      <section className="mx-auto max-w-3xl my-16 md:my-20">
        <div className="mb-6">
          <SectionSubtitle align="left">Related</SectionSubtitle>
          <h3 className="font-noticia text-2xl tracking-tight">
            You might also like
          </h3>
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          {BLOG_POSTS.filter((p) => p.slug !== post.slug)
            .slice(0, 3)
            .map((p) => (
              <Link
                key={p.slug}
                href={`/blogs/${p.slug}`}
                className="group overflow-hidden rounded-2xl border border-neutral-200 bg-white ring-1 ring-black/5 hover:shadow-sm transition-shadow"
              >
                <div className="relative aspect-[16/9] w-full overflow-hidden">
                  <Image
                    src={p.cover}
                    alt={p.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                </div>
                <div className="p-4">
                  <div className="text-xs uppercase tracking-[0.14em] text-neutral-500">
                    {p.category || "Blog"}
                  </div>
                  <div className="mt-1.5 font-noticia text-lg leading-snug group-hover:text-neutral-800 transition-colors">
                    {p.title}
                  </div>
                </div>
              </Link>
            ))}
        </div>
      </section>
    </div>
  );
}
