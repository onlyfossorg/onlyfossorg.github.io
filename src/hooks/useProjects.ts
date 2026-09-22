import { useState, useEffect } from "react";
import type { Project } from "../utils/types";

// In production, fetch from the awesome-foss repo's generated JSON.
// During local development, fall back to the bundled copy.
const PROJECTS_URL =
  "https://raw.githubusercontent.com/onlyfossorg/awesome-foss/main/dev/generated/projects.json";

// Bundled fallback for local development / offline
const FALLBACK_PROJECTS: Project[] = [
  {
    slug: "lan-share-app",
    name: "LAN Share App",
    tagline: "A peer-to-peer file sharing app for local networks",
    description:
      "A peer-to-peer file sharing app for local networks. It allows users to share files with others in their local network.",
    status: "active",
    difficulty: "beginner",
    tech_stack: ["React", "Node.js", "Socket.io"],
    github_repo: "https://github.com/riteshgharat/lan-share-app",
    maintainers: [
      { name: "Ritesh Gharat", contact: "https://github.com/riteshgharat" },
      {
        name: "Prashant Dhuri",
        contact: "https://github.com/PrashantDhuri08",
      },
    ],
    looking_for_contributors: true,
    domain: ["Web"],
  },
  {
    slug: "only-foss-web",
    name: "ONLY FOSS ORG Website",
    tagline: "The official ONLY FOSS ORG community website",
    description:
      "The open-source website for the ONLY FOSS ORG community — built with React, Vite, and Tailwind CSS.",
    status: "active",
    difficulty: "beginner",
    tech_stack: ["React", "TypeScript", "Tailwind CSS", "Vite"],
    github_repo: "https://github.com/onlyfossorg/onlyfossorg.github.io",
    maintainers: [
      { name: "Ritesh Gharat", contact: "https://github.com/riteshgharat" },
    ],
    looking_for_contributors: true,
    domain: ["Web"],
  },
  {
    slug: "smart-irrigation",
    name: "Smart Irrigation System",
    tagline: "IoT-based smart irrigation for farms",
    description:
      "An embedded system using ESP32 that monitors soil moisture and automates irrigation. Includes a web dashboard for real-time monitoring.",
    status: "idea",
    difficulty: "intermediate",
    tech_stack: ["ESP32", "Python", "Firebase"],
    github_repo: "https://github.com/onlyfossorg/smart-irrigation",
    maintainers: [
      { name: "Ritesh Gharat", contact: "https://github.com/riteshgharat" },
    ],
    looking_for_contributors: true,
    domain: ["IoT/Embedded", "Web"],
  },
  {
    slug: "study-buddy-ai",
    name: "Study Buddy AI",
    tagline: "AI-powered study assistant for students",
    description:
      "A GenAI-powered tool that summarises notes, generates flashcards, and quizzes students based on their uploaded study material.",
    status: "dormant",
    difficulty: "advanced",
    tech_stack: ["Python", "Next.js", "MongoDB"],
    github_repo: "https://github.com/onlyfossorg/study-buddy-ai",
    maintainers: [
      { name: "Ritesh Gharat", contact: "https://github.com/riteshgharat" },
    ],
    looking_for_contributors: false,
    domain: ["AI/ML", "GenAI"],
  },
];

/** Default sort: active projects first, then by name */
function defaultSort(projects: Project[]): Project[] {
  const statusOrder: Record<string, number> = {
    active: 0,
    dormant: 1,
    idea: 2,
  };
  return [...projects].sort((a, b) => {
    const sa = statusOrder[a.status] ?? 9;
    const sb = statusOrder[b.status] ?? 9;
    if (sa !== sb) return sa - sb;
    return a.name.localeCompare(b.name);
  });
}

interface UseProjectsResult {
  projects: Project[];
  loading: boolean;
  error: string | null;
}

export function useProjects(): UseProjectsResult {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchProjects() {
      try {
        const res = await fetch(PROJECTS_URL);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data: Project[] = await res.json();
        if (!cancelled) {
          setProjects(defaultSort(data));
          setError(null);
        }
      } catch {
        // Fall back to bundled data
        if (!cancelled) {
          setProjects(defaultSort(FALLBACK_PROJECTS));
          setError(null); // silent fallback — don't scare users
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchProjects();
    return () => {
      cancelled = true;
    };
  }, []);

  return { projects, loading, error };
}
