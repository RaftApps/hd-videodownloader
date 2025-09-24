import BlogSidebar from "./BlogSidebar";
import BlogTOC from "./BlogTOC";

export default function BlogLayout({
  children,
  toc,
}: {
  children: React.ReactNode;
  toc?: { id: string; title: string }[];
}) {
  return (
    <div className="container mx-auto grid grid-cols-1 md:grid-cols-12 gap-6 py-10">
      {/* Left Sidebar */}
      <aside className="hidden md:block md:col-span-2 border-r border-gray-200 pr-4">
        <BlogSidebar />
      </aside>

      {/* Main Content */}
      <main className="col-span-12 md:col-span-7 prose prose-lg max-w-none">
        {children}
      </main>

      {/* Right Sidebar (TOC) */}
      <aside className="hidden lg:block lg:col-span-3 pl-4 border-l border-gray-200">
        <BlogTOC toc={toc || []} />
      </aside>
    </div>
  );
}
