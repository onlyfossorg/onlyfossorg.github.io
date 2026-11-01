import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Calendar,
  MapPin,
  Monitor,
  ArrowUpRight,
  Users,
  Clock,
  Trophy,
} from "lucide-react";
import {
  getEventBySlug,
  getEventStatus,
  formatEventDateRange,
  formatEventCountdown,
  getUserTimezone,
  formatTimezoneOffset,
  isSameTimezone,
  type EventSection,
} from "../lib/loadEvents";
import RevealOnScroll from "../components/RevealOnScroll";
import MarkdownBody from "../components/events/MarkdownBody";
import SectionCards from "../components/events/SectionCards";
import FaqAccordion from "../components/events/FaqAccordion";
import EventSectionNav from "../components/events/EventSectionNav";
import NotFound from "./NotFound";
import SEO from "../components/SEO";

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
  const [now, setNow] = useState<Date>(() => new Date());
  const [userTz, setUserTz] = useState<string>(() => getUserTimezone());
  const [viewInUserTz, setViewInUserTz] = useState(false);

  const event = slug ? getEventBySlug(slug, now) : undefined;

  useEffect(() => {
    setUserTz(getUserTimezone());
    const interval = setInterval(() => {
      setNow(new Date());
    }, 15000); // 15 seconds
    return () => clearInterval(interval);
  }, []);

  if (!event) return <NotFound />;

  const { meta, sections } = event;
  const currentStatus = getEventStatus(meta, now);
  const countdown = formatEventCountdown(meta, now);

  const isSameTz = isSameTimezone(meta.timezone, userTz);
  const activeTz = viewInUserTz && !isSameTz ? userTz : (meta.timezone || "UTC");
  const displayedDateRange = formatEventDateRange(
    meta.start,
    meta.end,
    meta.timezone,
    activeTz,
    true,
  );

  const isPast = currentStatus === "past";
  const isLive = currentStatus === "live";
  const userTzOffset = formatTimezoneOffset(userTz, now);

  const eventJsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: meta.title,
    description: meta.summary,
    startDate: meta.start,
    endDate: meta.end || meta.start,
    eventAttendanceMode: "https://schema.org/OnlineEventAttendanceMode",
    eventStatus: isPast
      ? "https://schema.org/EventCompleted"
      : "https://schema.org/EventScheduled",
    location: {
      "@type": "VirtualLocation",
      url: `https://onlyfossorg.github.io/events/${slug}`,
    },
    organizer: {
      "@type": "Organization",
      name: "ONLY FOSS ORG",
      url: "https://onlyfossorg.github.io",
    },
  };

  return (
    <>
      <SEO
        title={meta.title}
        description={meta.summary}
        canonical={`https://onlyfossorg.github.io/events/${slug}`}
        type="article"
        jsonLd={eventJsonLd}
      />
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
        @keyframes live-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(1.2); }
        }
        .live-dot {
          display: inline-block;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background-color: #00ff7f;
          box-shadow: 0 0 8px #00ff7f;
          animation: live-pulse 1.8s ease-in-out infinite;
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
            <div className="grid lg:grid-cols-[1fr_minmax(240px,360px)] gap-10 lg:gap-14 mb-14 items-start">
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

                {/* Status Badges with Dynamic Calculation */}
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <span
                    className="inline-flex items-center gap-2 font-mono text-[0.65rem] tracking-[0.18em] px-2.5 py-1 border transition-colors"
                    style={{
                      color: isLive
                        ? "#00ff7f"
                        : isPast
                          ? "rgba(255,255,255,.45)"
                          : "rgba(0,255,127,.85)",
                      borderColor: isLive
                        ? "rgba(0,255,127,.5)"
                        : isPast
                          ? "rgba(255,255,255,.15)"
                          : "rgba(0,255,127,.28)",
                      background: isLive
                        ? "rgba(0,255,127,.12)"
                        : isPast
                          ? "transparent"
                          : "rgba(0,255,127,.05)",
                    }}
                  >
                    {isLive && <span className="live-dot" />}
                    {countdown.label}
                  </span>

                  {/* Countdown ticker text */}
                  <span className="inline-flex items-center gap-1.5 font-mono text-xs text-gray-300 px-2 py-0.5 border border-white/10 bg-white/[0.02]">
                    <Clock className="w-3 h-3 text-foss-green" />
                    {countdown.text}
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

                {/* Key metadata including timezone sync */}
                <div className="flex flex-col gap-2.5 mb-8 text-gray-400 font-mono text-sm">
                  {displayedDateRange && (
                    <div className="space-y-1.5">
                      <div className="inline-flex flex-wrap items-center gap-2 text-white">
                        <Calendar className="w-4 h-4 text-foss-green/70 shrink-0" />
                        <span>{displayedDateRange}</span>
                        <span className="text-gray-500 text-xs">
                          ({activeTz}
                          {activeTz === userTz && userTzOffset ? ` · ${userTzOffset}` : ""})
                        </span>
                      </div>
                      {!isSameTz && meta.timezone && (
                        <div className="pl-6">
                          <button
                            type="button"
                            onClick={() => setViewInUserTz((prev) => !prev)}
                            className="text-xs text-foss-green/90 hover:text-foss-green underline underline-offset-4 cursor-pointer inline-flex items-center gap-1.5 font-mono transition-colors"
                          >
                            <span className="text-foss-green">⇄</span>
                            <span>
                              {viewInUserTz
                                ? `Switch back to event time.`
                                : `View in your time.`}
                            </span>
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {meta.location && (
                    <span className="inline-flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-foss-green/70 shrink-0" />
                      {meta.location}
                    </span>
                  )}

                  {meta.prizes && (
                    <span className="inline-flex items-center gap-2 text-foss-green/90">
                      <Trophy className="w-4 h-4 text-foss-green shrink-0" />
                      {meta.prizes}
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
                    className="inline-flex items-center gap-2 px-6 py-3 bg-foss-green text-black font-mono text-sm font-bold hover:bg-foss-green/90 transition-colors shadow-[0_0_20px_rgba(0,255,127,0.25)]"
                  >
                    {meta.register.label}
                    <ArrowUpRight className="w-4 h-4" />
                  </a>
                )}
              </div>

              {/* Cover or date/format panel */}
              <div className="relative overflow-hidden w-full aspect-square flex flex-col justify-end bg-black/80">
                {meta.cover ? (
                  <img
                    src={meta.cover}
                    alt={meta.title}
                    width={720}
                    height={900}
                    decoding="async"
                    fetchPriority="high"
                    className="absolute inset-0 w-full h-full object-cover object-center"
                  />
                ) : (
                  <div className="relative z-10 p-6">
                    <p className="pg-eyebrow">EVENT</p>
                    <p
                      className="jersey-25-regular text-white mb-2"
                      style={{ fontSize: "1.6rem", letterSpacing: "0.04em" }}
                    >
                      {displayedDateRange || "Dates TBA"}
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
                      className="jersey-25-regular text-white my-3"
                      style={{
                        fontSize: "clamp(1.5rem,3vw,2rem)",
                        letterSpacing: "0.04em",
                      }}
                    >
                      <span className="text-foss-green">#</span> {section.title}
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
