// components
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

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
    title: 'Fixed projetc Figma designer',
    createdAt: '2024-12-05',
    updatedAt: '2024-12-12',
    department: 'Designer',
    status: 'Reject',
  },
  {
    id: 4,
    title: 'Fixed projetc Figma designer',
    createdAt: '2024-12-05',
    updatedAt: '2024-12-12',
    department: 'Finance',
    status: 'Completed',
  },
];

export const HomePage = () => {
  return (
    <div className="flex flex-col items-center justify-center space-y-4 p-5">
      <div className="flex items-center justify-around space-x-4">
        <Input type="text" placeholder="Search tickets" className="w-[500px]" />

        <div className="flex items-center space-x-2">
          {tickets.map((ticket) => (
            <label key={ticket} className="flex items-center space-x-2">
              <Checkbox />
              <span>{ticket.status}</span>
            </label>
          ))}
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow >
            <TableHead>Title</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Updated At</TableHead>
            <TableHead>Department</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tickets.map((ticket) => (
            <TableRow key={ticket.id}>
              <TableCell>{ticket.title}</TableCell>
              <TableCell>{ticket.createdAt}</TableCell>
              <TableCell>{ticket.updatedAt}</TableCell>
              <TableCell>{ticket.department}</TableCell>
              <TableCell>{ticket.status}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Button>Load More</Button>
    </div>
  );
};
