"use client";
import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";

const SERVICES = [
  {
    n: "01",
    tag: "ENGAGEMENT",
    title: "Bespoke AI strategy development",
    body: "We co-design a strategy with your team — market structure analysis, hypothesis formulation, Pine Script implementation, validation runs across calendar-month frames. Delivered as runnable code in your repo, not a slide.",
    bullets: ["Monthly recalibration", "Knowledge base accrues", "Code reviewed by a second agent"],
    cta: "Start a discovery call",
    accent: "teal",
    big: true,
  },
  {
    n: "02",
    tag: "MANAGED",
    title: "Discretionary asset management",
    body: "We run our published strategies on your mandate. Transparent reporting via the backtest-kit UI — every trade has a JSONL audit trail and a written reasoning record.",
    bullets: ["Per-trade reasoning logged", "Real-time PnL dashboard", "Min. $250k AUM"],
    cta: "Request term sheet",
    accent: "amber",
    big: true,
  },
  {
    n: "03",
    tag: "ENABLEMENT",
    title: "Quant team training & consulting",
    body: "Hands-on workshops for your desk: AsyncLocalStorage temporal patterns, ReAct agent design, Pine Script-to-TypeScript translation, swarm-kit deployment.",
    bullets: ["2 / 5-day intensives", "On-site or remote", "Internal handbook included"],
    cta: "See curriculum",
    accent: "teal",
  },
  {
    n: "04",
    tag: "INFRASTRUCTURE",
    title: "Emerging-market exchange integration",
    body: "Markets TradingView refuses to list — UZSE (Uzbekistan), MSE (Mongolia), DSE (Dhaka), GSE (Ghana). We build the scrape, candle synthesis and data pipeline. You get clean OHLCV and a working backtest.",
    bullets: ["8 exchanges in production", "MongoDB or your warehouse", "OHLCV synthesized from raw trades"],
    cta: "Check coverage",
    accent: "amber",
  },
  {
    n: "05",
    tag: "PLATFORM",
    title: "backtest-kit enterprise license & support",
    body: "Commercial license, priority issue handling, custom risk validators, SLA-backed deployments. For desks that need the OSS but can't operate it solo.",
    bullets: ["MIT core + commercial addons", "Direct line to maintainers", "Self-hosted or our cloud"],
    cta: "Talk to engineering",
    accent: "teal",
  },
];

export default function Products() {
  return (
    <section id="services">
      <div className="wrap">
        <div className="section-eyebrow">06 / What we offer</div>
        <h2 className="section-title">
          Five ways to put the runtime
          <br />
          <span style={{ color: "var(--text-2)" }}>against your problem.</span>
        </h2>
        <p className="section-lede">
          From a single discovery call to multi-year asset mandates. Every engagement runs on the same open-source toolchain — so the strategy you commission today is auditable, reproducible, and yours to keep running.
        </p>

        <div className="services-grid" style={{
          display: "grid",
          gridTemplateColumns: "repeat(6, 1fr)",
          gridAutoRows: "minmax(280px, auto)",
          gap: 16,
        }}>
          {SERVICES.map((s, i) => {
            const accentColor = s.accent === "amber" ? "var(--amber)" : "var(--teal)";
            const span = s.big ? "span 3" : "span 2";
            return (
              <article key={s.n}
                className="service-card"
                data-big={s.big ? "1" : "0"}
                style={{
                  gridColumn: span,
                  position: "relative",
                  background: "var(--bg-1)",
                  border: "1px solid var(--border)",
                  borderRadius: 6,
                  padding: 28,
                  display: "flex",
                  flexDirection: "column",
                  overflow: "hidden",
                  transition: "border-color 200ms, transform 200ms",
                }}>
                <div aria-hidden="true" style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 1,
                  background: `linear-gradient(90deg, ${accentColor}, transparent 60%)`,
                }} />

                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: 24,
                }}>
                  <span style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 10.5,
                    letterSpacing: "0.12em",
                    color: "var(--text-2)",
                  }}>{s.n} · {s.tag}</span>
                  <span style={{
                    width: 24, height: 24,
                    borderRadius: "50%",
                    border: `1px solid ${accentColor}`,
                    color: accentColor,
                    display: "grid",
                    placeItems: "center",
                    fontSize: 12,
                  }}>↗</span>
                </div>

                <h3 style={{
                  fontSize: s.big ? "clamp(22px, 2.4vw, 30px)" : "clamp(18px, 2vw, 22px)",
                  margin: "0 0 14px",
                  fontWeight: 600,
                  letterSpacing: "-0.02em",
                  lineHeight: 1.15,
                  textWrap: "balance",
                }}>
                  {s.title}
                </h3>

                <p style={{
                  fontSize: s.big ? 15 : 14,
                  color: "var(--text-1)",
                  lineHeight: 1.6,
                  margin: "0 0 20px",
                  textWrap: "pretty",
                }}>{s.body}</p>

                <ul style={{
                  listStyle: "none",
                  margin: "0 0 24px",
                  padding: 0,
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                  fontSize: 13,
                  color: "var(--text-1)",
                }}>
                  {s.bullets.map((b, j) => (
                    <li key={j} style={{ display: "flex", gap: 10, alignItems: "baseline" }}>
                      <span style={{ color: accentColor, fontFamily: "var(--font-mono)" }}>·</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>

                <div style={{ marginTop: "auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <a href="#contact" style={{
                    fontSize: 13,
                    fontWeight: 500,
                    color: accentColor,
                    fontFamily: "var(--font-mono)",
                  }}>
                    {s.cta} →
                  </a>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      <style>{`
        @media (max-width: 1024px) {
          .services-grid { grid-template-columns: repeat(4, 1fr) !important; }
          .service-card { grid-column: span 2 !important; }
        }
        @media (max-width: 640px) {
          .services-grid { grid-template-columns: 1fr !important; }
          .service-card { grid-column: 1 !important; }
        }
      `}</style>
    </section>
  );
}
