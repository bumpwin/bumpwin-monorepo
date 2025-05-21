"use client";

import React, { use, Suspense } from "react";

// 非同期データ取得関数
async function fetchData() {
  // 実際のAPIコールをシミュレート
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return { message: "React 19のuseフックを使用したデータ" };
}

// データプロミスを生成
const dataPromise = fetchData();

// useフックでプロミスを直接消費するコンポーネント
function DataDisplay() {
  // React 19のuseフックでプロミスを直接消費
  const data = use(dataPromise);

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-lg font-semibold">非同期データ:</h3>
      <p>{data.message}</p>
    </div>
  );
}

export default function AsyncDataFetcher() {
  return (
    <div className="max-w-md mx-auto my-8">
      <h2 className="text-xl font-bold mb-4">React 19 Async Data Example</h2>

      <Suspense fallback={<LoadingIndicator />}>
        <DataDisplay />
      </Suspense>
    </div>
  );
}

function LoadingIndicator() {
  return (
    <div className="flex justify-center items-center h-20 bg-gray-100 rounded-lg">
      <div className="animate-spin h-6 w-6 border-2 border-blue-500 rounded-full border-t-transparent" />
    </div>
  );
}
