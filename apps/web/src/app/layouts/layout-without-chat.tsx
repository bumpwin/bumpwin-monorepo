"use client";

export default function LayoutWithoutChat({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="w-full">{children}</div>
    </div>
  );
}
