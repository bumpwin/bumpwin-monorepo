import Image from 'next/image';
import Link from 'next/link';
import AboutClient from './client';

export const metadata = {
  title: "BUMP.WIN - Squid Game Style Meme Coin Battle Royale",
  description: "Only one meme coin survives. Rally community support, win the battle, and dominate the market.",
};

// Custom animation classes for scroll reveal - these will be applied by ParallaxScroller.tsx
const fadeInUp = "opacity-0 translate-y-10 transition-all duration-1000";
const fadeInLeft = "opacity-0 -translate-x-10 transition-all duration-1000";
const fadeInRight = "opacity-0 translate-x-10 transition-all duration-1000";
const fadeInScale = "opacity-0 scale-95 transition-all duration-1000";

export default function AboutPage() {
  return (
    <AboutClient>
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        {/* Hero Section */}
        <section className="mt-20 mb-20 flex flex-col md:flex-row items-center gap-12 min-h-[80vh] justify-center" data-lenis-scroll-snap-align="start">
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
        <section className="mb-24 bg-gradient-to-br from-gray-900/80 to-gray-800/40 rounded-2xl overflow-hidden shadow-xl p-8 relative" data-lenis-scroll-snap-align="center">
          {/* Champion badge with glow effect */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/5 rounded-bl-full overflow-hidden z-0" />
          <div className="absolute top-6 right-6 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-yellow-500 mr-1" aria-hidden="true">
              <path fillRule="evenodd" d="M5.166 2.621v.858c-1.035.148-2.059.33-3.071.543a.75.75 0 00-.584.859 6.753 6.753 0 006.138 5.6 6.73 6.73 0 002.743 1.346A6.707 6.707 0 019.279 15H8.54c-1.036 0-1.875.84-1.875 1.875V19.5h-.75a2.25 2.25 0 00-2.25 2.25c0 .414.336.75.75.75h15a.75.75 0 00.75-.75 2.25 2.25 0 00-2.25-2.25h-.75v-2.625c0-1.036-.84-1.875-1.875-1.875h-.739a6.706 6.706 0 01-1.112-3.173 6.73 6.73 0 002.743-1.347 6.753 6.753 0 006.139-5.6.75.75 0 00-.585-.858 47.077 47.077 0 00-3.07-.543V2.62a.75.75 0 00-.658-.744 49.22 49.22 0 00-6.093-.377c-2.063 0-4.096.128-6.093.377a.75.75 0 00-.657.744zm0 2.629c0 1.196.312 2.32.857 3.294A5.266 5.266 0 013.16 5.337a45.6 45.6 0 012.006-.343v.256zm13.5 0v-.256c.674.1 1.343.214 2.006.343a5.265 5.265 0 01-2.863 3.207 6.72 6.72 0 00.857-3.294z" clipRule="evenodd" />
            </svg>
            <span className="text-yellow-400 text-sm font-bold tracking-wider uppercase">Hall of Fame</span>
          </div>

          <div className="grid md:grid-cols-5 gap-8 items-center relative z-10">
            <div className="md:col-span-2 sticky-container" data-parallax-depth="0.1">
              <div className="relative aspect-square md:aspect-[3/4] overflow-hidden rounded-xl shadow-2xl border border-indigo-500/30 sticky-element
                hover:scale-[1.02] transition-all duration-300
                shadow-[0_0_30px_rgba(255,215,0,0.2)]
                hover:shadow-[0_0_40px_rgba(255,215,0,0.4)]
                before:content-[''] before:absolute before:inset-0 before:bg-gradient-to-t before:from-transparent before:to-yellow-500/10 before:z-0">
                <div className="absolute -top-6 -right-6 w-24 h-24 bg-yellow-500/10 rounded-full blur-xl z-0" />
                <Image
                  src="/images/mockmemes/JELL.png"
                  alt="Previous Champion - JELL"
                  width={400}
                  height={500}
                  className="w-full h-full object-cover relative z-10"
                />
                <div className="absolute top-3 left-3 bg-gradient-to-r from-yellow-500 to-amber-600 text-black font-bold py-1 px-4 rounded-lg text-sm uppercase tracking-wider flex items-center shadow-lg z-20">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 mr-1" aria-hidden="true">
                    <path fillRule="evenodd" d="M5.166 2.621v.858c-1.035.148-2.059.33-3.071.543a.75.75 0 00-.584.859 6.753 6.753 0 006.138 5.6 6.73 6.73 0 002.743 1.346A6.707 6.707 0 019.279 15H8.54c-1.036 0-1.875.84-1.875 1.875V19.5h-.75a2.25 2.25 0 00-2.25 2.25c0 .414.336.75.75.75h15a.75.75 0 00.75-.75 2.25 2.25 0 00-2.25-2.25h-.75v-2.625c0-1.036-.84-1.875-1.875-1.875h-.739a6.706 6.706 0 01-1.112-3.173 6.73 6.73 0 002.743-1.347 6.753 6.753 0 006.139-5.6.75.75 0 00-.585-.858 47.077 47.077 0 00-3.07-.543V2.62a.75.75 0 00-.658-.744 49.22 49.22 0 00-6.093-.377c-2.063 0-4.096.128-6.093.377a.75.75 0 00-.657.744zm0 2.629c0 1.196.312 2.32.857 3.294A5.266 5.266 0 013.16 5.337a45.6 45.6 0 012.006-.343v.256zm13.5 0v-.256c.674.1 1.343.214 2.006.343a5.265 5.265 0 01-2.863 3.207 6.72 6.72 0 00.857-3.294z" clipRule="evenodd" />
                  </svg>
                  Champion
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/70 to-transparent backdrop-blur-sm px-4 py-3 relative z-10">
                  <div className="text-2xl font-bold tracking-wider text-amber-400 -mb-1">BABLCT</div>
                  <div className="text-gray-300 text-sm mb-2">Babel Cult</div>
                  <div className="grid grid-cols-2 gap-1 border-t border-gray-700 pt-2">
                    <div>
                      <span className="text-gray-400 text-xs block">mcap </span>
                      <div className="flex items-center">
                        <span className="text-white text-sm font-bold">$0.00</span>
                        <span className="text-green-400 text-xs ml-1">+0%</span>
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-400 text-xs block">24h vol </span>
                      <div className="flex items-center">
                        <span className="text-white text-sm font-bold">$0.00</span>
                        <span className="text-green-400 text-xs ml-1">+0%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="md:col-span-3" data-parallax-depth="-0.05">
              <div className="space-y-6">
                <h2 className="text-4xl font-bold bg-gradient-to-r from-yellow-300 to-amber-500 bg-clip-text text-transparent flex items-center">
                  Winner Takes All
                  <span className="ml-2 inline-block w-10 h-[3px] bg-gradient-to-r from-yellow-300 to-amber-500" />
                </h2>
                <p className="text-xl text-gray-200">
                  All liquidity from defeated competitors goes directly to the Champion Meme Coin's liquidity pool
                </p>

                <div className="mt-8">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-2xl font-bold text-white flex items-center">
                      <span className="mr-2 text-yellow-400">✦</span>
                      Previous Champion Showcase
                    </h3>
                    <span className="bg-yellow-500/20 text-yellow-400 text-xs font-medium px-2.5 py-1 rounded-full border border-yellow-500/30 flex items-center">
                      <svg className="w-3 h-3 mr-1 text-yellow-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm3.982 13.982a1 1 0 0 1-1.414 0l-3.274-3.274A1.012 1.012 0 0 1 9 10V6a1 1 0 0 1 2 0v3.586l2.982 2.982a1 1 0 0 1 0 1.414Z" />
                      </svg>
                      Round #7 Winner
                    </span>
                  </div>

                  <div className="bg-gradient-to-r from-gray-800/80 to-gray-800/40 border-l-4 border-yellow-500 pl-4 py-4 mb-6 rounded-r-lg shadow-inner">
                    <p className="text-lg text-gray-300">
                      They defeated <span className="text-yellow-400 font-bold">118</span> competing meme coins and launched with a liquidity pool of <span className="text-yellow-400 font-bold">$114,514</span>
                    </p>
                  </div>

                  <div className="p-5 bg-gradient-to-r from-yellow-900/30 to-yellow-900/10 border border-yellow-500/30 rounded-lg shadow-[inset_0_1px_1px_rgba(255,215,0,0.1)]">
                    <p className="text-white text-lg">
                      With <span className="text-yellow-400 font-bold">Champions AMM</span>, the winning meme coin gains permanent liquidity
                      backed by all funds invested during the battle
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Link
                    href="/champions/bablct"
                    className="inline-block px-8 py-3.5 bg-gradient-to-r from-yellow-500 to-amber-600 rounded-lg font-bold text-black hover:opacity-90 transition-all duration-300 hover:scale-[1.02] text-center"
                  >
                    Trade This Champ
                  </Link>

                  <Link
                    href="/champions"
                    className="inline-block px-8 py-3.5 bg-gray-800/70 border border-yellow-500/30 rounded-lg font-bold text-yellow-400 hover:bg-gray-700 transition-all duration-300 hover:border-yellow-500 flex items-center justify-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 mr-2" aria-hidden="true">
                      <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
                    </svg>
                    View All Champions
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Visual Divider */}
        <div className="my-28 max-w-4xl mx-auto">
          <div className="h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent" />
        </div>

        {/* Call to Action */}
        <section className="my-24 relative rounded-2xl overflow-hidden h-[30vh]" data-lenis-scroll-snap-align="center">
          <div className="absolute inset-0 overflow-hidden pin-background">
            <div
              className="w-full h-full bg-center bg-cover opacity-10"
              style={{
                backgroundImage: "url('/images/mockmemes/BABLCT.png')"
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

        {/* Visual Topic Divider */}
        <div className="my-48 max-w-xl mx-auto px-4">
          <div className="flex items-center justify-center gap-4">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-700 to-gray-700" />
            <div className="text-center">
              <span className="inline-block p-3 bg-gray-800/80 rounded-full border border-gray-700">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-gray-400" aria-hidden="true">
                  <path fillRule="evenodd" d="M4.848 2.771A49.144 49.144 0 0112 2.25c2.43 0 4.817.178 7.152.52 1.978.292 3.348 2.024 3.348 3.97v6.02c0 1.946-1.37 3.678-3.348 3.97a48.901 48.901 0 01-7.152.52c-2.43 0-4.817-.178-7.152-.52C2.87 16.438 1.5 14.706 1.5 12.76V6.741c0-1.946 1.37-3.68 3.348-3.97z" clipRule="evenodd" />
                  <path d="M7.5 8.25v6.75a.75.75 0 01-1.5 0V8.25a.75.75 0 011.5 0zM12 8.25v6.75a.75.75 0 01-1.5 0V8.25a.75.75 0 011.5 0zM16.5 8.25v6.75a.75.75 0 01-1.5 0V8.25a.75.75 0 011.5 0z" />
                </svg>
              </span>
            </div>
            <div className="h-px flex-1 bg-gradient-to-r from-gray-700 to-transparent" />
          </div>
        </div>

        {/* Battle Rounds Explanation */}
        <section className="mb-28 battle-phases-section min-h-screen" data-lenis-scroll-snap-align="center">
          <div className="sticky top-[60px] pt-8 pb-4 bg-gradient-to-b from-black via-black/95 to-transparent z-30">
            <div className="text-center" data-parallax-depth="0.2">
              <h2 className={`text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent ${fadeInUp}`}>
                When the Round Begins, the Race is On
              </h2>
              <p className={`text-xl text-white max-w-3xl mx-auto ${fadeInUp}`}>
                The deadly game begins to determine which meme coin will triumph!
                <span className="block text-2xl font-bold text-yellow-400 mt-2">Bet on Beliefs.</span>
              </p>
              <div className="w-32 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 mx-auto mt-4" />
            </div>

            {/* Battle Phases Progress Bar */}
            <div className="max-w-4xl mx-auto mt-8 battle-progress-container z-40 transition-opacity duration-500">
              <div className="relative py-6 px-4 bg-gray-900/80 rounded-xl backdrop-blur shadow-lg border border-gray-800">
                {/* Progress Bar Background */}
                <div className="absolute h-2 bg-gray-700 rounded-full w-full top-1/2 transform -translate-y-1/2" />

                {/* Active Progress Bar */}
                <div className="absolute h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-yellow-500 rounded-full top-1/2 transform -translate-y-1/2 battle-progress-bar transition-all duration-300" style={{ width: '0%' }} />

                {/* Phase Markers */}
                <div className="relative flex justify-between">
                  {/* Daytime */}
                  <div className="z-10 text-center">
                    <div className="w-8 h-8 bg-gray-600 rounded-full mx-auto mb-2 flex items-center justify-center phase-marker phase-daytime-marker shadow-lg transition-all duration-300">
                      <span className="text-sm font-bold text-white">1</span>
                    </div>
                    <p className="text-gray-400 font-bold phase-label phase-daytime-label transition-all duration-300">Daytime</p>
                    <p className="text-xs text-gray-400">24 Hours</p>
                  </div>

                  {/* DarkNight */}
                  <div className="z-10 text-center">
                    <div className="w-8 h-8 bg-gray-600 rounded-full mx-auto mb-2 flex items-center justify-center phase-marker phase-darknight-marker shadow-lg transition-all duration-300">
                      <span className="text-sm font-bold text-white">2</span>
                    </div>
                    <p className="text-gray-400 font-bold phase-label phase-darknight-label transition-all duration-300">DarkNight</p>
                    <p className="text-xs text-gray-400">1 Hour</p>
                  </div>

                  {/* Sunrise */}
                  <div className="z-10 text-center">
                    <div className="w-8 h-8 bg-gray-600 rounded-full mx-auto mb-2 flex items-center justify-center phase-marker phase-sunrise-marker shadow-lg transition-all duration-300">
                      <span className="text-sm font-bold text-white">3</span>
                    </div>
                    <p className="text-gray-400 font-bold phase-label phase-sunrise-label transition-all duration-300">Sunrise</p>
                    <p className="text-xs text-gray-400">Launch</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-start relative pt-24 px-4 mt-4">
            <div className="relative md:sticky top-[300px] h-auto w-full z-20">
              <div className="mt-40 rounded-xl overflow-hidden shadow-xl border border-blue-500/20 transform hover:rotate-0 transition-all duration-500 sticky-chart transition-opacity duration-500">
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

              <div className="mt-8 backdrop-blur-sm bg-gray-900/40 p-6 rounded-xl border-l-4 border-blue-500">
                <p className="text-xl text-gray-200">
                  The top meme in the current round has a <span className="text-blue-400 font-bold">43%</span> chance of winning!
                  If you invest <span className="text-green-400 font-bold">$1</span> worth of SUI and it wins, you'll receive <span className="text-green-400 font-bold">$2.32</span> worth
                  of Champion meme tokens! If it loses, you'll receive LOSER tokens.
                </p>
              </div>

            </div>
          </div>
        </section>

        {/* Visual Topic Divider */}
        <div className="my-36 max-w-xl mx-auto px-4">
          <div className="flex items-center justify-center gap-4">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-700 to-gray-700" />
            <div className="text-center">
              <span className="inline-block p-3 bg-gray-800/80 rounded-full border border-gray-700">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-gray-400" aria-hidden="true">
                  <path fillRule="evenodd" d="M4.848 2.771A49.144 49.144 0 0112 2.25c2.43 0 4.817.178 7.152.52 1.978.292 3.348 2.024 3.348 3.97v6.02c0 1.946-1.37 3.678-3.348 3.97a48.901 48.901 0 01-7.152.52c-2.43 0-4.817-.178-7.152-.52C2.87 16.438 1.5 14.706 1.5 12.76V6.741c0-1.946 1.37-3.68 3.348-3.97z" clipRule="evenodd" />
                  <path d="M7.5 8.25v6.75a.75.75 0 01-1.5 0V8.25a.75.75 0 011.5 0zM12 8.25v6.75a.75.75 0 01-1.5 0V8.25a.75.75 0 011.5 0zM16.5 8.25v6.75a.75.75 0 01-1.5 0V8.25a.75.75 0 011.5 0z" />
                </svg>
              </span>
            </div>
            <div className="h-px flex-1 bg-gradient-to-r from-gray-700 to-transparent" />
          </div>
        </div>

        {/* Community Chat Section */}
        <section className="mb-28 bg-gradient-to-br from-gray-900 to-gray-800/60 rounded-2xl overflow-hidden shadow-xl min-h-[45vh]" data-lenis-scroll-snap-align="center">
          <div className="grid md:grid-cols-2 items-center">
            <div className="p-8" data-parallax-depth="0.05">
              <h2 className="text-3xl font-bold mb-5 bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
                Bump That
              </h2>
              <p className="text-xl mb-6 text-gray-300">
                Chat with the community and rally support for your meme coin! In this battle of wits, community unity is key to victory in an environment of incomplete information.
              </p>

              <div className="mb-8 p-5 bg-gray-800/70 rounded-lg border-l-4 border-purple-500">
                <h3 className="text-xl font-bold text-purple-300 mb-3">
                  Strategic Communication
                </h3>
                <p className="text-gray-200 mb-4">
                  Defeat rival memes and aim for <span className="text-yellow-400">winner-takes-all</span> through collective action!
                </p>
                <ul className="list-disc pl-5 text-gray-300 space-y-2">
                  <li>Secure advantageous positions with early participation</li>
                  <li>Gain information superiority through community insights</li>
                  <li>Make strategic choices based on collective intelligence</li>
                </ul>
              </div>

              <h3 className="text-2xl font-bold mb-6 text-white/90">
                Win the deadly game together
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

        {/* Visual Topic Divider */}
        <div className="my-36 max-w-xl mx-auto px-4">
          <div className="flex items-center justify-center gap-4">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-700 to-gray-700" />
            <div className="text-center">
              <span className="inline-block p-3 bg-gray-800/80 rounded-full border border-gray-700">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-gray-400" aria-hidden="true">
                  <path fillRule="evenodd" d="M4.848 2.771A49.144 49.144 0 0112 2.25c2.43 0 4.817.178 7.152.52 1.978.292 3.348 2.024 3.348 3.97v6.02c0 1.946-1.37 3.678-3.348 3.97a48.901 48.901 0 01-7.152.52c-2.43 0-4.817-.178-7.152-.52C2.87 16.438 1.5 14.706 1.5 12.76V6.741c0-1.946 1.37-3.68 3.348-3.97z" clipRule="evenodd" />
                  <path d="M7.5 8.25v6.75a.75.75 0 01-1.5 0V8.25a.75.75 0 011.5 0zM12 8.25v6.75a.75.75 0 01-1.5 0V8.25a.75.75 0 011.5 0zM16.5 8.25v6.75a.75.75 0 01-1.5 0V8.25a.75.75 0 011.5 0z" />
                </svg>
              </span>
            </div>
            <div className="h-px flex-1 bg-gradient-to-r from-gray-700 to-transparent" />
          </div>
        </div>

        {/* Epic Final Call to Action */}
        <section
          className="relative h-[90vh] flex items-center justify-center overflow-hidden mt-24"
          data-lenis-scroll-snap-align="end"
        >
          {/* Background Image with Overlay */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/happy-memes.png"
              alt="Happy Memes"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/70 to-black/90" />
          </div>

          {/* Content with Glow Effects */}
          <div className="relative z-10 max-w-4xl mx-auto text-center px-4 py-16" data-parallax-depth="0.1">
            <div className="mb-12">
              <div className="inline-block mb-3 px-6 py-2 bg-yellow-500/10 border border-yellow-500/30 rounded-full">
                <span className="text-yellow-400 font-bold tracking-wider uppercase text-sm">The Final Decision</span>
              </div>
              <h2 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight drop-shadow-lg [text-shadow:_0_0_30px_rgba(255,255,255,0.2)]">
                Bet On The Tail.<br />
                <span className="bg-gradient-to-r from-yellow-400 to-amber-500 bg-clip-text text-transparent">Build Your Dream.</span>
              </h2>
            </div>

            <div className="mt-10">
              <Link
                href="/rounds"
                className="inline-block px-12 py-5 bg-gradient-to-r from-yellow-500 via-amber-500 to-yellow-500 rounded-xl font-bold text-black text-xl hover:opacity-90 transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_rgba(255,215,0,0.4)]"
              >
                You bet!
              </Link>
            </div>
          </div>

          {/* Decorative Elements */}
          <div className="absolute bottom-8 left-0 right-0 text-center text-gray-500 text-sm">
            BUMP.WIN — Only One Coin Survives
          </div>
        </section>
      </div>
    </AboutClient>
  );
}