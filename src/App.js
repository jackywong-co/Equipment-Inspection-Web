import {
  Routes,
  Route
} from "react-router-dom";
import SigIn from "./pages/SigIn";
import SPage from "./pages/SPage";


function App() {
  return (
    <div className="App">
      <h1>Welcome to React Router!</h1>
      <Routes>
        <Route path="/" element={<SigIn />} />
        <Route path="s" element={<SPage />} />
      </Routes>
    </div>

  );
}

export default App;
