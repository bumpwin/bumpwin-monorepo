"use client";

import { ImageUpload } from "@/components/ImageUpload";
import { useExecuteTransaction } from "@/hooks/transactions/useExecuteTransaction";
import { useTransactionCreators } from "@/hooks/transactions/useTransactionCreators";
import { motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";

interface CreateCoinModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateCoinModal({ isOpen, onClose }: CreateCoinModalProps) {
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

  if (!isOpen) return null;

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
      className="relative w-full overflow-hidden rounded-lg shadow-xl border border-gray-700/50 bg-[#141420] transition-transform duration-200 mx-auto"
      style={{ aspectRatio: "3/4" }}
    >
      <div className="absolute top-2 right-2 z-10 bg-white text-gray-900 text-sm font-bold px-2 py-0.5 rounded-full shadow-md">
        #1
      </div>
      {preview ? (
        <div className="w-full h-full relative">
          <Image
            src={preview}
            alt={formData.symbol || "Coin preview"}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
      ) : (
        <div className="w-full h-full bg-purple-500 flex items-center justify-center">
          <div className="flex flex-col items-center justify-center">
            <div className="w-4 h-4 rounded-full bg-black mr-10" />
            <div className="w-4 h-4 rounded-full bg-black ml-10 mt-5" />
            <div className="w-24 h-1 bg-black mt-10 rounded-full" />
          </div>
        </div>
      )}
      <div className="absolute bottom-0 left-0 right-0 bg-black/80 backdrop-blur-sm px-3 py-2 flex flex-col gap-0.5 items-start text-left">
        <div className="text-xl font-bold text-white tracking-wide truncate w-full">
          {formData.symbol || "TICKER"}
        </div>
        <div className="text-xs text-gray-300 truncate w-full">
          {formData.name || "NAME"}
        </div>
        <div className="absolute right-3 bottom-2 flex flex-col items-end">
          <span className="text-xs text-gray-400 font-medium leading-none">
            % chance
          </span>
          <span className="text-xl font-bold text-green-400 leading-tight">
            13%
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-5xl rounded-2xl bg-gray-900 border border-purple-500/50 shadow-[0_0_30px_rgba(168,85,247,0.3)] overflow-hidden z-50"
      >
        <div className="p-6">
          <h2 className="text-3xl font-extrabold text-center mb-6 text-white">
            Create Your Meme Coin
          </h2>
          <p className="text-gray-300 text-center mb-8">
            Be part of the next battle round by creating your own meme coin!
          </p>

          <div className="flex flex-col md:flex-row gap-8">
            {/* Left Column - Meme Card Preview */}
            <div className="w-full md:w-1/2 flex flex-col items-center">
              <h3 className="text-lg font-bold text-white mb-3">
                Meme Preview
              </h3>
              <div className="w-full max-w-[320px]">
                <MemeCard />
              </div>
              <div className="mt-4 text-center text-gray-400 text-sm">
                <p className="mt-2">
                  Your coin will appear like this in battles
                </p>
              </div>
            </div>

            {/* Right Column - Form */}
            <div className="w-full md:w-1/2">
              <form onSubmit={handleSubmit}>
                <div className="space-y-4 mb-6">
                  <div>
                    <label
                      htmlFor="coinSymbol"
                      className="block text-gray-300 text-sm font-medium mb-2"
                    >
                      Coin Symbol
                    </label>
                    <input
                      type="text"
                      id="coinSymbol"
                      name="symbol"
                      value={formData.symbol}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-black/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="TICKER"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="coinName"
                      className="block text-gray-300 text-sm font-medium mb-2"
                    >
                      Coin Name
                    </label>
                    <input
                      type="text"
                      id="coinName"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-black/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="NAME"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="coinDescription"
                      className="block text-gray-300 text-sm font-medium mb-2"
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
                      className="w-full px-4 py-3 bg-black/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                      placeholder="Describe your coin..."
                      rows={3}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="coinIcon"
                      className="block text-white text-sm font-medium mb-2"
                    >
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
                          className="w-full px-4 py-2 text-red-500 border border-red-500 rounded-lg hover:bg-red-500/10 transition-colors"
                        >
                          Remove Image
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-4">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-6 py-3 rounded-lg text-white bg-gray-800 hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isExecuting}
                    className="px-6 py-3 rounded-lg font-bold text-white bg-purple-700 hover:bg-purple-600 transition-all hover:scale-[1.03] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isExecuting ? "Creating..." : "Create Coin"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
}
