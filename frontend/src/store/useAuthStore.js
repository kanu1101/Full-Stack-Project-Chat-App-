import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { useChatStore } from "./useChatStore";
import {io} from "socket.io-client"
const BASE_URL = import.meta.env.MODE === "development"? "http://localhost:5001" : "/";
export const useAuthStore = create((set, get) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  onlineUsers: [],
  socket: null,

  isCheckingAuth: true, // ✅ Important: must be true initially!

  checkAuth: async () => {
    set({ isCheckingAuth: true });
    try {
        const res = await axiosInstance.get("/auth/check");
        if (res.data) {
            set({ authUser: res.data });
            get().connectSocket();   // only call if authUser valid
        } else {
            set({ authUser: null });
            get().disconnectSocket();  // make sure no ghost socket
        }
    } catch (error) {
        console.log("Error in checkAuth: ", error);
        set({ authUser: null });
        get().disconnectSocket();  // again, disconnect
    } finally {
        set({ isCheckingAuth: false });
    }
  },

  signup: async (data) => {
    set({isSigningUp: true});
    try {
      const res = await axiosInstance.post("/auth/signup", data)
      set({authUser: res.data})
      toast.success("Account Created Successfully!");
      get().connectSocket();
    } catch (error) {
      toast.error(error.response?.data?.message || "Signup failed!");
      console.log("Error in signup useAuthStore", error);
    }
    finally{
      set({isSigningUp : false});
    }
  },
  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({authUser: null});
      useChatStore.getState().setSelectedUser(null);  
      get().disconnectSocket();
      toast.success("Logged Out Successfully");

    } catch (error) {
      toast.error(error.response.data.message);
    }
  },
  login: async (formData) => {
    set({isLoggingIn : true})
    try {
      const res = await axiosInstance.post("/auth/login", formData)
      set({authUser: res.data});
      get().connectSocket();
      toast.success("Logged In Successfully")
    } catch (error) {
      toast.error(error.response.data.message);
    }
    finally{
      set({isLoggingIn : false});
    }
  },
  updateProfile: async (data) => {
    set({isUpdatingProfile: true});

    try {
      const res = await axiosInstance.put("/auth/update-profile", data)
      set({authUser : res.data});
      toast.success("Profile Picture Updated Successfully");
    } catch (error) {
      console.log("error updating profile pic", error);
      toast.error("Something Went Wrong");     
    } finally {
      set({isUpdatingProfile : false});
    }
  },

  connectSocket: () => {
    const {authUser, socket} = get();
    if(!authUser || (socket && socket.connected)) return;
    const newSocket = io(BASE_URL,{
      query : {
          userId: authUser._id,
      }
    });
    newSocket.connect();
    set({socket: newSocket});
    newSocket.on("getOnlineUsers", (userIds) => {
      set({onlineUsers: userIds});
    })
  },

  disconnectSocket: () => {
    if(get().socket?.connected) get().socket?.disconnect();
    set({socket: null});
  },
}));
