import Layout from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  cover_image: string | null;
  content: string;
  published_at: string | null;
  tags: string[] | null;
}

const BlogPost = () => {
  const { slug } = useParams();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("id,title,slug,excerpt,cover_image,content,published_at,tags")
        .eq("slug", slug)
        .maybeSingle();
      if (!error) setPost(data as Post | null);
      setLoading(false);

      const title = data?.title ? `${data.title} | ACT Boats & Licensing` : "Blog | ACT Boats & Licensing";
      document.title = title;
      const desc = data?.excerpt || "Read the latest from ACT Boats & Licensing.";
      let m = document.querySelector('meta[name="description"]');
      if (m) m.setAttribute("content", desc); else {
        const meta = document.createElement("meta"); meta.name = "description"; meta.content = desc; document.head.appendChild(meta);
      }
      let link: HTMLLinkElement | null = document.querySelector('link[rel=\"canonical\"]');
      if (!link) { link = document.createElement("link"); link.rel = "canonical"; document.head.appendChild(link); }
      link.href = `https://actboatsandlicensing.com.au/blog/${slug}`;
    })();
  }, [slug]);

  return (
    <Layout>
      <main className="container-custom py-10">
        {loading ? (
          <p className="text-gray-600">Loading…</p>
        ) : !post ? (
          <div>
            <p className="text-gray-700 mb-4">Post not found.</p>
            <Link to="/blog"><Button variant="outline">Back to Blog</Button></Link>
          </div>
        ) : (
          <article>
            <header className="mb-6">
              <h1 className="text-3xl font-bold text-navy">{post.title}</h1>
              {post.published_at && (
                <p className="text-gray-600 mt-2">{new Date(post.published_at).toLocaleDateString()}</p>
              )}
              {(post.tags || []).length > 0 && (
                <div className="mt-3 flex gap-2 flex-wrap">
                  {(post.tags || []).map((t) => (
                    <span key={t} className="text-xs px-2 py-1 rounded bg-slate-100 text-slate-700">{t}</span>
                  ))}
                </div>
              )}
            </header>

            {post.cover_image && (
              <img
                src={post.cover_image}
                alt={`Cover image for ${post.title}`}
                loading="lazy"
                className="w-full h-80 object-cover rounded-md mb-6"
              />
            )}

            <Card>
              <CardContent className="prose max-w-none py-6 whitespace-pre-wrap">
                {post.content}
              </CardContent>
            </Card>
          </article>
        )}
      </main>
    </Layout>
  );
};

export default BlogPost;