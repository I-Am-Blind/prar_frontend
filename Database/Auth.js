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

export const GetAllUsers= async () => {
  try {
    const db = getDbInstance();
    const users = await db.users.toArray();
    const userDetails = users.map(user => ({
      username: user.username,
      name: user.name
    }));
    return userDetails;
  } catch (error) {
    return { userId: null, message: 'An error occurred during getting users', error :true };
  }
};