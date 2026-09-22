import React from "react";
import { MessageSquare, Users, Github, ArrowUpRight } from "lucide-react";
import Button from "../components/Button";
import RevealOnScroll from "../components/RevealOnScroll";
import GlitchText from "../components/GlitchText";

const STEPS = [
  {
    n: "01",
    title: "Find a Project",
    body: 'Browse the Projects page. Look for "Help Wanted" tags.',
  },
  {
    n: "02",
    title: "Check Issues",
    body: 'Go to the GitHub repo. Look for "good first issue" labels.',
  },
  {
    n: "03",
    title: "Fork & Clone",
    body: "Fork the repository to your account and clone it locally.",
  },
  {
    n: "04",
    title: "Pull Request",
    body: "Push your changes and open a PR. We'll review it together.",
  },
];

const CHANNELS = [
  {
    Icon: MessageSquare,
    idx: "01",
    title: "Join the Discord",
    body: "The heartbeat of our community. Ask questions, share memes, and find teammates.",
    link: "https://discord.gg/CXNustDut3",
    linkLabel: "discord.gg/CXNustDut3",
    bg: "rgba(99,102,241,.14)",
    ic: "rgb(129,140,248)",
  },
  {
    Icon: Github,
    idx: "02",
    title: "GitHub Organization",
    body: "All our code is public. Star our repos, fork them, and open your first Pull Request.",
    link: "https://github.com/onlyfossorg",
    linkLabel: "github.com/onlyfossorg",
    bg: "rgba(255,255,255,.07)",
    ic: "#ffffff",
  },
  {
    Icon: Users,
    idx: "03",
    title: "Weekly Meetups",
    body: "We meet every Friday at 4 PM in the Lab. Code reviews, tech talks, and pizza.",
    link: null,
    linkLabel: null,
    bg: "rgba(236,72,153,.12)",
    ic: "rgb(244,114,182)",
  },
];

const Community: React.FC = () => (
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

      .ch-card {
        border:1px solid rgba(255,255,255,.08); background:rgba(255,255,255,.02);
        padding:1.8rem; transition:border-color .25s; position:relative; overflow:hidden;
      }
      .ch-card:hover { border-color:rgba(0,255,127,.25); }
      .ch-card::before {
        content:""; position:absolute; top:0; left:0; width:14px; height:14px;
        border-top:1px solid rgba(0,255,127,0); border-left:1px solid rgba(0,255,127,0);
        transition:border-color .3s;
      }
      .ch-card:hover::before { border-top-color:rgba(0,255,127,.5); border-left-color:rgba(0,255,127,.5); }

      .step-row {
        display:flex; gap:1.1rem; align-items:flex-start;
        padding:1rem 0; border-bottom:1px solid rgba(255,255,255,.05);
      }
      .step-row:last-child { border-bottom:none; }
      .step-dot {
        width:8px; height:8px; border-radius:50%; flex-shrink:0; margin-top:5px;
        background:rgba(0,255,127,.2); border:1px solid rgba(0,255,127,.4);
        transition:background .2s, box-shadow .2s;
      }
      .step-row:hover .step-dot { background:#00ff7f; box-shadow:0 0 8px rgba(0,255,127,.6); }
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
        <div className="mb-16 relative pb-8">
          <div className="pg-hline" />
          <RevealOnScroll>
            <p className="pg-eyebrow">ONLY FOSS ORG</p>
            <h1
              className="font-display font-bold text-white jersey-25-regular"
              style={{
                fontSize: "clamp(2.8rem,7vw,5.5rem)",
                lineHeight: 1.0,
                letterSpacing: "0.02em",
                marginBottom: ".1rem",
              }}
            >
              <GlitchText text="Don't Build" speed={40} />
            </h1>
            <h1
              className="font-display font-bold jersey-25-regular"
              style={{
                fontSize: "clamp(2.8rem,7vw,5.5rem)",
                lineHeight: 1.0,
                letterSpacing: "0.02em",
                color: "#00ff7f",
                marginBottom: "1.2rem",
              }}
            >
              <GlitchText text="Alone." speed={40} />
            </h1>
            <p
              className="text-gray-400 font-mono text-base leading-relaxed"
              style={{
                maxWidth: "36rem",
                borderLeft: "2px solid rgba(0,255,127,.2)",
                paddingLeft: "1rem",
              }}
            >
              Coding is better when it's collaborative. ONLY FOSS ORG is an
              independent community — a network of mentors, peers, and friends
              who help each other ship better software. If you are a builder,
              an indie hacker, or just a beginner — you are most welcome.
            </p>
          </RevealOnScroll>
        </div>

        {/* TWO-COL */}
        <div className="grid md:grid-cols-12 gap-10 items-start">
          {/* LEFT — channels */}
          <div className="md:col-span-6 flex flex-col gap-4">
            {CHANNELS.map(
              ({ Icon, idx, title, body, link, linkLabel, bg, ic }, i) => (
                <RevealOnScroll key={idx} delay={i * 100}>
                  <div className="ch-card">
                    <div className="flex items-start gap-4">
                      <div
                        style={{
                          width: 42,
                          height: 42,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          background: bg,
                          flexShrink: 0,
                        }}
                      >
                        <Icon style={{ color: ic }} size={18} />
                      </div>
                      <div className="flex-1">
                        <p
                          style={{
                            fontFamily: "monospace",
                            fontSize: ".85rem",
                            letterSpacing: ".15em",
                            color: "rgba(0,255,127,.3)",
                            marginBottom: ".25rem",
                          }}
                        >
                          {idx}
                        </p>
                        <h3
                          style={{
                            fontFamily: '"Jersey 25",monospace',
                            fontSize: "1.05rem",
                            letterSpacing: ".05em",
                            color: "#fff",
                            marginBottom: ".4rem",
                          }}
                        >
                          {title}
                        </h3>
                        <p className="text-gray-500 font-mono text-sm leading-relaxed mb-3">
                          {body}
                        </p>
                        {link && (
                          <a
                            href={link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-foss-green font-mono text-xs hover:underline"
                          >
                            {linkLabel} <ArrowUpRight className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </RevealOnScroll>
              ),
            )}
          </div>

          {/* RIGHT — how to contribute */}
          <div className="md:col-span-6">
            <RevealOnScroll delay={200}>
              <div
                style={{
                  border: "1px solid rgba(255,255,255,.1)",
                  background: "rgba(255,255,255,.02)",
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
                    borderTop: "1px solid rgba(0,255,127,.4)",
                    borderLeft: "1px solid rgba(0,255,127,.4)",
                  }}
                />
                <span
                  style={{
                    position: "absolute",
                    bottom: 0,
                    right: 0,
                    width: 14,
                    height: 14,
                    borderBottom: "1px solid rgba(0,255,127,.4)",
                    borderRight: "1px solid rgba(0,255,127,.4)",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    top: "-25%",
                    right: "-15%",
                    width: 280,
                    height: 280,
                    background:
                      "radial-gradient(circle,rgba(0,255,127,.07) 0%,transparent 70%)",
                    pointerEvents: "none",
                  }}
                />

                <p className="pg-eyebrow">WORKFLOW</p>
                <h3
                  style={{
                    fontFamily: '"Jersey 25",monospace',
                    fontSize: "1.25rem",
                    letterSpacing: ".05em",
                    color: "#fff",
                    marginBottom: "1.4rem",
                  }}
                >
                  How to Contribute
                </h3>

                {STEPS.map(({ n, title, body }) => (
                  <div key={n} className="step-row">
                    <span
                      style={{
                        fontFamily: "monospace",
                        fontSize: ".8rem",
                        letterSpacing: ".15em",
                        color: "rgba(0,255,127,.3)",
                        flexShrink: 0,
                        paddingTop: 3,
                        width: "2rem",
                      }}
                    >
                      {n}
                    </span>
                    <span className="step-dot" />
                    <div>
                      <p
                        style={{
                          fontFamily: '"Jersey 25",monospace',
                          fontSize: ".92rem",
                          letterSpacing: ".05em",
                          color: "#fff",
                          marginBottom: ".18rem",
                        }}
                      >
                        {title}
                      </p>
                      <p className="text-gray-500 font-mono text-xs leading-relaxed">
                        {body}
                      </p>
                    </div>
                  </div>
                ))}

                <div className="mt-8 pt-6 border-t border-white/8">
                  <p
                    style={{
                      fontFamily: '"Jersey 25",monospace',
                      fontSize: ".98rem",
                      letterSpacing: ".05em",
                      color: "#fff",
                      marginBottom: ".3rem",
                    }}
                  >
                    Got a project idea?
                  </p>
                  <p className="text-gray-500 font-mono text-xs mb-5">
                    Pitch your idea to the community and find teammates.
                  </p>
                  <a
                    href="https://github.com/onlyfossorg/awesome-foss/blob/main/ADD_PROJECT.md"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button className="w-full">Submit Project Idea</Button>
                  </a>
                </div>
              </div>
            </RevealOnScroll>
          </div>
        </div>
      </div>
    </div>
  </>
);

export default Community;
