import {
  Routes,
  Route
} from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useEffect } from "react";

const theme = createTheme({
  // typography: {
  //   fontFamily: 'Raleway, Arial',
  // },
});

function checkToken(token){

}

function App() {
  useEffect(()=> checkToken(localStorage.getItem('access_token')))
  return (
    
      <div className="App">
        <ThemeProvider theme={theme}>
        <Routes>
          <Route path="/Login" element={<Login />} />
          <Route path="/" element={<Dashboard />} />
        </Routes>
        </ThemeProvider>
      </div>
    
  );
}

export default App;
