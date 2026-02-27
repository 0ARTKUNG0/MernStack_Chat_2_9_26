import { create } from "zustand";
import API from "../services/api";
import { toast } from "react-hot-toast";
import {io} from "socket.io-client";

export const useAuthStore = create((set, get) => ({
    authUser: null,
    socket: null,
    isCheckedAuth:true,
    isSignIn:false,
    isSignUp:false,
    isUpdateProfile:false,
    onlineUsers: [],
    signUp:async (data) => {
        set({isSignUp:true})
        try {
            const res = await API.post("/api/v1/auth/signup",data);
            set({ authUser: res.data.user });
            get().connectSocket();
            toast.success(res.data.message || "Sign up successfully");
        } catch (error) {
            toast.error(error.response?.data?.message || "Sign up failed");
        } finally {
            set({isSignUp:false})
        }
    },
    signIn:async (data) => {
        set({isSignIn:true})
        try {
            const res = await API.post("/api/v1/auth/signin",data);
            set({ authUser: res.data.user });
            get().connectSocket();
            toast.success(res.data.message || "Sign in successfully");
        } catch (error) {
            toast.error(error.response?.data?.message || "Sign in failed");
        } finally {
            set({isSignIn:false})
        }
    },
    signOut:async () => {
        try {
            const res = await API.post("/api/v1/auth/signout");
            set({ authUser: null });
            get().disconnectSocket();
            toast.success(res.data.message || "Sign out successfully");
        } catch (error) {
            toast.error(error.response?.data?.message || "Sign out failed");
        }
    },
    updateProfile:async (data) => {
        set({isUpdateProfile:true})
        try {
            const res = await API.put("/api/v1/auth/update-profile",data);
            set({ authUser: res.data.user });
            toast.success(res.data.message || "Update profile successfully");
        } catch (error) {
            toast.error(error.response?.data?.message || "Update profile failed");
        } finally {
            set({isUpdateProfile:false})
        }
    },
    checkAuth:async () => {
        try {
            const res = await API.get("/api/v1/auth/check-auth");
            set({ authUser: res.data.user });
            get().connectSocket();
        } catch {
            set({ authUser: null });
        } finally {
            set({ isCheckedAuth: false });
        }
    },
    connectSocket:() => {
        const {authUser, socket} = get();
        if(!authUser || socket?.connected) return;
        const SOCKET_URL = import.meta.env.VITE_API_URL;
        console.log("Connecting to socket:", SOCKET_URL, "User:", authUser._id);
        const newSocket = io(SOCKET_URL, {
            query: {
                userId: authUser._id,
            },
        });
        newSocket.connect();
        set({ socket: newSocket });
        newSocket.on("getOnlineUsers", (userIds) => {
            set({ onlineUsers: userIds });
        });
    },
    disconnectSocket:() => {
        const {socket} = get();
        if(socket?.connected){
            socket.disconnect();
        }
    },
}));
