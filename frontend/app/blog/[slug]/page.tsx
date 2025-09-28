import BlogLayout from "@/components/blog/BlogLayout";
import BlogContent from "@/components/blog/BlogContent";
import { AppverseFooter } from "@/components/footer";
import { SiteHeader } from "@/components/site-header";

export default function BlogPost({ params }: { params: { slug: string } }) {
  // Table of contents for this post (can be generated dynamically later)
  const toc = [
    { id: "intro", title: "Introduction" },
    { id: "essentials", title: "Essentials" },
    { id: "ideas", title: "Video Ideas" },
  ];

  return (
    <>
    <SiteHeader />
    <BlogLayout toc={toc}>
      <BlogContent slug={params.slug} />
    </BlogLayout>
    <AppverseFooter />
    </>
  );
}
