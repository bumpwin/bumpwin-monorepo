"use client";

import { cn } from "@workspace/shadcn/lib/utils";
import { Upload } from "lucide-react";
import Image from "next/image";

interface ImageUploadProps {
  preview: string | null;
  isDragging: boolean;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: () => void;
  onDrop: (e: React.DragEvent) => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
}

export function ImageUpload({
  preview,
  isDragging,
  onDragOver,
  onDragLeave,
  onDrop,
  onChange,
  disabled = false,
}: ImageUploadProps) {
  return (
    <div
      className={cn(
        "relative flex h-48 flex-col items-center justify-center rounded-lg border border-gray-700 bg-black/50",
        isDragging && "border-[#00c8ff] bg-[#00c8ff]/10",
        disabled && "cursor-not-allowed opacity-50",
      )}
      onDragOver={!disabled ? onDragOver : undefined}
      onDragLeave={!disabled ? onDragLeave : undefined}
      onDrop={!disabled ? onDrop : undefined}
    >
      {preview ? (
        <div className="flex flex-col items-center">
          <Image
            src={preview}
            alt="Preview"
            width={120}
            height={120}
            className="rounded-md object-cover"
          />
        </div>
      ) : (
        <div className="flex flex-col items-center p-4 text-center">
          <Upload className="mb-2 h-6 w-6 text-gray-400" />
          <p className="text-gray-400 text-sm">Drag and drop an image or GIF</p>
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={onChange}
            className="hidden"
            id="file-upload"
            disabled={disabled}
          />
          <button
            className="mt-2 rounded-md border border-[#00c8ff] px-4 py-1 text-[#00c8ff] text-sm transition-colors hover:bg-[#00c8ff]/10"
            onClick={() => document.getElementById("file-upload")?.click()}
            disabled={disabled}
            type="button"
          >
            Select a file
          </button>
        </div>
      )}
    </div>
  );
}
