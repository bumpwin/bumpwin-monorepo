import { motion } from "framer-motion";
import React from "react";
import { Upload } from "lucide-react";

interface CreateCoinModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateCoinModal({ isOpen, onClose }: CreateCoinModalProps) {
  if (!isOpen) return null;

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
        className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-xl rounded-2xl bg-gray-900 border border-purple-500/50 shadow-[0_0_30px_rgba(168,85,247,0.3)] overflow-hidden z-50"
      >
        <div className="p-6">
          <h2 className="text-3xl font-extrabold text-center mb-6 text-white">
            Create Your Meme Coin
          </h2>
          <p className="text-gray-300 text-center mb-8">
            Be part of the next battle round by creating your own meme coin!
          </p>
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Coin Symbol
              </label>
              <input
                type="text"
                className="w-full px-4 py-3 bg-black/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="DOGE"
              />
            </div>
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Coin Name
              </label>
              <input
                type="text"
                className="w-full px-4 py-3 bg-black/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Dogecoin"
              />
            </div>
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Upload Icon
              </label>
              <div className="w-full h-32 border-2 border-dashed border-gray-700 rounded-lg flex items-center justify-center bg-black/30 cursor-pointer hover:border-purple-500 transition-colors">
                <div className="text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-500" />
                  <p className="mt-1 text-sm text-gray-400">
                    Click to upload or drag and drop
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-4">
            <button
              onClick={onClose}
              className="px-6 py-3 rounded-lg text-white bg-gray-800 hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button className="px-6 py-3 rounded-lg font-bold text-white bg-purple-700 hover:bg-purple-600 transition-all hover:scale-[1.03]">
              Create Coin
            </button>
          </div>
        </div>
      </motion.div>
    </>
  );
}
