import NewBlogForm from "@/components/admin/NewBlogForm";
import { getSessionWithUser } from "@/lib/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { FaFeather } from "react-icons/fa";

export const metadata = {
  title: "Add Blog | Admin",
};

export default async function AddBlogPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("session_token")?.value || null;
  const sess = await getSessionWithUser(token);
  if (!sess || (sess.user?.role !== "admin" && sess.user?.role !== "editor")) {
    redirect("/admin/login");
  }

  return (
    <div className="space-y-6">
      <header className="rounded-3xl border border-neutral-200 bg-white/90 p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-50 text-primary-600 shadow-inner">
              <FaFeather className="text-xl" />
            </span>
            <div>
              <h1 className="font-noticia text-3xl tracking-tight text-neutral-900">
                New post
              </h1>
              <p className="mt-1 text-sm text-neutral-500">
                Add the article details, upload a cover image, and publish when you are ready.
              </p>
            </div>
          </div>
          <div className="rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-2 text-xs text-neutral-500">
            Changes save only after you submit.
          </div>
        </div>
      </header>

      <NewBlogForm />
    </div>
  );
}
