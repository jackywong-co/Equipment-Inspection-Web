import { Navigate, useRoutes } from 'react-router-dom';
// layouts
import DashboardLayout from 'src/layouts/dashboard';
import LogoOnlyLayout from 'src/layouts/LogoOnlyLayout';
//
import Login from 'src/pages/Login';
import Dashboard from 'src/pages/DashboardMgt/Dashboard';
import Form from 'src/pages/Form';
import User from 'src/pages/User';
import Room from 'src/pages/RoomMgt/Room';
import Equipment from 'src/pages/EquipmentMgt/Equipment';
import NotFound from 'src/pages/Page404';
//
import { useContext } from "react";
import AuthContext from "src/services/auth.context";
// ----------------------------------------------------------------------
export default function Router() {
  const authCtx = useContext(AuthContext)
  const mainRoutes = useRoutes([
    {
      path: '/dashboard',
      element: <DashboardLayout />,
      children: [
        { path: '/dashboard', element: <Navigate to="app" replace /> },
        { path: 'app', element: <Dashboard /> },
        { path: 'user', element: <User /> },
        { path: 'form', element: <Form /> },
        { path: 'room', element: <Room /> },
        { path: 'equipment', element: <Equipment /> }
      ]
    },
    {
      path: '/',
      element: <LogoOnlyLayout />,
      children: [
        { path: '404', element: <NotFound /> },
        { path: '/', element: <Navigate to="/dashboard" /> },
        { path: '*', element: <Navigate to="/dashboard" /> }
      ]
    },
    { path: '*', element: <Navigate to="/404" replace /> }
  ])
  const authRoutes = useRoutes([
    {
      path: '/',
      element: <LogoOnlyLayout />,
      children: [
        { path: 'login', element: <Login /> },
        { path: '404', element: <NotFound /> },
        { path: '/', element: <Navigate to="/login" /> },
        { path: '*', element: <Navigate to="/login" /> }
      ]
    },
    { path: '*', element: <Navigate to="/404" replace /> }
  ]);
  if (authCtx.isLoggedIn) {
    return mainRoutes;
  } else {
    return authRoutes;
  }


}
