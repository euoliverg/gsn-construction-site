import { createContext, useContext, useState, type ReactNode } from "react";

interface PendingChat {
  name: string;
  message?: string;
}

interface ChatContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
  pending: PendingChat | null;
  /** Opens the chat, pre-filling the visitor's name and (optionally) sending a first message once the conversation is ready. */
  openChatWith: (name: string, message?: string) => void;
  clearPending: () => void;
}

const ChatContext = createContext<ChatContextValue | undefined>(undefined);

export function ChatProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState<PendingChat | null>(null);

  const openChatWith = (name: string, message?: string) => {
    setPending({ name, message });
    setOpen(true);
  };

  return (
    <ChatContext.Provider value={{ open, setOpen, pending, openChatWith, clearPending: () => setPending(null) }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error("useChat must be used within a ChatProvider");
  return ctx;
}
