import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import MessageInput from "./MessageInput";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";

const ChatContainer = () => {
  const { messages, getMessage, selectedUser, setSelectedUser, isMessageLoading, subscribeToMessages, unsubscribeFromMessages } = useChatStore();
  const { authUser, onlineUsers } = useAuthStore();
  const messageEndRef = useRef(null);

  useEffect(() => {
    getMessage(selectedUser._id);
    subscribeToMessages();
    return () => unsubscribeFromMessages();
  }, [selectedUser._id, getMessage, subscribeToMessages, unsubscribeFromMessages]);

  useEffect(() => {
    if (messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const formatTime = (dateStr) => {
    return new Date(dateStr).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const isOnline = onlineUsers.includes(selectedUser._id);

  if (isMessageLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <div className="p-2.5 border-b border-base-300">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-full bg-base-300"></div>
              <div>
                <h3 className="font-medium">{selectedUser.fullName}</h3>
              </div>
            </div>
            <button onClick={() => setSelectedUser(null)}>
              <X />
            </button>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <span className="loading loading-spinner loading-md"></span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      {/* Chat Header */}
      <div className="p-2.5 border-b border-base-300">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-full bg-base-300 flex items-center justify-center text-sm font-medium overflow-hidden">
              {selectedUser.profilePic ? (
                <img
                  src={selectedUser.profilePic}
                  alt={selectedUser.fullName}
                  className="size-10 object-cover rounded-full"
                />
              ) : (
                selectedUser.fullName.charAt(0)
              )}
            </div>
            <div>
              <h3 className="font-medium">{selectedUser.fullName}</h3>
              <p className="text-sm text-base-content/70">
                {isOnline ? "Online" : "Offline"}
              </p>
            </div>
          </div>
          <button onClick={() => setSelectedUser(null)}>
            <X />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message._id}
            className={`chat ${
              message.senderid === authUser._id ? "chat-end" : "chat-start"
            }`}
          >
            <div className="chat-image avatar">
              <div className="size-10 rounded-full bg-base-300 flex items-center justify-center text-sm font-medium overflow-hidden">
                {message.senderid === authUser._id ? (
                  authUser.profilePic ? (
                    <img src={authUser.profilePic} alt="You" className="size-10 object-cover rounded-full" />
                  ) : (
                    authUser.fullName.charAt(0)
                  )
                ) : (
                  selectedUser.profilePic ? (
                    <img src={selectedUser.profilePic} alt={selectedUser.fullName} className="size-10 object-cover rounded-full" />
                  ) : (
                    selectedUser.fullName.charAt(0)
                  )
                )}
              </div>
            </div>
            <div className="chat-header mb-1">
              <time className="text-xs opacity-50 ml-1">
                {formatTime(message.createdAt)}
              </time>
            </div>
            <div className="chat-bubble flex flex-col break-words max-w-[75%]">
              {message.file && (
                <img
                  src={message.file}
                  alt="Attachment"
                  className="sm:max-w-[200px] rounded-md mb-2"
                />
              )}
              {message.text && <p>{message.text}</p>}
            </div>
          </div>
        ))}
        <div ref={messageEndRef} />
      </div>

      {/* Message Input */}
      <MessageInput />
    </div>
  );
};

export default ChatContainer;
