import React from "react";
import { Target, Heart, Code2 } from "lucide-react";
import GlitchText from "../components/GlitchText";
import RevealOnScroll from "../components/RevealOnScroll";

/* ─── Shared design tokens (same across all pages) ───────────────────
   font-display + jersey-25-regular  → Jersey 25 (big headings)
   font-mono                          → monospace (labels, body)
   #00ff7f / foss-green               → green accent
   bg-black                           → base background
   Header pattern: eyebrow → h1 GlitchText → bordered paragraph
   Section cards: 1px rgba border, 0.02 bg, corner bracket on hover
──────────────────────────────────────────────────────────────────── */

const VALUES = [
  {
    Icon: Target,
    idx: "01",
    title: "Our Mission",
    body: "To keep old college projects alive as open source and help students contribute, compete, and ship together.",
  },
  {
    Icon: Code2,
    idx: "02",
    title: "What We Do",
    body: "We open-source old college projects, welcome contributors, and run small competitions and hackathons.",
  },
  {
    Icon: Heart,
    idx: "03",
    title: "Core Values",
    body: "Inclusivity, transparency, and collaboration. No gatekeeping. Everyone is welcome to learn and contribute.",
  },
];

const About: React.FC = () => (
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
        font-family: monospace; font-size: .85rem; letter-spacing: .22em;
        color: rgba(0,255,127,.55); display: flex; align-items: center;
        gap: .5rem; margin-bottom: .6rem;
      }
      .pg-eyebrow::before {
        content: ""; display: inline-block;
        width: 16px; height: 1px; background: rgba(0,255,127,.5);
      }
      .pg-hline {
        position: absolute; bottom: 0; left: 0; height: 1px; width: 100%;
        background: linear-gradient(90deg,#00ff7f 0%,rgba(0,255,127,.1) 60%,transparent 100%);
      }
      .val-card {
        border: 1px solid rgba(255,255,255,.08);
        background: rgba(255,255,255,.02);
        padding: 2rem; height: 100%;
        transition: border-color .25s; position: relative; overflow: hidden;
      }
      .val-card:hover { border-color: rgba(0,255,127,.25); }
      .val-card::before {
        content: ""; position: absolute; top: 0; left: 0;
        width: 14px; height: 14px;
        border-top: 1px solid rgba(0,255,127,0);
        border-left: 1px solid rgba(0,255,127,0);
        transition: border-color .3s;
      }
      .val-card:hover::before {
        border-top-color: rgba(0,255,127,.55);
        border-left-color: rgba(0,255,127,.55);
      }
      .icon-box {
        width: 40px; height: 40px; display: flex; align-items: center;
        justify-content: center; border: 1px solid rgba(0,255,127,.2);
        background: rgba(0,255,127,.04); margin-bottom: 1.2rem;
        transition: transform .3s;
      }
      .val-card:hover .icon-box { transform: scale(1.1); }

      @keyframes team-glitch {
        0%,88%,100% { filter: none; transform: none; }
        90% {
          filter: drop-shadow(-4px 0 rgba(255,0,255,.8)) drop-shadow(4px 0 rgba(0,255,255,.8));
          transform: skewX(-3deg) translateX(5px);
        }
        94% {
          filter: drop-shadow(2px 0 rgba(255,0,255,.5)) drop-shadow(-2px 0 rgba(0,255,255,.5));
          transform: skewX(1deg) translateX(-2px);
        }
        97% { filter: none; transform: none; }
      }
      .team-glitch { animation: team-glitch 5s steps(1) infinite; display: inline-block; }
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
      {/* ambient glow */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: 520,
          height: 420,
          background:
            "radial-gradient(ellipse at 0% 0%,rgba(0,255,127,.055) 0%,transparent 65%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />
      <div className="relative z-10 max-w-6xl mx-auto px-6 lg:px-8">
        {/* ── HEADER ── */}
        <div className="mb-16 relative pb-8">
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
              <GlitchText text="About ONLY FOSS ORG" speed={40} />
            </h1>
            <p
              className="text-gray-400 font-mono text-base leading-relaxed"
              style={{
                borderLeft: "2px solid rgba(0,255,127,.2)",
                paddingLeft: "1rem",
              }}
            >
              An independent community that open-sources old college projects
              and runs small competitions and hackathons so students stay
              engaged.
            </p>
          </RevealOnScroll>
        </div>
        {/* ── VALUE CARDS ── */}
        <div className="grid md:grid-cols-3 gap-px bg-white/5 mb-24">
          {VALUES.map(({ Icon, idx, title, body }, i) => (
            <RevealOnScroll key={idx} delay={(i + 1) * 100}>
              <div className="val-card cursor-pointer">
                <p
                  style={{
                    fontFamily: "monospace",
                    fontSize: ".85rem",
                    letterSpacing: ".2em",
                    color: "rgba(0,255,127,.3)",
                    marginBottom: "1.2rem",
                  }}
                >
                  {idx}
                </p>
                <div className="icon-box text-foss-green">
                  <Icon size={18} />
                </div>
                <h3
                  style={{
                    fontFamily: '"Jersey 25",monospace',
                    fontSize: "1.1rem",
                    letterSpacing: ".05em",
                    marginBottom: ".55rem",
                  }}
                  className="group-hover:text-foss-green transition-colors"
                >
                  {title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed font-mono">
                  {body}
                </p>
              </div>
            </RevealOnScroll>
          ))}
        </div>

        {/* ── TEAM ── */}
        <RevealOnScroll delay={400}>
          <div className="border-t border-white/8 pt-20 text-center">
            <p className="pg-eyebrow justify-center">THE PEOPLE BEHIND IT</p>
            <h2
              style={{
                fontFamily: '"Jersey 25",monospace',
                fontSize: "clamp(1.6rem,3.5vw,2.2rem)",
                color: "#fff",
                letterSpacing: ".04em",
                marginBottom: "1.5rem",
              }}
            >
              Who builds this?
            </h2>
            <div
              className="team-glitch"
              style={{
                fontFamily: '"Jersey 25",monospace',
                fontSize: "clamp(4rem,14vw,9rem)",
                color: "#00ff7f",
                lineHeight: 1,
                letterSpacing: ".02em",
              }}
            >
              <GlitchText text="YOU ALL!" speed={60} />
            </div>
            <p className="text-gray-600 font-mono text-xs mt-4 tracking-widest">
              EVERY CONTRIBUTOR · EVERY COMMIT · EVERY PR
            </p>
          </div>
        </RevealOnScroll>
      </div>
    </div>
  </>
);

export default About;
