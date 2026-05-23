import TabBar from "@/components/tab-bar";

export default function TabLayout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  return (
    <div>
      {modal}
      {children}
      <TabBar />
    </div>
  );
}
