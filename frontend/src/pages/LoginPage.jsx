import * as React from 'react';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from '@/components/ui/form';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { loginUser, verifyOtp } from '../redux/auth/authThunks';

export default function LoginForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isOtp, setIsOtp] = useState(true);

  const form = useForm({
    defaultValues: {
      email: '',
      password: '',
      otp: '',
    },
  });

  // 🚀 Submit Login Handler
  const handleLogin = async (data) => {
    const resultAction = await dispatch(loginUser(data));

    if (loginUser.fulfilled.match(resultAction)) {
      // Show OTP form
      setIsOtp(false);
    } else {
      // Optionally handle login error
      console.error('Login failed:', resultAction.payload || resultAction.error.message);
    }
  };

  // 🔐 Submit OTP Handler
  const handleOtpVerify = async (data) => {
    const resultAction = await dispatch(verifyOtp({ email: data.email, otp: data.otp }));
        console.log(resultAction);
    if (verifyOtp.fulfilled.match(resultAction)) {
      navigate('/'); // or navigate('/dashboard')
    } else {
      console.error('OTP verification failed:', resultAction.payload || resultAction.error.message);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen px-4">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(isOtp ? handleLogin : handleOtpVerify)}
          className="w-full text-white max-w-[480px] p-8 border border-blue-100 rounded-2xl shadow-md space-y-6"
        >
          <div className="text-center space-y-1">
            <h1 className="text-2xl font-semibold tracking-tight">
              {isOtp ? 'Login' : 'OTP Verification'}
            </h1>
            <p className="text-sm text-muted-foreground">
              {isOtp
                ? 'Enter your email and password to continue'
                : 'Enter the OTP sent to your email'}
            </p>
          </div>

          {/* Email (Always show because OTP needs email too) */}
          <FormField
            name="email"
            control={form.control}
            rules={{
              required: 'Email is required',
              pattern: {
                value: /^\S+@\S+$/i,
                message: 'Enter a valid email address',
              },
            }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="you@example.com" className="w-full" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Password (only in login phase) */}
          {isOtp && (
            <FormField
              name="password"
              control={form.control}
              rules={{ required: 'Password is required' }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="********"
                      className="w-full"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {/* OTP (only in OTP phase) */}
          {!isOtp && (
            <FormField
              name="otp"
              control={form.control}
              rules={{ required: 'OTP is required' }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>OTP</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="Enter OTP" className="w-full" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <Button type="submit" className="w-full">
            {isOtp ? 'Login' : 'Verify OTP'}
          </Button>

          {isOtp ? (
            <FormDescription>
              Don’t have an account?{' '}
              <Link to="/register" className="text-blue-500">
                Register
              </Link>
            </FormDescription>
          ) : (
            <FormDescription>
              Didn't get the OTP? <button type="button" className="underline">Resend</button>
            </FormDescription>
          )}
        </form>
      </Form>
    </div>
  );
}
