"use client";

import { useCurrentAccount } from "@mysten/dapp-kit";
import { Button } from "@workspace/shadcn/components/button";
import { Card, CardContent } from "@workspace/shadcn/components/card";
import { Input } from "@workspace/shadcn/components/input";
import { Textarea } from "@workspace/shadcn/components/textarea";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { SuiWalletConnectButton } from "../../components/SuiWalletConnectButton";

export default function CreateTokenPage() {
  const router = useRouter();
  const account = useCurrentAccount();
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    symbol: "",
    description: "",
    twitterLink: "",
    telegramLink: "",
    websiteLink: "",
    image: null as File | null,
  });
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
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
    if (!account) return;

    try {
      setIsUploading(true);
      // ここに実際のトークン作成処理を実装
      console.log("Submitting token data:", formData);
      router.push("/");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex justify-center items-start py-10 px-4 min-h-screen bg-black">
      <Card className="w-full max-w-3xl bg-[#131625] border-[#2c2d3a] shadow-xl overflow-hidden rounded-lg">
        <CardContent className="p-6">
          <h1 className="text-3xl font-bold text-white mb-8 text-center">
            Create Your Coin
          </h1>

          <div className="mt-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex gap-10">
                <div className="flex-1 space-y-6">
                  <div className="space-y-1">
                    <div className="flex items-center mb-1">
                      <label
                        htmlFor="name"
                        className="block text-white text-sm"
                      >
                        Token Name <span className="text-red-500">*</span>
                      </label>
                    </div>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter token name"
                      className="bg-[#1a1e2e] border-[#2c2d3a] text-white placeholder-gray-500 py-2.5"
                      required
                      disabled={!account}
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center mb-1">
                      <label
                        htmlFor="symbol"
                        className="block text-white text-sm"
                      >
                        Token Symbol <span className="text-red-500">*</span>
                      </label>
                    </div>
                    <Input
                      id="symbol"
                      name="symbol"
                      value={formData.symbol}
                      onChange={handleChange}
                      placeholder="Enter token symbol"
                      className="bg-[#1a1e2e] border-[#2c2d3a] text-white placeholder-gray-500 py-2.5"
                      required
                      disabled={!account}
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center mb-1">
                      <label
                        htmlFor="description"
                        className="block text-white text-sm"
                      >
                        Description <span className="text-red-500">*</span>
                      </label>
                    </div>
                    <Textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Enter description"
                      className="bg-[#1a1e2e] border-[#2c2d3a] text-white placeholder-gray-500 min-h-[100px]"
                      required
                      disabled={!account}
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center mb-1">
                      <label
                        htmlFor="twitterLink"
                        className="block text-white text-sm"
                      >
                        Twitter Link
                      </label>
                    </div>
                    <Input
                      id="twitterLink"
                      name="twitterLink"
                      value={formData.twitterLink}
                      onChange={handleChange}
                      placeholder="Enter twitter link"
                      className="bg-[#1a1e2e] border-[#2c2d3a] text-white placeholder-gray-500 py-2.5"
                      disabled={!account}
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center mb-1">
                      <label
                        htmlFor="telegramLink"
                        className="block text-white text-sm"
                      >
                        Telegram Link
                      </label>
                    </div>
                    <Input
                      id="telegramLink"
                      name="telegramLink"
                      value={formData.telegramLink}
                      onChange={handleChange}
                      placeholder="Enter telegram link"
                      className="bg-[#1a1e2e] border-[#2c2d3a] text-white placeholder-gray-500 py-2.5"
                      disabled={!account}
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center mb-1">
                      <label
                        htmlFor="websiteLink"
                        className="block text-white text-sm"
                      >
                        Website Link
                      </label>
                    </div>
                    <Input
                      id="websiteLink"
                      name="websiteLink"
                      value={formData.websiteLink}
                      onChange={handleChange}
                      placeholder="Enter website link"
                      className="bg-[#1a1e2e] border-[#2c2d3a] text-white placeholder-gray-500 py-2.5"
                      disabled={!account}
                    />
                  </div>
                </div>

                <div className="w-64 space-y-2">
                  <div className="space-y-1">
                    <div
                      className={`relative border border-[#2c2d3a] rounded-md p-2 flex justify-center items-center h-64
                        ${isDragging ? "border-blue-500 bg-blue-500/10" : ""}
                        bg-[#1a1e2e]`}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                    >
                      {preview ? (
                        <div className="flex flex-col items-center">
                          <Image
                            src={preview}
                            alt="Preview"
                            width={150}
                            height={150}
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="flex flex-col items-center">
                          <Image
                            src="/placeholder-image.png"
                            alt="Upload"
                            width={80}
                            height={80}
                            className="mb-2"
                          />
                          <p className="text-xs text-gray-400 mb-1">
                            PNG, JPEG, WEBP, GIF
                          </p>
                          <p className="text-xs text-gray-400">Max size: 5MB</p>
                          <input
                            type="file"
                            name="image"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                            id="file-upload"
                          />
                          <label
                            htmlFor="file-upload"
                            className="mt-2 px-3 py-1 bg-blue-500 text-white text-xs rounded cursor-pointer"
                          >
                            Select File
                          </label>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <p className="text-yellow-500 text-sm mb-4">
                  Note: token data can&apos;t be changed after creation
                </p>

                {account ? (
                  <Button
                    type="submit"
                    className="w-full h-12 bg-blue-500 hover:bg-blue-600 text-white rounded-md"
                    disabled={isUploading}
                  >
                    {isUploading ? "Deploying..." : "Deploy"}
                  </Button>
                ) : (
                  <div className="w-full">
                    <SuiWalletConnectButton />
                  </div>
                )}
              </div>
            </form>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
