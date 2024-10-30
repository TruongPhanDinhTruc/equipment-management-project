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
      return 1; 
    }
  };
  
  export const addUser = async (newUser) => {
    const nextId = await getNextId();  
    const userRef = ref(realtimeDB, `users/${nextId}`);  
    await set(userRef, {
      id: nextId,                  
      userEmail: newUser.userEmail,
      userName: newUser.userName,
      userPassword: newUser.userPassword,
      userPhone: newUser.userPhone  
    });
  };
  
  export const getUsers = async () => {
    const usersRef = ref(realtimeDB, 'users');
    const snapshot = await get(usersRef);
    if (snapshot.exists()) {
      const data = snapshot.val();
      return Object.keys(data).map(key => data[key]);  
    } else {
      return [];
    }
  };
  
  export const updateUser = async (id, updatedUser) => {
    const userRef = ref(realtimeDB, `users/${id}`);
    await update(userRef, updatedUser);
  };
  
  export const deleteUser = async (id) => {
    const userRef = ref(realtimeDB, `users/${id}`);
    await remove(userRef);
  };