"use client";

/* ============================================================
   Upgrade, in product. Ported from parts/50-commerce.js SCREENS.upgrade.

   The two things that send a founder here: a locked channel, or an empty
   wallet. Both are read from real state, so the screen changes when the state
   does. What the next tier will NOT do carries the same weight as what it adds,
   because it is the same size.
   ============================================================ */

import { Blind, Btn, Chip, Inert, Row, Section } from "../../_components/kit";
import {
  CHANNELS,
  CHANNEL_CAP_30D,
  CHANNEL_HOLD,
  CONNECTORS,
  FREE_DAILY,
  TIERS,
  connState,
  money,
  n,
  nextTier,
  tierSpec,
  type TabId,
  type TabProps,
  type TierSlug,
} from "../state";

export function UpgradeTab({ state, setState, toast, go }: TabProps) {
  const cur = tierSpec(state.tier);
  const next = nextTier(state.tier);
  const left = state.creditsDay + state.creditsMonth;
  const pool = Math.max(1, FREE_DAILY + cur.month);
  const pct = Math.max(0, Math.min(100, Math.round((left / pool) * 100)));
  const broke = left < CHANNEL_HOLD;

  const locked = CHANNELS.filter((c) => c.tier === "pro" && state.tier !== "pro");
  const unlinked = CONNECTORS.filter((c) => connState(state, c.key) !== "connected").length;

  /* Where "Back to where I was" goes: the last tab that was not this one. */
  function backTarget(): TabId {
    for (let i = state.log.length - 1; i >= 0; i -= 1) {
      if (state.log[i] !== "upgrade") return state.log[i];
    }
    return "home";
  }

  function pick(slug: TierSlug) {
    const t = tierSpec(slug);
    const was = state.tier;
    setState((s) => ({ ...s, tier: t.slug, creditsMonth: t.month, creditsDay: FREE_DAILY }));
    toast(
      was === t.slug
        ? `Already on ${t.name}`
        : `Now on ${t.name}. ${
            t.month ? `${n(t.month)} credits a month` : "No monthly pool"
          }, plus ${n(FREE_DAILY)} a day.`,
    );
    go(backTarget());
  }

  return (
    <div>
      <p className="kicker">Upgrade</p>
      <h1 className="h1">You are on {cur.name}.</h1>
      <p className="lede">
        {broke
          ? "You ran out of credits mid-run."
          : "Here is what your plan covers, what the next one adds, and what neither of them does."}{" "}
        Picking a tier here changes your credits immediately and drops you back where you were.
      </p>

      <div className="d-pick">
        {TIERS.map((t) => (
          <div className={t.slug === state.tier ? "cur" : ""} key={t.slug}>
            <div className="nm">{t.name}</div>
            <div className="pr mono">
              {t.usd === 0 ? "$0 / mo" : `${money(t.usd)} / mo`} ·{" "}
              {t.month ? `${n(t.month)} cr` : "no pool"}
            </div>
            {t.slug === state.tier ? (
              <Chip kind="on">current</Chip>
            ) : (
              <Btn
                kind={next && t.slug === next.slug ? "dark" : undefined}
                sm
                onClick={() => pick(t.slug)}
              >
                {t.usd > cur.usd ? "Upgrade" : "Move down"}
              </Btn>
            )}
          </div>
        ))}
      </div>

      <Section
        num="00"
        label="Why you are here"
        framing="The two things that send a founder to this screen: a locked channel, or an empty wallet."
      >
        <Row
          title={
            broke
              ? "You do not have the credits for one more channel run"
              : `You have credits for ${Math.floor(left / CHANNEL_HOLD)} more channel runs`
          }
          meta={`${n(left)} credits left`}
          open={broke}
          sub={
            broke
              ? "This is the wall the launch cohort hits first."
              : "Reserve is held at dispatch and the unused part comes back at settle."
          }
          src="apps/backend/src/services/agents/credits.ts:118 DEFAULT_RESERVE_ESTIMATE_CREDITS = 340"
        >
          <p>
            A channel run holds {n(CHANNEL_HOLD)} credits at dispatch. You are holding{" "}
            {n(state.creditsDay)} from today&rsquo;s grant and {n(state.creditsMonth)} from the
            monthly pool.
          </p>
          <div className={`d-bar ${broke ? "low" : ""}`}>
            <i style={{ width: `${pct}%` }} />
          </div>
          <p className="mono d-meter" style={{ marginTop: 8 }}>
            {pct}% of a full day plus pool
          </p>
          <p style={{ marginTop: 12 }}>
            The daily grant refills to {n(FREE_DAILY)} tomorrow whatever you do. It does not
            accumulate, so waiting does not build a balance.
          </p>
          <div className="d-foot" style={{ marginTop: 12 }}>
            <Btn
              kind="quiet"
              sm
              onClick={() => {
                setState((s) => ({ ...s, creditsDay: 0, creditsMonth: 0 }));
                toast("Credits at zero. This is what a founder sees mid-run.");
              }}
            >
              Spend it down to zero
            </Btn>
            <Btn
              kind="quiet"
              sm
              onClick={() => {
                setState((s) => ({
                  ...s,
                  creditsDay: FREE_DAILY,
                  creditsMonth: tierSpec(s.tier).month,
                }));
                toast(
                  `Daily grant back to ${n(FREE_DAILY)}, pool back to ${n(tierSpec(state.tier).month)}`,
                );
              }}
            >
              Put the credits back
            </Btn>
          </div>
        </Row>

        {locked.length ? (
          <Row
            title={`${locked.length} channels are locked on ${cur.name}`}
            meta="needs Pro"
            open
            sub="The gate is deny-by-default: a slug with no tier assigned needs Pro."
            src="apps/backend/src/services/billing/tiers.ts:74, :121 requiredTierFor"
          >
            <ul className="d-kv">
              {locked.map((c) => (
                <li key={c.slug}>
                  <span className="k">{c.name}</span>&nbsp; {c.does}
                </li>
              ))}
            </ul>
            <p style={{ marginTop: 12 }}>
              Three of those {locked.length} have no connector and no tools. Upgrading unlocks
              them, and they will still only research and draft. That is stated again below so it
              is not a surprise after the charge.
            </p>
          </Row>
        ) : (
          <Row
            title="Every channel is unlocked on Pro"
            meta="0 locked"
            sub="Readiness and connectors are the remaining limits, not the plan."
          >
            <p>
              Nothing in the registry is above your tier. What still limits you is readiness and
              connectors, not price.
            </p>
          </Row>
        )}
      </Section>

      <Section
        num="01"
        label="The ladder"
        framing="Current tier, the next rung, and the price difference. Nothing is hidden behind a sales call below Enterprise."
      >
        <Row
          title={`What ${cur.name} gives you today`}
          meta={cur.usd === 0 ? "$0 / mo" : `${money(cur.usd)} / mo`}
          open
          sub={cur.who}
          src="apps/backend/src/services/billing/tiers.ts:32, :39, :74"
        >
          <ul className="d-kv">
            {cur.adds.map((a) => (
              <li key={a}>{a}</li>
            ))}
          </ul>
        </Row>

        {next ? (
          <Row
            title={`What ${next.name} adds, on top of that`}
            meta={`+${money(next.usd - cur.usd)} / mo`}
            open
            sub={next.who}
            src="billing/tiers.ts:32, :39 · agents/credits.ts:118"
          >
            <ul className="d-kv">
              {next.adds
                .filter((a) => !/^Everything in/.test(a))
                .map((a) => (
                  <li key={a}>{a}</li>
                ))}
            </ul>
            <p style={{ marginTop: 12 }}>
              Your monthly pool goes from {cur.month ? n(cur.month) : "none"} to {n(next.month)}{" "}
              credits. At {n(CHANNEL_HOLD)} a channel run that is{" "}
              {Math.floor(next.month / CHANNEL_HOLD)} runs from the pool, before the daily grant,
              and still under the {n(CHANNEL_CAP_30D)} per 30 days channel cap.
            </p>
            <div style={{ marginTop: 14 }}>
              <Btn kind="dark" onClick={() => pick(next.slug)}>
                Move to {next.name} for {money(next.usd)} a month
              </Btn>
            </div>
          </Row>
        ) : (
          <Row
            title="There is no tier above Pro"
            meta="top rung"
            open
            sub="Sales-led, no self-serve checkout."
          >
            <p>
              Enterprise is a conversation, not a checkout. More credits, invoicing, a security
              review and an SLA.
            </p>
            <p className="needs-source">
              [NEEDS SOURCE] No Enterprise price, credit volume or SLA target exists in the repo.
            </p>
            <div style={{ marginTop: 12 }}>
              <Inert>Talk to us</Inert>
            </div>
          </Row>
        )}

        <Row
          title={`What ${next ? next.name : "Pro"} still will not do`}
          meta="read this first"
          open
          sub="Same weight as the list above, because it is the same size."
          src="registry.ts readiness + connectors · agents/credits.ts:62"
        >
          <Blind
            what="Three channels on Pro have no connector and no tools"
            why="LinkedIn Ads, Reddit Ads and SMS are marked planned in the registry. They research and draft. LinkedIn Ads writes a brief from your public page and the Ad Library, Reddit Ads hands you ads you paste in yourself, SMS drafts a message set nothing here can send."
            impact="If one of those three is why you are upgrading, stop. It will not do the thing."
          />
          <Blind
            what="Eight more channels read and recommend, and do not act"
            why="SEO, GEO, Reddit, TikTok, YouTube, Influencer, TikTok Ads and ChatGPT Ads hold read tools and no write tools. Upgrading does not change that."
          />
          <Blind
            what="A tier does not supply your accounts"
            why="Eleven channels only execute once their connector is linked. Pro with no Google Ads account still gets you a recommendation, not a change."
            impact={`${unlinked} of the connectors on your workspace are not linked yet. That is free to fix.`}
            action={
              <Btn kind="dark" sm onClick={() => go("settings")}>
                Link a connector instead
              </Btn>
            }
          />
          <Blind
            what={`The ${n(CHANNEL_CAP_30D)} credit channel cap does not move`}
            why="It is a rolling 30-day ceiling under the channel runs, independent of your plan. Buying a bigger pool does not raise it."
          />
        </Row>
      </Section>

      <Section
        num="02"
        label="Go back"
        framing="This screen is a detour. Take what you learned and return to the work."
      >
        <div className="d-foot" style={{ padding: "8px 0" }}>
          <Btn kind="dark" onClick={() => go(backTarget())}>
            Back to where I was
          </Btn>
          <Btn kind="quiet" onClick={() => go("channels")}>
            Open channels
          </Btn>
          <Btn kind="quiet" onClick={() => go("settings")}>
            Open settings
          </Btn>
        </div>
      </Section>
    </div>
  );
}
