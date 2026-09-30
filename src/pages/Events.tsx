import { Calendar, ArrowUpRight } from "lucide-react";
import RevealOnScroll from "../components/RevealOnScroll";
import GlitchText from "../components/GlitchText";
import { getAllEvents } from "../lib/loadEvents";
import EventCard from "../components/events/EventCard";

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
