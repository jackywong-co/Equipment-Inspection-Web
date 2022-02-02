import { Routes, Route, useNavigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Header from "./components/Header"


function App() {

  const theme = createTheme();

  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        <Header />
        <Routes>
          <Route path="/Login" element={<Login />} />
          <Route path="/" element={<Dashboard />} />
        </Routes>
      </ThemeProvider>
    </div>
  );
}

export default App;
