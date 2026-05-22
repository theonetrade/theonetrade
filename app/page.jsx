"use client";
import React, { useState, useEffect } from "react";
import Nav from "../components/Nav";
import Hero from "../components/Hero";
import Problem from "../components/Problem";
import Methodology from "../components/Methodology";
import LLMReasoning from "../components/LLMReasoning";
import CaseStudy from "../components/CaseStudy";
import Simulator from "../components/Simulator";
import Products from "../components/Products";
import TechStack from "../components/TechStack";
import Articles from "../components/Articles";
import Footer from "../components/Footer";

export default function Home() {
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const toggleTheme = () =>
    setTheme((t) => (t === "dark" ? "light" : "dark"));

  return (
    <>
      <Nav theme={theme} onToggleTheme={toggleTheme} />
      <main>
        <Hero />
        <Problem />
        <Methodology />
        <LLMReasoning />
        <CaseStudy />
        <Simulator />
        <Products />
        <TechStack />
        <Articles />
      </main>
      <Footer />
    </>
  );
}
