export default function BlogContent({ slug }: { slug: string }) {
  if (slug === "youtube-guide") {
    return (
      <article>
        <h1 id="intro">YouTube Guide</h1>
        <p>Welcome to your ultimate YouTube guide. 🚀</p>

        <h2 id="essentials">Discover the Essentials</h2>
        <p>Learn how to plan, edit, and optimize your videos...</p>

        <h2 id="ideas">Video & Channel Ideas</h2>
        <p>From tutorials to vlogs, here are creative ideas...</p>
      </article>
    );
  }

  return (
    <article>
      <h1>Coming Soon</h1>
      <p>More guides will be added soon for {slug}!</p>
    </article>
  );
}
