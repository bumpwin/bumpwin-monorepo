"use client";

import { Label } from "@workspace/shadcn/components/label";
import { Info } from "lucide-react";

interface FormFieldProps {
  id: string;
  label: string;
  required?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  info?: string;
}

export const FormField = ({ id, label, required = false, disabled = false, children, info }: FormFieldProps) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center">
        <Label htmlFor={id} className="text-white font-normal">
          {label} {required && <span className="text-red-500">*</span>}
        </Label>
        {info && (
          <div className="ml-1 text-gray-400 cursor-help">
            <Info className="h-4 w-4" />
          </div>
        )}
      </div>
      {children}
    </div>
  );
};
