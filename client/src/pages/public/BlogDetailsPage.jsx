import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import api from '../../api/client';
import { BLOG_POSTS } from '../../data/catalogData';

export default function BlogDetailsPage() {
  const { slug } = useParams();
  const [post, setPost] = useState(() => BLOG_POSTS.find((b) => b.slug === slug) || BLOG_POSTS[0]);

  useEffect(() => {
    api
      .get(`/blogs/${slug}`)
      .then(({ data }) => {
        if (data.data?.blog) setPost(data.data.blog);
      })
      .catch(() => {
        const local = BLOG_POSTS.find((b) => b.slug === slug);
        if (local) setPost(local);
      });
  }, [slug]);

  if (!post) return null;

  return (
    <article className="mx-auto max-w-4xl px-4 py-14 sm:px-6 lg:px-8">
      <Link to="/blog" className="inline-flex items-center gap-1.5 text-sm font-semibold text-agriva-forest hover:underline">
        <ArrowLeft className="h-4 w-4" />
        Back to Agriculture Journal
      </Link>

      <div className="mt-6 space-y-4">
        <span className="inline-block rounded-full bg-agriva-mint/60 px-3 py-1 text-xs font-semibold text-agriva-forest">
          {post.category}
        </span>
        <h1 className="font-display text-3xl font-semibold text-agriva-ink sm:text-4xl">
          {post.title}
        </h1>
        <p className="text-sm text-agriva-muted">
          By <strong className="text-agriva-ink">{post.author}</strong> · {post.publishedAt?.slice(0, 10) || 'Recent'} · {post.readTime || '5 min read'}
        </p>
      </div>

      <img
        src={post.image}
        alt={post.title}
        className="mt-8 aspect-[16/9] w-full rounded-2xl border border-agriva-line object-cover"
      />

      <div className="mt-8 space-y-5 text-base leading-relaxed text-agriva-ink">
        <p className="font-medium text-agriva-pine">{post.excerpt}</p>
        <p>{post.content}</p>
      </div>
    </article>
  );
}

