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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export const CreateTicket = () => {
  const [loading, setLoading] = useState(false);
  const [departments, setDepartments] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const { data } = await api.get('/departments');
        setDepartments(data);
      } catch {
        toast.error('Failed to load departments. Please try again later.');
      }
    };

    fetchDepartments();
  }, []);

  const schema = yup.object({
    title: yup.string().required('Title is required.'),
    description: yup.string().required('Description is required.'),
    departmentId: yup.string().required('You must select a department.'),
  });

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const handleTicketsSubmit = async (data) => {
    setLoading(true);

    try {
      const response = await api.post('/create-ticket', data, {
        validateStatus: () => true,
      });

      if (response.status === 201) {
        toast.success('Ticket created successfully!');
        setTimeout(() => navigate('/home'), 2000);
      } else if (response.status === 400) {
        toast.error(response.data.error || 'Validation failed.');
      } else {
        throw new Error();
      }
    } catch {
      toast.error('😢 System failure! Please try again.');
    } finally {
      setLoading(false);
    }
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
            className={`w-full ${errors.title ? 'border-red-500' : ''}`}
          />
          {errors.title && (
            <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
          )}
        </div>

        {/* Textarea - Description */}
        <div>
          <Textarea
            placeholder="Description"
            {...register('description')}
            className={`w-full rounded-md border ${
              errors.description ? 'border-red-500' : 'border-gray-400'
            } p-2`}
          />
          {errors.description && (
            <p className="text-red-500 text-sm mt-1">
              {errors.description.message}
            </p>
          )}
        </div>

        {/* Select Department */}
        <div>
          {departments.length > 0 ? (
            <Select
              onValueChange={(value) => setValue('departmentId', value)}
              className="w-full"
            >
              <SelectTrigger>
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
          {errors.departmentId && (
            <p className="text-red-500 text-sm mt-1">
              {errors.departmentId.message}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <Button type="submit" className="w-full sm:w-auto px-6 py-2">
          {loading ? 'Sending...' : 'Send Information'}
        </Button>
      </form>
    </div>
  );
};
