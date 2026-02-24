import BlogEngagementCounts from "@/components/blogs/BlogEngagementCounts";
import BlogSharePanel from "@/components/blogs/BlogSharePanel";
import Comments from "@/components/blogs/Comments";
import ReadingProgress from "@/components/blogs/ReadingProgress";
import SectionSubtitle from "@/components/ui/SectionSubtitle";
import { getPublishedPostBySlug, getRelatedPosts } from "@/lib/blogs";
import { CalendarDays, Clock, Tag, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }) {
  const slug = params?.slug;
  if (!slug) return { title: "Blog Not Found" };

  const post = await getPublishedPostBySlug(slug);
  if (!post) return { title: "Blog Not Found" };
  return {
    title: `${post.title} | Natalie Segal`,
    description: post.excerpt || "",
    openGraph: {
      title: post.title,
      description: post.excerpt || "",
      images: [{ url: post.cover || "/imgs/stories.avif" }],
    },
  };
}

export default async function BlogDetailPage({ params }) {
  const slug = params?.slug;
  const post = await getPublishedPostBySlug(slug);
  if (!post) notFound();
  const related = await getRelatedPosts(slug, 3);

  return (
    <div className="relative">
      <ReadingProgress />

      <section className="relative overflow-hidden bg-neutral-900 pb-24 pt-20 text-white md:pb-28 md:pt-24">
        <span className="pointer-events-none absolute -top-32 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-primary-500/40 blur-3xl" />
        <span className="pointer-events-none absolute bottom-0 right-0 h-80 w-80 translate-x-1/3 translate-y-1/3 rounded-full bg-emerald-500/25 blur-3xl" />
        <div className="absolute inset-0 opacity-60 mix-blend-overlay">
          <Image
            src={post.cover}
            alt=""
            fill
            priority
            className="object-cover"
          />
        </div>
        <div className="relative container">
          <nav className="flex items-center text-xs uppercase tracking-[0.18em] text-white/70">
            <Link href="/blogs" className="hover:text-white">
              Blogs
            </Link>
            <span className="mx-2 text-white/40">/</span>
            <span className="truncate text-white/80">
              {post.category || "Article"}
            </span>
          </nav>
          <h1 className="mt-6 max-w-3xl font-noticia text-4xl leading-tight tracking-tight text-white md:text-5xl">
            {post.title}
          </h1>
          {post.excerpt ? (
            <p className="mt-4 max-w-2xl text-base text-white/70 md:text-lg">
              {post.excerpt}
            </p>
          ) : null}
          <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-white/80">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5">
              <User className="h-4 w-4 opacity-80" />
              <span>{post.author || "Natalie Segal"}</span>
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5">
              <CalendarDays className="h-4 w-4 opacity-80" />
              <span>{post.date || "Coming soon"}</span>
            </span>
            {post.readTime ? (
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5">
                <Clock className="h-4 w-4 opacity-80" />
                <span>{post.readTime}</span>
              </span>
            ) : null}
            {post.category ? (
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5">
                <Tag className="h-4 w-4 opacity-80" />
                <span>{post.category}</span>
              </span>
            ) : null}
          </div>
        </div>
      </section>

      <section className="container -mt-20 pb-16 md:-mt-24 md:pb-20 lg:pb-24">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,300px)_minmax(0,1fr)] lg:gap-12">
          <aside className="space-y-6 lg:sticky lg:top-10 lg:self-start">
            <div className="relative overflow-hidden rounded-3xl border border-neutral-200/60 bg-white/90 p-6 shadow-xl shadow-black/10 backdrop-blur">
              <span className="pointer-events-none absolute -left-12 top-8 h-32 w-32 rounded-full bg-primary-200/40 blur-3xl" />
              <span className="pointer-events-none absolute -bottom-14 right-0 h-40 w-40 rounded-full bg-emerald-200/30 blur-3xl" />
              <div className="space-y-5">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-[0.3em] text-neutral-500">
                    Article details
                  </span>
                  <h2 className="mt-2 font-noticia text-xl text-neutral-900">
                    {post.title}
                  </h2>
                </div>
                <dl className="space-y-3 text-sm text-neutral-700">
                  <div className="flex items-start justify-between gap-4">
                    <dt className="text-neutral-500">Author</dt>
                    <dd className="font-medium text-neutral-900">
                      {post.author || "Natalie Segal"}
                    </dd>
                  </div>
                  <div className="flex items-start justify-between gap-4">
                    <dt className="text-neutral-500">Published</dt>
                    <dd className="font-medium text-neutral-900">
                      {post.date || "—"}
                    </dd>
                  </div>
                  <div className="flex items-start justify-between gap-4">
                    <dt className="text-neutral-500">Category</dt>
                    <dd className="font-medium text-neutral-900">
                      {post.category ? (
                        <Link
                          href={`/blogs`}
                          className="hover:text-primary-600"
                        >
                          {post.category}
                        </Link>
                      ) : (
                        "General"
                      )}
                    </dd>
                  </div>
                  {post.readTime ? (
                    <div className="flex items-start justify-between gap-4">
                      <dt className="text-neutral-500">Reading time</dt>
                      <dd className="font-medium text-neutral-900">
                        {post.readTime}
                      </dd>
                    </div>
                  ) : null}
                </dl>
                <div>
                  <BlogEngagementCounts
                    slug={post.slug}
                    initialViews={post.views}
                    initialComments={post.comments}
                    variant="card"
                  />
                </div>
                <BlogSharePanel title={post.title} excerpt={post.excerpt} />
              </div>
            </div>
          </aside>

          <div className="space-y-10">
            <article className="relative overflow-hidden rounded-3xl border border-transparent bg-white/95 shadow-xl shadow-black/10 ring-1 ring-black/5 transition-shadow hover:shadow-2xl">
              <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary-100/40 via-white to-white" />
              <div className="relative aspect-[16/9] w-full overflow-hidden rounded-t-3xl">
                <Image
                  src={post.cover}
                  alt={post.title}
                  fill
                  sizes="(min-width: 1280px) 960px, (min-width: 1024px) 70vw, 100vw"
                  className="object-cover"
                  priority
                />
              </div>
              <div className="prose prose-neutral px-6 pb-12 pt-6 md:px-10">
                <div dangerouslySetInnerHTML={{ __html: post.content }} />
              </div>
            </article>

            <div className="rounded-3xl border border-neutral-200/70 bg-white/95 shadow-xl shadow-black/10">
              <div className="px-6 py-8 md:px-10 md:py-10">
                <Comments slug={post.slug} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {related.length > 0 ? (
        <section className="container pb-20 md:pb-24">
          <div className="mb-8 md:mb-10">
            <SectionSubtitle align="left">Related</SectionSubtitle>
            <h3 className="font-noticia text-2xl tracking-tight text-neutral-900 md:text-3xl">
              You might also like
            </h3>
          </div>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {related.map((p) => (
              <Link
                key={p.slug}
                href={`/blogs/${p.slug}`}
                className="group overflow-hidden rounded-2xl border border-neutral-200 bg-white ring-1 ring-black/5 transition-shadow hover:shadow-md"
              >
                <div className="relative aspect-[16/9] w-full overflow-hidden">
                  <Image
                    src={p.cover || "/imgs/stories.avif"}
                    alt={p.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                </div>
                <div className="p-4">
                  <div className="text-xs uppercase tracking-[0.14em] text-neutral-500">
                    {p.category || "Blog"}
                  </div>
                  <div className="mt-1.5 font-noticia text-lg leading-snug text-neutral-900 transition-colors group-hover:text-primary-600">
                    {p.title}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
