import { useParams } from "react-router-dom";
import { Calendar, MapPin, Monitor, ArrowUpRight, Users } from "lucide-react";
import {
  getEventBySlug,
  formatEventDateRange,
  type EventSection,
} from "../lib/loadEvents";
import RevealOnScroll from "../components/RevealOnScroll";
import MarkdownBody from "../components/events/MarkdownBody";
import SectionCards from "../components/events/SectionCards";
import FaqAccordion from "../components/events/FaqAccordion";
import EventSectionNav from "../components/events/EventSectionNav";
import NotFound from "./NotFound";

function statusLabel(status: string): string {
  if (status === "live") return "LIVE";
  if (status === "past") return "PAST";
  return "UPCOMING";
}

function renderSection(section: EventSection) {
  if (section.kind === "cards" && section.cards) {
    return <SectionCards cards={section.cards} />;
  }
  if (section.kind === "faq" && section.faq) {
    return <FaqAccordion items={section.faq} />;
  }
  if (section.body) {
    return <MarkdownBody content={section.body} />;
  }
  return null;
}

function EventDetail() {
  const { slug } = useParams<{ slug: string }>();
  const event = slug ? getEventBySlug(slug) : undefined;

  if (!event) return <NotFound />;

  const { meta, sections } = event;
  const dateRange = formatEventDateRange(meta.start, meta.end, meta.timezone);
  const isPast = meta.status === "past";

  return (
    <>
      <style>{`
        @keyframes grid-drift { 0%{transform:translateY(0)} 100%{transform:translateY(64px)} }
        .hero-grid {
          background-image:
            linear-gradient(to right,rgba(255,255,255,.07) 1px,transparent 1px),
            linear-gradient(to bottom,rgba(255,255,255,.07) 1px,transparent 1px);
          background-size:64px 64px;
          animation:grid-drift 14s linear infinite;
        }
        .pg-eyebrow {
          font-family:monospace; font-size:.75rem; letter-spacing:.22em;
          color:rgba(0,255,127,.55); display:flex; align-items:center;
          gap:.5rem; margin-bottom:.75rem;
        }
        .pg-eyebrow::before { content:""; display:inline-block; width:16px; height:1px; background:rgba(0,255,127,.5); }
        .ev-section {
          scroll-margin-top: 6.5rem;
          padding-top: 2.5rem;
          margin-top: 2.5rem;
        }
        .ev-section:first-of-type { margin-top: 0; padding-top: 0; }
        .ev-section:not(:first-of-type)::before {
          content: "";
          display: block;
          height: 1px;
          margin: 0 0 2.5rem;
          background: linear-gradient(90deg, #00ff7f 0%, rgba(0,255,127,.18) 42%, transparent 100%);
        }
        @keyframes feature-card-glitch {
          0%   { box-shadow: none; transform: none; }
          15%  { box-shadow: -4px 0 rgba(255,0,255,.35), 4px 0 rgba(0,255,255,.35);
                 clip-path: inset(10% 0 70% 0); transform: skewX(-2deg) translateX(3px); }
          28%  { clip-path: inset(70% 0 10% 0); transform: skewX(2deg) translateX(-3px); }
          40%  { clip-path: inset(35% 0 35% 0); transform: skewX(-1deg);
                 box-shadow: -2px 0 rgba(255,0,255,.2), 2px 0 rgba(0,255,255,.2); }
          55%  { clip-path: inset(0 0 0 0); transform: skewX(0.5deg); }
          70%  { clip-path: inset(0 0 0 0); transform: none;
                 box-shadow: -1px 0 rgba(255,0,255,.1), 1px 0 rgba(0,255,255,.1); }
          100% { clip-path: inset(0 0 0 0); box-shadow: none; transform: none; }
        }
        .feature-card:hover {
          animation: feature-card-glitch 0.6s cubic-bezier(.19,1,.22,1) forwards;
        }
      `}</style>

      <div className="pt-28 pb-24 min-h-screen bg-black relative">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="hero-grid absolute inset-0 opacity-60" />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "radial-gradient(ellipse 85% 55% at 50% 0%, transparent 30%, #000 100%)",
            }}
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
          {/* HERO */}
          <RevealOnScroll>
            <div className="grid lg:grid-cols-[1fr_minmax(240px,340px)] gap-10 lg:gap-14 mb-16 items-start">
              <div>
                {/* Host chip */}
                {meta.hosts.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-5">
                    {meta.hosts.map((host) => (
                      <span
                        key={host.name}
                        className="inline-flex items-center gap-2 px-3 py-1.5 border border-white/10 bg-white/[0.03] font-mono text-xs text-gray-300"
                      >
                        {host.logo ? (
                          <img
                            src={host.logo}
                            alt=""
                            className="w-4 h-4 object-contain"
                          />
                        ) : (
                          <Users className="w-3.5 h-3.5 text-foss-green/70" />
                        )}
                        {host.name}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <span
                    className="font-mono text-[0.65rem] tracking-[0.18em] px-2.5 py-1 border"
                    style={{
                      color:
                        meta.status === "live"
                          ? "#00ff7f"
                          : meta.status === "past"
                            ? "rgba(255,255,255,.4)"
                            : "rgba(0,255,127,.75)",
                      borderColor:
                        meta.status === "past"
                          ? "rgba(255,255,255,.12)"
                          : "rgba(0,255,127,.25)",
                      background:
                        meta.status === "past"
                          ? "transparent"
                          : "rgba(0,255,127,.05)",
                    }}
                  >
                    {statusLabel(meta.status)}
                  </span>
                  {meta.format && (
                    <span className="font-mono text-xs text-gray-500 tracking-wide">
                      {meta.format}
                    </span>
                  )}
                </div>

                <h1
                  className="jersey-25-regular text-white mb-5"
                  style={{
                    fontSize: "clamp(2.4rem,6vw,4.2rem)",
                    lineHeight: 1.05,
                    letterSpacing: "0.02em",
                  }}
                >
                  {meta.title}
                </h1>

                {meta.summary && (
                  <p className="text-gray-400 font-mono text-sm leading-relaxed mb-6 max-w-xl">
                    {meta.summary}
                  </p>
                )}

                <div className="flex flex-col gap-2.5 mb-8 text-gray-400 font-mono text-sm">
                  {dateRange && (
                    <span className="inline-flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-foss-green/70 shrink-0" />
                      {dateRange}
                      {meta.timezone ? (
                        <span className="text-gray-600 text-xs">
                          ({meta.timezone})
                        </span>
                      ) : null}
                    </span>
                  )}
                  {meta.location && (
                    <span className="inline-flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-foss-green/70 shrink-0" />
                      {meta.location}
                    </span>
                  )}
                  {meta.format && (
                    <span className="inline-flex items-center gap-2 lg:hidden">
                      <Monitor className="w-4 h-4 text-foss-green/70 shrink-0" />
                      {meta.format}
                    </span>
                  )}
                </div>

                {meta.register && !isPast && (
                  <a
                    href={meta.register.url}
                    target={
                      meta.register.url.startsWith("http")
                        ? "_blank"
                        : undefined
                    }
                    rel={
                      meta.register.url.startsWith("http")
                        ? "noopener noreferrer"
                        : undefined
                    }
                    className="inline-flex items-center gap-2 px-6 py-3 bg-foss-green text-black font-mono text-sm font-bold hover:bg-foss-green/90 transition-colors"
                  >
                    {meta.register.label}
                    <ArrowUpRight className="w-4 h-4" />
                  </a>
                )}
              </div>

              {/* Cover or date/format panel — fixed aspect so missing cover does not jump */}
              <div
                className="relative overflow-hidden w-full aspect-[4/5] flex flex-col justify-end"
                style={{
                  border: "1px solid rgba(0,255,127,.18)",
                  background: meta.cover
                    ? "#0a0a0a"
                    : "linear-gradient(160deg, rgba(0,255,127,.08) 0%, rgba(255,255,255,.02) 45%, #000 100%)",
                }}
              >
                {meta.cover ? (
                  <img
                    src={meta.cover}
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                ) : (
                  <div className="relative z-10 p-6">
                    <p className="pg-eyebrow">EVENT</p>
                    <p
                      className="jersey-25-regular text-white mb-2"
                      style={{ fontSize: "1.6rem", letterSpacing: "0.04em" }}
                    >
                      {dateRange || "Dates TBA"}
                    </p>
                    {meta.format && (
                      <p className="font-mono text-xs text-foss-green/70 tracking-wider uppercase">
                        {meta.format}
                      </p>
                    )}
                    {meta.location && (
                      <p className="font-mono text-xs text-gray-500 mt-3">
                        {meta.location}
                      </p>
                    )}
                  </div>
                )}
                <span
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: 14,
                    height: 14,
                    borderTop: "1px solid rgba(0,255,127,.5)",
                    borderLeft: "1px solid rgba(0,255,127,.5)",
                  }}
                />
                <span
                  style={{
                    position: "absolute",
                    bottom: 0,
                    right: 0,
                    width: 14,
                    height: 14,
                    borderBottom: "1px solid rgba(0,255,127,.5)",
                    borderRight: "1px solid rgba(0,255,127,.5)",
                  }}
                />
              </div>
            </div>
          </RevealOnScroll>

          {/* BODY + SECTION NAV */}
          <div className="grid lg:grid-cols-[200px_1fr] gap-10 lg:gap-14">
            <EventSectionNav sections={sections} />

            <div>
              {sections.map((section, i) => (
                <RevealOnScroll key={section.id} delay={Math.min(i * 40, 200)}>
                  <section id={section.id} className="ev-section">
                    <h2
                      className="jersey-25-regular text-white mb-6"
                      style={{
                        fontSize: "clamp(1.5rem,3vw,2rem)",
                        letterSpacing: "0.04em",
                      }}
                    >
                      {section.title}
                    </h2>
                    {renderSection(section)}
                  </section>
                </RevealOnScroll>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default EventDetail;
