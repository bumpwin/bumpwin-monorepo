import BattleClock from "@/components/BattleClock";
import { ChampionCoinList } from "@/components/ChampionCoinList";
import { CoinList } from "@/components/CoinList";

export default function Home() {
	return (
		<div>
			<BattleClock totalSeconds={15} challengeSeconds={5} />
			<ChampionCoinList />
			<CoinList />
		</div>
	);
}
