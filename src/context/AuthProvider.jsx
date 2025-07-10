import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AuthContext from './AuthContext';
const baseURL = import.meta.env.VITE_API_URL;

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // tarkistetaan onko käyttäjä kirjautunut
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get(`${baseURL}/api/auth/user`, {
          withCredentials: true,
        });
        setUser(res.data);
      } catch {
        setUser(null);
      }
    };
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}
