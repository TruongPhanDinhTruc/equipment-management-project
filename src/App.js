import { Route, Routes, Navigate } from "react-router-dom";
import './App.css';
import Auth from "./layout/auth";
import Login from "./page/Auth/login";
import Main from "./layout/main";
import UserManagement from "./page/UserManagement/usermanagement";
import EquipManagement from "./page/EquipManagement/equManagement";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/auth" replace />} />
      <Route path="/auth" element={<Auth />}>
        <Route index element={<Login />} />
      </Route>
      <Route path="/main" element={<Main />}>
        <Route index path="/main/user-management" element={<UserManagement />} />
        <Route index element={<UserManagement />} />
        <Route path="/main/equip-management" element={<EquipManagement />} />
      </Route>
    </Routes>
  );
}

export default App;
