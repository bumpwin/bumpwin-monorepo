"use client";

import { cn } from "@workspace/shadcn/lib/utils";
import { ChevronDown } from "lucide-react";

import { useState } from "react";

interface CollapsibleSectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export const CollapsibleSection = ({
  title,
  children,
  defaultOpen = false,
}: CollapsibleSectionProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-[#2c2d3a] border-t pt-4">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between text-[#00c8ff] text-sm"
      >
        <span>{title}</span>
        <ChevronDown
          className={cn("h-5 w-5 transition-transform", isOpen && "rotate-180 transform")}
        />
      </button>
      {isOpen && <div className="mt-4 space-y-4">{children}</div>}
    </div>
  );
};
