"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/* The quiet V2 nav. Four things and no more: the mark, two pages, one way in.
   Lives here rather than in the layout so a V2 screen can choose not to carry
   it (the start flow, for instance, wants the page to itself). */

const LINKS = [
  { href: "/v2", label: "Home" },
  { href: "/v2/meet", label: "What it does" },
  { href: "/v2/pricing", label: "Pricing" },
];

const NO_UNDERLINE = { textDecoration: "none" } as const;

export default function V2Nav() {
  const pathname = usePathname();

  return (
    <header className="topbar">
      <Link href="/v2" className="brand" style={NO_UNDERLINE}>
        <span className="dot" aria-hidden="true" />
        Zavi
      </Link>
      <nav className="topnav">
        {LINKS.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className={`navlink ${pathname === l.href ? "on" : ""}`}
          >
            {l.label}
          </Link>
        ))}
      </nav>
      <Link href="/v2/start" className="btn dark" style={NO_UNDERLINE}>
        Start
      </Link>
    </header>
  );
}
