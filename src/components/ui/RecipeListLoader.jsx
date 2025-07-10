import React from 'react';

const RecipeListLoader = () => {
  return (
    <div className="flex flex-col items-center justify-center py-10 text-gray-700 dark:text-white">
      <div className="animate-spin h-8 w-8 border-4 border-blue-400 border-t-transparent rounded-full mb-4"></div>
      <p className="text-lg font-medium">Ladataan reseptejä...</p>
    </div>
  );
};

export default RecipeListLoader;
