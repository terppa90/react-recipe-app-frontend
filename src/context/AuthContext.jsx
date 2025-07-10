import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  // const [user, setUser] = useState(() => {
  //   const saved = localStorage.getItem('user');
  //   return saved ? JSON.parse(saved) : null;
  // });

  // Haetaan käyttäjä kun sovellus käynnistyy
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get('/api/auth/user', {
          withCredentials: true,
        });
        setCurrentUser(res.data);
      } catch (err) {
        setCurrentUser(null);
      }
    };

    fetchUser();
  }, []);

  const register = async (username, password) => {
    await axios.post('/api/auth/register', { username, password });
    // const res = await axios.get('/api/auth/user', { withCredentials: true });
    // setUser(res.data);
  };

  const login = async ({ username, password }) => {
    try {
      const res = await axios.post('/api/auth/login', { username, password });
      console.log('Kirjautuneen käyttäjän tiedot: ', res.data);

      const userRes = await axios.get('/api/auth/user', {
        withCredentials: true,
      });

      setCurrentUser(userRes.data);
      localStorage.setItem('user', JSON.stringify(res.data));
    } catch (err) {
      console.error('Virhe kirjautumisessa:', err);
    }
  };

  const logout = async () => {
    try {
      await axios.post('/api/auth/logout', {}, { withCredentials: true });
    } catch (err) {
      console.error('Virhe uloskirjautumisessa:', err);
    }
    setCurrentUser(null);
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  // const login = async (username, password) => {
  //   const res = await axios.post('/api/auth/login', { username, password });
  //   localStorage.setItem('token', res.data.token);
  //   setUser({ username });
  // };

  // const logout = () => {
  //   localStorage.removeItem('token');
  //   setUser(null);
  // };

  return (
    <AuthContext.Provider value={{ currentUser, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
