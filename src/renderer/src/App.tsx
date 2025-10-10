<<<<<<< HEAD
import React, { useEffect, createElement } from 'react';
import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import { HashRouter } from 'react-router-dom';

import { ThemeProvider } from '@renderer/styles/ThemeProvider';
import withSlice, { Bind } from '@renderer/hocs/withSlice';
import withPublicRoute from '@renderer/hocs/withPublicRoute';
import withProtectedRoute from '@renderer/hocs/withProtectedRoute';
import AuthLayout from '@renderer/components/layouts/AuthLayout';
import MainLayout from '@renderer/components/layouts/MainLayout';
import loginRoute from '@renderer/pages/Login';
import registerRoute from '@renderer/pages/Register';
import dashboardRoute from '@renderer/pages/Dashboard';
import projectsRoute from '@renderer/pages/Projects';
import tasksRoute from '@renderer/pages/TaskBoard';
import notesRoute from '@renderer/pages/Notes';
import statisticsRoute from '@renderer/pages/Statistics';
import settingsRoute from '@renderer/pages/Settings';
import notFoundRoute from '@renderer/pages/NotFound/NotFound.component';
import { AppContainer } from '@renderer/App.style';

const App: React.FC<Bind> = (props: Bind) => {
  const publicAuthLayout = createElement(withPublicRoute(AuthLayout, { redirect: "/dashboard" }))
  const privateAuthLayout = createElement(withProtectedRoute(MainLayout, { redirect: '/login', children: <Outlet /> }))
=======
import { useEffect } from 'react';
import { Navigate, Route, RouterProvider, Routes, createBrowserRouter } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { HashRouter } from 'react-router-dom';

import { RootDispatch } from '@renderer/store';
import { restoreUser } from '@renderer/store/authSlice/asyncThunks';
import { ThemeProvider } from '@renderer/styles/ThemeProvider';
import { routes } from '@renderer/pages/routes';
import { AppContainer } from './App.style';
import PublicRoute from './hocs/PublicRoute';
import AuthLayout from './components/layouts/AuthLayout';
import LoginPage, { route } from './pages/LoginPage';

const App: React.FC = () => {
  const dispatch = useDispatch<RootDispatch>();
>>>>>>> 4a512eb (refactor(store): ♻️ restructure the Redux store for project management)

  useEffect(() => {
    props.actions.authActions.restoreUser()
  }, []);

  return (
    <ThemeProvider>
      <AppContainer>
        <HashRouter>
<<<<<<< HEAD
          <Routes>
            <Route path="/" element={publicAuthLayout}>
              <Route index element={<Navigate to="/login" replace />} />
              <Route path="login" {...loginRoute} />
              <Route path="register" {...registerRoute} />
            </Route>
            <Route path="/" element={privateAuthLayout}>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" {...dashboardRoute} />
              <Route path="projects/:projectId" {...projectsRoute} />
              <Route path="projects/:projectId/tasks" {...tasksRoute} />
              <Route path="notes" {...notesRoute} />
              <Route path="statistics" {...statisticsRoute} />
              <Route path="settings" {...settingsRoute} />
              <Route path="*" {...notFoundRoute} />
=======
          {/* <RouterProvider router={createBrowserRouter(routes)} /> */}
          <Routes>
            <Route path="/" element={<PublicRoute children={<AuthLayout />} />}>
              <Route index element={<Navigate to="/login" replace />} />
              <Route path="login" loader={route.loader} action={route.action} element={route.element} />
>>>>>>> 4a512eb (refactor(store): ♻️ restructure the Redux store for project management)
            </Route>
          </Routes>
        </HashRouter>
      </AppContainer>
    </ThemeProvider>
  );
};

export default withSlice(App);