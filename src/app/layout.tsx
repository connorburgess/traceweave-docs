import type { Metadata } from "next";
import "@fontsource/ibm-plex-sans/400.css";
import "@fontsource/ibm-plex-sans/500.css";
import "@fontsource/ibm-plex-sans/600.css";
import "@fontsource/ibm-plex-sans/700.css";
import "@fontsource/ibm-plex-mono/400.css";
import "@fontsource/ibm-plex-mono/500.css";
import "@fontsource/archivo/800.css";
import { DocsMotion } from "@/components/DocsMotion";
import "./globals.css";

const SITE_DESCRIPTION =
  "Traceweave is an open specification for recognising your own work when it turns up somewhere else, and for producing evidence of the match that anyone can re-run and check.";

export const metadata: Metadata = {
  metadataBase: new URL("https://docs.traceweave.org"),
  title: {
    default: "Traceweave — Experimental Content-Recognition Specification",
    template: "%s — Traceweave",
  },
  description: SITE_DESCRIPTION,
  openGraph: {
    title: "Traceweave — Experimental Content-Recognition Specification",
    description: SITE_DESCRIPTION,
    type: "website",
    url: "https://docs.traceweave.org",
  },
  alternates: {
    canonical: "/",
  },
};

const THEME_INIT_SCRIPT = `(function(){try{var m=localStorage.getItem("traceweave-theme");if(m==="light"||m==="dark"){document.documentElement.setAttribute("data-theme",m);}}catch(e){}})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body>
        <DocsMotion />
        {children}
      </body>
    </html>
  );
}
