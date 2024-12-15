import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

import { getTickets } from '../../service/api';
import { useTicketFilters } from '@/hooks/useTicketFilters';

// components
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

const statusColors = {
  Pending: 'bg-yellow-200 text-yellow-800',
  Rejected: 'bg-red-200 text-red-800',
  'In Progress': 'bg-blue-200 text-blue-800',
  Completed: 'bg-green-200 text-green-800',
};

export const HomePage = () => {
  const [tickets, setTickets] = useState([]); // Tickets list
  const [loading, setLoading] = useState(false); // Loading state
  const [page, setPage] = useState(1); // Pagination

  const { searchText, filteredTickets, handleSearchChange, handleStateToggle } =
    useTicketFilters(tickets);

  // Fetch tickets when the component mounts or page changes
  useEffect(() => {
    fetchTickets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  // Fetch tickets from the API
  const fetchTickets = async () => {
    try {
      setLoading(true);

      const data = await getTickets(page);

      setTickets((prevTickets) => [...prevTickets, ...data]);
    } catch {
      toast.error('Failed to load tickets.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen p-6">
      {/* Search Section */}
      <div className="space-y-4 mb-6">
        <div className="flex flex-col xl:flex-row items-center justify-center xl:justify-evenly">
          <Input
            type="text"
            value={searchText}
            onChange={handleSearchChange}
            placeholder="Search tickets"
            className="w-full max-w-md"
          />

          <div className="flex md:flex-row items-center space-y-2 md:space-x-4 md:space-y-0">
            {Object.keys(statusColors).map((status) => (
              <div
                key={status}
                className="flex flex-wrap justify-center gap-2 items-center space-x-2 p-3 xl:p-5"
              >
                <Checkbox
                  id={status}
                  onChange={() => handleStateToggle(status)}
                />
                <label
                  htmlFor={status}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {status}
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tickets List */}
      <div className="flex overflow-y-auto mx-auto p-5">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
          {filteredTickets.map((ticket) => (
            <Card
              key={`${ticket.id}-${ticket.createdAt}`}
              className="flex flex-col h-full"
            >
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{ticket.title}</CardTitle>
                    <CardDescription>Ticket ID: {ticket.id}</CardDescription>
                  </div>

                  <Badge
                    className={`${
                      statusColors[ticket.state.title] ||
                      'bg-gray-200 text-gray-800'
                    } px-2 py-1 text-xs font-semibold rounded-full`}
                  >
                    {ticket.state.title}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="flex-1">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Department:</span>
                    <span>{ticket.department.title}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Created:</span>
                    <span>
                      {new Date(ticket.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Updated:</span>
                    <span>
                      {new Date(ticket.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Load More Button */}
      <div className="flex justify-center mt-6">
        <Button
          onClick={() => setPage((prevPage) => prevPage + 1)}
          disabled={loading}
        >
          {loading ? 'Loading...' : 'Load More'}
        </Button>
      </div>
    </div>
  );
};
