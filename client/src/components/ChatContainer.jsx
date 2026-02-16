import { X } from "lucide-react";
import MessageInput from "./MessageInput";

const MOCK_MESSAGES = [
  {
    _id: "1",
    sender: "other",
    text: "Hey! How's it going?",
    createdAt: new Date().toISOString(),
  },
  {
    _id: "2",
    sender: "me",
    text: "I'm doing great! Just working on some new features.",
    createdAt: new Date().toISOString(),
  },
];

const ChatContainer = ({ selectedUser, setSelectedUser }) => {
  const formatTime = (dateStr) => {
    return new Date(dateStr).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      {/* Chat Header */}
      <div className="p-2.5 border-b border-base-300">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-full bg-base-300 flex items-center justify-center text-sm font-medium">
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
                {selectedUser.isOnline ? "Online" : "Offline"}
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
        {MOCK_MESSAGES.map((message) => (
          <div
            key={message._id}
            className={`chat ${
              message.sender === "me" ? "chat-end" : "chat-start"
            }`}
          >
            <div className="chat-image avatar">
              <div className="size-10 rounded-full bg-base-300 flex items-center justify-center text-sm font-medium">
                {message.sender === "me" ? "M" : selectedUser.fullName.charAt(0)}
              </div>
            </div>
            <div className="chat-header mb-1">
              <time className="text-xs opacity-50 ml-1">
                {formatTime(message.createdAt)}
              </time>
            </div>
            <div className="chat-bubble flex flex-col">
              {message.image && (
                <img
                  src={message.image}
                  alt="Attachment"
                  className="sm:max-w-[200px] rounded-md mb-2"
                />
              )}
              {message.text && <p>{message.text}</p>}
            </div>
          </div>
        ))}
      </div>

      {/* Message Input */}
      <MessageInput />
    </div>
  );
};

export default ChatContainer;
