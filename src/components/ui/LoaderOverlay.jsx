// import React from 'react';

// const LoaderOverlay = ({ message = 'Ladataan...' }) => {
//   return (
//     <div className="fixed inset-0 z-50 dark:bg-black bg-opacity-50 flex items-center justify-center">
//       <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-xl text-center space-y-2">
//         <div className="animate-spin h-8 w-8 border-4 border-blue-400 border-t-transparent rounded-full mx-auto"></div>
//         <p className="text-gray-800 dark:text-white text-sm">{message}</p>
//       </div>
//     </div>
//   );
// };

// export default LoaderOverlay;

import React from 'react';

const LoaderOverlay = ({ message = 'Ladataan...' }) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center">
      <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-2xl text-center space-y-4 w-60">
        {/* Tyylikkäämpi spinner */}
        <div className="w-12 h-12 border-4 border-blue-500 border-dashed rounded-full animate-spin mx-auto"></div>
        <p className="text-gray-800 dark:text-gray-200 text-base font-medium tracking-wide">
          {message}
        </p>
      </div>
    </div>
  );
};

export default LoaderOverlay;
