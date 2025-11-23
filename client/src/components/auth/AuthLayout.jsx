import React from 'react';
import AuthHeader from '../common/AuthHeader';
import Footer from '../common/Footer';

const AuthLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <AuthHeader />
      <main className="flex-1 pt-24 pb-16 flex justify-center items-center px-4">
        <div className="bg-white rounded-lg shadow-lg w-full max-w-md overflow-hidden">
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AuthLayout; 