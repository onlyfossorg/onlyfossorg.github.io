import React from "react";
import {
  Github,
  Mail,
  ArrowUpRight,
  Terminal,
  ExternalLink,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import RevealOnScroll from "../components/RevealOnScroll.tsx";
import fossLogo from "../assets/of-1-1-green-s.svg";

/* ─── link row ─── */
const FooterLink: React.FC<{
  to?: string;
  href?: string;
  external?: boolean;
  children: React.ReactNode;
}> = ({ to, href, external, children }) => {
  const cls =
    "footer-link group flex items-center justify-between w-full py-3 px-0 " +
    "border-b border-white/10 hover:border-foss-green/40 " +
    "transition-all duration-300 text-[0.95rem] text-white/85 " +
    "hover:text-foss-green font-mono tracking-wide";

  const inner = (
    <>
      <span>{children}</span>
      {external ? (
        <ExternalLink className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-foss-green" />
      ) : (
        <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 text-foss-green" />
      )}
    </>
  );

  if (href)
    return (
      <a
        href={href}
        target={external ? "_blank" : undefined}
        rel="noopener noreferrer"
        className={cls}
      >
        {inner}
      </a>
    );
  return (
    <NavLink to={to!} className={cls}>
      {inner}
    </NavLink>
  );
};

/* ═══════════════════════════════════════════════════
   MAIN FOOTER
═══════════════════════════════════════════════════ */
const Footer: React.FC = () => {
  return (
    <>
      <style>{`
        /* ---- hover glitch on links ---- */
        @keyframes btn-glitch-hover {
          0%   { text-shadow: none; }
          20%  { text-shadow: -2px 0 rgba(255,0,255,.7), 2px 0 rgba(0,255,255,.7); }
          40%  { text-shadow:  2px 0 rgba(255,0,255,.5),-2px 0 rgba(0,255,255,.5); }
          70%  { text-shadow: -1px 0 rgba(255,0,255,.3), 1px 0 rgba(0,255,255,.3); }
          100% { text-shadow: none; }
        }
        .footer-link:hover span { animation: btn-glitch-hover 0.3s steps(1) both; }

        /* ---- scanlines ---- */
        .footer-noise::before {
          content: "";
          position: absolute; inset: 0;
          pointer-events: none; z-index: 0;
          background-image: repeating-linear-gradient(
            0deg,
            rgba(0,0,0,0.04) 0px, rgba(0,0,0,0.04) 1px,
            transparent 1px, transparent 2px
          );
        }

        /* ---- horizontal glow lines ---- */
        .footer-grid-line {
          position: absolute;
          background: linear-gradient(90deg, transparent, rgba(0,255,127,.07), transparent);
          height: 1px; left: 0; right: 0;
          pointer-events: none;
        }

        /* ---- logo idle glitch ---- */
        @keyframes logo-glitch-idle {
          0%,88%,100% { filter: none; transform: none; }
          90% { filter: drop-shadow(-2px 0 rgba(255,0,255,.7)) drop-shadow(2px 0 rgba(0,255,255,.7));
                transform: skewX(-1deg) translateX(2px); }
          93% { filter: drop-shadow(2px 0 rgba(255,0,255,.5)) drop-shadow(-2px 0 rgba(0,255,255,.5));
                transform: skewX(1deg) translateX(-1px); }
          96% { filter: none; transform: none; }
        }
        .logo-glitch { animation: logo-glitch-idle 5s steps(1) infinite; }

        /* ---- terminal cursor blink ---- */
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        .blink { animation: blink 1s step-end infinite; }

        /* ---- status dot pulse ---- */
        @keyframes dot-pulse {
          0%,100% { box-shadow: 0 0 0 0   rgba(0,255,127,.6); }
          50%      { box-shadow: 0 0 0 6px rgba(0,255,127,0); }
        }
        .status-dot { animation: dot-pulse 2s ease-in-out infinite; }

        /* ---- social icon buttons ---- */
        .social-btn {
          display: flex; align-items: center; justify-content: center;
          width: 38px; height: 38px;
          border: 1px solid rgba(255,255,255,.12);
          color: rgba(255,255,255,.45);
          transition: all 0.2s;
          position: relative; overflow: hidden;
        }
        .social-btn::after {
          content: "";
          position: absolute; inset: 0;
          background: #00ff7f;
          transform: translateY(100%);
          transition: transform 0.22s cubic-bezier(.2,.8,.2,1);
        }
        .social-btn:hover { border-color: #00ff7f; color: #000; }
        .social-btn:hover::after { transform: translateY(0); }
        .social-btn svg, .social-btn span { position: relative; z-index: 1; }

        /* ---- column heading — white, Jersey 25, with green rule ---- */
        .col-heading {
          font-family: "Jersey 25", monospace;
          font-size: 1.1rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #ffffff;
          margin-bottom: 1.1rem;
          display: flex;
          align-items: center;
          gap: 0.6rem;
        }
        .col-heading::before {
          content: "";
          display: inline-block;
          width: 18px; height: 2px;
          background: #00ff7f;
          flex-shrink: 0;
        }

        /* ---- corner accents on bottom bar ---- */
        .corner-accent {
          position: absolute;
          width: 14px; height: 14px;
          pointer-events: none;
        }
        .corner-accent.tl { top:0; left:0;  border-top:  1px solid rgba(0,255,127,.4); border-left:  1px solid rgba(0,255,127,.4); }
        .corner-accent.tr { top:0; right:0; border-top:  1px solid rgba(0,255,127,.4); border-right: 1px solid rgba(0,255,127,.4); }
      `}</style>

      <footer className="footer-noise relative bg-black border-t border-white/10 overflow-hidden">
        {/* decorative horizontal glow lines */}
        <div className="footer-grid-line" style={{ top: "30%" }} />
        <div className="footer-grid-line" style={{ top: "70%" }} />

        {/* ambient green glow top-left */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: 520,
            height: 360,
            background:
              "radial-gradient(ellipse at 0% 0%, rgba(0,255,127,0.06) 0%, transparent 70%)",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />

        {/* py-16 = equal vertical padding top & bottom, fixing the "stuck to top" look */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-16">
          {/* ══ MAIN GRID ══ */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 mb-14 items-start">
            {/* ── BRAND — 5 cols ── */}
            <div className="md:col-span-5">
              <RevealOnScroll>
                {/* Logo + wordmark */}
                <div className="flex items-center gap-3 mb-6">
                  <div className="relative flex-shrink-0">
                    <div
                      style={{
                        position: "absolute",
                        inset: -8,
                        background:
                          "radial-gradient(circle, rgba(0,255,127,.14) 0%, transparent 70%)",
                        borderRadius: "50%",
                        pointerEvents: "none",
                      }}
                    />
                    <img
                      src={fossLogo}
                      alt="ONLY FOSS ORG"
                      className="logo-glitch relative z-10"
                      style={{ width: 46, height: 46, objectFit: "contain" }}
                    />
                  </div>
                  <div>
                    <p
                      style={{
                        fontFamily: '"Jersey 25", monospace',
                        fontSize: "1.5rem",
                        lineHeight: 1,
                        color: "#ffffff",
                        letterSpacing: "0.05em",
                      }}
                    >
                      ONLY FOSS ORG
                    </p>
                    <p
                      style={{
                        fontFamily: "monospace",
                        fontSize: "0.58rem",
                        letterSpacing: "0.2em",
                        color: "rgba(0,255,127,.6)",
                        marginTop: 3,
                      }}
                    >
                      FREE &amp; OPEN SOURCE COMMUNITY
                    </p>
                  </div>
                </div>

                {/* tagline */}
                <p
                  className="text-gray-400 font-mono text-sm leading-relaxed mb-6"
                  style={{
                    borderLeft: "2px solid rgba(0,255,127,.28)",
                    paddingLeft: "0.9rem",
                    maxWidth: "22rem",
                  }}
                >
                  BUILDING THE FUTURE OF OPEN SOURCE.
                </p>

                {/* terminal line */}
                <div
                  className="font-mono text-xs mb-7 px-3 py-2.5 border border-white/5"
                  style={{
                    background: "rgba(0,255,127,.03)",
                    color: "rgba(0,255,127,.5)",
                  }}
                >
                  <Terminal className="inline w-3 h-3 mr-2 opacity-60" />
                  onlyfossorg@github:~${" "}
                  <span style={{ color: "rgba(0,255,127,.85)" }}>
                    git commit --open-source
                  </span>
                  <span className="blink ml-0.5">▌</span>
                </div>

                {/* social buttons */}
                <div className="flex items-center gap-3">
                  <a
                    href="https://github.com/onlyfossorg"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-btn"
                    aria-label="GitHub"
                  >
                    <Github className="w-4 h-4" />
                  </a>
                  <a
                    href="https://discord.gg/CXNustDut3"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-btn"
                    aria-label="Discord"
                  >
                    <svg
                      role="img"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-4 h-4"
                    >
                      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037 c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.118.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                    </svg>
                  </a>
                  <a
                    href="mailto:onlyfoss.org@gmail.com"
                    className="social-btn"
                    aria-label="Email"
                  >
                    <Mail className="w-4 h-4" />
                  </a>
                </div>
              </RevealOnScroll>
            </div>

            {/* ── COMMUNITY — cols 7–9 ── */}
            <div className="md:col-span-3 md:col-start-7">
              <RevealOnScroll delay={150}>
                <div className="col-heading">Community</div>
                <nav className="flex flex-col">
                  <FooterLink href="https://discord.gg/CXNustDut3" external>
                    Join Discord
                  </FooterLink>
                  <FooterLink to="/code-of-conduct">Code of Conduct</FooterLink>
                  <FooterLink to="/events">Events</FooterLink>
                  <FooterLink to="/hackathons">Hackathons</FooterLink>
                </nav>
              </RevealOnScroll>
            </div>

            {/* ── RESOURCES — cols 10–12 ── */}
            <div className="md:col-span-3">
              <RevealOnScroll delay={250}>
                <div className="col-heading">Resources</div>
                <nav className="flex flex-col">
                  <FooterLink to="/documentation">Documentation</FooterLink>
                  <FooterLink href="https://github.com/onlyfossorg" external>
                    GitHub Org
                  </FooterLink>
                  <FooterLink to="/project-guidelines">
                    Project Guidelines
                  </FooterLink>
                  <FooterLink href="mailto:onlyfoss.org@gmail.com">
                    Contact Us
                  </FooterLink>
                </nav>
              </RevealOnScroll>
            </div>
          </div>

          {/* ══ BOTTOM BAR ══ */}
          <RevealOnScroll delay={350}>
            <div
              className="relative pt-6 pb-2 flex flex-col md:flex-row justify-between items-center gap-4"
              style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}
            >
              <span className="corner-accent tl" />
              <span className="corner-accent tr" />

              {/* copyright */}
              <div className="flex items-center gap-2.5">
                <span
                  className="status-dot inline-block w-2 h-2 rounded-full flex-shrink-0"
                  style={{ background: "#00ff7f" }}
                />
                <p className="text-gray-500 text-xs font-mono tracking-wider">
                  © {new Date().getFullYear()} ONLY FOSS ORG.{" "}
                  <span style={{ color: "rgba(0,255,127,.5)" }}>
                    Open source forever.
                  </span>
                </p>
              </div>

              {/* made with */}
              <p className="text-gray-600 text-xs font-mono tracking-widest">
                DESIGNED WITH <span style={{ color: "#00ff7f" }}>💚</span> BY
                FOSS TEAM
              </p>

              {/* license badge */}
              <div
                className="font-mono text-xs px-3 py-1 border"
                style={{
                  borderColor: "rgba(0,255,127,.22)",
                  color: "rgba(0,255,127,.55)",
                  background: "rgba(0,255,127,.03)",
                  letterSpacing: "0.12em",
                }}
              >
                MIT LICENSE
              </div>
            </div>
          </RevealOnScroll>
        </div>
      </footer>
    </>
  );
};

export default Footer;
