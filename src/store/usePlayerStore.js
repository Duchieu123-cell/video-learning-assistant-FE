import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export const usePlayerStore = create(
    persist(
        (set) => ({
            currentLesson: null,
            seekToSeconds: null,
            actions: {
                setCurrentLesson: (lesson) => set({ currentLesson: lesson }),
                seekVideo: (seconds) => set({ seekToSeconds: seconds }),
                clearSeek: () => set({ seekToSeconds: null }),
            }
        }),
        {
            name: 'player-storage',
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                currentLesson: state.currentLesson,
                seekToSeconds: state.seekToSeconds,
            })
        }
    )
    
);