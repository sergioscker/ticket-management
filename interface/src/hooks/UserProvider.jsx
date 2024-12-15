import { createContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState({});

  const putUserData = (userInfo) => {
    localStorage.setItem('ticketmanagement:userData', JSON.stringify(userInfo));
    setUserInfo(userInfo);
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

export { UserProvider, UserContext };
