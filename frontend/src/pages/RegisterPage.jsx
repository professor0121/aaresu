import * as React from 'react';
import { useForm } from 'react-hook-form';
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

    const form = useForm({
        defaultValues: {
            email: "",
            password: "",
            otp: "",
        },
    });

    const onSubmit = (data) => {
        console.log("Submitted:", data);
    };

    return (
        <div className="flex justify-center items-center h-screen px-4">

            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="w-full text-white max-w-[480px] p-8 border-1 border-b-blue-50 rounded-2xl shadow-md space-y-6"
                >
                    <div className="text-center space-y-1">
                        <h1 className="text-2xl font-semibold text-white tracking-tight">Register</h1>
                        <p className="text-sm text-muted-foreground">
                            Enter your email and password to continue
                        </p>
                    </div>

                    <FormField
                        name="username"
                        control={form.control}
                        rules={{ required: "Username is required" }}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Username</FormLabel>
                                <FormControl>
                                    <Input
                                        type="text"
                                        placeholder="Enter your username"
                                        className="w-full"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

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
                   

                    <Button type="submit" className="w-full">
                        Register
                    </Button>
                    <FormDescription>
                        I have an account? <Link to="/login" className="text-blue-500">Login</Link>
                    </FormDescription>
                </form>
            </Form>
        </div>
    );
}
