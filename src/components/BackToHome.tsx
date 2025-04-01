import React from 'react';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

export default function BackToHome() {
  return (
    <Link
      to="/"
      className="fixed bottom-4 right-4 p-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors"
    >
      <Home size={24} />
    </Link>
  );
}