import { createContext } from 'react';

import PropTypes from 'prop-types';

const TicketContext = createContext({});

const TicketProvider = ({ children }) => {
  return <TicketContext.Provider value={{}}>{children}</TicketContext.Provider>;
};

TicketProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export { TicketContext, TicketProvider };
