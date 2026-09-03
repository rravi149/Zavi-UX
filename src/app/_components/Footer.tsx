import { LayoutGrid } from "lucide-react";

const columns = [
  {
    title: "Product",
    links: ["Gallery", "Features", "Pricing", "Changelog"],
  },
  {
    title: "Resources",
    links: ["Documentation", "Guides", "Figma files", "API"],
  },
  {
    title: "Company",
    links: ["About", "Blog", "Careers", "Contact"],
  },
  {
    title: "Legal",
    links: ["Privacy", "Terms", "License"],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-border px-4 pt-16 pb-8">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-10 lg:grid-cols-[1.5fr_repeat(4,1fr)]">
          <div>
            <a href="#top" className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white">
                <LayoutGrid className="h-4 w-4" strokeWidth={2.5} />
              </span>
              <span className="text-lg font-bold tracking-tight text-foreground">
                Zavi
              </span>
            </a>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted">
              A curated gallery of dashboard templates and UI kits, ready to
              customize and ship.
            </p>
            <div className="mt-6 flex items-center gap-4">
              {["Twitter", "GitHub", "LinkedIn"].map((label) => (
                <a
                  key={label}
                  href="#"
                  className="cursor-pointer text-sm font-medium text-muted transition-colors duration-200 hover:text-foreground"
                >
                  {label}
                </a>
              ))}
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="text-sm font-semibold text-foreground">
                {col.title}
              </h4>
              <ul className="mt-4 space-y-3">
                {col.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="cursor-pointer text-sm text-muted transition-colors duration-200 hover:text-foreground"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 sm:flex-row">
          <p className="text-xs text-muted">
            © {new Date().getFullYear()} Zavi. All rights reserved.
          </p>
          <p className="text-xs text-muted">
            Made for teams who&apos;d rather design than start from scratch.
          </p>
        </div>
      </div>
    </footer>
  );
}
