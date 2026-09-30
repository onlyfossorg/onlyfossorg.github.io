import React from "react";
import type { Project } from "../utils/types";
import { Github, ExternalLink, Users, ChevronRight } from "lucide-react";
import { NavLink } from "react-router-dom";

interface ProjectCardProps {
  project: Project;
}

const domainColors: Record<string, string> = {
  Web: "text-sky-400 bg-sky-400/10 border-sky-400/30",
  "AI/ML": "text-purple-400 bg-purple-400/10 border-purple-400/30",
  GenAI: "text-pink-400 bg-pink-400/10 border-pink-400/30",
  Blockchain: "text-orange-400 bg-orange-400/10 border-orange-400/30",
  "IoT/Embedded": "text-teal-400 bg-teal-400/10 border-teal-400/30",
  Tools: "text-amber-400 bg-amber-400/10 border-amber-400/30",
  Mobile: "text-emerald-400 bg-emerald-400/10 border-emerald-400/30",
  Cybersecurity: "text-red-400 bg-red-400/10 border-red-400/30",
  "Cloud/DevOps": "text-cyan-400 bg-cyan-400/10 border-cyan-400/30",
  "Data/Analytics": "text-indigo-400 bg-indigo-400/10 border-indigo-400/30",
  "Game Dev": "text-violet-400 bg-violet-400/10 border-violet-400/30",
  Systems: "text-lime-400 bg-lime-400/10 border-lime-400/30",
};

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const statusColors = {
    active: "text-foss-green border-foss-green",
    dormant: "text-yellow-400 border-yellow-400",
    idea: "text-blue-400 border-blue-400",
  };

  const statusLabels = {
    active: "Active",
    dormant: "Dormant",
    idea: "Idea Phase",
  };

  const difficultyColors = {
    beginner: "text-emerald-400 bg-emerald-400/10",
    intermediate: "text-amber-400 bg-amber-400/10",
    advanced: "text-rose-400 bg-rose-400/10",
  };

  return (
    <div className="group relative border border-gray-800 bg-gray-950/50 p-6 transition-all duration-300 hover:border-foss-green hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(0,255,127,0.1)] flex flex-col h-full">
      <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <NavLink to={project.github_repo} target="_blank">
          <ExternalLink className="w-4 h-4 text-foss-green" />
        </NavLink>
      </div>

      {/* Status + Difficulty badges */}
      <div className="flex items-center gap-2 mb-3 flex-wrap">
        <span
          className={`inline-block px-2 py-0.5 text-xs font-mono border ${statusColors[project.status]}`}
        >
          {statusLabels[project.status]}
        </span>
        <span
          className={`inline-block px-2 py-0.5 text-xs font-mono rounded ${difficultyColors[project.difficulty]}`}
        >
          {project.difficulty}
        </span>
        {project.looking_for_contributors && (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-mono text-foss-green bg-foss-green/10 border border-foss-green/30 animate-pulse">
            <Users className="w-3 h-3" />
            Help Wanted
          </span>
        )}
      </div>

      {/* Domain badges */}
      {project.domain && project.domain.length > 0 && (
        <div className="flex items-center gap-1.5 mb-4 flex-wrap">
          {project.domain.map((d) => (
            <span
              key={d}
              className={`inline-block px-2 py-0.5 text-[10px] font-mono border rounded-sm ${
                domainColors[d] ?? "text-gray-400 bg-white/5 border-white/10"
              }`}
            >
              {d}
            </span>
          ))}
        </div>
      )}

      {/* Title */}
      <h3 className="text-xl font-display font-bold text-white mb-1 group-hover:text-foss-green transition-colors">
        {project.name}
      </h3>

      {/* Tagline */}
      <p className="text-foss-green/70 text-sm font-mono mb-3">
        {project.tagline}
      </p>

      {/* Description */}
      <p className="text-gray-400 text-sm mb-6 flex-grow font-sans leading-relaxed">
        {project.description}
      </p>

      <div className="space-y-4 mt-auto">
        {/* Tech Stack */}
        <div className="flex flex-wrap gap-2">
          {project.tech_stack.map((tech) => (
            <span
              key={tech}
              className="px-2 py-1 bg-white/5 text-gray-300 text-xs font-mono"
            >
              {tech}
            </span>
          ))}
        </div>

        {/* Maintainers */}
        <div className="text-xs text-gray-500 font-mono">
          {project.maintainers.map((m, index) => (
            <React.Fragment key={index}>
              {m.contact ? (
                <NavLink
                  to={m.contact}
                  className="hover:text-foss-green hover:underline transition-colors"
                >
                  {m.name}
                </NavLink>
              ) : (
                <span>{m.name}</span>
              )}
              {index < project.maintainers.length - 1 && ", "}
            </React.Fragment>
          ))}
        </div>

        {/* Footer: Slug + GitHub link */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-800">
          <div className="flex items-center gap-1 text-gray-500 text-xs font-mono hover:underline hover:text-foss-green transition-colors">
            <ChevronRight className="w-3 h-3" />
            <NavLink to={project.github_repo} target="_blank">
              {project.slug}
            </NavLink>
          </div>

          <NavLink
            to={project.github_repo}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm font-medium text-white hover:text-foss-green transition-colors"
          >
            <Github className="w-4 h-4" />
            <span>Code</span>
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
