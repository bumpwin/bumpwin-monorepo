"use client";

import { SuiWalletConnectButton } from "@/components/SuiWalletConnectButton";
import { CollapsibleSection } from "@/components/ui/CollapsibleSection";
import { FormField } from "@/components/ui/FormField";
import { ImageUpload } from "@/components/ui/ImageUpload";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { mockUploadImageToWalrus } from "@/mock/mockUploadToWalrus";
import { useCurrentAccount, useSignAndExecuteTransaction, useSuiClient } from "@mysten/dapp-kit";
import { logger } from "@workspace/logger";
import {
  createBumpFamCoin,
  publishBumpFamCoinPackage,
  signTransactionAndExecute,
} from "@workspace/sui/src/movecall";
import { getSuiScanTxUrl } from "@workspace/sui/src/utils";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

// Define phases
type Phase = "CONNECT_WALLET" | "PUBLISH_PACKAGE" | "CREATE_COIN" | "COMPLETED";

export default function CreateCoinPage() {
  const router = useRouter();
  const account = useCurrentAccount();
  const suiClient = useSuiClient();
  const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();
  const [isProcessing, setIsProcessing] = useState(false);
  const [phase, setPhase] = useState<Phase>(account ? "PUBLISH_PACKAGE" : "CONNECT_WALLET");
  const [packageData, setPackageData] = useState<{
    packageId: string;
    coinMetadataID: string;
    treasuryCapID: string;
  } | null>(null);
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

  // Update phase when wallet connection status changes
  if (!account && phase !== "CONNECT_WALLET") {
    setPhase("CONNECT_WALLET");
  } else if (account && phase === "CONNECT_WALLET") {
    setPhase("PUBLISH_PACKAGE");
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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

  // Publish package to blockchain
  const handlePublishPackage = async () => {
    if (!account || !suiClient) {
      toast.error("Please connect your wallet");
      return;
    }

    try {
      setIsProcessing(true);
      toast.info("Preparing package deployment...");

      const result = await publishBumpFamCoinPackage(
        suiClient,
        account.address,
        async (transactionBlock: Uint8Array) => {
          return await signTransactionAndExecute(transactionBlock, signAndExecuteTransaction);
        },
      );

      setPackageData({
        packageId: result.packageId,
        coinMetadataID: result.coinMetadataID,
        treasuryCapID: result.treasuryCapID,
      });

      toast.success(
        <div>
          Package deployed successfully!
          <div className="mt-2">
            <a
              href={getSuiScanTxUrl(result.digest)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              View transaction on Suiscan
            </a>
          </div>
        </div>,
        { duration: 3000 },
      );
      setPhase("CREATE_COIN");
    } catch (error) {
      logger.error("Failed to deploy package:", error);
      toast.error("Failed to deploy package");
    } finally {
      setIsProcessing(false);
    }
  };

  // Create coin
  const handleCreateCoin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!account || !suiClient || !packageData) {
      toast.error("Missing required information");
      return;
    }

    try {
      setIsProcessing(true);
      toast.info("Preparing coin creation...");

      // Prepare icon URL
      let iconUrl = "";
      if (formData.image) {
        toast.info("Uploading image...");
        iconUrl = await mockUploadImageToWalrus(formData.image);
      }

      const result = await createBumpFamCoin(
        suiClient,
        account.address,
        packageData.packageId,
        {
          treasuryCapID: packageData.treasuryCapID,
          coinMetadataID: packageData.coinMetadataID,
          name: formData.name,
          symbol: formData.symbol,
          description: formData.description,
          iconUrl: iconUrl || undefined,
        },
        async (transactionBlock: Uint8Array) => {
          return await signTransactionAndExecute(transactionBlock, signAndExecuteTransaction);
        },
      );

      toast.success(
        <div>
          Coin created successfully!
          <div className="mt-2">
            <a
              href={getSuiScanTxUrl(result.digest)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              View transaction on Suiscan
            </a>
          </div>
        </div>,
        { duration: 3000 },
      );
      setPhase("COMPLETED");

      // Redirect after success (with a slight delay)
      setTimeout(() => {
        router.push("/");
      }, 2000);
    } catch (error) {
      logger.error("Failed to create coin:", error);
      toast.error("Failed to create coin");
    } finally {
      setIsProcessing(false);
    }
  };

  // Determine if fields should be locked (read-only) after package is published
  const areFieldsLocked = phase === "CREATE_COIN" || phase === "COMPLETED";

  // Display button based on current phase
  const renderActionButton = () => {
    switch (phase) {
      case "CONNECT_WALLET":
        return <SuiWalletConnectButton />;
      case "PUBLISH_PACKAGE":
        return (
          <Button
            onClick={handlePublishPackage}
            className="h-12 w-full rounded-md bg-[#00c8ff] font-medium text-base text-white hover:bg-[#00c8ff]/90"
            disabled={isProcessing}
          >
            {isProcessing ? "Deploying package..." : "Deploy Package"}
          </Button>
        );
      case "CREATE_COIN":
        return (
          <Button
            type="submit"
            className="h-12 w-full rounded-md bg-[#00c8ff] font-medium text-base text-white hover:bg-[#00c8ff]/90"
            disabled={isProcessing}
          >
            {isProcessing ? "Creating coin..." : "Create Coin"}
          </Button>
        );
      case "COMPLETED":
        return (
          <Button
            className="h-12 w-full rounded-md bg-green-500 font-medium text-base text-white hover:bg-green-600"
            disabled={true}
          >
            Creation successful! Redirecting...
          </Button>
        );
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-var(--header-height))] flex-col">
      <div className="flex flex-1">
        <main className="flex flex-1 justify-center overflow-y-auto px-6 py-12">
          <div className="w-full max-w-2xl">
            <h1 className="mb-8 text-center font-bold text-3xl text-white">Create Coin</h1>

            <Card className="w-full overflow-hidden rounded-3xl border-[#2c2d3a] bg-[#141d38] shadow-xl">
              <CardContent className="p-8">
                <form onSubmit={handleCreateCoin} className="space-y-8">
                  <div className="flex flex-col gap-8 md:flex-row">
                    <div className="space-y-6 md:w-2/3">
                      <FormField id="name" label="Name" required disabled={areFieldsLocked}>
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="Sui"
                          className="h-12 rounded-md border-[#2c2d3a] bg-[#10172d] text-white placeholder-gray-400"
                          required
                          disabled={areFieldsLocked}
                        />
                        <p className="mt-1 text-gray-400 text-xs">Enter token name</p>
                      </FormField>

                      <FormField id="symbol" label="Symbol" required disabled={areFieldsLocked}>
                        <Input
                          id="symbol"
                          name="symbol"
                          value={formData.symbol}
                          onChange={handleChange}
                          placeholder="SUI"
                          className="h-12 rounded-md border-[#2c2d3a] bg-[#10172d] text-white placeholder-gray-400"
                          required
                          disabled={areFieldsLocked}
                        />
                        <p className="mt-1 text-gray-400 text-xs">Enter ticker</p>
                      </FormField>
                    </div>

                    <div className="md:w-1/3">
                      <FormField id="image" label="Icon" disabled={areFieldsLocked}>
                        <ImageUpload
                          preview={preview}
                          isDragging={isDragging}
                          onDragOver={handleDragOver}
                          onDragLeave={handleDragLeave}
                          onDrop={handleDrop}
                          onChange={handleImageChange}
                          disabled={areFieldsLocked}
                        />
                      </FormField>
                    </div>
                  </div>

                  <FormField
                    id="description"
                    label="Description"
                    required
                    disabled={areFieldsLocked}
                  >
                    <Textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Enter a description for your coin"
                      className="min-h-[120px] rounded-md border-[#2c2d3a] bg-[#10172d] text-white placeholder-gray-400"
                      required
                      disabled={areFieldsLocked}
                    />
                    <p className="mt-1 text-gray-400 text-xs">Enter description</p>
                  </FormField>

                  <CollapsibleSection title="Socials & more options" defaultOpen={false}>
                    <div className="mt-4 space-y-6">
                      <FormField id="telegramLink" label="Telegram link" disabled={areFieldsLocked}>
                        <Input
                          id="telegramLink"
                          name="telegramLink"
                          value={formData.telegramLink}
                          onChange={handleChange}
                          placeholder="https://t.me/yourgroup"
                          className="h-12 rounded-md border-[#2c2d3a] bg-[#10172d] text-white placeholder-gray-400"
                          disabled={areFieldsLocked}
                        />
                      </FormField>

                      <FormField id="websiteLink" label="Website link" disabled={areFieldsLocked}>
                        <Input
                          id="websiteLink"
                          name="websiteLink"
                          value={formData.websiteLink}
                          onChange={handleChange}
                          placeholder="https://yourwebsite.com"
                          className="h-12 rounded-md border-[#2c2d3a] bg-[#10172d] text-white placeholder-gray-400"
                          disabled={areFieldsLocked}
                        />
                      </FormField>

                      <FormField
                        id="twitterLink"
                        label="Twitter or X link"
                        disabled={areFieldsLocked}
                      >
                        <Input
                          id="twitterLink"
                          name="twitterLink"
                          value={formData.twitterLink}
                          onChange={handleChange}
                          placeholder="https://twitter.com/youraccount"
                          className="h-12 rounded-md border-[#2c2d3a] bg-[#10172d] text-white placeholder-gray-400"
                          disabled={areFieldsLocked}
                        />
                      </FormField>
                    </div>
                  </CollapsibleSection>

                  <div className="pt-6">
                    <p className="mb-6 w-full text-sm text-yellow-500">
                      Note: token data can&apos;t be changed after creation
                    </p>

                    <div className="flex flex-col space-y-4">
                      {renderActionButton()}

                      {phase === "CONNECT_WALLET" && (
                        <div className="text-center">
                          <p className="mb-2 text-gray-400 text-sm">Wallet connection required</p>
                        </div>
                      )}
                      {phase === "PUBLISH_PACKAGE" && (
                        <div className="text-center">
                          <p className="mb-2 text-gray-400 text-sm">
                            Package must be deployed first
                          </p>
                        </div>
                      )}
                      {phase === "CREATE_COIN" && (
                        <div className="text-center">
                          <p className="mb-2 text-blue-400 text-sm">
                            Package deployed successfully! Fill in details and create your coin.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
