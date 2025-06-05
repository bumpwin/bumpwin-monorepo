"use client";

import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Info } from "lucide-react";
import type React from "react";

interface FormFieldProps {
  id: string;
  label: string;
  required?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  info?: string;
  className?: string;
}

export const FormField = ({
  id,
  label,
  required = false,
  disabled = false,
  children,
  info,
  className,
}: FormFieldProps) => {
  return (
    <div className={cn("space-y-2", disabled && "opacity-70", className)}>
      <div className="flex items-center">
        <Label htmlFor={id} className="font-normal text-white">
          {label} {required && <span className="text-red-500">*</span>}
        </Label>
        {info && (
          <div className="ml-1 cursor-help text-gray-400">
            <Info className="h-4 w-4" />
          </div>
        )}
      </div>
      {children}
    </div>
  );
};
