import React from "react";
import {
  CheckCircle,
  AlertCircle,
  Code2,
  Users,
  FileCode,
  GitPullRequest,
  ArrowUpRight,
} from "lucide-react";
import RevealOnScroll from "../components/RevealOnScroll";
import GlitchText from "../components/GlitchText";

const AVOID = [
  "Committing sensitive information (API keys, passwords, credentials)",
  "Large binary files (use Git LFS if necessary)",
  "Commented-out code (delete it, Git has your back)",
  "Pushing directly to main/master branch (use PRs)",
  'Vague commit messages ("fixed stuff", "updates")',
  "Ignoring linting warnings and errors",
];

const COLLAB = [
  [
    "Communication",
    "Use GitHub issues and discussions for project-related conversations",
  ],
  [
    "Issue Tracking",
    "Create detailed issues with clear descriptions and acceptance criteria",
  ],
  ["Code Reviews", "Be constructive and respectful in reviews"],
  [
    "Labels",
    "Use GitHub labels to categorize issues (bug, enhancement, good first issue, etc.)",
  ],
  ["Milestones", "Track progress with GitHub milestones for releases"],
];

const ProjectGuidelines: React.FC = () => (
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

      .pg-card {
        border:1px solid rgba(255,255,255,.08); background:rgba(255,255,255,.02);
        padding:2rem; transition:border-color .25s; position:relative; overflow:hidden;
      }
      .pg-card:hover { border-color:rgba(0,255,127,.2); }
      .pg-card::before {
        content:""; position:absolute; top:0; left:0; width:14px; height:14px;
        border-top:1px solid rgba(0,255,127,0); border-left:1px solid rgba(0,255,127,0);
        transition:border-color .3s;
      }
      .pg-card:hover::before { border-top-color:rgba(0,255,127,.5); border-left-color:rgba(0,255,127,.5); }

      .icon-box {
        width:38px; height:38px; display:flex; align-items:center;
        justify-content:center; border:1px solid rgba(0,255,127,.2);
        background:rgba(0,255,127,.04); flex-shrink:0; color:#00ff7f;
      }

      .pg-file-item {
        display:flex; align-items:flex-start; gap:.65rem;
        padding:.48rem 0; border-bottom:1px solid rgba(255,255,255,.04);
        font-family:monospace; font-size:.82rem; color:rgba(255,255,255,.52);
      }
      .pg-file-item:last-child { border-bottom:none; }

      .pg-sub-group { margin-bottom:1.4rem; }
      .pg-sub-label {
        font-family:"Jersey 25",monospace; font-size:.92rem; letter-spacing:.06em;
        color:rgba(0,255,127,.8); margin-bottom:.5rem;
      }
      .pg-sub-item {
        display:flex; align-items:flex-start; gap:.5rem;
        font-family:monospace; font-size:.8rem; color:rgba(255,255,255,.45);
        padding:.3rem 0; border-bottom:1px solid rgba(255,255,255,.03);
      }
      .pg-sub-item:last-child { border-bottom:none; }
      .pg-sub-item::before { content:"//"; color:rgba(0,255,127,.35); flex-shrink:0; margin-top:1px; }

      .avoid-item {
        display:flex; align-items:flex-start; gap:.65rem;
        font-family:monospace; font-size:.82rem; color:rgba(255,255,255,.5);
        padding:.46rem 0; border-bottom:1px solid rgba(255,255,255,.04);
      }
      .avoid-item:last-child { border-bottom:none; }

      .collab-item {
        display:flex; align-items:flex-start; gap:.7rem;
        padding:.5rem 0; border-bottom:1px solid rgba(255,255,255,.04);
      }
      .collab-item:last-child { border-bottom:none; }

      .code-block {
        background:rgba(0,0,0,.55); border:1px solid rgba(255,255,255,.08);
        padding:.9rem 1rem; font-family:monospace; font-size:.78rem;
        margin:.6rem 0 0;
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
            <p className="pg-eyebrow">ONLY FOSS ORG</p>
            <h1
              className="font-display font-bold text-white jersey-25-regular mb-5"
              style={{
                fontSize: "clamp(2.4rem,7vw,5rem)",
                lineHeight: 1.0,
                letterSpacing: "0.02em",
              }}
            >
              <GlitchText text="Project Guidelines" speed={40} />
            </h1>
            <p
              className="text-gray-400 font-mono text-base leading-relaxed"
              style={{
                maxWidth: "36rem",
                borderLeft: "2px solid rgba(0,255,127,.2)",
                paddingLeft: "1rem",
              }}
            >
              Best practices and standards for ONLY FOSS ORG projects. Follow these
              to maintain quality and consistency.
            </p>
          </RevealOnScroll>
        </div>

        <div className="flex flex-col gap-6">
          {/* 01 — PROJECT STRUCTURE */}
          <RevealOnScroll delay={100}>
            <div className="pg-card">
              <div className="flex items-start gap-4">
                <div className="icon-box">
                  <FileCode size={17} />
                </div>
                <div className="flex-1">
                  <p
                    style={{
                      fontFamily: "monospace",
                      fontSize: ".85rem",
                      letterSpacing: ".15em",
                      color: "rgba(0,255,127,.3)",
                      marginBottom: ".3rem",
                    }}
                  >
                    01
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
                    Project Structure
                  </h2>
                  <p className="text-gray-500 font-mono text-xs mb-4">
                    Every project should have a clear and organized structure:
                  </p>
                  {[
                    [
                      "README.md",
                      "Project overview, setup instructions, and usage",
                    ],
                    ["CONTRIBUTING.md", "Contribution guidelines"],
                    [
                      "LICENSE",
                      "Open source license (MIT, Apache 2.0, GPL, etc.)",
                    ],
                    [".gitignore", "Files to exclude from version control"],
                    ["package.json / requirements.txt", "Dependencies"],
                  ].map(([file, desc]) => (
                    <div key={file} className="pg-file-item">
                      <CheckCircle className="w-3.5 h-3.5 text-foss-green flex-shrink-0 mt-0.5" />
                      <span>
                        <code
                          style={{
                            color: "rgba(0,255,127,.78)",
                            background: "rgba(0,255,127,.07)",
                            padding: "1px 5px",
                            borderRadius: 2,
                          }}
                        >
                          {file}
                        </code>{" "}
                        &mdash; {desc}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </RevealOnScroll>

          {/* 02 — CODE QUALITY */}
          <RevealOnScroll delay={200}>
            <div className="pg-card">
              <div className="flex items-start gap-4">
                <div className="icon-box">
                  <Code2 size={17} />
                </div>
                <div className="flex-1">
                  <p
                    style={{
                      fontFamily: "monospace",
                      fontSize: ".85rem",
                      letterSpacing: ".15em",
                      color: "rgba(0,255,127,.3)",
                      marginBottom: ".3rem",
                    }}
                  >
                    02
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
                    Code Quality Standards
                  </h2>

                  <div className="pg-sub-group">
                    <div className="pg-sub-label">✓ Write Clean Code</div>
                    {[
                      "Use meaningful variable and function names",
                      "Keep functions small and focused (Single Responsibility Principle)",
                      "Add comments for complex logic, but code should be self-documenting",
                      "Follow language-specific style guides (PEP 8 for Python, ESLint for JavaScript)",
                    ].map((s) => (
                      <div key={s} className="pg-sub-item">
                        {s}
                      </div>
                    ))}
                  </div>

                  <div className="pg-sub-group">
                    <div className="pg-sub-label">✓ Testing</div>
                    {[
                      "Write unit tests for critical functionality",
                      "Aim for at least 70% code coverage",
                      "Test edge cases and error handling",
                      "Include integration tests where applicable",
                    ].map((s) => (
                      <div key={s} className="pg-sub-item">
                        {s}
                      </div>
                    ))}
                  </div>

                  <div className="pg-sub-group" style={{ marginBottom: 0 }}>
                    <div className="pg-sub-label">✓ Documentation</div>
                    {[
                      "Document all public APIs and functions",
                      "Include code examples in documentation",
                      "Keep README up to date with features",
                      "Use inline comments sparingly and only when necessary",
                    ].map((s) => (
                      <div key={s} className="pg-sub-item">
                        {s}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </RevealOnScroll>

          {/* 03 — GIT WORKFLOW */}
          <RevealOnScroll delay={300}>
            <div className="pg-card">
              <div className="flex items-start gap-4">
                <div className="icon-box">
                  <GitPullRequest size={17} />
                </div>
                <div className="flex-1">
                  <p
                    style={{
                      fontFamily: "monospace",
                      fontSize: ".85rem",
                      letterSpacing: ".15em",
                      color: "rgba(0,255,127,.3)",
                      marginBottom: ".3rem",
                    }}
                  >
                    03
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
                    Git Workflow
                  </h2>

                  <div className="pg-sub-group">
                    <div className="pg-sub-label">1. Branch Naming</div>
                    {[
                      ["feature/description", "New features"],
                      ["fix/description", "Bug fixes"],
                      ["docs/description", "Documentation updates"],
                      ["refactor/description", "Code refactoring"],
                    ].map(([cmd, desc]) => (
                      <div key={cmd} className="pg-sub-item">
                        <code
                          style={{
                            color: "rgba(0,255,127,.75)",
                            background: "rgba(0,255,127,.07)",
                            padding: "1px 4px",
                            borderRadius: 2,
                          }}
                        >
                          {cmd}
                        </code>
                        &nbsp;— {desc}
                      </div>
                    ))}
                  </div>

                  <div className="pg-sub-group">
                    <div className="pg-sub-label">2. Commit Messages</div>
                    <p className="text-gray-500 font-mono text-xs mb-2">
                      Follow conventional commits format:
                    </p>
                    <div className="code-block">
                      <div style={{ color: "#00ff7f" }}>
                        type(scope): subject
                      </div>
                      <div
                        style={{ color: "rgba(255,255,255,.2)", marginTop: 4 }}
                      >
                        # Examples:
                      </div>
                      <div style={{ color: "rgba(255,255,255,.5)" }}>
                        feat(auth): add login functionality
                      </div>
                      <div style={{ color: "rgba(255,255,255,.5)" }}>
                        fix(api): resolve null pointer exception
                      </div>
                      <div style={{ color: "rgba(255,255,255,.5)" }}>
                        docs(readme): update installation steps
                      </div>
                    </div>
                  </div>

                  <div className="pg-sub-group" style={{ marginBottom: 0 }}>
                    <div className="pg-sub-label">3. Pull Requests</div>
                    {[
                      "Create focused PRs (one feature/fix per PR)",
                      "Write clear PR descriptions explaining changes",
                      "Link related issues in PR description",
                      "Request reviews from maintainers",
                      "Address review comments promptly",
                    ].map((s) => (
                      <div key={s} className="pg-sub-item">
                        {s}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </RevealOnScroll>

          {/* 04 — COLLABORATION */}
          <RevealOnScroll delay={400}>
            <div className="pg-card">
              <div className="flex items-start gap-4">
                <div className="icon-box">
                  <Users size={17} />
                </div>
                <div className="flex-1">
                  <p
                    style={{
                      fontFamily: "monospace",
                      fontSize: ".85rem",
                      letterSpacing: ".15em",
                      color: "rgba(0,255,127,.3)",
                      marginBottom: ".3rem",
                    }}
                  >
                    04
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
                    Collaboration Best Practices
                  </h2>
                  {COLLAB.map(([key, val]) => (
                    <div key={key} className="collab-item">
                      <CheckCircle className="w-3.5 h-3.5 text-foss-green flex-shrink-0 mt-0.5" />
                      <span
                        style={{
                          fontFamily: "monospace",
                          fontSize: ".82rem",
                          color: "rgba(255,255,255,.52)",
                        }}
                      >
                        <strong
                          style={{
                            color: "rgba(255,255,255,.85)",
                            fontFamily: '"Jersey 25",monospace',
                            letterSpacing: ".04em",
                            fontSize: ".88rem",
                          }}
                        >
                          {key}:
                        </strong>{" "}
                        {val}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </RevealOnScroll>

          {/* 05 — AVOID */}
          <RevealOnScroll delay={500}>
            <div
              style={{
                border: "1px solid rgba(239,68,68,.2)",
                background: "rgba(239,68,68,.02)",
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
                  borderTop: "1px solid rgba(239,68,68,.3)",
                  borderLeft: "1px solid rgba(239,68,68,.3)",
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
                    border: "1px solid rgba(239,68,68,.3)",
                    background: "rgba(239,68,68,.06)",
                    flexShrink: 0,
                    color: "rgb(248,113,113)",
                  }}
                >
                  <AlertCircle size={17} />
                </div>
                <div className="flex-1">
                  <p
                    style={{
                      fontFamily: "monospace",
                      fontSize: ".85rem",
                      letterSpacing: ".15em",
                      color: "rgba(239,68,68,.4)",
                      marginBottom: ".3rem",
                    }}
                  >
                    05
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
                    Things to Avoid
                  </h2>
                  {AVOID.map((item) => (
                    <div key={item} className="avoid-item">
                      <span
                        style={{
                          color: "rgba(239,68,68,.7)",
                          flexShrink: 0,
                          fontSize: "1rem",
                          lineHeight: 1.2,
                        }}
                      >
                        ✗
                      </span>
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </RevealOnScroll>

          {/* CTA */}
          <RevealOnScroll delay={600}>
            <div
              style={{
                border: "1px solid rgba(0,255,127,.22)",
                background: "rgba(0,255,127,.04)",
                padding: "2.5rem",
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
                  top: "-25%",
                  right: "-10%",
                  width: 260,
                  height: 260,
                  background:
                    "radial-gradient(circle,rgba(0,255,127,.08) 0%,transparent 70%)",
                  pointerEvents: "none",
                }}
              />
              <p className="pg-eyebrow">QUESTIONS?</p>
              <h3
                style={{
                  fontFamily: '"Jersey 25",monospace',
                  fontSize: "clamp(1.4rem,3vw,2rem)",
                  letterSpacing: ".04em",
                  color: "#fff",
                  marginBottom: ".6rem",
                }}
              >
                Questions about these guidelines?
              </h3>
              <p
                className="text-gray-400 font-mono text-sm leading-relaxed mb-5"
                style={{ maxWidth: "32rem" }}
              >
                Join our Discord community to discuss project standards, ask
                questions, or suggest improvements.
              </p>
              <a
                href="https://discord.gg/CXNustDut3"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-foss-green text-black font-mono text-sm font-bold hover:bg-foss-green/90 transition-colors"
              >
                Join Discord <ArrowUpRight className="w-4 h-4" />
              </a>
            </div>
          </RevealOnScroll>
        </div>
      </div>
    </div>
  </>
);

export default ProjectGuidelines;
