"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";

interface CoinImageProps {
  src: string;
  alt: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeClasses = {
  sm: "h-12 w-12",
  md: "h-16 w-16",
  lg: "h-[240px] w-full",
} as const;

export function CoinImage({ src, alt, size = "md", className }: CoinImageProps) {
  return (
    <div
      className={cn(
        "relative flex-shrink-0 overflow-hidden",
        sizeClasses[size],
        size === "lg" ? "" : "rounded-lg",
        className,
      )}
    >
      <Image
        src={src}
        alt={alt}
        fill
        className={cn("object-cover", size === "lg" ? "object-contain" : "")}
      />
    </div>
  );
}
