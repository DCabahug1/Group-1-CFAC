import { create } from "zustand";
import { Module, modulesList } from "../app/lib/modules";
import { Message } from "./types";

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

interface ModuleStore {
  modules: Module[];
  completeModule: (id: number, accuracy: number) => void;
  resetModules: () => void;
}

export const useModuleStore = create<ModuleStore>((set) => ({
  modules: modulesList,
  completeModule: (id: number, accuracy: number) => {
    set((state) => ({
      modules: state.modules.map((module) =>
        module.id === id ? { ...module, completed: true } : module,
      ),
    }));
  },
  resetModules: () => {
    set({ modules: modulesList });
  },
}));
