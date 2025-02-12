"use client";
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import axiosInstance from "@/utils/axiosInstance";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

export default function LoginForm() {
  const { toast } = useToast();
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post('auth/login/', formData);
      
      // Check if response.data contains the expected structure
      if (response.data && response.data.access && response.data.refresh && response.data.user) {
        const { access, refresh, user } = response.data;
        
        // Store tokens
        localStorage.setItem('accessToken', access);
        localStorage.setItem('refreshToken', refresh);
        
        // Set token in axios instance
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${access}`;
        
        toast({
          variant: 'default',
          title: 'Login Successful',
          description: `Welcome back, ${user.first_name || user.username}!`,
          duration: 3000,
        });

        // Redirect to feed page
        router.push('/feed');
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Login error:', error);
      
      // Handle different types of errors
      const errorMessage = error.response?.data?.detail || // DRF often uses 'detail' for error messages
                          error.response?.data?.message || 
                          Object.values(error.response?.data || {})[0]?.[0] ||
                          error.message ||
                          'Login failed. Please check your credentials.';
      
      toast({
        variant: 'destructive',
        title: 'Login Failed',
        description: errorMessage,
        duration: 5000,
      });
    }
  };

  return (
    <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-white dark:bg-black">
      <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200">
        Welcome Back
      </h2>
      <p className="text-neutral-600 text-sm max-w-sm mt-2 dark:text-neutral-300">
        Please sign in to your account
      </p>

      <form onSubmit={handleLogin} className="my-8">
        <div className="space-y-4">
          <LabelInputContainer>
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email" 
              placeholder="you@example.com" 
              type="email" 
              required 
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            />
          </LabelInputContainer>

          <LabelInputContainer>
            <Label htmlFor="password">Password</Label>
            <Input 
              id="password" 
              type="password" 
              required 
              value={formData.password}
              onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
            />
          </LabelInputContainer>

          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium"
            type="submit"
          >
            Sign In
            <BottomGradient />
          </motion.button>
        </div>
      </form>

      <div className="text-center text-sm">
        Don't have an account?{" "}
        <button 
          onClick={() => router.push('/signup')}
          className="text-primary hover:underline"
        >
          Sign up
        </button>
      </div>
    </div>
  );
}

const BottomGradient = () => {
  return (
    <>
      <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
      <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
    </>
  );
};

const LabelInputContainer = ({
  children,
  className
}) => {
  return (
    <div className={cn("flex flex-col space-y-2 w-full", className)}>
      {children}
    </div>
  );
}; 