import LayoutWithoutChat from "@/layouts/layout-without-chat";

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <LayoutWithoutChat>{children}</LayoutWithoutChat>;
}
