type TOCProps = {
  toc: { id: string; title: string }[];
};

export default function BlogTOC({ toc }: TOCProps) {
  return (
    <div className="text-sm">
      <h3 className="font-semibold mb-2">On This Page</h3>
      <ul className="space-y-1">
        {toc.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className="text-gray-700 hover:text-pink-600"
            >
              {item.title}
            </a>
          </li>
        ))}
      </ul>
      <div className="mt-4">
        <a href="#top" className="text-gray-500 hover:text-pink-600">
          ↑ Back to Top
        </a>
      </div>
    </div>
  );
}
