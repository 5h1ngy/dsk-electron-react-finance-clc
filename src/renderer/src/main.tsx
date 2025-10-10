import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
<<<<<<< HEAD
import { HashRouter } from 'react-router-dom';
import { store } from './store';
=======

import store from './store';
>>>>>>> 4a512eb (refactor(store): ♻️ restructure the Redux store for project management)
import App from './App';
import './styles/global.css';
import { ThemeProvider } from './styles/ThemeProvider';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);
