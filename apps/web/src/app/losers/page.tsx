"use client";

import FeeFlowChart from "@/components/charts/FeeFlowChart";
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
    <div className="min-h-screen bg-gray-900">
      <div className="container mx-auto max-w-6xl px-4 py-12">
        {/* HERO SECTION */}
        <section className="relative mb-20">
          <div className="-z-10 absolute inset-0 rounded-3xl bg-gradient-to-r from-teal-500/10 to-emerald-500/10 blur-3xl" />
          <div className="grid items-center gap-12 md:grid-cols-2">
            <div className="space-y-6">
              <div className="mb-2 inline-block rounded-full border border-teal-500/30 bg-teal-900/40 px-4 py-1 font-medium text-teal-300">
                Protocol Fee Sharing
              </div>
              <h1 className="bg-gradient-to-r from-teal-400 via-emerald-500 to-cyan-500 bg-clip-text font-bold text-5xl text-transparent leading-tight md:text-6xl">
                LOSER Token
              </h1>
              <h2 className="font-bold text-2xl text-white md:text-3xl">
                100% of Protocol Fees to Stakers
              </h2>
              <p className="text-gray-300 text-xl leading-relaxed">
                Lose a battle, win the war. When your chosen meme coin doesn&apos;t win, you receive
                LOSER tokens that entitle you to
                <span className="font-semibold text-teal-400"> 100% of protocol fees </span>
                from all future transactions.
              </p>
              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <button
                  type="button"
                  onClick={() => {
                    const el = document.getElementById("staking");
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="rounded-xl bg-gradient-to-r from-teal-500 to-emerald-600 px-8 py-4 text-center font-bold text-white transition-all duration-300 hover:scale-105 hover:opacity-90 hover:shadow-xl"
                >
                  Staking $LOSER
                </button>
              </div>
            </div>
            <div className="relative flex justify-center md:justify-end">
              <div className="-inset-4 absolute rounded-full bg-gradient-to-r from-teal-500/20 to-emerald-500/20 blur-xl" />
              <div className="relative z-10 aspect-[3/4] w-full max-w-xs overflow-hidden rounded-2xl border border-teal-500/30 shadow-2xl">
                <Image
                  src="/images/mockmemes/LOSER.png"
                  alt="LOSER Token"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute right-0 bottom-0 left-0 bg-black/70 p-6 backdrop-blur-sm">
                  <div className="mb-1 font-bold text-3xl tracking-wider">LOSER</div>
                  <div className="text-gray-300 text-sm">Fee Distribution Token</div>
                  <div className="mt-3 flex items-center justify-between">
                    <div className="text-gray-400 text-xs">Expected APR</div>
                    <div className="font-bold text-lg text-white">15-25%</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* LOSER TAKES ALL FEE */}
        <section className="relative mb-20 overflow-hidden">
          <div className="-z-10 absolute inset-0 rounded-3xl bg-gradient-to-b from-teal-900/20 to-emerald-900/20 blur-3xl" />
          <div className="mb-12 text-center">
            <h2 className="mb-4 bg-gradient-to-r from-teal-400 to-emerald-500 bg-clip-text font-bold text-3xl text-transparent md:text-4xl">
              LOSER TAKES ALL FEES
            </h2>
            <p className="mx-auto max-w-2xl text-gray-300 text-xl">
              100% of trading fees flow to LOSER stakers, not to developers or team members.
            </p>
          </div>

          <div className="mx-auto w-full max-w-6xl">
            <FeeFlowChart
              title="100% FEE DISTRIBUTION"
              subtitle="All Trading Fees go to LOSER Stakers"
            />

            <div className="mx-auto mt-8 max-w-3xl rounded-xl border border-teal-500/20 bg-gray-800/50 p-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-3">
                  <h3 className="font-semibold text-lg text-white">Fee Sources</h3>
                  <ul className="space-y-2 text-gray-300">
                    <li className="flex items-start">
                      <span className="mt-1 mr-2 inline-block h-4 w-4 rounded-full bg-teal-500" />
                      <span>Battle AMM: 1% fixed fee on all trades</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mt-1 mr-2 inline-block h-4 w-4 rounded-full bg-yellow-500" />
                      <span>Champion AMM: 1% fixed fee on all swaps</span>
                    </li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <h3 className="font-semibold text-lg text-white">Distribution</h3>
                  <ul className="space-y-2 text-gray-300">
                    <li className="flex items-start">
                      <span className="mt-1 mr-2 inline-block h-4 w-4 rounded-full bg-green-500" />
                      <span>
                        <strong className="text-green-400">100%</strong> to LOSER stakers
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="mt-1 mr-2 inline-block h-4 w-4 rounded-full bg-red-500" />
                      <span>
                        <strong className="text-white">0%</strong> to protocol or team
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* HOW TO GET LOSERS */}
        <section className="relative mb-20">
          <div className="-z-10 absolute inset-0 rounded-3xl bg-gradient-to-b from-teal-900/20 to-cyan-900/20 blur-3xl" />
          <div className="mb-12 text-center">
            <h2 className="mb-4 bg-gradient-to-r from-teal-400 to-cyan-500 bg-clip-text font-bold text-3xl text-transparent md:text-4xl">
              HOW TO GET LOSER TOKENS
            </h2>
            <p className="mx-auto max-w-2xl text-gray-300 text-xl">
              LOSER tokens are exclusively issued to participants who backed losing meme coins.
            </p>
          </div>

          <div className="mx-auto max-w-4xl rounded-2xl border border-teal-500/20 bg-gray-800/30 p-8 backdrop-blur-sm">
            <div className="grid gap-8 md:grid-cols-3">
              <div className="relative overflow-hidden rounded-xl border border-teal-500/30 bg-gray-900/50 p-6">
                <div className="-right-6 -top-6 absolute h-12 w-12 rounded-full bg-teal-500/20 blur-xl" />
                <div className="absolute top-2 right-2 flex h-8 w-8 items-center justify-center rounded-full bg-teal-900 font-bold text-white">
                  1
                </div>
                <h3 className="mb-3 font-bold text-white text-xl">Join a Battle</h3>
                <p className="text-gray-300">
                  Stake SUI on your favorite meme coin candidate in any battle round
                </p>
              </div>
              <div className="relative overflow-hidden rounded-xl border border-cyan-500/30 bg-gray-900/50 p-6">
                <div className="-right-6 -top-6 absolute h-12 w-12 rounded-full bg-cyan-500/20 blur-xl" />
                <div className="absolute top-2 right-2 flex h-8 w-8 items-center justify-center rounded-full bg-cyan-900 font-bold text-white">
                  2
                </div>
                <h3 className="mb-3 font-bold text-white text-xl">Lose the Battle</h3>
                <p className="text-gray-300">
                  If your chosen meme coin doesn&apos;t win the round, you qualify for LOSER tokens
                </p>
              </div>
              <div className="relative overflow-hidden rounded-xl border border-emerald-500/30 bg-gray-900/50 p-6">
                <div className="-right-6 -top-6 absolute h-12 w-12 rounded-full bg-emerald-500/20 blur-xl" />
                <div className="absolute top-2 right-2 flex h-8 w-8 items-center justify-center rounded-full bg-emerald-900 font-bold text-white">
                  3
                </div>
                <h3 className="mb-3 font-bold text-white text-xl">Receive LOSER</h3>
                <p className="text-gray-300">
                  Get LOSER tokens proportional to your burned SUI investment
                </p>
              </div>
            </div>

            <div className="mt-8 rounded-xl border border-teal-500/20 bg-gray-900/50 p-6">
              <h3 className="mb-4 flex items-center font-bold text-white text-xl">
                <span className="mr-2 inline-block h-4 w-4 rounded-full bg-teal-500" />
                Important Notes
              </h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-lg bg-gray-800/50 p-4">
                  <p className="text-gray-300">
                    <span className="font-bold text-red-400">×</span> Your staked SUI is not
                    returned
                  </p>
                  <p className="text-gray-300">
                    <span className="font-bold text-green-400">✓</span>{" "}
                    <span className="text-white">100% burned</span> in exchange for LOSER tokens
                  </p>
                </div>
                <div className="rounded-lg bg-gray-800/50 p-4">
                  <p className="text-gray-300">
                    <span className="font-bold text-red-400">×</span> Not a consolation prize
                  </p>
                  <p className="text-gray-300">
                    <span className="font-bold text-green-400">✓</span>{" "}
                    <span className="text-white">Fee distribution rights</span> token only
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-12 text-center">
              <a
                href="/rounds"
                className="inline-block rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 px-8 py-4 font-bold text-white transition-all duration-300 hover:scale-105 hover:opacity-90 hover:shadow-xl"
              >
                Join Current Battle
              </a>
            </div>
          </div>
        </section>

        {/* EARLY DOMINANCE */}
        <section className="relative mb-20">
          <div className="-z-10 absolute inset-0 rounded-3xl bg-gradient-to-b from-cyan-900/20 to-teal-900/20 blur-3xl" />
          <div className="mb-12 text-center">
            <h2 className="mb-4 bg-gradient-to-r from-cyan-400 to-teal-500 bg-clip-text font-bold text-3xl text-transparent md:text-4xl">
              EARLY DOMINANCE: BE FIRST, EARN MORE
            </h2>
            <p className="mx-auto max-w-2xl text-gray-300 text-xl">
              The number of LOSER tokens issued per round decreases as rounds progress. The actual
              amount you receive is always proportional to the amount of SUI you burned in that
              round.
            </p>
          </div>
          <div className="mx-auto max-w-4xl rounded-2xl border border-teal-500/20 bg-gray-800/30 p-8 backdrop-blur-sm">
            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={loserInflationData}
                  margin={{ top: 10, right: 30, left: 10, bottom: 30 }}
                >
                  <defs>
                    <linearGradient id="colorIssuance" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2dd4bf" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#0d9488" stopOpacity={0.2} />
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
                    stroke="#2dd4bf"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorIssuance)"
                    name="LOSER per 1 SUI"
                  />
                  <Legend wrapperStyle={{ color: "#fff" }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-8 grid gap-6 md:grid-cols-3">
              <div className="rounded-lg border border-teal-500/30 bg-gray-900/50 p-4">
                <h3 className="mb-2 flex items-center font-bold text-white">
                  <span className="mr-2 inline-block h-3 w-3 rounded-full bg-teal-500" />
                  Early Rounds
                </h3>
                <p className="text-gray-300 text-sm">
                  <strong>Rounds 1-4:</strong> Highest issuance rate starting at 100 LOSER per 1
                  SUI, decreasing to 59
                </p>
              </div>
              <div className="rounded-lg border border-cyan-500/30 bg-gray-900/50 p-4">
                <h3 className="mb-2 flex items-center font-bold text-white">
                  <span className="mr-2 inline-block h-3 w-3 rounded-full bg-cyan-500" />
                  Mid Rounds
                </h3>
                <p className="text-gray-300 text-sm">
                  <strong>Rounds 5-8:</strong> Medium issuance rate from 50 LOSER per 1 SUI,
                  decreasing to 30
                </p>
              </div>
              <div className="rounded-lg border border-emerald-500/30 bg-gray-900/50 p-4">
                <h3 className="mb-2 flex items-center font-bold text-white">
                  <span className="mr-2 inline-block h-3 w-3 rounded-full bg-emerald-500" />
                  Late Rounds
                </h3>
                <p className="text-gray-300 text-sm">
                  <strong>Rounds 9+:</strong> Lower issuance rate starting at 25 LOSER per 1 SUI,
                  with floor of 1
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* STAKING SECTION */}
        <section className="relative mb-20" id="staking">
          <div className="-z-10 absolute inset-0 rounded-3xl bg-gradient-to-b from-teal-900/20 to-cyan-900/20 blur-3xl" />
          <div className="mb-12 text-center">
            <h2 className="mb-4 bg-gradient-to-r from-teal-400 to-cyan-500 bg-clip-text font-bold text-3xl text-transparent md:text-4xl">
              LOSER STAKING
            </h2>
            <p className="mx-auto max-w-2xl text-gray-300 text-xl">
              Stake your LOSER tokens to earn protocol fees from all transactions.
            </p>
          </div>
          <div className="mx-auto max-w-4xl overflow-hidden rounded-2xl border border-teal-900/30 bg-[#151921] shadow-xl backdrop-blur-sm">
            <div className="flex items-center justify-between border-teal-900/30 border-b bg-gradient-to-r from-teal-900/20 to-cyan-900/20 p-6">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-full">
                  <Image
                    src="/images/mockmemes/LOSER.png"
                    alt="LOSER"
                    width={40}
                    height={40}
                    className="bg-transparent object-contain"
                  />
                </div>
                <div>
                  <div className="font-bold text-2xl text-white">LOSER</div>
                  <div className="text-gray-400 text-sm">Fee Distribution Token</div>
                </div>
              </div>
            </div>
            <div className="p-8">
              <div className="mb-8 grid grid-cols-2 gap-6 md:grid-cols-4">
                <div className="rounded-xl bg-[#1c2028] p-4">
                  <div className="mb-1 text-gray-400 text-sm">Pending Rewards</div>
                  <div className="font-bold text-2xl text-white">0 WSUI</div>
                  <div className="text-gray-500 text-xs">$0.00</div>
                </div>
                <div className="rounded-xl bg-[#1c2028] p-4">
                  <div className="mb-1 text-gray-400 text-sm">Total Staked</div>
                  <div className="font-bold text-2xl text-white">0 LOSER</div>
                  <div className="text-gray-500 text-xs">$0.00</div>
                </div>
              </div>
              <div className="grid gap-8 md:grid-cols-2">
                <div className="rounded-xl border border-teal-900/30 bg-[#1E212A] p-6">
                  <div className="mb-4 font-semibold text-lg text-white">Available LOSER</div>
                  <div className="mb-4 flex items-end justify-between">
                    <div>
                      <div className="mb-1 font-bold text-3xl text-white">0 LOSER</div>
                      <div className="text-gray-400 text-sm">$0.00</div>
                    </div>
                    <button
                      type="button"
                      className="rounded-lg bg-[#1c2028] px-8 py-3 font-medium text-gray-400 transition hover:bg-[#262a35]"
                    >
                      MAX
                    </button>
                  </div>
                  <button
                    type="button"
                    className="mt-4 w-full rounded-xl bg-gradient-to-r from-teal-500 to-cyan-600 py-3 font-bold text-white transition hover:opacity-90 hover:shadow-lg"
                    onClick={() => alert("Stake functionality is not implemented yet")}
                  >
                    Stake
                  </button>
                </div>
                <div className="rounded-xl border border-teal-900/30 bg-[#1E212A] p-6">
                  <div className="mb-4 font-semibold text-lg text-white">Pending Rewards</div>
                  <div className="mb-4 flex items-end justify-between">
                    <div>
                      <div className="mb-1 font-bold text-3xl text-white">0 WSUI</div>
                      <div className="text-gray-400 text-sm">$0.00</div>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="mt-4 w-full rounded-xl bg-gradient-to-r from-teal-500 to-cyan-600 py-3 font-bold text-white transition hover:opacity-90 hover:shadow-lg"
                    onClick={() => alert("Harvest functionality is not implemented yet")}
                  >
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
