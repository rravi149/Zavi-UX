"use client";

import { useState } from "react";
import { ChevronDown, Menu, X } from "lucide-react";
import { ZaviLogo } from "../dashboard/_components/Brand";
import {
  SiGoogleads,
  SiGooglesearchconsole,
  SiInstagram,
  SiReddit,
  SiTelegram,
  SiTiktok,
  SiWebflow,
  SiWhatsapp,
  SiWix,
  SiX,
} from "react-icons/si";
import { FaGithub, FaLinkedin, FaSlack } from "react-icons/fa6";
import {
  BarChart3,
  Bot,
  Code2,
  Megaphone,
  PenLine,
  Sparkles,
  Video,
} from "lucide-react";

const agents = [
  { name: "Influencer Agent", desc: "Find creators who fit your audience.", icon: Video },
  { name: "Reddit Agent", desc: "Find threads and draft useful replies.", icon: SiReddit },
  { name: "SEO Agent", desc: "Find search gaps and draft pages.", icon: SiGooglesearchconsole },
  { name: "Writer Agent", desc: "Write in your brand voice.", icon: PenLine },
  { name: "X (Twitter) Agent", desc: "Prepare posts and threads.", icon: SiX },
  { name: "LinkedIn Agent", desc: "Turn expertise into useful posts.", icon: FaLinkedin },
  { name: "GEO Agent", desc: "Explore your visibility in AI search.", icon: Sparkles },
  { name: "Coding Agent", desc: "Prepare technical improvements.", icon: Code2 },
  { name: "UGC Videos Agent", desc: "Plan videos for social and ads.", icon: Video },
  { name: "Meta Ads Agent", desc: "Plan and improve paid campaigns.", icon: Megaphone },
  { name: "Google Ads Agent", desc: "Reach people searching for you.", icon: SiGoogleads },
  { name: "Automation Agent", desc: "Coordinate the rest of the crew.", icon: Bot },
];

const integrations = [
  { name: "WordPress", desc: "Website content" },
  { name: "Webflow", desc: "Website content", icon: SiWebflow },
  { name: "Framer", desc: "Website content" },
  { name: "Wix", desc: "Website content", icon: SiWix },
  { name: "Sanity", desc: "Content management" },
  { name: "Google Search Console", desc: "Search performance", icon: SiGooglesearchconsole },
  { name: "Google Analytics", desc: "Traffic and conversions", icon: BarChart3 },
  { name: "GitHub", desc: "Code and site changes", icon: FaGithub },
  { name: "LinkedIn", desc: "Professional content", icon: FaLinkedin },
  { name: "X (Twitter)", desc: "Posts and threads", icon: SiX },
  { name: "WhatsApp", desc: "Chat and updates", icon: SiWhatsapp },
  { name: "Telegram", desc: "Chat and updates", icon: SiTelegram },
  { name: "TikTok", desc: "Short videos", icon: SiTiktok },
  { name: "Instagram", desc: "Social content", icon: SiInstagram },
  { name: "Slack", desc: "Team communication", icon: FaSlack },
];

const useCases = [
  { name: "B2B SaaS", desc: "Build demand with search and content." },
  { name: "Startups", desc: "Plan the work to reach your first users." },
  { name: "Ecommerce", desc: "Connect product content, creators, and ads." },
  { name: "Digital Agencies", desc: "Organize growth work for each client." },
  { name: "Professional Services", desc: "Turn your expertise into useful content." },
  { name: "Small Business", desc: "Build a focused marketing plan." },
  { name: "Real Estate", desc: "Prepare listing content and local campaigns." },
  { name: "Financial Advisors", desc: "Draft educational content for expert review." },
  { name: "Healthcare", desc: "Prepare service content for expert review." },
  { name: "Recruiters", desc: "Build a brand candidates can understand." },
  { name: "Restaurants", desc: "Plan local search and social content." },
  { name: "Law Firms", desc: "Draft practice-area content for legal review." },
];

function MegaMenu({
  label,
  open,
  onToggle,
  columns = 3,
  items,
}: {
  label: string;
  open: boolean;
  onToggle: () => void;
  columns?: number;
  items: { name: string; desc: string; icon?: React.ComponentType<{ className?: string }> }[];
}) {
  return (
    <div className="relative">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="flex cursor-pointer items-center gap-1.5 text-[13px] font-semibold text-foreground"
      >
        {label}
        <ChevronDown
          className={`h-3.5 w-3.5 text-muted transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div
          className="absolute top-full left-1/2 z-50 mt-4 w-[640px] -translate-x-1/2 rounded-3xl border border-border bg-white p-3 shadow-xl"
          style={{ maxWidth: "min(640px, 90vw)" }}
        >
          <div
            className="grid gap-1"
            style={{ gridTemplateColumns: `repeat(${columns}, minmax(0,1fr))` }}
          >
            {items.map((item) => {
              const Icon = item.icon;
              return (
                <a
                  key={item.name}
                  href="#"
                  className="flex items-start gap-3 rounded-2xl p-2.5 transition-colors duration-150 hover:bg-surface"
                >
                  {Icon && (
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-surface text-foreground">
                      <Icon className="h-4 w-4" />
                    </span>
                  )}
                  <span className="min-w-0">
                    <span className="block text-[13px] font-semibold text-foreground">
                      {item.name}
                    </span>
                    <span className="mt-0.5 block text-[11px] leading-snug text-muted">
                      {item.desc}
                    </span>
                  </span>
                </a>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default function ZaviNavbar() {
  const [openMenu, setOpenMenu] = useState<"agents" | "integrations" | "cases" | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  function toggle(menu: "agents" | "integrations" | "cases") {
    setOpenMenu((current) => (current === menu ? null : menu));
  }

  return (
    <header
      className="sticky top-0 z-50"
      onMouseLeave={() => setOpenMenu(null)}
    >
      <div className="mx-auto max-w-6xl px-4 pt-4">
        <div className="flex items-center justify-between gap-6 rounded-full border border-border bg-white/95 px-5 py-2.5 shadow-sm backdrop-blur-md">
          <a href="#top" aria-label="Zavi home" className="flex items-center gap-2">
            <ZaviLogo size={24} />
            <span className="text-lg font-extrabold tracking-tight text-foreground">
              zavi
            </span>
          </a>

          <nav className="hidden items-center gap-6 md:flex">
            <MegaMenu
              label="Agents"
              open={openMenu === "agents"}
              onToggle={() => toggle("agents")}
              columns={3}
              items={agents}
            />
            <MegaMenu
              label="Integrations"
              open={openMenu === "integrations"}
              onToggle={() => toggle("integrations")}
              columns={3}
              items={integrations}
            />
            <MegaMenu
              label="Use Cases"
              open={openMenu === "cases"}
              onToggle={() => toggle("cases")}
              columns={2}
              items={useCases}
            />
            <a href="/blog" className="text-[13px] font-semibold text-foreground">
              Blog
            </a>
            <a href="/pricing" className="text-[13px] font-semibold text-foreground">
              Pricing
            </a>
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            <a
              href="/dashboard"
              className="text-[13px] font-semibold text-muted transition-colors duration-200 hover:text-foreground"
            >
              Sign in
            </a>
            <a
              href="/start"
              className="cursor-pointer rounded-full bg-primary px-5 py-2.5 text-[13px] font-bold text-white transition-colors duration-200 hover:bg-secondary"
            >
              Get started
            </a>
          </div>

          <button
            type="button"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            onClick={() => setMobileOpen((v) => !v)}
            className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full text-foreground md:hidden"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {mobileOpen && (
          <div className="mt-2 rounded-3xl border border-border bg-white p-4 shadow-lg md:hidden">
            <nav className="flex flex-col gap-3">
              <a href="/blog" className="text-sm font-semibold text-foreground">
                Blog
              </a>
              <a href="/pricing" className="text-sm font-semibold text-foreground">
                Pricing
              </a>
              <a href="/dashboard" className="text-sm font-semibold text-foreground">
                Sign in
              </a>
              <a
                href="/start"
                className="rounded-full bg-primary px-4 py-2 text-center text-sm font-bold text-white"
              >
                Get started
              </a>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
