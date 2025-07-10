import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from '../components/ui/button';
import LoaderOverlay from '../components/ui/loaderOverlay';
import Logo from '../assets/logo2.svg';
import { useAuth } from '../context/AuthContext';
import RecipeListLoader from '../components/ui/RecipeListLoader';

export default function Home() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
  const navigate = useNavigate();

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const recipesPerPage = 4;
  const indexOfLast = currentPage * recipesPerPage;
  const indexOfFirst = indexOfLast - recipesPerPage;
  const currentRecipes = recipes.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(recipes.length / recipesPerPage);
  const { currentUser, logout } = useAuth();

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 1000); // odottaa 1000ms ennen hakua

    return () => clearTimeout(timeout); // jos käyttäjä kirjoittaa lisää, edellinen timeout perutaan
  }, [searchTerm]);

  useEffect(() => {
    fetchRecipes(debouncedSearchTerm);
  }, [debouncedSearchTerm]);

  const fetchRecipes = async (search = '') => {
    setLoading(true);

    try {
      const res = await axios.get(`${baseURL}/api/recipes`);
      let filtered = res.data;

      if (search) {
        const s = search.toLowerCase();
        filtered = filtered.filter((r) => r.title.toLowerCase().includes(s));
      }

      setRecipes(filtered);
    } catch (err) {
      console.error('Virhe reseptien haussa:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* <div className="flex items-center gap-2">
        <img
          src={Logo}
          alt="Logo"
          className="w-8 h-8 dark:fill-white dark:stroke-white"
        />
        <h1 className="text-3xl font-bold">Reseptit</h1>
      </div> */}
      <div className="flex justify-end gap-2 mb-4">
        {currentUser ? (
          <>
            <span className="text-gray-700 dark:text-white">
              Tervetuloa, {currentUser.username}
            </span>
            <button
              onClick={logout}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
            >
              Kirjaudu ulos
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
            >
              Kirjaudu
            </Link>
            <Link
              to="/register"
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
            >
              Rekisteröidy
            </Link>
          </>
        )}
      </div>

      <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
        Reseptisovellus
      </h1>
      {/* Näytetään uusi resepti -nappi vain jos käyttäjä on kirjautunut */}
      {currentUser && (
        <Button onClick={() => navigate('/create')}>+ Uusi resepti</Button>
      )}

      <input
        type="text"
        placeholder="Etsi reseptejä..."
        className="w-full p-2 border rounded-md dark:bg-gray-800 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-300"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {loading ? (
        <RecipeListLoader />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {currentRecipes.map((recipe) => (
            <Link
              to={`/recipe/${recipe._id}`}
              key={recipe._id}
              className="block rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition"
            >
              {recipe.image && (
                <img
                  src={recipe.image}
                  alt={recipe.title}
                  className="h-48 w-full object-cover"
                />
              )}
              <div className="p-4 bg-white dark:bg-gray-800">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                  {recipe.title}
                </h2>
              </div>
            </Link>
          ))}
        </div>
      )}

      <div className="flex justify-center space-x-2 mt-6">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
          <button
            key={pageNum}
            onClick={() => handlePageChange(pageNum)}
            className={`px-3 py-1 rounded-md border ${
              currentPage === pageNum
                ? 'bg-blue-600 text-white'
                : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-white'
            }`}
          >
            {pageNum}
          </button>
        ))}
      </div>

      {/* {loading && <LoaderOverlay message="Ladataan reseptejä..." />} */}
    </div>
  );
}
