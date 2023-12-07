import { userSchema } from "./userSchema";

 export const getCollection = async (db) => {
    const users = await db.collection({
      name: 'users',
      schema: userSchema
    });
  
    return users;
  };
  
  export const findUser = async (users, username, pin) => {
    const foundUser = await users.findOne({ selector: { username, pin }}).exec();
    return foundUser;
  };
  
  export const registerUser = async (users, username, pin) => {
    const existingUser = await findUser(users, username, pin);
    if (existingUser) {
      throw new Error('User already exists');
    }
    const newUser = await users.insert({ username, pin });
    return newUser;
  };
  