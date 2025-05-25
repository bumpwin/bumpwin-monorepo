import LayoutWithChat from "@/layouts/layout-with-chat";

export default function RoundsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <LayoutWithChat>{children}</LayoutWithChat>;
}
