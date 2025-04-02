import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

import { api, getDepartments } from '@/service/api';
import { useQuery, useQueryClient } from '@tanstack/react-query';

import { useAuth } from '@/context';
import { toast } from 'react-toastify';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardTitle, CardContent, CardHeader } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import PropTypes from 'prop-types';

export const User = () => {
  const { user, isLoading: userLoading } = useAuth();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const {
    data: departments = [],
    isLoading: departmentsLoading,
    error: departmentsError,
  } = useQuery({
    queryKey: ['departments'],

    queryFn: getDepartments,
    staleTime: 1000 * 60 * 10,
  });

  const schema = yup.object({
    name: yup.string().required('Name is required'),
    currentPassword: yup
      .string()
      .min(6, 'Current password must be at least 6 characters')
      .required(),
    newPassword: yup
      .string()
      .min(6, 'New password must be at least 6 characters')
      .notOneOf(
        [yup.ref('currentPassword'), null],
        'New password cannot be the same as current password',
      )
      .required(),
    department: yup.string().optional(),
  });

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    shouldUnregister: true,
  });

  useEffect(() => {
    if (!user && !userLoading) {
      navigate('/');
    }

    if (user) {
      reset({
        name: user.name,
        department: user.id_department,
      });
    }
  }, [user, userLoading, reset, navigate]);

  const SubmitUpdateLogin = async (data) => {
    setLoading(true);

    const updateData = {
      name: data.name,
      currentPassword: data.currentPassword,
      newPassword: data.newPassword,
      department: data.department || null,
    };

    try {
      const response = await api.put('/users', updateData);

      if (response.status === 200) {
        if (data.newPassword) {
          toast.success('Password updated. Please log in again.');

          await api.post('/logout');

          queryClient.removeQueries(['user']);

          navigate('/');
        } else {
          toast.success('User updated successfully!');

          await queryClient.invalidateQueries(['user']);

          navigate('/home');
        }
      } else {
        throw new Error('Unexpected error');
      }
    } catch (error) {
      if (error.response?.status === 400) {
        toast.error(
          Array.isArray(error.response.data.error)
            ? error.response.data.error.join(', ')
            : error.response.data.error,
        );
      } else {
        toast.error('System failure. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (departmentsLoading || userLoading) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  if (departmentsError) {
    return (
      <div className="text-center text-red-500">
        Failed to load departments.
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-3">
      <Card className="w-full max-w-md border">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Change User Information
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form
            onSubmit={handleSubmit(SubmitUpdateLogin)}
            className="space-y-4"
          >
            {/* Nome */}
            <InputGroup
              placeholder="New name"
              error={errors.name}
              {...register('name')}
            />

            {/* Senha atual */}
            <InputGroup
              type="password"
              placeholder="Current password"
              error={errors.currentPassword}
              {...register('currentPassword')}
            />

            {/* Nova senha */}
            <InputGroup
              type="password"
              placeholder="New password"
              error={errors.newPassword}
              {...register('newPassword')}
            />

            {/* Departamento */}
            <div>
              <Select
                onValueChange={(value) => setValue('department', value)}
                defaultValue={user?.id_department || ''}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>

                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Departments</SelectLabel>

                    {departments.map((dept) => (
                      <SelectItem key={dept.id} value={dept.id}>
                        {dept.title}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              {errors.department && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.department.message}
                </p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Sending...' : 'Send Information'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

const InputGroup = ({ error, ...props }) => (
  <div>
    <Input {...props} />
    {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
  </div>
);

InputGroup.propTypes = {
  error: PropTypes.shape({
    message: PropTypes.string,
  }),
};
