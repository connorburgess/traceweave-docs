import type { Metadata } from "next";
import Image from "next/image";
import { notFound, redirect } from "next/navigation";
import { DocsShell } from "@/components/DocsShell";
import { WinnowingDiagram } from "@/components/WinnowingDiagram";
import { getAllDocSlugs, getDocBySlug, getSearchIndex } from "@/lib/docs";

interface PageProps {
  params: Promise<{ slug?: string[] }>;
}

export function generateStaticParams(): Array<{ slug: string[] }> {
  return getAllDocSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  if (!slug || slug.length === 0) {
    return { title: "Documentation" };
  }
  const doc = getDocBySlug(slug);
  if (!doc) {
    return { title: "Page not found" };
  }
  return {
    title: doc.title,
    description: doc.description,
    alternates: {
      canonical: doc.href,
    },
  };
}

export default async function DocCatchAllPage({ params }: PageProps) {
  const { slug } = await params;
  if (!slug || slug.length === 0) {
    redirect("/docs/concepts");
  }

  const doc = getDocBySlug(slug);
  if (!doc) {
    notFound();
  }

  const searchIndex = getSearchIndex();

  return (
    <DocsShell headings={doc.headings} searchIndex={searchIndex}>
      <article>
        <header className="doc-header">
          <h1 className="doc-title">{doc.title}</h1>
          {doc.description && (
            <p className="doc-description">{doc.description}</p>
          )}
          {doc.status && <div className="doc-status-badge">{doc.status}</div>}
        </header>

        {doc.showWinnowingDiagram && <WinnowingDiagram />}

        <div
          className="prose"
          dangerouslySetInnerHTML={{ __html: doc.html }}
        />

        {doc.showMaintainerLine && (
          <p className="maintainer-line">
            Maintained by{" "}
            <a
              href="https://seatbeltlabs.com"
              rel="noopener noreferrer"
              className="brand-link"
            >
              <Image
                src="/brand/seatbelt-labs-mark.svg"
                alt=""
                width={20}
                height={20}
                className="brand-mark"
              />
              <span>Seatbelt Labs</span>
            </a>
            .
          </p>
        )}
      </article>
    </DocsShell>
  );
}
