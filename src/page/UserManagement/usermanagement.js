import React, { useState, useEffect } from "react";
import { addUser, getUsers, updateUser, deleteUser } from "./firebaseService";

function UserManagement() {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState(""); // Trạng thái lưu giá trị tìm kiếm
    const [newUser, setNewUser] = useState({
      userEmail: "",
      userName: "",
      userPassword: "", // Trường mật khẩu
      userPhone: ""
    });
    const [selectedUser, setSelectedUser] = useState(null);
    const [updatedUser, setUpdatedUser] = useState({
      userEmail: "",
      userName: "",
      userPassword: "", // Trường mật khẩu
      userPhone: ""
    });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showPassword, setShowPassword] = useState(false); // Trạng thái để điều khiển việc hiển thị mật khẩu
  
    useEffect(() => {
      fetchUsers();
    }, []);
  
    const fetchUsers = async () => {
      const users = await getUsers();
      setUsers(users);
    };
  
    const handleAddUser = async () => {
      if (
        newUser.userEmail.trim() === "" ||
        newUser.userName.trim() === "" ||
        newUser.userPassword.trim() === "" || // Kiểm tra mật khẩu
        newUser.userPhone.trim() === ""
      ) {
        alert("Please fill all fields.");
        return;
      }
  
      await addUser(newUser); // Gửi thông tin mới bao gồm mật khẩu
      fetchUsers();
      setNewUser({ userEmail: "", userName: "", userPassword: "", userPhone: "" }); // Reset form
    };
  
    const handleUpdateUser = async () => {
      await updateUser(selectedUser.id, updatedUser);
      fetchUsers();
      setIsModalOpen(false);
    };
  
    const handleDeleteUser = async (id) => {
      await deleteUser(id);
      fetchUsers();
    };
  
    const handleUserClick = (user) => {
      setSelectedUser(user);
      setUpdatedUser(user);
      setIsModalOpen(true);
    };
  
    const closeModal = () => {
      setIsModalOpen(false);
    };
  
    // Hàm lọc người dùng dựa trên tên hoặc số điện thoại
    const filteredUsers = users.filter(user =>
      user.userName.toLowerCase().includes(searchTerm.toLowerCase()) || // Tìm kiếm theo tên
      user.userPhone.includes(searchTerm) // Tìm kiếm theo số điện thoại
    );
  
    return (
      <div className="App p-6 bg-gray-100 min-h-screen">
        <h1 className="text-2xl font-bold text-center mb-6">User Management</h1>
  
        {/* Input tìm kiếm */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search by Name or Phone"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)} // Cập nhật searchTerm
            className="px-3 py-2 border rounded-lg w-full"
          />
        </div>
  
        {/* Form thêm user mới */}
        <div className="mb-6 p-4 bg-white shadow-lg rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Add New User</h2>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <input
              type="email"
              placeholder="Email"
              value={newUser.userEmail}
              onChange={(e) =>
                setNewUser({ ...newUser, userEmail: e.target.value })
              }
              className="px-3 py-2 border rounded-lg w-full"
            />
            <input
              type="text"
              placeholder="Name"
              value={newUser.userName}
              onChange={(e) =>
                setNewUser({ ...newUser, userName: e.target.value })
              }
              className="px-3 py-2 border rounded-lg w-full"
            />
            <input
              type="password"
              placeholder="Password"
              value={newUser.userPassword}
              onChange={(e) =>
                setNewUser({ ...newUser, userPassword: e.target.value })
              }
              className="px-3 py-2 border rounded-lg w-full"
            />
            <input
              type="text"
              placeholder="Phone"
              value={newUser.userPhone}
              onChange={(e) =>
                setNewUser({ ...newUser, userPhone: e.target.value })
              }
              className="px-3 py-2 border rounded-lg w-full"
            />
          </div>
          <button
            onClick={handleAddUser}
            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
          >
            Add User
          </button>
        </div>
  
        {/* Bảng hiển thị danh sách người dùng */}
        <div className="overflow-x-auto mb-6">
          <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-lg">
            <thead>
              <tr>
                <th className="px-4 py-2 bg-gray-200 border-b">ID</th>
                <th className="px-4 py-2 bg-gray-200 border-b">Email</th>
                <th className="px-4 py-2 bg-gray-200 border-b">Name</th>
                <th className="px-4 py-2 bg-gray-200 border-b">Phone</th>
                <th className="px-4 py-2 bg-gray-200 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => ( // Sử dụng filteredUsers
                <tr
                  key={user.id}
                  className="hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleUserClick(user)}
                >
                  <td className="px-4 py-2 border-b text-center">{user.id}</td>
                  <td className="px-4 py-2 border-b">{user.userEmail}</td>
                  <td className="px-4 py-2 border-b">{user.userName}</td>
                  <td className="px-4 py-2 border-b">{user.userPhone}</td>
                  <td className="px-4 py-2 border-b text-center">
                    <button
                      onClick={() => handleDeleteUser(user.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
  
        {/* Modal chỉnh sửa thông tin user */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-lg shadow-lg p-6 w-96">
              <h2 className="text-xl font-bold mb-4">Update User</h2>
              <div className="mb-4">
                <label className="block mb-2 text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  value={updatedUser.userEmail}
                  onChange={(e) =>
                    setUpdatedUser({ ...updatedUser, userEmail: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2 text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  value={updatedUser.userName}
                  onChange={(e) =>
                    setUpdatedUser({ ...updatedUser, userName: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2 text-sm font-medium text-gray-700">Phone</label>
                <input
                  type="text"
                  value={updatedUser.userPhone}
                  onChange={(e) =>
                    setUpdatedUser({ ...updatedUser, userPhone: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2 text-sm font-medium text-gray-700">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"} // Hiển thị hoặc ẩn mật khẩu
                    value={updatedUser.userPassword}
                    onChange={(e) =>
                      setUpdatedUser({ ...updatedUser, userPassword: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)} // Chuyển đổi trạng thái hiển thị mật khẩu
                    className="absolute right-2 top-2 text-gray-500"
                  >
                    {showPassword ? "Hide" : "Show"} {/* Thay đổi chữ tùy theo trạng thái */}
                  </button>
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  onClick={handleUpdateUser}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 mr-2"
                >
                  Update
                </button>
                <button
                  onClick={closeModal}
                  className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
     
  export default UserManagement;