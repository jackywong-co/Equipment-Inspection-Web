import { Routes, Route, useNavigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import { ThemeProvider } from '@mui/material/styles';
import Header from "./components/Header"

function App() {
  return (
    <div className="App">
      <ThemeProvider>
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
