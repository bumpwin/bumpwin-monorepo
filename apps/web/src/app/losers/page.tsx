"use client";

import FeeFlowChart from "@/components/FeeFlowChart";
import Image from "next/image";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

// LOSER token inflation schedule data - accurate half-life model
const generateInflationData = () => {
  const rounds = 15; // Number of rounds to display
  const initialRate = 100; // Initial issuance rate in Round 1
  const halfLife = 4; // Half-life in rounds

  return Array.from({ length: rounds }, (_, i) => {
    const roundNumber = i + 1;
    // Exponential decay: initial value * 0.5^(x/halfLife)
    const issuanceRate = Math.max(
      1,
      Math.round(initialRate * 0.5 ** ((roundNumber - 1) / halfLife)),
    );
    return {
      round: roundNumber,
      issuanceRate,
      label: `Round ${roundNumber}`,
    };
  });
};

const loserInflationData = generateInflationData();

export default function LosersPage() {
  return (
    <div className="bg-gray-900 min-h-screen">
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        {/* HERO SECTION */}
        <section className="mb-20 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-3xl blur-3xl -z-10" />
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-block px-4 py-1 bg-purple-900/40 rounded-full border border-purple-500/30 text-purple-300 font-medium mb-2">
                Protocol Fee Sharing
              </div>
              <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent leading-tight">
                LOSER Token
              </h1>
              <h2 className="text-2xl md:text-3xl font-bold text-white">
                100% of Protocol Fees to Stakers
              </h2>
              <p className="text-xl text-gray-300 leading-relaxed">
                Lose a battle, win the war. When your chosen meme coin doesn't win,
                you receive LOSER tokens that entitle you to
                <span className="text-pink-400 font-semibold"> 100% of protocol fees </span>
                from all future transactions.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mt-8">
                <button
                  type="button"
                  onClick={() => {
                    const el = document.getElementById('staking');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl font-bold text-white hover:opacity-90 transition-all duration-300 hover:scale-105 hover:shadow-xl text-center"
                >
                  Staking $LOSER
                </button>
              </div>
            </div>
            <div className="flex justify-center md:justify-end relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-xl" />
              <div className="relative aspect-[3/4] w-full max-w-xs overflow-hidden rounded-2xl shadow-2xl border border-purple-500/30 z-10">
                <Image
                  src="/images/mockmemes/LOSER.png"
                  alt="LOSER Token"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-black/70 backdrop-blur-sm p-6">
                  <div className="text-3xl font-bold tracking-wider mb-1">
                    LOSER
                  </div>
                  <div className="text-gray-300 text-sm">
                    Fee Distribution Token
                  </div>
                  <div className="flex justify-between items-center mt-3">
                    <div className="text-gray-400 text-xs">Expected APR</div>
                    <div className="text-white text-lg font-bold">
                      15-25%
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* LOSER TAKES ALL FEE */}
        <section className="mb-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 to-pink-900/20 rounded-3xl blur-3xl -z-10" />
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
              LOSER TAKES ALL FEES
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              100% of trading fees flow to LOSER stakers, not to developers or team members.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <FeeFlowChart
              title="100% FEE DISTRIBUTION"
              subtitle="All Trading Fees go to LOSER Stakers"
            />

            <div className="bg-gray-800/50 p-6 rounded-xl border border-purple-500/20 mt-8 max-w-3xl mx-auto">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-white">Fee Sources</h3>
                  <ul className="space-y-2 text-gray-300">
                    <li className="flex items-start">
                      <span className="inline-block w-4 h-4 rounded-full bg-pink-500 mr-2 mt-1" />
                      <span>Battle AMM: 1% fixed fee on all trades</span>
                    </li>
                    <li className="flex items-start">
                      <span className="inline-block w-4 h-4 rounded-full bg-pink-500 mr-2 mt-1" />
                      <span>Champion AMM: 1% fixed fee on all swaps</span>
                    </li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-white">Distribution</h3>
                  <ul className="space-y-2 text-gray-300">
                    <li className="flex items-start">
                      <span className="inline-block w-4 h-4 rounded-full bg-green-500 mr-2 mt-1" />
                      <span><strong className="text-green-400">100%</strong> to LOSER stakers</span>
                    </li>
                    <li className="flex items-start">
                      <span className="inline-block w-4 h-4 rounded-full bg-red-500 mr-2 mt-1" />
                      <span><strong className="text-white">0%</strong> to protocol or team</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* HOW TO GET LOSERS */}
        <section className="mb-20 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-blue-900/20 to-purple-900/20 rounded-3xl blur-3xl -z-10" />
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              HOW TO GET LOSER TOKENS
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              LOSER tokens are exclusively issued to participants who backed losing meme coins.
            </p>
          </div>

          <div className="bg-gray-800/30 backdrop-blur-sm p-8 rounded-2xl border border-blue-500/20 max-w-4xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-gray-900/50 p-6 rounded-xl border border-blue-500/30 relative overflow-hidden">
                <div className="absolute -right-6 -top-6 w-12 h-12 rounded-full bg-blue-500/20 blur-xl" />
                <div className="absolute top-2 right-2 bg-blue-900 w-8 h-8 rounded-full flex items-center justify-center text-white font-bold">1</div>
                <h3 className="text-xl font-bold mb-3 text-white">Join a Battle</h3>
                <p className="text-gray-300">
                  Stake SUI on your favorite meme coin candidate in any battle round
                </p>
              </div>
              <div className="bg-gray-900/50 p-6 rounded-xl border border-pink-500/30 relative overflow-hidden">
                <div className="absolute -right-6 -top-6 w-12 h-12 rounded-full bg-pink-500/20 blur-xl" />
                <div className="absolute top-2 right-2 bg-pink-900 w-8 h-8 rounded-full flex items-center justify-center text-white font-bold">2</div>
                <h3 className="text-xl font-bold mb-3 text-white">Lose the Battle</h3>
                <p className="text-gray-300">
                  If your chosen meme coin doesn't win the round, you qualify for LOSER tokens
                </p>
              </div>
              <div className="bg-gray-900/50 p-6 rounded-xl border border-purple-500/30 relative overflow-hidden">
                <div className="absolute -right-6 -top-6 w-12 h-12 rounded-full bg-purple-500/20 blur-xl" />
                <div className="absolute top-2 right-2 bg-purple-900 w-8 h-8 rounded-full flex items-center justify-center text-white font-bold">3</div>
                <h3 className="text-xl font-bold mb-3 text-white">Receive LOSER</h3>
                <p className="text-gray-300">
                  Get LOSER tokens proportional to your burned SUI investment
                </p>
              </div>
            </div>

            <div className="mt-8 bg-gray-900/50 p-6 rounded-xl border border-pink-500/20">
              <h3 className="text-xl font-bold mb-4 text-white flex items-center">
                <span className="inline-block w-4 h-4 rounded-full bg-pink-500 mr-2" />
                Important Notes
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-gray-800/50 p-4 rounded-lg">
                  <p className="text-gray-300">
                    <span className="text-red-400 font-bold">×</span> Your staked SUI is not returned
                  </p>
                  <p className="text-gray-300">
                    <span className="text-green-400 font-bold">✓</span> <span className="text-white">100% burned</span> in exchange for LOSER tokens
                  </p>
                </div>
                <div className="bg-gray-800/50 p-4 rounded-lg">
                  <p className="text-gray-300">
                    <span className="text-red-400 font-bold">×</span> Not a consolation prize
                  </p>
                  <p className="text-gray-300">
                    <span className="text-green-400 font-bold">✓</span> <span className="text-white">Fee distribution rights</span> token only
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-12 text-center">
              <a href="/rounds" className="inline-block px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl font-bold text-white hover:opacity-90 transition-all duration-300 hover:scale-105 hover:shadow-xl">
                Join Current Battle
              </a>
            </div>
          </div>
        </section>

        {/* EARLY DOMINANCE */}
        <section className="mb-20 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-pink-900/20 to-purple-900/20 rounded-3xl blur-3xl -z-10" />
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-pink-400 to-purple-500 bg-clip-text text-transparent">
              EARLY DOMINANCE: BE FIRST, EARN MORE
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              The number of LOSER tokens issued per round decreases as rounds progress. The actual amount you receive is always proportional to the amount of SUI you burned in that round.
            </p>
          </div>
          <div className="bg-gray-800/30 backdrop-blur-sm p-8 rounded-2xl border border-pink-500/20 max-w-4xl mx-auto">
            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={loserInflationData}
                  margin={{ top: 10, right: 30, left: 10, bottom: 30 }}
                >
                  <defs>
                    <linearGradient
                      id="colorIssuance"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#a855f7" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#ec4899" stopOpacity={0.2} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#444" opacity={0.5} />
                  <XAxis
                    dataKey="round"
                    label={{
                      value: "Battle Round",
                      position: "insideBottom",
                      offset: -15,
                      fill: "#fff",
                    }}
                    tick={{ fill: "#ccc" }}
                  />
                  <YAxis
                    label={{
                      value: "LOSER per 1 SUI",
                      angle: -90,
                      position: "insideLeft",
                      offset: 10,
                      fill: "#fff",
                    }}
                    tick={{ fill: "#ccc" }}
                    domain={[0, "dataMax"]}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#222",
                      borderColor: "#444",
                      color: "#fff",
                    }}
                    formatter={(value: number) => [`${value} LOSER`, "per 1 SUI"]}
                    labelFormatter={(label) => `Battle Round ${label}`}
                  />
                  <Area
                    type="monotone"
                    dataKey="issuanceRate"
                    stroke="#a855f7"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorIssuance)"
                    name="LOSER per 1 SUI"
                  />
                  <Legend wrapperStyle={{ color: "#fff" }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-8 grid md:grid-cols-3 gap-6">
              <div className="bg-gray-900/50 p-4 rounded-lg border border-purple-500/30">
                <h3 className="font-bold text-white mb-2 flex items-center">
                  <span className="inline-block w-3 h-3 rounded-full bg-purple-500 mr-2" />
                  Early Rounds
                </h3>
                <p className="text-gray-300 text-sm">
                  <strong>Rounds 1-4:</strong> Highest issuance rate starting at 100 LOSER per 1 SUI, decreasing to 59
                </p>
              </div>
              <div className="bg-gray-900/50 p-4 rounded-lg border border-pink-500/30">
                <h3 className="font-bold text-white mb-2 flex items-center">
                  <span className="inline-block w-3 h-3 rounded-full bg-pink-500 mr-2" />
                  Mid Rounds
                </h3>
                <p className="text-gray-300 text-sm">
                  <strong>Rounds 5-8:</strong> Medium issuance rate from 50 LOSER per 1 SUI, decreasing to 30
                </p>
              </div>
              <div className="bg-gray-900/50 p-4 rounded-lg border border-blue-500/30">
                <h3 className="font-bold text-white mb-2 flex items-center">
                  <span className="inline-block w-3 h-3 rounded-full bg-blue-500 mr-2" />
                  Late Rounds
                </h3>
                <p className="text-gray-300 text-sm">
                  <strong>Rounds 9+:</strong> Lower issuance rate starting at 25 LOSER per 1 SUI, with floor of 1
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* STAKING SECTION */}
        <section className="mb-20 relative" id="staking">
          <div className="absolute inset-0 bg-gradient-to-b from-blue-900/20 to-purple-900/20 rounded-3xl blur-3xl -z-10" />
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              LOSER STAKING
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Stake your LOSER tokens to earn protocol fees from all transactions.
            </p>
          </div>
          <div className="bg-[#151921] backdrop-blur-sm rounded-2xl shadow-xl border border-blue-900/30 max-w-4xl mx-auto overflow-hidden">
            <div className="p-6 bg-gradient-to-r from-blue-900/20 to-purple-900/20 border-b border-blue-900/30 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                  <Image src="/images/mockmemes/LOSER.png" alt="LOSER" width={40} height={40} />
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">LOSER</div>
                  <div className="text-sm text-gray-400">Fee Distribution Token</div>
                </div>
              </div>
            </div>
            <div className="p-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-[#1c2028] p-4 rounded-xl">
                  <div className="text-sm text-gray-400 mb-1">Pending Rewards</div>
                  <div className="text-2xl font-bold text-white">0 LOSER</div>
                  <div className="text-xs text-gray-500">$0.00</div>
                </div>
                <div className="bg-[#1c2028] p-4 rounded-xl">
                  <div className="text-sm text-gray-400 mb-1">Total Staked</div>
                  <div className="text-2xl font-bold text-white">0 LOSER</div>
                  <div className="text-xs text-gray-500">$0.00</div>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-[#1E212A] rounded-xl p-6 border border-blue-900/30">
                  <div className="text-lg font-semibold text-white mb-4">Available LOSER</div>
                  <div className="flex items-end justify-between mb-4">
                    <div>
                      <div className="text-3xl font-bold text-white mb-1">0 LOSER</div>
                      <div className="text-sm text-gray-400">$0.00</div>
                    </div>
                    <button type="button" className="px-8 py-3 bg-[#1c2028] text-gray-400 rounded-lg font-medium hover:bg-[#262a35] transition">MAX</button>
                  </div>
                  <button type="button" className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold py-3 rounded-xl mt-4 hover:opacity-90 transition hover:shadow-lg">
                    Stake
                  </button>
                </div>
                <div className="bg-[#1E212A] rounded-xl p-6 border border-blue-900/30">
                  <div className="text-lg font-semibold text-white mb-4">Pending Rewards</div>
                  <div className="flex items-end justify-between mb-4">
                    <div>
                      <div className="text-3xl font-bold text-white mb-1">0 LOSER</div>
                      <div className="text-sm text-gray-400">$0.00</div>
                    </div>
                  </div>
                  <button type="button" className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold py-3 rounded-xl mt-4 hover:opacity-90 transition hover:shadow-lg">
                    Harvest
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
