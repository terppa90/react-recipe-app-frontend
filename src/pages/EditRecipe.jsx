import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Button } from '../components/ui/button';
import LoaderOverlay from '../components/ui/LoaderOverlay';
import MDEditor from '@uiw/react-md-editor';
import useDarkMode from '../hooks/useDarkMode';

export default function EditRecipe() {
  const { id } = useParams();
  const navigate = useNavigate();
  const baseURL = import.meta.env.VITE_API_URL;
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const isDarkMode = useDarkMode();

  const [recipe, setRecipe] = useState({
    title: '',
    ingredients: '',
    instructions: '',
    image: '',
    // images: [],
  });

  useEffect(() => {
    axios
      .get(`${baseURL}/api/recipes/${id}`)
      .then((res) => setRecipe(res.data))
      .catch((err) => console.error('Virhe reseptin latauksessa:', err));
  }, [id]);

  const handleChange = (e) => {
    setRecipe({ ...recipe, [e.target.name]: e.target.value });
  };

  const handleMarkdownChange = (field, value) => {
    setRecipe((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setRecipe((prev) => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validointi
    // if (!recipe.title.trim()) {
    //   alert('Reseptin nimi on pakollinen.');
    //   return;
    // }

    // if (!recipe.ingredients.trim()) {
    //   alert('Ainesosat ovat pakolliset.');
    //   return;
    // }

    // if (!recipe.instructions.trim()) {
    //   alert('Valmistusohjeet ovat pakolliset.');
    //   return;
    // }

    const newErrors = {};

    if (!recipe.title.trim()) newErrors.title = 'Nimi on pakollinen';
    if (!recipe.ingredients.trim())
      newErrors.ingredients = 'Ainesosat ovat pakolliset';
    if (!recipe.instructions.trim())
      newErrors.instructions = 'Valmistusohjeet ovat pakolliset';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});

    setLoading(true);

    try {
      await axios.put(`${baseURL}/api/recipes/${id}`, recipe);
      navigate(`/recipe/${id}`);
    } catch (error) {
      console.error('Virhe päivityksessä:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-4">
      <Link to="/" className="text-blue-600 hover:underline dark:text-blue-400">
        ← Takaisin etusivulle
      </Link>
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
        Muokkaa reseptiä
      </h1>
      <form onSubmit={handleSubmit} className="space-y-3">
        <Input
          name="title"
          value={recipe.title}
          onChange={handleChange}
          placeholder="Reseptin nimi"
        />
        {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}

        <div data-color-mode={isDarkMode ? 'dark' : 'light'}>
          <label className="mb-2 block font-medium text-gray-700 dark:text-white">
            Ainekset
          </label>
          <MDEditor
            value={recipe.ingredients}
            onChange={(val) => handleMarkdownChange('ingredients', val)}
            height={200}
            preview="edit"
            className="prose dark:prose-invert max-w-none dark:!bg-gray-800"
          />
          <div className="mt-2 px-3 py-2 border rounded-md bg-white dark:bg-gray-800 dark:text-white text-sm">
            <MDEditor.Markdown
              source={recipe.ingredients}
              className="prose dark:prose-invert max-w-none dark:!bg-gray-800"
            />
          </div>
          {errors.ingredients && (
            <p className="text-red-500 text-sm">{errors.ingredients}</p>
          )}
        </div>

        <div data-color-mode={isDarkMode ? 'dark' : 'light'}>
          <label className="mb-2 block font-medium text-gray-700 dark:text-white">
            Valmistusohjeet
          </label>
          <MDEditor
            value={recipe.instructions}
            onChange={(val) => handleMarkdownChange('instructions', val)}
            height={200}
            preview="edit"
            className="prose dark:prose-invert max-w-none dark:!bg-gray-800"
          />
          <div className="mt-2 px-3 py-2 border rounded-md bg-white dark:bg-gray-800 dark:text-white text-sm">
            <MDEditor.Markdown
              source={recipe.instructions}
              className="prose dark:prose-invert max-w-none dark:!bg-gray-800"
            />
          </div>
          {errors.instructions && (
            <p className="text-red-500 text-sm">{errors.instructions}</p>
          )}
        </div>

        {/* <Textarea
          name="ingredients"
          value={recipe.ingredients}
          onChange={handleChange}
          placeholder="Ainekset (pilkuilla tai rivinvaihdolla eroteltuna)"
        />
        {errors.ingredients && (
          <p className="text-red-500 text-sm">{errors.ingredients}</p>
        )} */}

        {/* <Textarea
          name="instructions"
          value={recipe.instructions}
          onChange={handleChange}
          placeholder="Valmistusohjeet (numeroituina)"
        />
        {errors.instructions && (
          <p className="text-red-500 text-sm">{errors.instructions}</p>
        )} */}

        <input
          type="file"
          accept="image/*"
          multiple
          className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          onChange={handleImageUpload}
        />
        {recipe.image && (
          <img
            src={recipe.image}
            alt="Esikatselu"
            className="rounded-xl max-h-48"
          />
        )}
        <Button type="submit">Tallenna muutokset</Button>
      </form>

      {loading && <LoaderOverlay message="Muokataan reseptiä..." />}
    </div>
  );
}
