"use client";

import {
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type FormEvent,
} from "react";
import {
  Check,
  ChevronDown,
  Copy,
  Crown,
  Ellipsis,
  ExternalLink,
  Globe,
  Link,
  MessageSquare,
  Monitor,
  Plus,
  RefreshCw,
  Smartphone,
  SquarePen,
  Tablet,
  X,
} from "lucide-react";
import { DragHandle, IconButton, Panel } from "./Panel";
import { Dropdown, menuItemClass } from "./Dropdown";
import type { Plan } from "./types";

const pages = [
  { id: "home", label: "Home", path: "/" },
  { id: "gallery", label: "Gallery", path: "/#gallery" },
  { id: "pricing", label: "Pricing", path: "/#pricing" },
  { id: "faq", label: "FAQ", path: "/#faq" },
];

const devices = [
  { id: "desktop", label: "Desktop", icon: Monitor, width: "100%" },
  { id: "tablet", label: "Tablet", icon: Tablet, width: "768px" },
  { id: "mobile", label: "Mobile", icon: Smartphone, width: "390px" },
];

const subscribeNoop = () => () => {};

function initialsFor(email: string) {
  const local = email.split("@")[0] ?? "";
  return local.slice(0, 2).toUpperCase() || "??";
}

export default function BuildPreview({
  editing,
  onEditingChange,
  onSelectElement,
  plan,
  onUpgrade,
}: {
  editing: boolean;
  onEditingChange: (editing: boolean) => void;
  onSelectElement: (label: string) => void;
  plan: Plan;
  onUpgrade: () => void;
}) {
  const [pageId, setPageId] = useState(pages[0].id);
  const [deviceIndex, setDeviceIndex] = useState(0);
  const [showUrlBar, setShowUrlBar] = useState(true);
  const [published, setPublished] = useState(false);
  const [loadCount, setLoadCount] = useState(0);
  const [comments, setComments] = useState<{ id: number; text: string }[]>([]);
  const [commentDraft, setCommentDraft] = useState("");
  const [collaborators, setCollaborators] = useState(["R", "UP"]);
  const [inviteEmail, setInviteEmail] = useState("");
  const [domainDraft, setDomainDraft] = useState("");
  const [domain, setDomain] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const nextCommentId = useRef(1);

  const origin = useSyncExternalStore(
    subscribeNoop,
    () => window.location.origin,
    () => "",
  );

  const page = pages.find((item) => item.id === pageId) ?? pages[0];
  const device = devices[deviceIndex];
  const DeviceIcon = device.icon;
  const previewUrl = `${origin}${page.path}`;

  // Edit mode: highlight elements inside the preview and report the clicked one.
  useEffect(() => {
    if (!editing) return;
    const doc = iframeRef.current?.contentDocument;
    if (!doc?.body) return;

    const style = doc.createElement("style");
    style.textContent =
      "*:hover{outline:2px solid #2f80ff!important;outline-offset:2px;cursor:crosshair!important}";
    doc.head.appendChild(style);

    const handleClick = (event: Event) => {
      event.preventDefault();
      event.stopPropagation();
      const target = event.target as Element | null;
      if (!target) return;
      const tag = target.tagName.toLowerCase();
      const fullText = (target.textContent ?? "").replace(/\s+/g, " ").trim();
      const text =
        fullText.length > 40 ? `${fullText.slice(0, 40)}…` : fullText;
      onSelectElement(text ? `${tag} "${text}"` : tag);
    };
    doc.addEventListener("click", handleClick, true);

    return () => {
      style.remove();
      doc.removeEventListener("click", handleClick, true);
    };
  }, [editing, loadCount, onSelectElement]);

  function showNotice(message: string) {
    setNotice(message);
    window.setTimeout(() => setNotice(null), 3000);
  }

  function publish() {
    setPublished(true);
    showNotice(
      domain
        ? `Published to ${domain} (DNS still propagating).`
        : "Published. Your latest changes are live.",
    );
    window.setTimeout(() => setPublished(false), 2500);
  }

  function reloadPreview() {
    iframeRef.current?.contentWindow?.location.reload();
    showNotice("Preview reloaded.");
  }

  function copyLink() {
    void navigator.clipboard?.writeText(previewUrl);
    showNotice("Preview link copied.");
  }

  function postComment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const text = commentDraft.trim();
    if (!text) return;
    setComments((prev) => [...prev, { id: nextCommentId.current++, text }]);
    setCommentDraft("");
  }

  function sendInvite(event: FormEvent<HTMLFormElement>, close: () => void) {
    event.preventDefault();
    const email = inviteEmail.trim();
    if (!email.includes("@")) {
      showNotice("Enter a valid email address to send an invite.");
      return;
    }
    setCollaborators((prev) => [...prev, initialsFor(email)]);
    setInviteEmail("");
    showNotice(`Invite sent to ${email}.`);
    close();
  }

  function connectDomain(event: FormEvent<HTMLFormElement>, close: () => void) {
    event.preventDefault();
    const value = domainDraft.trim().toLowerCase();
    if (!/^[a-z0-9.-]+\.[a-z]{2,}$/.test(value)) {
      showNotice("Enter a domain like example.com.");
      return;
    }
    setDomain(value);
    setDomainDraft("");
    showNotice(`Point a CNAME for ${value} at sites.zavi.app to finish setup.`);
    close();
  }

  return (
    <Panel>
      <div className="flex h-12 shrink-0 items-center gap-2 border-b border-zinc-200 px-3">
        <DragHandle />
        <button
          type="button"
          aria-pressed={editing}
          onClick={() => onEditingChange(!editing)}
          className={`flex h-8 cursor-pointer items-center gap-1.5 rounded-lg border px-2.5 text-sm font-medium transition-colors duration-200 ${
            editing
              ? "border-zinc-900 bg-zinc-900 text-white"
              : "border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50"
          }`}
        >
          <SquarePen className="h-3.5 w-3.5" aria-hidden="true" />
          {editing ? "Editing" : "Edit"}
        </button>

        <a
          href={page.path}
          target="_blank"
          rel="noreferrer"
          aria-label="Open preview in a new tab"
          className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-zinc-200 text-zinc-600 transition-colors duration-200 hover:bg-zinc-50 hover:text-zinc-900"
        >
          <ExternalLink className="h-4 w-4" />
        </a>

        <div className="mx-auto flex items-center gap-1">
          <label htmlFor="page-select" className="sr-only">
            Page
          </label>
          <div className="relative">
            <select
              id="page-select"
              value={pageId}
              onChange={(event) => setPageId(event.target.value)}
              className="h-8 cursor-pointer appearance-none rounded-lg border border-zinc-200 bg-white pr-7 pl-3 text-sm font-medium text-zinc-800 transition-colors duration-200 hover:bg-zinc-50 focus:ring-2 focus:ring-zinc-300 focus:outline-none"
            >
              {pages.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </select>
            <ChevronDown
              className="pointer-events-none absolute top-1/2 right-2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-500"
              aria-hidden="true"
            />
          </div>
          <IconButton
            label={`Preview on ${device.label}. Switch device`}
            className="h-8 w-8"
            onClick={() =>
              setDeviceIndex((index) => (index + 1) % devices.length)
            }
          >
            <DeviceIcon className="h-4 w-4" />
          </IconButton>
        </div>

        <div className="flex items-center gap-1">
          <Dropdown
            align="right"
            width="w-72"
            label="Comments"
            trigger={({ open, toggle, id }) => (
              <IconButton
                label={
                  comments.length > 0
                    ? `Comments (${comments.length})`
                    : "Comments"
                }
                aria-expanded={open}
                aria-haspopup="dialog"
                aria-controls={id}
                onClick={toggle}
                className="relative h-8 w-8"
              >
                <MessageSquare className="h-4 w-4" />
                {comments.length > 0 && (
                  <span
                    className="absolute top-0.5 right-0.5 h-2 w-2 rounded-full bg-emerald-500"
                    aria-hidden="true"
                  />
                )}
              </IconButton>
            )}
          >
            {() => (
              <div className="p-1">
                <p className="text-sm font-semibold tracking-wider text-zinc-500 uppercase">
                  Comments
                </p>
                {comments.length === 0 ? (
                  <p className="mt-2 text-sm text-zinc-600">
                    No comments yet. Leave a note for your team.
                  </p>
                ) : (
                  <ul className="mt-2 max-h-40 space-y-2 overflow-y-auto">
                    {comments.map((comment) => (
                      <li
                        key={comment.id}
                        className="rounded-lg bg-zinc-50 px-3 py-2 text-sm text-zinc-800"
                      >
                        <span className="block text-sm font-medium text-zinc-500">
                          You · just now
                        </span>
                        {comment.text}
                      </li>
                    ))}
                  </ul>
                )}
                <form onSubmit={postComment} className="mt-2">
                  <label htmlFor="comment-input" className="sr-only">
                    New comment
                  </label>
                  <textarea
                    id="comment-input"
                    rows={2}
                    value={commentDraft}
                    onChange={(event) => setCommentDraft(event.target.value)}
                    placeholder="Leave a comment…"
                    className="w-full resize-none rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-500 focus:ring-2 focus:ring-zinc-300 focus:outline-none"
                  />
                  <button
                    type="submit"
                    disabled={!commentDraft.trim()}
                    className="mt-2 w-full cursor-pointer rounded-lg bg-zinc-900 px-3 py-1.5 text-sm font-semibold text-white transition-colors duration-200 hover:bg-zinc-700 disabled:cursor-not-allowed disabled:bg-zinc-300"
                  >
                    Post comment
                  </button>
                </form>
              </div>
            )}
          </Dropdown>

          <div className="flex items-center">
            <div className="hidden items-center 2xl:flex">
              {collaborators.map((initials, index) => (
                <span
                  key={`${initials}-${index}`}
                  title={initials}
                  className={`flex h-7 w-7 items-center justify-center rounded-full border-2 border-white text-sm font-semibold ${
                    index % 2 === 0
                      ? "bg-zinc-800 text-white"
                      : "bg-zinc-300 text-zinc-800"
                  } ${index > 0 ? "-ml-2" : ""}`}
                >
                  {initials}
                </span>
              ))}
            </div>
            <Dropdown
              align="right"
              width="w-64"
              label="Invite collaborator"
              trigger={({ open, toggle, id }) => (
                <button
                  type="button"
                  aria-label="Invite collaborator"
                  aria-expanded={open}
                  aria-haspopup="dialog"
                  aria-controls={id}
                  onClick={toggle}
                  className="-ml-1 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full border border-dashed border-zinc-300 text-zinc-500 transition-colors duration-200 hover:bg-zinc-50 hover:text-zinc-900"
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
              )}
            >
              {(close) => (
                <form
                  onSubmit={(event) => sendInvite(event, close)}
                  className="p-1"
                >
                  <p className="text-sm font-semibold tracking-wider text-zinc-500 uppercase">
                    Invite a collaborator
                  </p>
                  <label htmlFor="invite-email" className="sr-only">
                    Email address
                  </label>
                  <input
                    id="invite-email"
                    type="email"
                    value={inviteEmail}
                    onChange={(event) => setInviteEmail(event.target.value)}
                    placeholder="teammate@company.com"
                    className="mt-2 h-9 w-full rounded-lg border border-zinc-200 px-3 text-sm text-zinc-900 placeholder:text-zinc-500 focus:ring-2 focus:ring-zinc-300 focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="mt-2 w-full cursor-pointer rounded-lg bg-zinc-900 px-3 py-1.5 text-sm font-semibold text-white transition-colors duration-200 hover:bg-zinc-700"
                  >
                    Send invite
                  </button>
                </form>
              )}
            </Dropdown>
          </div>

          <Dropdown
            align="right"
            width="w-52"
            label="More options"
            trigger={({ open, toggle, id }) => (
              <IconButton
                label="More options"
                aria-expanded={open}
                aria-haspopup="dialog"
                aria-controls={id}
                onClick={toggle}
                className="h-8 w-8"
              >
                <Ellipsis className="h-4 w-4" />
              </IconButton>
            )}
          >
            {(close) => (
              <ul>
                <li>
                  <button
                    type="button"
                    onClick={() => {
                      reloadPreview();
                      close();
                    }}
                    className={menuItemClass}
                  >
                    <RefreshCw className="h-4 w-4" aria-hidden="true" />
                    Reload preview
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => {
                      copyLink();
                      close();
                    }}
                    className={menuItemClass}
                  >
                    <Copy className="h-4 w-4" aria-hidden="true" />
                    Copy preview link
                  </button>
                </li>
                <li>
                  <a
                    href={page.path}
                    target="_blank"
                    rel="noreferrer"
                    onClick={close}
                    className={menuItemClass}
                  >
                    <ExternalLink className="h-4 w-4" aria-hidden="true" />
                    Open in new tab
                  </a>
                </li>
              </ul>
            )}
          </Dropdown>

          <Dropdown
            align="right"
            width="w-64"
            label="Upgrade"
            trigger={({ open, toggle, id }) => (
              <button
                type="button"
                aria-expanded={open}
                aria-haspopup="dialog"
                aria-controls={id}
                onClick={toggle}
                className={`hidden h-8 cursor-pointer items-center gap-1.5 rounded-lg px-2.5 text-sm font-semibold transition-colors duration-200 2xl:flex ${
                  plan === "pro"
                    ? "text-emerald-700 hover:bg-emerald-50"
                    : "text-orange-600 hover:bg-orange-50"
                }`}
              >
                <Crown className="h-3.5 w-3.5" aria-hidden="true" />
                {plan === "pro" ? "Pro" : "Upgrade"}
              </button>
            )}
          >
            {(close) => (
              <div className="p-1">
                <p className="text-sm font-semibold tracking-wider text-zinc-500 uppercase">
                  {plan === "pro" ? "Your plan" : "Upgrade to Pro"}
                </p>
                <p className="mt-1 text-sm font-semibold text-zinc-900">
                  Pro · $24/month
                </p>
                <ul className="mt-2 space-y-1 text-sm text-zinc-600">
                  <li>Unlimited builds and previews</li>
                  <li>Custom domains with SSL</li>
                  <li>10 parallel agents</li>
                </ul>
                {plan === "pro" ? (
                  <p className="mt-3 flex items-center gap-1.5 text-sm font-medium text-emerald-700">
                    <Check className="h-4 w-4" aria-hidden="true" />
                    You&apos;re on Pro
                  </p>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      onUpgrade();
                      showNotice("Welcome to Pro.");
                      close();
                    }}
                    className="mt-3 w-full cursor-pointer rounded-lg bg-zinc-900 px-3 py-1.5 text-sm font-semibold text-white transition-colors duration-200 hover:bg-zinc-700"
                  >
                    Upgrade to Pro
                  </button>
                )}
              </div>
            )}
          </Dropdown>

          <button
            type="button"
            onClick={publish}
            className={`flex h-8 cursor-pointer items-center gap-1.5 rounded-lg px-3 text-sm font-semibold text-white transition-colors duration-200 ${
              published ? "bg-emerald-600" : "bg-zinc-900 hover:bg-zinc-700"
            }`}
          >
            {published ? (
              <>
                <Check className="h-3.5 w-3.5" aria-hidden="true" />
                Published
              </>
            ) : (
              "Publish"
            )}
          </button>
        </div>
      </div>

      {notice && (
        <p
          role="status"
          className="shrink-0 border-b border-zinc-200 bg-zinc-50 px-3 py-1.5 text-sm text-zinc-600"
        >
          {notice}
        </p>
      )}

      {showUrlBar && (
        <div className="flex h-10 shrink-0 items-center gap-2 border-b border-zinc-200 bg-zinc-50 px-3">
          <Globe
            className="h-4 w-4 shrink-0 text-zinc-500"
            aria-hidden="true"
          />
          <span className="min-w-0 flex-1 truncate text-sm text-zinc-700">
            {domain ? `https://${domain}${page.path}` : previewUrl}
          </span>
          <Dropdown
            align="right"
            width="w-72"
            label="Connect domain"
            trigger={({ open, toggle, id }) => (
              <button
                type="button"
                aria-expanded={open}
                aria-haspopup="dialog"
                aria-controls={id}
                onClick={toggle}
                className={`flex h-7 shrink-0 cursor-pointer items-center gap-1.5 rounded-md px-2.5 text-sm font-semibold transition-colors duration-200 ${
                  domain
                    ? "border border-amber-300 bg-amber-50 text-amber-800 hover:bg-amber-100"
                    : "bg-orange-500 text-white hover:bg-orange-600"
                }`}
              >
                <Link className="h-3.5 w-3.5" aria-hidden="true" />
                {domain ? "Pending DNS" : "Connect domain"}
              </button>
            )}
          >
            {(close) => (
              <div className="p-1">
                <p className="text-sm font-semibold tracking-wider text-zinc-500 uppercase">
                  Custom domain
                </p>
                {domain ? (
                  <>
                    <p className="mt-2 text-sm font-semibold text-zinc-900">
                      {domain}
                    </p>
                    <p className="mt-1 text-sm leading-relaxed text-zinc-600">
                      Waiting for DNS. Add a CNAME record pointing to
                      sites.zavi.app, then publish again.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setDomain(null);
                        showNotice("Domain removed.");
                        close();
                      }}
                      className="mt-3 w-full cursor-pointer rounded-lg border border-zinc-200 px-3 py-1.5 text-sm font-semibold text-zinc-700 transition-colors duration-200 hover:bg-zinc-50"
                    >
                      Remove domain
                    </button>
                  </>
                ) : (
                  <form onSubmit={(event) => connectDomain(event, close)}>
                    <label htmlFor="domain-input" className="sr-only">
                      Domain
                    </label>
                    <input
                      id="domain-input"
                      type="text"
                      value={domainDraft}
                      onChange={(event) => setDomainDraft(event.target.value)}
                      placeholder="yourdomain.com"
                      className="mt-2 h-9 w-full rounded-lg border border-zinc-200 px-3 text-sm text-zinc-900 placeholder:text-zinc-500 focus:ring-2 focus:ring-zinc-300 focus:outline-none"
                    />
                    <button
                      type="submit"
                      className="mt-2 w-full cursor-pointer rounded-lg bg-zinc-900 px-3 py-1.5 text-sm font-semibold text-white transition-colors duration-200 hover:bg-zinc-700"
                    >
                      Connect
                    </button>
                  </form>
                )}
              </div>
            )}
          </Dropdown>
          <IconButton
            label="Hide address bar"
            className="h-7 w-7"
            onClick={() => setShowUrlBar(false)}
          >
            <X className="h-4 w-4" />
          </IconButton>
        </div>
      )}

      <div className="relative flex min-h-0 flex-1 flex-col bg-zinc-100">
        {editing && (
          <div
            role="status"
            className="flex shrink-0 items-center gap-3 border-b border-blue-100 bg-blue-50 px-4 py-2 text-sm text-blue-900"
          >
            <span className="flex-1">
              Click any element in the preview to reference it in your prompt.
            </span>
            <button
              type="button"
              onClick={() => onEditingChange(false)}
              className="cursor-pointer font-semibold hover:underline"
            >
              Cancel
            </button>
          </div>
        )}
        <div className="flex min-h-0 flex-1 justify-center overflow-hidden">
          <div
            className="h-full max-w-full bg-white transition-[width] duration-300"
            style={{ width: device.width }}
          >
            <iframe
              ref={iframeRef}
              title="Site preview"
              src={page.path}
              onLoad={() => setLoadCount((count) => count + 1)}
              className="h-full w-full"
            />
          </div>
        </div>
      </div>
    </Panel>
  );
}
