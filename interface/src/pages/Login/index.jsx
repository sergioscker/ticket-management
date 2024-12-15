import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { api } from '@/service/api';
import { useUser } from '@/hooks/useUser';

// components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardTitle, CardContent, CardHeader } from '@/components/ui/card';

export const Login = () => {
  const navigate = useNavigate();

  const { putUserData } = useUser();

  const schema = yup.object({
    email: yup.string().email('Email is required field').required(),
    password: yup
      .string()
      .min(6, 'Password must have six caracteres')
      .required(),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  const onSubmitLogin = async (data) => {
    const { data: userData } = await toast.promise(
      api.post('/session', {
        email: data.email,
        password: data.password,
      }),
      {
        pending: 'Checking your data',
        success: {
          render() {
            setTimeout(() => {
              navigate('/home');
            }, 2000);
            return 'Welcome👌';
          },
        },
        error: 'Make sure your email or password are correct, 😓',
      },
    );

    putUserData(userData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Login
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmitLogin)} className="space-y-4">
            <div>
              <Input
                type="email"
                {...register('email')}
                placeholder="Email"
                className={errors.email ? 'border-red-500' : ''}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div>
              <Input
                type="password"
                {...register('password')}
                placeholder="Password"
                className={errors.password ? 'border-red-500' : ''}
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            <Button type="submit" className="w-full">
              Login
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
