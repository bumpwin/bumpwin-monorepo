import Image from "next/image";
import Link from "next/link";
import CommunicationPanel from "../../components/CommunicationPanel";

export default function LosersPage() {
	// プロジェクトの説明文と投資失敗トークンのサンプルデータ
	const loserCoins = [
		{
			id: "1",
			name: "SQUID TOKEN",
			symbol: "SQUID",
			description:
				"Famous for its dramatic rise and subsequent crash, leaving investors with worthless tokens.",
			initialPrice: "$0.01",
			peakPrice: "$2,861.80",
			finalPrice: "$0.00",
			logoUrl: "/squid.png",
			reason: "Exit scam (rug pull)",
		},
		{
			id: "2",
			name: "LUNA Classic",
			symbol: "LUNC",
			description:
				"Once a top-10 cryptocurrency that collapsed due to a flawed algorithmic stablecoin mechanism.",
			initialPrice: "$0.45",
			peakPrice: "$119.18",
			finalPrice: "$0.00017",
			logoUrl: "/luna.png",
			reason: "Protocol failure",
		},
		{
			id: "3",
			name: "Bitconnect",
			symbol: "BCC",
			description:
				"One of the largest Ponzi schemes in cryptocurrency history, promising unrealistic returns.",
			initialPrice: "$0.17",
			peakPrice: "$463.31",
			finalPrice: "$0.00",
			logoUrl: "/bitconnect.png",
			reason: "Ponzi scheme",
		},
	];

	return (
		<div className="relative flex">
			<div className="flex-1 h-[calc(100vh-4rem)] overflow-auto">
				<div className="flex flex-col gap-6 p-6">
					<div className="flex justify-between items-center">
						<h1 className="text-2xl font-bold text-red-500">Biggest Losers</h1>
						<Link href="/champions" className="text-blue-500 hover:underline">
							View Champions
						</Link>
					</div>

					<p className="text-gray-300 max-w-3xl">
						These tokens represent cautionary tales in the cryptocurrency world.
						Learn from these historical failures to make better investment
						decisions in the BUMP.WIN ecosystem.
					</p>

					<div className="grid gap-6">
						{loserCoins.map((coin) => (
							<div
								key={coin.id}
								className="flex bg-gray-800/50 rounded-lg overflow-hidden border border-red-900/30 hover:border-red-900/60 transition-colors"
							>
								<div className="w-24 h-24 relative bg-black flex-shrink-0">
									<Image
										src={coin.logoUrl || "/default-token.png"}
										alt={coin.name}
										fill
										className="object-contain p-2"
									/>
								</div>

								<div className="flex flex-col p-4 flex-1">
									<div className="flex items-center gap-2 mb-1">
										<h2 className="font-bold text-xl">{coin.name}</h2>
										<span className="px-2 py-0.5 bg-gray-700 rounded text-xs font-mono">
											{coin.symbol}
										</span>
										<span className="px-2 py-0.5 bg-red-900/40 text-red-300 rounded text-xs ml-auto">
											{coin.reason}
										</span>
									</div>

									<p className="text-gray-300 mb-3">{coin.description}</p>

									<div className="flex text-sm space-x-6 text-gray-400 mt-auto">
										<div>
											<span className="text-gray-500">Initial: </span>
											{coin.initialPrice}
										</div>
										<div>
											<span className="text-gray-500">Peak: </span>
											<span className="text-green-400">{coin.peakPrice}</span>
										</div>
										<div>
											<span className="text-gray-500">Final: </span>
											<span className="text-red-400">{coin.finalPrice}</span>
										</div>
									</div>
								</div>
							</div>
						))}
					</div>

					<div className="mt-8 p-6 bg-gray-800/30 rounded-lg border border-gray-700">
						<h2 className="text-xl font-semibold mb-3">
							Why BUMP.WIN is different
						</h2>
						<ul className="list-disc list-inside space-y-2 text-gray-300">
							<li>
								All tokens are vetted through our community-driven validation
								system
							</li>
							<li>Smart contracts undergo security audits before listing</li>
							<li>Transparent tokenomics with clear documentation</li>
							<li>Anti-rug mechanisms built into the platform</li>
							<li>Decentralized governance ensuring fair play</li>
						</ul>
					</div>
				</div>
			</div>
			<CommunicationPanel />
		</div>
	);
}
