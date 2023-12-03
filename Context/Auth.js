"use client"
import React, { createContext, useRef, useContext } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    
 const user = useRef({firstname : '' , lastname : ''})

  return (
    <AuthContext.Provider value={{ user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
