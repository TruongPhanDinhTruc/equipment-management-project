import { Route, Routes, Navigate } from "react-router-dom";
import './App.css';
import Auth from "./layout/auth";
import Login from "./page/Auth/login";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/auth" replace />} />
      <Route path="/auth" element={<Auth />}>
        <Route index element={<Login />} />
      </Route>
    </Routes>
  );
}

export default App;
