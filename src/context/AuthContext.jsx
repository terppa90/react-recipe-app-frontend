import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
const baseURL = import.meta.env.VITE_API_URL;

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true); // Alussa true, kun tarkistetaan kirjautuminen

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${baseURL}/api/auth/user`, {
          withCredentials: true, // Vaaditaan jotta cookie (JWT) lähetetään mukana
        });
        console.log('Current user(logged in): ', res.data);

        setCurrentUser(res.data);
      } catch (err) {
        console.log(err);

        setCurrentUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const register = async (username, password) => {
    await axios.post(`${baseURL}/api/auth/register`, { username, password });
  };

  const login = async ({ username, password }) => {
    try {
      const res = await axios.post(
        `${baseURL}/api/auth/login`,
        {
          username,
          password,
        },
        { withCredentials: true }
      );
      console.log('Kirjautuneen käyttäjän tiedot: ', res.data);

      // const userRes = await axios.get(`${baseURL}/api/auth/user`, {
      //   withCredentials: true,
      // });

      // setCurrentUser(userRes.data);
      setCurrentUser(res.data.user);
      window.location.href = '/';
      // localStorage.setItem('user', JSON.stringify(res.data));
    } catch (err) {
      console.error('Virhe kirjautumisessa:', err);
    }
  };

  const logout = async () => {
    try {
      await axios.post(
        `${baseURL}/api/auth/logout`,
        {},
        { withCredentials: true }
      );
    } catch (err) {
      console.error('Virhe uloskirjautumisessa:', err);
    }
    setCurrentUser(null);
    window.location.href = '/';
  };

  return (
    <AuthContext.Provider value={{ currentUser, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
