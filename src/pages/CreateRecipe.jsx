import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Button } from '../components/ui/button';
import LoaderOverlay from '../components/ui/LoaderOverlay';
import MDEditor from '@uiw/react-md-editor';
import useDarkMode from '../hooks/useDarkMode';

export default function CreateRecipe() {
  const navigate = useNavigate();
  const baseURL = import.meta.env.VITE_API_URL;
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const isDarkMode = useDarkMode();

  const [newRecipe, setNewRecipe] = useState({
    title: '',
    ingredients: '',
    instructions: '',
    image: '',
    // images: [],
  });

  const handleChange = (e) => {
    setNewRecipe({ ...newRecipe, [e.target.name]: e.target.value });
  };

  const handleMarkdownChange = (field, value) => {
    setNewRecipe((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewRecipe((prev) => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    console.log('Lähetettävä data: ' + newRecipe);
    e.preventDefault();

    const newErrors = {};

    // Validointi
    if (!newRecipe.title.trim()) newErrors.title = 'Nimi on pakollinen';
    if (!newRecipe.ingredients.trim())
      newErrors.ingredients = 'Ainesosat ovat pakolliset';
    if (!newRecipe.instructions.trim())
      newErrors.instructions = 'Valmistusohjeet ovat pakolliset';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});

    setLoading(true);

    try {
      const res = await axios.post(`${baseURL}/api/recipes`, newRecipe);
      const newId = res.data._id;
      navigate(`/recipe/${newId}`);
    } catch (err) {
      console.error('Virhe reseptin tallennuksessa:', err);
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
        Luo uusi resepti
      </h1>
      <form onSubmit={handleSubmit} className="space-y-3">
        <Input
          name="title"
          value={newRecipe.title}
          onChange={handleChange}
          placeholder="Reseptin nimi"
          className="placeholder:text-gray-400 dark:placeholder:text-gray-500 dark:!bg-gray-800"
        />
        {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}

        <div data-color-mode={isDarkMode ? 'dark' : 'light'}>
          <label className="mb-2 block font-medium text-gray-700 dark:text-white">
            Ainekset
          </label>
          <MDEditor
            value={newRecipe.ingredients}
            onChange={(val) => handleMarkdownChange('ingredients', val)}
            height={200}
            preview="edit"
            className="prose dark:prose-invert max-w-none dark:!bg-gray-800"
          />
          <div className="mt-2 px-3 py-2 border rounded-md !bg-blue-50 dark:!bg-gray-800 dark:text-white text-sm">
            <MDEditor.Markdown
              source={newRecipe.ingredients}
              className="prose dark:prose-invert max-w-none !bg-blue-50 dark:!bg-gray-800"
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
            value={newRecipe.instructions}
            onChange={(val) => handleMarkdownChange('instructions', val)}
            height={200}
            preview="edit"
            className="prose dark:prose-invert max-w-none dark:!bg-gray-800"
          />
          <div className="mt-2 px-3 py-2 border rounded-md !bg-blue-50 dark:!bg-gray-800 dark:text-white text-sm">
            <MDEditor.Markdown
              source={newRecipe.instructions}
              className="prose dark:prose-invert max-w-none !bg-blue-50 dark:!bg-gray-800"
            />
          </div>
          {errors.instructions && (
            <p className="text-red-500 text-sm">{errors.instructions}</p>
          )}
        </div>

        {/* <Textarea
          name="ingredients"
          value={newRecipe.ingredients}
          onChange={handleChange}
          placeholder="Ainekset (pilkuilla tai rivinvaihdolla eroteltuna)"
        />
        {errors.ingredients && (
          <p className="text-red-500 text-sm">{errors.ingredients}</p>
        )}

        <Textarea
          name="instructions"
          value={newRecipe.instructions}
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
          onChange={handleImageUpload}
          className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
        {newRecipe.image && (
          <img
            src={newRecipe.image}
            alt="Esikatselu"
            className="mt-2 max-h-48 rounded-xl"
          />
        )}
        <Button type="submit" disabled={loading}>
          Tallenna resepti
        </Button>
      </form>

      {loading && <LoaderOverlay message="Luodaan uutta reseptiä..." />}
    </div>
  );
}

// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import MDEditor from '@uiw/react-md-editor';
// import { Input } from '../components/ui/input';
// import { Button } from '../components/ui/button';
// import LoaderOverlay from '../components/ui/loaderOverlay';

// export default function CreateRecipe() {
//   const [title, setTitle] = useState('');
//   const [ingredients, setIngredients] = useState('');
//   const [instructions, setInstructions] = useState('');
//   const [image, setImage] = useState('');
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();
//   const baseURL = import.meta.env.VITE_API_URL;

//   const handleImageUpload = (e) => {
//     const file = e.target.files[0];
//     if (file && file.type.startsWith('image/')) {
//       const reader = new FileReader();
//       reader.onloadend = () => setImage(reader.result);
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     try {
//       const res = await axios.post(
//         `${baseURL}/api/recipes`,
//         { title, ingredients, instructions, image },
//         { withCredentials: true }
//       );
//       navigate(`/recipe/${res.data._id}`);
//     } catch (err) {
//       console.error('Virhe reseptin tallennuksessa:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-2xl mx-auto p-6 space-y-4">
//       <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
//         Luo uusi resepti
//       </h1>
//       <form onSubmit={handleSubmit} className="space-y-4">
//         <Input
//           name="title"
//           value={title}
//           onChange={(e) => setTitle(e.target.value)}
//           placeholder="Reseptin nimi"
//         />
//         <div data-color-mode="light">
//           <label className="block font-medium text-gray-700 dark:text-white">
//             Ainekset
//           </label>
//           <MDEditor
//             value={ingredients}
//             onChange={setIngredients}
//             height={200}
//           />
//         </div>
//         <div data-color-mode="light">
//           <label className="block font-medium text-gray-700 dark:text-white">
//             Valmistusohjeet
//           </label>
//           <MDEditor
//             value={instructions}
//             onChange={setInstructions}
//             height={200}
//           />
//         </div>
//         <input
//           type="file"
//           accept="image/*"
//           className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
//           onChange={handleImageUpload}
//         />
//         {image && (
//           <img src={image} alt="Esikatselu" className="rounded-xl max-h-48" />
//         )}
//         <Button type="submit">Tallenna resepti</Button>
//       </form>

//       {loading && <LoaderOverlay message="Luodaan uutta reseptiä..." />}
//     </div>
//   );
// }
