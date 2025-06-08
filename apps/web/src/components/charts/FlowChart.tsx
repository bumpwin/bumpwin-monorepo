"use client";

import type { ReactNode } from "react";
import { match } from "ts-pattern";

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
    circle: "bg-purple-900/80 border-purple-500/60 rounded-full aspect-square min-w-[140px]",
    highlight: "bg-gradient-to-br from-pink-900/70 to-purple-900/70 border-pink-500/60 rounded-lg",
    success: "bg-gradient-to-br from-green-900/70 to-teal-900/70 border-green-500/60 rounded-lg",
  };

  return (
    <div className={`${baseClasses} ${typeClasses[type]} ${className}`}>
      <div className="font-bold text-lg">{label}</div>
      {subtitle && <div className="mt-1 text-gray-300 text-xs">{subtitle}</div>}
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

  const arrowWidth = match(direction)
    .with("down", () => "2px")
    .otherwise(() => "100%");
  const arrowHeight = match(direction)
    .with("down", () => "40px")
    .otherwise(() => "2px");
  const arrowColor = match(highlight)
    .with(true, () => "#ec4899")
    .with(false, () => "#6b7280")
    .exhaustive();

  // Determine arrow head positioning
  const arrowHeadRight = match(direction)
    .with("right", () => "-4px")
    .with("down", () => "-6px")
    .otherwise(() => "auto");
  const arrowHeadLeft = match(direction)
    .with("left", () => "-4px")
    .otherwise(() => "auto");
  const arrowHeadBottom = match(direction)
    .with("down", () => "-4px")
    .otherwise(() => "auto");
  const arrowHeadTop = match(direction)
    .with("down", () => "auto")
    .otherwise(() => "-3px");

  // Determine arrow head transform
  const arrowHeadTransform = match(direction)
    .with("right", () => "rotate(90deg)")
    .with("left", () => "rotate(-90deg)")
    .otherwise(() => "");

  return (
    <div
      className={`flex min-w-[80px] flex-col items-center justify-center ${className} ${rotationClass[direction]}`}
    >
      <div className="relative flex w-full justify-center">
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
          className={`mt-1 font-medium text-xs ${match(highlight)
            .with(true, () => "text-pink-400")
            .with(false, () => "text-gray-400")
            .exhaustive()}`}
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

const FlowChart = ({ className = "", children, title, subtitle }: FlowChartProps) => {
  return (
    <div className={`relative overflow-hidden rounded-xl bg-gray-900/80 p-8 ${className}`}>
      {title && (
        <div className="mb-8 text-center">
          <h3 className="bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text font-bold text-2xl text-transparent md:text-3xl">
            {title}
          </h3>
          {subtitle && <p className="mt-2 text-gray-300">{subtitle}</p>}
        </div>
      )}

      <div className="relative z-10 flex flex-wrap items-center justify-center gap-4">
        {children}
      </div>
    </div>
  );
};

export { FlowChart, FlowChartNode, FlowChartArrow };
