"use client";
import { StreamContextType } from "@/app/types";
import dbInstance from "@/database";
import { Message } from "ai/react";
import { createContext, ReactNode, useCallback, useContext } from "react";

const StreamProvider = createContext<StreamContextType>({
  storeMessage: async () => {
    throw new Error("storeMessage not implemented");
  },
  getAllMessages: async () => {
    throw new Error("getAllMessages not implemented");
  },
});
export const useStreamContext = () => useContext(StreamProvider);
export const StreamContext = ({ children }: { children: ReactNode }) => {
  const getAllMessages = useCallback(async () => {
    const cacheMessages = await dbInstance.getMessages();
    cacheMessages.sort((a, b) => {
      const a_date = new Date(a?.createdAt || "");
      const b_date = new Date(b?.createdAt || "");
      return a_date.getTime() - b_date.getTime();
    });
    return cacheMessages;
  }, []);

  const storeMessage = useCallback(async (messages: Message) => {
    try {
      await dbInstance.addMessage(messages);
    } catch (e) {
      console.log(e);
    }
  }, []);

  const value = {
    storeMessage,
    getAllMessages,
  };

  return (
    <StreamProvider.Provider value={value}>{children}</StreamProvider.Provider>
  );
};
