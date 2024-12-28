import { useEffect, useState } from 'react';
import { getTickets } from '../../service/api';
import { toast } from 'react-toastify';

// components
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Slidebar } from '@/components/Slidebar';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

const statusColors = {
  Pending: 'bg-yellow-200 text-yellow-800',
  'In Progress': 'bg-blue-200 text-blue-800',
  Rejected: 'bg-red-200 text-red-800',
  Completed: 'bg-green-200 text-green-800',
};

export const TicketDetailsPage = () => {
  const [tickets, setTickets] = useState([]); // Tickets list
  const [loading, setLoading] = useState(false); // Loading state
  const [page, setPage] = useState(1); // Pagination

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

      setTickets(data);
    } catch {
      toast.error('Failed to load tickets.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row p-5 gap-4 bg-gray-100 min-h-screen">
      {/* Sidebar */}
      <Slidebar className="w-full md:w-1/4 lg:w-1/5" />

      {/* Content Area */}
      <div className="w-full">
        <h1 className="text-3xl p-5 font-bold mb-6 text-center md:text-left">
          Ticket Details
        </h1>

        {/* Ticket List Section */}
        <section className="p-5 overflow-y-auto grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {tickets.map((ticket) => (
            <Card key={ticket.id} className="p-4 shadow-lg rounded-lg bg-white">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">
                  {ticket.title}
                </CardTitle>
                <CardDescription className="text-sm text-gray-500">
                  Ticket ID: {ticket.id}
                </CardDescription>
              </CardHeader>

              <CardContent>
                <div className="grid gap-4">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">State:</span>
                    <Badge
                      className={`${
                        statusColors[ticket.state.title] ||
                        'bg-gray-200 text-gray-800'
                      } px-2 py-1 text-xs font-semibold rounded-full`}
                    >
                      {ticket.state.title}
                    </Badge>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Department:</span>
                    <span>{ticket.department.title}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Created:</span>
                    <span>{new Date(ticket.createdAt).toLocaleString()}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Last Updated:</span>
                    <span>{new Date(ticket.updatedAt).toLocaleString()}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Creator:</span>
                    <span>{ticket.creator.name}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Updator:</span>
                    <span>{ticket.updator?.name}</span>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Description:</h3>
                    <p className="text-sm text-gray-700">
                      {ticket.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Load More Button */}
          <div className="col-span-full flex justify-center mt-6">
            <Button
              onClick={() => setPage((prevPage) => prevPage + 1)}
              disabled={loading}
              className="w-full sm:w-auto"
            >
              {loading ? 'Loading...' : 'Load More'}
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
};
