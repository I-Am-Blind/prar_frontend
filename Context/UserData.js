"use client"
import React, { createContext, useRef, useContext } from 'react';

const UserData = createContext(null);

export const DataProvider = ({ children }) => {
    
 const userdata = useRef({users:[]})

  return (
    <UserData.Provider value={{ userdata }}>
      {children}
    </UserData.Provider>
  );
};

export const useUserData = () => useContext(UserData);
