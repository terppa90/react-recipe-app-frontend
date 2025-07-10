// import React, { useEffect, useState } from 'react';
// import { Card, CardContent } from './components/ui/card';
// import { Button } from './components/ui/button';
// import { Input } from './components/ui/input';
// import { Textarea } from './components/ui/textarea';
// import axios from 'axios';

// export default function RecipeApp() {
//   const [recipes, setRecipes] = useState([]);
//   const [newRecipe, setNewRecipe] = useState({
//     title: '',
//     ingredients: '',
//     instructions: '',
//     image: '',
//   });
//   const [editIndex, setEditIndex] = useState(null);

//   // Hae reseptit backendistä
//   useEffect(() => {
//     axios
//       .get('http://localhost:3001/api/recipes')
//       .then((res) => setRecipes(res.data))
//       .catch((err) => console.error('Virhe reseptien haussa:', err));
//   });

//   const handleInputChange = (e) => {
//     setNewRecipe({ ...newRecipe, [e.target.name]: e.target.value });
//   };

//   const handleImageUpload = (e) => {
//     const file = e.target.files[0];
//     if (file && file.type.startsWith('image/')) {
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setNewRecipe((prev) => ({ ...prev, image: reader.result }));
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleAddOrUpdateRecipe = () => {
//     if (!newRecipe.title.trim()) {
//       alert('Reseptin nimi on pakollinen!');
//       return;
//     }

//     if (editIndex !== null) {
//       const updated = [...recipes];
//       updated[editIndex] = newRecipe;
//       setRecipes(updated);
//       setEditIndex(null);
//     } else {
//       setRecipes([...recipes, newRecipe]);
//     }

//     setNewRecipe({ title: '', ingredients: '', instructions: '', image: '' });
//   };

//   const handleEdit = (index) => {
//     setNewRecipe(recipes[index]);
//     setEditIndex(index);
//   };

//   const handleDelete = (index) => {
//     const updated = recipes.filter((_, i) => i !== index);
//     setRecipes(updated);
//     if (editIndex === index) {
//       setNewRecipe({ title: '', ingredients: '', instructions: '', image: '' });
//       setEditIndex(null);
//     }
//   };

//   return (
//     <div className="p-6 max-w-2xl mx-auto space-y-4">
//       <h1 className="text-2xl font-bold">Reseptisovellus</h1>

//       <div className="space-y-2 text text-gray-700 dark:text-white">
//         <Input
//           name="title"
//           placeholder="Reseptin nimi"
//           value={newRecipe.title}
//           onChange={handleInputChange}
//         />
//         <Textarea
//           name="ingredients"
//           placeholder="Ainekset"
//           value={newRecipe.ingredients}
//           onChange={handleInputChange}
//         />
//         <Textarea
//           name="instructions"
//           placeholder="Valmistusohjeet"
//           value={newRecipe.instructions}
//           onChange={handleInputChange}
//         />
//         <input
//           type="file"
//           accept="image/*"
//           onChange={handleImageUpload}
//           className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
//         />
//         {newRecipe.image && (
//           <img
//             src={newRecipe.image}
//             alt="Esikatselu"
//             className="mt-2 max-h-48 rounded-xl"
//           />
//         )}
//         <Button onClick={handleAddOrUpdateRecipe}>
//           {editIndex !== null ? 'Päivitä resepti' : 'Lisää resepti'}
//         </Button>
//       </div>

//       <div className="space-y-4">
//         {recipes.map((recipe, index) => (
//           <Card key={index} className="p-4">
//             <CardContent>
//               <h2 className="text-xl font-semibold">{recipe.title}</h2>
//               {recipe.image && (
//                 <img
//                   src={recipe.image}
//                   alt={recipe.title}
//                   className="mt-4 max-h-48 w-full object-cover rounded-lg"
//                 />
//               )}
//               <p className="text-sm text-gray-600 mt-4 dark:text-gray-300">
//                 Ainekset: {recipe.ingredients}
//               </p>
//               <p className="text-sm text-gray-600 mt-2 dark:text-gray-300">
//                 Ohjeet: {recipe.instructions}
//               </p>
//               <div className="mt-4 flex space-x-2">
//                 <Button size="sm" onClick={() => handleEdit(index)}>
//                   Muokkaa
//                 </Button>
//                 <Button
//                   size="sm"
//                   variant="destructive"
//                   onClick={() => handleDelete(index)}
//                 >
//                   Poista
//                 </Button>
//               </div>
//             </CardContent>
//           </Card>
//         ))}
//       </div>
//     </div>
//   );
// }

import React, { useEffect, useState } from 'react';
import { Card, CardContent } from './components/ui/card';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { Textarea } from './components/ui/textarea';
import axios from 'axios';

export default function RecipeApp() {
  const [recipes, setRecipes] = useState([]);
  const [newRecipe, setNewRecipe] = useState({
    title: '',
    ingredients: '',
    instructions: '',
    image: '',
  });
  const [editId, setEditId] = useState(null); // käytetään MongoDB:n _id:tä
  const baseURL = import.meta.env.VITE_API_URL;

  // Haetaan reseptit back-endistä
  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    try {
      const res = await axios.get(`${baseURL}/api/recipes`);
      setRecipes(res.data);
    } catch (error) {
      console.error('Virhe reseptien haussa:', error);
    }
  };

  const handleInputChange = (e) => {
    setNewRecipe({ ...newRecipe, [e.target.name]: e.target.value });
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

  const handleAddOrUpdateRecipe = async () => {
    if (!newRecipe.title.trim()) {
      alert('Reseptin nimi on pakollinen!');
      return;
    }

    try {
      if (editId) {
        await axios.put(`${baseURL}/api/recipes/${editId}`, newRecipe);
      } else {
        await axios.post(`${baseURL}/api/recipes`, newRecipe);
      }

      setNewRecipe({ title: '', ingredients: '', instructions: '', image: '' });
      setEditId(null);
      fetchRecipes(); // päivitetään lista
    } catch (error) {
      console.error('Virhe reseptin tallennuksessa:', error);
    }
  };

  const handleEdit = (recipe) => {
    setNewRecipe({
      title: recipe.title,
      ingredients: recipe.ingredients,
      instructions: recipe.instructions,
      image: recipe.image,
    });
    setEditId(recipe._id);
  };

  const handleDelete = async (id) => {
    try {
      console.log('Tässä id: ' + id);

      await axios.delete(`${baseURL}/api/recipes/${id}`);
      fetchRecipes();
    } catch (error) {
      console.error('Virhe poistettaessa:', error);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold">Reseptisovellus</h1>

      <div className="space-y-2 text text-gray-700 dark:text-white">
        <Input
          name="title"
          placeholder="Reseptin nimi"
          value={newRecipe.title}
          onChange={handleInputChange}
        />
        <Textarea
          name="ingredients"
          placeholder="Ainekset"
          value={newRecipe.ingredients}
          onChange={handleInputChange}
        />
        <Textarea
          name="instructions"
          placeholder="Valmistusohjeet"
          value={newRecipe.instructions}
          onChange={handleInputChange}
        />
        <input
          type="file"
          accept="image/*"
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
        <Button onClick={handleAddOrUpdateRecipe}>
          {editId ? 'Päivitä resepti' : 'Lisää resepti'}
        </Button>
      </div>

      <div className="space-y-4">
        {recipes.map((recipe) => (
          <Card key={recipe._id} className="p-4">
            <CardContent>
              <h2 className="text-xl font-semibold">{recipe.title}</h2>
              {recipe.image && (
                <img
                  src={recipe.image}
                  alt={recipe.title}
                  className="mt-4 max-h-48 w-full object-cover rounded-lg"
                />
              )}
              <div className="text-sm text-gray-600 mt-4 dark:text-gray-300">
                <strong>Ainekset:</strong>
                <ul className="list-disc list-inside mt-1">
                  {recipe.ingredients
                    .split(/\r?\n|\r|,/) // pilkotaan rivinvaihdoista tai pilkuista
                    .map((item, idx) => (
                      <li key={idx}>{item.trim()}</li>
                    ))}
                </ul>
              </div>
              <p className="text-sm text-gray-600 mt-2 dark:text-gray-300">
                <strong>Ohjeet:</strong> {recipe.instructions}
              </p>
              <div className="mt-4 flex space-x-2">
                <Button size="sm" onClick={() => handleEdit(recipe)}>
                  Muokkaa
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDelete(recipe._id)}
                >
                  Poista
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
