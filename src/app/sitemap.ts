import type { MetadataRoute } from "next";
import { FLAT_NAV_ITEMS } from "@/lib/navigation";

const BASE_URL = "https://docs.traceweave.org";

export default function sitemap(): MetadataRoute.Sitemap {
  return FLAT_NAV_ITEMS.map((item) => ({
    url: item.href === "/" ? `${BASE_URL}/` : `${BASE_URL}${item.href}`,
    changeFrequency: "weekly",
    priority: item.href === "/" ? 1.0 : 0.7,
  }));
}
