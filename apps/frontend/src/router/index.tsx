import { createBrowserRouter, Navigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import HomePage from '../pages/home/HomePage';
import SettingsPage from '../pages/settings/SettingsPage';
import EditorPage from '../pages/editor/EditorPage';
import environments from '@environments';

export const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <MainLayout />,
      children: [
        {
          index: true,
          element: <Navigate to="/home" replace />,
        },
        {
          path: 'home',
          element: <HomePage />,
        },
        {
          path: 'settings',
          element: <SettingsPage />,
          handle: { sidebarCollapsed: true },
        },
      ],
    },
    {
      path: '/editor/new',
      element: <EditorPage />,
    },
    {
      path: '/editor/:id',
      element: <EditorPage />,
    },
  ],
  {
    basename: environments.production ? environments.basePath : '/',
  }
);
