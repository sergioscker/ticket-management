// validations
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';

// navigation
import { useNavigate } from 'react-router-dom';

// notifications
import { toast } from 'react-toastify';

// api service
import { api } from '@/service/api';

// context user
import { UserContext } from '../../hooks/UserProvider';
import { useContext, useEffect } from 'react';

// components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardTitle, CardContent, CardHeader } from '@/components/ui/card';

export const Login = () => {
  const navigate = useNavigate();

  const { userInfo } = useContext(UserContext);

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
    await toast.promise(
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
  };

  useEffect(() => {
    if (userInfo) {
      navigate('/home');
    }
  }, [userInfo, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Sign in
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
              Login
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
