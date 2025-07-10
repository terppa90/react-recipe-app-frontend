import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AuthContext from './AuthContext';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // tarkistetaan onko käyttäjä kirjautunut
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get('/api/auth/user');
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
