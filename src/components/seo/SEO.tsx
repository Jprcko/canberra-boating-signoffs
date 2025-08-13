import { useEffect } from "react";

interface SEOProps {
  title: string;
  description?: string;
  canonicalPath?: string;
  noindex?: boolean;
  image?: string;
}

const BASE_URL = "https://actboatsandlicensing.com.au";

const ensureMeta = (name: string, content: string) => {
  let m = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null;
  if (!m) {
    m = document.createElement("meta");
    m.name = name;
    document.head.appendChild(m);
  }
  m.setAttribute("content", content);
};

const ensureOG = (property: string, content: string) => {
  let m = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement | null;
  if (!m) {
    m = document.createElement("meta");
    m.setAttribute("property", property);
    document.head.appendChild(m);
  }
  m.setAttribute("content", content);
};

const ensureCanonical = (href: string) => {
  let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!link) {
    link = document.createElement("link");
    link.rel = "canonical";
    document.head.appendChild(link);
  }
  link.href = href;
};

export default function SEO({ title, description, canonicalPath, noindex, image }: SEOProps) {
  useEffect(() => {
    // Title
    document.title = title;

    // Description
    if (description) ensureMeta("description", description);

    // Robots
    if (noindex) {
      ensureMeta("robots", "noindex, nofollow");
    } else {
      // If a robots meta exists from another page, normalize to index,follow
      const robots = document.querySelector('meta[name="robots"]');
      if (robots) robots.setAttribute("content", "index, follow");
    }

    // Canonical
    if (canonicalPath) {
      const url = canonicalPath.startsWith("http") ? canonicalPath : `${BASE_URL}${canonicalPath}`;
      ensureCanonical(url);
      ensureOG("og:url", url);
    }

    // Open Graph basics
    ensureOG("og:title", title);
    if (description) ensureOG("og:description", description);
    if (image) ensureOG("og:image", image);
  }, [title, description, canonicalPath, noindex, image]);

  return null;
}
