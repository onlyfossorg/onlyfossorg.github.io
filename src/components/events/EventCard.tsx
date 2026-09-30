import { Link } from "react-router-dom";
import { Calendar, MapPin, Monitor, Clock } from "lucide-react";
import {
  getEventStatus,
  formatEventDateRange,
  formatEventCountdown,
  type EventData,
} from "../../lib/loadEvents";

function statusTone(status: string) {
  if (status === "live") {
    return {
      label: "LIVE NOW",
      color: "#00ff7f",
      border: "rgba(0,255,127,.5)",
      bg: "rgba(0,255,127,.12)",
    };
  }
  if (status === "past") {
    return {
      label: "PAST",
      color: "rgba(255,255,255,.45)",
      border: "rgba(255,255,255,.12)",
      bg: "transparent",
    };
  }
  return {
    label: "UPCOMING",
    color: "rgba(0,255,127,.85)",
    border: "rgba(0,255,127,.25)",
    bg: "rgba(0,255,127,.05)",
  };
}

export function EventCard({ event }: { event: EventData }) {
  const { meta } = event;
  const currentStatus = getEventStatus(meta);
  const countdown = formatEventCountdown(meta);
  const tone = statusTone(currentStatus);
  const isLive = currentStatus === "live";
  const isPast = currentStatus === "past";
  const banner = meta.banner || meta.cover;

  const dateRange = formatEventDateRange(
    meta.start,
    meta.end,
    meta.timezone,
    undefined,
    true,
  );

  return (
    <Link
      to={`/events/${meta.slug}`}
      className="group block h-full"
      style={{ opacity: isPast ? 0.72 : 1 }}
    >
      <article
        className={`feature-card group h-full flex flex-col relative overflow-hidden border hover:border-foss-green/20 transition-colors duration-300 ${
          isPast ? "border-white/[0.07]" : "border-foss-green/15"
        }`}
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
            zIndex: 2,
          }}
        />
        {/* Banner with 4:1 ratio */}
        <div
          className="relative overflow-hidden shrink-0 w-full aspect-[4/1]"
          style={{
            background: banner
              ? "#0a0a0a"
              : "linear-gradient(145deg, rgba(0,255,127,.1) 0%, rgba(255,255,255,.03) 50%, #000 100%)",
            borderBottom: "1px solid rgba(255,255,255,.06)",
          }}
        >
          {banner ? (
            <img
              src={banner}
              alt={meta.title}
              className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-[1.02] transition-transform duration-300"
            />
          ) : (
            <div className="absolute inset-0 flex flex-col justify-end p-2.5">
              <p
                className="jersey-25-regular text-white"
                style={{ fontSize: "1.2rem", letterSpacing: "0.04em" }}
              >
                {dateRange || "TBA"}
              </p>
              {meta.format && (
                <p className="font-mono text-[0.6rem] text-foss-green/65 tracking-wider uppercase mt-0.5">
                  {meta.format}
                </p>
              )}
            </div>
          )}
        </div>

        <div className="p-5 flex flex-col grow">
          <div className="flex items-center justify-between gap-1.5 mb-2 text-[0.68rem] font-mono text-foss-green/80">
            <span
              className="font-mono text-[0.58rem] tracking-[0.14em] px-2 py-0.5 flex items-center gap-1.5 backdrop-blur-sm"
              style={{
                color: tone.color,
                border: `1px solid ${tone.border}`,
                background: tone.bg,
              }}
            >
              {isLive && (
                <span
                  style={{
                    display: "inline-block",
                    width: 5,
                    height: 5,
                    borderRadius: "50%",
                    backgroundColor: "#00ff7f",
                    boxShadow: "0 0 6px #00ff7f",
                  }}
                />
              )}
              {tone.label}
            </span>
          </div>
          <div className="flex items-center justify-between gap-1.5 mb-2 text-[0.68rem] font-mono text-foss-green/80">
            <span className="inline-flex items-center gap-1.5 text-gray-400">
              <Clock className="w-3 h-3 text-foss-green shrink-0" />
              <span className="truncate">{countdown.text}</span>
            </span>
            {meta.type && (
              <span className="font-mono text-[0.58rem] tracking-[0.14em] px-2 py-0.5 border border-white/10 text-gray-400 uppercase">
                {meta.type}
              </span>
            )}
          </div>

          <h3
            className="jersey-25-regular text-white mb-2 group-hover:text-foss-green transition-colors"
            style={{ fontSize: "1.35rem", letterSpacing: "0.04em" }}
          >
            {meta.title}
          </h3>
          {meta.summary && (
            <p className="text-gray-500 font-mono text-xs leading-relaxed mb-4 line-clamp-3 grow">
              {meta.summary}
            </p>
          )}
          <div className="flex flex-col gap-1.5 text-gray-500 font-mono text-[0.7rem]">
            {dateRange && (
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="w-3 h-3 text-foss-green/50 shrink-0" />
                <span>{dateRange}</span>
                {meta.timezone ? (
                  <span className="text-gray-600">({meta.timezone})</span>
                ) : null}
              </span>
            )}
            {meta.location && (
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="w-3 h-3 text-foss-green/50" />
                {meta.location}
              </span>
            )}
            {meta.format && (
              <span className="inline-flex items-center gap-1.5">
                <Monitor className="w-3 h-3 text-foss-green/50" />
                {meta.format}
              </span>
            )}
          </div>
        </div>
      </article>
    </Link>
  );
}

export default EventCard;
