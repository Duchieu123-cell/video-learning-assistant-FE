import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware'

export const useAuthStore = create(
    persist(
        (set) => ({
            access_token: null,
            full_name: null,
            role: null,
            isAuthenticated: false,
            actions: {
                setNewAccessToken: (newAccessToken) => set({ access_token: newAccessToken }),
                login: (access_token, full_name, role) => set({ 
                    access_token, 
                    full_name,
                    role,
                    isAuthenticated: true
                }),
                logout: () => set({ 
                    access_token: null, 
                    full_name: null, 
                    role: null,
                    isAuthenticated: false
                }),
            },
        }),
        {
            name: 'auth-storage',
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                access_token: state.access_token,
                full_name: state.full_name,
                role: state.role,
                isAuthenticated: state.isAuthenticated
            })
        }
    )
)