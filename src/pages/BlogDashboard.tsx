import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useMemo, useState } from "react";

interface Post {
  id?: string;
  title: string;
  slug: string;
  excerpt: string;
  cover_image: string;
  content: string;
  tags: string[];
  is_published: boolean;
  published_at: string | null;
}

const slugify = (s: string) =>
  s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

const emptyPost: Post = {
  title: "",
  slug: "",
  excerpt: "",
  cover_image: "",
  content: "",
  tags: [],
  is_published: false,
  published_at: null,
};

const BlogDashboard = () => {
  const { toast } = useToast();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Post>(emptyPost);
  const [saving, setSaving] = useState(false);

  const tagsString = useMemo(() => editing.tags.join(", "), [editing.tags]);

  useEffect(() => {
    document.title = "Blog Dashboard | ACT Boats & Licensing";
    (async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("id,title,slug,excerpt,cover_image,content,is_published,published_at,tags")
        .order("created_at", { ascending: false });
      if (error) {
        toast({ title: "Failed to load posts", description: error.message, variant: "destructive" });
      } else setPosts((data as Post[]) || []);
      setLoading(false);
    })();
  }, [toast]);

  const resetForm = () => setEditing(emptyPost);

  const onEdit = (p: Post) => setEditing({ ...p, tags: p.tags || [] });

  const onDelete = async (id?: string) => {
    if (!id) return;
    if (!confirm("Delete this post? This cannot be undone.")) return;
    const { error } = await supabase.from("blog_posts").delete().eq("id", id);
    if (error) return toast({ title: "Delete failed", description: error.message, variant: "destructive" });
    setPosts((prev) => prev.filter((p) => p.id !== id));
    if (editing.id === id) resetForm();
    toast({ title: "Post deleted" });
  };

  const onSave = async () => {
    setSaving(true);
    try {
      let payload: Post = { ...editing } as Post;
      if (!payload.title.trim()) throw new Error("Title is required");
      if (!payload.slug.trim()) payload.slug = slugify(payload.title);
      payload.tags = (tagsString || "")
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);
      if (payload.is_published && !payload.published_at) {
        payload.published_at = new Date().toISOString();
      }
      if (!payload.is_published) payload.published_at = null;

      if (payload.id) {
        const { data, error } = await supabase
          .from("blog_posts")
          .update({
            title: payload.title,
            slug: payload.slug,
            excerpt: payload.excerpt,
            cover_image: payload.cover_image,
            content: payload.content,
            tags: payload.tags,
            is_published: payload.is_published,
            published_at: payload.published_at,
          })
          .eq("id", payload.id)
          .select()
          .maybeSingle();
        if (error) throw error;
        setPosts((prev) => prev.map((p) => (p.id === payload.id ? ({ ...(data as Post) }) : p)));
        setEditing(data as Post);
        toast({ title: "Post updated" });
      } else {
        const { data, error } = await supabase
          .from("blog_posts")
          .insert({
            title: payload.title,
            slug: payload.slug,
            excerpt: payload.excerpt,
            cover_image: payload.cover_image,
            content: payload.content,
            tags: payload.tags,
            is_published: payload.is_published,
            published_at: payload.published_at,
          })
          .select()
          .maybeSingle();
        if (error) throw error;
        setPosts((prev) => [data as Post, ...prev]);
        setEditing(data as Post);
        toast({ title: "Post created" });
      }
    } catch (e: any) {
      toast({ title: "Save failed", description: e.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Layout>
      <div className="container-custom py-8">
        <h1 className="text-3xl font-bold text-navy mb-6">Blog Dashboard</h1>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Posts</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p className="text-gray-600">Loading…</p>
              ) : posts.length === 0 ? (
                <p className="text-gray-600">No posts yet.</p>
              ) : (
                <ul className="divide-y">
                  {posts.map((p) => (
                    <li key={p.id} className="py-3 flex items-center justify-between">
                      <div>
                        <p className="font-medium text-navy">{p.title}</p>
                        <p className="text-sm text-gray-600">/{p.slug}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" onClick={() => onEdit(p)}>Edit</Button>
                        <Button variant="destructive" onClick={() => onDelete(p.id)}>Delete</Button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{editing.id ? "Edit Post" : "New Post"}</CardTitle>
                <Button variant="outline" onClick={resetForm}>New</Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">Slug</Label>
                <Input id="slug" value={editing.slug} onChange={(e) => setEditing({ ...editing, slug: e.target.value })} placeholder="auto-generated from title if empty" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="excerpt">Excerpt</Label>
                <Textarea id="excerpt" value={editing.excerpt} onChange={(e) => setEditing({ ...editing, excerpt: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cover">Cover Image URL</Label>
                <Input id="cover" value={editing.cover_image} onChange={(e) => setEditing({ ...editing, cover_image: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="content">Content (Markdown supported later)</Label>
                <Textarea id="content" className="min-h-[200px]" value={editing.content} onChange={(e) => setEditing({ ...editing, content: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tags">Tags (comma separated)</Label>
                <Input id="tags" value={tagsString} onChange={(e) => setEditing({ ...editing, tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean) })} />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Switch id="published" checked={editing.is_published} onCheckedChange={(v) => setEditing({ ...editing, is_published: v })} />
                  <Label htmlFor="published">Published</Label>
                </div>
                <Button onClick={onSave} disabled={saving}>{saving ? "Saving…" : "Save"}</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default BlogDashboard;