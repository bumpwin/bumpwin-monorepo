import Image from 'next/image';
import Link from 'next/link';
import { useRef, useEffect } from 'react';
import AboutClient from './client';

export const metadata = {
  title: "BUMP.WIN - Squid Game Style Meme Coin Battle Royale",
  description: "Only one meme coin survives. Rally community support, win the battle, and dominate the market.",
};

// Custom animation classes for scroll reveal
const fadeInUp = "opacity-0 translate-y-10 transition-all duration-1000";
const fadeInLeft = "opacity-0 -translate-x-10 transition-all duration-1000";
const fadeInRight = "opacity-0 translate-x-10 transition-all duration-1000";
const fadeInScale = "opacity-0 scale-95 transition-all duration-1000";

export default function AboutPage() {
  return (
    <AboutClient>
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        {/* Hero Section */}
        <section className="mb-20 flex flex-col md:flex-row items-center gap-12 min-h-[80vh] justify-center" data-lenis-scroll-snap-align="start">
          <div className="md:w-1/2" data-parallax-depth="-0.3">
            <Image
              src="/images/last-one-standing.png"
              alt="Last One Standing - Meme Coin Battle"
              width={600}
              height={450}
              className="rounded-xl shadow-2xl w-full"
            />
          </div>
          <div className="md:w-1/2 space-y-6 text-center md:text-left" data-parallax-depth="0.2">
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent">
              Squid Game Style
              <span className="block text-white mt-2">Meme Launchpad</span>
            </h1>
            <p className="text-xl text-gray-300">
              Winner-takes-all meme coin battle royale. <span className="text-yellow-400">Only one winner</span> gets officially launched and acquires <span className="text-yellow-400">all the liquidity</span>.
            </p>
            <div className="pt-4">
              <Link href="/rounds" className="px-8 py-3 bg-gradient-to-r from-pink-500 to-purple-500 rounded-lg font-bold text-white hover:opacity-90 transition-all duration-300 hover:translate-y-[-2px] hover:shadow-lg inline-block">
                Join the Battle
              </Link>
            </div>
          </div>
        </section>

        {/* Slogan Section */}
        <section className="my-24 relative rounded-2xl h-[40vh]" data-lenis-scroll-snap-align="center">
          <div className="absolute inset-0 overflow-hidden">
            <div
              className="w-full h-full bg-center bg-cover opacity-15"
              style={{
                backgroundImage: "url('/images/last-one-standing.png')"
              }}
              data-parallax-depth="-0.4"
            />
          </div>
          <div className="relative h-full flex items-center bg-gradient-to-r from-black/70 via-black/40 to-black/70">
            <div className="max-w-4xl mx-auto text-center space-y-6 px-4" data-parallax-depth="0.2">
              <p className="text-3xl md:text-4xl font-bold text-white">
                Countless meme coins launch every day
              </p>
              <p className="text-3xl md:text-4xl font-bold text-yellow-400">
                But on BUMP.WIN, <span className="underline decoration-dashed">only one survives</span>!
              </p>
              <p className="text-2xl md:text-3xl font-bold text-white">
                All competing meme coins' funds boost the winner's liquidity!
              </p>
              <div className="w-32 h-1 bg-gradient-to-r from-pink-500 to-purple-500 mx-auto mt-2" />
            </div>
          </div>
        </section>

        {/* Previous Champion Section */}
        <section className="mb-24 bg-gradient-to-br from-gray-900/80 to-gray-800/40 rounded-2xl overflow-hidden shadow-xl p-8" data-lenis-scroll-snap-align="center">
          <div className="grid md:grid-cols-5 gap-8 items-center">
            <div className="md:col-span-2 sticky-container" data-parallax-depth="0.1">
              <div className="relative aspect-square md:aspect-[3/4] overflow-hidden rounded-xl shadow-2xl border border-indigo-500/30 sticky-element">
                <Image
                  src="/images/mockmemes/JELL.png"
                  alt="Previous Champion - BABLCT"
                  width={400}
                  height={500}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-black/70 backdrop-blur-sm p-4">
                  <div className="text-2xl font-bold tracking-wider">BABLCT</div>
                  <div className="text-gray-300 text-sm">Babel Cult</div>
                  <div className="flex justify-between items-center mt-2">
                    <div className="text-gray-400 text-xs">4h ago</div>
                    <div className="flex items-center gap-6">
                      <div>
                        <span className="text-gray-400 text-xs">mcap </span>
                        <span className="text-green-400">+0%</span>
                        <div className="text-white text-sm font-bold">$0.00</div>
                      </div>
                      <div>
                        <span className="text-gray-400 text-xs">24h vol </span>
                        <span className="text-green-400">+0%</span>
                        <div className="text-white text-sm font-bold">$0.00</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="md:col-span-3" data-parallax-depth="-0.05">
              <div className="space-y-6">
                <h2 className="text-4xl font-bold bg-gradient-to-r from-yellow-300 to-amber-500 bg-clip-text text-transparent">
                  Winner Takes All.
                </h2>
                <p className="text-xl text-gray-200">
                  All liquidity from defeated competitors goes directly to the Champion Meme Coin's liquidity pool
                </p>

                <div className="mt-8">
                  <h3 className="text-2xl font-bold mb-4 text-white">Previous Champion Showcase</h3>

                  <div className="bg-gray-800/50 border-l-4 border-yellow-500 pl-4 py-3 mb-6">
                    <p className="text-lg text-gray-300">
                      They defeated 118 competing meme coins and launched with a liquidity pool of $114,514
                    </p>
                  </div>

                  <div className="p-4 bg-yellow-900/20 border border-yellow-500/30 rounded-lg">
                    <p className="text-white text-lg">
                      With <span className="text-yellow-400 font-bold">Champions AMM</span>, the winning meme coin gains permanent liquidity
                      backed by all funds invested during the battle
                    </p>
                  </div>
                </div>

                <Link
                  href="/champions/bablct"
                  className="mt-4 inline-block px-8 py-3 bg-gradient-to-r from-yellow-500 to-amber-600 rounded-lg font-bold text-black hover:opacity-90 transition-all duration-300 hover:scale-105 hover:shadow-lg"
                >
                  Trade This Champ
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="my-24 relative rounded-2xl overflow-hidden h-[30vh]" data-lenis-scroll-snap-align="center">
          <div className="absolute inset-0 overflow-hidden pin-background">
            <div
              className="w-full h-full bg-center bg-cover opacity-10"
              style={{
                backgroundImage: "url('/images/mockmemes/JELL.png')"
              }}
              data-parallax-pin="true"
              data-parallax-pin-offset="0.5"
            />
          </div>
          <div className="relative h-full flex items-center bg-gradient-to-r from-black/80 via-purple-900/20 to-black/80">
            <div className="max-w-4xl mx-auto text-center py-8 px-8" data-parallax-depth="0.15">
              <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-pink-400 to-purple-600 bg-clip-text text-transparent mb-6">
                Launch the next Champion Meme coin!
              </h2>
              <p className="text-xl text-white mb-6">
                Join the battle and make your meme the next champion
              </p>
              <Link href="/create" className="inline-block px-8 py-3 bg-gradient-to-r from-pink-500 to-purple-500 rounded-lg font-bold text-white hover:opacity-90 transition-all duration-300 hover:translate-y-[-2px] hover:shadow-lg">
                Register Your Coin
              </Link>
            </div>
          </div>
        </section>

        {/* Register Form Section */}
        <section className="mb-28 rounded-2xl overflow-hidden" data-lenis-scroll-snap-align="center">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="p-6" data-parallax-depth="0.05">
              <h2 className="text-3xl font-bold mb-6 text-white">
                Register your meme coin<br />for upcoming battle rounds!
              </h2>
              <p className="text-xl mb-8 text-gray-300">
                With a simple registration process, your meme coin could become the next champion. Registration opens 3 days before each round starts.
              </p>
              <Link
                href="/create"
                className="inline-block px-8 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg font-bold text-white hover:opacity-90 transition-all duration-300 hover:scale-105 hover:shadow-lg"
              >
                Register Your Coin Now
              </Link>
            </div>
            <div className="rounded-xl overflow-hidden shadow-2xl border border-indigo-500/20" data-parallax-depth="-0.05">
              <Image
                src="/images/register-form.png"
                alt="Register your meme coin"
                width={600}
                height={400}
                className="w-full"
              />
            </div>
          </div>
        </section>

        {/* Battle Rounds Explanation */}
        <section className="mb-28 battle-phases-section" data-lenis-scroll-snap-align="center">
          <div className="text-center mb-16" data-parallax-depth="0.2">
            <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
              When the Round Begins, the Race is On
            </h2>
            <p className="text-xl text-white max-w-3xl mx-auto">
              The deadly game begins to determine which meme coin will triumph!
              <span className="block text-2xl font-bold text-yellow-400 mt-4">Bet on Beliefs.</span>
            </p>
            <div className="w-32 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 mx-auto mt-6" />
          </div>

          {/* Battle Phases Progress Bar */}
          <div className="max-w-4xl mx-auto mb-16 battle-progress-container sticky top-6 z-40">
            <div className="relative py-6 px-4 bg-gray-900/80 rounded-xl backdrop-blur shadow-lg">
              {/* Progress Bar Background */}
              <div className="absolute h-2 bg-gray-700 rounded-full w-full top-1/2 transform -translate-y-1/2" />

              {/* Active Progress Bar */}
              <div className="absolute h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-yellow-500 rounded-full top-1/2 transform -translate-y-1/2 battle-progress-bar" style={{width: '0%'}} />

              {/* Phase Markers */}
              <div className="relative flex justify-between">
                {/* Daytime */}
                <div className="z-10 text-center">
                  <div className="w-8 h-8 bg-blue-500 rounded-full mx-auto mb-2 flex items-center justify-center phase-marker phase-daytime-marker shadow-lg">
                    <span className="text-sm font-bold text-white">1</span>
                  </div>
                  <p className="text-blue-400 font-bold phase-label phase-daytime-label">Daytime</p>
                  <p className="text-xs text-gray-400">24 Hours</p>
                </div>

                {/* DarkNight */}
                <div className="z-10 text-center">
                  <div className="w-8 h-8 bg-gray-600 rounded-full mx-auto mb-2 flex items-center justify-center phase-marker phase-darknight-marker shadow-lg">
                    <span className="text-sm font-bold text-white">2</span>
                  </div>
                  <p className="text-gray-400 font-bold phase-label phase-darknight-label">DarkNight</p>
                  <p className="text-xs text-gray-400">1 Hour</p>
                </div>

                {/* Sunrise */}
                <div className="z-10 text-center">
                  <div className="w-8 h-8 bg-gray-600 rounded-full mx-auto mb-2 flex items-center justify-center phase-marker phase-sunrise-marker shadow-lg">
                    <span className="text-sm font-bold text-white">3</span>
                  </div>
                  <p className="text-gray-400 font-bold phase-label phase-sunrise-label">Sunrise</p>
                  <p className="text-xs text-gray-400">Launch</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-start relative">
            <div className="relative md:sticky top-36 h-auto w-full z-20">
              <div className="rounded-xl overflow-hidden shadow-xl border border-blue-500/20 transform hover:rotate-0 transition-all duration-500 sticky-chart">
                <Image
                  src="/images/prediction-chart.png"
                  alt="Live prediction chart"
                  width={600}
                  height={400}
                  className="w-full"
                />
              </div>
            </div>
            <div data-parallax-depth="-0.05" className="pt-6 z-10">
              <div className="mb-8 backdrop-blur-sm bg-gray-900/40 p-6 rounded-xl border-l-4 border-blue-500">
                <p className="text-xl text-gray-200">
                  The top meme in the current round has a <span className="text-blue-400 font-bold">43%</span> chance of winning!
                  If you invest <span className="text-green-400 font-bold">$1</span> worth of SUI and it wins, you'll receive <span className="text-green-400 font-bold">$2.32</span> worth
                  of Champion meme tokens! If it loses, you'll receive LOSER tokens.
                </p>
              </div>

              <div className="border-t border-gray-700 pt-6 mb-8">
                <div className="bg-gray-800/60 p-4 rounded-lg font-mono text-lg">
                  <p className="text-white">
                    Daytime (24H) &gt; DarkNight (1H)
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-blue-900/20 p-6 rounded-lg border-l-2 border-blue-400">
                  <h4 className="text-xl font-bold text-blue-300 mb-3">Daytime (24 H)</h4>
                  <p className="text-lg text-gray-200">
                    Elimination through <span className="text-yellow-400">price discovery</span> selects
                    8 finalists from countless meme coin candidates!
                  </p>
                  <p className="text-sm text-gray-400 mt-3">
                    Brier Score Dual SCPM AMM - Total win probability across all coins always equals 100%, with withdrawals allowed but with a time-based fee
                  </p>
                </div>
                
                <div className="bg-purple-900/20 p-6 rounded-lg border-l-2 border-purple-400">
                  <h4 className="text-xl font-bold text-purple-300 mb-3">DarkNight (1H)</h4>
                  <p className="text-lg text-gray-200">
                    Final hour of <span className="text-yellow-400">decisive voting</span>!
                    <span className="text-yellow-400 block mt-2">Real-time share positions are hidden</span> from all participants!
                  </p>
                  <p className="text-sm text-gray-400 mt-3">
                    TLE cryptography enables fully-private batch auctions - 5 rounds of 12 minutes each in a true psychological battle
                  </p>
                  <p className="text-lg text-red-400 font-semibold mt-3">
                    No withdrawals during DarkNight! A true battle royale with no turning back
                  </p>
                </div>
                
                <div className="bg-yellow-900/20 p-6 rounded-lg border-l-2 border-yellow-400">
                  <h4 className="text-xl font-bold text-yellow-300 mb-3">Sunrise (Immediately After)</h4>
                  <p className="text-lg text-gray-200">
                    <span className="text-yellow-400">Only one meme coin emerges victorious</span> and is officially launched!
                    All Battle AMM funds are automatically transferred to Champions AMM
                  </p>
                  <p className="text-sm text-gray-400 mt-3">
                    Winners receive the champion meme coin tokens, losers receive LOSER tokens proportional to their investment
                  </p>
                </div>
              </div>

              <div className="p-6 bg-gray-800/40 rounded-lg border border-gray-700 mt-8">
                <p className="text-gray-300 mb-2">Community unity is key to victory in this environment of incomplete information</p>
                <p className="text-xl font-bold text-white mb-2">
                  Defeat rival memes and aim for <span className="text-yellow-400">winner-takes-all</span>!
                </p>
                <p className="text-sm text-gray-400">
                  Secure an advantageous position with early participation, information superiority, and strategic choices
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Community Chat Section */}
        <section className="mb-28 bg-gradient-to-br from-gray-900 to-gray-800/60 rounded-2xl overflow-hidden shadow-xl min-h-[45vh]" data-lenis-scroll-snap-align="center">
          <div className="grid md:grid-cols-2 items-center">
            <div className="p-8" data-parallax-depth="0.05">
              <h2 className="text-3xl font-bold mb-5">
                Bump That
              </h2>
              <p className="text-xl mb-6 text-gray-300">
                Chat with the community and promote your convictions! The meme that rallies the most community support becomes the champion.
              </p>

              <div className="mb-8 p-4 bg-gray-800/70 rounded-lg">
                <h3 className="text-lg font-bold text-blue-300 mb-3">
                  On-Chain Paid Chat
                </h3>
                <ul className="list-disc pl-5 text-gray-300 space-y-2">
                  <li>Send messages by paying SUI</li>
                  <li>Display priority determined by payment amount</li>
                  <li>Influence others with strategic information</li>
                </ul>
              </div>

              <h3 className="text-2xl font-bold mb-6 text-white/90">
                Win the deadly game
              </h3>
              <Link
                href="/chat"
                className="inline-block px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg font-bold text-white hover:opacity-90 transition-all duration-300 hover:translate-y-[-2px] hover:shadow-lg"
              >
                Join the Community
              </Link>
            </div>
            <div className="relative h-full pin-container overflow-hidden" data-parallax-depth="-0.1">
              <div className="relative h-full max-h-[600px] pin-element">
                <Image
                  src="/images/community-chat.webp"
                  alt="BUMP.WIN Community Chat"
                  width={600}
                  height={600}
                  className="w-full h-full object-cover object-center"
                />
                <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-gray-900 to-transparent" />
              </div>
            </div>
          </div>
        </section>

        {/* Final Call to Action */}
        <section className="py-16 text-center min-h-[40vh] flex items-center justify-center" data-lenis-scroll-snap-align="end">
          <div className="max-w-4xl mx-auto space-y-8" data-parallax-depth="0.15">
            <div>
              <h2 className="text-5xl md:text-6xl font-bold text-white tracking-tight">
                Bet On The Tail.<br />
                Build Your Dream.
              </h2>

              <p className="text-xl text-gray-300 mt-8">
                Bet on your convictions. <span className="text-yellow-400">The coin you want to win can become the coin that wins.</span>
              </p>
            </div>

            <Link
              href="/rounds"
              className="inline-block px-10 py-4 bg-gradient-to-r from-yellow-500 via-amber-500 to-yellow-500 rounded-lg font-bold text-black text-xl hover:opacity-90 transition-all duration-300 hover:scale-105 hover:shadow-2xl"
            >
              You bet!
            </Link>
          </div>
        </section>
      </div>
    </AboutClient>
  );
}