import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { api } from '@/service/api';
import * as yup from 'yup';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { toast } from 'react-toastify';

//components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export const CreateTicket = () => {
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data } = await api.get('/users');

        const uniqueDepartments = Array.from(
          new Map(
            data.map((user) => [user.department.id, user.department]),
          ).values(),
        );
      } catch {
        toast.error('Failed to load user data');
      }
    };

    fetchUserData();
  }, []);

  const schema = yup.object({
    title: yup.string().required('Title is required.'),
    description: yup.string().required('Description is required.'),
    department: yup.string().required('Department is required.'),
  });
  const { register, handleSubmit } = useForm({
    resolver: yupResolver(schema),
  });

  const handleTicketsSubmit = async (data) => {
    setLoading(true);

    try {
      const { status } = await api.post(
        '/create-ticket',
        {
          title: data.title,
          description: data.description,
        },
        {
          validadeStatus: () => true,
        },
      );

      if (status === 200 || status === 201) {
        setTimeout(() => {
          navigate('/home');
        }, 2000);
        toast.success('Ticket created successfully!');
      } else if (status === 409) {
        toast.error('Ticket already registered. Log in again to continue.');
      } else {
        throw new Error();
      }
    } catch {
      toast.error('😢System failure! Please try again');
    }
    setLoading(false);
  };

  return (
    <div className="w-full flex flex-col gap-6 justify-center items-center p-6 mt-10">
      <form
        onSubmit={handleSubmit(handleTicketsSubmit)}
        className="space-y-6 w-full max-w-md sm:max-w-lg lg:max-w-xl"
      >
        <h1 className="text-xl sm:text-2xl lg:text-3xl text-left font-medium">
          Create New Ticket
        </h1>

        {/* Input Title */}
        <div>
          <Input
            type="text"
            placeholder="Title"
            {...register('title')}
            className="w-full"
          />
        </div>

        {/* Textarea - Description */}
        <div>
          <Textarea
            placeholder="Description"
            {...register('description')}
            className="w-full rounded-md border border-gray-400 p-2"
          />
        </div>

        {/* Select Department */}
        {/* <div>
          {departments ? (
            <Select {...register('department')} className="w-full">
              <SelectTrigger className="rounded-md border border-gray-400">
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Select department</SelectLabel>
                  {departments.map((dept) => (
                    <SelectItem key={dept.id} value={dept.id}>
                      {dept.title}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          ) : (
            <p>Loading departments...</p>
          )}
        </div> */}

        {/* Submit Button */}
        <Button type="submit" className="w-full sm:w-auto px-6 py-2">
          {loading ? 'Sending...' : 'Sent information'}
        </Button>
      </form>
    </div>
  );
};
