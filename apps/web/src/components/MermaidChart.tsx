"use client";

import { useEffect, useRef } from "react";
import mermaid from "mermaid";

interface MermaidChartProps {
  chart: string;
  className?: string;
}

const MermaidChart = ({ chart, className = "" }: MermaidChartProps) => {
  const mermaidRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: true,
      theme: "dark",
      securityLevel: "loose",
      fontFamily: "inherit",
      themeVariables: {
        primaryColor: "#6d28d9", // Purple
        primaryTextColor: "#ffffff",
        primaryBorderColor: "#8b5cf6",
        secondaryColor: "#f472b6", // Pink
        lineColor: "#9ca3af",
        tertiaryColor: "#1f2937",
        fontSize: "16px",
      },
    });

    if (mermaidRef.current) {
      mermaidRef.current.innerHTML = chart;
      mermaid.contentLoaded();
    }
  }, [chart]);

  return (
    <div className={`mermaid ${className}`} ref={mermaidRef}>
      {chart}
    </div>
  );
};

export default MermaidChart; 