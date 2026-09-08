import {
  SiGoogleads,
  SiGooglesearchconsole,
  SiInstagram,
  SiSanity,
  SiTelegram,
  SiTiktok,
  SiWebflow,
  SiWhatsapp,
  SiWix,
  SiX,
} from "react-icons/si";
import { FaGithub, FaLinkedin, FaSlack } from "react-icons/fa6";
import { BarChart3, Globe } from "lucide-react";

const integrations = [
  { name: "WordPress", desc: "Website content", icon: Globe },
  { name: "Webflow", desc: "Website content", icon: SiWebflow },
  { name: "Framer", desc: "Website content", icon: Globe },
  { name: "Wix", desc: "Website content", icon: SiWix },
  { name: "Sanity", desc: "Content management", icon: SiSanity },
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
  { name: "Google Ads", desc: "Paid campaigns", icon: SiGoogleads },
];

export default function IntegrationsSection() {
  return (
    <section className="border-t border-border">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="text-3xl leading-tight font-bold tracking-tight text-foreground sm:text-4xl">
          Context comes in.
          <br />
          Useful work goes out.
        </h2>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted">
          Bring your tools into the workflow, so your next step starts with
          the information your team already has.
        </p>

        <div className="mt-8 grid grid-cols-2 gap-x-6 sm:grid-cols-3 md:grid-cols-5">
          {integrations.map((item) => (
            <div
              key={item.name}
              className="flex items-center gap-3 border-b border-border py-4"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-surface text-foreground">
                <item.icon className="h-4 w-4" />
              </span>
              <strong className="text-[11px] leading-snug text-foreground">
                {item.name}
              </strong>
            </div>
          ))}
        </div>

        <p className="mt-5 text-[11px] leading-relaxed text-muted">
          Slack and Microsoft Teams are available. Other tools shown are
          integration examples; check your workspace for availability.
        </p>
      </div>
    </section>
  );
}
