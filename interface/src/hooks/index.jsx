import PropTypes from 'prop-types';

import { UserProvider } from './UserProvider';
import { TicketProvider } from './TicketProvider';

export const AppProvider = ({ children }) => {
  return (
    <UserProvider>
      <TicketProvider>{children}</TicketProvider>
    </UserProvider>
  );
};

AppProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
