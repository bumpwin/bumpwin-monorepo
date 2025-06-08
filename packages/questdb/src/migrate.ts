import { Effect } from "effect";
import { COINS_TABLE, DOMINANCE_TABLE } from "./models";
import { withConnEffect } from "./pool";

// ✅ Effect-based migration
export const migrateEffect = withConnEffect((client) =>
  Effect.gen(function* () {
    yield* Effect.tryPromise(() => client.query(COINS_TABLE));
    yield* Effect.tryPromise(() => client.query(DOMINANCE_TABLE));
    yield* Effect.log("✅ テーブルスキーマを確認／作成しました");
  }),
);

// ✅ Legacy Promise-based function (backward compatibility)
// TODO: Migrate callers to Effect version and remove this
export async function migrate() {
  await Effect.runPromise(migrateEffect);
}
