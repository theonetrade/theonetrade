"use client";
import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";

export function Logo({ size = 28 }) {
  return (
    <div style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 10,
    }}>
      <svg width={size} height={size} viewBox="0 0 64 64" aria-label="TheOneTrade" style={{ display: "block", flexShrink: 0 }}>
        <rect x="0" y="0" width="64" height="64" rx="10" fill="var(--bg-1)" stroke="var(--border)" strokeWidth="1" />

        {/* 5 bars w=8, gap=3, padX=6. Staircase heights with strict 45° cuts (dx=dy=8).
            Bar1/5: y=12 (tallest) → Bar2/4: y=20 → Bar3: y=38 (shortest). */}

        {/* Bar 1 — tallest, light */}
        <polygon points="6,56 6,8 14,22 14,56"
          fill="color-mix(in srgb, var(--text-1) 32%, transparent)" />
        <polygon points="6,56 14,56 14,50" fill="var(--teal)" />

        {/* Bar 2 — medium, gray */}
        <polygon points="17,56 17,22 25,34 25,56"
          fill="color-mix(in srgb, var(--text-1) 48%, transparent)" />
        <polygon points="17,56 25,56 25,40 17,48" fill="var(--teal)" />

        {/* Bar 3 — teal trapezoid stem */}
        <polygon points="28,56 36,56 36,35.5 28,39.5" fill="var(--teal)" />

        {/* Bar 4 — teal */}
        <polygon points="39,56 39,34 47,22 47,56" fill="var(--teal)" />

        {/* Bar 5 — dark teal */}
        <polygon points="50,56 50,22 58,8 58,56" fill="var(--teal-deep)" />

        {/* V triangle */}
        <polygon points="25,22.5 39,22.5 32,30.5" fill="var(--teal)" />
      </svg>
      <span style={{
        fontWeight: 600,
        letterSpacing: "-0.01em",
        fontSize: 15,
      }}>
        TheOne<span style={{ color: "var(--teal)" }}>Trade</span>
      </span>
    </div>
  );
}

export default function Nav({ theme, onToggleTheme }) {
  const [scrolled, setScrolled] = React.useState(false);
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { href: "#problem", label: "The problem" },
    { href: "#method", label: "Methodology" },
    { href: "#case", label: "Case study" },
    { href: "#services", label: "Services" },
    { href: "#stack", label: "Stack" },
    { href: "#articles", label: "Research" },
    { href: "https://backtest-kit.github.io/", label: "Documentation", external: true },
  ];

  return (
    <header style={{
      position: "sticky",
      top: 0,
      zIndex: 50,
      background: scrolled ? "color-mix(in srgb, var(--bg-0) 86%, transparent)" : "transparent",
      backdropFilter: scrolled ? "blur(14px) saturate(140%)" : "none",
      WebkitBackdropFilter: scrolled ? "blur(14px) saturate(140%)" : "none",
      borderBottom: scrolled ? "1px solid var(--border)" : "1px solid transparent",
      transition: "all 220ms ease",
    }}>
      <div className="wrap" style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        height: 64,
      }}>
        <Logo />

        <nav style={{
          display: "flex",
          gap: 22,
          alignItems: "center",
        }} className="nav-desktop">
          {links.map(l => (
            <a key={l.href} href={l.href}
              target={l.external ? "_blank" : undefined}
              rel={l.external ? "noopener" : undefined}
              style={{
              fontSize: 13,
              color: "var(--text-1)",
              transition: "color 120ms",
            }} onMouseEnter={(e) => e.currentTarget.style.color = "var(--text-0)"}
               onMouseLeave={(e) => e.currentTarget.style.color = "var(--text-1)"}>
              {l.label}
            </a>
          ))}
        </nav>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button
            onClick={onToggleTheme}
            aria-label="Toggle theme"
            style={{
              background: "transparent",
              border: "1px solid var(--border)",
              color: "var(--text-1)",
              width: 34, height: 34,
              borderRadius: 4,
              display: "grid",
              placeItems: "center",
              fontFamily: "var(--font-mono)",
              fontSize: 13,
            }}>
            {theme === "dark" ? "☀" : "☾"}
          </button>
          <a href="https://github.com/tripolskypetr/backtest-kit" target="_blank" rel="noopener" className="btn btn-primary nav-cta" style={{ padding: "8px 14px" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.21 11.4.6.11.82-.26.82-.58v-2.03c-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.08-.73.08-.73 1.2.09 1.84 1.24 1.84 1.24 1.07 1.84 2.81 1.31 3.5 1 .11-.78.42-1.31.76-1.61-2.66-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.13-.31-.54-1.53.12-3.18 0 0 1-.32 3.3 1.23A11.5 11.5 0 0 1 12 5.8c1.02.01 2.04.14 3 .4 2.3-1.55 3.3-1.23 3.3-1.23.66 1.65.25 2.87.12 3.18.77.84 1.23 1.91 1.23 3.22 0 4.61-2.81 5.62-5.49 5.92.43.37.81 1.1.81 2.22v3.29c0 .32.22.7.83.58A12.01 12.01 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>
            GitHub
          </a>
          <button
            className="nav-burger"
            onClick={() => setOpen(!open)}
            aria-label="Menu"
            style={{
              background: "transparent",
              border: "1px solid var(--border)",
              color: "var(--text-1)",
              width: 34, height: 34,
              borderRadius: 4,
              display: "none",
            }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 4, alignItems: "center", justifyContent: "center", height: "100%" }}>
              <span style={{ width: 14, height: 1.5, background: "currentColor", display: "block" }}></span>
              <span style={{ width: 14, height: 1.5, background: "currentColor", display: "block" }}></span>
              <span style={{ width: 14, height: 1.5, background: "currentColor", display: "block" }}></span>
            </div>
          </button>
        </div>
      </div>

      {open && (
        <div className="nav-mobile-menu" style={{
          borderTop: "1px solid var(--border)",
          background: "var(--bg-0)",
          padding: "16px var(--gutter) 24px",
        }}>
          {links.map(l => (
            <a key={l.href} href={l.href}
              target={l.external ? "_blank" : undefined}
              rel={l.external ? "noopener" : undefined}
              onClick={() => setOpen(false)} style={{
              display: "block",
              padding: "12px 0",
              fontSize: 15,
              color: "var(--text-0)",
              borderBottom: "1px solid var(--border)",
            }}>
              {l.label}
            </a>
          ))}
        </div>
      )}

      <style>{`
        @media (max-width: 1024px) {
          .nav-desktop { display: none !important; }
          .nav-burger { display: grid !important; }
          .nav-cta span, .nav-cta { display: none; }
        }
        @media (min-width: 1025px) {
          .nav-mobile-menu { display: none !important; }
        }
      `}</style>
    </header>
  );
}
