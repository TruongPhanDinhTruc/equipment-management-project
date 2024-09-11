import { ref, set, push, get, update, remove } from "firebase/database";
import { realtimeDB } from "../../firebase";

const getNextId = async () => {
    const usersRef = ref(realtimeDB, 'users');
    const snapshot = await get(usersRef);
    if (snapshot.exists()) {
      const users = snapshot.val();
      const ids = Object.values(users).map(user => parseInt(user.id, 10));
      return Math.max(...ids) + 1;
    } else {
      return 1;  // Nếu chưa có user nào thì ID bắt đầu từ 1
    }
  };
  
  // Hàm thêm user mới với các thông tin cần thiết
  export const addUser = async (newUser) => {
    const nextId = await getNextId();  // Lấy ID tiếp theo
    const userRef = ref(realtimeDB, `users/${nextId}`);  // Lưu với ID tăng dần
    await set(userRef, {
      id: nextId,                  // Lưu ID thứ tự tăng dần
      userEmail: newUser.userEmail,
      userName: newUser.userName,
      userPassword: newUser.userPassword,
      userPhone: newUser.userPhone   // Thay đổi từ Phone thành userPhone
    });
  };
  
  // Hàm lấy toàn bộ users
  export const getUsers = async () => {
    const usersRef = ref(realtimeDB, 'users');
    const snapshot = await get(usersRef);
    if (snapshot.exists()) {
      const data = snapshot.val();
      return Object.keys(data).map(key => data[key]);  // Trả về danh sách users
    } else {
      return [];
    }
  };
  
  // Hàm cập nhật thông tin user
  export const updateUser = async (id, updatedUser) => {
    const userRef = ref(realtimeDB, `users/${id}`);
    await update(userRef, updatedUser);
  };
  
  // Hàm xóa user
  export const deleteUser = async (id) => {
    const userRef = ref(realtimeDB, `users/${id}`);
    await remove(userRef);
  };