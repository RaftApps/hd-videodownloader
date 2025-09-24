import { AppverseFooter } from "@/components/appverse-footer";
import { SiteHeader } from "@/components/site-header";
import Link from "next/link";

const blogs = [
  { slug: "youtube-guide", title: "YouTube Guide", desc: "Master YouTube with our ultimate guide." },
  { slug: "tiktok-tips", title: "TikTok Tips", desc: "Learn how to download and grow on TikTok." },
  { slug: "instagram-reels", title: "Instagram Reels", desc: "Boost your content strategy with reels." },
];

export default function BlogIndex() {
  return (
    <>
    <SiteHeader />
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-4xl font-bold mb-8">Blog</h1>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogs.map((blog) => (
          <div
            key={blog.slug}
            className="rounded-lg border border-gray-200 p-6 shadow hover:shadow-md transition"
          >
            <h2 className="text-2xl font-semibold mb-2">
              <Link href={`/blog/${blog.slug}`} className="hover:text-pink-600">
                {blog.title}
              </Link>
            </h2>
            <p className="text-gray-600">{blog.desc}</p>
          </div>
        ))}
      </div>
    </div>
    <AppverseFooter />
    </>
  );
}
