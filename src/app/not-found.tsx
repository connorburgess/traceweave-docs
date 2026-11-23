import Link from "next/link";
import { DocsShell } from "@/components/DocsShell";
import { getSearchIndex } from "@/lib/docs";

export default function NotFoundPage() {
  const searchIndex = getSearchIndex();

  return (
    <DocsShell searchIndex={searchIndex}>
      <article className="prose">
        <h1>Page not found</h1>
        <p>
          The requested documentation page does not exist in this static build.
        </p>
        <p>
          <Link href="/">Return to the Traceweave home page</Link> or browse{" "}
          <Link href="/docs/concepts">Start here &amp; concepts</Link>.
        </p>
      </article>
    </DocsShell>
  );
}
