import React from "react";
import { ArrowUpRight } from "lucide-react";
import RevealOnScroll from "../components/RevealOnScroll";
import GlitchText from "../components/GlitchText";

const Hackathons: React.FC = () => (
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

      .hk-cta {
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
              <GlitchText text="Hackathons" speed={40} />
            </h1>
            <p
              className="text-gray-400 font-mono text-base leading-relaxed"
              style={{
                borderLeft: "2px solid rgba(0,255,127,.2)",
                paddingLeft: "1rem",
              }}
            >
              Build innovative solutions, collaborate with peers, and showcase
              your skills.
            </p>
          </RevealOnScroll>
        </div>

        {/* HOST CTA (Organize) */}
        <RevealOnScroll delay={100}>
          <div className="hk-cta">
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
              Want to host a hackathon?
            </h3>
            <p
              className="text-gray-400 font-mono text-sm leading-relaxed mb-6"
              style={{ maxWidth: "36rem" }}
            >
              We provide mentorship, resources, and support to help you organize
              successful hackathons. Whether it's a 24-hour sprint or a
              week-long challenge, we've got you covered.
            </p>
            <a
              href="mailto:onlyfoss.org@gmail.com"
              className="inline-flex items-center gap-2 px-6 py-3 bg-foss-green text-black font-mono text-sm font-bold hover:bg-foss-green/90 transition-colors"
            >
              Get in Touch <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>
        </RevealOnScroll>
      </div>
    </div>
  </>
);

export default Hackathons;
