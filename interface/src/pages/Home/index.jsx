// components
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

const tickets = [
  {
    id: 1,
    title: 'Issue with printer',
    createdAt: '2023-06-01',
    updatedAt: '2023-06-02',
    department: 'IT',
    status: 'Pending',
  },
  {
    id: 2,
    title: 'New employee onboarding',
    createdAt: '2023-06-03',
    updatedAt: '2023-06-04',
    department: 'HR',
    status: 'In Progress',
  },
  {
    id: 3,
    title: 'Fixed project Figma designer',
    createdAt: '2024-12-05',
    updatedAt: '2024-12-12',
    department: 'Designer',
    status: 'Reject',
  },
  {
    id: 4,
    title: 'Creation finance table',
    createdAt: '2024-12-05',
    updatedAt: '2024-12-12',
    department: 'Finance',
    status: 'Completed',
  },
];

const statusColors = {
  Pending: 'bg-yellow-200 text-yellow-800',
  'In Progress': 'bg-blue-200 text-blue-800',
  Reject: 'bg-red-200 text-red-800',
  Completed: 'bg-green-200 text-green-800',
};

export const HomePage = () => {
  return (
    <div className="flex flex-col min-h-screen p-6">
      <div className="flex flex-col space-y-4 mb-6">
        <div className="flex items-center justify-between">
          <Input
            type="text"
            placeholder="Search tickets"
            className="w-full max-w-md"
          />
          <div className="flex items-center space-x-4">
            {Object.keys(statusColors).map((status) => (
              <label key={status} className="flex items-center space-x-2">
                <Checkbox id={status} />
                <span>{status}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {tickets.map((ticket) => (
            <Card key={ticket.id} className="flex flex-col">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{ticket.title}</CardTitle>
                    <CardDescription>Ticket ID: {ticket.id}</CardDescription>
                  </div>
                  <Badge
                    className={`${
                      statusColors[ticket.status]
                    } px-2 py-1 text-xs font-semibold rounded-full`}
                  >
                    {ticket.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Department:</span>
                    <span>{ticket.department}</span>
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

      <div className="flex justify-center mt-6">
        <Button>Load More</Button>
      </div>
    </div>
  );
};
