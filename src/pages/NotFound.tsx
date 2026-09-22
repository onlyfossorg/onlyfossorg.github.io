import React from "react";
import { Home, Github, Code, ArrowUpRight } from "lucide-react";
import { NavLink } from "react-router-dom";

const NotFound: React.FC = () => (
  <>
    <style>{`
      @keyframes grid-drift { 0%{transform:translateY(0)} 100%{transform:translateY(64px)} }
      .nf-grid {
        background-image:
          linear-gradient(to right,rgba(255,255,255,.09) 1px,transparent 1px),
          linear-gradient(to bottom,rgba(255,255,255,.09) 1px,transparent 1px);
        background-size:64px 64px;
        animation:grid-drift 14s linear infinite;
      }

      @keyframes four-glitch {
        0%,82%,100%{filter:none;transform:none}
        84%{filter:drop-shadow(-4px 0 rgba(255,0,255,.9)) drop-shadow(4px 0 rgba(0,255,255,.9));transform:skewX(-4deg) translateX(6px)}
        87%{clip-path:inset(20% 0 50% 0);transform:skewX(3deg) translateX(-4px)}
        89%{clip-path:inset(55% 0 15% 0);transform:skewX(-2deg) translateX(3px)}
        91%{clip-path:inset(0 0 0 0);transform:skewX(.5deg);filter:none}
        93%{transform:none}
      }
      .nf-4 { animation:four-glitch 4.5s steps(1) infinite; display:inline-block; }

      @keyframes zero-glitch {
        0%,75%,100%{filter:none;transform:none}
        77%{filter:drop-shadow(-3px 0 rgba(255,0,255,.9)) drop-shadow(3px 0 rgba(0,255,255,.9));transform:skewX(-5deg) translateX(7px);clip-path:inset(30% 0 40% 0)}
        80%{clip-path:inset(65% 0 5% 0);transform:skewX(4deg) translateX(-5px)}
        82%{clip-path:inset(8% 0 62% 0);transform:skewX(-2deg)}
        84%{clip-path:inset(0 0 0 0);transform:skewX(1deg);filter:drop-shadow(-2px 0 rgba(255,0,255,.5)) drop-shadow(2px 0 rgba(0,255,255,.5))}
        87%{transform:none;filter:none}
      }
      .nf-0 { animation:zero-glitch 3.5s steps(1) infinite; display:inline-block; color:#00ff7f; }

      @keyframes badge-pulse { 0%,100%{box-shadow:0 0 0 0 rgba(0,255,127,.5)} 50%{box-shadow:0 0 0 6px rgba(0,255,127,0)} }
      .nf-dot { animation:badge-pulse 2s ease-in-out infinite; }

      .nf-btn {
        display:inline-flex; align-items:center; gap:.5rem;
        padding:.75rem 1.5rem; font-family:monospace; font-size:.82rem;
        border:1px solid rgba(255,255,255,.1); color:rgba(255,255,255,.75);
        transition:border-color .2s, color .2s; position:relative; overflow:hidden;
      }
      .nf-btn::after {
        content:""; position:absolute; inset:0;
        background:rgba(0,255,127,.07); transform:scaleX(0); transform-origin:left;
        transition:transform .25s cubic-bezier(.2,.8,.2,1);
      }
      .nf-btn:hover::after { transform:scaleX(1); }
      .nf-btn:hover { border-color:rgba(0,255,127,.4); color:#fff; }
      .nf-btn-primary {
        background:#00ff7f; color:#000; border:none;
        padding:.75rem 1.5rem; font-family:monospace; font-size:.82rem;
        font-weight:700; display:inline-flex; align-items:center; gap:.5rem;
        transition:background .2s;
      }
      .nf-btn-primary:hover { background:rgba(0,255,127,.9); }
    `}</style>

    <div className="min-h-screen bg-black flex items-center justify-center px-6 relative overflow-hidden">
      {/* animated grid */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="nf-grid absolute inset-0" />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse 80% 70% at 50% 50%,transparent 40%,#000 100%)",
          }}
        />
      </div>

      {/* ambient glow */}
      <div
        style={{
          position: "absolute",
          top: "15%",
          left: "8%",
          width: 480,
          height: 380,
          background:
            "radial-gradient(ellipse at 0% 50%,rgba(0,255,127,.065) 0%,transparent 65%)",
          pointerEvents: "none",
        }}
      />

      <div className="relative z-10 max-w-3xl w-full text-center">
        {/* badge */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            border: "1px solid rgba(0,255,127,.2)",
            padding: "5px 14px",
            fontFamily: "monospace",
            fontSize: ".85rem",
            letterSpacing: ".18em",
            color: "rgba(0,255,127,.7)",
            background: "rgba(0,255,127,.04)",
            marginBottom: "2rem",
          }}
        >
          <span
            className="nf-dot"
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "#00ff7f",
              display: "inline-block",
            }}
          />
          ERROR 404 · PAGE NOT FOUND
        </div>

        {/* 404 */}
        <div
          style={{
            fontFamily: '"Jersey 25",monospace',
            fontSize: "clamp(7rem,22vw,15rem)",
            lineHeight: 1,
            letterSpacing: ".02em",
            marginBottom: "1.5rem",
          }}
        >
          <span className="nf-4" style={{ color: "#fff" }}>
            4
          </span>
          <span className="nf-0">0</span>
          <span
            className="nf-4"
            style={{ color: "#fff", animationDelay: ".6s" }}
          >
            4
          </span>
        </div>

        {/* heading */}
        <h2
          style={{
            fontFamily: '"Jersey 25",monospace',
            fontSize: "clamp(1.6rem,4vw,2.5rem)",
            letterSpacing: ".04em",
            color: "#fff",
            marginBottom: "1rem",
          }}
        >
          Lost in the Void?
        </h2>

        {/* subtext */}
        <p
          className="text-gray-500 font-mono text-sm leading-relaxed mb-10 max-w-lg mx-auto"
          style={{
            borderLeft: "2px solid rgba(0,255,127,.18)",
            paddingLeft: "1rem",
            textAlign: "left",
          }}
        >
          Looks like this page took a detour through{" "}
          <code style={{ color: "rgba(0,255,127,.65)" }}>/dev/null</code>. Don't
          worry — even the best developers encounter 404s.
        </p>

        {/* action buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <NavLink to="/">
            <button className="nf-btn-primary">
              <Home className="w-4 h-4" /> Back to Home
            </button>
          </NavLink>
          <NavLink to="/projects">
            <button className="nf-btn">
              <Code className="w-4 h-4" /> Browse Projects
            </button>
          </NavLink>
          <a
            href="https://github.com/onlyfossorg"
            target="_blank"
            rel="noopener noreferrer"
          >
            <button className="nf-btn">
              <Github className="w-4 h-4" /> GitHub{" "}
              <ArrowUpRight className="w-3 h-3 opacity-60" />
            </button>
          </a>
        </div>
      </div>
    </div>
  </>
);

export default NotFound;
