import React from 'react';
import { Navigate } from 'react-router-dom';
// import { useAuth } from '../context/useAuth';
import { useAuth } from '../context/AuthContext';

// Tämä komponentti tarkistaa onko käyttäjä kirjautunut, ja jos ei, ohjaa hänet kirjautumissivulle

export default function ProtectedRoute({ children }) {
  const { currentUser } = useAuth();

  if (currentUser === undefined) {
    // Ei vielä tiedetä onko käyttäjä kirjautunut, näytetään placeholder
    return <div className="p-6 text-center text-gray-600">Ladataan...</div>;
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
