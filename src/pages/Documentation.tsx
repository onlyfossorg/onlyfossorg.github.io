import React from "react";
import {
  Book,
  Code,
  Terminal,
  GitBranch,
  FileText,
  ExternalLink,
  ArrowUpRight,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import RevealOnScroll from "../components/RevealOnScroll";
import GlitchText from "../components/GlitchText";

interface DocSection {
  id: string;
  idx: string;
  title: string;
  icon: React.ReactNode;
  description: string;
  links: Array<{ label: string; url: string; external?: boolean }>;
}

const DOC_SECTIONS: DocSection[] = [
  {
    id: "getting-started",
    idx: "01",
    title: "Getting Started",
    icon: <Book className="w-5 h-5" />,
    description:
      "New to open source or ONLY FOSS ORG? Start here to learn the basics.",
    links: [
      {
        label: "What is Open Source?",
        url: "https://opensource.guide/",
        external: true,
      },
      { label: "How to Contribute", url: "/community" },
      {
        label: "Finding Your First Issue",
        url: "https://github.com/onlyfossorg",
        external: true,
      },
      {
        label: "Join Our Discord",
        url: "https://discord.gg/CXNustDut3",
        external: true,
      },
    ],
  },
  {
    id: "git-github",
    idx: "02",
    title: "Git & GitHub",
    icon: <GitBranch className="w-5 h-5" />,
    description: "Master version control and collaboration workflows.",
    links: [
      {
        label: "Git Basics Tutorial",
        url: "https://git-scm.com/book/en/v2",
        external: true,
      },
      {
        label: "GitHub Flow",
        url: "https://guides.github.com/introduction/flow/",
        external: true,
      },
      {
        label: "Pull Request Best Practices",
        url: "https://github.blog/developer-skills/github/how-to-write-the-perfect-pull-request/",
        external: true,
      },
      {
        label: "ONLY FOSS ORG GitHub Org",
        url: "https://github.com/onlyfossorg",
        external: true,
      },
    ],
  },
  {
    id: "contributing",
    idx: "03",
    title: "Contributing to Projects",
    icon: <Code className="w-5 h-5" />,
    description: "Guidelines for contributing code, documentation, and more.",
    links: [
      { label: "Project Guidelines", url: "/project-guidelines" },
      { label: "Code of Conduct", url: "/code-of-conduct" },
      {
        label: "awesome-foss Contributing Guide",
        url: "https://github.com/onlyfossorg/awesome-foss/blob/main/CONTRIBUTING.md",
        external: true,
      },
      {
        label: "Issue Templates",
        url: "https://github.com/onlyfossorg",
        external: true,
      },
    ],
  },
  {
    id: "development",
    idx: "04",
    title: "Development Setup",
    icon: <Terminal className="w-5 h-5" />,
    description: "Set up your local environment and tools.",
    links: [
      {
        label: "Node.js Installation",
        url: "https://nodejs.org/",
        external: true,
      },
      {
        label: "Python Setup",
        url: "https://www.python.org/downloads/",
        external: true,
      },
      {
        label: "VS Code Extensions",
        url: "https://code.visualstudio.com/docs/editor/extension-marketplace",
        external: true,
      },
      {
        label: "Docker Getting Started",
        url: "https://docs.docker.com/get-started/",
        external: true,
      },
    ],
  },
];

const Documentation: React.FC = () => (
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

      .doc-card {
        border:1px solid rgba(255,255,255,.08); background:rgba(255,255,255,.02);
        padding:2rem; height:100%; transition:border-color .25s; position:relative; overflow:hidden;
      }
      .doc-card:hover { border-color:rgba(0,255,127,.25); }
      .doc-card::before {
        content:""; position:absolute; top:0; left:0; width:14px; height:14px;
        border-top:1px solid rgba(0,255,127,0); border-left:1px solid rgba(0,255,127,0);
        transition:border-color .3s;
      }
      .doc-card:hover::before { border-top-color:rgba(0,255,127,.5); border-left-color:rgba(0,255,127,.5); }

      .doc-link {
        display:flex; align-items:center; gap:.5rem;
        font-family:monospace; font-size:.82rem; color:rgba(0,255,127,.7);
        padding:.45rem 0; border-bottom:1px solid rgba(255,255,255,.04);
        transition:color .2s;
      }
      .doc-link:hover { color:#00ff7f; }
      .doc-link:last-child { border-bottom:none; }

      .quick-link {
        display:block; padding:1.1rem 1.3rem;
        border:1px solid rgba(255,255,255,.08); background:rgba(255,255,255,.02);
        transition:all .2s;
      }
      .quick-link:hover { border-color:rgba(0,255,127,.35); background:rgba(0,255,127,.03); }

      .icon-box {
        width:38px; height:38px; display:flex; align-items:center;
        justify-content:center; border:1px solid rgba(0,255,127,.2);
        background:rgba(0,255,127,.04); flex-shrink:0; color:#00ff7f;
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

      <div className="relative z-10 max-w-6xl mx-auto px-6 lg:px-8">
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
              <GlitchText text="Documentation" speed={40} />
            </h1>
            <p
              className="text-gray-400 font-mono text-base leading-relaxed"
              style={{
                maxWidth: "36rem",
                borderLeft: "2px solid rgba(0,255,127,.2)",
                paddingLeft: "1rem",
              }}
            >
              Everything you need to get started with ONLY FOSS ORG. From basics to
              advanced workflows.
            </p>
          </RevealOnScroll>
        </div>

        {/* QUICK LINKS */}
        <RevealOnScroll delay={100}>
          <div
            style={{
              border: "1px solid rgba(0,255,127,.2)",
              background: "rgba(0,255,127,.04)",
              padding: "2rem",
              marginBottom: "3rem",
              position: "relative",
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
            <div className="flex items-center gap-3 mb-4">
              <div className="icon-box">
                <FileText className="w-4 h-4" />
              </div>
              <h2
                style={{
                  fontFamily: '"Jersey 25",monospace',
                  fontSize: "1.2rem",
                  letterSpacing: ".05em",
                  color: "#fff",
                }}
              >
                Quick Links
              </h2>
            </div>
            <div className="grid md:grid-cols-3 gap-3">
              {[
                { to: "/projects", label: "Browse", sub: "Our Projects" },
                {
                  to: "/code-of-conduct",
                  label: "Read",
                  sub: "Code of Conduct",
                },
                { to: "/events", label: "Join", sub: "Upcoming Events" },
              ].map(({ to, label, sub }) => (
                <NavLink key={to} to={to} className="quick-link">
                  <div
                    style={{
                      fontFamily: "monospace",
                      fontSize: ".8rem",
                      letterSpacing: ".18em",
                      color: "rgba(0,255,127,.6)",
                      marginBottom: ".25rem",
                    }}
                  >
                    {label}
                  </div>
                  <div
                    style={{
                      fontFamily: '"Jersey 25",monospace',
                      fontSize: ".98rem",
                      letterSpacing: ".04em",
                      color: "#fff",
                    }}
                  >
                    {sub}
                  </div>
                </NavLink>
              ))}
            </div>
          </div>
        </RevealOnScroll>

        {/* DOC SECTIONS — 2-col */}
        <div className="grid md:grid-cols-2 gap-5 mb-14">
          {DOC_SECTIONS.map((s, i) => (
            <RevealOnScroll key={s.id} delay={150 + i * 80}>
              <div className="doc-card">
                <div className="flex items-start gap-3 mb-4">
                  <div className="icon-box">{s.icon}</div>
                  <div>
                    <p
                      style={{
                        fontFamily: "monospace",
                        fontSize: ".85rem",
                        letterSpacing: ".15em",
                        color: "rgba(0,255,127,.3)",
                        marginBottom: ".2rem",
                      }}
                    >
                      {s.idx}
                    </p>
                    <h2
                      style={{
                        fontFamily: '"Jersey 25",monospace',
                        fontSize: "1.1rem",
                        letterSpacing: ".05em",
                        color: "#fff",
                      }}
                    >
                      {s.title}
                    </h2>
                  </div>
                </div>
                <p className="text-gray-500 font-mono text-xs leading-relaxed mb-4">
                  {s.description}
                </p>
                <div>
                  {s.links.map((lnk, li) =>
                    lnk.external ? (
                      <a
                        key={li}
                        href={lnk.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="doc-link"
                      >
                        {lnk.label}{" "}
                        <ExternalLink className="w-3 h-3 opacity-60 ml-auto" />
                      </a>
                    ) : (
                      <NavLink key={li} to={lnk.url} className="doc-link">
                        {lnk.label}{" "}
                        <ArrowUpRight className="w-3 h-3 opacity-60 ml-auto" />
                      </NavLink>
                    ),
                  )}
                </div>
              </div>
            </RevealOnScroll>
          ))}
        </div>

        {/* HELP */}
        <RevealOnScroll delay={500}>
          <div
            style={{
              border: "1px solid rgba(255,255,255,.08)",
              background: "rgba(255,255,255,.02)",
              padding: "2.5rem",
              textAlign: "center",
              position: "relative",
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
            <p
              style={{
                fontFamily: '"Jersey 25",monospace',
                fontSize: "1.4rem",
                letterSpacing: ".05em",
                color: "#fff",
                marginBottom: ".6rem",
              }}
            >
              Need Help?
            </p>
            <p className="text-gray-500 font-mono text-sm mb-6 max-w-xl mx-auto leading-relaxed">
              Can't find what you're looking for? Join our Discord community or
              reach out via email.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href="https://discord.gg/CXNustDut3"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-foss-green text-black font-mono text-sm font-bold hover:bg-foss-green/90 transition-colors"
              >
                Join Discord
              </a>
              <a
                href="mailto:onlyfoss.org@gmail.com"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-white/10 text-white font-mono text-sm hover:border-foss-green/40 transition-colors"
              >
                Email Us
              </a>
            </div>
          </div>
        </RevealOnScroll>
      </div>
    </div>
  </>
);

export default Documentation;
