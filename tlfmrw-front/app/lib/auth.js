import { create } from "zustand"

export const useAuth = create((set) => ({
    isLoggedIn: false,
    setLoggedIn: (v) => set({ isLoggedIn: v})
}))

