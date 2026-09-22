import type { EventCardItem } from "../../lib/loadEvents";
import MarkdownBody from "./MarkdownBody";

interface SectionCardsProps {
  cards: EventCardItem[];
}

function SectionCards({ cards }: SectionCardsProps) {
  return (
  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
    {cards.map((card) => (
      <div
        key={card.title}
        className="feature-card group relative overflow-hidden p-6 border border-foss-green/15 hover:border-foss-green/20 transition-colors duration-300"
        style={{
          background: "rgba(0,0,0,.98)",
        }}
      >
        <span
          className="group-hover:[border-top-color:rgba(0,255,127,.5)!important] group-hover:[border-left-color:rgba(0,255,127,.5)!important]"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: 14,
            height: 14,
            borderTop: "1px solid rgba(0,255,127,0)",
            borderLeft: "1px solid rgba(0,255,127,0)",
            transition: "border-color 0.3s",
          }}
        />
        <h3
          className="jersey-25-regular text-white mb-3 group-hover:text-foss-green transition-colors"
          style={{ fontSize: "1.2rem", letterSpacing: "0.04em" }}
        >
          {card.title}
        </h3>
        <MarkdownBody content={card.body} />
      </div>
    ))}
  </div>
  );
}

export default SectionCards;
