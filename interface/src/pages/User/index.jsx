import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

import { api } from '@/service/api';
import { toast } from 'react-toastify';

// components
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

export const User = () => {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [departments, setDepartments] = useState('');
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

        setName(data.name);

        setPassword(data.password);

        setDepartments(uniqueDepartments);
      } catch {
        toast.error('Failed to load user data');
      }
    };

    fetchUserData();
  }, []);

  const schema = yup.object({
    name: yup.string(),
    password: yup.string(),
    department: yup.string(),
  });

  const { register, handleSubmit } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmitUpdateLogin = async (data) => {
    setLoading(true);

    try {
      const response = await api.put('/users', {
        name: data.name,
        password: data.password,
        department: data.department,
      });
      if (response.status === 200) {
        toast.success('User updated sucessfully!');

        setTimeout(() => {
          navigate('/');
        }, 2000);
      } else if (response.status === 409) {
        toast.error(
          'Name or department already registed to the user. Log in again to continuos',
        );
      } else {
        throw new Error();
      }
    } catch (error) {
      if (error.response?.status === 400) {
        toast.error(error.response.data.error);
      } else {
        toast.error('System failure. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Change Informations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleSubmit(onSubmitUpdateLogin)}
            className="space-y-4"
          >
            {/* input name */}
            <div>
              <Input
                type="text"
                value={name}
                onChange={(user) => setName(user.target.value)}
                placeholder="New name"
                {...register('name')}
              />
            </div>

            {/* input password */}
            <div>
              <Input
                type="password"
                value={password}
                onChange={(user) => setPassword(user.target.value)}
                placeholder="New password"
                {...register('password')}
              />
            </div>

            {/* select department */}
            <div>
              {departments ? (
                <Select {...register('department')} className="w-full">
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
            </div>

            <Button type="submit" className="w-full">
              {loading ? 'Sending...' : 'Sent information'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
