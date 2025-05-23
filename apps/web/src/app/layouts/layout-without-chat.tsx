"use client";

export default function LayoutWithoutChat({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-[calc(100vh-var(--header-height))]">
      {/* メインコンテンツのみ */}
      <div className="w-full">{children}</div>
    </div>
  );
}
