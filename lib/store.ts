import { create } from "zustand";
import { Message } from "./lib/types";

interface messageStore {
  // Format for message store
  messages: Message[];
  lastSpokenMessage: string | null;
  addMessage: (text: string, speaker: "deaf" | "blind") => void;
  setLastSpokenMessage: (message: string) => void;
}

export const useMessageStore = create<messageStore>((set) => ({
  messages: [],
  lastSpokenMessage: null,
  addMessage: (text: string, speaker: "deaf" | "blind") => {
    set((state) => ({
      messages: [
        ...state.messages,
        {
          id: Date.now().toString(),
          text,
          timestamp: new Date().toISOString(),
          speaker,
        },
      ],
    }));
  },
  setLastSpokenMessage: (message: string) => {
    set((state) => ({
      lastSpokenMessage: message,
    }));
  },
}));
