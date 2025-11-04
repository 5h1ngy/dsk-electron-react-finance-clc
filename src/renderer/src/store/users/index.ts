import { createSlice } from '@reduxjs/toolkit';
import { initialState } from './initialState';
import { reducers } from './reducers';
import { extraReducers } from './extraReducers';
import * as asyncThunks from './asyncThunks';

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers,
  extraReducers,
});

export const actions = { ...asyncThunks, ...usersSlice.actions }

<<<<<<< HEAD:src/renderer/src/store/users/index.ts
export const reducer = usersSlice.reducer;
=======
export default usersSlice.reducer;
>>>>>>> 4a512eb (refactor(store): ♻️ restructure the Redux store for project management):src/renderer/src/store/usersSlice/index.ts
