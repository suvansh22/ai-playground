"use client";

import { useStream } from "@/hooks/useStream";
import DeleteIcon from "@/reactIcons/DeleteIcon";
import RetryIcon from "@/reactIcons/RetryIcon";

export default function Chat() {
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    abort,
    retry,
    error,
    deleteMessages,
  } = useStream({ streamProtocol: "text" });

  return (
    <div className="flex flex-col w-full max-w-md h-screen py-24 px-4 mx-auto stretch gap-y-3 bg-slate-600 overflow-y-auto hide_scrollbar">
      <div className="w-full h-[1px]" />
      {messages.map((m) => (
        <div
          key={m.id}
          className={`whitespace-pre-wrap self-end flex flex-row items-center ${
            m.role === "user"
              ? "rounded-xl py-2 px-4 bg-gray-700 text-white max-w-[70%]"
              : "text-white py-2 px-4 border border-solid border-gray-900 rounded-xl"
          }`}
        >
          {m.content}
          {m.role === "user" ? (
            <button
              onClick={deleteMessages(m.id)}
              className="ml-4 cursor-pointer"
            >
              <DeleteIcon />
            </button>
          ) : null}
        </div>
      ))}
      <div className="w-full h-[1px]" />

      {isLoading ? (
        <div
          className={`flex flex-row items-center self-end w-max text-white py-2 pl-4 pr-4 border border-solid border-gray-900 rounded-xl`}
        >
          <span>Loading...</span>
        </div>
      ) : null}

      {!isLoading && error ? (
        <div
          className={`flex flex-row items-center self-end w-max text-white py-2 pl-4 pr-4 border border-solid border-gray-900 rounded-xl`}
        >
          <span>An error Occured</span>
          <span className="ml-4 cursor-pointer" onClick={retry}>
            <RetryIcon />
          </span>
        </div>
      ) : null}

      <form
        className="fixed bottom-0 px-2 py-4 w-full max-w-[26rem] mb-8 border border-gray-300 flex items-center bg-white rounded-md shadow-lg"
        onSubmit={handleSubmit}
      >
        <input
          className="w-full"
          value={input}
          placeholder="Say something..."
          onChange={handleInputChange}
        />
        {isLoading ? (
          <span
            onClick={abort}
            className="ml-4  hover:border hover:border-solid hover:border-white cursor-pointer h-4 w-4 rounded-md bg-black"
          ></span>
        ) : null}
      </form>
    </div>
  );
}
