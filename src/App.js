import { Route, Routes, Navigate } from "react-router-dom";
import './App.css';
import Auth from "./layout/auth";
import Login from "./page/Auth/login";
import Main from "./layout/main";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/auth" replace />} />
      <Route path="/auth" element={<Auth />}>
        <Route index element={<Login />} />
      </Route>
      <Route path="/main" element={<Main />}>

      </Route>
    </Routes>
  );
}

export default App;
