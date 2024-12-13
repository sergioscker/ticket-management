import { createContext, useState, useEffect } from 'react';

import PropTypes from 'prop-types';

const UserContext = createContext({});

export const UserProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState({});

  const putUserData = () => {
    setUserInfo(userInfo);

    localStorage.setItem('ticketmanagement:userData', JSON.stringify(userInfo));
  };

  const logout = () => {
    localStorage.removeItem('ticketmanagement:userData');

    setUserInfo({});
  };

  useEffect(() => {
    const userLocalStorage = localStorage.getItem('ticketmanagement:userData');

    if (userLocalStorage) {
      setUserInfo(JSON.parse(userLocalStorage));
    }
  }, []);

  return (
    <UserContext.Provider value={{ userInfo, putUserData, logout }}>
      {children}
    </UserContext.Provider>
  );
};

UserProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
