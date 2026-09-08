import { Plus } from "lucide-react";

const agents = [
  {
    name: "Influencer Agent",
    detail:
      "Build a creator shortlist, compare audience fit, and prepare outreach for review.",
  },
  {
    name: "Reddit Agent",
    detail:
      "Find relevant discussions and prepare replies that add value to the conversation.",
  },
  {
    name: "SEO Agent",
    detail:
      "Explore keyword opportunities and prepare articles, page updates, and search briefs.",
  },
  {
    name: "Writer Agent",
    detail:
      "Prepare articles, emails, and landing page copy from your shared brand brief.",
  },
  {
    name: "X (Twitter) Agent",
    detail: "Turn your ideas into post and thread drafts you can review and edit.",
  },
  {
    name: "LinkedIn Agent",
    detail:
      "Prepare professional posts that share your team's knowledge and point of view.",
  },
  {
    name: "GEO Agent",
    detail:
      "Review brand mentions in AI answers and identify content gaps to investigate.",
  },
  {
    name: "Coding Agent",
    detail: "Investigate technical SEO issues and prepare site changes for review.",
  },
  {
    name: "UGC Videos Agent",
    detail:
      "Prepare creator briefs, scripts, and video concepts for your next campaign.",
  },
  {
    name: "Meta Ads Agent",
    detail:
      "Research audiences, prepare creative tests, and review campaign performance.",
  },
  {
    name: "Google Ads Agent",
    detail:
      "Explore keywords, draft search ads, and review spend against your growth goal.",
  },
];

export default function AgentsSection() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <div className="flex flex-wrap items-center justify-between gap-6">
        <h3 className="text-2xl font-bold tracking-tight text-foreground">
          The right specialist for the work.
        </h3>
        <p className="text-xs text-muted">Explore the roles behind your agent.</p>
      </div>

      <div className="mt-6 grid gap-x-12 md:grid-cols-2">
        {agents.map((agent) => (
          <details key={agent.name} className="group border-b border-border">
            <summary className="flex cursor-pointer list-none items-center gap-3 py-4 text-[13px] font-semibold text-foreground">
              {agent.name}
              <Plus className="ml-auto h-4 w-4 text-muted transition-transform duration-200 group-open:rotate-45" />
            </summary>
            <p className="px-0 pb-5 text-xs leading-relaxed text-muted">
              {agent.detail}
            </p>
          </details>
        ))}
      </div>
    </section>
  );
}
