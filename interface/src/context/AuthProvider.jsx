import PropTypes from 'prop-types';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/service/api';
import { AuthContext } from './AuthContext'; // ✅ Importa separado

export const AuthProvider = ({ children }) => {
  const queryClient = useQueryClient();

  const {
    data: user,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const res = await api.get('/profile');
      return res.data;
    },
    staleTime: 1000 * 60 * 5,
    retry: false,
  });

  const logout = async () => {
    await api.post('/logout');
    queryClient.removeQueries(['user']);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, isError, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
