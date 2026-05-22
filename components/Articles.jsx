"use client";
import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";

const ARTICLES = [
  {
    n: "01",
    title: "How I made look-ahead bias architecturally impossible",
    tag: "Architecture",
    read: "8 min",
    excerpt: "AsyncLocalStorage as a temporal context propagated through every async boundary. Strategies physically cannot peek at future data.",
    href: "https://tripolskypetr.medium.com/how-i-made-look-ahead-bias-architecturally-impossible-in-trading-backtests-63e4115f6e16",
  },
  {
    n: "02",
    title: "Second-order chaos: bots playing themselves at a loss",
    tag: "Market structure",
    read: "10 min",
    excerpt: "Why 1,000 identical RSI bots lose 18% / day to each other — and what to use instead of canned indicator stacks.",
    href: "https://tripolskypetr.medium.com/second-order-chaos-how-algo-trading-bots-play-against-themselves-at-a-loss-791902c97515",
  },
  {
    n: "03",
    title: "How AI got hands for stock trading",
    tag: "Tooling",
    read: "12 min",
    excerpt: "Claude Code finally has a TradingView replacement — local Pine Script, JSONL logs, an agent skill that survives context resets.",
    href: "https://tripolskypetr.medium.com/how-ai-got-hands-for-stock-trading-bb558991cd82",
  },
  {
    n: "04",
    title: "Why the price drops in a single candle",
    tag: "Options · Risk",
    read: "11 min",
    excerpt: "Gamma convexity, jump diffusion, and the 2-and-20 incentive structure behind liquidation cascades.",
    href: "https://tripolskypetr.medium.com/why-the-price-drops-in-a-single-candle-95f4695ee3c7",
  },
  {
    n: "05",
    title: "AI workflow for liquidation cascade criteria",
    tag: "Workflow",
    read: "14 min",
    excerpt: "Claude's /loop command, calendar-month strategy files, and an acceptance contract that prevents brute-force iteration.",
    href: "https://tripolskypetr.medium.com/building-an-ai-workflow-for-identifying-and-updating-liquidation-cascade-criteria-c9c169db5997",
  },
  {
    n: "06",
    title: "News sentiment AI analysis blueprint",
    tag: "ReAct · LLM",
    read: "13 min",
    excerpt: "Why TauricResearch and node-ccxt-backtest both fail — and what changes when the agent searches before it decides.",
    href: "https://tripolskypetr.medium.com/ai-agent-for-trading-signals-0874c8a5c2ad",
  },
  {
    n: "07",
    title: "AI news sentiment as a trading signal",
    tag: "Sentiment",
    read: "9 min",
    excerpt: "Vector search over near-zero-score results. Why a 24-hour window beats a 4-hour one for finding regime change.",
    href: "https://tripolskypetr.medium.com/ai-news-sentiment-analysis-as-a-trading-signal-057f54ac3293",
  },
  {
    n: "08",
    title: "AI liquidity harvesting machine",
    tag: "OSINT · Featured",
    read: "10 min",
    excerpt: "Inverting a Telegram signal channel's TRXUSDT calls. Sharpe 1.08, PnL +8.54%, 8/8 inversions correct.",
    href: "https://tripolskypetr.medium.com/ai-liquidity-harvesting-machine-bdd040e6c15f",
    featured: true,
  },
  {
    n: "09",
    title: "Running Pine Script on exchanges without TradingView",
    tag: "Emerging markets",
    read: "11 min",
    excerpt: "UZSE, MSE, DSE — eight regional exchanges with no TradingView listing. Scrape, synthesize candles, run Pine.",
    href: "https://tripolskypetr.medium.com/running-pine-script-on-exchanges-without-tradingview-c04f02165243",
  },
  {
    n: "10",
    title: "Why your broker froze your deposit",
    tag: "DCA · Risk",
    read: "7 min",
    excerpt: "Where +20%/month DCA returns actually come from — and what brokers hide on the dashboard while you wait for them.",
    href: "https://tripolskypetr.medium.com/why-your-broker-froze-your-deposit-or-where-does-20-per-month-come-from-789323c0e459",
  },
];

export default function Articles() {
  const [filter, setFilter] = useState("All");
  const tags = ["All", ...new Set(ARTICLES.map(a => a.tag.split(" · ")[0]))];
  const filtered = filter === "All" ? ARTICLES : ARTICLES.filter(a => a.tag.startsWith(filter));

  return (
    <section id="articles">
      <div className="wrap">
        <div style={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 24,
          marginBottom: 40,
        }}>
          <div>
            <div className="section-eyebrow">08 / Research log</div>
            <h2 className="section-title" style={{ marginBottom: 12 }}>
              Long-form thinking
              <br />
              <span style={{ color: "var(--text-2)" }}>behind every strategy.</span>
            </h2>
          </div>
          <div style={{
            display: "flex",
            gap: 6,
            flexWrap: "wrap",
          }}>
            {tags.map((t) => (
              <button key={t} onClick={() => setFilter(t)} style={{
                fontSize: 12,
                fontFamily: "var(--font-mono)",
                padding: "6px 12px",
                borderRadius: 999,
                border: `1px solid ${filter === t ? "var(--teal)" : "var(--border)"}`,
                background: filter === t ? "color-mix(in srgb, var(--teal) 12%, transparent)" : "transparent",
                color: filter === t ? "var(--teal)" : "var(--text-1)",
                transition: "all 140ms",
              }}>
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="articles-grid" style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 16,
        }}>
          {filtered.map((a) => (
            <a key={a.n} href={a.href} target="_blank" rel="noopener" className="article-card" style={{
              position: "relative",
              padding: 24,
              background: a.featured ? "var(--bg-2)" : "var(--bg-1)",
              border: `1px solid ${a.featured ? "var(--amber)" : "var(--border)"}`,
              borderRadius: 6,
              display: "flex",
              flexDirection: "column",
              gap: 14,
              minHeight: 240,
              transition: "border-color 160ms, transform 160ms",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = a.featured ? "var(--amber)" : "var(--text-2)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = a.featured ? "var(--amber)" : "var(--border)"; }}>
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
              }}>
                <span style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 10.5,
                  color: a.featured ? "var(--amber)" : "var(--text-2)",
                  letterSpacing: "0.1em",
                }}>NOTE · {a.n}</span>
                <span style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 10,
                  color: "var(--text-3)",
                }}>{a.read}</span>
              </div>
              <h3 style={{
                margin: 0,
                fontSize: 17,
                lineHeight: 1.3,
                letterSpacing: "-0.01em",
                fontWeight: 600,
                color: "var(--text-0)",
                textWrap: "balance",
              }}>
                {a.title}
              </h3>
              <p style={{
                margin: 0,
                fontSize: 13.5,
                color: "var(--text-1)",
                lineHeight: 1.55,
                flexGrow: 1,
                textWrap: "pretty",
              }}>{a.excerpt}</p>
              <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                paddingTop: 14,
                borderTop: "1px solid var(--border)",
              }}>
                <span className="mono" style={{
                  fontSize: 10.5,
                  color: "var(--text-2)",
                  letterSpacing: "0.06em",
                }}>· {a.tag}</span>
                <span style={{
                  color: a.featured ? "var(--amber)" : "var(--teal)",
                  fontSize: 13,
                }}>→</span>
              </div>
            </a>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .articles-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 560px) {
          .articles-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
