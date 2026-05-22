"use client";
import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";

export default function Methodology() {
  const pillars = [
    {
      n: "01",
      label: "TEMPORAL CONTEXT",
      title: "Look-ahead bias is architecturally impossible",
      body: "Every data fetch resolves against an AsyncLocalStorage temporal context. Your strategy can't peek at future bars even if you try — the runtime refuses to surface them. Multi-timeframe joins synchronize automatically.",
      code: `// no timestamp params. context flows.
const c1h  = await getCandles(s, "1h",  100);
const c15m = await getCandles(s, "15m", 100);
const c5m  = await getCandles(s, "5m",  100);
// → all three resolve to the
//   same backtest tick`,
      stack: ["AsyncLocalStorage", "Promise.all-safe", "Same code: backtest/paper/live"],
      link: { href: "https://github.com/tripolskypetr/backtest-kit/blob/master/example/logic/api/fetchNews.ts#L136", label: "fetchNews.ts#L136" },
    },
    {
      n: "02",
      label: "REASONING + ACTING",
      title: "LLMs that search the news before they trade",
      body: "Eight specialised agents hit Tavily and the open web for acute event triggers — SEC actions, exchange hacks, presidential statements — within the last 4–12 hours. Vector search retrieves narrative; the LLM decides BUY / SELL / WAIT with cited reasoning.",
      code: `await search("BTC breaking news ${"${date}"}");
await search("SEC CFTC DOJ action ${"${date}"}");
await search("Trump statement BTC ${"${date}"}");
await search("flash crash reason ${"${date}"}");
// → typed signal + reasoning + cited
//   sources, validated by Zod`,
      stack: ["ReAct loop", "Tavily / Perplexity API", "Zod-validated outline"],
      link: { href: "https://github.com/tripolskypetr/backtest-kit/blob/master/example/logic/core/outline/forecast.outline.ts#L68", label: "forecast.outline.ts#L68" },
    },
    {
      n: "03",
      label: "PINESCRIPT, LOCAL",
      title: "Indicators run where TradingView doesn't",
      body: "PineTS executes .pine files locally on any data source. Strategies built for BTC on Binance redeploy unchanged to UZSE (Uzbekistan), MSE (Mongolia), DSE (Dhaka) — markets TradingView refuses to list.",
      code: `npm start -- \\
  --pine ./math/feb_2026.pine \\
  --timeframe 15m --limit 500 \\
  --when "2026-02-28T00:00:00Z" \\
  --jsonl
// → dump consumable by any LLM
//   or downstream notebook`,
      stack: ["PineTS runtime", "8 emerging exchanges", "JSONL-native"],
      link: { href: "https://github.com/tripolskypetr/backtest-kit/tree/master/packages/pinets", label: "packages/pinets" },
    },
    {
      n: "04",
      label: "MONOREPO RUNTIME",
      title: "Enterprise architecture, parallel by default",
      body: "Strategies, risk rules and frame definitions are first-class entities in a typed swarm. The same monorepo runs hundreds of strategies in parallel against shared exchanges and shared risk validators — no copy-paste, no drift.",
      code: `addStrategySchema({
  strategyName: "liq_spike_bounce",
  interval: "15m",
  riskList: [
    RiskName.TakeProfitDistanceRisk,
    RiskName.StopLossDistanceRisk,
  ],
  getSignal,
});`,
      stack: ["agent-swarm-kit", "Self-enforcing runtime", "Crash-safe persistence"],
      link: { href: "https://github.com/backtest-kit/backtest-monorepo-parallel", label: "backtest-monorepo-parallel" },
    },
  ];

  return (
    <section id="method">
      <div className="wrap">
        <div className="section-eyebrow">02 / Methodology</div>
        <h2 className="section-title">
          Four engineering decisions
          <br />
          <span style={{ color: "var(--text-2)" }}>that compound into edge.</span>
        </h2>
        <p className="section-lede">
          Strategy alpha decays. The runtime underneath it doesn't. We invest where most desks under-invest — in the boring infrastructure that makes every iteration faithful, every signal reproducible, every deploy painless.
        </p>

        <div className="method-grid" style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: 20,
          marginTop: 24,
        }}>
          {pillars.map((p) => (
            <article key={p.n} className="term" data-label={`${p.n} · ${p.label}`} style={{
              display: "flex",
              flexDirection: "column",
            }}>
              <div style={{ padding: "32px 28px 0" }}>
                <h3 style={{
                  fontSize: "clamp(20px, 2.2vw, 26px)",
                  margin: "0 0 12px",
                  fontWeight: 600,
                  letterSpacing: "-0.015em",
                  lineHeight: 1.2,
                  textWrap: "balance",
                }}>{p.title}</h3>
                <p style={{
                  color: "var(--text-1)",
                  fontSize: 14.5,
                  lineHeight: 1.6,
                  margin: 0,
                  textWrap: "pretty",
                }}>{p.body}</p>
              </div>

              <pre style={{
                margin: "24px 28px 20px",
                padding: "16px 18px",
                background: "var(--bg-0)",
                border: "1px solid var(--border)",
                borderRadius: 4,
                fontSize: 12,
                color: "var(--text-1)",
                overflowX: "auto",
              }}>{p.code}</pre>

              <div style={{
                marginTop: "auto",
                padding: "14px 28px",
                borderTop: "1px solid var(--border)",
                display: "flex",
                flexWrap: "wrap",
                gap: 8,
                alignItems: "center",
                background: "var(--bg-2)",
              }}>
                {p.stack.map((s) => (
                  <span key={s} className="mono" style={{
                    fontSize: 10.5,
                    letterSpacing: "0.04em",
                    padding: "3px 8px",
                    borderRadius: 2,
                    color: "var(--text-1)",
                    background: "var(--bg-1)",
                    border: "1px solid var(--border)",
                  }}>{s}</span>
                ))}
                {p.link && (
                  <a href={p.link.href} target="_blank" rel="noopener" className="mono" style={{
                    marginLeft: "auto",
                    fontSize: 11,
                    color: "var(--teal)",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    textDecoration: "underline",
                    textDecorationColor: "var(--border-strong)",
                    textUnderlineOffset: 3,
                  }}>
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" style={{ flexShrink: 0 }}><path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.21 11.4.6.11.82-.26.82-.58v-2.03c-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.08-.73.08-.73 1.2.09 1.84 1.24 1.84 1.24 1.07 1.84 2.81 1.31 3.5 1 .11-.78.42-1.31.76-1.61-2.66-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.13-.31-.54-1.53.12-3.18 0 0 1-.32 3.3 1.23A11.5 11.5 0 0 1 12 5.8c1.02.01 2.04.14 3 .4 2.3-1.55 3.3-1.23 3.3-1.23.66 1.65.25 2.87.12 3.18.77.84 1.23 1.91 1.23 3.22 0 4.61-2.81 5.62-5.49 5.92.43.37.81 1.1.81 2.22v3.29c0 .32.22.7.83.58A12.01 12.01 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>
                    {p.link.label}
                    <span style={{ color: "var(--text-3)" }}>↗</span>
                  </a>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .method-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
