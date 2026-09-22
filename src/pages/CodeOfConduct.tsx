import React from "react";
import { Shield, Users, AlertTriangle, Mail } from "lucide-react";
import RevealOnScroll from "../components/RevealOnScroll";
import GlitchText from "../components/GlitchText";

const ENFORCEMENT = [
  {
    step: "01",
    title: "Correction",
    impact: "Use of inappropriate language or unprofessional behavior.",
    consequence:
      "A private, written warning with clarity of violation and explanation.",
  },
  {
    step: "02",
    title: "Warning",
    impact: "A violation through a single incident or series of actions.",
    consequence:
      "A warning with consequences for continued behavior. No interaction with involved parties for a specified period.",
  },
  {
    step: "03",
    title: "Temporary Ban",
    impact: "A serious violation of community standards.",
    consequence:
      "Temporary ban from any sort of interaction or public communication with the community.",
  },
  {
    step: "04",
    title: "Permanent Ban",
    impact: "Demonstrating a pattern of violation or severe incident.",
    consequence:
      "Permanent ban from any sort of public interaction within the community.",
  },
];

const CodeOfConduct: React.FC = () => (
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

      .coc-card {
        border:1px solid rgba(255,255,255,.08); background:rgba(255,255,255,.02);
        padding:2rem; position:relative; overflow:hidden;
        transition:border-color .25s;
      }
      .coc-card:hover { border-color:rgba(0,255,127,.2); }
      .coc-card::before {
        content:""; position:absolute; top:0; left:0; width:14px; height:14px;
        border-top:1px solid rgba(0,255,127,0); border-left:1px solid rgba(0,255,127,0);
        transition:border-color .3s;
      }
      .coc-card:hover::before { border-top-color:rgba(0,255,127,.5); border-left-color:rgba(0,255,127,.5); }

      .coc-list-item {
        display:flex; align-items:flex-start; gap:.55rem;
        font-family:monospace; font-size:.82rem; color:rgba(255,255,255,.52);
        padding:.42rem 0; border-bottom:1px solid rgba(255,255,255,.04);
      }
      .coc-list-item:last-child { border-bottom:none; }
      .coc-list-item::before { content:"//"; color:rgba(0,255,127,.4); flex-shrink:0; margin-top:1px; }

      .bad-list-item {
        display:flex; align-items:flex-start; gap:.55rem;
        font-family:monospace; font-size:.82rem; color:rgba(255,255,255,.52);
        padding:.42rem 0; border-bottom:1px solid rgba(255,255,255,.04);
      }
      .bad-list-item:last-child { border-bottom:none; }
      .bad-list-item::before { content:"//"; color:rgba(239,68,68,.45); flex-shrink:0; margin-top:1px; }

      .enf-row {
        border-left:1px solid rgba(0,255,127,.14);
        padding-left:1.4rem; margin-bottom:1.6rem; position:relative;
      }
      .enf-row::before {
        content:""; position:absolute; left:-1px; top:0;
        width:1px; height:0; background:#00ff7f; transition:height .45s ease;
      }
      .enf-row:hover::before { height:100%; }

      .icon-box {
        width:38px; height:38px; display:flex; align-items:center;
        justify-content:center; border:1px solid rgba(0,255,127,.2);
        background:rgba(0,255,127,.04); flex-shrink:0;
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

      <div className="relative z-10 max-w-4xl mx-auto px-6 lg:px-8">
        {/* HEADER */}
        <div className="mb-14 relative pb-8">
          <div className="pg-hline" />
          <RevealOnScroll>
            <p className="pg-eyebrow">COMMUNITY STANDARDS</p>
            <h1
              className="font-display font-bold text-white jersey-25-regular mb-5"
              style={{
                fontSize: "clamp(2.6rem,7vw,5rem)",
                lineHeight: 1.0,
                letterSpacing: "0.02em",
              }}
            >
              <GlitchText text="Code of Conduct" speed={40} />
            </h1>
            <p
              className="text-gray-400 font-mono text-base leading-relaxed"
              style={{
                maxWidth: "36rem",
                borderLeft: "2px solid rgba(0,255,127,.2)",
                paddingLeft: "1rem",
              }}
            >
              Our commitment to creating an inclusive and welcoming community
              for everyone.
            </p>
          </RevealOnScroll>
        </div>

        <div className="flex flex-col gap-6">
          {/* 01 — PLEDGE */}
          <RevealOnScroll delay={100}>
            <div className="coc-card">
              <div className="flex items-start gap-4">
                <div className="icon-box text-foss-green">
                  <Shield size={17} />
                </div>
                <div>
                  <p
                    style={{
                      fontFamily: "monospace",
                      fontSize: ".85rem",
                      letterSpacing: ".18em",
                      color: "rgba(0,255,127,.3)",
                      marginBottom: ".35rem",
                    }}
                  >
                    01 / PLEDGE
                  </p>
                  <h2
                    style={{
                      fontFamily: '"Jersey 25",monospace',
                      fontSize: "1.2rem",
                      letterSpacing: ".05em",
                      color: "#fff",
                      marginBottom: ".9rem",
                    }}
                  >
                    Our Pledge
                  </h2>
                  <p className="text-gray-400 font-mono text-sm leading-relaxed mb-3">
                    We as members, contributors, and leaders pledge to make
                    participation in our community a harassment-free experience
                    for everyone, regardless of age, body size, visible or
                    invisible disability, ethnicity, sex characteristics, gender
                    identity and expression, level of experience, education,
                    socio-economic status, nationality, personal appearance,
                    race, religion, or sexual identity and orientation.
                  </p>
                  <p className="text-gray-400 font-mono text-sm leading-relaxed">
                    We pledge to act and interact in ways that contribute to an
                    open, welcoming, diverse, inclusive, and healthy community.
                  </p>
                </div>
              </div>
            </div>
          </RevealOnScroll>

          {/* 02 — STANDARDS */}
          <RevealOnScroll delay={200}>
            <div>
              <p
                style={{
                  fontFamily: "monospace",
                  fontSize: ".85rem",
                  letterSpacing: ".18em",
                  color: "rgba(0,255,127,.3)",
                  marginBottom: ".5rem",
                }}
              >
                02 / STANDARDS
              </p>
              <h2
                style={{
                  fontFamily: '"Jersey 25",monospace',
                  fontSize: "1.2rem",
                  letterSpacing: ".05em",
                  color: "#fff",
                  marginBottom: "1rem",
                }}
              >
                Our Standards
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                {/* Expected */}
                <div className="coc-card">
                  <h3
                    style={{
                      fontFamily: '"Jersey 25",monospace',
                      fontSize: ".95rem",
                      letterSpacing: ".07em",
                      color: "#00ff7f",
                      marginBottom: ".9rem",
                    }}
                  >
                    ✓ Expected Behavior
                  </h3>
                  {[
                    "Using welcoming and inclusive language",
                    "Being respectful of differing viewpoints and experiences",
                    "Gracefully accepting constructive criticism",
                    "Focusing on what is best for the community",
                    "Showing empathy towards other community members",
                    "Giving and receiving feedback professionally",
                  ].map((s) => (
                    <div key={s} className="coc-list-item">
                      {s}
                    </div>
                  ))}
                </div>
                {/* Unacceptable */}
                <div
                  style={{
                    border: "1px solid rgba(239,68,68,.2)",
                    background: "rgba(239,68,68,.02)",
                    padding: "2rem",
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  <h3
                    style={{
                      fontFamily: '"Jersey 25",monospace',
                      fontSize: ".95rem",
                      letterSpacing: ".07em",
                      color: "rgb(248,113,113)",
                      marginBottom: ".9rem",
                      display: "flex",
                      alignItems: "center",
                      gap: ".5rem",
                    }}
                  >
                    <AlertTriangle className="w-4 h-4" /> Unacceptable Behavior
                  </h3>
                  {[
                    "The use of sexualized language or imagery",
                    "Trolling, insulting/derogatory comments, and personal attacks",
                    "Public or private harassment",
                    "Publishing others' private information without permission",
                    "Other conduct which could reasonably be considered inappropriate",
                    "Sustained disruption of community events",
                  ].map((s) => (
                    <div key={s} className="bad-list-item">
                      {s}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </RevealOnScroll>

          {/* 03 — ENFORCEMENT */}
          <RevealOnScroll delay={300}>
            <div className="coc-card">
              <p
                style={{
                  fontFamily: "monospace",
                  fontSize: ".85rem",
                  letterSpacing: ".18em",
                  color: "rgba(0,255,127,.3)",
                  marginBottom: ".35rem",
                }}
              >
                03 / ENFORCEMENT
              </p>
              <h2
                style={{
                  fontFamily: '"Jersey 25",monospace',
                  fontSize: "1.2rem",
                  letterSpacing: ".05em",
                  color: "#fff",
                  marginBottom: "1.4rem",
                }}
              >
                Enforcement Guidelines
              </h2>
              {ENFORCEMENT.map(({ step, title, impact, consequence }) => (
                <div key={step} className="enf-row">
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: ".7rem",
                      marginBottom: ".35rem",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "monospace",
                        fontSize: ".8rem",
                        letterSpacing: ".15em",
                        color: "rgba(0,255,127,.35)",
                      }}
                    >
                      {step}
                    </span>
                    <span
                      style={{
                        fontFamily: '"Jersey 25",monospace',
                        fontSize: ".98rem",
                        letterSpacing: ".05em",
                        color: "#fff",
                      }}
                    >
                      {title}
                    </span>
                  </div>
                  <p className="font-mono text-xs text-gray-500 leading-relaxed">
                    <span style={{ color: "rgba(0,255,127,.55)" }}>
                      Impact:{" "}
                    </span>
                    {impact}
                  </p>
                  <p className="font-mono text-xs text-gray-500 leading-relaxed mt-1">
                    <span style={{ color: "rgba(0,255,127,.55)" }}>
                      Consequence:{" "}
                    </span>
                    {consequence}
                  </p>
                </div>
              ))}
            </div>
          </RevealOnScroll>

          {/* 04 — SCOPE */}
          <RevealOnScroll delay={400}>
            <div className="coc-card">
              <div className="flex items-start gap-4">
                <div className="icon-box text-foss-green">
                  <Users size={17} />
                </div>
                <div>
                  <p
                    style={{
                      fontFamily: "monospace",
                      fontSize: ".85rem",
                      letterSpacing: ".18em",
                      color: "rgba(0,255,127,.3)",
                      marginBottom: ".35rem",
                    }}
                  >
                    04 / SCOPE
                  </p>
                  <h2
                    style={{
                      fontFamily: '"Jersey 25",monospace',
                      fontSize: "1.2rem",
                      letterSpacing: ".05em",
                      color: "#fff",
                      marginBottom: ".7rem",
                    }}
                  >
                    Scope
                  </h2>
                  <p className="text-gray-400 font-mono text-sm mb-4">
                    This Code of Conduct applies within all community spaces,
                    including:
                  </p>
                  {[
                    "GitHub repositories and discussions",
                    "Discord server and community channels",
                    "Events, workshops, and hackathons",
                    "Social media and online platforms representing ONLY FOSS ORG",
                    "Any official communication channels",
                  ].map((s) => (
                    <div key={s} className="coc-list-item">
                      {s}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </RevealOnScroll>

          {/* 05 — REPORTING */}
          <RevealOnScroll delay={500}>
            <div
              style={{
                border: "1px solid rgba(0,255,127,.22)",
                background: "rgba(0,255,127,.04)",
                padding: "2rem",
                position: "relative",
                overflow: "hidden",
              }}
            >
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
              <span
                style={{
                  position: "absolute",
                  bottom: 0,
                  right: 0,
                  width: 14,
                  height: 14,
                  borderBottom: "1px solid rgba(0,255,127,.55)",
                  borderRight: "1px solid rgba(0,255,127,.55)",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  top: "-20%",
                  right: "-10%",
                  width: 260,
                  height: 260,
                  background:
                    "radial-gradient(circle,rgba(0,255,127,.07) 0%,transparent 70%)",
                  pointerEvents: "none",
                }}
              />
              <div className="flex items-start gap-4">
                <div
                  style={{
                    width: 38,
                    height: 38,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "1px solid rgba(0,255,127,.3)",
                    background: "rgba(0,255,127,.07)",
                    flexShrink: 0,
                  }}
                >
                  <Mail className="w-4 h-4 text-foss-green" />
                </div>
                <div>
                  <p
                    style={{
                      fontFamily: "monospace",
                      fontSize: ".85rem",
                      letterSpacing: ".18em",
                      color: "rgba(0,255,127,.3)",
                      marginBottom: ".35rem",
                    }}
                  >
                    05 / REPORTING
                  </p>
                  <h2
                    style={{
                      fontFamily: '"Jersey 25",monospace',
                      fontSize: "1.2rem",
                      letterSpacing: ".05em",
                      color: "#fff",
                      marginBottom: ".8rem",
                    }}
                  >
                    Reporting Issues
                  </h2>
                  <p className="text-gray-400 font-mono text-sm leading-relaxed mb-5">
                    Instances of abusive, harassing, or otherwise unacceptable
                    behavior may be reported to community leaders at:
                  </p>
                  <a
                    href="mailto:onlyfoss.org@gmail.com"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-foss-green text-black font-mono text-sm font-bold hover:bg-foss-green/90 transition-colors"
                  >
                    onlyfoss.org@gmail.com
                  </a>
                  <p className="text-gray-600 font-mono text-xs mt-4">
                    All complaints will be reviewed and investigated promptly
                    and fairly.
                  </p>
                </div>
              </div>
            </div>
          </RevealOnScroll>
        </div>

        {/* attribution */}
        <div className="mt-12 pt-8 border-t border-white/8 text-center">
          <p className="text-gray-600 text-xs font-mono">
            Adapted from the{" "}
            <a
              href="https://www.contributor-covenant.org/version/2/1/code_of_conduct.html"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foss-green hover:underline"
            >
              Contributor Covenant, version 2.1
            </a>
          </p>
        </div>
      </div>
    </div>
  </>
);

export default CodeOfConduct;
