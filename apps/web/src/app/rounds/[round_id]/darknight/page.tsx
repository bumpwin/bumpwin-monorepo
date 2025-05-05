export default async function DarkNightPage({
  params,
}: {
  params: Promise<{ round_id: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const resolvedParams = await params;
  const { round_id } = resolvedParams;

  return (
    <main className="min-h-screen bg-gray-900 p-4">
      <h1 className="text-2xl font-bold text-white">Dark Night Page</h1>
      <p className="text-gray-400">Round ID: {round_id}</p>
    </main>
  );
}
