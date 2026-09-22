import { Link } from "react-router-dom";
import { Calendar, ArrowUpRight, MapPin, Monitor } from "lucide-react";
import RevealOnScroll from "../components/RevealOnScroll";
import GlitchText from "../components/GlitchText";
import {
  getAllEvents,
  formatEventDateRange,
  type EventData,
} from "../lib/loadEvents";

function statusTone(status: string) {
  if (status === "live") {
    return {
      label: "LIVE",
      color: "#00ff7f",
      border: "rgba(0,255,127,.35)",
      bg: "rgba(0,255,127,.08)",
    };
  }
  if (status === "past") {
    return {
      label: "PAST",
      color: "rgba(255,255,255,.45)",
      border: "rgba(255,255,255,.12)",
      bg: "transparent",
    };
  }
  return {
    label: "UPCOMING",
    color: "rgba(0,255,127,.75)",
    border: "rgba(0,255,127,.22)",
    bg: "rgba(0,255,127,.05)",
  };
}

function EventCard({ event }: { event: EventData }) {
  const { meta } = event;
  const tone = statusTone(meta.status);
  const dateRange = formatEventDateRange(meta.start, meta.end, meta.timezone);
  const isPast = meta.status === "past";

  return (
    <Link
      to={`/events/${meta.slug}`}
      className="group block h-full"
      style={{ opacity: isPast ? 0.72 : 1 }}
    >
      <article
        className={`feature-card group h-full flex flex-col relative overflow-hidden border hover:border-foss-green/20 transition-colors duration-300 ${
          isPast ? "border-white/[0.07]" : "border-foss-green/15"
        }`}
        style={{
          background: "rgba(0,0,0,.98)",
        }}
      >
        <span
          className="group-hover:[border-top-color:rgba(0,255,127,.5)!important] group-hover:[border-left-color:rgba(0,255,127,.5)!important]"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: 14,
            height: 14,
            borderTop: "1px solid rgba(0,255,127,0)",
            borderLeft: "1px solid rgba(0,255,127,0)",
            transition: "border-color 0.3s",
            zIndex: 2,
          }}
        />
        {/* Media / date block — fixed height so cover vs date fallback does not jump */}
        <div
          className="relative overflow-hidden shrink-0"
          style={{
            height: 140,
            background: meta.cover
              ? "#0a0a0a"
              : "linear-gradient(145deg, rgba(0,255,127,.1) 0%, rgba(255,255,255,.03) 50%, #000 100%)",
            borderBottom: "1px solid rgba(255,255,255,.06)",
          }}
        >
          {/* {meta.cover ? (
            <img
              src={meta.cover}
              alt=""
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
            />
          ) : ( */}
            <div className="absolute inset-0 flex flex-col justify-end p-4">
              <p
                className="jersey-25-regular text-white"
                style={{ fontSize: "1.35rem", letterSpacing: "0.04em" }}
              >
                {dateRange || "TBA"}
              </p>
              {meta.format && (
                <p className="font-mono text-[0.65rem] text-foss-green/65 tracking-wider uppercase mt-1">
                  {meta.format}
                </p>
              )}
            </div>
          {/* )} */}
          <span
            className="absolute top-3 left-3 font-mono text-[0.6rem] tracking-[0.15em] px-2 py-1"
            style={{
              color: tone.color,
              border: `1px solid ${tone.border}`,
              background: tone.bg,
            }}
          >
            {tone.label}
          </span>
        </div>

        <div className="p-5 flex flex-col grow">
          <h3
            className="jersey-25-regular text-white mb-2 group-hover:text-foss-green transition-colors"
            style={{ fontSize: "1.35rem", letterSpacing: "0.04em" }}
          >
            {meta.title}
          </h3>
          {meta.summary && (
            <p className="text-gray-500 font-mono text-xs leading-relaxed mb-4 line-clamp-3 grow">
              {meta.summary}
            </p>
          )}
          <div className="flex flex-col gap-1.5 text-gray-500 font-mono text-[0.7rem]">
            {dateRange && (
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="w-3 h-3 text-foss-green/50" />
                {dateRange}
              </span>
            )}
            {meta.location && (
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="w-3 h-3 text-foss-green/50" />
                {meta.location}
              </span>
            )}
            {meta.format && (
              <span className="inline-flex items-center gap-1.5">
                <Monitor className="w-3 h-3 text-foss-green/50" />
                {meta.format}
              </span>
            )}
          </div>
        </div>
      </article>
    </Link>
  );
}

function Events() {
  const events = getAllEvents();
  const hasEvents = events.length > 0;

  return (
    <>
      <style>{`
        @keyframes grid-drift { 0%{transform:translateY(0)} 100%{transform:translateY(64px)} }
        .hero-grid {
          background-image:
            linear-gradient(to right,rgba(255,255,255,.09) 1px,transparent 1px),
            linear-gradient(to bottom,rgba(255,255,255,.09) 1px,transparent 1px);
          background-size:64px 64px;
          animation:grid-drift 14s linear infinite;
        }
        .pg-eyebrow {
          font-family:monospace; font-size:.85rem; letter-spacing:.22em;
          color:rgba(0,255,127,.55); display:flex; align-items:center;
          gap:.5rem; margin-bottom:.6rem;
        }
        .pg-eyebrow::before { content:""; display:inline-block; width:16px; height:1px; background:rgba(0,255,127,.5); }
        .pg-hline { position:absolute; bottom:0; left:0; height:1px; width:100%; background:linear-gradient(90deg,#00ff7f 0%,rgba(0,255,127,.1) 60%,transparent 100%); }

        @keyframes cal-pulse { 0%,100%{opacity:.4;transform:scale(1)} 50%{opacity:.75;transform:scale(1.05)} }
        .cal-icon { animation:cal-pulse 3s ease-in-out infinite; }

        @keyframes empty-glitch {
          0%,88%,100%{opacity:.45;transform:none}
          90%{opacity:1;transform:skewX(-2deg) translateX(2px);text-shadow:-1px 0 rgba(255,0,255,.4),1px 0 rgba(0,255,255,.4)}
          94%{transform:skewX(1deg) translateX(-1px)}
        }
        .empty-glyph { animation:empty-glitch 5s steps(1) infinite; }

        .ev-cta {
          border:1px solid rgba(0,255,127,.22); background:rgba(0,255,127,.04);
          padding:2.5rem; position:relative; overflow:hidden;
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

      <div className="pt-32 pb-24 min-h-screen bg-black">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="hero-grid absolute inset-0" />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "radial-gradient(ellipse 85% 60% at 50% 0%, transparent 35%, #000 100%)",
            }}
          />
        </div>
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: 520,
            height: 420,
            background:
              "radial-gradient(ellipse at 0% 0%,rgba(0,255,127,.05) 0%,transparent 65%)",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
          <div className="mb-14 relative pb-8">
            <div className="pg-hline" />
            <RevealOnScroll>
              <p className="pg-eyebrow">ONLY FOSS ORG</p>
              <h1
                className="font-display font-bold text-white jersey-25-regular mb-5"
                style={{
                  fontSize: "clamp(2.8rem,7vw,5.5rem)",
                  lineHeight: 1.0,
                  letterSpacing: "0.02em",
                }}
              >
                <GlitchText text="Events" speed={40} />
              </h1>
              <p
                className="text-gray-400 font-mono text-base leading-relaxed"
                style={{
                  borderLeft: "2px solid rgba(0,255,127,.2)",
                  paddingLeft: "1rem",
                }}
              >
                Join us for workshops, meetups, and contribution sprints. Learn,
                connect, and grow with the FOSS community.
              </p>
            </RevealOnScroll>
          </div>

          {hasEvents ? (
            <RevealOnScroll delay={100}>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-14">
                {events.map((event) => (
                  <EventCard key={event.meta.slug} event={event} />
                ))}
              </div>
            </RevealOnScroll>
          ) : (
            <RevealOnScroll delay={100}>
              <div
                style={{
                  border: "1px solid rgba(255,255,255,.07)",
                  background: "rgba(255,255,255,.02)",
                  padding: "5rem 2rem",
                  textAlign: "center",
                  position: "relative",
                  marginBottom: "3rem",
                }}
              >
                <span
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: 14,
                    height: 14,
                    borderTop: "1px solid rgba(0,255,127,.3)",
                    borderLeft: "1px solid rgba(0,255,127,.3)",
                  }}
                />
                <span
                  style={{
                    position: "absolute",
                    bottom: 0,
                    right: 0,
                    width: 14,
                    height: 14,
                    borderBottom: "1px solid rgba(0,255,127,.3)",
                    borderRight: "1px solid rgba(0,255,127,.3)",
                  }}
                />
                <div
                  className="cal-icon mb-6 inline-flex items-center justify-center"
                  style={{
                    width: 56,
                    height: 56,
                    border: "1px solid rgba(0,255,127,.2)",
                    background: "rgba(0,255,127,.04)",
                  }}
                >
                  <Calendar className="w-6 h-6 text-foss-green" />
                </div>
                <p
                  className="empty-glyph"
                  style={{
                    fontFamily: '"Jersey 25",monospace',
                    fontSize: "clamp(1.3rem,3vw,1.9rem)",
                    color: "rgba(255,255,255,.3)",
                    letterSpacing: ".06em",
                    marginBottom: ".4rem",
                  }}
                >
                  NO EVENTS SCHEDULED YET
                </p>
                <p className="text-gray-700 font-mono text-xs tracking-widest">
                  STAY TUNED — SOMETHING IS COMING
                </p>
              </div>
            </RevealOnScroll>
          )}

          <RevealOnScroll delay={200}>
            <div className="ev-cta">
              <span
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: 14,
                  height: 14,
                  borderTop: "1px solid rgba(0,255,127,.55)",
                  borderLeft: "1px solid rgba(0,255,127,.55)",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  top: "-25%",
                  right: "-10%",
                  width: 280,
                  height: 280,
                  background:
                    "radial-gradient(circle,rgba(0,255,127,.08) 0%,transparent 70%)",
                  pointerEvents: "none",
                }}
              />
              <p className="pg-eyebrow">ORGANIZE</p>
              <h3
                style={{
                  fontFamily: '"Jersey 25",monospace',
                  fontSize: "clamp(1.6rem,3.5vw,2.2rem)",
                  letterSpacing: ".04em",
                  color: "#fff",
                  marginBottom: ".8rem",
                }}
              >
                Want to organize an event?
              </h3>
              <p
                className="text-gray-400 font-mono text-sm leading-relaxed mb-6"
                style={{ maxWidth: "34rem" }}
              >
                We're always looking for community members to lead workshops and
                talks. Have an idea? Let's make it happen!
              </p>
              <a
                href="mailto:onlyfoss.org@gmail.com"
                className="inline-flex items-center gap-2 px-6 py-3 bg-foss-green text-black font-mono text-sm font-bold hover:bg-foss-green/90 transition-colors"
              >
                Propose an Event <ArrowUpRight className="w-4 h-4" />
              </a>
            </div>
          </RevealOnScroll>
        </div>
      </div>
    </>
  );
}

export default Events;
