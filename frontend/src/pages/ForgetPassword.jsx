import * as React from 'react';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useDispatch, useSelector } from 'react-redux';
import { forgetPassword } from '../redux/auth/authThunks';

const ForgetPassword = () => {
  const [isOtp, setIsOtp] = useState(true);
  const [isVerified, setIsVerified] = useState(false);
  const [isPasswordReset, setIsPasswordReset] = useState(false);
  const dispatch = useDispatch();

  const form = useForm({
    defaultValues: {
      email: '',
      otp: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const onSubmit = (data) => {
    if (isOtp) {
      dispatch(forgetPassword({email:data.email}));
      setIsOtp(false); // Show OTP field
    } else if (!isVerified) {
      console.log('OTP submitted:', data.otp);
      // Simulate OTP verification
      if (data.otp === '123456') {
        setIsVerified(true); // Show password fields
      } else {
        alert('Invalid OTP');
      }
    } else {
      if (data.newPassword !== data.confirmPassword) {
        alert("Passwords don't match");
        return;
      }
      console.log('Password reset:', data.newPassword);
      // Call password reset API here
      alert('Password successfully reset!');
    }
  };

  return (
    <div className="flex justify-center items-center h-screen px-4">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full max-w-[480px] p-8 rounded-2xl shadow space-y-6 border"
        >
          <div className="text-center space-y-1">
            <h1 className="text-2xl font-semibold tracking-tight text-white text-foreground">
              {isOtp ? 'Forget Password' : isVerified ? 'Reset Password' : 'OTP Verification'}
            </h1>
            <p className="text-sm text-muted-foreground">
              {isOtp
                ? 'Enter your email to reset your password'
                : isVerified
                ? 'Enter your new password'
                : 'Enter the OTP sent to your email'}
            </p>
          </div>

          {isOtp && (
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
                  <FormLabel className="text-white">Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="you@example.com" {...field} />
                  </FormControl>
                  <FormDescription>We'll send an OTP to your email.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {!isOtp && !isVerified && (
            <FormField
              name="otp"
              control={form.control}
              rules={{ required: 'OTP is required' }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">OTP</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="Enter OTP" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {isVerified && (
            <>
              <FormField
                name="newPassword"
                control={form.control}
                rules={{ required: 'New password is required' }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">New Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="New password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="confirmPassword"
                control={form.control}
                rules={{ required: 'Confirm your password' }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Confirm Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Confirm password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}

          <Button type="submit" className="w-full">
            {isOtp ? 'Send OTP' : isVerified ? 'Reset Password' : 'Verify OTP'}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default ForgetPassword;
