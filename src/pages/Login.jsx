// import React, { useState, useContext } from 'react';
// import { AuthProvider } from '../context/AuthProvider';
// import { useNavigate, Link } from 'react-router-dom';
// import { Input } from '../components/ui/input';
// import { Button } from '../components/ui/button';
// import { useAuth } from '../context/useAuth';

// export default function Login() {
//   // const { login } = useContext(AuthProvider);
//   const { login } = useAuth();
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({ email: '', password: '' });
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');
//     setLoading(true);
//     try {
//       await login(formData.email, formData.password);
//       navigate('/');
//     } catch (err) {
//       setError(err.response?.data?.error || 'Kirjautuminen epäonnistui.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-md mx-auto p-6 space-y-6">
//       <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
//         Kirjaudu sisään
//       </h1>

//       <form onSubmit={handleSubmit} className="space-y-4">
//         <Input
//           type="email"
//           name="email"
//           placeholder="Sähköposti"
//           value={formData.email}
//           onChange={handleChange}
//           required
//         />
//         <Input
//           type="password"
//           name="password"
//           placeholder="Salasana"
//           value={formData.password}
//           onChange={handleChange}
//           required
//         />
//         {error && <p className="text-red-500 text-sm">{error}</p>}
//         <Button type="submit" disabled={loading}>
//           {loading ? 'Kirjaudutaan...' : 'Kirjaudu'}
//         </Button>
//       </form>

//       <p className="text-sm text-gray-700 dark:text-gray-300">
//         Ei vielä tiliä?{' '}
//         <Link
//           to="/register"
//           className="text-blue-600 dark:text-blue-400 hover:underline"
//         >
//           Luo käyttäjätunnus
//         </Link>
//       </p>
//     </div>
//   );
// }

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await login(form);
      navigate('/');
    } catch (err) {
      // console.error('Kirjautuminen epäonnistui:', err);
      setError(err.response?.data?.message || 'Kirjautuminen epäonnistui');
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h2 className="text-xl font-semibold mb-4">Kirjaudu sisään</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          name="username"
          placeholder="Käyttäjänimi"
          value={form.username}
          onChange={handleChange}
          className="border p-2 w-full placeholder:text-gray-400 dark:placeholder:text-gray-500"
        />
        <input
          name="password"
          type="password"
          placeholder="Salasana"
          value={form.password}
          onChange={handleChange}
          className="border p-2 w-full placeholder:text-gray-400 dark:placeholder:text-gray-500"
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Kirjaudu
        </button>
      </form>
    </div>
  );
}
