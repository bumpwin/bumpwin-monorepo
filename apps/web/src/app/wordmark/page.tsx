import SquareWordmarkLogo from "@/components/branding/SquareWordmarkLogo";
import WordmarkLogo from "@/components/branding/WordmarkLogo";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Wordmark",
  description: "Wordmark page with Satoshi font",
};

export default function WordmarkPage() {
  return (
    <div className="min-h-screen bg-background pt-12 pb-28">
      {/* ページ先頭に縦並びロゴをスクエアな黒背景ボックスで中央寄せ */}
      <div className="my-8 flex justify-center">
        <SquareWordmarkLogo />
      </div>
      <div className="mx-auto max-w-7xl px-4">
        {/* 採用デザイン */}
        <div className="mb-16">
          <h2 className="mb-8 font-bold text-2xl text-white">採用デザイン</h2>
          <div className="rounded-lg bg-black/20 p-8">
            <div className="flex items-center gap-4">
              <span className="text-2xl text-white">正式採用</span>
              <WordmarkLogo />
            </div>
            <div className="mt-4 text-white/80">
              <p>カラーコード:</p>
              <ul className="ml-4 list-inside list-disc">
                <li>メインカラー: #9400D3 (ダークバイオレット)</li>
                <li>アクセントカラー: #FED201 (イエロー)</li>
              </ul>
              <p className="mt-4">特徴:</p>
              <ul className="ml-4 list-inside list-disc">
                <li>6pxの白抜き縁取りによる視認性の高さ</li>
                <li>ダークバイオレットによる高級感と神秘性</li>
                <li>イエローアクセントによる明るさと活力</li>
              </ul>
            </div>
          </div>
        </div>

        {/* フォントサイズバランス調整 */}
        <div className="mb-16">
          <h2 className="mb-8 font-bold text-2xl text-white">フォントサイズバランス調整</h2>
          <div className="grid grid-cols-3 gap-8">
            {/* パターンA: .WIN +6% */}
            <div className="rounded-lg bg-black/20 p-8">
              <h3 className="mb-4 font-bold text-white text-xl">パターンA: .WIN +6%</h3>
              <div className="flex items-center gap-4">
                <h1 className="font-extrabold font-satoshi text-6xl italic [transform:scaleX(0.8)]">
                  <span className="text-white [text-shadow:_6px_6px_0_#9400D3,_-6px_-6px_0_#9400D3,_6px_-6px_0_#9400D3,_-6px_6px_0_#9400D3]">
                    BUMP
                  </span>
                  <span className="relative top-[4px] text-[#FED201] text-[1.06em]">.WIN</span>
                </h1>
              </div>
              <p className="mt-4 text-white/80">目的: 重心調整、存在感UP</p>
            </div>

            {/* パターンB: .WIN +10% */}
            <div className="rounded-lg bg-black/20 p-8">
              <h3 className="mb-4 font-bold text-white text-xl">
                パターンB: .WIN +10%（正式採用）
              </h3>
              <div className="flex items-center gap-4">
                <WordmarkLogo />
              </div>
              <p className="mt-4 text-white/80">目的: より強い存在感、メッセージ性の強調</p>
            </div>

            {/* パターンC: .WIN +15% */}
            <div className="rounded-lg bg-black/20 p-8">
              <h3 className="mb-4 font-bold text-white text-xl">パターンC: .WIN +15%</h3>
              <div className="flex items-center gap-4">
                <h1 className="font-extrabold font-satoshi text-6xl italic [transform:scaleX(0.8)]">
                  <span className="text-white [text-shadow:_6px_6px_0_#9400D3,_-6px_-6px_0_#9400D3,_6px_-6px_0_#9400D3,_-6px_6px_0_#9400D3]">
                    BUMP
                  </span>
                  <span className="relative top-[4px] text-[#FED201] text-[1.15em]">.WIN</span>
                </h1>
              </div>
              <p className="mt-4 text-white/80">目的: 勝利のメッセージをより強く表現</p>
            </div>
          </div>
        </div>

        {/* 字詰め比較 */}
        <div className="mb-16">
          <h2 className="mb-8 font-bold text-2xl text-white">字詰め比較</h2>
          <div className="grid grid-cols-2 gap-8">
            {/* パターンB: ml-2px（現状） */}
            <div className="rounded-lg bg-black/20 p-8">
              <h3 className="mb-4 font-bold text-white text-xl">パターンB: ml-2px（現状）</h3>
              <div className="flex items-center gap-4">
                <WordmarkLogo marginLeft="2px" />
              </div>
              <p className="mt-4 text-white/80">目的: 適度な字詰め</p>
            </div>
            {/* パターンC: ml-0px（さらに詰める） */}
            <div className="rounded-lg bg-black/20 p-8">
              <h3 className="mb-4 font-bold text-white text-xl">
                パターンC: ml-0px（さらに詰める）
              </h3>
              <div className="flex items-center gap-4">
                <WordmarkLogo marginLeft="0px" />
              </div>
              <p className="mt-4 text-white/80">目的: 最大限に詰めた字詰め</p>
            </div>
          </div>
        </div>

        {/* 他のバリエーション */}
        <div className="grid grid-cols-3 gap-8">
          {/* 青紫系 */}
          <div className="flex flex-col gap-8">
            <h2 className="mb-4 font-bold text-white text-xl">青紫系</h2>
            <div className="flex flex-col gap-8">
              <div className="flex items-center gap-4">
                <span className="text-2xl text-white">1.</span>
                <h1 className="font-extrabold font-satoshi text-6xl italic [transform:scaleX(0.8)]">
                  <span className="text-[#483D8B]">BUMP</span>
                  <span className="text-[#FED201]">.WIN</span>
                </h1>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-2xl text-white">2.</span>
                <h1 className="font-extrabold font-satoshi text-6xl italic [transform:scaleX(0.8)]">
                  <span className="text-[#6A5ACD]">BUMP</span>
                  <span className="text-[#FED201]">.WIN</span>
                </h1>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-2xl text-white">3.</span>
                <h1 className="font-extrabold font-satoshi text-6xl italic [transform:scaleX(0.8)]">
                  <span className="text-[#7B68EE]">BUMP</span>
                  <span className="text-[#FED201]">.WIN</span>
                </h1>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-2xl text-white">4.</span>
                <h1 className="font-extrabold font-satoshi text-6xl italic [transform:scaleX(0.8)]">
                  <span className="text-[#4169E1]">BUMP</span>
                  <span className="text-[#FED201]">.WIN</span>
                </h1>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-2xl text-white">5.</span>
                <h1 className="font-extrabold font-satoshi text-6xl italic [transform:scaleX(0.8)]">
                  <span className="text-[#1E90FF]">BUMP</span>
                  <span className="text-[#FED201]">.WIN</span>
                </h1>
              </div>
            </div>
          </div>

          {/* 紫系 */}
          <div className="flex flex-col gap-8">
            <h2 className="mb-4 font-bold text-white text-xl">紫系</h2>
            <div className="flex flex-col gap-8">
              <div className="flex items-center gap-4">
                <span className="text-2xl text-white">6.</span>
                <h1 className="font-extrabold font-satoshi text-6xl italic [transform:scaleX(0.8)]">
                  <span className="text-[#4B0082]">BUMP</span>
                  <span className="text-[#FED201]">.WIN</span>
                </h1>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-2xl text-white">7.</span>
                <h1 className="font-extrabold font-satoshi text-6xl italic [transform:scaleX(0.8)]">
                  <span className="text-[#8A2BE2]">BUMP</span>
                  <span className="text-[#FED201]">.WIN</span>
                </h1>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-2xl text-white">8.</span>
                <h1 className="font-extrabold font-satoshi text-6xl italic [transform:scaleX(0.8)]">
                  <span className="text-[#9370DB]">BUMP</span>
                  <span className="text-[#FED201]">.WIN</span>
                </h1>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-2xl text-white">9.</span>
                <h1 className="font-extrabold font-satoshi text-6xl italic [transform:scaleX(0.8)]">
                  <span className="text-[#9400D3]">BUMP</span>
                  <span className="text-[#FED201]">.WIN</span>
                </h1>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-2xl text-white">10.</span>
                <h1 className="font-extrabold font-satoshi text-6xl italic [transform:scaleX(0.8)]">
                  <span className="text-[#9932CC]">BUMP</span>
                  <span className="text-[#FED201]">.WIN</span>
                </h1>
              </div>
            </div>
          </div>

          {/* マゼンタ系 */}
          <div className="flex flex-col gap-8">
            <h2 className="mb-4 font-bold text-white text-xl">マゼンタ系</h2>
            <div className="flex flex-col gap-8">
              <div className="flex items-center gap-4">
                <span className="text-2xl text-white">11.</span>
                <h1 className="font-extrabold font-satoshi text-6xl italic [transform:scaleX(0.8)]">
                  <span className="text-[#C71585]">BUMP</span>
                  <span className="text-[#FED201]">.WIN</span>
                </h1>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-2xl text-white">12.</span>
                <h1 className="font-extrabold font-satoshi text-6xl italic [transform:scaleX(0.8)]">
                  <span className="text-[#DB7093]">BUMP</span>
                  <span className="text-[#FED201]">.WIN</span>
                </h1>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-2xl text-white">13.</span>
                <h1 className="font-extrabold font-satoshi text-6xl italic [transform:scaleX(0.8)]">
                  <span className="text-[#FF1493]">BUMP</span>
                  <span className="text-[#FED201]">.WIN</span>
                </h1>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-2xl text-white">14.</span>
                <h1 className="font-extrabold font-satoshi text-6xl italic [transform:scaleX(0.8)]">
                  <span className="text-[#FF69B4]">BUMP</span>
                  <span className="text-[#FED201]">.WIN</span>
                </h1>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-2xl text-white">15.</span>
                <h1 className="font-extrabold font-satoshi text-6xl italic [transform:scaleX(0.8)]">
                  <span className="text-[#DDA0DD]">BUMP</span>
                  <span className="text-[#FED201]">.WIN</span>
                </h1>
              </div>
            </div>
          </div>
        </div>

        {/* 白抜き縁取りバージョン */}
        <div className="mt-16">
          <h2 className="mb-4 font-bold text-white text-xl">白抜き縁取りバージョン</h2>
          <div className="grid grid-cols-3 gap-8">
            <div className="flex flex-col gap-8">
              <div className="flex items-center gap-4">
                <span className="text-2xl text-white">1w.</span>
                <h1 className="font-extrabold font-satoshi text-6xl italic [transform:scaleX(0.8)]">
                  <span className="text-white [text-shadow:_2px_2px_0_#483D8B,_-2px_-2px_0_#483D8B,_2px_-2px_0_#483D8B,_-2px_2px_0_#483D8B]">
                    BUMP
                  </span>
                  <span className="text-[#FED201]">.WIN</span>
                </h1>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-2xl text-white">2w.</span>
                <h1 className="font-extrabold font-satoshi text-6xl italic [transform:scaleX(0.8)]">
                  <span className="text-white [text-shadow:_2px_2px_0_#6A5ACD,_-2px_-2px_0_#6A5ACD,_2px_-2px_0_#6A5ACD,_-2px_2px_0_#6A5ACD]">
                    BUMP
                  </span>
                  <span className="text-[#FED201]">.WIN</span>
                </h1>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-2xl text-white">3w.</span>
                <h1 className="font-extrabold font-satoshi text-6xl italic [transform:scaleX(0.8)]">
                  <span className="text-white [text-shadow:_2px_2px_0_#7B68EE,_-2px_-2px_0_#7B68EE,_2px_-2px_0_#7B68EE,_-2px_2px_0_#7B68EE]">
                    BUMP
                  </span>
                  <span className="text-[#FED201]">.WIN</span>
                </h1>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-2xl text-white">4w.</span>
                <h1 className="font-extrabold font-satoshi text-6xl italic [transform:scaleX(0.8)]">
                  <span className="text-white [text-shadow:_2px_2px_0_#4169E1,_-2px_-2px_0_#4169E1,_2px_-2px_0_#4169E1,_-2px_2px_0_#4169E1]">
                    BUMP
                  </span>
                  <span className="text-[#FED201]">.WIN</span>
                </h1>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-2xl text-white">5w.</span>
                <h1 className="font-extrabold font-satoshi text-6xl italic [transform:scaleX(0.8)]">
                  <span className="text-white [text-shadow:_2px_2px_0_#1E90FF,_-2px_-2px_0_#1E90FF,_2px_-2px_0_#1E90FF,_-2px_2px_0_#1E90FF]">
                    BUMP
                  </span>
                  <span className="text-[#FED201]">.WIN</span>
                </h1>
              </div>
            </div>

            <div className="flex flex-col gap-8">
              <div className="flex items-center gap-4">
                <span className="text-2xl text-white">6w.</span>
                <h1 className="font-extrabold font-satoshi text-6xl italic [transform:scaleX(0.8)]">
                  <span className="text-white [text-shadow:_2px_2px_0_#4B0082,_-2px_-2px_0_#4B0082,_2px_-2px_0_#4B0082,_-2px_2px_0_#4B0082]">
                    BUMP
                  </span>
                  <span className="text-[#FED201]">.WIN</span>
                </h1>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-2xl text-white">7w.</span>
                <h1 className="font-extrabold font-satoshi text-6xl italic [transform:scaleX(0.8)]">
                  <span className="text-white [text-shadow:_2px_2px_0_#8A2BE2,_-2px_-2px_0_#8A2BE2,_2px_-2px_0_#8A2BE2,_-2px_2px_0_#8A2BE2]">
                    BUMP
                  </span>
                  <span className="text-[#FED201]">.WIN</span>
                </h1>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-2xl text-white">8w.</span>
                <h1 className="font-extrabold font-satoshi text-6xl italic [transform:scaleX(0.8)]">
                  <span className="text-white [text-shadow:_2px_2px_0_#9370DB,_-2px_-2px_0_#9370DB,_2px_-2px_0_#9370DB,_-2px_2px_0_#9370DB]">
                    BUMP
                  </span>
                  <span className="text-[#FED201]">.WIN</span>
                </h1>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-2xl text-white">9w.</span>
                <h1 className="font-extrabold font-satoshi text-6xl italic [transform:scaleX(0.8)]">
                  <span className="text-white [text-shadow:_2px_2px_0_#9400D3,_-2px_-2px_0_#9400D3,_2px_-2px_0_#9400D3,_-2px_2px_0_#9400D3]">
                    BUMP
                  </span>
                  <span className="text-[#FED201]">.WIN</span>
                </h1>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-2xl text-white">10w.</span>
                <h1 className="font-extrabold font-satoshi text-6xl italic [transform:scaleX(0.8)]">
                  <span className="text-white [text-shadow:_2px_2px_0_#9932CC,_-2px_-2px_0_#9932CC,_2px_-2px_0_#9932CC,_-2px_2px_0_#9932CC]">
                    BUMP
                  </span>
                  <span className="text-[#FED201]">.WIN</span>
                </h1>
              </div>
            </div>

            <div className="flex flex-col gap-8">
              <div className="flex items-center gap-4">
                <span className="text-2xl text-white">11w.</span>
                <h1 className="font-extrabold font-satoshi text-6xl italic [transform:scaleX(0.8)]">
                  <span className="text-white [text-shadow:_2px_2px_0_#C71585,_-2px_-2px_0_#C71585,_2px_-2px_0_#C71585,_-2px_2px_0_#C71585]">
                    BUMP
                  </span>
                  <span className="text-[#FED201]">.WIN</span>
                </h1>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-2xl text-white">12w.</span>
                <h1 className="font-extrabold font-satoshi text-6xl italic [transform:scaleX(0.8)]">
                  <span className="text-white [text-shadow:_2px_2px_0_#DB7093,_-2px_-2px_0_#DB7093,_2px_-2px_0_#DB7093,_-2px_2px_0_#DB7093]">
                    BUMP
                  </span>
                  <span className="text-[#FED201]">.WIN</span>
                </h1>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-2xl text-white">13w.</span>
                <h1 className="font-extrabold font-satoshi text-6xl italic [transform:scaleX(0.8)]">
                  <span className="text-white [text-shadow:_2px_2px_0_#FF1493,_-2px_-2px_0_#FF1493,_2px_-2px_0_#FF1493,_-2px_2px_0_#FF1493]">
                    BUMP
                  </span>
                  <span className="text-[#FED201]">.WIN</span>
                </h1>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-2xl text-white">14w.</span>
                <h1 className="font-extrabold font-satoshi text-6xl italic [transform:scaleX(0.8)]">
                  <span className="text-white [text-shadow:_2px_2px_0_#FF69B4,_-2px_-2px_0_#FF69B4,_2px_-2px_0_#FF69B4,_-2px_2px_0_#FF69B4]">
                    BUMP
                  </span>
                  <span className="text-[#FED201]">.WIN</span>
                </h1>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-2xl text-white">15w.</span>
                <h1 className="font-extrabold font-satoshi text-6xl italic [transform:scaleX(0.8)]">
                  <span className="text-white [text-shadow:_2px_2px_0_#DDA0DD,_-2px_-2px_0_#DDA0DD,_2px_-2px_0_#DDA0DD,_-2px_2px_0_#DDA0DD]">
                    BUMP
                  </span>
                  <span className="text-[#FED201]">.WIN</span>
                </h1>
              </div>
            </div>
          </div>
        </div>

        {/* 9wの縁取り太さバリエーション */}
        <div className="mt-16">
          <h2 className="mb-4 font-bold text-white text-xl">9wの縁取り太さバリエーション</h2>
          <div className="grid grid-cols-3 gap-8">
            <div className="flex flex-col gap-8">
              <div className="flex items-center gap-4">
                <span className="text-2xl text-white">9w-1.</span>
                <h1 className="font-extrabold font-satoshi text-6xl italic [transform:scaleX(0.8)]">
                  <span className="text-white [text-shadow:_1px_1px_0_#9400D3,_-1px_-1px_0_#9400D3,_1px_-1px_0_#9400D3,_-1px_1px_0_#9400D3]">
                    BUMP
                  </span>
                  <span className="text-[#FED201]">.WIN</span>
                </h1>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-2xl text-white">9w-2.</span>
                <h1 className="font-extrabold font-satoshi text-6xl italic [transform:scaleX(0.8)]">
                  <span className="text-white [text-shadow:_2px_2px_0_#9400D3,_-2px_-2px_0_#9400D3,_2px_-2px_0_#9400D3,_-2px_2px_0_#9400D3]">
                    BUMP
                  </span>
                  <span className="text-[#FED201]">.WIN</span>
                </h1>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-2xl text-white">9w-3.</span>
                <h1 className="font-extrabold font-satoshi text-6xl italic [transform:scaleX(0.8)]">
                  <span className="text-white [text-shadow:_3px_3px_0_#9400D3,_-3px_-3px_0_#9400D3,_3px_-3px_0_#9400D3,_-3px_3px_0_#9400D3]">
                    BUMP
                  </span>
                  <span className="text-[#FED201]">.WIN</span>
                </h1>
              </div>
            </div>

            <div className="flex flex-col gap-8">
              <div className="flex items-center gap-4">
                <span className="text-2xl text-white">9w-4.</span>
                <h1 className="font-extrabold font-satoshi text-6xl italic [transform:scaleX(0.8)]">
                  <span className="text-white [text-shadow:_4px_4px_0_#9400D3,_-4px_-4px_0_#9400D3,_4px_-4px_0_#9400D3,_-4px_4px_0_#9400D3]">
                    BUMP
                  </span>
                  <span className="text-[#FED201]">.WIN</span>
                </h1>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-2xl text-white">9w-5.</span>
                <h1 className="font-extrabold font-satoshi text-6xl italic [transform:scaleX(0.8)]">
                  <span className="text-white [text-shadow:_5px_5px_0_#9400D3,_-5px_-5px_0_#9400D3,_5px_-5px_0_#9400D3,_-5px_5px_0_#9400D3]">
                    BUMP
                  </span>
                  <span className="text-[#FED201]">.WIN</span>
                </h1>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-2xl text-white">9w-6.</span>
                <h1 className="font-extrabold font-satoshi text-6xl italic [transform:scaleX(0.8)]">
                  <span className="text-white [text-shadow:_6px_6px_0_#9400D3,_-6px_-6px_0_#9400D3,_6px_-6px_0_#9400D3,_-6px_6px_0_#9400D3]">
                    BUMP
                  </span>
                  <span className="text-[#FED201]">.WIN</span>
                </h1>
              </div>
            </div>

            <div className="flex flex-col gap-8">
              <div className="flex items-center gap-4">
                <span className="text-2xl text-white">9w-7.</span>
                <h1 className="font-extrabold font-satoshi text-6xl italic [transform:scaleX(0.8)]">
                  <span className="text-white [text-shadow:_7px_7px_0_#9400D3,_-7px_-7px_0_#9400D3,_7px_-7px_0_#9400D3,_-7px_7px_0_#9400D3]">
                    BUMP
                  </span>
                  <span className="text-[#FED201]">.WIN</span>
                </h1>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-2xl text-white">9w-8.</span>
                <h1 className="font-extrabold font-satoshi text-6xl italic [transform:scaleX(0.8)]">
                  <span className="text-white [text-shadow:_8px_8px_0_#9400D3,_-8px_-8px_0_#9400D3,_8px_-8px_0_#9400D3,_-8px_8px_0_#9400D3]">
                    BUMP
                  </span>
                  <span className="text-[#FED201]">.WIN</span>
                </h1>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-2xl text-white">9w-9.</span>
                <h1 className="font-extrabold font-satoshi text-6xl italic [transform:scaleX(0.8)]">
                  <span className="text-white [text-shadow:_9px_9px_0_#9400D3,_-9px_-9px_0_#9400D3,_9px_-9px_0_#9400D3,_-9px_9px_0_#9400D3]">
                    BUMP
                  </span>
                  <span className="text-[#FED201]">.WIN</span>
                </h1>
              </div>
            </div>
          </div>
        </div>

        {/* 字詰めバリエーション比較 */}
        <div className="mb-16">
          <h2 className="mb-8 font-bold text-2xl text-white">字詰めバリエーション比較</h2>
          <div className="mb-8">
            <h3 className="mb-4 font-bold text-white text-xl">パターンB: .WIN +10%</h3>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-4">
                <span className="w-20 text-white">-3px</span>
                <WordmarkLogo marginLeft="-3px" />
              </div>
              <div className="flex items-center gap-4">
                <span className="w-20 text-white">-2px</span>
                <WordmarkLogo marginLeft="-2px" />
              </div>
              <div className="flex items-center gap-4">
                <span className="w-20 text-white">-1px</span>
                <WordmarkLogo marginLeft="-1px" />
              </div>
              <div className="flex items-center gap-4">
                <span className="w-20 text-white">0px</span>
                <WordmarkLogo marginLeft="0px" />
              </div>
              <div className="flex items-center gap-4">
                <span className="w-20 text-white">1px</span>
                <WordmarkLogo marginLeft="1px" />
              </div>
              <div className="flex items-center gap-4">
                <span className="w-20 text-white">2px</span>
                <WordmarkLogo marginLeft="2px" />
              </div>
              <div className="flex items-center gap-4">
                <span className="w-20 text-white">4px</span>
                <WordmarkLogo marginLeft="4px" />
              </div>
              <div className="flex items-center gap-4">
                <span className="w-20 text-white">unset</span>
                <WordmarkLogo marginLeft={undefined} />
              </div>
            </div>
          </div>
          <div>
            <h3 className="mb-4 font-bold text-white text-xl">パターンC: .WIN +15%</h3>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-4">
                <span className="w-32 text-white">dot -3px</span>
                <WordmarkLogo marginLeft="-3px" textSize="1.15em" dotMarginRight="-3px" />
              </div>
              <div className="flex items-center gap-4">
                <span className="w-32 text-white">dot -6px</span>
                <WordmarkLogo marginLeft="-3px" textSize="1.15em" dotMarginRight="-6px" />
              </div>
              <div className="flex items-center gap-4">
                <span className="w-32 text-white">dot -8px</span>
                <WordmarkLogo marginLeft="-3px" textSize="1.15em" dotMarginRight="-8px" />
              </div>
              <div className="flex items-center gap-4">
                <span className="w-32 text-white">dot -10px</span>
                <WordmarkLogo marginLeft="-3px" textSize="1.15em" dotMarginRight="-10px" />
              </div>
              <div className="flex items-center gap-4">
                <span className="w-32 text-white">dot -15px</span>
                <WordmarkLogo marginLeft="-3px" textSize="1.15em" dotMarginRight="-15px" />
              </div>
              <div className="flex items-center gap-4">
                <span className="w-32 text-white">dot -20px</span>
                <WordmarkLogo marginLeft="-3px" textSize="1.15em" dotMarginRight="-20px" />
              </div>
              <div className="flex items-center gap-4">
                <span className="w-32 text-white">dot -25px</span>
                <WordmarkLogo marginLeft="-3px" textSize="1.15em" dotMarginRight="-25px" />
              </div>
              <div className="flex items-center gap-4">
                <span className="w-32 text-white">dot -30px</span>
                <WordmarkLogo marginLeft="-3px" textSize="1.15em" dotMarginRight="-30px" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
