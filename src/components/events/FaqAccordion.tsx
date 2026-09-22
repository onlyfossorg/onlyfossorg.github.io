import { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { EventFaqItem } from "../../lib/loadEvents";
import MarkdownBody from "./MarkdownBody";

interface FaqAccordionProps {
  items: EventFaqItem[];
}

function FaqAccordion({ items }: FaqAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="flex flex-col gap-2">
      {items.map((item, index) => {
        const open = openIndex === index;
        return (
          <div
            key={`${item.question}-${index}`}
            style={{
              border: "1px solid rgba(255,255,255,.08)",
              background: open
                ? "rgba(0,255,127,.03)"
                : "rgba(255,255,255,.02)",
            }}
          >
            <button
              type="button"
              onClick={() => setOpenIndex(open ? null : index)}
              className="w-full flex items-center justify-between gap-4 text-left px-5 py-4"
              aria-expanded={open}
            >
              <span
                className="font-mono text-sm text-white"
                style={{ letterSpacing: "0.02em" }}
              >
                {item.question}
              </span>
              <ChevronDown
                className={`w-4 h-4 shrink-0 text-foss-green transition-transform duration-200 ${
                  open ? "rotate-180" : ""
                }`}
              />
            </button>
            {open && (
              <div className="px-5 pb-5 border-t border-white/5 pt-4">
                <MarkdownBody content={item.answer} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default FaqAccordion;
