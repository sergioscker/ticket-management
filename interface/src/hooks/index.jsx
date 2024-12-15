import PropTypes from 'prop-types';

import { UserProvider } from './UserProvider';

export const AppProvider = ({ children }) => {
  return <UserProvider>{children}</UserProvider>;
};

AppProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
