import { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate, NavLink } from "react-router-dom";

const REPOS = [
  "atom8",
  "lan-share",
  "study-buddy",
  "awesome-foss",
  "LICENSE",
  "README.md",
  "package.json",
  "only-foss",
];

const VOIDS = [
  "/dev/null",
  "rm -rf",
  "404",
  "kill -9",
  "segfault",
  "abort()",
];

type Drop = {
  id: number;
  x: number;
  y: number;
  kind: "repo" | "void";
  label: string;
};

type Props = {
  fullscreen?: boolean;
};

export default function OrphanRescue({ fullscreen = false }: Props) {
  const navigate = useNavigate();
  const wrapRef = useRef<HTMLDivElement>(null);
  const paddleElRef = useRef<HTMLDivElement>(null);

  const paddleRef = useRef(50);
  const [paddle, setPaddle] = useState(50);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [over, setOver] = useState(false);
  const [drops, setDrops] = useState<Drop[]>([]);
  const [hitFeedback, setHitFeedback] = useState<"repo" | "void" | null>(null);

  const idRef = useRef(0);
  const scoreRef = useRef(0);
  const livesRef = useRef(3);
  const overRef = useRef(false);
  const dropsRef = useRef<Drop[]>([]);
  const moveIntervalRef = useRef<number | null>(null);

  useEffect(() => {
    scoreRef.current = score;
  }, [score]);

  useEffect(() => {
    livesRef.current = lives;
  }, [lives]);

  useEffect(() => {
    overRef.current = over;
  }, [over]);

  useEffect(() => {
    dropsRef.current = drops;
  }, [drops]);

  const movePaddle = useCallback((delta: number) => {
    if (overRef.current) return;
    paddleRef.current = Math.max(6, Math.min(94, paddleRef.current + delta));
    setPaddle(paddleRef.current);
  }, []);

  const moveFromClientX = useCallback((clientX: number) => {
    const el = wrapRef.current;
    if (!el || overRef.current) return;
    const rect = el.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    paddleRef.current = Math.max(6, Math.min(94, pct));
    setPaddle(paddleRef.current);
  }, []);

  const startContinuousMove = useCallback(
    (dir: number) => {
      if (moveIntervalRef.current) clearInterval(moveIntervalRef.current);
      movePaddle(dir * 3);
      moveIntervalRef.current = window.setInterval(() => {
        movePaddle(dir * 2.5);
      }, 30);
    },
    [movePaddle],
  );

  const stopContinuousMove = useCallback(() => {
    if (moveIntervalRef.current) {
      clearInterval(moveIntervalRef.current);
      moveIntervalRef.current = null;
    }
  }, []);

  // Clear continuous-move interval on unmount (and any exit path).
  useEffect(() => () => stopContinuousMove(), [stopContinuousMove]);

  // Keyboard navigation
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && fullscreen) {
        stopContinuousMove();
        navigate("/");
        return;
      }
      if (overRef.current) return;
      if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") {
        movePaddle(-7);
      } else if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") {
        movePaddle(7);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [fullscreen, navigate, movePaddle, stopContinuousMove]);

  // Main game loop
  useEffect(() => {
    if (over) return;
    let raf = 0;
    let lastSpawn = performance.now();
    let lastTime = performance.now();

    const tick = (now: number) => {
      const dt = Math.min(40, now - lastTime);
      lastTime = now;

      // Spawn falling drop
      const spawnDelay = Math.max(500, 950 - scoreRef.current * 15);
      if (now - lastSpawn > spawnDelay) {
        lastSpawn = now;
        const isVoid = Math.random() < 0.32;
        const pool = isVoid ? VOIDS : REPOS;
        idRef.current += 1;
        const spawned: Drop = {
          id: idRef.current,
          x: 8 + Math.random() * 84,
          y: 0,
          kind: isVoid ? "void" : "repo",
          label: pool[Math.floor(Math.random() * pool.length)],
        };
        const afterSpawn = [...dropsRef.current.slice(-14), spawned];
        dropsRef.current = afterSpawn;
        setDrops(afterSpawn);
      }

      // Check collisions with paddle
      const fieldEl = wrapRef.current;
      const paddleEl = paddleElRef.current;
      let paddleLeftPct = paddleRef.current - 9;
      let paddleRightPct = paddleRef.current + 9;
      let paddleTopPct = 86;
      let paddleBottomPct = 95;

      if (fieldEl && paddleEl) {
        const fRect = fieldEl.getBoundingClientRect();
        const pRect = paddleEl.getBoundingClientRect();
        if (fRect.width > 0 && fRect.height > 0) {
          paddleLeftPct = ((pRect.left - fRect.left) / fRect.width) * 100;
          paddleRightPct = ((pRect.right - fRect.left) / fRect.width) * 100;
          paddleTopPct = ((pRect.top - fRect.top) / fRect.height) * 100;
          paddleBottomPct = ((pRect.bottom - fRect.top) / fRect.height) * 100;
        }
      }

      // Check collisions with paddle (pure loop — side effects applied once after)
      const prev = dropsRef.current;
      const next: Drop[] = [];
      let scoreGain = 0;
      let lifeLoss = 0;

      for (const d of prev) {
        const fallSpeed =
          0.024 + Math.min(0.016, scoreRef.current * 0.0006);
        const nextY = d.y + dt * fallSpeed;

        const yOverlap =
          nextY >= paddleTopPct - 2 && nextY <= paddleBottomPct + 1;
        const xOverlap =
          d.x >= paddleLeftPct - 4 && d.x <= paddleRightPct + 4;

        if (yOverlap && xOverlap) {
          if (d.kind === "repo") {
            scoreGain += 1;
          } else if (d.kind === "void") {
            lifeLoss += 1;
          }
          continue;
        }

        if (nextY > paddleBottomPct + 3) {
          continue;
        }

        next.push({ ...d, y: nextY });
      }

      dropsRef.current = next;
      setDrops(next);

      if (scoreGain > 0) {
        scoreRef.current += scoreGain;
        setScore(scoreRef.current);
        setHitFeedback("repo");
        setTimeout(() => setHitFeedback(null), 250);
      }

      if (lifeLoss > 0) {
        livesRef.current = Math.max(0, livesRef.current - lifeLoss);
        setLives(livesRef.current);
        setHitFeedback("void");
        setTimeout(() => setHitFeedback(null), 300);

        if (livesRef.current <= 0) {
          overRef.current = true;
          setOver(true);
        }
      }

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [over]);

  const restart = () => {
    scoreRef.current = 0;
    livesRef.current = 3;
    overRef.current = false;
    idRef.current = 0;
    setScore(0);
    setLives(3);
    setOver(false);
    dropsRef.current = [];
    setDrops([]);
    paddleRef.current = 50;
    setPaddle(50);
    setHitFeedback(null);
  };

  return (
    <div
      className={fullscreen ? "egg-wrap egg-wrap-full" : "egg-wrap"}
      role="application"
      aria-label="Orphan Rescue Game"
    >
      {/* ── HEADER BAR with justified spacing ── */}
      <div className="egg-bar">
        {/* Left: Branding */}
        <div className="egg-bar-brand">
          <span className="text-foss-green font-bold">orphan rescue</span>
          <span className="hidden sm:inline text-gray-500 font-normal">
            · catch abandoned repos
          </span>
        </div>

        {/* Center/Right: Live Stats */}
        <div className="egg-bar-stats">
          <span className="text-gray-300">
            saved: <strong className="text-foss-green">{score}</strong>
          </span>
          <span className="text-gray-600">·</span>
          <span className="flex items-center gap-1 text-gray-300">
            <span>lives:</span>
            <strong
              className={
                lives <= 1 ? "text-red-500 font-bold" : "text-foss-green"
              }
            >
              {lives}
            </strong>
            <span className="flex items-center ml-0.5">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className={
                    i < lives ? "egg-heart-alive" : "egg-heart-dead"
                  }
                >
                  ♥
                </span>
              ))}
            </span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <NavLink
            to="/"
            className="egg-exit-btn"
            aria-label="Exit game to home"
            onClick={stopContinuousMove}
          >
            exit 0
          </NavLink>
        </div>
      </div>

      {/* ── MAIN GAME FIELD ── */}
      <div
        ref={wrapRef}
        className="egg-field"
        onPointerDown={(e) => moveFromClientX(e.clientX)}
        onPointerMove={(e) => {
          if (e.buttons === 1) moveFromClientX(e.clientX);
        }}
        onTouchStart={(e) => {
          const t = e.touches[0];
          if (t) moveFromClientX(t.clientX);
        }}
        onTouchMove={(e) => {
          const t = e.touches[0];
          if (t) moveFromClientX(t.clientX);
        }}
      >
        {/* Falling drops */}
        {drops.map((d) => (
          <span
            key={d.id}
            className={d.kind === "void" ? "egg-drop egg-void" : "egg-drop"}
            style={{ left: `${d.x}%`, top: `${d.y}%` }}
          >
            {d.label}
          </span>
        ))}

        {/* Paddle */}
        <div
          ref={paddleElRef}
          className={`egg-paddle ${
            hitFeedback === "repo"
              ? "egg-paddle-repo"
              : hitFeedback === "void"
                ? "egg-paddle-void"
                : ""
          }`}
          style={{ left: `${paddle}%` }}
        >
          {hitFeedback === "repo"
            ? "+1 SAVED!"
            : hitFeedback === "void"
              ? "HAZARD! -1"
              : "git checkout"}
        </div>

        {/* Game Over modal */}
        {over && (
          <div className="egg-over">
            <div className="egg-over-box">
              <p className="text-red-400 font-bold font-mono text-base tracking-wider">
                SYSTEM CRASH: GAME OVER
              </p>
              <p className="text-gray-300 font-mono text-sm">
                {score === 0
                  ? "no orphan repos saved before exhaustion"
                  : `you rescued ${score} orphan repo${score === 1 ? "" : "s"}!`}
              </p>
              <p className="text-xs font-mono text-gray-500">
                hit 3 red hazard void traps
              </p>
              <div className="flex items-center gap-3 mt-2">
                <button type="button" className="egg-again" onClick={restart}>
                  fork again
                </button>
                <NavLink to="/" className="egg-exit-btn" onClick={stopContinuousMove}>
                  exit 0
                </NavLink>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── MOBILE CONTROLS & HINT BAR ── */}
      <div className="egg-mobile-bar sm:hidden">
        <button
          type="button"
          className="egg-touch-btn"
          onPointerDown={(e) => {
            e.currentTarget.setPointerCapture(e.pointerId);
            startContinuousMove(-1);
          }}
          onPointerUp={stopContinuousMove}
          onPointerCancel={stopContinuousMove}
          onPointerLeave={stopContinuousMove}
          onLostPointerCapture={stopContinuousMove}
          aria-label="Move left"
        >
          ◀ LEFT
        </button>

        <span className="text-[10px] text-gray-500 font-mono tracking-tight text-center">
          drag or tap · avoid red
        </span>

        <button
          type="button"
          className="egg-touch-btn"
          onPointerDown={(e) => {
            e.currentTarget.setPointerCapture(e.pointerId);
            startContinuousMove(1);
          }}
          onPointerUp={stopContinuousMove}
          onPointerCancel={stopContinuousMove}
          onPointerLeave={stopContinuousMove}
          onLostPointerCapture={stopContinuousMove}
          aria-label="Move right"
        >
          RIGHT ▶
        </button>
      </div>

      {/* Desktop Hint */}
      <p className="egg-hint hidden sm:block">
        ← → / A D / drag · avoid red /dev/null &amp; rm -rf · catch green repos ·
        Esc exits
      </p>
    </div>
  );
}
