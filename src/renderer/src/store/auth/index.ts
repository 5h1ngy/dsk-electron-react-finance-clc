import { createSlice } from '@reduxjs/toolkit';

import '../types'
import initialState from './initialState';
import reducers from './reducers';
import extraReducers from './extraReducers';
import * as asyncThunks from './asyncThunks';

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers,
  extraReducers,
});

export const actions = { ...asyncThunks, ...authSlice.actions }
<<<<<<< HEAD:src/renderer/src/store/auth/index.ts

export const reducer = authSlice.reducer;
=======
export default authSlice.reducer;
>>>>>>> 29ef91f (refactor(auth): ♻️ restructure authentication logic and components):src/renderer/src/store/authSlice/index.ts
