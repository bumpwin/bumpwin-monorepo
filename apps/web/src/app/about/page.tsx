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
        <section className="mb-20 md:mb-32 flex flex-col md:flex-row items-center gap-12 min-h-[90vh] justify-center" data-lenis-scroll-snap-align="start">
          <div className="md:w-1/2" data-parallax-depth="-0.3">
            <img
              src="/images/last-one-standing.png"
              alt="Last One Standing - Meme Coin Battle"
              className="rounded-xl shadow-2xl w-full"
            />
          </div>
          <div className="md:w-1/2 text-center md:text-left" data-parallax-depth="0.2">
            <h1 className="text-4xl md:text-6xl xl:text-7xl font-bold mb-6 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent">Squid Game Style</h1>
            <h2 className="text-3xl md:text-5xl xl:text-6xl font-bold mb-8 text-white">Meme Launchpad</h2>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto md:mx-0 text-gray-300">
              Winner-takes-all meme coin battle royale. <span className="text-yellow-400">Only one winner</span> gets officially launched and acquires <span className="text-yellow-400">all the liquidity</span>.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <a href="/rounds" className="px-8 py-3 bg-gradient-to-r from-pink-500 to-purple-500 rounded-lg font-bold text-white hover:opacity-90 transition-all duration-300 hover:translate-y-[-2px] hover:shadow-lg">
                Join the Battle
              </a>
              <a href="/create" className="px-8 py-3 bg-gray-700 rounded-lg font-bold text-white hover:bg-gray-600 transition-colors">
                Register Your Coin
              </a>
            </div>
          </div>
        </section>

        {/* Slogan Section with Enhanced Parallax Effect */}
        <section className="my-32 relative overflow-hidden rounded-2xl h-[60vh]" data-lenis-scroll-snap-align="center">
          <div className="absolute inset-0 overflow-hidden parallax-container">
            <div
              className="w-full h-[140%] bg-center bg-cover opacity-15 parallax-bg will-change-transform"
              style={{
                backgroundImage: "url('/images/last-one-standing.png')",
                transform: "translateY(-10%) translateZ(0)"
              }}
              data-parallax-depth="-0.4"
              data-parallax-offset="0"
            />
          </div>
          <div className="relative py-20 px-8 bg-gradient-to-r from-black/70 via-black/40 to-black/70 h-full flex items-center">
            <div className="max-w-4xl mx-auto text-center space-y-6 parallax-content" data-parallax-depth="0.2">
              <p className="text-2xl md:text-4xl font-bold leading-tight text-white">
                Countless meme coins launch every day
              </p>
              <p className="text-2xl md:text-4xl font-bold leading-tight text-yellow-400">
                But on BUMP.WIN, <span className="underline decoration-dashed">only one survives</span>!
              </p>
              <p className="text-2xl md:text-4xl font-bold leading-tight text-white">
                All other competing meme coins don't launch, and their funds boost the winner's liquidity!
              </p>
              <div className="w-32 h-1 bg-gradient-to-r from-pink-500 to-purple-500 mx-auto mt-8" />
            </div>
          </div>
        </section>

        {/* Previous Champion Section */}
        <section className="mb-28 bg-gradient-to-br from-gray-900/80 to-gray-800/40 rounded-2xl overflow-hidden shadow-xl" data-lenis-scroll-snap-align="center">
          <div className="grid md:grid-cols-5 items-center">
            <div className="md:col-span-2 p-8 md:p-10 sticky-container" data-parallax-depth="0.1">
              <div className="relative aspect-[3/4] overflow-hidden rounded-xl shadow-2xl border border-indigo-500/30 sticky-element">
                <img
                  src="/images/mockmemes/JELL.png"
                  alt="Previous Champion - BABLCT"
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-black/70 backdrop-blur-sm p-4">
                  <div className="text-3xl font-bold tracking-wider mb-1">BABLCT</div>
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
            <div className="md:col-span-3 p-8 md:p-10" data-parallax-depth="-0.05">
              <div className="space-y-8">
                <div>
                  <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-yellow-300 to-amber-500 bg-clip-text text-transparent">Winner Takes All.</h2>
                  <p className="text-xl mb-2 text-gray-200 leading-relaxed">
                    All liquidity from defeated competitors
                  </p>
                  <p className="text-xl mb-6 text-gray-200 leading-relaxed font-semibold">
                    goes directly to the Champion Meme Coin's liquidity pool
                  </p>
                </div>

                <div>
                  <h3 className="text-2xl font-bold mb-4 text-white">Previous Champion Showcase</h3>

                  <div className="bg-gray-800/50 border-l-4 border-yellow-500 pl-4 py-3 mb-8">
                    <p className="text-lg text-gray-300 leading-relaxed">
                      They defeated 118 competing meme coins
                    </p>
                    <p className="text-lg text-white font-semibold">
                      and launched with a liquidity pool of $114,514
                    </p>
                  </div>

                  <div className="p-4 bg-yellow-900/20 border border-yellow-500/30 rounded-lg mb-6">
                    <p className="text-white text-lg">
                      With <span className="text-yellow-400 font-bold">Champions AMM</span>, the winning meme coin gains permanent liquidity<br />
                      backed by all funds invested during the battle
                    </p>
                  </div>
                </div>

                <a
                  href="/champions/bablct"
                  className="inline-block px-10 py-4 bg-gradient-to-r from-yellow-500 to-amber-600 rounded-lg font-bold text-black hover:opacity-90 transition-all duration-300 hover:scale-105 hover:shadow-lg"
                >
                  Trade This Champ Now
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action Slogan with Advanced Parallax Effect */}
        <section className="my-32 relative overflow-hidden rounded-2xl h-[50vh]" data-lenis-scroll-snap-align="center">
          <div className="absolute inset-0 overflow-hidden pin-background">
            <div
              className="w-full h-[130%] bg-center bg-cover opacity-10 parallax-pin will-change-transform"
              style={{
                backgroundImage: "url('/images/mockmemes/JELL.png')",
                transform: "translateY(-5%) translateZ(0)"
              }}
              data-parallax-pin="true"
              data-parallax-pin-offset="0.5"
            />
          </div>
          <div className="relative h-full flex items-center bg-gradient-to-r from-black/80 via-purple-900/20 to-black/80">
            <div className="max-w-4xl mx-auto text-center py-16 px-8 parallax-content-reverse" data-parallax-depth="0.15">
              <h2 className="text-3xl md:text-5xl font-bold mb-8 bg-gradient-to-r from-pink-400 to-purple-600 bg-clip-text text-transparent">
                Launch the next Champion Meme coin!
              </h2>
            </div>
          </div>
        </section>

        {/* Register Form Section with Enhanced Dimension Separation */}
        <section className="mb-32 rounded-2xl overflow-hidden parallax-section" data-lenis-scroll-snap-align="center">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="p-6 md:p-10 parallax-layer" data-parallax-depth="0.05">
              <h2 className="text-3xl font-bold mb-6 text-white">Register your meme coin<br />for upcoming battle rounds!</h2>
              <p className="text-xl mb-8 text-gray-300">
                With a simple registration process, your meme coin could become the next champion. Registration opens 3 days before each round starts.
              </p>
              <a
                href="/create"
                className="inline-block px-10 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg font-bold text-white hover:opacity-90 transition-all duration-300 hover:scale-105 hover:shadow-lg"
              >
                Register Your Coin Now
              </a>
            </div>
            <div className="rounded-xl overflow-hidden shadow-2xl border border-indigo-500/20 parallax-layer" data-parallax-depth="-0.05">
              <div className="parallax-image-container">
                <img
                  src="/images/register-form.png"
                  alt="Register your meme coin"
                  className="w-full parallax-image"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Battle Rounds Explanation */}
        <section className="mb-32" data-lenis-scroll-snap-align="center">
          <div className="text-center mb-16 parallax-text" data-parallax-depth="0.2">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">When the Round Begins, the Race is On</h2>
            <div className="max-w-3xl mx-auto">
              <p className="text-xl text-white mb-3">
                The deadly game begins to determine which meme coin will triumph!
              </p>
              <p className="text-2xl font-bold text-yellow-400 mb-8">
                Bet on Beliefs.
              </p>
              <div className="w-32 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 mx-auto mt-4" />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="rounded-xl overflow-hidden shadow-xl border border-blue-500/20 transform md:rotate-1 hover:rotate-0 transition-transform duration-500 sticky-chart" data-parallax-depth="0.1">
              <div className="parallax-chart-container will-change-transform">
                <img
                  src="/images/prediction-chart.png"
                  alt="Live prediction chart"
                  className="w-full"
                />
              </div>
            </div>
            <div data-parallax-depth="-0.05">
              <div className="mb-10 backdrop-blur-sm bg-gray-900/40 p-6 rounded-xl border-l-4 border-blue-500">
                <p className="text-xl mb-6 text-gray-200">
                  The top meme in the current round has a <span className="text-blue-400 font-bold">43%</span> chance of winning!<br />
                  If you invest <span className="text-green-400 font-bold">$1</span> worth of SUI and it wins, you'll receive <span className="text-green-400 font-bold">$2.32</span> worth<br />
                  of Champion meme tokens! If it loses, you'll receive LOSER tokens.
                </p>
              </div>

              <div className="border-t border-gray-700 pt-8 mb-10">
                <div className="bg-gray-800/60 p-5 rounded-lg font-mono text-lg mb-6">
                  <p className="text-white">
                    Daytime (24H) &gt; DarkNight (1H)
                  </p>
                </div>
                <p className="text-lg mb-6 text-gray-300">
                  Battle rounds consist of <span className="font-bold">two phases</span>:<br />
                  <span className="text-blue-300 font-semibold">Daytime (24 H)</span> + <span className="text-purple-300 font-semibold">DarkNight (1H)</span>
                </p>
              </div>

              <div className="space-y-6 mb-10">
                <div className="bg-blue-900/20 p-4 rounded-lg border-l-2 border-blue-400">
                  <h4 className="text-lg font-bold text-blue-300 mb-2">Daytime (24 H)</h4>
                  <p className="text-lg text-gray-200">
                    Elimination through <span className="text-yellow-400">price discovery</span> selects<br />
                    8 finalists from countless meme coin candidates!
                  </p>
                  <p className="text-sm text-gray-400 mt-2">
                    Brier Score Dual SCPM AMM - Total win probability across all coins always equals 100%, with withdrawals allowed but with a time-based fee
                  </p>
                </div>
                <div className="bg-purple-900/20 p-4 rounded-lg border-l-2 border-purple-400">
                  <h4 className="text-lg font-bold text-purple-300 mb-2">DarkNight (1H)</h4>
                  <p className="text-lg text-gray-200">
                    Final hour of <span className="text-yellow-400">decisive voting</span>!<br />
                    <span className="text-yellow-400">Real-time share positions are hidden</span> from all participants!
                  </p>
                  <p className="text-sm text-gray-400 mt-2">
                    TLE cryptography enables fully-private batch auctions - 5 rounds of 12 minutes each in a true psychological battle
                  </p>
                </div>
                <div className="bg-red-900/20 p-4 rounded-lg border-l-2 border-red-400">
                  <h4 className="text-lg font-bold text-red-300 mb-2">Rule Constraints</h4>
                  <p className="text-lg text-gray-200">
                    <span className="text-red-400 font-semibold">No withdrawals during DarkNight!</span> A true battle royale with no turning back<br />
                    <span className="text-gray-300">Community unity is key to victory in this environment of incomplete information</span>
                  </p>
                </div>
              </div>

              <div className="p-4 bg-gray-800/40 rounded-lg border border-gray-700">
                <p className="text-xl font-bold text-white text-center md:text-left">
                  Defeat rival memes and aim for <span className="text-yellow-400">winner-takes-all</span>!
                </p>
                <p className="text-sm text-gray-400 mt-2 text-center md:text-left">
                  Secure an advantageous position with early participation, information superiority, and strategic choices
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Community Chat Section with Pinned Image Effect */}
        <section className="mb-32 bg-gradient-to-br from-gray-900 to-gray-800/60 rounded-2xl overflow-hidden shadow-xl pin-section" data-lenis-scroll-snap-align="center">
          <div className="grid md:grid-cols-2 items-center">
            <div className="p-8 md:p-12 parallax-content-offset" data-parallax-depth="0.05">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Bump That</h2>
              <p className="text-xl mb-6 text-gray-300">
                Chat with the community and<br />promote your convictions!
              </p>
              <p className="text-xl mb-6 text-gray-300">
                The meme that rallies the most community support becomes the champion.
              </p>

              <div className="mb-8 p-4 bg-gray-800/70 rounded-lg">
                <h3 className="text-lg font-bold text-blue-300 mb-2">On-Chain Paid Chat</h3>
                <ul className="list-disc pl-5 text-gray-300 space-y-2">
                  <li>Send messages by paying SUI</li>
                  <li>Display priority determined by payment amount</li>
                  <li>Influence others with strategic information</li>
                </ul>
              </div>

              <h3 className="text-2xl font-bold mb-8 text-white/90">Win the deadly game</h3>
              <a
                href="/chat"
                className="inline-block px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg font-bold text-white hover:opacity-90 transition-all duration-300 hover:translate-y-[-2px] hover:shadow-lg"
              >
                Join the Community
              </a>
            </div>
            <div className="relative h-full pin-container" data-parallax-depth="-0.1">
              <div className="relative md:absolute md:top-0 md:right-0 h-full w-full max-h-[600px] overflow-hidden pin-element will-change-transform">
                <img
                  src="/images/community-chat.png"
                  alt="BUMP.WIN Community Chat"
                  className="w-full h-full object-cover object-center rounded-tl-3xl"
                />
                <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-gray-900 to-transparent" />
              </div>
            </div>
          </div>
        </section>

        {/* Final Call to Action */}
        <section className="py-32 text-center pin-section-final" data-lenis-scroll-snap-align="end">
          <div className="max-w-4xl mx-auto space-y-4 parallax-layer-final" data-parallax-depth="0.15">
            <h2 className="text-4xl md:text-6xl xl:text-7xl font-bold mb-6 text-white tracking-tight">
              Bet On The Tail.
            </h2>
            <h2 className="text-4xl md:text-6xl xl:text-7xl font-bold mb-8 text-white tracking-tight">
              Build Your Dream.
            </h2>

            <p className="text-xl text-gray-300 mb-12">
              Bet on your convictions. <span className="text-yellow-400">The coin you want to win can become the coin that wins.</span>
            </p>

            <a
              href="/rounds"
              className="inline-block px-12 py-5 bg-gradient-to-r from-yellow-500 via-amber-500 to-yellow-500 rounded-lg font-bold text-black text-xl hover:opacity-90 transition-all duration-300 hover:scale-105 hover:shadow-2xl"
            >
              You bet!
            </a>
          </div>
        </section>

      </div>
    </AboutClient>
  );
}