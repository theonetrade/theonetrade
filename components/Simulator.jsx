"use client";
import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";

const STRATEGIES = {
  liq_bounce: {
    id: "liq_bounce",
    name: "Liquidation Spike Bounce",
    sub: "BTCUSDT · 15m · Feb 2026",
    winRate: 0.71,
    rr: 1.88,
    freq: 0.20,
    sharpe: 0.84,
    color: "var(--teal)",
  },
  liq_harvest: {
    id: "liq_harvest",
    name: "Liquidity Harvesting",
    sub: "TRXUSDT · OSINT inversion · Jan 2026",
    winRate: 0.78,
    rr: 1.55,
    freq: 0.28,
    sharpe: 1.08,
    color: "var(--amber)",
  },
  news_react: {
    id: "news_react",
    name: "News ReAct Signal",
    sub: "BTCUSDT · LLM + Tavily · Apr 2026",
    winRate: 0.62,
    rr: 2.20,
    freq: 0.18,
    sharpe: 0.94,
    color: "var(--green)",
  },
};

export default function Simulator() {
  const [capital, setCapital] = useState(50000);
  const [risk, setRisk] = useState(2);
  const [months, setMonths] = useState(6);
  const [strategyId, setStrategyId] = useState("liq_harvest");
  const [seed, setSeed] = useState(7);

  const strategy = STRATEGIES[strategyId];

  // run Monte Carlo simulation
  const sim = useMemo(() => {
    let s = seed * 9999;
    const rand = () => {
      s = (s * 9301 + 49297) % 233280;
      return s / 233280;
    };
    const days = months * 30;
    const trades = [];
    let equity = capital;
    const curve = [{ d: 0, e: equity }];
    let peak = equity;
    let maxDd = 0;

    for (let d = 1; d <= days; d++) {
      // simulate trades this day based on freq
      const tradesToday = rand() < strategy.freq ? 1 : 0;
      for (let i = 0; i < tradesToday; i++) {
        const win = rand() < strategy.winRate;
        const positionRisk = equity * (risk / 100);
        const pnl = win
          ? positionRisk * strategy.rr
          : -positionRisk;
        equity += pnl;
        trades.push({ d, win, pnl });
      }
      if (equity > peak) peak = equity;
      const dd = (peak - equity) / peak;
      if (dd > maxDd) maxDd = dd;
      curve.push({ d, e: equity });
    }
    const totalReturn = (equity - capital) / capital;
    const monthlyReturn = Math.pow(1 + totalReturn, 1 / months) - 1;
    return {
      curve,
      finalEquity: equity,
      totalReturn,
      monthlyReturn,
      maxDd,
      trades: trades.length,
      winCount: trades.filter(t => t.win).length,
    };
  }, [capital, risk, months, strategyId, seed]);

  return (
    <section id="simulator" style={{ background: "var(--bg-1)" }}>
      <div className="wrap">
        <div className="section-eyebrow">05 / Simulator</div>
        <h2 className="section-title">
          Pressure-test every strategy
          <br />
          <span style={{ color: "var(--text-2)" }}>against your own book.</span>
        </h2>
        <p className="section-lede">
          Monte-Carlo across our published backtest distributions. Adjust capital, risk-per-trade and horizon — equity, drawdown and trade count update in real time. Production runs the same code paths against live exchange feeds.
        </p>

        <div className="sim-grid" style={{
          display: "grid",
          gridTemplateColumns: "320px 1fr",
          gap: 20,
        }}>
          {/* Controls */}
          <div className="term" data-label="PARAMETERS">
            <div className="term-body" style={{ padding: 24 }}>
              <ControlGroup label="Strategy">
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {Object.values(STRATEGIES).map((st) => (
                    <button key={st.id} onClick={() => setStrategyId(st.id)} style={{
                      textAlign: "left",
                      padding: "10px 12px",
                      background: strategyId === st.id ? "var(--bg-2)" : "transparent",
                      border: `1px solid ${strategyId === st.id ? "var(--border-strong)" : "var(--border)"}`,
                      borderLeft: `3px solid ${strategyId === st.id ? st.color : "var(--border)"}`,
                      borderRadius: 3,
                      color: "var(--text-0)",
                      fontSize: 13,
                    }}>
                      <div style={{ fontWeight: 500 }}>{st.name}</div>
                      <div style={{ fontSize: 11, color: "var(--text-2)", fontFamily: "var(--font-mono)", marginTop: 2 }}>{st.sub}</div>
                    </button>
                  ))}
                </div>
              </ControlGroup>

              <Slider
                label="Capital"
                value={capital}
                onChange={setCapital}
                min={5000}
                max={500000}
                step={1000}
                format={(v) => `$${v.toLocaleString()}`}
              />
              <Slider
                label="Risk per trade"
                value={risk}
                onChange={setRisk}
                min={0.25}
                max={5}
                step={0.25}
                format={(v) => `${v.toFixed(2)}%`}
              />
              <Slider
                label="Horizon"
                value={months}
                onChange={setMonths}
                min={1}
                max={24}
                step={1}
                format={(v) => `${v} month${v > 1 ? "s" : ""}`}
              />

              <button onClick={() => setSeed(s => s + 1)} className="btn btn-ghost" style={{
                width: "100%",
                justifyContent: "center",
                marginTop: 16,
              }}>
                ↻ Resample
              </button>
            </div>
          </div>

          {/* Output */}
          <div className="term" data-label={`BACKTEST · ${strategy.name.toUpperCase()}`}>
            <div className="term-head">
              <span style={{ color: "var(--text-0)" }}>monte_carlo.run(seed={seed})</span>
              <span style={{ color: "var(--text-2)", fontSize: 10 }}>n={sim.trades} trades · {months}m</span>
            </div>

            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: 1,
              background: "var(--border)",
              borderBottom: "1px solid var(--border)",
            }}>
              <SimStat label="Final equity" value={`$${Math.round(sim.finalEquity).toLocaleString()}`} primary />
              <SimStat label="Total return"
                value={`${sim.totalReturn >= 0 ? "+" : ""}${(sim.totalReturn * 100).toFixed(1)}%`}
                tone={sim.totalReturn >= 0 ? "green" : "red"} />
              <SimStat label="Monthly avg"
                value={`${(sim.monthlyReturn * 100).toFixed(2)}%`}
                tone="amber" />
              <SimStat label="Max DD"
                value={`−${(sim.maxDd * 100).toFixed(1)}%`}
                tone="red" />
            </div>

            <div style={{ padding: "16px 8px 0", aspectRatio: "16/8" }}>
              <EquityCurve curve={sim.curve} capital={capital} color={strategy.color} />
            </div>

            <div style={{
              borderTop: "1px solid var(--border)",
              padding: "14px 24px",
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              color: "var(--text-2)",
              display: "flex",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 12,
            }}>
              <span>strategy.winRate = {(strategy.winRate * 100).toFixed(0)}%</span>
              <span>strategy.rr = 1:{strategy.rr.toFixed(2)}</span>
              <span>strategy.sharpe = {strategy.sharpe.toFixed(2)}</span>
              <span style={{ color: "var(--text-3)" }}>· past performance ≠ future returns</span>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .sim-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}

function ControlGroup({ label, children }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{
        fontSize: 10,
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        color: "var(--text-2)",
        fontFamily: "var(--font-mono)",
        marginBottom: 10,
      }}>{label}</div>
      {children}
    </div>
  );
}

function Slider({ label, value, onChange, min, max, step, format }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "baseline",
        marginBottom: 8,
      }}>
        <span style={{
          fontSize: 10,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: "var(--text-2)",
          fontFamily: "var(--font-mono)",
        }}>{label}</span>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--text-0)", fontWeight: 500 }}>
          {format(value)}
        </span>
      </div>
      <input
        type="range"
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        min={min} max={max} step={step}
        style={{
          width: "100%",
          accentColor: "var(--teal)",
        }}
      />
    </div>
  );
}

function SimStat({ label, value, primary, tone }) {
  const color =
    tone === "green" ? "var(--green)" :
    tone === "red" ? "var(--red)" :
    tone === "amber" ? "var(--amber)" :
    "var(--text-0)";
  return (
    <div style={{
      background: "var(--bg-1)",
      padding: "16px 18px",
    }}>
      <div style={{
        fontSize: 10,
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        color: "var(--text-2)",
        marginBottom: 6,
      }}>{label}</div>
      <div style={{
        fontFamily: "var(--font-mono)",
        fontSize: primary ? 22 : 18,
        fontWeight: 600,
        color,
      }}>{value}</div>
    </div>
  );
}

function EquityCurve({ curve, capital, color }) {
  const W = 720, H = 280, padL = 50, padR = 30, padT = 24, padB = 30;
  const innerW = W - padL - padR;
  const innerH = H - padT - padB;
  const xMax = curve[curve.length - 1].d;
  const yMin = Math.min(...curve.map(p => p.e), capital * 0.9);
  const yMax = Math.max(...curve.map(p => p.e), capital * 1.1);
  const xOf = (x) => padL + (x / xMax) * innerW;
  const yOf = (y) => padT + ((yMax - y) / (yMax - yMin)) * innerH;

  const path = curve.map((p, i) => `${i === 0 ? "M" : "L"} ${xOf(p.d)} ${yOf(p.e)}`).join(" ");
  const area = `${path} L ${xOf(xMax)} ${H - padB} L ${xOf(0)} ${H - padB} Z`;

  const ticks = 5;
  const yTicks = Array.from({ length: ticks }, (_, i) => yMin + (yMax - yMin) * (i / (ticks - 1)));

  return (
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" style={{ width: "100%", height: "100%" }}>
      <defs>
        <linearGradient id="eqArea" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.28" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      {yTicks.map((y, i) => (
        <g key={i}>
          <line x1={padL} x2={W - padR} y1={yOf(y)} y2={yOf(y)}
            stroke="var(--border)" strokeWidth="1" strokeDasharray="2 4" />
          <text x={padL - 8} y={yOf(y) + 4} textAnchor="end"
            fontFamily="var(--font-mono)" fontSize="9.5" fill="var(--text-2)">
            ${(y / 1000).toFixed(y >= 100000 ? 0 : 1)}k
          </text>
        </g>
      ))}

      {/* capital baseline */}
      <line x1={padL} x2={W - padR} y1={yOf(capital)} y2={yOf(capital)}
        stroke="var(--text-3)" strokeWidth="1" strokeDasharray="4 4" />
      <text x={W - padR + 4} y={yOf(capital) + 4} fontFamily="var(--font-mono)" fontSize="9" fill="var(--text-3)">start</text>

      <path d={area} fill="url(#eqArea)" />
      <path d={path} fill="none" stroke={color} strokeWidth="2" />
    </svg>
  );
}
