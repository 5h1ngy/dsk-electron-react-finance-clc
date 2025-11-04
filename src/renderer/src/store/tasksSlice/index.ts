import { createSlice } from '@reduxjs/toolkit';
import { initialState } from './initialState';
import { reducers } from './reducers';
import { extraReducers } from './extraReducers';
<<<<<<< HEAD
import * as asyncThunks from './asyncThunks';
=======
import { fetchTasks, createTask, updateTask, deleteTask } from './asyncThunks';
>>>>>>> ce98b7f (refactor(store): ♻️ rewrite Redux thunks for ui/users/projects/tasks)

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers,
  extraReducers,
});

<<<<<<< HEAD
export const actions = { ...asyncThunks, ...tasksSlice.actions }

export default tasksSlice.reducer;
=======
export const {
  setTaskFilter,
  clearTaskFilters,
  clearTasksError,
  reorderTasks,
  updateTaskColumns,
} = tasksSlice.actions;

export default tasksSlice.reducer;

export { fetchTasks, createTask, updateTask, deleteTask };
>>>>>>> ce98b7f (refactor(store): ♻️ rewrite Redux thunks for ui/users/projects/tasks)
