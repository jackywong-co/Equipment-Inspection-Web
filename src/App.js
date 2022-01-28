import {
  Routes,
  Route
} from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useEffect } from "react";

import Header from "./components/Header"

const theme = createTheme({
  // typography: {
  //   fontFamily: 'Raleway, Arial',
  // },
});

function checkToken(token){
  console.log("hi")
    console.log(token)
}

function App() {
  useEffect(()=> checkToken(localStorage.getItem('access_token')))
  return (
    
      <div className="App">
        <ThemeProvider theme={theme}>
        <Header/>
        <Routes>
        
          <Route path="/Login" element={<Login />} />
          <Route path="/" element={<Dashboard />} />
        </Routes>
        </ThemeProvider>
      </div>
    
  );
}

export default App;
 