export interface NavItem {
  title: string;
  href: string;
  slug: string;
  section: string;
}

export interface NavSection {
  title: string;
  items: NavItem[];
}

export const NAV_SECTIONS: NavSection[] = [
  {
    title: "Overview",
    items: [
      { title: "Home", href: "/", slug: "", section: "Overview" },
      {
        title: "Start here & concepts",
        href: "/docs/concepts",
        slug: "concepts",
        section: "Overview",
      },
      {
        title: "How it works",
        href: "/docs/how-it-works",
        slug: "how-it-works",
        section: "Overview",
      },
    ],
  },
  {
    title: "Specification",
    items: [
      {
        title: "Profiles",
        href: "/docs/profiles",
        slug: "profiles",
        section: "Specification",
      },
      {
        title: "Evidence & provenance",
        href: "/docs/evidence-and-provenance",
        slug: "evidence-and-provenance",
        section: "Specification",
      },
      {
        title: "Embedding & Shelf checklist",
        href: "/docs/embedding-and-shelf",
        slug: "embedding-and-shelf",
        section: "Specification",
      },
      {
        title: "Limits & threat model",
        href: "/docs/limits-and-threat-model",
        slug: "limits-and-threat-model",
        section: "Specification",
      },
    ],
  },
  {
    title: "Research & experiments",
    items: [
      {
        title: "Research overview",
        href: "/docs/research",
        slug: "research",
        section: "Research & experiments",
      },
      {
        title: "Synthetic code carriers & census",
        href: "/docs/research/synthetic-carriers",
        slug: "research/synthetic-carriers",
        section: "Research & experiments",
      },
      {
        title: "Lane 06: Practical code carriers",
        href: "/docs/research/lane-06-code-carriers",
        slug: "research/lane-06-code-carriers",
        section: "Research & experiments",
      },
      {
        title: "Lane 07: Fragment recovery",
        href: "/docs/research/lane-07-fragment-recovery",
        slug: "research/lane-07-fragment-recovery",
        section: "Research & experiments",
      },
      {
        title: "Lane 08: Cross-media architecture",
        href: "/docs/research/lane-08-cross-media",
        slug: "research/lane-08-cross-media",
        section: "Research & experiments",
      },
      {
        title: "Lane 09: Text profile evidence",
        href: "/docs/research/lane-09-text-profile",
        slug: "research/lane-09-text-profile",
        section: "Research & experiments",
      },
      {
        title: "Lane 10: Image profile evidence",
        href: "/docs/research/lane-10-image-profile",
        slug: "research/lane-10-image-profile",
        section: "Research & experiments",
      },
      {
        title: "Lane 11: External feedback audit",
        href: "/docs/research/lane-11-external-feedback",
        slug: "research/lane-11-external-feedback",
        section: "Research & experiments",
      },
      {
        title: "Image fingerprint run (e-img-f-2)",
        href: "/docs/research/image-fingerprint-study",
        slug: "research/image-fingerprint-study",
        section: "Research & experiments",
      },
      {
        title: "Image mark study (e-img-m-2)",
        href: "/docs/research/image-mark-study",
        slug: "research/image-mark-study",
        section: "Research & experiments",
      },
      {
        title: "M3 evaluation protocol",
        href: "/docs/research/evaluation-protocol",
        slug: "research/evaluation-protocol",
        section: "Research & experiments",
      },
    ],
  },
  {
    title: "Project",
    items: [
      {
        title: "Roadmap & status",
        href: "/docs/roadmap",
        slug: "roadmap",
        section: "Project",
      },
      {
        title: "Prior art",
        href: "/docs/prior-art",
        slug: "prior-art",
        section: "Project",
      },
      {
        title: "FAQ",
        href: "/docs/faq",
        slug: "faq",
        section: "Project",
      },
      {
        title: "Governance",
        href: "/docs/governance",
        slug: "governance",
        section: "Project",
      },
      {
        title: "Contributing & licences",
        href: "/docs/contributing",
        slug: "contributing",
        section: "Project",
      },
      {
        title: "Source index",
        href: "/docs/sources",
        slug: "sources",
        section: "Project",
      },
    ],
  },
];

export const FLAT_NAV_ITEMS: NavItem[] = NAV_SECTIONS.flatMap((s) => s.items);

export function getPrevNext(currentHref: string): {
  prev: NavItem | null;
  next: NavItem | null;
} {
  const index = FLAT_NAV_ITEMS.findIndex((item) => item.href === currentHref);
  if (index === -1) {
    return { prev: null, next: null };
  }
  return {
    prev: index > 0 ? FLAT_NAV_ITEMS[index - 1] : null,
    next: index < FLAT_NAV_ITEMS.length - 1 ? FLAT_NAV_ITEMS[index + 1] : null,
  };
}

export function getBreadcrumbs(
  currentHref: string
): Array<{ label: string; href: string }> {
  if (currentHref === "/") {
    return [{ label: "Home", href: "/" }];
  }
  const item = FLAT_NAV_ITEMS.find((i) => i.href === currentHref);
  if (!item) {
    return [{ label: "Home", href: "/" }];
  }
  const crumbs: Array<{ label: string; href: string }> = [
    { label: "Home", href: "/" },
  ];
  if (item.slug.startsWith("research/") && item.slug !== "research") {
    crumbs.push({ label: "Research & experiments", href: "/docs/research" });
  } else {
    crumbs.push({ label: item.section, href: item.href });
  }
  if (crumbs[crumbs.length - 1].href !== item.href) {
    crumbs.push({ label: item.title, href: item.href });
  } else {
    crumbs[crumbs.length - 1] = { label: item.title, href: item.href };
  }
  return crumbs;
}
