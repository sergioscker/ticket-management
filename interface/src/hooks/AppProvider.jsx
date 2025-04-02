import { AuthProvider } from '@/context';
import PropTypes from 'prop-types';

export const AppProvider = ({ children }) => {
  return <AuthProvider>{children}</AuthProvider>;
};

AppProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
