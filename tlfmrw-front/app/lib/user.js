import { create } from "zustand"

export const setUser = create((set) => ({
    userData: null,
    setUserData: (v) => set({ userData: v})
}))