import React, { useState, useEffect } from "react";
import { addUser, getUsers, updateUser, deleteUser } from "./firebaseService";

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [newUser, setNewUser] = useState({
    userEmail: "",
    userName: "",
    userPassword: "",
    userPhone: ""
  });
  const [selectedUser, setSelectedUser] = useState(null);
  const [updatedUser, setUpdatedUser] = useState({
    userEmail: "",
    userName: "",
    userPassword: "",
    userPhone: ""
  });
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false); 
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const users = await getUsers();
    setUsers(users);
  };

  const isValidEmail = (email) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  };

  const isValidPhone = (phone) => {
    const phonePattern = /^\d{10}$/;
    return phonePattern.test(phone);
  };

  const isUniqueEmail = (email) => {
    return !users.some(
      (user) => user.userEmail === email
    );
  };
  
  const isUniquePhone = (phone) => {
    return !users.some(
      (user) => user.userPhone === phone
    );
  };

  const handleAddUser = async () => {
    const { userEmail, userName, userPassword, userPhone } = newUser;

    if (!userEmail || !userName || !userPassword || !userPhone) {
      alert("Please fill all fields.");
      return;
    }

    if (!userName.trim()) {
      alert("Name cannot be empty or just spaces.");
      return;
    }

    if (!isValidEmail(userEmail)) {
      alert("Invalid email format.");
      return;
    }

    if (!isValidPhone(userPhone)) {
      alert("Phone number must be 10 digits.");
      return;
    }

    if (!isUniqueEmail(userEmail)) {
      alert("Email already exists.");
      return;
    }
    if (!isUniquePhone(userPhone)) {
      alert("Phone number already exists.");
      return;
    }

    await addUser(newUser);
    fetchUsers();
    setNewUser({ userEmail: "", userName: "", userPassword: "", userPhone: "" });
    setIsAddModalOpen(false); 
  };

  const handleUpdateUser = async () => {
    const { userEmail, userName, userPhone } = updatedUser;

    if (!userEmail || !userName || !userPhone) {
      alert("Please fill all fields.");
      return;
    }

    if (!userName.trim()) {
      alert("Name cannot be empty or just spaces.");
      return;
    }
    if (!isValidEmail(userEmail)) {
      alert("Invalid email format.");
      return;
    }
  
    if (!isValidPhone(userPhone)) {
      alert("Phone number must be 10 digits.");
      return;
    }
    if (users.some(user => user.userEmail === userEmail && user.id !== selectedUser.id)) {
      alert("Email already exists.");
      return;
    }
  
    if (users.some(user => user.userPhone === userPhone && user.id !== selectedUser.id)) {
      alert("Phone number already exists.");
      return;
    }
    
    await updateUser(selectedUser.id, updatedUser);
    fetchUsers();
    setIsUpdateModalOpen(false);
  };

  const handleDeleteUser = async (id) => {
    await deleteUser(id);
    fetchUsers();
  };

  const handleUserClick = (user) => {
    setSelectedUser(user);
    setUpdatedUser(user);
    setIsUpdateModalOpen(true);
  };

  const handleDeleteButtonClick = (event, id) => {
    event.stopPropagation(); 
    handleDeleteUser(id);
  };

  const closeAddModal = () => {
    setIsAddModalOpen(false);
  };

  const closeUpdateModal = () => {
    setIsUpdateModalOpen(false);
  };

  const filteredUsers = users.filter(user =>
    user.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.userPhone.includes(searchTerm)
  );

  return (
    <div className="App p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between mb-4">
        <input
          type="text"
          placeholder="Search by Name or Phone"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-3 py-2 border rounded-lg w-full mr-2"
        />
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
        >
          Add User
        </button>
      </div>

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
            {filteredUsers.map((user) => (
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
                    onClick={(e) => handleDeleteButtonClick(e, user.id)}
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

      {isAddModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96">
            <h2 className="text-xl font-bold mb-4">Add New User</h2>
            <div className="mb-4">
              <label className="block mb-2 text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                value={newUser.userEmail}
                onChange={(e) =>
                  setNewUser({ ...newUser, userEmail: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2 text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                value={newUser.userName}
                onChange={(e) =>
                  setNewUser({ ...newUser, userName: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2 text-sm font-medium text-gray-700">Phone</label>
              <input
                type="text"
                value={newUser.userPhone}
                onChange={(e) =>
                  setNewUser({ ...newUser, userPhone: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2 text-sm font-medium text-gray-700">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={newUser.userPassword}
                  onChange={(e) =>
                    setNewUser({ ...newUser, userPassword: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-2 text-gray-500"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>
            <div className="flex justify-end">
              <button
                onClick={handleAddUser}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 mr-2"
              >
                Add
              </button>
              <button
                onClick={closeAddModal}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {isUpdateModalOpen && (
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
                  type={showPassword ? "text" : "password"}
                  value={updatedUser.userPassword}
                  onChange={(e) =>
                    setUpdatedUser({ ...updatedUser, userPassword: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-2 text-gray-500"
                >
                  {showPassword ? "Hide" : "Show"}
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
                onClick={closeUpdateModal}
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
