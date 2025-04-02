// validations
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';

// notifications
import { toast } from 'react-toastify';

// api service
import { api } from '@/service/api';

// context user
import { useQueryClient } from '@tanstack/react-query';

// navigation
import { useNavigate } from 'react-router-dom';

// components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardTitle, CardContent, CardHeader } from '@/components/ui/card';

const schema = yup.object({
  email: yup.string().email('Email is required field').required(),
  password: yup.string().min(6, 'Password must have six caracteres').required(),
});

export const Login = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmitLogin = async (data) => {
    await toast.promise(
      api.post('/session', {
        email: data.email,
        password: data.password,
      }),
      {
        pending: 'Checking your data',
        success: 'Welcome 👌',
        error: 'Make sure your email or password are correct 😓',
      },
    );

    // Refetch ou pré-carrega os dados do usuário autenticado
    await queryClient.invalidateQueries(['user']);

    navigate('/home');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-3">
      <Card className="w-full max-w-md border border-gray-400">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Login
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmitLogin)} className="space-y-4">
            <div>
              {/* password email */}
              <Input
                type="email"
                {...register('email')}
                placeholder="email"
                className={errors.email ? 'border-red-500' : ''}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* password input */}
            <div>
              <Input
                type="password"
                {...register('password')}
                placeholder="password"
                className={errors.password ? 'border-red-500' : ''}
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            <Button type="submit" className="w-full">
              Sign in
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
