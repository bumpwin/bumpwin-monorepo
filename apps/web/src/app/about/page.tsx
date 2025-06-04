import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "BUMP.WIN - Bump. Survive. Win. Squid Game Style Meme Coin Battle Royale",
  description:
    "Only one meme coin survives. Rally community support, win the battle, and dominate the market.",
};

export default function AboutPage() {
  return (
    <div className="container mx-auto max-w-7xl px-4 pb-12">
      {/* Hero Section */}
      <section
        className="mt-20 mb-20 flex min-h-[80vh] flex-col items-center justify-center gap-12 md:flex-row"
        data-lenis-scroll-snap-align="start"
      >
        <div className="md:w-1/2" data-parallax-depth="-0.3">
          <Image
            src="/images/last-one-standing.png"
            alt="Last One Standing - Meme Coin Battle"
            width={600}
            height={450}
            className="w-full rounded-xl shadow-2xl"
          />
        </div>
        <div className="space-y-6 text-center md:w-1/2 md:text-left" data-parallax-depth="0.2">
          <h1 className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text font-bold text-5xl text-transparent md:text-6xl">
            Squid Game Style
            <span className="mt-2 block text-white">Meme Launchpad</span>
          </h1>
          <p className="text-gray-300 text-xl">
            Winner-takes-all meme coin battle royale.{" "}
            <span className="text-yellow-400">Only one winner</span> gets officially launched and
            acquires <span className="text-yellow-400">all the liquidity</span>.
          </p>
          <div className="pt-4">
            <Link
              href="/rounds"
              className="inline-block rounded-lg bg-gradient-to-r from-pink-500 to-purple-500 px-8 py-3 font-bold text-white transition-all duration-300 hover:translate-y-[-2px] hover:opacity-90 hover:shadow-lg"
            >
              Join the Battle
            </Link>
          </div>
        </div>
      </section>

      {/* Slogan Section */}
      <section
        className="relative my-24 h-[40vh] rounded-2xl"
        data-lenis-scroll-snap-align="center"
      >
        <div className="absolute inset-0 overflow-hidden">
          <div
            className="h-full w-full bg-center bg-cover opacity-15"
            style={{
              backgroundImage: "url('/images/last-one-standing.png')",
            }}
            data-parallax-depth="-0.4"
          />
        </div>
        <div className="relative flex h-full items-center bg-gradient-to-r from-black/70 via-black/40 to-black/70">
          <div className="mx-auto max-w-4xl space-y-6 px-4 text-center" data-parallax-depth="0.2">
            <p className="font-bold text-3xl text-white md:text-4xl">
              Countless meme coins launch every day
            </p>
            <p className="font-bold text-3xl text-yellow-400 md:text-4xl">
              But on BUMP.WIN,{" "}
              <span className="underline decoration-dashed">only one survives</span>!
            </p>
            <p className="font-bold text-2xl text-white md:text-3xl">
              All competing meme coins&apos; funds boost the winner&apos;s liquidity!
            </p>
            <div className="mx-auto mt-2 h-1 w-32 bg-gradient-to-r from-pink-500 to-purple-500" />
          </div>
        </div>
      </section>

      {/* Previous Champion Section */}
      <section
        className="relative mb-24 overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900/80 to-gray-800/40 p-8 shadow-xl"
        data-lenis-scroll-snap-align="center"
      >
        {/* Champion badge with glow effect */}
        <div className="absolute top-0 right-0 z-0 h-32 w-32 overflow-hidden rounded-bl-full bg-yellow-500/5" />
        <div className="absolute top-6 right-6 flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="mr-1 h-5 w-5 text-yellow-500"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M5.166 2.621v.858c-1.035.148-2.059.33-3.071.543a.75.75 0 00-.584.859 6.753 6.753 0 006.138 5.6 6.73 6.73 0 002.743 1.346A6.707 6.707 0 019.279 15H8.54c-1.036 0-1.875.84-1.875 1.875V19.5h-.75a2.25 2.25 0 00-2.25 2.25c0 .414.336.75.75.75h15a.75.75 0 00.75-.75 2.25 2.25 0 00-2.25-2.25h-.75v-2.625c0-1.036-.84-1.875-1.875-1.875h-.739a6.706 6.706 0 01-1.112-3.173 6.73 6.73 0 002.743-1.347 6.753 6.753 0 006.139-5.6.75.75 0 00-.585-.858 47.077 47.077 0 00-3.07-.543V2.62a.75.75 0 00-.658-.744 49.22 49.22 0 00-6.093-.377c-2.063 0-4.096.128-6.093.377a.75.75 0 00-.657.744zm0 2.629c0 1.196.312 2.32.857 3.294A5.266 5.266 0 013.16 5.337a45.6 45.6 0 012.006-.343v.256zm13.5 0v-.256c.674.1 1.343.214 2.006.343a5.265 5.265 0 01-2.863 3.207 6.72 6.72 0 00.857-3.294z"
              clipRule="evenodd"
            />
          </svg>
          <span className="font-bold text-sm text-yellow-400 uppercase tracking-wider">
            Hall of Fame
          </span>
        </div>

        <div className="relative z-10 grid items-center gap-8 md:grid-cols-5">
          <div className="sticky-container md:col-span-2" data-parallax-depth="0.1">
            <div className="sticky-element relative aspect-square overflow-hidden rounded-xl border border-indigo-500/30 shadow-2xl shadow-[0_0_30px_rgba(255,215,0,0.2)] transition-all duration-300 before:absolute before:inset-0 before:z-0 before:bg-gradient-to-t before:from-transparent before:to-yellow-500/10 before:content-[''] hover:scale-[1.02] hover:shadow-[0_0_40px_rgba(255,215,0,0.4)] md:aspect-[3/4]">
              <div className="-top-6 -right-6 absolute z-0 h-24 w-24 rounded-full bg-yellow-500/10 blur-xl" />
              <Image
                src="/images/mockmemes/JELL.png"
                alt="Previous Champion - JELL"
                width={400}
                height={500}
                className="relative z-10 h-full w-full object-cover"
              />
              <div className="absolute top-3 left-3 z-20 flex items-center rounded-lg bg-gradient-to-r from-yellow-500 to-amber-600 px-4 py-1 font-bold text-black text-sm uppercase tracking-wider shadow-lg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="mr-1 h-4 w-4"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.166 2.621v.858c-1.035.148-2.059.33-3.071.543a.75.75 0 00-.584.859 6.753 6.753 0 006.138 5.6 6.73 6.73 0 002.743 1.346A6.707 6.707 0 019.279 15H8.54c-1.036 0-1.875.84-1.875 1.875V19.5h-.75a2.25 2.25 0 00-2.25 2.25c0 .414.336.75.75.75h15a.75.75 0 00.75-.75 2.25 2.25 0 00-2.25-2.25h-.75v-2.625c0-1.036-.84-1.875-1.875-1.875h-.739a6.706 6.706 0 01-1.112-3.173 6.73 6.73 0 002.743-1.347 6.753 6.753 0 006.139-5.6.75.75 0 00-.585-.858 47.077 47.077 0 00-3.07-.543V2.62a.75.75 0 00-.658-.744 49.22 49.22 0 00-6.093-.377c-2.063 0-4.096.128-6.093.377a.75.75 0 00-.657.744zm0 2.629c0 1.196.312 2.32.857 3.294A5.266 5.266 0 013.16 5.337a45.6 45.6 0 012.006-.343v.256zm13.5 0v-.256c.674.1 1.343.214 2.006.343a5.265 5.265 0 01-2.863 3.207 6.72 6.72 0 00.857-3.294z"
                    clipRule="evenodd"
                  />
                </svg>
                Champion
              </div>
              <div className="absolute right-0 bottom-0 left-0 z-10 w-full bg-black/70 bg-gradient-to-t px-4 py-3 backdrop-blur-sm">
                <div className="-mb-1 font-bold text-2xl text-amber-400 tracking-wider">JELL</div>
                <div className="mb-2 text-gray-300 text-sm">Jello Cult</div>
                <div className="grid grid-cols-2 gap-1 border-gray-700 border-t pt-2">
                  <div>
                    <span className="block text-gray-400 text-xs">mcap </span>
                    <div className="flex items-center">
                      <span className="font-bold text-sm text-white">$0.00</span>
                      <span className="ml-1 text-green-400 text-xs">+0%</span>
                    </div>
                  </div>
                  <div>
                    <span className="block text-gray-400 text-xs">24h vol </span>
                    <div className="flex items-center">
                      <span className="font-bold text-sm text-white">$0.00</span>
                      <span className="ml-1 text-green-400 text-xs">+0%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="md:col-span-3" data-parallax-depth="-0.05">
            <div className="space-y-6">
              <h2 className="flex items-center bg-gradient-to-r from-yellow-300 to-amber-500 bg-clip-text font-bold text-4xl text-transparent">
                Winner Takes All
                <span className="ml-2 inline-block h-[3px] w-10 bg-gradient-to-r from-yellow-300 to-amber-500" />
              </h2>
              <p className="text-gray-200 text-xl">
                All liquidity from defeated competitors goes directly to the Champion Meme
                Coin&apos;s liquidity pool
              </p>

              <div className="mt-8">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="flex items-center font-bold text-2xl text-white">
                    <span className="mr-2 text-yellow-400">✦</span>
                    Previous Champion Showcase
                  </h3>
                  <span className="flex items-center rounded-full border border-yellow-500/30 bg-yellow-500/20 px-2.5 py-1 font-medium text-xs text-yellow-400">
                    <svg
                      className="mr-1 h-3 w-3 text-yellow-400"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm3.982 13.982a1 1 0 0 1-1.414 0l-3.274-3.274A1.012 1.012 0 0 1 9 10V6a1 1 0 0 1 2 0v3.586l2.982 2.982a1 1 0 0 1 0 1.414Z" />
                    </svg>
                    Round #7 Winner
                  </span>
                </div>

                <div className="mb-6 rounded-r-lg border-yellow-500 border-l-4 bg-gradient-to-r from-gray-800/80 to-gray-800/40 py-4 pl-4 shadow-inner">
                  <p className="text-gray-300 text-lg">
                    They defeated <span className="font-bold text-yellow-400">118</span> competing
                    meme coins and launched with a liquidity pool of{" "}
                    <span className="font-bold text-yellow-400">$114,514</span>
                  </p>
                </div>

                <div className="rounded-lg border border-yellow-500/30 bg-gradient-to-r from-yellow-900/30 to-yellow-900/10 p-5 shadow-[inset_0_1px_1px_rgba(255,215,0,0.1)]">
                  <p className="text-lg text-white">
                    With <span className="font-bold text-yellow-400">Champions AMM</span>, the
                    winning meme coin gains permanent liquidity backed by all funds invested during
                    the battle
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-4 pt-4 sm:flex-row">
                <Link
                  href="/champions/JELL"
                  className="inline-block rounded-lg bg-gradient-to-r from-yellow-500 to-amber-600 px-8 py-3.5 text-center font-bold text-black transition-all duration-300 hover:scale-[1.02] hover:opacity-90"
                >
                  Trade This Champ
                </Link>

                <Link
                  href="/champions"
                  className="inline-block flex items-center justify-center rounded-lg border border-yellow-500/30 bg-gray-800/70 px-8 py-3.5 font-bold text-yellow-400 transition-all duration-300 hover:border-yellow-500 hover:bg-gray-700"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="mr-2 h-5 w-5"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z"
                      clipRule="evenodd"
                    />
                  </svg>
                  View All Champions
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Visual Divider */}
      <div className="mx-auto my-28 max-w-4xl">
        <div className="h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent" />
      </div>

      {/* Call to Action */}
      <section
        className="relative my-24 h-[30vh] overflow-hidden rounded-2xl"
        data-lenis-scroll-snap-align="center"
      >
        <div className="pin-background absolute inset-0 overflow-hidden">
          <div
            className="h-full w-full bg-center bg-cover opacity-10"
            style={{
              backgroundImage: "url('/images/mockmemes/JELL.png')",
            }}
            data-parallax-pin="true"
            data-parallax-pin-offset="0.5"
          />
        </div>
        <div className="relative flex h-full items-center bg-gradient-to-r from-black/80 via-purple-900/20 to-black/80">
          <div className="mx-auto max-w-4xl px-8 py-8 text-center" data-parallax-depth="0.15">
            <h2 className="mb-6 bg-gradient-to-r from-pink-400 to-purple-600 bg-clip-text font-bold text-3xl text-transparent md:text-4xl">
              Launch the next Champion Meme coin!
            </h2>
            <p className="mb-6 text-white text-xl">
              Join the battle and make your meme the next champion
            </p>
            <Link
              href="/create"
              className="inline-block rounded-lg bg-gradient-to-r from-pink-500 to-purple-500 px-8 py-3 font-bold text-white transition-all duration-300 hover:translate-y-[-2px] hover:opacity-90 hover:shadow-lg"
            >
              Register Your Coin
            </Link>
          </div>
        </div>
      </section>

      {/* Register Form Section */}
      <section className="mb-28 overflow-hidden rounded-2xl" data-lenis-scroll-snap-align="center">
        <div className="grid items-center gap-8 md:grid-cols-2">
          <div className="p-6" data-parallax-depth="0.05">
            <h2 className="mb-6 font-bold text-3xl text-white">
              Register your meme coin
              <br />
              for upcoming battle rounds!
            </h2>
            <p className="mb-8 text-gray-300 text-xl">
              With a simple registration process, your meme coin could become the next champion.
              Registration opens 3 days before each round starts.
            </p>
            <Link
              href="/create"
              className="inline-block rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 px-8 py-3 font-bold text-white transition-all duration-300 hover:scale-105 hover:opacity-90 hover:shadow-lg"
            >
              Register Your Coin Now
            </Link>
          </div>
          <div
            className="overflow-hidden rounded-xl border border-indigo-500/20 shadow-2xl"
            data-parallax-depth="-0.05"
          >
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
      <div className="mx-auto my-48 max-w-xl px-4">
        <div className="flex items-center justify-center gap-4">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-700 to-gray-700" />
          <div className="text-center">
            <span className="inline-block rounded-full border border-gray-700 bg-gray-800/80 p-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-5 w-5 text-gray-400"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M4.848 2.771A49.144 49.144 0 0112 2.25c2.43 0 4.817.178 7.152.52 1.978.292 3.348 2.024 3.348 3.97v6.02c0 1.946-1.37 3.678-3.348 3.97a48.901 48.901 0 01-7.152.52c-2.43 0-4.817-.178-7.152-.52C2.87 16.438 1.5 14.706 1.5 12.76V6.741c0-1.946 1.37-3.68 3.348-3.97z"
                  clipRule="evenodd"
                />
                <path d="M7.5 8.25v6.75a.75.75 0 01-1.5 0V8.25a.75.75 0 011.5 0zM12 8.25v6.75a.75.75 0 01-1.5 0V8.25a.75.75 0 011.5 0zM16.5 8.25v6.75a.75.75 0 01-1.5 0V8.25a.75.75 0 011.5 0z" />
              </svg>
            </span>
          </div>
          <div className="h-px flex-1 bg-gradient-to-r from-gray-700 to-transparent" />
        </div>
      </div>

      {/* Battle Rounds Explanation */}
      <section
        className="battle-phases-section mb-28 min-h-screen"
        data-lenis-scroll-snap-align="center"
      >
        <div className="sticky top-[60px] z-30 bg-gradient-to-b from-black via-black/95 to-transparent pt-8 pb-4">
          <div className="text-center" data-parallax-depth="0.2">
            <h2 className="mb-4 bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text font-bold text-4xl text-transparent">
              When the Round Begins, the Race is On
            </h2>
            <p className="mx-auto max-w-3xl text-white text-xl">
              The deadly game begins to determine which meme coin will triumph!
              <span className="mt-2 block font-bold text-2xl text-yellow-400">Bet on Beliefs.</span>
            </p>
            <div className="mx-auto mt-4 h-1 w-32 bg-gradient-to-r from-blue-500 to-indigo-500" />
          </div>

          {/* Battle Phases Progress Bar */}
          <div className="battle-progress-container z-40 mx-auto mt-8 max-w-4xl">
            <div className="relative rounded-xl border border-gray-800 bg-gray-900/80 px-4 py-6 shadow-lg backdrop-blur">
              {/* Progress Bar Background */}
              <div className="-translate-y-1/2 absolute top-1/2 h-2 w-full transform rounded-full bg-gray-700" />

              {/* Active Progress Bar */}
              <div
                className="-translate-y-1/2 battle-progress-bar absolute top-1/2 h-2 transform rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-yellow-500"
                style={{ width: "43%" }}
              />

              {/* Phase Markers */}
              <div className="relative flex justify-between">
                {/* Daytime */}
                <div className="z-10 text-center">
                  <div className="phase-marker phase-daytime-marker mx-auto mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 shadow-lg">
                    <span className="font-bold text-sm text-white">1</span>
                  </div>
                  <p className="phase-label phase-daytime-label font-bold text-blue-400">Daytime</p>
                  <p className="text-gray-400 text-xs">24 Hours</p>
                </div>

                {/* DarkNight */}
                <div className="z-10 text-center">
                  <div className="phase-marker phase-darknight-marker mx-auto mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-purple-500 shadow-lg">
                    <span className="font-bold text-sm text-white">2</span>
                  </div>
                  <p className="phase-label phase-darknight-label font-bold text-purple-400">
                    DarkNight
                  </p>
                  <p className="text-gray-400 text-xs">1 Hour</p>
                </div>

                {/* Sunrise */}
                <div className="z-10 text-center">
                  <div className="phase-marker phase-sunrise-marker mx-auto mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-gray-600 shadow-lg">
                    <span className="font-bold text-sm text-white">3</span>
                  </div>
                  <p className="phase-label phase-sunrise-label font-bold text-gray-400">Sunrise</p>
                  <p className="text-gray-400 text-xs">Launch</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="relative mt-4 grid items-start gap-12 px-4 pt-24 md:grid-cols-2">
          <div className="relative top-[300px] z-20 h-auto w-full md:sticky">
            <div className="sticky-chart mt-40 transform overflow-hidden rounded-xl border border-blue-500/20 shadow-xl transition-all duration-500 hover:rotate-0">
              <Image
                src="/images/prediction-chart.png"
                alt="Live prediction chart"
                width={600}
                height={400}
                className="w-full"
              />
            </div>
          </div>
          <div data-parallax-depth="-0.05" className="z-10 pt-6">
            <div className="space-y-6">
              <div className="rounded-lg border-blue-400 border-l-2 bg-blue-900/20 p-6">
                <h4 className="mb-3 font-bold text-blue-300 text-xl">Daytime (24 H)</h4>
                <p className="text-gray-200 text-lg">
                  Elimination through <span className="text-yellow-400">price discovery</span>{" "}
                  selects 8 finalists from countless meme coin candidates!
                </p>
                <p className="mt-3 text-gray-400 text-sm">
                  Brier Score Dual SCPM AMM - Total win probability across all coins always equals
                  100%, with withdrawals allowed but with a time-based fee
                </p>
              </div>

              <div className="rounded-lg border-purple-400 border-l-2 bg-purple-900/20 p-6">
                <h4 className="mb-3 font-bold text-purple-300 text-xl">DarkNight (1H)</h4>
                <p className="text-gray-200 text-lg">
                  Final hour of <span className="text-yellow-400">decisive voting</span>!
                  <span className="mt-2 block text-yellow-400">
                    Real-time share positions are hidden
                  </span>{" "}
                  from all participants!
                </p>
                <p className="mt-3 text-gray-400 text-sm">
                  TLE cryptography enables fully-private batch auctions - 5 rounds of 12 minutes
                  each in a true psychological battle
                </p>
                <p className="mt-3 font-semibold text-lg text-red-400">
                  No withdrawals during DarkNight! A true battle royale with no turning back
                </p>
              </div>

              <div className="rounded-lg border-yellow-400 border-l-2 bg-yellow-900/20 p-6">
                <h4 className="mb-3 font-bold text-xl text-yellow-300">
                  Sunrise (Immediately After)
                </h4>
                <p className="text-gray-200 text-lg">
                  <span className="text-yellow-400">Only one meme coin emerges victorious</span> and
                  is officially launched! All Battle AMM funds are automatically transferred to
                  Champions AMM
                </p>
                <p className="mt-3 text-gray-400 text-sm">
                  Winners receive the champion meme coin tokens, losers receive LOSER tokens
                  proportional to their investment
                </p>
              </div>
            </div>

            <div className="mt-8 rounded-xl border-blue-500 border-l-4 bg-gray-900/40 p-6 backdrop-blur-sm">
              <p className="text-gray-200 text-xl">
                The top meme in the current round has a{" "}
                <span className="font-bold text-blue-400">43%</span> chance of winning! If you
                invest <span className="font-bold text-green-400">$1</span> worth of SUI and it
                wins, you&apos;ll receive <span className="font-bold text-green-400">$2.32</span>{" "}
                worth of Champion meme tokens! If it loses, you&apos;ll receive LOSER tokens.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Visual Topic Divider */}
      <div className="mx-auto my-36 max-w-xl px-4">
        <div className="flex items-center justify-center gap-4">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-700 to-gray-700" />
          <div className="text-center">
            <span className="inline-block rounded-full border border-gray-700 bg-gray-800/80 p-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-5 w-5 text-gray-400"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M4.848 2.771A49.144 49.144 0 0112 2.25c2.43 0 4.817.178 7.152.52 1.978.292 3.348 2.024 3.348 3.97v6.02c0 1.946-1.37 3.678-3.348 3.97a48.901 48.901 0 01-7.152.52c-2.43 0-4.817-.178-7.152-.52C2.87 16.438 1.5 14.706 1.5 12.76V6.741c0-1.946 1.37-3.68 3.348-3.97z"
                  clipRule="evenodd"
                />
                <path d="M7.5 8.25v6.75a.75.75 0 01-1.5 0V8.25a.75.75 0 011.5 0zM12 8.25v6.75a.75.75 0 01-1.5 0V8.25a.75.75 0 011.5 0zM16.5 8.25v6.75a.75.75 0 01-1.5 0V8.25a.75.75 0 011.5 0z" />
              </svg>
            </span>
          </div>
          <div className="h-px flex-1 bg-gradient-to-r from-gray-700 to-transparent" />
        </div>
      </div>

      {/* Community Chat Section */}
      <section
        className="mb-28 min-h-[45vh] overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800/60 shadow-xl"
        data-lenis-scroll-snap-align="center"
      >
        <div className="grid items-center md:grid-cols-2">
          <div className="p-8" data-parallax-depth="0.05">
            <h2 className="mb-5 bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text font-bold text-3xl text-transparent">
              Bump That
            </h2>
            <p className="mb-6 text-gray-300 text-xl">
              Chat with the community and rally support for your meme coin! In this battle of wits,
              community unity is key to victory in an environment of incomplete information.
            </p>

            <div className="mb-8 rounded-lg border-purple-500 border-l-4 bg-gray-800/70 p-5">
              <h3 className="mb-3 font-bold text-purple-300 text-xl">Strategic Communication</h3>
              <p className="mb-4 text-gray-200">
                Defeat rival memes and aim for{" "}
                <span className="text-yellow-400">winner-takes-all</span> through collective action!
              </p>
              <ul className="list-disc space-y-2 pl-5 text-gray-300">
                <li>Secure advantageous positions with early participation</li>
                <li>Gain information superiority through community insights</li>
                <li>Make strategic choices based on collective intelligence</li>
              </ul>
            </div>

            <h3 className="mb-6 font-bold text-2xl text-white/90">Win the deadly game together</h3>
            <Link
              href="/chat"
              className="inline-block rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 px-8 py-3 font-bold text-white transition-all duration-300 hover:translate-y-[-2px] hover:opacity-90 hover:shadow-lg"
            >
              Join the Community
            </Link>
          </div>
          <div className="pin-container relative h-full overflow-hidden" data-parallax-depth="-0.1">
            <div className="pin-element relative h-full max-h-[600px]">
              <Image
                src="/images/community-chat.webp"
                alt="BUMP.WIN Community Chat"
                width={600}
                height={600}
                className="h-full w-full object-cover object-center"
              />
              <div className="absolute right-0 bottom-0 left-0 h-1/3 bg-gradient-to-t from-gray-900 to-transparent" />
            </div>
          </div>
        </div>
      </section>

      {/* Visual Topic Divider */}
      <div className="mx-auto my-36 max-w-xl px-4">
        <div className="flex items-center justify-center gap-4">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-700 to-gray-700" />
          <div className="text-center">
            <span className="inline-block rounded-full border border-gray-700 bg-gray-800/80 p-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-5 w-5 text-gray-400"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M4.848 2.771A49.144 49.144 0 0112 2.25c2.43 0 4.817.178 7.152.52 1.978.292 3.348 2.024 3.348 3.97v6.02c0 1.946-1.37 3.678-3.348 3.97a48.901 48.901 0 01-7.152.52c-2.43 0-4.817-.178-7.152-.52C2.87 16.438 1.5 14.706 1.5 12.76V6.741c0-1.946 1.37-3.68 3.348-3.97z"
                  clipRule="evenodd"
                />
                <path d="M7.5 8.25v6.75a.75.75 0 01-1.5 0V8.25a.75.75 0 011.5 0zM12 8.25v6.75a.75.75 0 01-1.5 0V8.25a.75.75 0 011.5 0zM16.5 8.25v6.75a.75.75 0 01-1.5 0V8.25a.75.75 0 011.5 0z" />
              </svg>
            </span>
          </div>
          <div className="h-px flex-1 bg-gradient-to-r from-gray-700 to-transparent" />
        </div>
      </div>

      {/* Epic Final Call to Action */}
      <section
        className="relative mt-24 flex h-[90vh] items-center justify-center overflow-hidden"
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
        <div
          className="relative z-10 mx-auto max-w-4xl px-4 py-16 text-center"
          data-parallax-depth="0.1"
        >
          <div className="mb-12">
            <div className="mb-3 inline-block rounded-full border border-yellow-500/30 bg-yellow-500/10 px-6 py-2">
              <span className="font-bold text-sm text-yellow-400 uppercase tracking-wider">
                The Final Decision
              </span>
            </div>
            <h2 className="mb-6 font-bold text-5xl text-white tracking-tight drop-shadow-lg [text-shadow:_0_0_30px_rgba(255,255,255,0.2)] md:text-7xl">
              Bet On The Tail.
              <br />
              <span className="bg-gradient-to-r from-yellow-400 to-amber-500 bg-clip-text text-transparent">
                Build Your Dream.
              </span>
            </h2>
          </div>

          <div className="mt-10">
            <Link
              href="/rounds"
              className="inline-block rounded-xl bg-gradient-to-r from-yellow-500 via-amber-500 to-yellow-500 px-12 py-5 font-bold text-black text-xl transition-all duration-300 hover:scale-105 hover:opacity-90 hover:shadow-[0_0_40px_rgba(255,215,0,0.4)]"
            >
              You bet!
            </Link>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute right-0 bottom-8 left-0 text-center text-gray-500 text-sm">
          BUMP.WIN — Only One Coin Survives
        </div>
      </section>
    </div>
  );
}
