import { useEffect, useState } from "react";
import type { EventSection } from "../../lib/loadEvents";

interface EventSectionNavProps {
  sections: EventSection[];
}

function EventSectionNav({ sections }: EventSectionNavProps) {
  const [active, setActive] = useState(sections[0]?.id ?? "");

  useEffect(() => {
    const ids = sections.map((s) => s.id);
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]?.target.id) {
          setActive(visible[0].target.id);
        }
      },
      { rootMargin: "-20% 0px -55% 0px", threshold: [0, 0.25, 0.5, 1] },
    );

    for (const id of ids) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [sections]);

  if (sections.length === 0) return null;

  return (
    <nav
      className="hidden lg:block sticky top-28 self-start"
      aria-label="Event sections"
    >
      <p
        className="font-mono text-[0.65rem] tracking-[0.2em] text-foss-green/50 mb-4 uppercase"
      >
        On this page
      </p>
      <ul className="flex flex-col gap-1 border-l border-white/10">
        {sections.map((section) => (
          <li key={section.id}>
            <a
              href={`#${section.id}`}
              onClick={(e) => {
                e.preventDefault();
                document
                  .getElementById(section.id)
                  ?.scrollIntoView({ behavior: "smooth", block: "start" });
                setActive(section.id);
              }}
              className={`block pl-4 py-1.5 font-mono text-xs transition-colors border-l-2 -ml-px ${
                active === section.id
                  ? "text-foss-green border-foss-green"
                  : "text-gray-500 border-transparent hover:text-gray-300"
              }`}
            >
              {section.title}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default EventSectionNav;
