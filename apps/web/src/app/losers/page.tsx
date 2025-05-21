export const metadata = {
  title: "LOSER Token - BUMP.WIN Protocol Fee Sharing",
  description:
    "Earn protocol fees from all BUMP.WIN transactions by staking LOSER tokens. Learn how losers can still win in the BUMP.WIN ecosystem.",
};

import FeeFlowChart from "@/components/FeeFlowChart";

export default function LosersPage() {
  return (
    <div className="bg-gray-900 min-h-screen">
      <div className="container mx-auto px-4 py-12 max-w-7xl">

        {/* Fee Flow Diagram - Using React Flow */}
        <section className="mb-24">
          <FeeFlowChart
            title="NO PROTOCOL FEE"
            subtitle="100% of Trading Fees go to LOSER Stakers"
          />
        </section>

        {/* LOSER Token Explanation - New Section */}
        <section
          className="mb-32 bg-gradient-to-br from-gray-900/80 to-gray-800/40 rounded-2xl overflow-hidden shadow-xl"
          data-lenis-scroll-snap-align="center"
        >
          <div className="grid md:grid-cols-5 items-center">
            <div
              className="md:col-span-3 p-8 md:p-10"
              data-parallax-depth="-0.05"
            >
              <div className="space-y-8">
                <div>
                  <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-purple-300 to-pink-500 bg-clip-text text-transparent">
                    Even Losers Win.
                  </h2>
                  <p className="text-xl mb-2 text-gray-200 leading-relaxed">
                    If your chosen meme coin doesn&apos;t win the battle:
                  </p>
                  <p className="text-xl mb-6 text-gray-200 leading-relaxed font-semibold">
                    You&apos;ll receive LOSER tokens proportional to your
                    investment
                  </p>
                </div>

                <div>
                  <h3 className="text-2xl font-bold mb-4 text-white">
                    LOSER Token Benefits
                  </h3>

                  <div className="bg-gray-800/50 border-l-4 border-pink-500 pl-4 py-3 mb-8">
                    <p className="text-lg text-gray-300 leading-relaxed">
                      Stake your LOSER tokens to earn 100% of all protocol fees
                    </p>
                    <p className="text-lg text-white font-semibold">
                      From both Battle AMM and Champions AMM transactions
                    </p>
                  </div>

                  <div className="p-4 bg-purple-900/20 border border-purple-500/30 rounded-lg mb-6">
                    <p className="text-white text-lg">
                      The earlier you participate, the better your LOSER token
                      ratio:
                      <br />
                      <span className="text-purple-400 font-bold">
                        • Early rounds: 1 SUI = 100 LOSER
                      </span>
                      <br />
                      <span className="text-purple-400 font-bold">
                        • Later rounds: 1 SUI = 1 LOSER
                      </span>
                    </p>
                  </div>
                </div>

                <a
                  href="/losers"
                  className="inline-block px-10 py-4 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg font-bold text-white hover:opacity-90 transition-all duration-300 hover:scale-105 hover:shadow-lg"
                >
                  Learn More About LOSER
                </a>
              </div>
            </div>
            <div
              className="md:col-span-2 p-8 md:p-10 sticky-container"
              data-parallax-depth="0.1"
            >
              <div className="relative aspect-[3/4] overflow-hidden rounded-xl shadow-2xl border border-purple-500/30 sticky-element">
                <Image
                  src="/images/mockmemes/LOSER.png"
                  alt="LOSER Token Staking"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-black/70 backdrop-blur-sm p-4">
                  <div className="text-3xl font-bold tracking-wider mb-1">
                    LOSER
                  </div>
                  <div className="text-gray-300 text-sm">
                    Protocol Fee Sharing Token
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <div className="text-gray-400 text-xs">Projected APR</div>
                    <div className="flex items-center gap-6">
                      <div>
                        <span className="text-gray-400 text-xs">Staking </span>
                        <div className="text-white text-sm font-bold">
                          15-25%
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* Hero Section */}
        <section className="mb-20 md:mb-32 flex flex-col md:flex-row items-center gap-12">
          <div className="md:w-1/2">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent">
              LOSER Token
            </h1>
            <h2 className="text-2xl md:text-3xl font-bold mb-8 text-white">
              Protocol Fee Sharing Mechanism
            </h2>
            <p className="text-xl max-w-3xl text-gray-300 mb-8">
              In BUMP.WIN, even losers win. When your chosen meme coin
              doesn&apos;t win the battle, you receive LOSER tokens that entitle
              you to protocol fees from{" "}
              <span className="text-pink-400">all future transactions</span>.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <a
                href="/rounds"
                className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg font-bold text-white hover:opacity-90 transition-all duration-300 hover:translate-y-[-2px] hover:shadow-lg"
              >
                Join a Battle
              </a>
              <a
                href="#staking"
                className="px-8 py-3 bg-gray-700 rounded-lg font-bold text-white hover:bg-gray-600 transition-colors"
              >
                Learn About Staking
              </a>
            </div>
          </div>
          <div className="md:w-1/2">
            <div className="relative aspect-[4/3] overflow-hidden rounded-xl shadow-2xl border border-pink-500/30">
              <Image
                src="/images/mockmemes/LOSER.png"
                alt="LOSER Token"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-black/70 backdrop-blur-sm p-4">
                <div className="text-2xl font-bold tracking-wider mb-1">
                  LOSER Token
                </div>
                <div className="text-gray-300 text-sm">
                  100% Protocol Fee Distribution
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* What is LOSER Token Section */}
        <section className="mb-28 bg-gradient-to-br from-gray-900/80 to-gray-800/40 rounded-2xl overflow-hidden shadow-xl p-8 md:p-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
            What is LOSER Token?
          </h2>

          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <p className="text-xl text-gray-200 mb-6">
                LOSER token is{" "}
                <span className="text-pink-400 font-semibold">
                  not a consolation prize
                </span>
                . It&apos;s a powerful economic mechanism that aligns incentives
                across the BUMP.WIN ecosystem.
              </p>

              <div className="space-y-6">
                <div className="bg-gray-800/50 p-5 rounded-lg border-l-4 border-pink-500">
                  <h3 className="text-xl font-bold mb-2 text-white">
                    Clear Definition
                  </h3>
                  <p className="text-gray-300">
                    LOSER token represents the right to earn{" "}
                    <span className="text-pink-400 font-semibold">
                      100% of all protocol transaction fees
                    </span>{" "}
                    from both Battle AMM and Champions AMM.
                  </p>
                </div>

                <div className="bg-gray-800/50 p-5 rounded-lg border-l-4 border-blue-500">
                  <h3 className="text-xl font-bold mb-2 text-white">
                    How You Get It
                  </h3>
                  <p className="text-gray-300">
                    Issued exclusively to users who invested in meme coin
                    candidates that didn&apos;t win the battle.
                    <span className="block mt-2 font-semibold">
                      Your original investment is not recoverable, but you gain
                      perpetual fee rights instead.
                    </span>
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-800/30 p-6 rounded-xl border border-gray-700">
              <h3 className="text-xl font-bold mb-4 text-white">
                Key LOSER Token Facts
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <div className="bg-pink-500 p-1 rounded-full mr-3 mt-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 text-white"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                      aria-label="Checkmark"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div>
                    <span className="font-bold text-white">Issue Rate:</span>
                    <p className="text-gray-300">
                      Early rounds: 1 SUI = 100 LOSER
                      <br />
                      Later rounds: 1 SUI = 1 LOSER
                      <br />
                      <span className="text-sm text-pink-400">
                        (Decreases gradually with each round)
                      </span>
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="bg-pink-500 p-1 rounded-full mr-3 mt-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 text-white"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                      aria-label="Checkmark"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div>
                    <span className="font-bold text-white">
                      Fee Entitlement:
                    </span>
                    <p className="text-gray-300">
                      100% of all protocol fees (1% from all transactions)
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="bg-pink-500 p-1 rounded-full mr-3 mt-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 text-white"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                      aria-label="Checkmark"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div>
                    <span className="font-bold text-white">
                      Principal Redemption:
                    </span>
                    <p className="text-gray-300">
                      None. Your original investment is fully burned.
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="bg-pink-500 p-1 rounded-full mr-3 mt-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 text-white"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                      aria-label="Checkmark"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div>
                    <span className="font-bold text-white">Expected APR:</span>
                    <p className="text-gray-300">
                      15-25% for early stakers (varies with protocol volume)
                    </p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Fee Structure Section */}
        <section className="mb-28" id="staking">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-white">
            Fee Structure & Staking
          </h2>

          <div className="grid md:grid-cols-2 gap-16">
            <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/80 rounded-2xl overflow-hidden shadow-xl p-8">
              <h3 className="text-2xl font-bold mb-6 text-pink-400">
                Fee Collection Sources
              </h3>

              <div className="space-y-6 mb-8">
                <div className="bg-gray-800/70 p-4 rounded-lg">
                  <h4 className="text-lg font-bold text-white mb-2">
                    Battle AMM Fees
                  </h4>
                  <ul className="text-gray-300 space-y-2">
                    <li>
                      <span className="text-pink-400 font-mono">1%</span> -
                      Deposit Fee
                    </li>
                    <li>
                      <span className="text-pink-400 font-mono">1%</span> -
                      Switch Between Coins Fee
                    </li>
                    <li>
                      <span className="text-pink-400 font-mono">0-48%</span> -
                      Withdraw Fee (increases linearly over 24h)
                    </li>
                  </ul>
                </div>

                <div className="bg-gray-800/70 p-4 rounded-lg">
                  <h4 className="text-lg font-bold text-white mb-2">
                    Champions AMM Fees
                  </h4>
                  <ul className="text-gray-300 space-y-2">
                    <li>
                      <span className="text-pink-400 font-mono">1%</span> - All
                      Swap Transactions
                    </li>
                  </ul>
                </div>
              </div>

              <div className="bg-pink-900/20 p-4 rounded-lg border border-pink-800/30">
                <p className="text-white">
                  <span className="font-bold text-pink-400">100%</span> of all
                  collected fees are distributed to LOSER stakers proportionally
                  to their staked amount
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/80 rounded-2xl overflow-hidden shadow-xl p-8">
              <h3 className="text-2xl font-bold mb-6 text-pink-400">
                Staking Mechanism
              </h3>

              <div className="space-y-6 mb-8">
                <div className="bg-gray-800/70 p-4 rounded-lg">
                  <h4 className="text-lg font-bold text-white mb-2">
                    Single Pool System
                  </h4>
                  <p className="text-gray-300">
                    All LOSER tokens are staked in a single pool regardless of
                    which round they were issued in.
                  </p>
                </div>

                <div className="bg-gray-800/70 p-4 rounded-lg">
                  <h4 className="text-lg font-bold text-white mb-2">
                    Flexible Staking
                  </h4>
                  <p className="text-gray-300">
                    Stake and unstake at any time with no lockup period.
                  </p>
                </div>

                <div className="bg-gray-800/70 p-4 rounded-lg">
                  <h4 className="text-lg font-bold text-white mb-2">
                    Automated Distribution
                  </h4>
                  <p className="text-gray-300">
                    Fees are automatically distributed to stakers in real-time
                    as they are collected.
                  </p>
                </div>
              </div>

              <div className="bg-green-900/20 p-4 rounded-lg border border-green-800/30">
                <p className="text-white">
                  <span className="font-bold text-green-400">
                    Early Advantage:
                  </span>{" "}
                  Early round participants receive significantly more LOSER
                  tokens per SUI invested, giving them a larger share of all
                  future protocol fees.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Strategic Considerations */}
        <section className="mb-28 bg-gradient-to-br from-gray-900/80 to-gray-800/40 rounded-2xl overflow-hidden shadow-xl p-8 md:p-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center text-white">
            Strategic Considerations
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-800/30 p-6 rounded-xl border border-gray-700 hover:border-pink-500/30 transition-colors">
              <h3 className="text-xl font-bold mb-4 text-white">
                Win-Win Approach
              </h3>
              <p className="text-gray-300">
                By participating in early rounds, you can win either way:
                <span className="block mt-2">
                  • Champion tokens if your coin wins
                </span>
                <span className="block">
                  • Higher LOSER ratio if your coin loses
                </span>
              </p>
            </div>

            <div className="bg-gray-800/30 p-6 rounded-xl border border-gray-700 hover:border-pink-500/30 transition-colors">
              <h3 className="text-xl font-bold mb-4 text-white">
                Diversification Strategy
              </h3>
              <p className="text-gray-300">
                Consider investing in multiple coins within a battle round to:
                <span className="block mt-2">
                  • Increase chances of winning with a Champion
                </span>
                <span className="block">
                  • Guarantee some LOSER tokens even if you back a winner
                </span>
              </p>
            </div>

            <div className="bg-gray-800/30 p-6 rounded-xl border border-gray-700 hover:border-pink-500/30 transition-colors">
              <h3 className="text-xl font-bold mb-4 text-white">
                Early Participation
              </h3>
              <p className="text-gray-300">
                The earliest rounds offer the highest LOSER:SUI ratio,
                providing:
                <span className="block mt-2">
                  • Up to 100 LOSER per 1 SUI in initial rounds
                </span>
                <span className="block">
                  • Significantly higher share of all future protocol fees
                </span>
              </p>
            </div>
          </div>

          <div className="mt-12 p-6 bg-pink-900/20 rounded-lg border border-pink-800/30">
            <h3 className="text-xl font-bold mb-4 text-center text-white">
              Risk vs. Reward Balance
            </h3>
            <p className="text-center text-gray-300 max-w-3xl mx-auto">
              BUMP.WIN creates a balanced ecosystem where both winners and
              losers have clear value propositions. While Champions get
              immediate token launches with strong liquidity, LOSER token
              holders gain perpetual fee-earning rights.
            </p>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-16 text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-8 bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
            Ready to Earn Protocol Fees?
          </h2>
          <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto">
            Join the BUMP.WIN ecosystem today. Whether you win or lose a battle,
            there&apos;s a clear path to value in our winner-takes-all meme coin
            platform.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <a
              href="/rounds"
              className="px-10 py-4 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg font-bold text-white hover:opacity-90 transition-all duration-300 hover:scale-105 hover:shadow-lg"
            >
              Join Current Battle
            </a>
            <a
              href="/stake"
              className="px-10 py-4 bg-gray-700 rounded-lg font-bold text-white hover:bg-gray-600 transition-all duration-300 hover:scale-105"
            >
              Stake LOSER Tokens
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
