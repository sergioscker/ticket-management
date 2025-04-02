import { useAuth } from '@/context';

import PropTypes from 'prop-types';

import { Navigate } from 'react-router-dom';

export const PrivateRoute = ({ children }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" />;

  return children;
};

PrivateRoute.propTypes = {
  children: PropTypes.node.isRequired,
};
