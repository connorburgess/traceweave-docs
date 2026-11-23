import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://docs.traceweave.org"),
  title: {
    default: "Traceweave — Experimental Content-Recognition Specification",
    template: "%s — Traceweave",
  },
  description:
    "Documentation for Traceweave (0.1.0-draft.1), an open, non-commercial, independent experimental specification for recognising your own content when it reappears elsewhere and producing reproducible comparison evidence.",
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
      <body>{children}</body>
    </html>
  );
}
