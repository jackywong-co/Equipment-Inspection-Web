// import { Routes, Route, useNavigate, Navigate } from "react-router-dom";
// import Login from "./pages/Login";
// import Dashboard from "./pages/Dashboard";
// import { createTheme, ThemeProvider } from '@mui/material/styles';
// import Header from "./components/Header/Header"
// import { useContext } from "react";
// import AuthContext from "./services/auth.context";
// import NotFound from "./pages/Page404";


// function App() {
//   const authCtx = useContext(AuthContext)
//   const theme = createTheme();

//   return (
//     <div className="App">
//       <ThemeProvider theme={theme}>
//         <Header />
//         <Routes>

//           {!authCtx.isLoggedIn && (
//             <Route path="login" element={<Login />} />
//           )}

//           {authCtx.isLoggedIn && (
//             <Route path="/" element={<Dashboard />} />
//           )}

//           <Route path="*" element={<Navigate to="404" />} />
//           <Route path="404" element={<NotFound />} />



//         </Routes>
//       </ThemeProvider>
//     </div>
//   );
// }

// export default App;




// routes
import Router from './routes';
// theme
import ThemeConfig from './theme';
import GlobalStyles from './theme/globalStyles';
// components
import ScrollToTop from './components/ScrollToTop';
// import { BaseOptionChartStyle } from './components/charts/BaseOptionChart';

// ----------------------------------------------------------------------

export default function App() {
  return (
    <ThemeConfig>
      <ScrollToTop />
      <GlobalStyles />
      {/* <BaseOptionChartStyle /> */}
      <Router />
    </ThemeConfig>
  );
}
