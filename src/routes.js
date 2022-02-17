import { Navigate, useRoutes } from 'react-router-dom';
// layouts
import DashboardLayout from './layouts/dashboard';
import LogoOnlyLayout from './layouts/LogoOnlyLayout';
//
import Login from './pages/Login';
// import Register from './pages/Register';
import DashboardApp from './pages/DashboardApp';
// import Products from './pages/Products';
import Form from './pages/Form';
import User from './pages/User';
import Room from './pages/Room';
import Equipment from './pages/Equipment';
import NotFound from './pages/Page404';
//
import { useContext } from "react";
import AuthContext from "./services/auth.context";
// ----------------------------------------------------------------------
export default function Router() {
  const authCtx = useContext(AuthContext)
  const mainRoutes = useRoutes([
    {
      path: '/dashboard',
      element: <DashboardLayout />,
      children: [
        { path: '/dashboard', element: <Navigate to="app" replace /> },
        { path: 'app', element: <DashboardApp /> },
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
  console.log(authCtx.isLoggedIn)
  if (authCtx.isLoggedIn) {
    return mainRoutes;
  } else {
    return authRoutes;
  }


}
