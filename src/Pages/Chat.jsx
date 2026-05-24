import React, {
  useEffect,
  useState,
  useRef,
} from "react";

import axios from "axios";
import { useParams } from "react-router-dom";

import socket from "../socket";
import useAuth from "../context/AuthContext";

export default function Chat() {
  const { conversationId } = useParams();

  const { user } = useAuth();

  const userId = user?._id || user?.id;

  // ================== STATE ==================
  const [conversations, setConversations] =
    useState([]);

  const [activeChat, setActiveChat] =
    useState(null);

  const [messages, setMessages] =
    useState([]);

  const [input, setInput] =
    useState("");

  const [notifications, setNotifications] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const bottomRef = useRef(null);

  // ================== SCROLL ==================
  const scrollToBottom = () => {
    setTimeout(() => {
      bottomRef.current?.scrollIntoView({
        behavior: "smooth",
      });
    }, 100);
  };

  // ================== USER ONLINE ==================
  useEffect(() => {
    if (!userId) return;

    // tell backend user online
    socket.emit(
      "user_online",
      userId
    );

    socket.off(
      "update_online_status"
    );

    socket.on(
      "update_online_status",
      ({
        userId: onlineId,
        status,
      }) => {
        console.log(
          "ONLINE STATUS EVENT:",
          onlineId,
          status
        );

        const isOnline =
          status === "online";

        // update sidebar users
        setConversations((prev) =>
          prev.map(
            (conversation) => {
              const otherId =
                String(
                  conversation.otherUserId
                );

              const socketId =
                String(onlineId);

              console.log(
                "MATCH CHECK:",
                otherId,
                socketId
              );

              if (
                otherId === socketId
              ) {
                return {
                  ...conversation,
                  isOnline,
                };
              }

              return conversation;
            }
          )
        );

        // update active chat header
        setActiveChat(
          (prev) => {
            if (!prev)
              return prev;

            const otherId =
              String(
                prev.otherUserId
              );

            const socketId =
              String(
                onlineId
              );

            if (
              otherId !==
              socketId
            ) {
              return prev;
            }

            return {
              ...prev,
              isOnline,
            };
          }
        );
      }
    );

    return () => {
      socket.off(
        "update_online_status"
      );
    };
  }, [userId]);

  // ================== LOAD CONVERSATIONS ==================
  useEffect(() => {
    if (!userId) return;

    const fetchConversations =
      async () => {
        try {
          setLoading(true);

          const res =
            await axios.get(
              `/chat/conversations/${userId}`,
              {
                withCredentials: true,
              }
            );

          const data =
            res.data || [];

          console.log("API RESPONSE:", res.data);
          console.log("CONVERSATIONS:", data);

          const updatedChats =
            data.map(
              (
                conversation
              ) => ({
                ...conversation,
                isOnline:
                  false,
              })
            );

          setConversations(
            updatedChats
          );

          console.log(
            "CONVERSATIONS:",
            updatedChats
          );

          // join rooms
          updatedChats.forEach(
            (
              conversation
            ) => {
              socket.emit(
                "join_conversation",
                conversation._id
              );
            }
          );

          // ask backend who is online
          socket.emit(
            "request_online_status"
          );
        } catch (err) {
          console.log(
            "LOAD CONVERSATIONS ERROR:",
            err
          );
        } finally {
          setLoading(false);
        }
      };

    fetchConversations();
  }, [userId]);

  // ================== AUTO OPEN CHAT ==================
  useEffect(() => {
    if (
      !conversationId ||
      conversations.length === 0
    ) {
      return;
    }

    const foundChat =
      conversations.find(
        (conversation) =>
          conversation._id ===
          conversationId
      );

    if (foundChat) {
      openChat(foundChat);
    }
  }, [
    conversationId,
    conversations,
  ]);

  // ================== OPEN CHAT ==================
  const openChat = async (
    chat
  ) => {
    try {
      setActiveChat(chat);

      const res =
        await axios.get(
          `/chat/messages/${chat._id}`,
          {
            withCredentials: true,
          }
        );

      setMessages(
        res.data || []
      );

      socket.emit(
        "join_conversation",
        chat._id
      );

      // remove notifications
      setNotifications(
        (prev) =>
          prev.filter(
            (
              notification
            ) =>
              notification.conversationId !==
              chat._id
          )
      );

      scrollToBottom();
    } catch (err) {
      console.log(
        "OPEN CHAT ERROR:",
        err
      );
    }
  };

  // ================== RECEIVE MESSAGE ==================
  useEffect(() => {
    const handler = (
      data
    ) => {
      setConversations(
        (prev) =>
          prev.map(
            (
              conversation
            ) => {
              if (
                conversation._id ===
                data.conversationId
              ) {
                return {
                  ...conversation,
                  lastMessage:
                    data.text,
                  updatedAt:
                    new Date(),
                };
              }

              return conversation;
            }
          )
      );

      if (
        activeChat &&
        activeChat._id ===
        data.conversationId
      ) {
        setMessages(
          (prev) => [
            ...prev,
            data,
          ]
        );

        scrollToBottom();
      } else {
        setNotifications(
          (prev) => {
            const alreadyExists =
              prev.some(
                (
                  notification
                ) =>
                  notification._id ===
                  data._id
              );

            if (
              alreadyExists
            ) {
              return prev;
            }

            return [
              ...prev,
              data,
            ];
          }
        );
      }
    };

    socket.off(
      "receive_message"
    );

    socket.on(
      "receive_message",
      handler
    );

    return () => {
      socket.off(
        "receive_message",
        handler
      );
    };
  }, [activeChat]);

  // ================== SEND MESSAGE ==================
  const sendMessage =
    async () => {
      if (
        !input.trim() ||
        !activeChat
      ) {
        return;
      }

      const tempMessage = {
        _id: Date.now(),

        conversationId:
          activeChat._id,

        sender: userId,

        senderName:
          user?.name ||
          "User",

        receiverId:
          activeChat.otherUserId,

        text:
          input.trim(),

        createdAt:
          new Date(),
      };

      setMessages(
        (prev) => [
          ...prev,
          tempMessage,
        ]
      );

      setConversations(
        (prev) =>
          prev.map(
            (
              conversation
            ) => {
              if (
                conversation._id ===
                activeChat._id
              ) {
                return {
                  ...conversation,
                  lastMessage:
                    input.trim(),
                  updatedAt:
                    new Date(),
                };
              }

              return conversation;
            }
          )
      );

      scrollToBottom();

      setInput("");

      try {
        socket.emit(
          "send_message",
          tempMessage
        );

        await axios.post(
          "/chat/message",
          tempMessage,
          {
            withCredentials: true,
          }
        );
      } catch (err) {
        console.log(
          "SEND MESSAGE ERROR:",
          err
        );
      }
    };

  // ================== UI ==================
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      <aside className="w-full md:w-[320px] bg-white border-r p-4 overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">
          Messages
        </h2>

        {loading ? (
          <p className="text-gray-500">
            Loading...
          </p>
        ) : conversations.length ===
          0 ? (
          <p className="text-gray-500">
            No conversations
            found
          </p>
        ) : (
          <div className="flex flex-col gap-2">
            {conversations.map(
              (
                conversation
              ) => (
                <div
                  key={
                    conversation._id
                  }
                  onClick={() =>
                    openChat(
                      conversation
                    )
                  }
                  className={`p-3 border rounded-lg cursor-pointer flex items-center justify-between transition ${activeChat?._id ===
                      conversation._id
                      ? "bg-gray-100"
                      : "bg-white"
                    }`}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-3 h-3 rounded-full ${conversation.isOnline
                          ? "bg-green-500"
                          : "bg-gray-400"
                        }`}
                    />

                    <div>
                      <p className="font-medium">
                        {
                          conversation.otherUserName
                        }
                      </p>

                      <p className="text-xs text-gray-500 truncate max-w-[180px]">
                        {
                          conversation.lastMessage
                        }
                      </p>
                    </div>
                  </div>

                  {notifications.some(
                    (
                      notification
                    ) =>
                      notification.conversationId ===
                      conversation._id
                  ) && (
                      <span className="text-xs text-red-500">
                        New
                      </span>
                    )}
                </div>
              )
            )}
          </div>
        )}
      </aside>

      <main className="flex-1 flex flex-col">
        {activeChat ? (
          <>
            <div className="bg-white border-b p-4 flex items-center gap-2">
              <span
                className={`w-3 h-3 rounded-full ${activeChat.isOnline
                    ? "bg-green-500"
                    : "bg-gray-400"
                  }`}
              />

              <h2 className="font-semibold">
                {
                  activeChat.otherUserName
                }
              </h2>
            </div>

            <div className="flex-1 overflow-y-auto p-4 flex flex-col">
              {messages.map(
                (
                  message
                ) => {
                  const isSender =
                    message.sender?.toString() ===
                    userId?.toString();

                  return (
                    <div
                      key={
                        message._id
                      }
                      className={`flex mb-2 ${isSender
                          ? "justify-end"
                          : "justify-start"
                        }`}
                    >
                      <div
                        className={`px-4 py-2 rounded-lg max-w-[75%] text-sm ${isSender
                            ? "bg-blue-600 text-white rounded-br-none"
                            : "bg-gray-300 text-black rounded-bl-none"
                          }`}
                      >
                        {
                          message.text
                        }
                      </div>
                    </div>
                  );
                }
              )}

              <div
                ref={
                  bottomRef
                }
              />
            </div>

            <div className="bg-white border-t p-4 flex gap-2">
              <input
                type="text"
                value={input}
                placeholder="Type message..."
                onChange={(
                  e
                ) =>
                  setInput(
                    e.target
                      .value
                  )
                }
                onKeyDown={(
                  e
                ) =>
                  e.key ===
                  "Enter" &&
                  sendMessage()
                }
                className="flex-1 border rounded-lg p-2 outline-none"
              />

              <button
                onClick={
                  sendMessage
                }
                className="bg-blue-600 text-white px-6 rounded-lg"
              >
                Send
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            Select a
            conversation
          </div>
        )}
      </main>
    </div>
  );
}