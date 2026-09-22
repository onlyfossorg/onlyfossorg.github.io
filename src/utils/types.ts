export interface Maintainer {
  name: string;
  contact: string;
}

export type Domain = "Web" | "AI/ML" | "GenAI" | "Blockchain" | "IoT/Embedded";

export interface Project {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  status: "active" | "dormant" | "idea";
  difficulty: "beginner" | "intermediate" | "advanced";
  tech_stack: string[];
  github_repo: string;
  maintainers: Maintainer[];
  looking_for_contributors: boolean;
  domain?: Domain[];
}

export interface NavItem {
  label: string;
  href: string; // Using hash routing logic
}

export type Tab = "home" | "projects" | "events" | "community" | "about";
