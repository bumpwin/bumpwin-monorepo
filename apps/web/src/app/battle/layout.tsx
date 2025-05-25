import LayoutWithChat from "@/layouts/layout-with-chat";

export default function BattleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <LayoutWithChat>{children}</LayoutWithChat>;
}
