import React, { useState, useMemo, useRef, useEffect } from "react";
import {
  Search,
  Loader2,
  SlidersHorizontal,
  X,
  ChevronDown,
  ArrowUpRight,
} from "lucide-react";
import ProjectCard from "../components/ProjectCard";
import { useProjects } from "../hooks/useProjects";
import { DOMAIN_OPTIONS, SORT_OPTIONS } from "../utils/constants";
import type { SortOption } from "../utils/constants";
import type { Domain } from "../utils/types";
import RevealOnScroll from "../components/RevealOnScroll";
import GlitchText from "../components/GlitchText";

type StatusFilter = "all" | "active" | "dormant" | "idea";
type DifficultyFilter = "all" | "beginner" | "intermediate" | "advanced";
type DomainFilter = "all" | Domain;

const Projects: React.FC = () => {
  const { projects, loading, error } = useProjects();
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [difficultyFilter, setDifficultyFilter] =
    useState<DifficultyFilter>("all");
  const [domainFilter, setDomainFilter] = useState<DomainFilter>("all");
  const [sortBy, setSortBy] = useState<SortOption>("name-asc");
  const [search, setSearch] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const [panelHeight, setPanelHeight] = useState(0);

  useEffect(() => {
    if (panelRef.current) {
      setPanelHeight(panelRef.current.scrollHeight);
    }
  }, [filtersOpen, statusFilter, difficultyFilter, domainFilter, sortBy]);

  const hasActiveFilters =
    statusFilter !== "all" ||
    difficultyFilter !== "all" ||
    domainFilter !== "all" ||
    sortBy !== "name-asc";

  const activeFilterCount = [
    statusFilter !== "all",
    difficultyFilter !== "all",
    domainFilter !== "all",
    sortBy !== "name-asc",
  ].filter(Boolean).length;

  const clearAll = () => {
    setStatusFilter("all");
    setDifficultyFilter("all");
    setDomainFilter("all");
    setSortBy("name-asc");
    setSearch("");
  };

  const processedProjects = useMemo(() => {
    const filtered = projects.filter((project) => {
      const matchesStatus =
        statusFilter === "all" ? true : project.status === statusFilter;
      const matchesDifficulty =
        difficultyFilter === "all"
          ? true
          : project.difficulty === difficultyFilter;
      const matchesDomain =
        domainFilter === "all"
          ? true
          : (project.domain ?? []).includes(domainFilter as Domain);
      const q = search.toLowerCase();
      const matchesSearch =
        !q ||
        project.name.toLowerCase().includes(q) ||
        project.tagline.toLowerCase().includes(q) ||
        project.description.toLowerCase().includes(q) ||
        project.tech_stack.some((t) => t.toLowerCase().includes(q)) ||
        (project.domain ?? []).some((d) => d.toLowerCase().includes(q));
      return (
        matchesStatus && matchesDifficulty && matchesDomain && matchesSearch
      );
    });

    const statusOrder: Record<string, number> = {
      active: 0,
      dormant: 1,
      idea: 2,
    };

    return [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "name-asc":
          return a.name.localeCompare(b.name);
        case "name-desc":
          return b.name.localeCompare(a.name);
        case "status": {
          const sa = statusOrder[a.status] ?? 9,
            sb = statusOrder[b.status] ?? 9;
          return sa !== sb ? sa - sb : a.name.localeCompare(b.name);
        }
        case "domain": {
          const da = (a.domain ?? [])[0] ?? "zzz",
            db = (b.domain ?? [])[0] ?? "zzz";
          return da !== db
            ? da.localeCompare(db)
            : a.name.localeCompare(b.name);
        }
        default:
          return 0;
      }
    });
  }, [projects, statusFilter, difficultyFilter, domainFilter, sortBy, search]);

  const domainCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    projects.forEach((p) => {
      (p.domain ?? []).forEach((d) => {
        counts[d] = (counts[d] ?? 0) + 1;
      });
    });
    return counts;
  }, [projects]);

  /* ── filter pill base classes ── */
  const pill = (active: boolean) =>
    `px-4 py-2 text-sm font-mono border whitespace-nowrap transition-all duration-200 ${
      active
        ? "bg-foss-green text-black border-foss-green shadow-[0_0_12px_rgba(0,255,127,0.2)]"
        : "text-gray-400 border-white/10 hover:border-white/30 hover:text-white"
    }`;

  return (
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
        /* ── page-level reveal for project cards (simplified for stability) ── */
        @keyframes proj-card-in {
          0%   { opacity:0; transform:translateY(15px); filter:blur(3px); }
          60%  { opacity:1; transform:translateY(-2px); filter:none; }
          100% { opacity:1; transform:translateY(0); }
        }
        .proj-card-reveal {
          opacity: 0;
          will-change: opacity, transform;
        }
        .proj-card-reveal.in-view {
          opacity: 1;
          animation: proj-card-in 0.5s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
        }

        /* ── project card hover glitch (milder) ── */
        @keyframes proj-card-hover {
          0%   { transform:none; }
          25%  { transform:translate(1px, 1px); }
          50%  { transform:translate(-1px, -1px); }
          75%  { transform:translate(-1px, 1px); }
          100% { transform:none; }
        }
        .proj-card-wrap:hover {
          animation: proj-card-hover 0.3s steps(2) forwards;
        }

        /* ── header glitch line accent ── */
        .projects-header-line {
          position: absolute; bottom: 0; left: 0;
          height: 1px; width: 100%;
          background: linear-gradient(90deg, #00ff7f 0%, rgba(0,255,127,.1) 60%, transparent 100%);
        }

        /* ── search input ── */
        .proj-search:focus { outline: none; border-color: #00ff7f; box-shadow: 0 0 0 1px rgba(0,255,127,.2); }

        /* ── filter panel transition ── */
        .filter-panel { transition: max-height 0.3s ease-in-out; overflow: hidden; }

        /* ── empty state ── */
        @keyframes empty-glitch {
          0%,90%,100% { opacity:.5; transform:none; }
          92% { opacity:1; transform:skewX(-2deg) translateX(2px); text-shadow:-1px 0 rgba(255,0,255,.4),1px 0 rgba(0,255,255,.4); }
          95% { transform:skewX(1deg) translateX(-1px); }
        }
        .empty-text { animation: empty-glitch 4s steps(1) infinite; }

        /* ── loading spinner glow ── */
        .proj-spinner { filter: drop-shadow(0 0 6px rgba(0,255,127,.6)); }

        /* ── eyebrow label ── */
        .proj-eyebrow {
          font-family: monospace; font-size: 0.85rem;
          letter-spacing: 0.22em; color: rgba(0,255,127,.55);
          display: flex; align-items: center; gap: 0.5rem;
          margin-bottom: 0.5rem;
        }
        .proj-eyebrow::before {
          content: ""; display: inline-block;
          width: 16px; height: 1px; background: rgba(0,255,127,.5);
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

        {/* subtle top-left glow */}
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: 500,
            height: 400,
            background:
              "radial-gradient(ellipse at 0% 0%, rgba(0,255,127,0.055) 0%, transparent 65%)",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
          {/* ── HEADER ── */}
          <div className="mb-14 relative pb-8">
            <div className="projects-header-line" />

            <RevealOnScroll>
              <p className="proj-eyebrow">ONLY FOSS ORG</p>
              <h1
                className="font-display font-bold text-white mb-4 jersey-25-regular"
                style={{
                  fontSize: "clamp(2.8rem, 7vw, 5.5rem)",
                  lineHeight: 1.0,
                  letterSpacing: "0.02em",
                }}
              >
                <GlitchText text="Our Projects" speed={50} />
              </h1>
              <p
                className="text-gray-400 font-mono text-base max-w-xl leading-relaxed"
                style={{
                  borderLeft: "2px solid rgba(0,255,127,.2)",
                  paddingLeft: "1rem",
                }}
              >
                Open-source college projects kept alive by the community.
                <br />
                Contribute code, design, or ideas.
              </p>
            </RevealOnScroll>

            {/* project count badge */}
            {!loading && !error && (
              <RevealOnScroll delay={200}>
                <div
                  className="mt-6 inline-flex items-center gap-2"
                  style={{
                    border: "1px solid rgba(0,255,127,.15)",
                    padding: "4px 12px",
                    background: "rgba(0,255,127,.04)",
                    fontFamily: "monospace",
                    fontSize: "0.85rem",
                    letterSpacing: "0.15em",
                    color: "rgba(0,255,127,.6)",
                  }}
                >
                  <span
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      background: "#00ff7f",
                      display: "inline-block",
                      boxShadow: "0 0 6px rgba(0,255,127,.8)",
                    }}
                  />
                  {projects.length} PROJECTS AVAILABLE
                </div>
              </RevealOnScroll>
            )}
          </div>

          {/* ── SEARCH & FILTER BAR ── */}
          <RevealOnScroll>
            <div
              className="mb-12 border border-white/10"
              style={{ background: "rgba(255,255,255,0.02)" }}
            >
              {/* top row */}
              <div className="flex flex-col sm:flex-row gap-3 p-4 md:p-5">
                {/* Search */}
                <div className="relative flex-1 max-w-lg">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                  <input
                    type="text"
                    placeholder="Search by name, stack, domain..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="proj-search w-full bg-black/60 border border-white/10 py-3 pl-10 pr-4 text-white font-mono text-sm placeholder:text-gray-700 transition-all"
                  />
                  {search && (
                    <button
                      onClick={() => setSearch("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-foss-green transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* filter controls */}
                <div className="flex items-center gap-2 sm:ml-auto">
                  <button
                    onClick={() => setFiltersOpen((p) => !p)}
                    className={`flex items-center gap-2 px-4 py-3 text-sm font-mono border transition-all duration-200 ${
                      filtersOpen
                        ? "bg-foss-green text-black border-foss-green shadow-[0_0_12px_rgba(0,255,127,0.2)]"
                        : "text-gray-400 border-white/10 hover:border-foss-green/40 hover:text-white"
                    }`}
                  >
                    <SlidersHorizontal className="w-4 h-4" />
                    <span>Sort &amp; Filter</span>
                    {hasActiveFilters && !filtersOpen && (
                      <span className="flex items-center justify-center w-5 h-5 text-[10px] font-bold bg-foss-green text-black rounded-full">
                        {activeFilterCount}
                      </span>
                    )}
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-200 ${filtersOpen ? "rotate-180" : ""}`}
                    />
                  </button>

                  {hasActiveFilters && (
                    <button
                      onClick={clearAll}
                      className="flex items-center gap-1 px-3 py-3 text-xs font-mono text-gray-500 hover:text-foss-green border border-white/10 hover:border-foss-green/30 transition-colors"
                    >
                      <X className="w-3 h-3" /> Clear
                    </button>
                  )}
                </div>
              </div>

              {/* collapsible filter panel */}
              <div
                className="filter-panel"
                style={{ maxHeight: filtersOpen ? `${panelHeight}px` : "0px" }}
              >
                <div
                  ref={panelRef}
                  className="border-t border-white/10 p-4 md:p-5 flex flex-col gap-5"
                >
                  {/* Sort */}
                  <div className="flex flex-col gap-2">
                    <span className="text-xs text-gray-600 font-mono uppercase tracking-widest">
                      Sort by
                    </span>
                    <div className="flex gap-2 overflow-x-auto pb-1">
                      {SORT_OPTIONS.map((opt) => (
                        <button
                          key={opt.value}
                          onClick={() => setSortBy(opt.value)}
                          className={pill(sortBy === opt.value)}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Domain */}
                  <div className="flex flex-col gap-2">
                    <span className="text-xs text-gray-600 font-mono uppercase tracking-widest">
                      Domain
                    </span>
                    <div className="flex gap-2 overflow-x-auto pb-1">
                      <button
                        onClick={() => setDomainFilter("all")}
                        className={pill(domainFilter === "all")}
                      >
                        All Domains
                      </button>
                      {DOMAIN_OPTIONS.map((domain) => (
                        <button
                          key={domain}
                          onClick={() =>
                            setDomainFilter(domain as DomainFilter)
                          }
                          className={pill(domainFilter === domain)}
                        >
                          {domain}
                          {domainCounts[domain] ? (
                            <span
                              className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full ${domainFilter === domain ? "bg-black/20 text-black" : "bg-white/10 text-gray-500"}`}
                            >
                              {domainCounts[domain]}
                            </span>
                          ) : null}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Status + Difficulty */}
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex flex-col gap-2">
                      <span className="text-xs text-gray-600 font-mono uppercase tracking-widest">
                        Status
                      </span>
                      <div className="flex gap-2 overflow-x-auto pb-1">
                        {(
                          [
                            ["all", "All"],
                            ["active", "Active"],
                            ["dormant", "Dormant"],
                            ["idea", "Ideas"],
                          ] as [StatusFilter, string][]
                        ).map(([v, l]) => (
                          <button
                            key={v}
                            onClick={() => setStatusFilter(v)}
                            className={pill(statusFilter === v)}
                          >
                            {l}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 md:ml-auto">
                      <span className="text-xs text-gray-600 font-mono uppercase tracking-widest">
                        Difficulty
                      </span>
                      <div className="flex gap-2 overflow-x-auto pb-1">
                        {(
                          [
                            ["all", "Any Level"],
                            ["beginner", "Beginner"],
                            ["intermediate", "Intermediate"],
                            ["advanced", "Advanced"],
                          ] as [DifficultyFilter, string][]
                        ).map(([v, l]) => (
                          <button
                            key={v}
                            onClick={() => setDifficultyFilter(v)}
                            className={`px-4 py-2 text-sm font-mono border whitespace-nowrap transition-all duration-200 ${
                              difficultyFilter === v
                                ? "bg-white text-black border-white"
                                : "text-gray-400 border-white/10 hover:border-white/30 hover:text-white"
                            }`}
                          >
                            {l}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* result count */}
              {(hasActiveFilters || search) && (
                <div className="flex items-center gap-3 px-4 md:px-5 py-2.5 border-t border-white/5">
                  <span className="text-xs text-gray-600 font-mono">
                    {processedProjects.length} project
                    {processedProjects.length !== 1 ? "s" : ""} found
                  </span>
                </div>
              )}
            </div>
          </RevealOnScroll>

          {/* ── LOADING ── */}
          {loading && (
            <div className="flex items-center justify-center py-28">
              <Loader2 className="proj-spinner w-7 h-7 text-foss-green animate-spin" />
              <span className="ml-3 text-gray-500 font-mono text-sm tracking-widest">
                LOADING PROJECTS...
              </span>
            </div>
          )}

          {/* ── ERROR ── */}
          {error && (
            <div className="text-center py-20 border border-dashed border-red-500/20">
              <p className="text-red-400 font-mono">{error}</p>
            </div>
          )}

          {/* ── GRID ── */}
          {!loading && !error && (
            <>
              {processedProjects.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {processedProjects.map((project, i) => (
                    <ScrollGlitchCard key={project.slug} delay={i * 60}>
                      <ProjectCard project={project} />
                    </ScrollGlitchCard>
                  ))}
                </div>
              ) : (
                <div className="text-center py-24 border border-dashed border-white/8">
                  <p className="empty-text text-gray-600 font-mono text-base mb-4">
                    NO PROJECTS MATCH YOUR CRITERIA
                  </p>
                  <button
                    onClick={clearAll}
                    className="text-foss-green font-mono text-sm hover:underline flex items-center gap-1 mx-auto"
                  >
                    Clear all filters <ArrowUpRight className="w-3 h-3" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

/* ─────────────────────────────────────────────
   ScrollGlitchCard
   Wraps each ProjectCard with IntersectionObserver
   so it glitch-animates in when scrolled into view
───────────────────────────────────────────── */
const ScrollGlitchCard: React.FC<{
  children: React.ReactNode;
  delay?: number;
}> = ({ children, delay = 0 }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            el.classList.add("in-view");
          }, delay);
          observer.disconnect();
        }
      },
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [delay]);

  return (
    <div ref={ref} className="proj-card-reveal proj-card-wrap">
      {children}
    </div>
  );
};

export default Projects;
