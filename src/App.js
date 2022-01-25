import {
  Routes,
  Route
} from "react-router-dom";
import Login from "./pages/Login";
import SPage from "./pages/SPage";


function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/s" element={<Login />} />
        <Route path="/" element={<SPage />} />
      </Routes>
    </div>

  );
}

export default App;
