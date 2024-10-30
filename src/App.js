import { Route, Routes, Navigate } from "react-router-dom";
import './App.css';
import Auth from "./layout/auth";
import Login from "./page/Auth/login";
import Main from "./layout/main";
import UserManagement from "./page/UserManagement/usermanagement";
import EquipManagement from "./page/EquipManagement/equManagement";
import MaintenanceManagement from "./page/MaintenanceManagement/maintManagement";
import Dashboard from "./page/Dashboard/dashboard";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/auth" replace />} />
      <Route path="/auth" element={<Auth />}>
        <Route index element={<Login />} />
      </Route>
      <Route path="/main" element={<Main />}>
        <Route path="/main/dashboard" element={<Dashboard />} />
        <Route index element={<Dashboard />} />
        <Route index path="/main/user-management" element={<UserManagement />} />
        <Route path="/main/equip-management" element={<EquipManagement />} />
        <Route path="/main/maintenance-management" element={<MaintenanceManagement />} />
      </Route>
    </Routes>
  );
}

export default App;
