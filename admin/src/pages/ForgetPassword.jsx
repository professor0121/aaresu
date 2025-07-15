import * as React from 'react';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const ForgetPassword = () => {
    const [isOtp, setIsOtp] = useState(true)
  const form = useForm({
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = (data) => {
    console.log('Submitted:', data);
    setIsOtp(!isOtp)
  };

  return (
    <div className="flex justify-center items-center h-screen px-4">
      {isOtp && <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full max-w-[480px] p-8 rounded-2xl shadow space-y-6 border"
        >
          <div className="text-center space-y-1">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">Forget Password</h1>
            <p className="text-sm text-muted-foreground">
              Enter your email to reset your password
            </p>
          </div>

          <FormField
            name="email"
            control={form.control}
            rules={{
              required: "Email is required",
              pattern: {
                value: /^\S+@\S+$/i,
                message: "Enter a valid email address",
              },
            }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    className="w-full"
                    {...field}
                  />
                </FormControl>
                <FormDescription>We'll send an OTP to your email.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full">
            Send OTP
          </Button>
        </form>
      </Form>}
      {!isOtp && <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full max-w-[480px] p-8 rounded-2xl shadow space-y-6 border"
        >
          <div className="text-center space-y-1">
            <h1 className="text-2xl font-semibold tracking-tight text-white text-foreground">OTP Verification</h1>
            <p className="text-sm text-muted-foreground">
              Enter the OTP sent to your email
            </p>
          </div>

          <FormField
          className={"text-white"}
            name="otp"
            control={form.control}
            rules={{ required: "OTP is required" }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>OTP</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Enter OTP"
                    className="w-full"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormDescription>
            <p oncllick={() => setIsOtp(!isOtp)}>Resend OTP</p>
          </FormDescription>

          <Button type="submit" className="w-full">
            Verify
          </Button>
        </form>
      </Form>}
    </div>
  );
};

export default ForgetPassword;
