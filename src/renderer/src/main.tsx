import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
<<<<<<< HEAD
import { HashRouter } from 'react-router-dom';
<<<<<<< HEAD
import { store } from './store';
=======

import store from './store';
>>>>>>> 4a512eb (refactor(store): ♻️ restructure the Redux store for project management)
=======

import store from './store';
>>>>>>> cd65bdc (refactor(store): ♻️ remove auth/notes slices and add tasks/ui/users state)
import App from './App';
import { ThemeProvider } from './styles/ThemeProvider';
import './styles/global.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);
