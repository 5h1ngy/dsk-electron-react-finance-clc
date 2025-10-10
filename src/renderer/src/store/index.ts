import { configureStore } from '@reduxjs/toolkit';

<<<<<<< HEAD
import { reducer as authReducer, actions as authActions } from './auth';
import { reducer as projectsReducer, actions as projectsActions, selectors as projectSelectors } from './projects';
import { reducer as tasksReducer, actions as tasksActions } from './tasks';
import { reducer as notesReducer, actions as notesActions, selectors as notesSelectors } from './notes';
import { reducer as uiReducer, actions as uiActions } from './ui';
import { reducer as usersReducer, actions as usersActions } from './users';
=======
import authReducer, { actions as authActions } from './authSlice';
import projectsReducer, { actions as projectsActions, selectors as projectSelectors } from './projectsSlice';
import tasksReducer, { actions as tasksActions } from './tasksSlice';
import notesReducer, { actions as notesActions } from './notesSlice';
import uiReducer, { actions as uiActions } from './uiSlice';
import usersReducer, { actions as usersActions } from './usersSlice';
>>>>>>> 4a512eb (refactor(store): ♻️ restructure the Redux store for project management)

const store = configureStore({
  reducer: {
    auth: authReducer,
    projects: projectsReducer,
    tasks: tasksReducer,
    notes: notesReducer,
    ui: uiReducer,
    users: usersReducer,
  }
});

export const rootActions = {
  authActions,
  projectsActions,
  tasksActions,
  notesActions,
  uiActions,
  usersActions,
}

export const rootSelectors = {
<<<<<<< HEAD
  projectSelectors,
  notesSelectors,
=======
  projectSelectors
>>>>>>> 4a512eb (refactor(store): ♻️ restructure the Redux store for project management)
}

export type RootState = ReturnType<typeof store.getState>;
export type RootDispatch = typeof store.dispatch;

export default store;