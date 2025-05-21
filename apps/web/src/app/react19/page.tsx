import AsyncDataFetcher from "@/components/AsyncDataFetcher";
import OptimisticUpdates from "@/components/OptimisticUpdates";
import React19Form from "@/components/React19Form";

export default function React19Page() {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">React 19 Features</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-semibold mb-4">
            非同期データ取得 (useフック)
          </h2>
          <AsyncDataFetcher />
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-4">
            Server Actions & Form Status
          </h2>
          <React19Form />
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-4">Optimistic Updates</h2>
          <OptimisticUpdates />
        </div>
      </div>
    </div>
  );
}
