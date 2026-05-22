"use client";
import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";

export default function CaseStudy() {
  return (
    <section id="case">
      <div className="wrap">
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 24,
          marginBottom: 48,
        }}>
          <div>
            <div className="section-eyebrow">04 / Case study · OSINT-grade signal forensics</div>
            <h2 className="section-title" style={{ marginBottom: 12 }}>
              Liquidity harvesting,
              <br />
              <span style={{
                background: "linear-gradient(90deg, var(--amber), var(--teal))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}>played in reverse.</span>
            </h2>
          </div>
          <div style={{
            display: "flex",
            gap: 1,
            background: "var(--border)",
            border: "1px solid var(--border)",
            borderRadius: 6,
            overflow: "hidden",
          }}>
            <CaseMetric value="+8.54%" label="Portfolio PnL" tone="green" />
            <CaseMetric value="1.08" label="Sharpe ratio" tone="amber" />
            <CaseMetric value="8/8" label="Inverted signals" />
          </div>
        </div>

        <p className="section-lede" style={{ marginBottom: 56 }}>
          A Telegram signal channel claims alpha on TRXUSDT. We treat it like an OSINT target — fingerprint the bot, geolocate the manipulation window, then trade the inversion. The seller's edge becomes ours.
        </p>

        {/* Narrative cards */}
        <div className="case-narrative" style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 16,
          marginBottom: 32,
        }}>
          {[
            {
              n: "T+0",
              t: "Export signals",
              b: "Pull every public post — entry, multiple TPs, SL, leverage. Tag by symbol and timestamp.",
            },
            {
              n: "T+15m",
              t: "Fingerprint the algo",
              b: "TP step multipliers always ×1.52 → ×1.74 → ×1.47 → ×1.50. Identical TP/SL ratio (1.34). It's not a human.",
            },
            {
              n: "T+30m",
              t: "Spot the prep",
              b: "Volume anomalies 15 min before each post. Large candle at 10:00 → SHORT recommendation at 10:15 → another candle at 10:30.",
            },
            {
              n: "T+45m",
              t: "Invert + filter",
              b: "Inverse the position, gate by 4H range midpoint, exit on first SL — break-even risk, asymmetric reward.",
            },
          ].map((s, i) => (
            <div key={i} className="term" data-label={s.n} style={{ minHeight: 180 }}>
              <div className="term-body">
                <div style={{
                  fontSize: 15,
                  fontWeight: 600,
                  marginBottom: 8,
                  letterSpacing: "-0.01em",
                }}>{s.t}</div>
                <div style={{
                  fontSize: 13,
                  color: "var(--text-1)",
                  lineHeight: 1.55,
                }}>{s.b}</div>
              </div>
            </div>
          ))}
        </div>

        {/* The fingerprint visualization */}
        <div className="case-evidence" style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 20,
          marginBottom: 32,
        }}>
          <div className="term" data-label="EVIDENCE · TP MULTIPLIERS">
            <div className="term-head">
              <span style={{ color: "var(--text-0)" }}>8 SHORT signals · TRXUSDT · Jan 2026</span>
              <span style={{ color: "var(--text-2)", fontSize: 10 }}>σ &lt; 0.014</span>
            </div>
            <div style={{ padding: "24px 20px" }}>
              <FingerprintTable />
              <div style={{
                marginTop: 16,
                padding: 12,
                background: "var(--bg-0)",
                border: "1px solid var(--border)",
                borderRadius: 4,
                fontSize: 12,
                fontFamily: "var(--font-mono)",
                color: "var(--text-1)",
              }}>
                <span style={{ color: "var(--amber)" }}>∴</span> deterministic algorithm — not human judgement. Public alpha is bait.
              </div>
            </div>
          </div>

          <div className="term" data-label="EVIDENCE · VOLUME ANOMALY">
            <div className="term-head">
              <span style={{ color: "var(--text-0)" }}>15-min window pre-publication</span>
              <span style={{ color: "var(--text-2)", fontSize: 10 }}>p &lt; 0.001</span>
            </div>
            <div style={{ padding: "24px 20px" }}>
              <VolumeAnomaly />
              <div style={{
                marginTop: 16,
                padding: 12,
                background: "var(--bg-0)",
                border: "1px solid var(--border)",
                borderRadius: 4,
                fontSize: 12,
                fontFamily: "var(--font-mono)",
                color: "var(--text-1)",
              }}>
                <span style={{ color: "var(--amber)" }}>∴</span> the channel's wallet positions <em>before</em> the post — then sends retail to take the other side.
              </div>
            </div>
          </div>
        </div>

        {/* Result strip */}
        <div className="term" data-label="EXECUTION · PORTFOLIO PNL · TRXUSDT JAN 2026" style={{
          background: "linear-gradient(180deg, var(--bg-1) 0%, var(--bg-2) 100%)",
        }}>
          <div className="term-body" style={{ padding: 28 }}>
            <div className="result-grid" style={{
              display: "grid",
              gridTemplateColumns: "1.4fr 1fr",
              gap: 32,
              alignItems: "center",
            }}>
              <PnlCurve />
              <div>
                <h3 style={{
                  fontSize: 22,
                  margin: "0 0 16px",
                  fontWeight: 600,
                  letterSpacing: "-0.015em",
                }}>
                  Inverting an algorithm built to harvest retail.
                </h3>
                <p style={{
                  fontSize: 14.5,
                  color: "var(--text-1)",
                  lineHeight: 1.6,
                  margin: "0 0 24px",
                }}>
                  Eight SHORT calls at the bottom of the 4H candle — every one moved against the recommendation within 45 minutes. Net of fees and slippage, the inverted book closed January 2026 at <span style={{ color: "var(--green)", fontWeight: 600 }}>+8.54%</span> with a portfolio Sharpe of <span style={{ color: "var(--amber)", fontWeight: 600 }}>1.08</span>.
                </p>
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, 1fr)",
                  gap: 1,
                  background: "var(--border)",
                  border: "1px solid var(--border)",
                  borderRadius: 4,
                  overflow: "hidden",
                }}>
                  <MiniStat label="Avg peak PnL" value="+1.44%" />
                  <MiniStat label="Avg drawdown" value="−0.48%" tone="red" />
                  <MiniStat label="Win rate" value="100%" />
                  <MiniStat label="Holding period" value="< 45 min" />
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      <style>{`
        @media (max-width: 900px) {
          .case-narrative { grid-template-columns: repeat(2, 1fr) !important; }
          .case-evidence { grid-template-columns: 1fr !important; }
          .result-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 560px) {
          .case-narrative { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}

function CaseMetric({ value, label, tone }) {
  const color = tone === "green" ? "var(--green)" : tone === "amber" ? "var(--amber)" : "var(--text-0)";
  return (
    <div style={{
      background: "var(--bg-1)",
      padding: "12px 18px",
      minWidth: 110,
    }}>
      <div style={{
        fontFamily: "var(--font-mono)",
        fontSize: 22,
        fontWeight: 700,
        color,
        lineHeight: 1,
      }}>{value}</div>
      <div style={{
        fontSize: 10,
        color: "var(--text-2)",
        marginTop: 6,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
      }}>{label}</div>
    </div>
  );
}

function FingerprintTable() {
  const rows = [
    [1, 0.0712, 1.52, 1.74, 1.47, 1.50],
    [2, 0.0698, 1.52, 1.74, 1.47, 1.50],
    [3, 0.0721, 1.52, 1.74, 1.47, 1.50],
    [4, 0.0688, 1.52, 1.74, 1.47, 1.50],
    [5, 0.0702, 1.52, 1.74, 1.47, 1.50],
    [6, 0.0731, 1.52, 1.74, 1.47, 1.50],
    [7, 0.0695, 1.52, 1.74, 1.47, 1.50],
    [8, 0.0709, 1.52, 1.74, 1.47, 1.50],
  ];
  return (
    <table style={{
      width: "100%",
      borderCollapse: "collapse",
      fontFamily: "var(--font-mono)",
      fontSize: 11.5,
    }}>
      <thead>
        <tr style={{ color: "var(--text-2)" }}>
          {["#", "Entry", "TP1", "TP2", "TP3", "TP4"].map(h => (
            <th key={h} style={{
              textAlign: h === "#" ? "left" : "right",
              padding: "6px 8px",
              borderBottom: "1px solid var(--border)",
              fontWeight: 500,
              fontSize: 10,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}>{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((r, i) => (
          <tr key={i}>
            <td style={{ padding: "5px 8px", color: "var(--text-2)" }}>{r[0]}</td>
            <td style={{ padding: "5px 8px", textAlign: "right", color: "var(--text-1)" }}>${r[1].toFixed(4)}</td>
            {r.slice(2).map((m, j) => (
              <td key={j} style={{
                padding: "5px 8px",
                textAlign: "right",
                color: "var(--amber)",
              }}>×{m.toFixed(2)}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function VolumeAnomaly() {
  const bars = [4, 5, 6, 4, 5, 6, 22, 5, 3, 5, 22, 6, 5, 4, 5];
  const max = Math.max(...bars);
  return (
    <div style={{
      display: "flex",
      alignItems: "flex-end",
      gap: 5,
      height: 160,
      paddingTop: 40,
    }}>
      {bars.map((v, i) => {
        const isSpike = v > 15;
        const isPost = i === 8;
        return (
          <div key={i} style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "flex-end",
            position: "relative",
            height: "100%",
          }}>
            {isPost && (
              <Fragment>
                <div style={{
                  position: "absolute",
                  top: -32,
                  left: "50%",
                  transform: "translateX(-50%)",
                  fontFamily: "var(--font-mono)",
                  fontSize: 9,
                  fontWeight: 600,
                  letterSpacing: "0.08em",
                  color: "var(--teal)",
                  whiteSpace: "nowrap",
                  background: "var(--bg-1)",
                  padding: "3px 7px",
                  border: "1px solid var(--teal)",
                  borderRadius: 2,
                  zIndex: 2,
                }}>POST</div>
                <div style={{
                  position: "absolute",
                  top: -18,
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: 1,
                  bottom: `${(v / max) * 100}%`,
                  background: "var(--teal)",
                  opacity: 0.7,
                }} />
              </Fragment>
            )}
            <div style={{
              width: "100%",
              height: `${(v / max) * 100}%`,
              background: isSpike ? "var(--amber)" : isPost ? "var(--teal)" : "var(--border-strong)",
              opacity: isSpike ? 1 : isPost ? 1 : 0.55,
              borderRadius: "1px 1px 0 0",
              boxShadow: isPost ? "0 0 10px color-mix(in srgb, var(--teal) 50%, transparent)" : "none",
            }} />
          </div>
        );
      })}
    </div>
  );
}

function PnlCurve() {
  // Curve points: 8 trades, cumulative climb
  const trades = [
    { x: 0, y: 0 },
    { x: 1, y: 1.2 },
    { x: 2, y: 0.6 },
    { x: 3, y: 2.4 },
    { x: 4, y: 3.1 },
    { x: 5, y: 2.7 },
    { x: 6, y: 5.0 },
    { x: 7, y: 7.1 },
    { x: 8, y: 8.54 },
  ];
  const W = 460, H = 220, padL = 40, padR = 30, padT = 24, padB = 36;
  const innerW = W - padL - padR;
  const innerH = H - padT - padB;
  const xMax = 8, yMax = 10;
  const xOf = (x) => padL + (x / xMax) * innerW;
  const yOf = (y) => padT + ((yMax - y) / yMax) * innerH;
  const path = trades.map((p, i) => `${i === 0 ? "M" : "L"} ${xOf(p.x)} ${yOf(p.y)}`).join(" ");
  const area = `${path} L ${xOf(xMax)} ${yOf(0)} L ${xOf(0)} ${yOf(0)} Z`;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: "auto" }}>
      <defs>
        <linearGradient id="caseArea" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="var(--green)" stopOpacity="0.35" />
          <stop offset="100%" stopColor="var(--green)" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* gridlines */}
      {[0, 2, 4, 6, 8, 10].map((y, i) => (
        <g key={i}>
          <line x1={padL} x2={W - padR} y1={yOf(y)} y2={yOf(y)}
            stroke="var(--border)" strokeWidth="1" strokeDasharray="2 4" />
          <text x={padL - 8} y={yOf(y) + 4} textAnchor="end"
            fontFamily="var(--font-mono)" fontSize="9.5" fill="var(--text-2)">
            {y}%
          </text>
        </g>
      ))}

      <path d={area} fill="url(#caseArea)" />
      <path d={path} fill="none" stroke="var(--green)" strokeWidth="2" />

      {trades.slice(1).map((p, i) => (
        <circle key={i} cx={xOf(p.x)} cy={yOf(p.y)} r="3.5"
          fill="var(--bg-1)" stroke="var(--green)" strokeWidth="1.5" />
      ))}

      {/* x labels */}
      {trades.slice(1).map((p, i) => (
        <text key={i} x={xOf(p.x)} y={H - padB + 16}
          textAnchor="middle" fontFamily="var(--font-mono)"
          fontSize="9.5" fill="var(--text-2)">
          #{i + 1}
        </text>
      ))}

      {/* final label */}
      <g>
        <line x1={xOf(8)} x2={W - padR} y1={yOf(8.54)} y2={yOf(8.54)}
          stroke="var(--green)" strokeWidth="1" strokeDasharray="2 3" />
        <rect x={W - padR - 38} y={yOf(8.54) - 9} width="38" height="18"
          fill="var(--green)" rx="2" />
        <text x={W - padR - 19} y={yOf(8.54) + 4} textAnchor="middle"
          fontFamily="var(--font-mono)" fontSize="10" fontWeight="600" fill="#001008">
          +8.54%
        </text>
      </g>
    </svg>
  );
}

function MiniStat({ label, value, tone }) {
  const color = tone === "red" ? "var(--red)" : "var(--text-0)";
  return (
    <div style={{
      background: "var(--bg-2)",
      padding: "12px 14px",
    }}>
      <div style={{
        fontSize: 9.5,
        color: "var(--text-2)",
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        marginBottom: 4,
      }}>{label}</div>
      <div style={{
        fontFamily: "var(--font-mono)",
        fontSize: 16,
        fontWeight: 600,
        color,
      }}>{value}</div>
    </div>
  );
}
