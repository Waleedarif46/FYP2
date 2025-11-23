import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-white shadow-sm fixed w-full top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <nav className="flex items-center justify-between">
          <div className="flex items-center text-2xl font-bold">
            <span className="mr-2">👋</span>
            Signverse Header
          </div>
          <button 
            className="md:hidden text-2xl"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            ☰
          </button>
          <ul className={`md:flex md:items-center md:space-x-6 ${isMenuOpen ? 'block' : 'hidden'} md:block bg-white md:bg-transparent absolute md:static left-0 right-0 top-full md:top-auto p-4 md:p-0 shadow-md md:shadow-none z-50`}>
            <li><Link to="/" className="block py-2 hover:text-blue-500">Home</Link></li>
            <li><Link to="/learn" className="block py-2 hover:text-blue-500">Learn</Link></li>
            <li><Link to="/translate" className="block py-2 hover:text-blue-500">Translate</Link></li>
            {/* <li><Link to="/dictionary" className="block py-2 hover:text-blue-500">Dictionary</Link></li> */}
            <li><Link to="/about" className="block py-2 hover:text-blue-500">About</Link></li>
            <li><Link to="/login" className="btn bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Login / Sign Up</Link></li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header; 