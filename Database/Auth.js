import { getDbInstance } from "./database"

export const Signup = async (user) => {
  try {
    const db = getDbInstance();
    await db.users.add({...user, upcoming_appointments : 'No Upcoming Appointments' });
    return { message: 'Local Db Signup Successful' }
  } catch (error) {
    return { message: 'An Error Occured During Signup' , error :true }
  }
};


export const Signin = async (user) => {
  try {
    const db = getDbInstance();
    const foundUser = await db.users.where('username').equals(user.username).and(u => u.pin === user?.pin).first();
    if (!foundUser) {
      return { userId: null, message: 'Invalid credentials or user not found' ,error :true };
    }
    return { userId: foundUser.id, username : foundUser.username, name : foundUser.name ,message: `User ${foundUser.username} logged in `,upcoming_appointments : foundUser.upcoming_appointments , error :false };
  } catch (error) {
    return { userId: null, message: 'An error occurred during signin', error :true };
  }
};