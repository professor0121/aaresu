import * as React from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { forgetPassword, verifyOtp, resetPassword } from '../redux/auth/authThunks';

const ForgetPassword = () => {
  const [step, setStep] = React.useState(1); // 1: Email, 2: OTP, 3: New Password
  const [email, setEmail] = React.useState('');
  const [success, setSuccess] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [resendCooldown, setResendCooldown] = React.useState(0);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading: authLoading, error: authError } = useSelector((state) => state.auth);

  const form = useForm({
    defaultValues: {
      email: '',
      otp: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  // Cooldown timer for resend OTP
  React.useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  // Clear errors when step changes
  React.useEffect(() => {
    setError('');
  }, [step]);

  const onSubmit = async (data) => {
    setLoading(true);
    setError('');

    try {
      if (step === 1) {
        setEmail(data.email);
        await dispatch(forgetPassword({ email: data.email })).unwrap();
        setStep(2);
        setResendCooldown(60); // 60 seconds cooldown
        form.reset({ email: data.email, otp: '', newPassword: '', confirmPassword: '' });
      } else if (step === 2) {
        await dispatch(verifyOtp({ email, otp: data.otp })).unwrap();
        setStep(3);
        form.reset({ email, otp: data.otp, newPassword: '', confirmPassword: '' });
      } else if (step === 3) {
        if (data.newPassword !== data.confirmPassword) {
          setError("Passwords don't match");
          return;
        }
        if (data.newPassword.length < 6) {
          setError("Password must be at least 6 characters long");
          return;
        }
        await dispatch(resetPassword({ email, newPassword: data.newPassword })).unwrap();
        setSuccess(true);
      }
    } catch (err) {
      setError(err.message || err || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendCooldown > 0) return;

    setLoading(true);
    setError('');

    try {
      await dispatch(forgetPassword({ email })).unwrap();
      setResendCooldown(60);
    } catch (err) {
      setError(err.message || err || 'Failed to resend OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const goBackToLogin = () => {
    navigate('/login');
  };

  if (success) {
    return (
      <div className="h-screen flex justify-center items-center px-4">
        <div className="p-8 max-w-md text-center border rounded-2xl shadow bg-white">
          <div className="text-6xl mb-4">🎉</div>
          <h1 className="text-2xl font-bold text-green-600 mb-2">Password Reset Successful!</h1>
          <p className="text-gray-600 mb-6">
            Your password has been successfully updated. You can now log in with your new password.
          </p>
          <Button onClick={goBackToLogin} className="w-full">
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center h-screen px-4">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full max-w-[480px] p-8 rounded-2xl shadow space-y-6 border bg-white"
        >
          <div className="text-center space-y-1">
            <h1 className="text-2xl font-semibold tracking-tight">
              {step === 1
                ? 'Forgot Password'
                : step === 2
                ? 'Verify OTP'
                : 'Reset Password'}
            </h1>
            <p className="text-sm text-muted-foreground">
              {step === 1
                ? 'Enter your email to receive an OTP.'
                : step === 2
                ? `Enter the OTP sent to ${email}`
                : 'Set a new password for your account.'}
            </p>
          </div>

          {/* Error Alert */}
          {(error || authError) && (
            <Alert variant="destructive">
              <AlertDescription>
                {error || authError}
              </AlertDescription>
            </Alert>
          )}

          {step === 1 && (
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
                    <Input type="email" placeholder="you@example.com" {...field} />
                  </FormControl>
                  <FormDescription>We’ll send an OTP to this address.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {step === 2 && (
            <>
              <FormField
                name="otp"
                control={form.control}
                rules={{
                  required: 'OTP is required',
                  pattern: {
                    value: /^\d{6}$/,
                    message: 'OTP must be 6 digits'
                  }
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>OTP</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Enter 6-digit OTP"
                        maxLength={6}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Check your email for the verification code
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="text-center">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleResendOtp}
                  disabled={resendCooldown > 0 || loading}
                  className="text-sm"
                >
                  {resendCooldown > 0
                    ? `Resend OTP in ${resendCooldown}s`
                    : 'Resend OTP'
                  }
                </Button>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <FormField
                name="newPassword"
                control={form.control}
                rules={{
                  required: 'New password is required',
                  minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters long'
                  }
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Enter new password" {...field} />
                    </FormControl>
                    <FormDescription>
                      Password must be at least 6 characters long
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="confirmPassword"
                control={form.control}
                rules={{
                  required: 'Please confirm your password',
                  validate: (value) => {
                    const newPassword = form.getValues('newPassword');
                    return value === newPassword || 'Passwords do not match';
                  }
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Confirm new password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}

          <Button type="submit" className="w-full" disabled={loading || authLoading}>
            {loading || authLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                {step === 1 ? 'Sending...' : step === 2 ? 'Verifying...' : 'Resetting...'}
              </div>
            ) : (
              step === 1 ? 'Send OTP' : step === 2 ? 'Verify OTP' : 'Reset Password'
            )}
          </Button>

          {/* Back to Login Link */}
          <div className="text-center">
            <Button
              type="button"
              variant="ghost"
              onClick={goBackToLogin}
              className="text-sm text-muted-foreground"
            >
              ← Back to Login
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ForgetPassword;
