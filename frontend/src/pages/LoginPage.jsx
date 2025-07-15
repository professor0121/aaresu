import * as React from 'react';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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

export default function LoginForm() {
    const navigate = useNavigate();
    const [isOpt, setIsOpt] = useState(true)

    const form = useForm({
        defaultValues: {
            email: "",
            password: "",
            otp: "",
        },
    });

    const onSubmit = (data) => {
        console.log("Submitted:", data);
        setIsOpt(!isOpt)
    };

    return (
        <div className="flex justify-center items-center h-screen px-4">
            {isOpt &&
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="w-full text-white max-w-[480px] p-8 border-1 border-b-blue-50 rounded-2xl shadow-md space-y-6"
                    >
                        <div className="text-center space-y-1">
                            <h1 className="text-2xl font-semibold text-white tracking-tight">Login</h1>
                            <p className="text-sm text-muted-foreground">
                                Enter your email and password to continue
                            </p>
                        </div>

                        {/* Email */}
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
                                    <FormDescription>Your login email.</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Password */}
                        <FormField
                            name="password"
                            control={form.control}
                            rules={{ required: "Password is required" }}
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
                        <FormDescription>
                            <Link>Forget Password?</Link>
                        </FormDescription>

                        <Button type="submit" className="w-full">
                            Login
                        </Button>
                        <FormDescription>
                            Don't have an account? <Link to="/register" className="text-blue-500">Register</Link>
                        </FormDescription>
                    </form>
                </Form>}
            {!isOpt &&
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="w-full text-white max-w-[480px] p-8 border-1 border-b-blue-50 rounded-2xl shadow-md space-y-6"
                    >
                        <div className="text-center space-y-1">
                            <h1 className="text-2xl font-semibold text-white tracking-tight">OTP Verification</h1>
                            <p className="text-sm text-muted-foreground">
                                Enter the OTP sent to your email
                            </p>
                        </div>

                        {/* OTP */}
                        <FormField
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

                        <Button type="submit" className="w-full">
                            Verify
                        </Button>
                    </form>
                </Form>}

        </div>
    );
}
