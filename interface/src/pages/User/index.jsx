import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// validations
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

//api service
import { api } from '@/service/api';

// notifications
import { toast } from 'react-toastify';

// context user
import { UserContext } from '../../hooks/UserProvider';
import { useContext } from 'react';

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
  const { userInfo } = useContext(UserContext);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // Schema de validação
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
    if (userInfo) {
      reset({
        name: userInfo.name,
        department: userInfo.id_department,
      });
    }
  }, [userInfo, reset]);

  // Fetch dos departamentos e validação do token
  useEffect(() => {
    if (userInfo) {
      navigate('/');
    }

    // Carregar os departamentos
    const fetchDepartments = async () => {
      try {
        const { data } = await api.get('/departments');

        setDepartments(data);
      } catch {
        toast.error('Failed to load departments. Please try again later.');
      }
    };

    fetchDepartments();
  }, [userInfo, navigate]);

  // Atualizar informações do usuário
  const SubmitUpdateLogin = async (data) => {
    setLoading(true);

    // Limpar valores vazios ou não alterados
    const updateData = {};

    if (data.name) updateData.name = data.name;
    if (data.currentPassword) updateData.currentPassword = data.currentPassword;
    if (data.newPassword) updateData.newPassword = data.newPassword;
    if (data.department) updateData.department = data.department;

    try {
      const response = await api.put('/users', updateData);

      if (response.status === 200) {
        toast.success('User updated successfully!');

        // Redirecionar para a tela de login
        navigate('/');
      } else {
        // Caso algum erro inesperado ocorra, como status HTTP diferente de 200
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Change User Informations
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form
            onSubmit={handleSubmit(SubmitUpdateLogin)}
            className="space-y-4"
          >
            {/* Input Name */}
            <div>
              <Input type="text" placeholder="New name" {...register('name')} />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Input Current Password */}
            <div>
              <Input
                type="password"
                placeholder="Current password"
                {...register('currentPassword')}
              />
              {errors.currentPassword && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.currentPassword.message}
                </p>
              )}
            </div>

            {/* Input New Password */}
            <div>
              <Input
                type="password"
                placeholder="New password"
                {...register('newPassword')}
              />
              {errors.newPassword && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.newPassword.message}
                </p>
              )}
            </div>

            {/* Select Department */}
            <div>
              <Select
                onValueChange={(value) => setValue('department', value)}
                defaultValue={userInfo?.id_department || ''}
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
              {errors.department && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.department.message}
                </p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Sending...' : 'Sent Informations'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
