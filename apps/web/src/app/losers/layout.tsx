import LayoutWithoutChat from "@/app/layouts/layout-without-chat";

export default function LosersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <LayoutWithoutChat>{children}</LayoutWithoutChat>;
}
