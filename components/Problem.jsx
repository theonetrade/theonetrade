"use client";
import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";

export default function Problem() {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    let raf;
    let start = performance.now();
    const loop = (t) => {
      const elapsed = (t - start) / 1000;
      setTick(elapsed);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  // Bot swarm whipsaw visualization
  // Two phases: "all buy" → "all sell" → repeat
  const cycle = 5; // seconds
  const phase = (tick % cycle) / cycle;
  const buyPhase = phase < 0.5;
  const intensity = buyPhase ? phase * 2 : (1 - phase) * 2;

  return (
    <section id="problem">
      <div className="wrap">
        <div className="section-eyebrow">01 / The structural problem</div>
        <h2 className="section-title">
          95% of trading bots run the same five tutorial strategies.
          <br />
          <span style={{ color: "var(--text-2)" }}>They mostly trade against each other.</span>
        </h2>
        <p className="section-lede">
          Crypto markets aren't first-order chaotic anymore. Thousands of identical RSI / MACD / Bollinger bots execute the same signal in the same 100 ms window — they create the noise they're trying to trade. The only beneficiary is the exchange's fee meter.
        </p>

        <div className="problem-grid" style={{
          display: "grid",
          gridTemplateColumns: "1.1fr 1fr",
          gap: 24,
          marginTop: 24,
        }}>
          {/* LEFT: Visualization of self-conflict */}
          <div className="term" data-label="BOT SWARM · 09:00:00.150 UTC" style={{ overflow: "hidden" }}>
            <div className="term-head">
              <span style={{ color: "var(--text-0)" }}>1,000 freqtrade bots — identical RSI(14) strategy</span>
              <span className="signal" style={{
                color: buyPhase ? "var(--green)" : "var(--red)",
                borderColor: "currentColor",
              }}>
                {buyPhase ? "ALL · BUY" : "ALL · SELL"}
              </span>
            </div>

            <div style={{
              padding: "20px 16px",
              position: "relative",
              aspectRatio: "5/4",
              background: `radial-gradient(circle at 50% 50%, color-mix(in srgb, ${buyPhase ? "var(--green)" : "var(--red)"} ${8 + intensity * 6}%, transparent), transparent 70%)`,
              transition: "background 200ms",
            }}>
              {/* Bot dots grid */}
              <BotSwarm buyPhase={buyPhase} intensity={intensity} />

              {/* Price tag */}
              <div style={{
                position: "absolute",
                bottom: 16,
                left: 16,
                right: 16,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-end",
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                color: "var(--text-2)",
              }}>
                <div>
                  <div style={{ fontSize: 9, letterSpacing: "0.1em", color: "var(--text-3)" }}>RSI(14)</div>
                  <div style={{
                    color: buyPhase ? "var(--green)" : "var(--red)",
                    fontSize: 16,
                    fontWeight: 600,
                  }}>{buyPhase ? "28.4 ↓" : "74.7 ↑"}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 9, letterSpacing: "0.1em", color: "var(--text-3)" }}>BTC</div>
                  <div style={{ color: "var(--text-0)", fontSize: 16, fontWeight: 600 }}>
                    ${buyPhase ? "87,300" : "87,450"}
                  </div>
                </div>
              </div>
            </div>

            <div style={{
              borderTop: "1px solid var(--border)",
              padding: "14px 18px",
              background: "var(--bg-2)",
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 24,
              fontFamily: "var(--font-mono)",
            }}>
              <Stat label="per bot / day" value="−18%" tone="red" />
              <Stat label="exchange take" value="+$8,000" tone="amber" />
              <Stat label="round-trips" value="100/day" />
            </div>
          </div>

          {/* RIGHT: explainer */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div className="term" data-label="THE PATTERN">
              <div className="term-body">
                <ol style={{
                  margin: 0, padding: 0,
                  listStyle: "none",
                  display: "flex", flexDirection: "column", gap: 14,
                  fontSize: 14, lineHeight: 1.5,
                  color: "var(--text-1)",
                }}>
                  {[
                    ["09:00.000", "RSI dips below 30 on 1,000 identical bots"],
                    ["09:00.100", "All BUY simultaneously. Price spikes 0.15%."],
                    ["09:00.200", "RSI now reads 75 — they raised it themselves"],
                    ["09:00.300", "All SELL. Round-trip cost: −0.18% / bot."],
                  ].map(([t, l], i) => (
                    <li key={i} style={{ display: "flex", gap: 14 }}>
                      <span style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: 11,
                        color: i === 3 ? "var(--red)" : "var(--text-2)",
                        flexShrink: 0,
                        width: 70,
                        paddingTop: 2,
                      }}>{t}</span>
                      <span style={{ color: i === 3 ? "var(--text-0)" : "var(--text-1)" }}>{l}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>

            <div className="term" data-label="WHY">
              <div className="term-body" style={{ fontSize: 14, color: "var(--text-1)", lineHeight: 1.6 }}>
                Predictable stop placement clusters. Public indicator stacks. Tutorial copy-paste. Market makers see the clusters and harvest them.
                <div style={{
                  marginTop: 14,
                  fontSize: 12,
                  color: "var(--text-2)",
                  fontFamily: "var(--font-mono)",
                  display: "flex",
                  gap: 16,
                  flexWrap: "wrap",
                }}>
                  <span>RSI · 85%</span>
                  <span>MACD · 78%</span>
                  <span>BB · 65%</span>
                  <span>EMA cross · 72%</span>
                </div>
              </div>
            </div>

            <a href="#method" style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              color: "var(--teal)",
              fontSize: 14,
              fontWeight: 500,
              fontFamily: "var(--font-mono)",
              padding: "4px 0",
              alignSelf: "flex-start",
            }}>
              → How TheOneTrade exits the game
            </a>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .problem-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}

function Stat({ label, value, tone }) {
  const color = tone === "red" ? "var(--red)" : tone === "amber" ? "var(--amber)" : "var(--text-0)";
  return (
    <div>
      <div style={{ fontSize: 10, letterSpacing: "0.1em", color: "var(--text-3)", textTransform: "uppercase", marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: 18, fontWeight: 600, color }}>{value}</div>
    </div>
  );
}

function BotSwarm({ buyPhase, intensity }) {
  // 12 cols × 9 rows = 108 dots representing the swarm
  const cols = 24, rows = 12;
  const dots = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const seed = (r * cols + c);
      const delay = (seed * 17) % 100 / 100;
      const lit = intensity > delay;
      dots.push({ r, c, lit, delay });
    }
  }

  const color = buyPhase ? "var(--green)" : "var(--red)";

  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: `repeat(${cols}, 1fr)`,
      gridTemplateRows: `repeat(${rows}, 1fr)`,
      gap: 4,
      width: "100%",
      height: "calc(100% - 40px)",
    }}>
      {dots.map((d, i) => (
        <div key={i} style={{
          aspectRatio: "1/1",
          borderRadius: "50%",
          background: d.lit ? color : "var(--border-strong)",
          opacity: d.lit ? 0.95 : 0.35,
          boxShadow: d.lit ? `0 0 6px ${color}` : "none",
          transition: "background 80ms, box-shadow 80ms, opacity 80ms",
        }} />
      ))}
    </div>
  );
}
