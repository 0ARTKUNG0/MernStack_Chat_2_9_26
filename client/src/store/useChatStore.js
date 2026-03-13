import { create } from "zustand";
import API from "../services/api";
import toast from "react-hot-toast";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
    users: [],
    messages: [],
    selectedUser: null,
    isUserLoading: false,
    isMessageLoading: false,
    isSending: false,

    getUsers: async () => {
        set({ isUserLoading: true });
        try {
            const res = await API.get("/api/v1/messages/users");
            set({ users: res.data });
        } catch (error) {
            toast.error(error.response?.data?.message || "Get users failed");
        } finally {
            set({ isUserLoading: false });
        }
    },

    getMessage: async (userId) => {
        set({ isMessageLoading: true });
        try {
            const res = await API.get(`/api/v1/messages/messages/${userId}`);
            set({ messages: res.data });
        } catch (error) {
            toast.error(error.response?.data?.message || "Getting messages failed");
        } finally {
            set({ isMessageLoading: false });
        }
    },

    sendMessage: async (messageData) => {
        const { selectedUser, messages } = get();
        set({ isSending: true });
        try {
            const res = await API.post(
                `/api/v1/messages/sendmessages/${selectedUser._id}`,
                messageData
            );
            set({ messages: [...messages, res.data] });
        } catch (error) {
            toast.error(error.response?.data?.message || "Sending message failed");
        } finally {
            set({ isSending: false });
        }
    },

    setSelectedUser: (selectedUser) => set({ selectedUser }),

    subscribeToMessages: () => {
        const { selectedUser } = get();
        if (!selectedUser) return;

        const socket = useAuthStore.getState().socket;

        socket.on("newMessage", (newMessage) => {
            const isFromSelectedUser = newMessage.senderid === selectedUser._id;
            if (!isFromSelectedUser) return;
            set({ messages: [...get().messages, newMessage] });
        });
    },

    unsubscribeFromMessages: () => {
        const socket = useAuthStore.getState().socket;
        if (!socket) return;
        socket.off("newMessage");
    },
}));
