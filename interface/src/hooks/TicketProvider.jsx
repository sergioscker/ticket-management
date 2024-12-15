import { createContext, useState } from 'react';
import PropTypes from 'prop-types';

const TicketContext = createContext({});

const TicketProvider = ({ children }) => {
  const [states, setStates] = useState([]); // Estados de filtros de status
  const [searchText, setSearchText] = useState(''); // Filtro por texto

  const updateStates = (status) => {
    setStates((prev) => {
      if (prev.includes(status)) {
        return prev.filter((s) => s !== status);
      } else {
        return [...prev, status];
      }
    });
  };

  const updateSearchText = (text) => setSearchText(text);

  return (
    <TicketContext.Provider
      value={{ states, updateStates, searchText, updateSearchText }}
    >
      {children}
    </TicketContext.Provider>
  );
};

TicketProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export { TicketContext, TicketProvider };
