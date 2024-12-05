"use client";
// import { Message } from "@/app/types";
import { useStreamContext } from "@/context/StreamContext";
import dbInstance from "@/database";
import { LanguageModelUsage } from "ai";
import { Message, useChat, UseChatOptions } from "ai/react";
import { useCallback, useEffect, useState } from "react";

const VIRTUAL_CHUNK_SIZE = 20;

export const useStream = (props: UseChatOptions) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [initialMessages, setInitialMessages] = useState<Array<Message>>([]);
  const { storeMessage, getAllMessages } = useStreamContext();
  const [addUserMessage, setAddUserMessage] = useState<boolean>(false);

  const storeMessageHelper = useCallback(
    async (
      finishResp: Message,
      options: {
        usage: LanguageModelUsage;
      }
    ) => {
      setLoading(true);
      try {
        await storeMessage(finishResp);
        setAddUserMessage(true);
      } catch (e) {
      } finally {
        setLoading(false);
      }
    },
    [storeMessage]
  );

  const {
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    stop,
    error,
    messages,
    reload,
    setMessages,
  } = useChat({
    ...props,
    initialMessages,
    onFinish: storeMessageHelper,
  });

  const retry = useCallback(() => {
    reload();
  }, [reload]);

  const deleteMessages = useCallback(
    (id: string) => async () => {
      const filteredMessages: Message[] = [];
      let deletedMessageIdx: number;
      const idsToBeDeleted: string[] = [];
      messages.forEach((message, idx) => {
        if (
          message.id != id &&
          (!deletedMessageIdx || deletedMessageIdx + 1 != idx)
        ) {
          filteredMessages.push(message);
        } else if (!deletedMessageIdx) {
          deletedMessageIdx = idx;
          idsToBeDeleted.push(message.id);
        } else {
          idsToBeDeleted.push(message.id);
        }
      });
      if (idsToBeDeleted.length > 0) {
        await dbInstance.deleteMessagesByIds(idsToBeDeleted);
      }
      setMessages(filteredMessages);
    },
    [messages, setMessages]
  );

  const getMessagesHelper = useCallback(async () => {
    try {
      const resp = await getAllMessages();
      if (resp.length > 0) {
        setInitialMessages([...resp]);
      }
    } catch (e) {
      console.log("NO CACHE FOUND");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getMessagesHelper();
  }, [getMessagesHelper]);

  useEffect(() => {
    if (addUserMessage && messages.length > 1) {
      storeMessage(messages[messages.length - 2]);
      setAddUserMessage(false);
    }
  }, [messages, storeMessage, addUserMessage]);

  return {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading: loading || isLoading,
    abort: stop,
    error,
    retry,
    deleteMessages,
  };
};
