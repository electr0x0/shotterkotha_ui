"use client";
import { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { BadgeCheck, Mail } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import axiosInstance from "@/utils/axiosInstance";

export default function ProfilePage() {
  const { toast } = useToast();
  const [userData, setUserData] = useState(null);
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await axiosInstance.get('auth/profile/');
      setUserData(response.data);
    } catch (error) {
      if (error.response?.status !== 401) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to fetch profile data',
        });
      }
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.patch('auth/profile/', {
        first_name: userData.first_name,
        last_name: userData.last_name,
        username: userData.username,
      });
      toast({
        title: 'Profile Updated',
        description: 'Your profile has been updated successfully',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Update Failed',
        description: error.response?.data?.message || 'Failed to update profile',
      });
    }
  };

  const handleVerifyEmail = async () => {
    try {
      setLoading(true);
      await axiosInstance.post('auth/send-otp/', {
        otp_type: 'email'
      });
      toast({
        title: 'OTP Sent',
        description: 'Please check your email for the verification code',
      });
      setIsVerifyModalOpen(true);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Failed to Send OTP',
        description: error.response?.data?.message || 'Failed to send verification email',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    try {
      await axiosInstance.post('auth/verify-otp/', {
        otp_code: otp,
        otp_type: 'email'
      });
      toast({
        title: 'Email Verified',
        description: 'Your email has been verified successfully',
      });
      setIsVerifyModalOpen(false);
      fetchUserProfile(); // Refresh user data
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Verification Failed',
        description: error.response?.data?.message || 'Invalid or expired OTP',
      });
    }
  };

  if (!userData) return <div>Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Profile Settings</h1>
        {userData.verified_status === 'verified' ? (
          <div className="flex items-center text-green-500">
            <BadgeCheck className="w-5 h-5 mr-1" />
            <span>Verified</span>
          </div>
        ) : (
          <Button onClick={handleVerifyEmail} disabled={loading}>
            <Mail className="w-4 h-4 mr-2" />
            Verify Email
          </Button>
        )}
      </div>

      <form onSubmit={handleUpdate} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              value={userData.first_name}
              onChange={(e) => setUserData({...userData, first_name: e.target.value})}
            />
          </div>
          <div>
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              value={userData.last_name}
              onChange={(e) => setUserData({...userData, last_name: e.target.value})}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            value={userData.username}
            onChange={(e) => setUserData({...userData, username: e.target.value})}
          />
        </div>

        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            value={userData.email}
            disabled
          />
        </div>

        <div>
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            value={userData.phone_number}
            disabled
          />
        </div>

        <Button type="submit">Save Changes</Button>
      </form>

      <Dialog open={isVerifyModalOpen} onOpenChange={setIsVerifyModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Verify Email</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Label htmlFor="otp">Enter OTP sent to your email</Label>
            <Input
              id="otp"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter OTP"
            />
            <Button onClick={handleVerifyOTP}>Verify</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
} 