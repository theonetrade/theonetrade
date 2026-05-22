"use client";
import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";

/* Generate deterministic candle data that loops nicely */
function buildCandles(seed = 42, count = 60) {
  let s = seed;
  const rand = () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
  const candles = [];
  let price = 67000;
  for (let i = 0; i < count; i++) {
    const drift = (rand() - 0.48) * 180;
    const range = 80 + rand() * 220;
    const o = price;
    const c = price + drift;
    const h = Math.max(o, c) + rand() * range * 0.6;
    const l = Math.min(o, c) - rand() * range * 0.6;
    candles.push({ o, h, l, c });
    price = c;
  }
  // Inject a flash crash + bounce pattern around index 38-44 (V-bounce signal point)
  const crashIdx = 36;
  candles[crashIdx].c = candles[crashIdx].o - 1800;
  candles[crashIdx].l = candles[crashIdx].c - 200;
  candles[crashIdx + 1].o = candles[crashIdx].c;
  candles[crashIdx + 1].c = candles[crashIdx].c - 400;
  candles[crashIdx + 1].l = candles[crashIdx].c - 600;
  candles[crashIdx + 1].h = candles[crashIdx].c + 50;
  // bounce
  for (let i = crashIdx + 2; i < crashIdx + 8; i++) {
    const prev = candles[i - 1].c;
    const up = 240 + rand() * 200;
    candles[i].o = prev;
    candles[i].c = prev + up;
    candles[i].h = candles[i].c + rand() * 100;
    candles[i].l = candles[i].o - rand() * 80;
  }
  // re-baseline final segment
  let p = candles[crashIdx + 7].c;
  for (let i = crashIdx + 8; i < count; i++) {
    const drift = (rand() - 0.4) * 140;
    const range = 70 + rand() * 180;
    candles[i].o = p;
    candles[i].c = p + drift;
    candles[i].h = Math.max(candles[i].o, candles[i].c) + rand() * range * 0.6;
    candles[i].l = Math.min(candles[i].o, candles[i].c) - rand() * range * 0.6;
    p = candles[i].c;
  }
  return candles;
}

function LiveChart({ candles, progress }) {
  // viewBox dimensions
  const W = 600, H = 320;
  const padL = 8, padR = 56, padT = 16, padB = 28;
  const innerW = W - padL - padR;
  const innerH = H - padT - padB;

  const visibleCount = Math.max(2, Math.floor(progress * candles.length));
  const visible = candles.slice(0, visibleCount);

  const allHighs = visible.map(c => c.h);
  const allLows = visible.map(c => c.l);
  const max = Math.max(...allHighs) + 200;
  const min = Math.min(...allLows) - 200;

  const xStep = innerW / candles.length;
  const cw = Math.max(2, xStep * 0.62);

  const yOf = (price) => padT + ((max - price) / (max - min)) * innerH;
  const xOf = (i) => padL + i * xStep + xStep / 2;

  // Signal event index
  const signalIdx = 38;
  const signalShown = visibleCount > signalIdx;
  const entryY = signalShown ? yOf(candles[signalIdx].l) : 0;
  const entryX = signalShown ? xOf(signalIdx) : 0;

  // current price label
  const last = visible[visible.length - 1];
  const lastY = last ? yOf(last.c) : 0;
  const lastX = visible.length > 0 ? xOf(visible.length - 1) : 0;

  // gridlines
  const gridLines = [0.2, 0.5, 0.8].map(p => padT + p * innerH);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" style={{ width: "100%", height: "100%", display: "block" }}>
      <defs>
        <linearGradient id="bgFade" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="var(--teal)" stopOpacity="0.06" />
          <stop offset="100%" stopColor="var(--teal)" stopOpacity="0" />
        </linearGradient>
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* gridlines */}
      {gridLines.map((y, i) => (
        <line key={i} x1={padL} x2={W - padR} y1={y} y2={y}
          stroke="var(--border)" strokeWidth="1" strokeDasharray="2 4" />
      ))}

      {/* y-axis price labels */}
      {gridLines.map((y, i) => {
        const p = max - ((y - padT) / innerH) * (max - min);
        return (
          <text key={i} x={W - padR + 6} y={y + 4}
            fontSize="9" fontFamily="var(--font-mono)" fill="var(--text-2)">
            {p.toFixed(0)}
          </text>
        );
      })}

      {/* candles */}
      {visible.map((c, i) => {
        const up = c.c >= c.o;
        const x = xOf(i);
        const yH = yOf(c.h);
        const yL = yOf(c.l);
        const yO = yOf(c.o);
        const yC = yOf(c.c);
        const top = Math.min(yO, yC);
        const h = Math.max(1, Math.abs(yO - yC));
        const color = up ? "var(--teal)" : "var(--amber)";
        return (
          <g key={i}>
            <line x1={x} x2={x} y1={yH} y2={yL} stroke={color} strokeWidth="1" opacity="0.7" />
            <rect x={x - cw/2} y={top} width={cw} height={h} fill={color} opacity={up ? 1 : 0.85} />
          </g>
        );
      })}

      {/* Signal anchor */}
      {signalShown && (
        <g>
          <line x1={entryX} x2={entryX} y1={padT} y2={H - padB}
            stroke="var(--amber)" strokeWidth="1" strokeDasharray="3 3" opacity="0.5" />
          <circle cx={entryX} cy={entryY + 6} r="5" fill="var(--amber)" filter="url(#glow)">
            <animate attributeName="r" values="5;8;5" dur="2s" repeatCount="indefinite" />
          </circle>
          <text x={entryX + 10} y={entryY + 9} fontSize="10" fontFamily="var(--font-mono)" fontWeight="600" fill="var(--amber)">
            LONG · ENTRY
          </text>
        </g>
      )}

      {/* last price marker */}
      {last && (
        <g>
          <line x1={lastX} x2={W - padR} y1={lastY} y2={lastY}
            stroke="var(--teal)" strokeWidth="1" strokeDasharray="2 3" />
          <rect x={W - padR + 2} y={lastY - 8} width={52} height="16"
            fill="var(--teal)" rx="2" />
          <text x={W - padR + 28} y={lastY + 4} textAnchor="middle"
            fontSize="10" fontFamily="var(--font-mono)" fontWeight="600" fill="#00201f">
            {last.c.toFixed(0)}
          </text>
        </g>
      )}
    </svg>
  );
}

export default function Hero() {
  const candles = useMemo(() => buildCandles(42, 60), []);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    let raf;
    let start = performance.now();
    const loop = (t) => {
      const elapsed = (t - start) / 1000;
      const cycle = 16; // seconds for full draw
      const progress = (elapsed % cycle) / cycle;
      setTick(progress);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  // reasoning fragments stream in after signal point (~ tick 0.63)
  const signalProgress = Math.max(0, (tick - 0.63) / 0.37);
  const reasoningLines = [
    "1H ATR spike +2.4σ on previous bar",
    "Volume 1.8× SMA20 — liquidation cascade",
    "Bear context confirmed (close < EMA50)",
    "Bounce bar: close > open, > prev low",
    "→ LONG · TP +1.5% · SL −0.8% · RR 1.88",
  ];
  const visibleLines = Math.floor(signalProgress * (reasoningLines.length + 0.5));

  return (
    <section style={{
      borderTop: "none",
      paddingTop: "clamp(40px, 7vw, 100px)",
      paddingBottom: "clamp(60px, 9vw, 120px)",
      overflow: "hidden",
      position: "relative",
    }}>
      {/* Background grid */}
      <div aria-hidden="true" style={{
        position: "absolute", inset: 0,
        backgroundImage: `
          linear-gradient(var(--border) 1px, transparent 1px),
          linear-gradient(90deg, var(--border) 1px, transparent 1px)
        `,
        backgroundSize: "64px 64px",
        opacity: 0.35,
        maskImage: "radial-gradient(ellipse at 50% 30%, #000 0%, transparent 70%)",
        WebkitMaskImage: "radial-gradient(ellipse at 50% 30%, #000 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      <div className="wrap" style={{ position: "relative" }}>
        <div className="hero-grid" style={{
          display: "grid",
          gridTemplateColumns: "1.1fr 1fr",
          gap: "clamp(32px, 5vw, 64px)",
          alignItems: "center",
        }}>
          {/* LEFT: copy */}
          <div>
            <div style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              padding: "5px 10px 5px 8px",
              border: "1px solid var(--border-strong)",
              borderRadius: 999,
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              color: "var(--text-1)",
              marginBottom: 28,
            }}>
              <span className="signal signal-buy" style={{ padding: "2px 6px", fontSize: 9 }}>v6.0</span>
              backtest-kit · open source · MIT
            </div>

            <h1 style={{
              fontSize: "clamp(36px, 6.5vw, 76px)",
              lineHeight: 1,
              fontWeight: 600,
              letterSpacing: "-0.035em",
              margin: "0 0 24px",
              textWrap: "balance",
            }}>
              Trading systems that
              <br />
              <span style={{
                background: "linear-gradient(90deg, var(--teal) 0%, var(--amber) 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}>think before they trade.</span>
            </h1>

            <p style={{
              fontSize: "clamp(16px, 1.55vw, 19px)",
              color: "var(--text-1)",
              maxWidth: 540,
              margin: "0 0 36px",
              lineHeight: 1.55,
              textWrap: "pretty",
            }}>
              An AI-native trading agency for quant teams. We build the runtime — <span style={{ color: "var(--text-0)" }}>backtest-kit</span> — where LLM reasoning, news-sentiment search and locally-hosted Pine Script run on identical code in backtest, paper and live.
            </p>

            <div style={{
              display: "flex", gap: 12, flexWrap: "wrap",
              marginBottom: 40,
            }}>
              <a href="https://github.com/tripolskypetr/backtest-kit" target="_blank" rel="noopener" className="btn btn-primary">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.21 11.4.6.11.82-.26.82-.58v-2.03c-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.08-.73.08-.73 1.2.09 1.84 1.24 1.84 1.24 1.07 1.84 2.81 1.31 3.5 1 .11-.78.42-1.31.76-1.61-2.66-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.13-.31-.54-1.53.12-3.18 0 0 1-.32 3.3 1.23A11.5 11.5 0 0 1 12 5.8c1.02.01 2.04.14 3 .4 2.3-1.55 3.3-1.23 3.3-1.23.66 1.65.25 2.87.12 3.18.77.84 1.23 1.91 1.23 3.22 0 4.61-2.81 5.62-5.49 5.92.43.37.81 1.1.81 2.22v3.29c0 .32.22.7.83.58A12.01 12.01 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>
                Open the source
              </a>
              <a href="#case" className="btn btn-ghost">
                See the Sharpe 1.08 case →
              </a>
            </div>

            {/* Mini metrics row */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
              gap: 1,
              background: "var(--border)",
              border: "1px solid var(--border)",
              borderRadius: 6,
              overflow: "hidden",
              maxWidth: 540,
            }}>
              {[
                { v: "0", l: "look-ahead bias", sub: "AsyncLocalStorage" },
                { v: "1.08", l: "Sharpe ratio", sub: "TRX Jan 2026 case" },
                { v: "100%", l: "code parity", sub: "backtest = live" },
              ].map((m, i) => (
                <div key={i} style={{
                  background: "var(--bg-1)",
                  padding: "16px 18px",
                }}>
                  <div style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 24,
                    fontWeight: 600,
                    color: i === 1 ? "var(--amber)" : "var(--text-0)",
                    lineHeight: 1,
                  }}>{m.v}</div>
                  <div style={{ fontSize: 12, color: "var(--text-1)", marginTop: 6 }}>{m.l}</div>
                  <div style={{ fontSize: 10, color: "var(--text-2)", fontFamily: "var(--font-mono)", marginTop: 2 }}>{m.sub}</div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: live signal visualization */}
          <div className="hero-chart-wrap">
            <div className="term" data-label="LIVE · BTCUSDT 15m" style={{
              background: "linear-gradient(180deg, var(--bg-1) 0%, var(--bg-2) 100%)",
              boxShadow: "0 30px 80px -20px rgba(0,0,0,0.5), 0 0 60px -20px color-mix(in srgb, var(--teal) 30%, transparent)",
            }}>
              <div className="term-head">
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div className="dots">
                    <span className="dot" style={{ background: "var(--amber)" }}></span>
                    <span className="dot" style={{ background: "var(--teal)" }}></span>
                    <span className="dot"></span>
                  </div>
                  <span style={{ color: "var(--text-0)" }}>signal.pipeline()</span>
                </div>
                <span style={{ color: "var(--text-2)", fontSize: 10 }}>haiku-4.5 · streaming</span>
              </div>

              <div style={{ aspectRatio: "16/9", position: "relative" }}>
                <LiveChart candles={candles} progress={tick} />
              </div>

              {/* Reasoning stream */}
              <div style={{
                borderTop: "1px solid var(--border)",
                padding: "14px 18px 16px",
                background: "var(--bg-0)",
                fontFamily: "var(--font-mono)",
                fontSize: 11.5,
                lineHeight: 1.7,
                minHeight: 120,
              }}>
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  marginBottom: 8,
                  color: "var(--text-2)",
                  fontSize: 10,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                }}>
                  <span style={{ color: signalProgress > 0 ? "var(--amber)" : "var(--text-3)" }}>▸</span>
                  LLM reasoning · liquidation_spike_bounce
                </div>
                {reasoningLines.slice(0, visibleLines).map((line, i) => (
                  <div key={i} style={{
                    color: i === reasoningLines.length - 1 ? "var(--teal)" : "var(--text-1)",
                    opacity: 1,
                    animation: "fadeIn 200ms ease",
                  }}>
                    <span style={{ color: "var(--text-3)" }}>{String(i + 1).padStart(2, "0")} </span>{line}
                  </div>
                ))}
                {visibleLines === 0 && (
                  <div style={{ color: "var(--text-3)" }}>
                    <span className="blink">_</span> waiting for spike signal…
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: none; } }
        .blink { animation: blink 1s steps(2) infinite; }
        @keyframes blink { 50% { opacity: 0; } }
        @media (max-width: 900px) {
          .hero-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
        }
      `}</style>
    </section>
  );
}
