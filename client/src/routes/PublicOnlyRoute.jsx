import { Navigate } from 'react-router-dom';
import { useContext } from 'react';
import AuthContext from '../context/AuthContext';

const PublicOnlyRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <div>Loading...</div>;
  }

  // If user is logged in, redirect to translate page
  if (user) {
    return <Navigate to="/translate" />;
  }

  // If not logged in, allow access
  return children;
};

export default PublicOnlyRoute;

