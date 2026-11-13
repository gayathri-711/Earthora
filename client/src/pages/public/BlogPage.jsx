import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import api from '../../api/client';
import SectionHeading from '../../components/common/SectionHeading';
import { BLOG_POSTS } from '../../data/catalogData';

export default function BlogPage() {
  const [posts, setPosts] = useState(BLOG_POSTS);
  const [query, setQuery] = useState('');

  useEffect(() => {
    api
      .get('/blogs')
      .then(({ data }) => {
        if (Array.isArray(data.data?.blogs) && data.data.blogs.length > 0) {
          setPosts(data.data.blogs);
        }
      })
      .catch(() => {});
  }, []);

  const filtered = posts.filter(
    (p) =>
      p.title.toLowerCase().includes(query.toLowerCase()) ||
      p.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <SectionHeading
          eyebrow="Agriva Journal"
          title="Sustainable Agriculture & Field Notes"
          subtitle="Insights from our growers, soil scientists, and regional food hubs."
        />
        <div className="relative w-full sm:w-72">
          <Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-agriva-muted" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search articles..."
            className="input-field pl-9"
          />
        </div>
      </div>

      <div className="mt-10 grid gap-8 md:grid-cols-3">
        {filtered.map((post) => (
          <article key={post._id} className="card-surface flex flex-col overflow-hidden">
            <Link to={`/blog/${post.slug}`}>
              <img src={post.image} alt={post.title} className="aspect-[16/10] w-full object-cover" />
            </Link>
            <div className="flex flex-1 flex-col p-6">
              <div className="flex items-center gap-2 text-xs text-agriva-muted">
                <span className="font-semibold text-agriva-pine">{post.category}</span>
                <span>·</span>
                <span>{post.readTime || '5 min read'}</span>
              </div>
              <Link
                to={`/blog/${post.slug}`}
                className="mt-2 font-display text-xl font-semibold text-agriva-ink hover:text-agriva-forest"
              >
                {post.title}
              </Link>
              <p className="mt-2 flex-1 text-sm text-agriva-muted">{post.excerpt}</p>
              <div className="mt-4 flex items-center justify-between border-t border-agriva-line pt-3 text-xs text-agriva-muted">
                <span>By {post.author}</span>
                <Link to={`/blog/${post.slug}`} className="font-semibold text-agriva-forest hover:underline">
                  Read More →
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

