export default function ChatLayout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  return (
    <div className="h-screen">
      {children}
      {modal}
    </div>
  );
}
