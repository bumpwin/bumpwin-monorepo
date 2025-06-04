import { Card } from "@workspace/shadcn/components/card";
import { cn } from "@workspace/shadcn/lib/utils";
import type { ComponentProps } from "react";

interface DarkCardProps extends ComponentProps<typeof Card> {
  variant?: "default" | "champion";
}

export const DarkCard = ({ className, variant = "default", ...props }: DarkCardProps) => {
  return (
    <Card
      className={cn(
        "border border-[#23262F] bg-black/20 backdrop-blur-sm",
        variant === "champion" && "hover:border-yellow-400/20",
        className,
      )}
      {...props}
    />
  );
};
