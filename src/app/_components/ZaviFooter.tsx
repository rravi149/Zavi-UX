import { ZaviLogo } from "../dashboard/_components/Brand";

const links = [
  { label: "Pricing", href: "/pricing" },
  { label: "Blog", href: "/blog" },
  { label: "Security", href: "/security" },
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
];

export default function ZaviFooter() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-6 py-10 sm:flex-row sm:justify-between">
        <a href="#top" className="flex items-center gap-2">
          <ZaviLogo size={22} />
          <span className="text-base font-extrabold tracking-tight text-foreground">
            zavi
          </span>
        </a>

        <nav className="flex flex-wrap items-center justify-center gap-5">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-xs text-muted transition-colors duration-200 hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>
      <p className="pb-8 text-center text-[10px] text-muted">
        © 2026 Zavi Labs · Build. Run. Grow.
      </p>
    </footer>
  );
}
