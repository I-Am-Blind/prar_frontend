import { getDatabase } from './database';
import {  findUser, registerUser } from './userOperations';

export const Signin = async (user) => {
  const db = await getDatabase();
  const users = db.users

  const foundUser = await findUser(users, user.username, user.pin);

  if (foundUser) {
    console.log('User signed in:', foundUser);
  } else {
    console.error('User not found');
  }
};

export const Signup = async (user) => {
  const db = await getDatabase();
  const users = db.users

  try {
    const newUser = await registerUser(users, user.username, user.pin);
    console.log('User registered:', newUser);
  } catch (error) {
    console.error('Error during registration:', error.message);
  }
};
