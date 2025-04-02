import { Route, Routes } from 'react-router-dom';

// components
import { PrivateRoute } from '@/components/PrivateRouter';

// pages
import { Login } from '@/pages/Login';
import { CreateTicket } from '@/pages/Create-tickets';
import { User } from '@/pages/User';
import { TicketDetailsPage } from '@/pages/Dashboard';
import { HomePage } from '@/pages/Home';

import { Layout } from '../../Layout';

export const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route
          path="/home"
          element={
            <PrivateRoute>
              <HomePage />
            </PrivateRoute>
          }
        />
        <Route path="/create-ticket" element={<CreateTicket />} />
        <Route path="/user" element={<User />} />
        <Route path="/dashboard" element={<TicketDetailsPage />} />
      </Route>
      <Route path="/" element={<Login />} />
    </Routes>
  );
};
