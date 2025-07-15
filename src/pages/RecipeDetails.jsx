import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from '../components/ui/button';
import LoaderOverlay from '../components/ui/LoaderOverlay';
import { useAuth } from '../context/AuthContext';
import { Textarea } from '../components/ui/textarea';
import MDEditor from '@uiw/react-md-editor';
import useDarkMode from '../hooks/useDarkMode';
import RecipeListLoader from '../components/ui/RecipeListLoader';

export default function RecipeDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const { currentUser } = useAuth();
  const baseURL = import.meta.env.VITE_API_URL;
  const maxCommentLength = 500;
  const [notFound, setNotFound] = useState(false);
  const isDarkMode = useDarkMode();
  // const [recentRecipes, setRecentRecipes] = useState([]);
  const [suggestedRecipes, setSuggestedRecipes] = useState([]);
  const [loadingRecipe, setLoadingRecipe] = useState(false);
  // const [relatedRecipes, setRelatedRecipes] = useState([]);
  const [relatedLoading, setRelatedLoading] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setLoadingRecipe(true);
    setRecipe(null);

    fetchRecipe();
    fetchRelatedRecipes();
  }, [id]);

  const fetchRecipe = async () => {
    try {
      const res = await axios.get(`${baseURL}/api/recipes/${id}`);
      console.log('Reseptin luoja: ', res.data.userId);

      setRecipe(res.data);
    } catch (err) {
      console.error('Virhe reseptin haussa:', err);
      if (err.response && err.response.status === 404) {
        setNotFound(true);
      } else {
        setNotFound(true);
      }
    } finally {
      setLoadingRecipe(false);
    }
  };

  const fetchRelatedRecipes = async () => {
    setRelatedLoading(true);

    try {
      const res = await axios.get(`${baseURL}/api/recipes/suggested/${id}`);

      setSuggestedRecipes(res.data);
    } catch (err) {
      console.error('Virhe suositeltuja reseptejä haettaessa:', err);
    } finally {
      setRelatedLoading(false);
    }
  };

  const submitReview = async () => {
    setErrorMessage('');

    // Validointi: arvosana on pakollinen
    if (!rating || rating < 1 || rating > 5) {
      setErrorMessage('Valitse arvosana välillä 1–5.');
      return;
    }

    // Validointi: kommentti ei saa olla tyhjä
    if (!comment || comment.trim() === '') {
      setErrorMessage('Kirjoita kommentti.');
      return;
    }

    if (comment.length > maxCommentLength) {
      setErrorMessage(
        `Kommentti saa olla enintään ${maxCommentLength} merkkiä pitkä.`
      );
      return;
    }

    try {
      await axios.post(
        `${baseURL}/api/recipes/${id}/reviews`,
        { rating, comment },
        { withCredentials: true }
      );
      setReviewSubmitted(true);
      fetchRecipe(); // Päivitä resepti uusilla arvosteluilla
    } catch (error) {
      if (
        error.response &&
        error.response.status === 400 &&
        error.response.data.message === 'Olet jo arvostellut tämän reseptin'
      ) {
        setErrorMessage('Olet jo arvostellut tämän reseptin.');
      } else {
        setErrorMessage('Jokin meni pieleen arvostelun tallennuksessa.');
      }
    }
  };

  const handleDeleteReview = async () => {
    const confirm = window.confirm('Haluatko varmasti poistaa arvostelusi?');

    if (!confirm) return;

    try {
      await axios.delete(`${baseURL}/api/recipes/${id}/reviews`, {
        withCredentials: true,
      });
      fetchRecipe(); // Päivitä näkymä
    } catch (error) {
      console.error('Virhe arvostelun poistossa:', error);
    }
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm('Haluatko varmasti poistaa tämän reseptin?');
    if (!confirm) return;

    setLoading(true);

    try {
      console.log('Tässä id: ' + id);

      await axios.delete(`${baseURL}/api/recipes/${id}`, {
        withCredentials: true,
      });
      navigate('/');
    } catch (error) {
      console.error(
        'Virhe poistettaessa:',
        error.response?.data || error.message
      );
    }
  };

  if ((!recipe && !notFound) || loadingRecipe) {
    return <LoaderOverlay message="Ladataan reseptiä..." />;
  }

  if (notFound) {
    return (
      <div className="text-center mt-20 text-gray-800 dark:text-white">
        <h1 className="text-3xl font-bold mb-4">404 – Reseptiä ei löytynyt</h1>
        <p className="mb-6">
          Etsimääsi reseptiä ei ole olemassa tai se on poistettu.
        </p>
        <Link to="/" className="text-blue-500 hover:underline">
          ← Takaisin etusivulle
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-4">
      <Link to="/" className="text-blue-600 hover:underline dark:text-blue-400">
        ← Takaisin etusivulle
      </Link>

      <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
        {recipe.title}
      </h1>

      {recipe.userId && (
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Reseptin lisäsi:{' '}
          <span className="font-medium">{recipe.userId.username}</span>
        </p>
      )}

      {/* Kuvat */}
      {recipe.images && recipe.images.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {recipe.images.map((img, idx) => (
            <img
              key={idx}
              src={img}
              alt={`${recipe.title} kuva ${idx + 1}`}
              className="rounded-xl object-cover max-h-64 w-full"
            />
          ))}
        </div>
      ) : (
        recipe.image && (
          <img
            src={recipe.image}
            alt={recipe.title}
            className="rounded-xl object-cover max-h-64 w-full"
          />
        )
      )}

      {/* Ainekset */}
      <div data-color-mode={isDarkMode ? 'dark' : 'light'}>
        <h2 className="text-xl my-4 font-semibold mt-4 text-gray-700 dark:text-white">
          Ainekset:
        </h2>
        <MDEditor.Markdown
          source={recipe.ingredients}
          className="p-4 rounded-xl prose dark:prose-invert max-w-none !bg-blue-50 dark:!bg-gray-800"
        />
      </div>

      {/* Ohjeet */}
      <div data-color-mode={isDarkMode ? 'dark' : 'light'}>
        <h2 className="text-xl my-4 font-semibold mt-4 text-gray-700 dark:text-white">
          Valmistusohjeet:
        </h2>
        <MDEditor.Markdown
          source={recipe.instructions}
          className="p-4 rounded-xl prose dark:prose-invert max-w-none !bg-blue-50 dark:!bg-gray-800"
        />
      </div>
      {currentUser?.username === recipe.userId?.username && (
        <div className="mt-4 flex space-x-2">
          <Link to={`/edit/${recipe._id}`}>
            <Button size="sm">Muokkaa</Button>
          </Link>
          <Button
            size="sm"
            variant="destructive"
            // className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            onClick={() => handleDelete(recipe._id)}
          >
            Poista
          </Button>
        </div>
      )}

      <div
        className="mt-6 space-y-4"
        data-color-mode={isDarkMode ? 'dark' : 'light'}
      >
        <h2 className="text-xl font-semibold text-gray-700 dark:text-white">
          Arvostelut:
        </h2>

        {recipe.reviews && recipe.reviews.length > 0 ? (
          recipe.reviews.map((rev, i) => (
            <div
              key={i}
              className="border rounded p-3 !bg-blue-50 dark:!bg-gray-800"
            >
              <p className="font-semibold text-gray-800 dark:text-white">
                {rev.username}
              </p>
              <p className="text-yellow-500">
                {'★'.repeat(rev.rating)}
                {'☆'.repeat(5 - rev.rating)}
              </p>
              <p className="text-gray-700 dark:text-gray-300 break-words whitespace-pre-wrap">
                {rev.comment}
              </p>
              <span className="text-xs text-gray-500">
                {new Date(rev.createdAt).toLocaleDateString('fi-FI')} klo{' '}
                {new Date(rev.createdAt).toLocaleTimeString('fi-FI', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>

              {currentUser?.username === rev.username && (
                <div className="pt-2 text-sm">
                  <button
                    onClick={handleDeleteReview}
                    className="text-sm text-red-500 hover:underline hover:text-red-700 transition-colors"
                  >
                    Poista arvostelu
                  </button>
                </div>
              )}
            </div>
          ))
        ) : (
          <p className="text-gray-600 dark:text-gray-400">
            Ei vielä arvosteluja.
          </p>
        )}
      </div>

      {/* Lisää arvostelu */}
      {currentUser && !reviewSubmitted && (
        <div className="mt-6 space-y-2 border-t pt-4">
          <h3 className="text-lg font-semibold text-gray-700 dark:text-white">
            Jätä oma arvostelusi
          </h3>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((val) => (
              <button
                key={val}
                type="button"
                onClick={() => setRating(val)}
                className={`text-2xl cursor-pointer ${
                  rating >= val ? 'text-yellow-500' : 'text-gray-300'
                }`}
              >
                ★
              </button>
            ))}
          </div>
          <Textarea
            rows={3}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Kirjoita arvostelusi..."
            maxLength={maxCommentLength}
          />
          <p className="text-sm text-gray-500 mt-1">
            {comment.length}/{maxCommentLength} merkkiä
          </p>
          <Button onClick={submitReview}>Lähetä arvostelu</Button>
        </div>
      )}

      {/* Arvostelujen ilmoitukset käyttöliittymässä */}
      {reviewSubmitted && (
        <p className="text-green-600 dark:text-green-400">
          Kiitos arvostelustasi!
        </p>
      )}

      {errorMessage && (
        <p className="text-red-600 bg-red-100 px-3 py-2 rounded-md">
          {errorMessage}
        </p>
      )}

      <div className="mt-10">
        <h2 className="text-xl font-semibold text-gray-700 dark:text-white mb-4">
          Katso myös:
        </h2>

        {relatedLoading ? (
          <RecipeListLoader />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {suggestedRecipes.map((r) => (
              <Link
                to={`/recipe/${r._id}`}
                key={r._id}
                className="block border rounded-xl overflow-hidden hover:shadow-lg transition"
              >
                <img
                  src={r.image}
                  alt={r.title}
                  className="w-full h-40 object-cover"
                />
                <div className="p-3 text-gray-800 dark:text-white">
                  <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                    {r.title}
                  </h2>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {loading && <LoaderOverlay message="Poistetaan reseptiä..." />}
    </div>
  );
}
