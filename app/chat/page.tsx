import { Suspense } from "react";
import ChatPageClient from "./ChatPageClient";

export const dynamic = "force-dynamic";

export default function ChatPage() {
  return (
    <Suspense fallback={<div className="flex h-[50vh] items-center justify-center text-sm text-gray-500">Loading chat...</div>}>
      <ChatPageClient />
    </Suspense>
  );
}


