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
        "relative border border-gray-700 rounded-lg flex flex-col justify-center items-center h-48 bg-black/50",
        isDragging && "border-[#00c8ff] bg-[#00c8ff]/10",
        disabled && "opacity-50 cursor-not-allowed",
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
            className="object-cover rounded-md"
          />
        </div>
      ) : (
        <div className="flex flex-col items-center text-center p-4">
          <Upload className="h-6 w-6 text-gray-400 mb-2" />
          <p className="text-sm text-gray-400">Drag and drop an image or GIF</p>
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
            className="mt-2 px-4 py-1 text-[#00c8ff] border border-[#00c8ff] rounded-md text-sm hover:bg-[#00c8ff]/10 transition-colors"
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
