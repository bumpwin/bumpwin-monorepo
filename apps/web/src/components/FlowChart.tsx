"use client";

import type { ReactNode } from "react";

interface FlowChartNodeProps {
  label: string;
  type?: "regular" | "circle" | "highlight" | "success";
  className?: string;
  subtitle?: string;
}

const FlowChartNode = ({
  label,
  subtitle,
  type = "regular",
  className = "",
}: FlowChartNodeProps) => {
  const baseClasses =
    "flex flex-col items-center justify-center text-center p-4 font-medium border shadow-lg";

  const typeClasses = {
    regular: "bg-gray-800/70 border-gray-700 rounded-lg",
    circle:
      "bg-purple-900/80 border-purple-500/60 rounded-full aspect-square min-w-[140px]",
    highlight:
      "bg-gradient-to-br from-pink-900/70 to-purple-900/70 border-pink-500/60 rounded-lg",
    success:
      "bg-gradient-to-br from-green-900/70 to-teal-900/70 border-green-500/60 rounded-lg",
  };

  return (
    <div className={`${baseClasses} ${typeClasses[type]} ${className}`}>
      <div className="font-bold text-lg">{label}</div>
      {subtitle && <div className="text-xs mt-1 text-gray-300">{subtitle}</div>}
    </div>
  );
};

interface FlowChartArrowProps {
  label?: string;
  highlight?: boolean;
  className?: string;
  direction?: "right" | "left" | "down";
}

const FlowChartArrow = ({
  label,
  highlight = false,
  className = "",
  direction = "right",
}: FlowChartArrowProps) => {
  // Determine rotation based on direction
  const rotationClass = {
    right: "",
    left: "rotate-180",
    down: "rotate-90",
  };

  const arrowWidth = direction === "down" ? "2px" : "100%";
  const arrowHeight = direction === "down" ? "40px" : "2px";
  const arrowColor = highlight ? "#ec4899" : "#6b7280";

  // Determine arrow head positioning
  const arrowHeadRight =
    direction === "right" ? "-4px" : direction === "down" ? "-6px" : "auto";
  const arrowHeadLeft = direction === "left" ? "-4px" : "auto";
  const arrowHeadBottom = direction === "down" ? "-4px" : "auto";
  const arrowHeadTop = direction !== "down" ? "-3px" : "auto";

  // Determine arrow head transform
  const arrowHeadTransform =
    direction === "right"
      ? "rotate(90deg)"
      : direction === "left"
        ? "rotate(-90deg)"
        : "";

  return (
    <div
      className={`flex flex-col items-center justify-center min-w-[80px] ${className} ${rotationClass[direction]}`}
    >
      <div className="relative w-full flex justify-center">
        <div
          className="bg-pink-500"
          style={{
            width: arrowWidth,
            height: arrowHeight,
            backgroundColor: arrowColor,
          }}
        />
        <div
          className="border-solid"
          style={{
            borderWidth: "0 6px 8px 6px",
            borderColor: `transparent transparent ${arrowColor} transparent`,
            transform: arrowHeadTransform,
            position: "absolute" as const,
            right: arrowHeadRight,
            left: arrowHeadLeft,
            bottom: arrowHeadBottom,
            top: arrowHeadTop,
          }}
        />
      </div>
      {label && (
        <div
          className={`text-xs font-medium mt-1 ${highlight ? "text-pink-400" : "text-gray-400"}`}
        >
          {label}
        </div>
      )}
    </div>
  );
};

interface FlowChartProps {
  className?: string;
  children?: ReactNode;
  title?: string;
  subtitle?: string;
}

const FlowChart = ({
  className = "",
  children,
  title,
  subtitle,
}: FlowChartProps) => {
  return (
    <div
      className={`relative p-8 rounded-xl overflow-hidden bg-gray-900/80 ${className}`}
    >
      {title && (
        <div className="text-center mb-8">
          <h3 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
            {title}
          </h3>
          {subtitle && <p className="text-gray-300 mt-2">{subtitle}</p>}
        </div>
      )}

      <div className="flex flex-wrap items-center justify-center gap-4 z-10 relative">
        {children}
      </div>
    </div>
  );
};

export { FlowChart, FlowChartNode, FlowChartArrow };
