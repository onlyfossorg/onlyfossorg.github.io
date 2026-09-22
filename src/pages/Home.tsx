import React from "react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import GlitchText from "../components/GlitchText";
import RevealOnScroll from "../components/RevealOnScroll.tsx";
import Button from "../components/Button";
import { FEATURES } from "../utils/constants";
import { useNavigate, NavLink } from "react-router-dom";

const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <>
      <style>{`
        @keyframes grid-drift {
          0%   { transform: translateY(0); }
          100% { transform: translateY(64px); }
        }
        .hero-grid {
          background-image:
            linear-gradient(to right,  rgba(255,255,255,0.09) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.09) 1px, transparent 1px);
          background-size: 64px 64px;
          animation: grid-drift 14s linear infinite;
        }
        .hero-vline {
          position: absolute; top: 0; bottom: 0; width: 1px;
          background: linear-gradient(180deg, transparent 0%, rgba(0,255,127,.1) 40%, rgba(0,255,127,.1) 60%, transparent 100%);
          pointer-events: none;
        }
        .hero-badge {
          display: inline-flex; align-items: center; gap: 8px;
          border: 1px solid rgba(0,255,127,.2); padding: 5px 14px;
          font-family: monospace; font-size: 0.85rem;
          letter-spacing: 0.18em; color: rgba(0,255,127,.7);
          background: rgba(0,255,127,.04); margin-bottom: 2rem;
        }
        @keyframes badge-pulse {
          0%,100% { box-shadow: 0 0 0 0   rgba(0,255,127,.6); }
          50%      { box-shadow: 0 0 0 5px rgba(0,255,127,0); }
        }
        .badge-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: #00ff7f;
          animation: badge-pulse 2s ease-in-out infinite;
        }
        @keyframes scroll-bounce {
          0%,100% { transform: translateY(0) translateX(-50%); opacity:.4; }
          50%      { transform: translateY(6px) translateX(-50%); opacity:.9; }
        }
        .scroll-hint { animation: scroll-bounce 2s ease-in-out infinite; }

        /* ── Feature card glitch: fires ONCE on hover, no loop ── */
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
        /* forwards = animation fills forward and STOPS — no loop */
        .feature-card:hover {
          animation: feature-card-glitch 0.6s cubic-bezier(.19,1,.22,1) forwards;
        }

        .cta-section { position: relative; background: #00ff7f; overflow: hidden; }
        .cta-section::before {
          content: ""; position: absolute; inset: 0;
          background-image:
            linear-gradient(to right,  rgba(0,0,0,0.07) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0,0,0,0.07) 1px, transparent 1px);
          background-size: 40px 40px;
        }
        @keyframes cta-btn-glitch {
          0%,100% { box-shadow: none; transform: none; }
          25% { box-shadow: -2px 0 rgba(0,0,0,.25), 2px 0 rgba(0,0,0,.25); transform: skewX(-1deg); }
          50% { transform: skewX(1deg); }
          75% { transform: none; }
        }
        .cta-btn:hover { animation: cta-btn-glitch 0.35s steps(1) forwards; }

        .section-eyebrow {
          font-family: monospace; font-size: 0.85rem;
          letter-spacing: 0.22em; color: rgba(0,255,127,.55);
          display: flex; align-items: center; gap: 0.5rem;
          margin-bottom: 0.7rem;
        }
        .section-eyebrow::before {
          content: ""; display: inline-block;
          width: 16px; height: 1px; background: rgba(0,255,127,.5);
        }
      `}</style>

      <div className="w-full">
        {/* ══ HERO ══ */}
        <section className="relative min-h-[92vh] flex flex-col justify-center pt-24 pb-16 overflow-hidden">
          {/* animated grid + vignette */}
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

          <div className="hero-vline" style={{ left: "7%" }} />
          <div className="hero-vline" style={{ right: "7%" }} />

          <div
            style={{
              position: "absolute",
              top: "5%",
              left: "-8%",
              width: 650,
              height: 500,
              background:
                "radial-gradient(ellipse at 0% 50%, rgba(0,255,127,0.065) 0%, transparent 65%)",
              pointerEvents: "none",
            }}
          />

          <div className="relative max-w-7xl mx-auto px-6 lg:px-8 z-10 w-full">
            <div className="max-w-5xl md:ml-32">
              {/* badge */}
              <div className="hero-badge">
                <span className="badge-dot" />
                ONLY FOSS ORG FREE &amp; OPEN SOURCE COMMUNITY
              </div>

              {/* headline — GlitchText unchanged, word-by-word glitch on load */}
              <h1
                className="font-display font-bold tracking-tight leading-[1.05] mb-8 jersey-25-regular"
                style={{ fontSize: "clamp(3rem, 8vw, 7rem)" }}
              >
                <GlitchText
                  text="BUILDING THE"
                  as="span"
                  speed={50}
                  style={{ color: "#ffffff", display: "block" }}
                />
                <GlitchText
                  text="FUTURE OF"
                  as="span"
                  speed={50}
                  wordClassName="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500"
                  style={{ display: "block" }}
                />
                <GlitchText
                  text="OPEN SOURCE."
                  as="span"
                  speed={50}
                  style={{ color: "#00ff7f", display: "block" }}
                />
              </h1>

              {/* subheading */}
              <div
                style={{
                  maxWidth: "40rem",
                  borderLeft: "2px solid rgba(0,255,127,.22)",
                  paddingLeft: "1rem",
                  marginBottom: "2.5rem",
                }}
              >
                <GlitchText
                  text="An independent community that open-sources old college projects and runs small competitions and hackathons. Stop building alone. Join the movement !"
                  as="p"
                  speed={30}
                  className="text-gray-400 font-mono text-lg leading-relaxed"
                  style={{ margin: 0 }}
                />
              </div>

              {/* CTAs */}
              <RevealOnScroll delay={400}>
                <div className="flex flex-col sm:flex-row gap-3">
                  <NavLink to="/projects">
                    <Button variant="primary" size="lg" className="group">
                      Explore Projects
                      <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </NavLink>
                  <NavLink to="/community">
                    <Button variant="outline" size="lg">
                      Join Community
                    </Button>
                  </NavLink>
                </div>
              </RevealOnScroll>
            </div>
          </div>

          {/* <div
            className="scroll-hint absolute bottom-8 left-1/2"
            style={{ fontFamily: "monospace", fontSize: "0.62rem", letterSpacing: "0.2em", color: "rgba(255,255,255,.2)", whiteSpace: "nowrap" }}
          >
            SCROLL ↓
          </div> */}
        </section>

        {/* ══ FEATURES ══ */}
        <section className="py-28 border-t border-white/5">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <RevealOnScroll>
              <div className="mb-14">
                <p className="section-eyebrow">WHY ONLY FOSS ORG</p>
                <h2
                  style={{
                    fontFamily: '"Jersey 25", monospace',
                    fontSize: "clamp(1.8rem, 4vw, 3rem)",
                    color: "#fff",
                    letterSpacing: "0.04em",
                    lineHeight: 1.1,
                  }}
                >
                  BUILT FOR BUILDERS
                </h2>
              </div>
            </RevealOnScroll>

            <div className="grid md:grid-cols-3 gap-px bg-white/10">
              {FEATURES.map((feature, index) => (
                <RevealOnScroll key={index} delay={index * 120}>
                  <div
                    className="feature-card group p-8 bg-black border border-transparent hover:border-foss-green/20 transition-colors duration-300 h-full relative overflow-hidden cursor-pointer"
                    style={{ background: "rgba(0,0,0,.98)" }}
                  >
                    {/* corner accent */}
                    <span
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: 14,
                        height: 14,
                        borderTop: "1px solid rgba(0,255,127,0)",
                        borderLeft: "1px solid rgba(0,255,127,0)",
                        transition: "border-color 0.3s",
                      }}
                      className="group-hover:[border-top-color:rgba(0,255,127,.5)!important] group-hover:[border-left-color:rgba(0,255,127,.5)!important]"
                    />
                    <p
                      style={{
                        fontFamily: "monospace",
                        fontSize: "0.6rem",
                        letterSpacing: "0.2em",
                        color: "rgba(0,255,127,.3)",
                        marginBottom: "1.4rem",
                      }}
                    >
                      {String(index + 1).padStart(2, "0")}
                    </p>
                    <div
                      className="w-10 h-10 flex items-center justify-center mb-5 text-foss-green group-hover:scale-110 transition-transform duration-300"
                      style={{
                        border: "1px solid rgba(0,255,127,.2)",
                        background: "rgba(0,255,127,.04)",
                      }}
                    >
                      <feature.icon size={20} />
                    </div>
                    <h3
                      style={{
                        fontFamily: '"Jersey 25", monospace',
                        fontSize: "1.12rem",
                        letterSpacing: "0.05em",
                        marginBottom: "0.55rem",
                      }}
                      className="group-hover:text-foss-green transition-colors"
                    >
                      {feature.title}
                    </h3>
                    <p className="text-gray-500 text-sm leading-relaxed font-mono group-hover:text-gray-400 transition-colors">
                      {feature.description}
                    </p>
                    {/* <div className="mt-5 flex items-center gap-1.5 text-xs font-mono text-foss-green/0 group-hover:text-foss-green/60 transition-all duration-300 translate-y-1 group-hover:translate-y-0">
                      Learn more <ArrowUpRight className="w-3 h-3" />
                    </div> */}
                  </div>
                </RevealOnScroll>
              ))}
            </div>
          </div>
        </section>

        {/* ══ CTA ══ */}
        <section className="cta-section py-24">
          <RevealOnScroll>
            <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
              <div className="max-w-3xl">
                <p
                  style={{
                    fontFamily: "monospace",
                    fontSize: "1.1rem",
                    letterSpacing: "0.22em",
                    color: "#000",
                    fontWeight: "bold",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.8rem",
                    marginBottom: "1rem",
                  }}
                >
                  <span
                    style={{
                      display: "inline-block",
                      width: 24,
                      height: 2,
                      background: "#000",
                    }}
                  />
                  GET STARTED
                </p>
                <h2
                  style={{
                    fontFamily: '"Jersey 25", monospace',
                    fontSize: "clamp(2.2rem, 6vw, 4.5rem)",
                    color: "#000",
                    letterSpacing: "0.02em",
                    lineHeight: 1.05,
                    marginBottom: "1.1rem",
                  }}
                >
                  READY TO SHIP CODE?
                </h2>
                <p
                  style={{
                    fontFamily: "monospace",
                    fontSize: "1rem",
                    color: "#000",
                    fontWeight: 600,
                    maxWidth: "34rem",
                    lineHeight: 1.6,
                    marginBottom: "2.5rem",
                  }}
                >
                  If you are a builder, an indie hacker, or just a beginner —
                  you are most welcome.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => navigate("/community")}
                    className="cta-btn flex items-center gap-2 bg-black text-white px-8 py-4 font-mono font-bold text-sm tracking-wide hover:bg-gray-900 transition-colors active:scale-95"
                  >
                    Start Contributing <ArrowRight className="w-4 h-4" />
                  </button>
                  <NavLink
                    to="/projects"
                    className="flex items-center justify-center gap-2 px-8 py-4 font-mono font-bold text-sm tracking-wide border-2 border-black/20 text-black/65 hover:border-black/45 hover:text-black transition-all"
                  >
                    View Projects <ArrowUpRight className="w-4 h-4" />
                  </NavLink>
                </div>
              </div>
            </div>
          </RevealOnScroll>
        </section>
      </div>
    </>
  );
};

export default Home;
