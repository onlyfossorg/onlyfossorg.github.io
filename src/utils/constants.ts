import {
  Layout,
  Code,
  Users,
  Terminal,
  Database,
  Globe,
  Cpu,
} from "lucide-react";

export const FEATURES = [
  {
    title: "Project Incubation",
    description:
      "We don't just hack; we build. Take your semester projects to the next level with community support.",
    icon: Layout,
  },
  {
    title: "Open Collaboration",
    description:
      "Find teammates who complement your skills. Designers, backend wizards, and frontend gurus.",
    icon: Users,
  },
  {
    title: "Code Culture",
    description:
      "Workshops, code reviews, and contribution guides to help you write production-ready code.",
    icon: Code,
  },
];

export const TECH_ICONS: Record<string, typeof Globe> = {
  React: Globe,
  "Next.js": Globe,
  "Node.js": Terminal,
  Python: Terminal,
  Go: Terminal,
  PostgreSQL: Database,
  Firebase: Database,
  ESP32: Cpu,
  Flutter: Layout,
  Docker: Database,
  MongoDB: Database,
  TypeScript: Code,
  "D3.js": Globe,
  "Tailwind CSS": Layout,
  Prisma: Database,
  Vite: Terminal,
};

export const DOMAIN_OPTIONS = [
  "Web",
  "AI/ML",
  "GenAI",
  "Tools",
  "IoT/Embedded",
  "Blockchain",
  "Mobile",
  "Cybersecurity",
  "Cloud/DevOps",
  "Data/Analytics",
  "Game Dev",
  "Systems",
] as const;

export const SORT_OPTIONS = [
  { value: "name-asc", label: "Name A → Z" },
  { value: "name-desc", label: "Name Z → A" },
  { value: "status", label: "By Status" },
  { value: "domain", label: "By Domain" },
] as const;

export type SortOption = (typeof SORT_OPTIONS)[number]["value"];
