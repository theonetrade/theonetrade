"use client";
import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";

const PACKAGES = [
  { name: "@backtest-kit/cli", desc: "Scaffold · dump · backtest · paper · live" },
  { name: "@backtest-kit/pinets", desc: "Local Pine Script interpreter" },
  { name: "@backtest-kit/graph", desc: "Reactive source/output graph" },
  { name: "@backtest-kit/ui", desc: "Trade lifecycle inspector" },
  { name: "agent-swarm-kit", desc: "ReAct + tool-calling runtime" },
  { name: "functools-kit", desc: "Cache · str · AsyncLocalStorage" },
  { name: "ollama", desc: "Local LLM bindings" },
];

export default function TechStack() {
  return (
    <section id="stack" style={{ background: "var(--bg-1)" }}>
      <div className="wrap">
        <div className="section-eyebrow">07 / Open source · Engineering stack</div>
        <h2 className="section-title">
          Everything we build is auditable.
          <br />
          <span style={{ color: "var(--text-2)" }}>The runtime is MIT.</span>
        </h2>
        <p className="section-lede">
          We don't sell a black box. The toolchain that powers our strategies is published on GitHub, structured as a monorepo for parallel execution. Fork it, audit it, run it on your laptop.
        </p>

        <div className="stack-grid" style={{
          display: "grid",
          gridTemplateColumns: "1.4fr 1fr",
          gap: 20,
          marginBottom: 32,
        }}>
          {/* Package map */}
          <div className="term" data-label="MONOREPO · @backtest-kit/*">
            <div className="term-head">
              <span style={{ color: "var(--text-0)" }}>github.com/tripolskypetr/backtest-kit</span>
              <span style={{ color: "var(--text-2)", fontSize: 10 }}>v6.0.0 · MIT</span>
            </div>
            <div className="term-body" style={{ padding: "24px 28px" }}>
              <div style={{
                fontFamily: "var(--font-mono)",
                fontSize: 12.5,
                lineHeight: 1.95,
                color: "var(--text-1)",
              }}>
                <div style={{ color: "var(--text-0)", marginBottom: 4 }}>backtest-kit/</div>
                {PACKAGES.map((p, i) => {
                  const isLast = i === PACKAGES.length - 1;
                  return (
                    <div key={p.name} style={{ display: "flex", gap: 8 }}>
                      <span style={{ color: "var(--text-3)" }}>{isLast ? "└─" : "├─"}</span>
                      <span style={{ color: "var(--teal)", flexShrink: 0 }}>{p.name}</span>
                      <span style={{ color: "var(--text-3)" }}>— {p.desc}</span>
                    </div>
                  );
                })}
              </div>

              <div style={{
                marginTop: 24,
                padding: "12px 14px",
                background: "var(--bg-0)",
                border: "1px solid var(--border)",
                borderRadius: 4,
                fontFamily: "var(--font-mono)",
                fontSize: 12,
                color: "var(--text-1)",
                display: "flex",
                alignItems: "center",
                gap: 10,
                flexWrap: "wrap",
              }}>
                <span style={{ color: "var(--text-3)" }}>$</span>
                <span style={{ color: "var(--text-0)" }}>npx -y @backtest-kit/cli</span>
                <span style={{ color: "var(--text-3)" }}>--init</span>
                <span style={{ marginLeft: "auto", color: "var(--text-3)" }}>copy ⌘C</span>
              </div>
            </div>
          </div>

          {/* Differentiators */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <DiffCard
              n="01"
              title="Self-enforcing runtime"
              body={<>Look-ahead bias, missing stop-loss, invalid risk-reward — all caught by Zod validators and AsyncLocalStorage guards <em>before</em> a signal leaves the boundary.</>}
            />
            <DiffCard
              n="02"
              title="Parallel monorepo execution"
              body={<>Hundreds of strategies share one exchange handle, one risk validator pool, one queue. <a href="https://tripolskypetr.medium.com/monorepo-architecture-for-parallel-execution-of-trading-strategies-8181f60f88e5" target="_blank" rel="noopener" style={{ color: "var(--teal)", textDecoration: "underline", textDecorationColor: "var(--border-strong)", textUnderlineOffset: 3 }}>Read the architecture →</a></>}
            />
            <DiffCard
              n="03"
              title="JSONL-native logs"
              body="Every tick, every reasoning chain, every risk rejection — appended as JSON Lines. Claude Code reads them natively; jq them in a second."
            />
          </div>
        </div>

        {/* Emerging market exchanges */}
        <div className="term" data-label="EMERGING-MARKET COVERAGE">
          <div className="term-body" style={{ padding: "32px 28px" }}>
            <div style={{
              display: "flex",
              alignItems: "baseline",
              justifyContent: "space-between",
              gap: 24,
              flexWrap: "wrap",
              marginBottom: 24,
            }}>
              <h3 style={{
                fontSize: "clamp(18px, 2vw, 24px)",
                margin: 0,
                letterSpacing: "-0.015em",
                fontWeight: 600,
                maxWidth: 560,
                textWrap: "balance",
              }}>
                We run Pine Script on exchanges TradingView won't list.
              </h3>
              <span style={{
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                color: "var(--text-2)",
              }}>PineTS + custom scrapers</span>
            </div>
            <div className="exchange-grid" style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: 1,
              background: "var(--border)",
              border: "1px solid var(--border)",
              borderRadius: 4,
              overflow: "hidden",
            }}>
              {[
                { ticker: "UZSE", country: "Uzbekistan", status: "live" },
                { ticker: "MSE", country: "Mongolia", status: "live" },
                { ticker: "DSE", country: "Dhaka, Bangladesh", status: "live" },
                { ticker: "GSE", country: "Ghana", status: "live" },
                { ticker: "SGBV", country: "Algeria", status: "beta" },
                { ticker: "BSE", country: "Botswana", status: "beta" },
                { ticker: "ESE", country: "Eswatini", status: "queued" },
                { ticker: "MERJ", country: "Seychelles", status: "queued" },
              ].map((ex) => {
                const tone =
                  ex.status === "live" ? "var(--green)" :
                  ex.status === "beta" ? "var(--amber)" :
                  "var(--text-3)";
                return (
                  <div key={ex.ticker} style={{
                    padding: "18px 20px",
                    background: "var(--bg-1)",
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                      <span style={{
                        width: 6, height: 6,
                        borderRadius: "50%",
                        background: tone,
                        boxShadow: ex.status === "live" ? `0 0 6px ${tone}` : "none",
                      }}></span>
                      <span style={{
                        fontSize: 14,
                        fontWeight: 600,
                        letterSpacing: "0.02em",
                      }}>{ex.ticker}</span>
                    </div>
                    <div style={{ fontSize: 11.5, color: "var(--text-2)" }}>{ex.country}</div>
                    <div style={{
                      fontSize: 10,
                      color: tone,
                      fontFamily: "var(--font-mono)",
                      marginTop: 4,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                    }}>{ex.status}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .stack-grid { grid-template-columns: 1fr !important; }
          .exchange-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>
    </section>
  );
}

function DiffCard({ n, title, body }) {
  return (
    <div className="term" data-label={`DIFFERENTIATOR · ${n}`}>
      <div className="term-body" style={{ padding: 22 }}>
        <h4 style={{
          fontSize: 17,
          margin: "0 0 10px",
          letterSpacing: "-0.01em",
          fontWeight: 600,
        }}>{title}</h4>
        <p style={{
          margin: 0,
          fontSize: 13.5,
          color: "var(--text-1)",
          lineHeight: 1.6,
        }}>{body}</p>
      </div>
    </div>
  );
}
