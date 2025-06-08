"use client";

import { ImageUpload } from "@/components/ui/ImageUpload";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useExecuteTransaction } from "@/hooks/transactions/useExecuteTransaction";
import { useTransactionCreators } from "@/hooks/transactions/useTransactionCreators";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";

interface CreateCoinDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateCoinDialog({ isOpen, onClose }: CreateCoinDialogProps) {
  const [formData, setFormData] = useState({
    symbol: "",
    name: "",
    image: null as File | null,
    description: "",
  });
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const { createIncrementCounterTransaction } = useTransactionCreators();
  const { executeTransaction, isExecuting } = useExecuteTransaction();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      setFormData((prev) => ({ ...prev, image: file }));

      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setFormData((prev) => ({ ...prev, image: null }));
    setPreview(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files?.[0]) {
      const file = e.dataTransfer.files[0];
      setFormData((prev) => ({ ...prev, image: file }));

      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const tx = createIncrementCounterTransaction();
    if (!tx) {
      toast.error("Failed to create transaction");
      return;
    }

    await executeTransaction(tx);
  };

  // Preview card with real-time updates
  const MemeCard = () => (
    <div
      className="relative mx-auto w-full overflow-hidden rounded-lg border border-gray-700/50 bg-[#141420] shadow-xl transition-transform duration-200"
      style={{ aspectRatio: "3/4" }}
    >
      <div className="absolute top-2 right-2 z-10 rounded-full bg-white px-2 py-0.5 font-bold text-gray-900 text-sm shadow-md">
        #1
      </div>
      {preview ? (
        <div className="relative h-full w-full">
          <Image
            src={preview}
            alt={formData.symbol || "Coin preview"}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-purple-500">
          <div className="flex flex-col items-center justify-center">
            <div className="mr-10 h-4 w-4 rounded-full bg-black" />
            <div className="mt-5 ml-10 h-4 w-4 rounded-full bg-black" />
            <div className="mt-10 h-1 w-24 rounded-full bg-black" />
          </div>
        </div>
      )}
      <div className="absolute right-0 bottom-0 left-0 flex flex-col items-start gap-0.5 bg-black/80 px-3 py-2 text-left backdrop-blur-sm">
        <div className="w-full truncate font-bold text-white text-xl tracking-wide">
          {formData.symbol || "TICKER"}
        </div>
        <div className="w-full truncate text-gray-300 text-xs">{formData.name || "NAME"}</div>
        <div className="absolute right-3 bottom-2 flex flex-col items-end">
          <span className="font-medium text-gray-400 text-xs leading-none">% chance</span>
          <span className="font-bold text-green-400 text-xl leading-tight">13%</span>
        </div>
      </div>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-[90vw] border-purple-500/50 bg-gray-900 text-white shadow-[0_0_30px_rgba(168,85,247,0.3)] sm:max-w-5xl">
        <DialogHeader className="text-center">
          <DialogTitle className="font-extrabold text-3xl text-white">
            Create Your Meme Coin
          </DialogTitle>
          <DialogDescription className="text-gray-300">
            Be part of the next battle round by creating your own meme coin!
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-8 md:flex-row">
          {/* Left Column - Meme Card Preview */}
          <div className="flex w-full flex-col items-center md:w-1/2">
            <h3 className="mb-3 font-bold text-lg text-white">Meme Preview</h3>
            <div className="w-full max-w-[320px]">
              <MemeCard />
            </div>
            <div className="mt-4 text-center text-gray-400 text-sm">
              <p className="mt-2">Your coin will appear like this in battles</p>
            </div>
          </div>

          {/* Right Column - Form */}
          <div className="w-full md:w-1/2">
            <form onSubmit={handleSubmit}>
              <div className="mb-6 space-y-4">
                <div>
                  <label
                    htmlFor="coinSymbol"
                    className="mb-2 block font-medium text-gray-300 text-sm"
                  >
                    Coin Symbol
                  </label>
                  <input
                    type="text"
                    id="coinSymbol"
                    name="symbol"
                    value={formData.symbol}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-700 bg-black/50 px-4 py-3 text-white focus:border-transparent focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="TICKER"
                  />
                </div>
                <div>
                  <label
                    htmlFor="coinName"
                    className="mb-2 block font-medium text-gray-300 text-sm"
                  >
                    Coin Name
                  </label>
                  <input
                    type="text"
                    id="coinName"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-700 bg-black/50 px-4 py-3 text-white focus:border-transparent focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="NAME"
                  />
                </div>
                <div>
                  <label
                    htmlFor="coinDescription"
                    className="mb-2 block font-medium text-gray-300 text-sm"
                  >
                    Description
                  </label>
                  <textarea
                    id="coinDescription"
                    value={formData.description || ""}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    className="w-full resize-none rounded-lg border border-gray-700 bg-black/50 px-4 py-3 text-white focus:border-transparent focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Describe your coin..."
                    rows={3}
                  />
                </div>
                <div>
                  <label htmlFor="coinIcon" className="mb-2 block font-medium text-sm text-white">
                    Upload Icon
                  </label>
                  <div className="space-y-2">
                    <ImageUpload
                      preview={preview}
                      isDragging={isDragging}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      onChange={handleImageChange}
                    />
                    {preview && (
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="w-full rounded-lg border border-red-500 px-4 py-2 text-red-500 transition-colors hover:bg-red-500/10"
                      >
                        Remove Image
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>

        <DialogFooter className="gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="bg-gray-800 text-white hover:bg-gray-700"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isExecuting}
            onClick={handleSubmit}
            className="bg-purple-700 font-bold hover:bg-purple-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isExecuting ? "Creating..." : "Create Coin"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
