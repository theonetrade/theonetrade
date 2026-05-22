"use client";
import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { Logo } from "./Nav";
export default function Footer() {
  return (
    <Fragment>
      {/* Big CTA section */}
      <section id="contact" style={{
        background: "var(--bg-0)",
        position: "relative",
        overflow: "hidden",
      }}>
        <div aria-hidden="true" style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `
            linear-gradient(var(--border) 1px, transparent 1px),
            linear-gradient(90deg, var(--border) 1px, transparent 1px)
          `,
          backgroundSize: "64px 64px",
          opacity: 0.25,
          maskImage: "radial-gradient(ellipse at 50% 100%, #000 0%, transparent 65%)",
          WebkitMaskImage: "radial-gradient(ellipse at 50% 100%, #000 0%, transparent 65%)",
        }} />
        <div className="wrap" style={{ position: "relative", textAlign: "center" }}>
          <div className="section-eyebrow" style={{
            justifyContent: "center",
            display: "inline-flex",
          }}>
            09 / Get started
          </div>
          <h2 style={{
            fontSize: "clamp(36px, 6vw, 72px)",
            fontWeight: 600,
            letterSpacing: "-0.03em",
            lineHeight: 1.02,
            margin: "0 auto 28px",
            maxWidth: 900,
            textWrap: "balance",
          }}>
            Read the source.
            <br />
            <span style={{
              background: "linear-gradient(90deg, var(--teal), var(--amber))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}>Then talk to engineering.</span>
          </h2>
          <p style={{
            fontSize: "clamp(15px, 1.4vw, 18px)",
            color: "var(--text-1)",
            maxWidth: 600,
            margin: "0 auto 40px",
            lineHeight: 1.55,
            textWrap: "pretty",
          }}>
            <span className="mono" style={{ color: "var(--text-0)" }}>npx -y @backtest-kit/cli --init</span> scaffolds a working strategy in 30 seconds. When you're ready for a custom mandate, we're at tripolskypetr@gmail.com.
          </p>
          <div style={{
            display: "flex",
            gap: 12,
            justifyContent: "center",
            flexWrap: "wrap",
            marginBottom: 64,
          }}>
            <a href="https://github.com/tripolskypetr/backtest-kit" target="_blank" rel="noopener" className="btn btn-primary" style={{ padding: "14px 22px" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.21 11.4.6.11.82-.26.82-.58v-2.03c-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.08-.73.08-.73 1.2.09 1.84 1.24 1.84 1.24 1.07 1.84 2.81 1.31 3.5 1 .11-.78.42-1.31.76-1.61-2.66-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.13-.31-.54-1.53.12-3.18 0 0 1-.32 3.3 1.23A11.5 11.5 0 0 1 12 5.8c1.02.01 2.04.14 3 .4 2.3-1.55 3.3-1.23 3.3-1.23.66 1.65.25 2.87.12 3.18.77.84 1.23 1.91 1.23 3.22 0 4.61-2.81 5.62-5.49 5.92.43.37.81 1.1.81 2.22v3.29c0 .32.22.7.83.58A12.01 12.01 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>
              Read the source on GitHub
            </a>
            <a href="mailto:tripolskypetr@gmail.com" className="btn btn-ghost" style={{ padding: "14px 22px" }}>
              Email engineering →
            </a>
          </div>

          {/* Mini contact grid */}
          <div className="contact-grid" style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 1,
            background: "var(--border)",
            border: "1px solid var(--border)",
            borderRadius: 6,
            overflow: "hidden",
            maxWidth: 880,
            margin: "0 auto",
            textAlign: "left",
          }}>
            {[
              { l: "Engineering", v: "tripolskypetr@gmail.com", href: "mailto:tripolskypetr@gmail.com" },
              { l: "Source · OSS", v: "tripolskypetr/backtest-kit", href: "https://github.com/tripolskypetr/backtest-kit/" },
              { l: "Research", v: "tripolskypetr.medium.com", href: "https://tripolskypetr.medium.com/" },
            ].map((c) => (
              <a key={c.l} href={c.href} target={c.href.startsWith("http") ? "_blank" : undefined} rel="noopener" style={{
                background: "var(--bg-1)",
                padding: "20px 22px",
                color: "inherit",
                transition: "background 120ms",
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = "var(--bg-2)"}
              onMouseLeave={(e) => e.currentTarget.style.background = "var(--bg-1)"}>
                <div style={{
                  fontSize: 10,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "var(--text-2)",
                  fontFamily: "var(--font-mono)",
                  marginBottom: 8,
                }}>{c.l}</div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--text-0)", wordBreak: "break-all" }}>{c.v}</div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom footer */}
      <footer style={{
        borderTop: "1px solid var(--border)",
        padding: "32px 0 28px",
        background: "var(--bg-1)",
      }}>
        <div className="wrap">
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 24,
            paddingBottom: 24,
            borderBottom: "1px solid var(--border)",
          }}>
            <Logo size={28} />
            <div style={{
              display: "flex",
              gap: 24,
              flexWrap: "wrap",
              fontFamily: "var(--font-mono)",
              fontSize: 12,
              color: "var(--text-1)",
            }}>
              <a href="#method">Methodology</a>
              <a href="#case">Case study</a>
              <a href="#services">Services</a>
              <a href="#stack">Stack</a>
              <a href="#articles">Research</a>
              <a href="https://github.com/tripolskypetr/backtest-kit" target="_blank" rel="noopener">GitHub</a>
            </div>
          </div>
          <div style={{
            paddingTop: 20,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 16,
            fontSize: 11.5,
            fontFamily: "var(--font-mono)",
            color: "var(--text-2)",
          }}>
            <span>© 2026 TheOneTrade. Strategies are historically simulated. Past performance does not predict future returns.</span>
            <span>backtest-kit · MIT licensed · v6.0.0</span>
          </div>
        </div>
      </footer>

      <style>{`
        @media (max-width: 720px) {
          .contact-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </Fragment>
  );
}
