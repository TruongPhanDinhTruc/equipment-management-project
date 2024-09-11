import { Route, Routes, Navigate } from "react-router-dom";
import './App.css';
import Auth from "./layout/auth";
import Login from "./page/Auth/login";
import Main from "./layout/main";
import UserManagement from "./page/UserManagement/usermanagement";
function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/auth" replace />} />
      <Route path="/auth" element={<Auth />}>
        <Route index element={<Login />} />
      </Route>
      <Route path="/main" element={<Main />}>
        <Route index element={<UserManagement />} />
      </Route>
    </Routes>
  );
}

export default App;
