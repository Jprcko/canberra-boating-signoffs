import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  cover_image: string | null;
  published_at: string | null;
  tags: string[] | null;
}

const Blog = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "Blog | ACT Boats & Licensing";
    const desc = "Latest news and tips from ACT Boats & Licensing.";
    const m = document.querySelector('meta[name="description"]');
    if (m) m.setAttribute("content", desc); else {
      const meta = document.createElement("meta");
      meta.name = "description"; meta.content = desc; document.head.appendChild(meta);
    }
    let link: HTMLLinkElement | null = document.querySelector('link[rel="canonical"]');
    if (!link) { link = document.createElement("link"); link.rel = "canonical"; document.head.appendChild(link); }
    link.href = "https://actboatsandlicensing.com.au/blog";

    (async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("id,title,slug,excerpt,cover_image,published_at,tags")
        .eq("is_published", true)
        .order("published_at", { ascending: false });
      if (!error && data) setPosts(data as Post[]);
      setLoading(false);
    })();
  }, []);

  return (
    <Layout>
      <header className="bg-white border-b">
        <div className="container-custom py-10">
          <h1 className="text-3xl font-bold text-navy">Blog</h1>
          <p className="text-gray-600 mt-2">Insights, updates, and licensing tips.</p>
        </div>
      </header>

      <main className="container-custom py-10">
        {loading ? (
          <p className="text-gray-600">Loading posts…</p>
        ) : posts.length === 0 ? (
          <p className="text-gray-600">No posts yet. Please check back soon.</p>
        ) : (
          <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <article key={post.id}>
                <Card className="h-full flex flex-col">
                  {post.cover_image && (
                    <img
                      src={post.cover_image}
                      alt={`Cover image for ${post.title}`}
                      loading="lazy"
                      className="w-full h-44 object-cover"
                    />
                  )}
                  <CardHeader>
                    <CardTitle className="text-xl text-navy">{post.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col">
                    {post.excerpt && (
                      <p className="text-gray-700 mb-4">{post.excerpt}</p>
                    )}
                    <div className="mt-auto flex items-center justify-between">
                      <Link to={`/blog/${post.slug}`}>
                        <Button variant="outline">Read more</Button>
                      </Link>
                      <div className="flex gap-2 flex-wrap">
                        {(post.tags || []).slice(0, 3).map((t) => (
                          <Badge key={t} variant="secondary">{t}</Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </article>
            ))}
          </section>
        )}
      </main>
    </Layout>
  );
};

export default Blog;