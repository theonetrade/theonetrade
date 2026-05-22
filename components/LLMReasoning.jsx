"use client";
import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";

const REASONING_EVENTS = [
  {
    id: "apr5",
    date: "April 5, 2026 · 14:30 UTC",
    asset: "BTCUSDT",
    headline: "US ultimatum to Iran issued",
    queries: [
      "Bitcoin news April 5 2026",
      "Bitcoin flash crash April 5 2026",
      "April 5 2026 Bitcoin Trump tweet",
    ],
    signal: "WAIT",
    confidence: 0.62,
    reasoning: "The acute event is the US ultimatum to Iran, which raises geopolitical tensions and historically leads to price decline in the medium term (bearish risk ≈45%). Technical signals also point to weakness: price trading below all moving averages, RSI at 44, volume is low, fear index at extreme fear (12) — which could trigger a fast short squeeze, but without a confirming news catalyst this is unlikely. Signals are contradictory; better to stay out for now.",
    cited: ["geopolitical risk premium", "RSI 44 / volume low", "fear index 12", "no breakout confirmation"],
  },
  {
    id: "apr8",
    date: "April 8, 2026 · 04:35 UTC",
    asset: "BTCUSDT",
    headline: "Trump announces 2-week ceasefire with Iran",
    queries: [
      "April 8 2026 Bitcoin breaking news",
      "April 8 2026 Trump tweet Bitcoin",
      "April 8 2026 Bitcoin flash crash",
      "Decrypt April 8 2026 Bitcoin ceasefire",
    ],
    signal: "BUY",
    confidence: 0.91,
    reasoning: "The acute event driver — Trump's announcement of a two-week ceasefire with Iran (04:30 UTC) — triggered an instant rally to $72,000, liquidation of ~$425M in short positions, and a massive volume spike (>2M BTC/hour). Facts indicate a sharp bullish impulse that should sustain price growth in the coming hours. Optimal move: open a long with a tight stop-loss around $70,000.",
    cited: ["$425M shorts liquidated", "volume >2M BTC/h", "instant +6% impulse", "stop at $70K"],
  },
  {
    id: "apr9",
    date: "April 9, 2026 · 09:15 UTC",
    asset: "BTCUSDT",
    headline: "Quantum vulnerability headlines + miner selling",
    queries: [
      "Bitcoin breaking news April 9 2026",
      "Bitcoin Supply Shock LTH 21% April 9 2026",
      "Bitcoin breaking news April 8 2026 20:00 UTC",
    ],
    signal: "SELL",
    confidence: 0.71,
    reasoning: "Acute event — price broke above $71,000 following ceasefire news. Contradicted by strong bearish factors: significant miner selling, hash rate decline, put option dominance (premium ~17%), risk of breaking the $70,000 support with potential pullback to $58–63K, and quantum vulnerability news rattling investors. The fundamentals outweigh the momentum extension — short-term reversion expected.",
    cited: ["miner outflow +12%", "puts at 17% premium", "hashrate −3.4%", "support $70K fragile"],
  },
];

export default function LLMReasoning() {
  const [activeId, setActiveId] = useState(REASONING_EVENTS[1].id);
  const active = REASONING_EVENTS.find(e => e.id === activeId);
  const [revealStep, setRevealStep] = useState(0);
  const [idSuffix, setIdSuffix] = useState("");

  useEffect(() => {
    setRevealStep(0);
    setIdSuffix(Math.floor(Math.random() * 9999).toString(16));
    const steps = [200, 600, 1100, 1700, 2200];
    const timers = steps.map((ms, i) => setTimeout(() => setRevealStep(i + 1), ms));
    return () => timers.forEach(clearTimeout);
  }, [activeId]);

  const signalTone = active.signal === "BUY" ? "buy" : active.signal === "SELL" ? "sell" : "wait";
  const signalColor = active.signal === "BUY" ? "var(--green)" : active.signal === "SELL" ? "var(--red)" : "var(--amber)";

  return (
    <section id="reasoning" style={{ background: "var(--bg-1)" }}>
      <div className="wrap">
        <div className="section-eyebrow">03 / Reasoning, in production</div>
        <h2 className="section-title">
          Three calls during April 2026's Iran weeks.
          <br />
          <span style={{ color: "var(--text-2)" }}>Read the actual reasoning, not a summary.</span>
        </h2>
        <p className="section-lede">
          Output from the live ReAct pipeline — search the news, weigh contradictions, emit one signal with a written justification. Pick a date to see what the agent saw, queried, and decided.
        </p>

        <div className="reasoning-grid" style={{
          display: "grid",
          gridTemplateColumns: "260px 1fr",
          gap: 24,
          alignItems: "flex-start",
        }}>
          {/* Event picker */}
          <div className="reasoning-tabs" style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {REASONING_EVENTS.map((e) => {
              const isActive = e.id === activeId;
              const c = e.signal === "BUY" ? "var(--green)" : e.signal === "SELL" ? "var(--red)" : "var(--amber)";
              return (
                <button key={e.id} onClick={() => setActiveId(e.id)} style={{
                  textAlign: "left",
                  padding: "14px 16px",
                  background: isActive ? "var(--bg-2)" : "transparent",
                  border: `1px solid ${isActive ? "var(--border-strong)" : "var(--border)"}`,
                  borderLeft: `3px solid ${isActive ? c : "var(--border)"}`,
                  borderRadius: 4,
                  color: "var(--text-0)",
                  transition: "all 140ms",
                }}>
                  <div style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 10.5,
                    color: "var(--text-2)",
                    letterSpacing: "0.06em",
                    marginBottom: 6,
                  }}>{e.date.split(" · ")[0].toUpperCase()}</div>
                  <div style={{ fontSize: 13.5, fontWeight: 500, lineHeight: 1.35, marginBottom: 8 }}>
                    {e.headline}
                  </div>
                  <span className={`signal signal-${e.signal.toLowerCase()}`} style={{ fontSize: 9, padding: "3px 7px" }}>
                    {e.signal}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Active output */}
          <div className="term" data-label={`SignalOutline · ${active.asset}`} key={activeId}>
            <div className="term-head">
              <span style={{ color: "var(--text-0)" }}>{active.date}</span>
              <span style={{ color: "var(--text-2)" }} suppressHydrationWarning>id: {active.id}{idSuffix ? `-${idSuffix}` : ""}</span>
            </div>

            <div style={{ padding: "20px 24px" }}>
              {/* Web searches */}
              <div style={{
                opacity: revealStep >= 1 ? 1 : 0,
                transition: "opacity 300ms",
              }}>
                <Subhead n="01" label="Web searches" />
                <div style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 12,
                  color: "var(--text-1)",
                  display: "flex",
                  flexDirection: "column",
                  gap: 6,
                  marginBottom: 24,
                }}>
                  {active.queries.map((q, i) => (
                    <div key={i} style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                    }}>
                      <span style={{ color: "var(--teal)" }}>$</span>
                      <span style={{ color: "var(--text-2)" }}>tavily.search</span>
                      <span style={{ color: "var(--text-3)" }}>(</span>
                      <span>"{q}"</span>
                      <span style={{ color: "var(--text-3)" }}>)</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Reasoning */}
              <div style={{
                opacity: revealStep >= 2 ? 1 : 0,
                transition: "opacity 300ms",
              }}>
                <Subhead n="02" label="Reasoning" />
                <p style={{
                  fontSize: 14.5,
                  lineHeight: 1.65,
                  color: "var(--text-0)",
                  margin: "0 0 12px",
                  textWrap: "pretty",
                }}>
                  {active.reasoning}
                </p>
                <div style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 6,
                  marginBottom: 24,
                }}>
                  {active.cited.map((c, i) => (
                    <span key={i} className="mono" style={{
                      fontSize: 10.5,
                      padding: "3px 8px",
                      borderRadius: 2,
                      background: "var(--bg-0)",
                      border: "1px solid var(--border)",
                      color: "var(--text-1)",
                    }}>· {c}</span>
                  ))}
                </div>
              </div>

              {/* Final signal */}
              <div style={{
                opacity: revealStep >= 4 ? 1 : 0,
                transition: "opacity 300ms",
              }}>
                <Subhead n="03" label="Decision" />
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 16,
                  padding: 18,
                  background: "var(--bg-0)",
                  border: `1px solid ${signalColor}`,
                  borderLeft: `4px solid ${signalColor}`,
                  borderRadius: 4,
                  flexWrap: "wrap",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
                    <span className={`signal signal-${signalTone}`} style={{
                      fontSize: 14,
                      padding: "8px 14px",
                      fontWeight: 700,
                    }}>
                      {active.signal}
                    </span>
                    <div>
                      <div style={{ fontSize: 11, color: "var(--text-2)", fontFamily: "var(--font-mono)", letterSpacing: "0.08em" }}>CONFIDENCE</div>
                      <div style={{ fontFamily: "var(--font-mono)", fontSize: 18, fontWeight: 600, color: "var(--text-0)" }}>{(active.confidence * 100).toFixed(0)}%</div>
                    </div>
                  </div>
                  <div style={{ flex: 1, minWidth: 120 }}>
                    <div style={{
                      height: 4,
                      background: "var(--bg-3)",
                      borderRadius: 2,
                      overflow: "hidden",
                    }}>
                      <div style={{
                        height: "100%",
                        width: `${active.confidence * 100}%`,
                        background: signalColor,
                        transition: "width 600ms ease",
                      }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 800px) {
          .reasoning-grid { grid-template-columns: 1fr !important; }
          .reasoning-tabs { flex-direction: row !important; overflow-x: auto; padding-bottom: 8px; }
          .reasoning-tabs button { min-width: 220px; }
        }
      `}</style>
    </section>
  );
}

function Subhead({ n, label }) {
  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      gap: 10,
      marginBottom: 12,
      color: "var(--text-2)",
      fontFamily: "var(--font-mono)",
      fontSize: 10.5,
      letterSpacing: "0.12em",
      textTransform: "uppercase",
    }}>
      <span style={{ color: "var(--teal)" }}>{n}</span>
      <span style={{ flex: 1, height: 1, background: "var(--border)" }}></span>
      <span>{label}</span>
    </div>
  );
}
