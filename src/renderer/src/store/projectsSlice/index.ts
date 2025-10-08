import { createSlice } from '@reduxjs/toolkit';
import { initialState } from './initialState';
import { reducers } from './reducers';
import { extraReducers } from './extraReducers';
<<<<<<< HEAD
import * as asyncThunks from './asyncThunks';
export * as selectors from './selectors';
=======
import { fetchProjects, createProject, updateProject, deleteProject } from './asyncThunks';
>>>>>>> ce98b7f (refactor(store): ♻️ rewrite Redux thunks for ui/users/projects/tasks)

const projectsSlice = createSlice({
  name: 'projects',
  initialState,
  reducers,
  extraReducers,
});

<<<<<<< HEAD
export const actions = { ...asyncThunks, ...projectsSlice.actions }
export default projectsSlice.reducer;
=======
export const {
  setCurrentProject,
  setTagFilter,
  setSearchFilter,
  clearFilters,
  clearProjectsError,
} = projectsSlice.actions;

export default projectsSlice.reducer;

export { fetchProjects, createProject, updateProject, deleteProject };
>>>>>>> ce98b7f (refactor(store): ♻️ rewrite Redux thunks for ui/users/projects/tasks)
