import { getDbInstance } from "./database"

export const Signup = async (user) => {
  try {
    const db = getDbInstance();
    const existingUser = await db.users.where('username').equals(user?.username).first();
    if (existingUser) {
      return { message: 'User Already Exists' ,error :true };
    }
    await db.users.add({...user});
    return { message: `Registered User :  ${user?.username}`, error :false};
  } catch (error) {
    return { message: 'An Error Occured During Signup' , error :true }
  }
};


export const Signin = async (user) => {
  try {
    const db = getDbInstance();
    const foundUser = await db.users.where('username').equals(user.username).and(u => u.pin === user?.pin).first();
    if (!foundUser) {
      return { userId: null, message: 'Invalid credentials' ,error :true };
    }
    console.log(foundUser)
    return { userId: foundUser.id, message: `User ${foundUser.username} logged in `, error :false };
  } catch (error) {
    return { userId: null, message: 'An error occurred during signin', error :true };
  }
};