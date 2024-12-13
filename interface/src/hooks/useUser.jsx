import { useContext } from 'react';
import UserContext from '../hooks/UserContext';

export const useUser = () => {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error('useUsers must be a valid context');
  }

  return context;
};
