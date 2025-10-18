import type { store, createAppStore } from '@renderer/store'

export type AppStore = ReturnType<typeof createAppStore>
export type AppDispatch = AppStore['dispatch']
export type RootState = ReturnType<typeof store.getState>
