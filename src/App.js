import {
  Routes,
  Route
} from "react-router-dom";
import Login from "./pages/Login";
import SPage from "./pages/SPage";
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
  // typography: {
  //   fontFamily: 'Raleway, Arial',
  // },
});

function App() {
  return (
    
      <div className="App">
        <ThemeProvider theme={theme}>
        <Routes>
          <Route path="/s" element={<Login />} />
          <Route path="/" element={<SPage />} />
        </Routes>
        </ThemeProvider>
      </div>
    
  );
}

export default App;
