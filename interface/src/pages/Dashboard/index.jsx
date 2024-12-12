import { Slidebar } from '@/components/Slidebar';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export const TicketDetailsPage = () => {
  const ticketData = {
    title: 'Problema com login',
    createdAt: '2023-05-15T10:30:00Z',
    updatedAt: '2023-05-16T14:45:00Z',
    department: 'TI',
    status: 'Em andamento',
    description:
      'O usuário não consegue fazer login na plataforma. A página de login não responde após inserir as credenciais.',
  };

  return (
    <div className="flex p-5 gap-4 h-screen bg-gray-100">
      <Slidebar />

      <h1 className="text-3xl font-bold">Ticket Details</h1>

      <section className="flex-0 p-10 mt-10 overflow-y-auto ">
        <Card>
          <CardHeader>
            <CardTitle>{ticketData.title}</CardTitle>
            <CardDescription>Ticket ID: {ticketData.id}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2">
              <div className="flex justify-between items-center">
                <span className="font-semibold">States:</span>
                <Badge variant="outline">{ticketData.status}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-semibold">Department:</span>
                <span>{ticketData.department}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-semibold">Date of creation:</span>
                <span>{new Date(ticketData.createdAt).toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-semibold">Last Update:</span>
                <span>{new Date(ticketData.updatedAt).toLocaleString()}</span>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Description:</h3>
                <p>{ticketData.description}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};
