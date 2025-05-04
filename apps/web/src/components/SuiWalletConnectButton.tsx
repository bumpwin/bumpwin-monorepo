"use client";

import {
	ConnectButton,
	useCurrentAccount,
	useDisconnectWallet,
	useSuiClient,
} from "@mysten/dapp-kit";
import { formatAddress } from "@mysten/sui/utils";
import { logger } from "@workspace/logger";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@workspace/shadcn/components/dropdown-menu";
import { getSuiBalance } from "@workspace/sui";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export function SuiWalletConnectButton() {
	const [balance, setBalance] = useState<string | null>(null);
	const account = useCurrentAccount();
	const suiClient = useSuiClient();
	const { mutate: disconnect } = useDisconnectWallet();

	// Fetch SUI balance when wallet is connected
	useEffect(() => {
		const fetchBalance = async () => {
			if (account) {
				const balance = await getSuiBalance(suiClient, account.address);
				setBalance(balance);
			}
		};
		fetchBalance();
	}, [account, suiClient]);

	const copyAddressToClipboard = () => {
		if (account) {
			navigator.clipboard
				.writeText(account.address)
				.then(() => {
					toast.success("Address copied to clipboard");
				})
				.catch((err) => {
					logger.error("[Wallet] Failed to copy address", { error: err });
					toast.error("Failed to copy address");
				});
		}
	};

	const handleDisconnect = () => {
		try {
			disconnect();
		} catch (error) {
			logger.error("[Wallet] Failed to disconnect wallet", { error });
		}
	};

	return (
		<div className="w-full">
			{!account ? (
				<ConnectButton
					connectText={
						<div className="flex items-center justify-center w-full text-lg font-semibold">
							Connect Wallet
						</div>
					}
					className="!w-full !h-12 !px-6 !rounded-full !bg-blue-500 !text-white !shadow-lg hover:!bg-blue-600 !transition-all !duration-200 !border-none [&>div]:!text-white"
				/>
			) : (
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<div className="flex items-center justify-between gap-3 px-5 py-3 border rounded-full bg-gradient-to-r from-blue-500 to-blue-400 text-white hover:from-blue-600 hover:to-blue-500 cursor-pointer transition-all duration-200 shadow-lg">
							<div className="flex items-center gap-2">
								<span className="font-semibold text-lg">{balance} SUI</span>
								<span className="text-blue-50 text-sm border-l border-blue-300 pl-2">
									{formatAddress(account.address)}
								</span>
							</div>
							<svg
								className="w-4 h-4 text-blue-100"
								viewBox="0 0 24 24"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
								aria-hidden="true"
							>
								<title>Dropdown Menu Arrow</title>
								<path
									d="M6 9L12 15L18 9"
									stroke="currentColor"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
								/>
							</svg>
						</div>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end" className="w-[200px] mt-2">
						<DropdownMenuItem
							onClick={copyAddressToClipboard}
							className="focus:bg-blue-900/10 hover:bg-blue-900/10 cursor-pointer"
						>
							<div className="flex items-center gap-2">
								<svg
									className="w-4 h-4"
									viewBox="0 0 24 24"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
									aria-hidden="true"
								>
									<title>Copy Address Icon</title>
									<rect
										x="9"
										y="9"
										width="13"
										height="13"
										rx="2"
										stroke="currentColor"
										strokeWidth="2"
										strokeLinecap="round"
										strokeLinejoin="round"
									/>
									<path
										d="M5 15H4C2.89543 15 2 14.1046 2 13V4C2 2.89543 2.89543 2 4 2H13C14.1046 2 15 2.89543 15 4V5"
										stroke="currentColor"
										strokeWidth="2"
										strokeLinecap="round"
										strokeLinejoin="round"
									/>
								</svg>
								Copy Address
							</div>
						</DropdownMenuItem>
						<DropdownMenuItem
							onClick={handleDisconnect}
							className="text-red-600 focus:text-red-600 focus:bg-red-900/10 hover:bg-red-900/10 cursor-pointer"
						>
							<div className="flex items-center gap-2">
								<svg
									className="w-4 h-4"
									viewBox="0 0 24 24"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
									aria-hidden="true"
								>
									<title>Disconnect Icon</title>
									<path
										d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9"
										stroke="currentColor"
										strokeWidth="2"
										strokeLinecap="round"
										strokeLinejoin="round"
									/>
									<path
										d="M16 17L21 12L16 7"
										stroke="currentColor"
										strokeWidth="2"
										strokeLinecap="round"
										strokeLinejoin="round"
									/>
									<path
										d="M21 12H9"
										stroke="currentColor"
										strokeWidth="2"
										strokeLinecap="round"
										strokeLinejoin="round"
									/>
								</svg>
								Disconnect
							</div>
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			)}
		</div>
	);
}
