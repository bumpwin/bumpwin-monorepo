import Image from 'next/image';
import Link from 'next/link';

export const metadata = {
  title: "About BUMP.WIN - Meme Coin Battle Royale",
  description: "Learn about BUMP.WIN, the ultimate meme coin battle platform.",
};

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-7xl">
      <section className="mb-16 flex flex-col md:flex-row items-center gap-12">
        <div className="md:w-1/2">
          <Image
            src="/images/last-one-standing.png"
            alt="Last One Standing - Meme Coin Battle"
            width={600}
            height={800}
            className="rounded-xl shadow-2xl"
            priority
          />
        </div>
        <div className="md:w-1/2 text-center md:text-left">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent">Squid Game Style</h1>
          <h2 className="text-3xl md:text-5xl font-bold mb-8 text-white">Meme Launchpad</h2>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto md:mx-0 text-gray-300">
            The ultimate meme coin battle royale platform where coins compete, users stake, and only one remains standing.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <Link href="/rounds" className="px-8 py-3 bg-gradient-to-r from-pink-500 to-purple-500 rounded-lg font-bold text-white hover:opacity-90 transition-opacity">
              Join The Battle
            </Link>
            <Link href="/create" className="px-8 py-3 bg-gray-700 rounded-lg font-bold text-white hover:bg-gray-600 transition-colors">
              Register Your Coin
            </Link>
          </div>
        </div>
      </section>

      {/* Slogan Section with Parallax Effect */}
      <section className="my-24 relative overflow-hidden rounded-2xl">
        <div className="absolute inset-0 overflow-hidden">
          <div
            className="w-full h-[120%] bg-fixed bg-center bg-cover opacity-15"
            style={{
              backgroundImage: "url('/images/last-one-standing.png')",
              transform: "translateY(-10%)"
            }}
          />
        </div>
        <div className="relative py-20 px-8 bg-gradient-to-r from-black/70 via-black/40 to-black/70">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <p className="text-2xl md:text-4xl font-bold leading-tight text-white">
              毎日数多くのミームコインはロンチされるでしょう
            </p>
            <p className="text-2xl md:text-4xl font-bold leading-tight text-yellow-400">
              でも 勝ち残るのは Market Capが最大の1つだけ！
            </p>
            <p className="text-2xl md:text-4xl font-bold leading-tight text-white">
              ほかの負けたミームコインはすべてバーンされます！
            </p>
            <div className="w-32 h-1 bg-gradient-to-r from-pink-500 to-purple-500 mx-auto mt-8" />
          </div>
        </div>
      </section>

      {/* Previous Champion Section */}
      <section className="mb-16 bg-gradient-to-br from-gray-900/80 to-gray-800/40 rounded-2xl overflow-hidden shadow-xl">
        <div className="grid md:grid-cols-5 items-center">
          <div className="md:col-span-2 p-8 md:p-10">
            <div className="relative aspect-[3/4] overflow-hidden rounded-xl shadow-2xl border border-indigo-500/30">
              <Image
                src="/images/mockmemes/JELL.png"
                alt="Previous Champion - BABLCT"
                fill
                className="object-cover"
                priority
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
          <div className="md:col-span-3 p-8 md:p-10">
            <div className="space-y-8">
              <div>
                <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-yellow-300 to-amber-500 bg-clip-text text-transparent">Winner Takes All.</h2>
                <p className="text-xl mb-2 text-gray-200 leading-relaxed">
                  バーンされたミームコインの価値はすべて
                </p>
                <p className="text-xl mb-6 text-gray-200 leading-relaxed font-semibold">
                  Champion Meme Coinが保有します
                </p>
              </div>

              <div>
                <h3 className="text-2xl font-bold mb-4 text-white">前回のChampion Memeはこちら</h3>

                <div className="bg-gray-800/50 border-l-4 border-yellow-500 pl-4 py-3 mb-8">
                  <p className="text-lg text-gray-300 leading-relaxed">
                    彼は118のミームコイン を焼き尽くし、
                  </p>
                  <p className="text-lg text-white font-semibold">
                    $114,514 のMarket Capを獲得しました
                  </p>
                </div>
              </div>

              <Link
                href="/champions/bablct"
                className="inline-block px-10 py-4 bg-gradient-to-r from-yellow-500 to-amber-600 rounded-lg font-bold text-black hover:opacity-90 transition-all duration-300 hover:scale-105 hover:shadow-lg"
              >
                Trade This Champ Now
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Slogan */}
      <section className="my-24 relative overflow-hidden rounded-2xl">
        <div className="absolute inset-0 overflow-hidden">
          <div
            className="w-full h-[120%] bg-fixed bg-center bg-cover opacity-10"
            style={{
              backgroundImage: "url('/images/mockmemes/JELL.png')",
              transform: "translateY(-5%)"
            }}
          />
        </div>
        <div className="relative py-16 px-8 bg-gradient-to-r from-black/80 via-purple-900/20 to-black/80">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-5xl font-bold mb-8 bg-gradient-to-r from-pink-400 to-purple-600 bg-clip-text text-transparent">
              あなたがぜひ次のChampion Memeをロンチしてください！
            </h2>
          </div>
        </div>
      </section>

      {/* Register Form Section */}
      <section className="mb-24 rounded-2xl overflow-hidden">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="p-6 md:p-10">
            <h2 className="text-3xl font-bold mb-6 text-white">次回以降のラウンドに<br />ミームコインをレジスタすることができます！</h2>
            <p className="text-xl mb-8 text-gray-300">
              簡単な登録プロセスで、あなたのミームコインを次のチャンピオンにする可能性を手に入れましょう。
            </p>
            <Link
              href="/create"
              className="inline-block px-10 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg font-bold text-white hover:opacity-90 transition-all duration-300 hover:scale-105 hover:shadow-lg"
            >
              今すぐコインを登録する
            </Link>
          </div>
          <div className="rounded-xl overflow-hidden shadow-2xl border border-indigo-500/20">
            <Image
              src="/images/register-form.png"
              alt="Register your meme coin"
              width={600}
              height={700}
              className="w-full"
            />
          </div>
        </div>
      </section>

      {/* Battle Rounds Explanation */}
      <section className="mb-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">ラウンドがはじまったら一斉にレース開始</h2>
          <p className="text-xl text-white mb-3">
            どのミームコインが勝つべきか、デスゲームのはじまりです！
          </p>
          <p className="text-xl font-bold text-yellow-400 mb-16">
            Bet on Beliefs.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div className="rounded-xl overflow-hidden shadow-xl border border-blue-500/20">
            <Image
              src="/images/prediction-chart.png"
              alt="Live prediction chart"
              width={600}
              height={500}
              className="w-full"
            />
          </div>
          <div>
            <div className="mb-8">
              <p className="text-xl mb-6 text-gray-200">
                現在開催中のラウンドのTop memeの勝率は 43%のChance!<br />
                もし $1をbetして実際に勝ち残ったら $2.32 価値相当の<br />
                Champion memeをあなたは受け取ることになるでしょう！
              </p>
            </div>

            <div className="border-t border-gray-700 pt-8 mb-8">
              <p className="text-xl font-semibold mb-4 text-white">
                ```<br />
                Daytime (24H) &gt; DarkNight (1H)<br />
                ```
              </p>
              <p className="text-lg mb-6 text-gray-300">
                バトルラウンドは 2つのフェーズで構成されます。<br />
                Daytime (24 H) + DarkNight (1H)
              </p>
            </div>

            <div className="space-y-4 mb-8">
              <p className="text-lg text-gray-300">
                Daytime (24 H) は 淘汰的な価格形成によって<br />
                無数のミームコインからファイナリスト8名を選出します！
              </p>
              <p className="text-lg text-gray-300">
                そして ラスト1時間 DarkNight (1H) では決選投票！<br />
                誰がどこにポジションを取っているかリアルタイムのシェアが隠されます！
              </p>
              <p className="text-lg text-gray-300">
                Withdraw不能！ ポジションの切り替えと積み増しだけができるのです！<br />
                不完全な情報のなかでコミュニティの団結しましょう！
              </p>
            </div>

            <p className="text-xl font-bold text-white">
              ライバルミームに勝ち切って、勝者総取りを目指してください！
            </p>
          </div>
        </div>
      </section>


      {/* Community Chat Section */}
      <section className="mb-24 bg-gradient-to-br from-gray-900 to-gray-800/60 rounded-2xl overflow-hidden shadow-xl">
        <div className="grid md:grid-cols-2 items-center">
          <div className="p-8 md:p-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Bump That</h2>
            <p className="text-xl mb-6 text-gray-300">
              Chatをしてコミュニティに<br />あなたの信念を押し出してください！
            </p>
            <p className="text-xl mb-10 text-gray-300">
              みんなを巻き込んだミームがチャンピオンになるのです。
            </p>
            <h3 className="text-2xl font-bold mb-8 text-white/90">Win the deadly game</h3>
            <Link
              href="/chat"
              className="inline-block px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg font-bold text-white hover:opacity-90 transition-all duration-300 hover:translate-y-[-2px] hover:shadow-lg"
            >
              Join the Community
            </Link>
          </div>
          <div className="relative h-full">
            <div className="relative md:absolute md:top-0 md:right-0 h-full w-full max-h-[600px] overflow-hidden">
              <Image
                src="/images/community-chat.png"
                alt="BUMP.WIN Community Chat"
                width={600}
                height={800}
                className="w-full h-full object-cover object-center rounded-tl-3xl"
                priority
              />
              <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-gray-900 to-transparent" />
            </div>
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="py-32 text-center">
        <div className="max-w-4xl mx-auto space-y-4">
          <h2 className="text-4xl md:text-6xl font-bold mb-6 text-white tracking-tight">
            Bet On The Tail.
          </h2>
          <h2 className="text-4xl md:text-6xl font-bold mb-16 text-white tracking-tight">
            Build Your Dream.
          </h2>

          <Link
            href="/rounds"
            className="inline-block px-12 py-5 bg-gradient-to-r from-yellow-500 via-amber-500 to-yellow-500 rounded-lg font-bold text-black text-xl hover:opacity-90 transition-all duration-300 hover:scale-105 hover:shadow-2xl"
          >
            You bet!
          </Link>
        </div>
      </section>
    </div>
  );
}