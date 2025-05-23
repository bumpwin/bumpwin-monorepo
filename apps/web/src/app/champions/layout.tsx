import LayoutWithChat from "@/app/layouts/layout-with-chat";

export default function ChampionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <LayoutWithChat>{children}</LayoutWithChat>;
}
