import { createContext, useState, useEffect } from 'react';

import PropTypes from 'prop-types';

import { api } from '@/service/api';
import { toast } from 'react-toastify';

const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const response = await api.get('/users');

      setUserInfo(response.data);
    } catch (error) {
      toast.error('Falha ao obter usuário', error);

      setUserInfo(null);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await api.post('/logout');
    } catch (error) {
      toast.error('Erro ao sair', error);
    }
    setUserInfo(null);
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ userInfo, loading, logout }}>
      {children}
    </UserContext.Provider>
  );
};

UserProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export { UserProvider, UserContext };
