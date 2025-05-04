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
						<div className="flex items-center justify-center w-full text-sm font-semibold">
							Login
						</div>
					}
					className="!w-40 !h-12 !px-6 !rounded-xl !bg-[#5D20D3] !text-white !shadow-lg hover:!bg-[#4D1BB0] !transition-all !duration-200 !border-none [&>div]:!text-white"
				/>
			) : (
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<div className="flex items-center justify-between gap-2 px-4 py-2 border rounded-xl h-12 bg-[#5D20D3] text-white hover:bg-[#4D1BB0] cursor-pointer transition-all duration-200 shadow-lg min-w-[160px] w-auto">
							<div className="flex items-center gap-2 truncate">
								<span className="font-semibold text-sm">{balance} SUI</span>
								<span className="text-white text-xs border-l border-white/30 pl-2 truncate">
									{formatAddress(account.address)}
								</span>
							</div>
							<svg
								className="w-4 h-4 text-white flex-shrink-0"
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
							className="focus:bg-[#5D20D3]/10 hover:bg-[#5D20D3]/10 cursor-pointer"
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
