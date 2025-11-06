import ChatTopBar from "../components/chat/ChatTopBar";

export default function ChatLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="min-h-screen w-full bg-white">
      <ChatTopBar />
      <main className="min-h-[calc(100vh-3.5rem)] sm:min-h-[calc(100vh-4rem)]">{children}</main>
    </div>
  );
}


