import { createSlice } from '@reduxjs/toolkit';

import '../types'
import initialState from './initialState';
import reducers from './reducers';
import extraReducers from './extraReducers';
import * as asyncThunks from './asyncThunks';
<<<<<<< HEAD:src/renderer/src/store/notes/index.ts
export * as selectors from './selectors';
=======
>>>>>>> 4a512eb (refactor(store): ♻️ restructure the Redux store for project management):src/renderer/src/store/notesSlice/index.ts

const notesSlice = createSlice({
  name: 'notes',
  initialState,
  reducers,
  extraReducers,
});

export const actions = { ...asyncThunks, ...notesSlice.actions }
<<<<<<< HEAD:src/renderer/src/store/notes/index.ts

export const reducer = notesSlice.reducer;
=======
export default notesSlice.reducer;
>>>>>>> 4a512eb (refactor(store): ♻️ restructure the Redux store for project management):src/renderer/src/store/notesSlice/index.ts
