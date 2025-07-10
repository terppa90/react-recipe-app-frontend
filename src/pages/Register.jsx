import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const { register } = useAuth();
  const [form, setForm] = useState({ username: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(form.username, form.password);
      navigate('/login');
      // eslint-disable-next-line no-unused-vars
    } catch (err) {
      alert('Rekisteröinti epäonnistui');
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h2 className="text-xl font-semibold mb-4">Rekisteröidy</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          name="username"
          onChange={handleChange}
          placeholder="Käyttäjänimi"
          className="border p-2 w-full placeholder:text-gray-400 dark:placeholder:text-gray-500"
        />
        <input
          type="password"
          name="password"
          onChange={handleChange}
          placeholder="Salasana"
          className="border p-2 w-full placeholder:text-gray-400 dark:placeholder:text-gray-500"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Rekisteröidy
        </button>
      </form>
    </div>
  );
}
