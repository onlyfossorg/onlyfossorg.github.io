import React from "react";
import { Calendar, ArrowUpRight } from "lucide-react";
import RevealOnScroll from "../components/RevealOnScroll";
import GlitchText from "../components/GlitchText";

// ─── COMMENTED-OUT TYPES & DATA (ready to enable when events are added) ───────
// type EventType = "Workshop" | "Meetup" | "Conference" | "Webinar" | "All";
// interface Event {
//     id: string; title: string; date: string; type: EventType;
//     location: string; description: string; registrationLink?: string;
//     status: "upcoming" | "past"; attendees?: number;
// }
// const EVENTS: Event[] = [
//     { id:"1", title:"Open Source Workshop: Git & GitHub", date:"2026-03-15", type:"Workshop",
//       location:"Community Lab", status:"upcoming", attendees:45, registrationLink:"#",
//       description:"Learn the fundamentals of Git version control and GitHub collaboration." },
//     { id:"2", title:"FOSS Community Meetup", date:"2026-02-20", type:"Meetup",
//       location:"Community meetup", status:"past", attendees:32,
//       description:"Monthly community gathering to discuss ongoing projects." },
// ];
// ─────────────────────────────────────────────────────────────────────────────

const Events: React.FC = () => (
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
        {/* HEADER */}
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
              Join us for workshops, meetups, and conferences. Learn, connect,
              and grow with the FOSS community.
            </p>
          </RevealOnScroll>
        </div>

        {/* ── Uncomment this section + EventCard below when events are added ──
        <RevealOnScroll delay={100}>
          <div className="mb-10 border border-white/10 bg-white/[0.02] p-5">
            <div className="flex items-center gap-3 mb-3">
              <Filter className="w-4 h-4 text-gray-500" />
              <span className="text-xs text-gray-500 font-mono uppercase tracking-wider">Filter by Type</span>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {(["All","Workshop","Meetup","Conference","Webinar"] as EventType[]).map(type => (
                <button key={type} onClick={() => setFilterType(type)}
                  className={`px-4 py-2 text-sm font-mono border whitespace-nowrap transition-all duration-200 ${
                    filterType === type
                      ? "bg-foss-green text-black border-foss-green shadow-[0_0_12px_rgba(0,255,127,0.2)]"
                      : "text-gray-400 border-white/10 hover:border-white/30 hover:text-white"
                  }`}>{type}</button>
              ))}
            </div>
          </div>
        </RevealOnScroll>

        {upcomingEvents.length > 0 && (
          <section className="mb-14">
            <div className="flex items-center gap-3 mb-6">
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-foss-green" style={{ boxShadow:"0 0 0 0 rgba(0,255,127,.3)" }} />
              <p style={{ fontFamily:'"Jersey 25",monospace', fontSize:"1rem", letterSpacing:".08em", color:"rgba(255,255,255,.55)" }}>UPCOMING</p>
            </div>
            <div className="grid md:grid-cols-2 gap-5">
              {upcomingEvents.map(ev => <EventCard key={ev.id} event={ev} />)}
            </div>
          </section>
        )}

        {pastEvents.length > 0 && (
          <section className="mb-14">
            <div className="flex items-center gap-3 mb-6">
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-gray-600" />
              <p style={{ fontFamily:'"Jersey 25",monospace', fontSize:"1rem", letterSpacing:".08em", color:"rgba(255,255,255,.35)" }}>PAST EVENTS</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {pastEvents.map(ev => <EventCard key={ev.id} event={ev} compact />)}
            </div>
          </section>
        )}
        ── */}

        {/* EMPTY STATE */}
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

        {/* CTA */}
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

// ── EventCard (uncomment when events go live) ─────────────────────────────
// const EventCard: React.FC<{ event: Event; compact?: boolean }> = ({ event, compact=false }) => {
//   const isPast = event.status === "past";
//   const formattedDate = new Date(event.date).toLocaleDateString("en-US",{ month:"short", day:"numeric", year:"numeric" });
//   return (
//     <div style={{ border:`1px solid ${isPast?"rgba(255,255,255,.07)":"rgba(0,255,127,.15)"}`, background:"rgba(255,255,255,.02)", padding:"1.8rem", position:"relative", opacity:isPast?.7:1, transition:"border-color .2s" }}
//       className="hover:border-foss-green/30">
//       <div className="flex items-center justify-between mb-4">
//         <span style={{ padding:"3px 10px", border:"1px solid rgba(0,255,127,.2)", fontFamily:"monospace", fontSize:".6rem", letterSpacing:".15em", color:"rgba(0,255,127,.7)", background:"rgba(0,255,127,.05)" }}>{event.type}</span>
//         {isPast && <span className="text-xs text-gray-600 font-mono">PAST</span>}
//       </div>
//       <h3 style={{ fontFamily:'"Jersey 25",monospace', fontSize:"1.15rem", letterSpacing:".04em", color:"#fff", marginBottom:".7rem" }}>{event.title}</h3>
//       <div className="text-gray-500 font-mono text-xs mb-4 flex flex-col gap-1.5">
//         <span>📅 {formattedDate}</span>
//         <span>📍 {event.location}</span>
//         {event.attendees && <span>👥 {event.attendees} attendees</span>}
//       </div>
//       {!compact && <p className="text-gray-500 font-mono text-xs leading-relaxed mb-4">{event.description}</p>}
//       {event.registrationLink && !isPast && (
//         <a href={event.registrationLink} className="inline-flex items-center gap-1.5 text-foss-green font-mono text-xs hover:underline">
//           Register Now <ExternalLink className="w-3 h-3" />
//         </a>
//       )}
//     </div>
//   );
// };
// ─────────────────────────────────────────────────────────────────────────────

export default Events;
