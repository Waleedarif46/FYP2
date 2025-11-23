import React from 'react';
import { Link } from 'react-router-dom';

const AuthHeader = () => {
  return (
    <header className="bg-white shadow-sm fixed w-full top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <nav className="flex items-center justify-center">
          <Link to="/" className="flex items-center text-2xl font-bold hover:text-blue-500 transition-colors">
            <span className="mr-2">👋</span>
            Signverse
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default AuthHeader; 