import { Link } from 'react-router-dom';
import { Home, Ticket, Users, Settings } from 'lucide-react';

const menuItems = [
  { to: '/home', icon: Home, label: 'Home' },
  { to: '/create-ticket', icon: Ticket, label: 'Tickets' },
  { to: '/user', icon: Users, label: 'Users' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

export const Slidebar = () => {
  return (
    <div className="w-64 h-screen bg-gray-100 text-gray-800">
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
        <nav>
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.label}>
                <Link
                  to={item.to}
                  className="flex items-center p-3 space-x-2 rounded-md hover:bg-gray-200"
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
};
