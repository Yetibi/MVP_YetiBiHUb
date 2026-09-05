import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/api/", "/no-medir"] },
    sitemap: "https://yetibi.com/sitemap.xml",
  };
}
