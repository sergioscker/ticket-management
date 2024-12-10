import { Home } from '@/pages/Home';
import { Login } from '@/pages/Login';
import { CreateTicket } from '@/pages/Create-tickets';
import { User } from '@/pages/User';

export const routes = [
  { path: '/', element: <Home /> },
  { path: '/login', element: <Login /> },
  { path: '/create-ticket', element: <CreateTicket /> },
  { path: '/user', element: <User /> },
];
