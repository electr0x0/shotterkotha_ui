"use client";
import React, { useState, useRef, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import Image from 'next/image';
import axios from 'axios';
import { motion, AnimatePresence } from "framer-motion";
import axiosInstance from "@/utils/axiosInstance";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

export default function SignupFormDemo() {
  const { toast } = useToast();
  const router = useRouter();
  const [location, setLocation] = useState({ lat: 23.8103, lng: 90.4125 });
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef(null);
  const [hovering, setHovering] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    password2: '',
    first_name: '',
    last_name: '',
    phone_number: '',
    address: '',
    district: '',
    division: '',
    fullAddress: '',
    longitude: '',
    latitude: ''
  });

  // Helper function to show toasts
  const showToast = (type, title, description) => {
    toast({
      variant: type, // 'default' | 'destructive'
      title: title,
      description: description,
      duration: 5000,
    });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handlePhoneSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post('auth/register/', {
        ...formData,
        phone_number: `+880${formData.phone_number}`
      });

      const { tokens, message } = response.data;
      localStorage.setItem('accessToken', tokens.access);
      localStorage.setItem('refreshToken', tokens.refresh);
      axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${tokens.access}`;

      await axiosInstance.post('auth/send-otp/', {
        otp_type: 'whatsapp'
      });

      setIsOtpSent(true);
      showToast('default', 'Registration Successful', message || 'Please check your WhatsApp for OTP');
    } catch (error) {
      const errorMessage = error.response?.data?.message || 
                          Object.values(error.response?.data || {})[0]?.[0] ||
                          'Registration failed. Please try again.';
      showToast('destructive', 'Registration Failed', errorMessage);
    }
  };

  const handleOtpVerify = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post('auth/verify-otp/', {
        otp_code: otp,
        otp_type: 'whatsapp'
      });
      setIsOtpVerified(true);
      showToast('default', 'OTP Verified', 'OTP verification successful');
      moveToNextStep();
    } catch (error) {
      const errorMessage = error.response?.data?.message || 
                          Object.values(error.response?.data || {})[0]?.[0] ||
                          'OTP verification failed. Please try again.';
      showToast('destructive', 'Verification Failed', errorMessage);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    moveToNextStep();
  };

  // Modify handleFinalSubmit to include redirection
  const handleFinalSubmit = async (e) => {
    e.preventDefault();
    try {
      // Update profile
      await axiosInstance.patch('auth/profile/', {
        first_name: formData.first_name,
        last_name: formData.last_name
      });

      // Update location
      await axiosInstance.patch('auth/update-location/', {
        district: formData.district,
        division: formData.division,
        fullAddress: formData.fullAddress,
        longitude: formData.longitude,
        latitude: formData.latitude
      });

      showToast('default', 'Registration Complete', 'Your profile has been successfully set up');
      
      // Redirect to feed page after successful registration
      router.push('/feed');
    } catch (error) {
      const errorMessage = error.response?.data?.message || 
                          Object.values(error.response?.data || {})[0]?.[0] ||
                          'Failed to update profile. Please try again.';
      showToast('destructive', 'Update Failed', errorMessage);
    }
  };

  // Define render functions first
  const renderStep1 = () => (
    <motion.div
      className="bg-white dark:bg-black rounded-lg p-6 shadow-lg"
      layout
    >
      <div className="space-y-4">
        <div className="text-center mb-6">
          <h3 className="text-lg font-semibold">Create Account</h3>
          <p className="text-sm text-neutral-600 dark:text-neutral-300">Enter your details to register</p>
        </div>

        {!isOtpSent ? (
          <form onSubmit={handlePhoneSubmit}>
            <LabelInputContainer className="mb-4">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                placeholder="your.email@example.com" 
                type="email" 
                required 
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              />
            </LabelInputContainer>

            <LabelInputContainer className="mb-4">
              <Label htmlFor="username">Username</Label>
              <Input 
                id="username" 
                placeholder="username123" 
                type="text" 
                required 
                value={formData.username}
                onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
              />
            </LabelInputContainer>

            <LabelInputContainer className="mb-4">
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password" 
                type="password" 
                required 
                value={formData.password}
                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
              />
            </LabelInputContainer>

            <LabelInputContainer className="mb-4">
              <Label htmlFor="password2">Confirm Password</Label>
              <Input 
                id="password2" 
                type="password" 
                required 
                value={formData.password2}
                onChange={(e) => setFormData(prev => ({ ...prev, password2: e.target.value }))}
              />
            </LabelInputContainer>

            <LabelInputContainer className="mb-4">
              <Label htmlFor="phone">Phone Number</Label>
              <div className="flex">
                <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-r-0 border-gray-300 rounded-l-md dark:bg-gray-600 dark:text-gray-400 dark:border-gray-600">
                  +880
                </span>
                <Input 
                  id="phone" 
                  className="rounded-l-none" 
                  placeholder="1XXXXXXXXX" 
                  type="tel" 
                  pattern="[0-9]{10}" 
                  required 
                  value={formData.phone_number}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone_number: e.target.value }))}
                />
              </div>
            </LabelInputContainer>

            <button
              className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium"
              type="submit">
              Register & Send OTP
              <BottomGradient />
            </button>
          </form>
        ) : !isOtpVerified ? (
          <form onSubmit={handleOtpVerify}>
            <LabelInputContainer className="mb-4">
              <Label htmlFor="otp">Enter WhatsApp OTP</Label>
              <Input 
                id="otp" 
                placeholder="Enter OTP sent to your WhatsApp" 
                type="text" 
                pattern="[0-9]*" 
                required 
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
            </LabelInputContainer>
            <button
              className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium"
              type="submit">
              Verify OTP
              <BottomGradient />
            </button>
          </form>
        ) : null}
      </div>
    </motion.div>
  );

  const renderStep2 = () => (
    <motion.div
      className="bg-white dark:bg-black rounded-lg p-6 shadow-lg"
      layout
    >
      <div className="space-y-4">
        <div className="text-center mb-6">
          <h3 className="text-lg font-semibold">Basic Information</h3>
          <p className="text-sm text-neutral-600 dark:text-neutral-300">Tell us about yourself</p>
        </div>

        <div className="mb-6">
          <div className="flex flex-col items-center space-y-4">
            <div className="relative w-32 h-32 rounded-full overflow-hidden border-2 border-gray-300">
              {previewUrl ? (
                <Image src={previewUrl} alt="Profile" fill className="object-cover" />
              ) : (
                <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                  <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              )}
            </div>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 text-sm bg-gray-100 dark:bg-gray-800 rounded-md"
              type="button"
            >
              Upload Photo
            </button>
            <input
              ref={fileInputRef}
              type="file"
              hidden
              accept="image/*"
              onChange={handleImageUpload}
            />
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-4">
            <LabelInputContainer>
              <Label htmlFor="firstname">First Name</Label>
              <Input 
                id="firstname" 
                placeholder="John" 
                type="text" 
                required 
                value={formData.first_name}
                onChange={(e) => setFormData(prev => ({ ...prev, first_name: e.target.value }))}
              />
            </LabelInputContainer>
            <LabelInputContainer>
              <Label htmlFor="lastname">Last Name</Label>
              <Input 
                id="lastname" 
                placeholder="Doe" 
                type="text" 
                required 
                value={formData.last_name}
                onChange={(e) => setFormData(prev => ({ ...prev, last_name: e.target.value }))}
              />
            </LabelInputContainer>
          </div>

          <button
            className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium"
            type="submit">
            Next
            <BottomGradient />
          </button>
        </form>
      </div>
    </motion.div>
  );

  const renderStep3 = () => (
    <motion.div
      className="bg-white dark:bg-black rounded-lg p-6 shadow-lg"
      layout
    >
      <div className="space-y-4">
        <div className="text-center mb-6">
          <h3 className="text-lg font-semibold">Location Details</h3>
          <p className="text-sm text-neutral-600 dark:text-neutral-300">Set your location</p>
        </div>

        <form onSubmit={handleFinalSubmit} className="space-y-4">
          <LabelInputContainer>
            <Label htmlFor="division">Division</Label>
            <Input 
              id="division" 
              placeholder="Dhaka" 
              type="text" 
              required 
              value={formData.division}
              onChange={(e) => setFormData(prev => ({ ...prev, division: e.target.value }))}
            />
          </LabelInputContainer>

          <LabelInputContainer>
            <Label htmlFor="district">District</Label>
            <Input 
              id="district" 
              placeholder="Dhaka" 
              type="text" 
              required 
              value={formData.district}
              onChange={(e) => setFormData(prev => ({ ...prev, district: e.target.value }))}
            />
          </LabelInputContainer>

          <LabelInputContainer>
            <Label htmlFor="address">Address</Label>
            <div className="h-[300px] w-full mb-2 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-800">
              <MapContainer 
                center={[23.8103, 90.4125]} 
                zoom={13} 
                style={{ height: '100%', width: '100%' }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <LocationMarker setAddress={setAddress} />
              </MapContainer>
            </div>
            <Input 
              id="address" 
              value={formData.fullAddress}
              onChange={(e) => setFormData(prev => ({ ...prev, fullAddress: e.target.value }))}
              placeholder="Click on the map to select location" 
              type="text" 
              required 
            />
          </LabelInputContainer>

          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium mt-6"
            type="submit">
            Complete Signup
            <BottomGradient />
          </motion.button>
        </form>
      </div>
    </motion.div>
  );

  // Then define steps array
  const steps = [
    {
      value: 'step1',
      title: 'Phone Verification',
      content: renderStep1()
    },
    {
      value: 'step2',
      title: 'Basic Information',
      content: renderStep2()
    },
    {
      value: 'step3',
      title: 'Location Details',
      content: renderStep3()
    }
  ];

  const [activeStep, setActiveStep] = useState(steps[0]);

  const moveToNextStep = () => {
    const currentIndex = steps.findIndex(s => s.value === activeStep.value);
    if (currentIndex < steps.length - 1) {
      setActiveStep(steps[currentIndex + 1]);
    }
  };

  // Marker icon fix for Leaflet
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  });

  const reverseGeocode = async (lat, lon) => {
    try {
      const response = await axios.get('https://nominatim.openstreetmap.org/reverse', {
        params: {
          lat,
          lon,
          format: 'json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Reverse geocoding failed:', error);
      return null;
    }
  };

  function LocationMarker({ setAddress }) {
    const [position, setPosition] = useState({ lat: 23.8103, lng: 90.4125 });
    const map = useMap();

    useMapEvents({
      async click(e) {
        const { lat, lng } = e.latlng;
        setPosition({ lat, lng });
        
        setFormData(prev => ({
          ...prev,
          latitude: lat,
          longitude: lng
        }));
        
        const data = await reverseGeocode(lat, lng);
        if (data) {
          setFormData(prev => ({
            ...prev,
            fullAddress: data.display_name
          }));
          setAddress(data.display_name);
        }
      },
    });

    return <Marker position={[position.lat, position.lng]} />;
  }

  return (
    <div className="max-w-2xl w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-white dark:bg-black">
      <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200">
        Sign Up
      </h2>
      <p className="text-neutral-600 text-sm max-w-sm mt-2 dark:text-neutral-300">
        Please fill in your information to create an account
      </p>

      <div className="my-8">
        <div className="flex items-center justify-center mb-8">
          {steps.map((step, idx) => (
            <React.Fragment key={step.value}>
              <button
                onClick={() => setActiveStep(step)}
                onMouseEnter={() => setHovering(true)}
                onMouseLeave={() => setHovering(false)}
                className={cn(
                  "relative w-8 h-8 rounded-full flex items-center justify-center",
                  "transition-colors duration-200"
                )}
              >
                {activeStep.value === step.value && (
                  <motion.div
                    layoutId="activeStep"
                    transition={{ type: "spring", bounce: 0.3, duration: 0.6 }}
                    className="absolute inset-0 bg-black dark:bg-zinc-800 rounded-full"
                  />
                )}
                <span className="relative block text-sm font-medium z-10 text-black dark:text-white">
                  {idx + 1}
                </span>
              </button>
              {idx < steps.length - 1 && (
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ 
                    scaleX: steps.indexOf(activeStep) > idx ? 1 : 0,
                    backgroundColor: steps.indexOf(activeStep) > idx ? 'var(--black)' : 'var(--gray-200)'
                  }}
                  className="w-12 h-1 bg-gray-200 dark:bg-gray-700"
                />
              )}
            </React.Fragment>
          ))}
        </div>

        <div className="relative min-h-[700px]">
          {steps.map((step, idx) => {
            const isActive = step.value === activeStep.value;
            
            return (
              <motion.div
                key={step.value}
                initial={{ x: 300, opacity: 0 }}
                animate={{
                  x: isActive ? 0 : 300,
                  opacity: isActive ? 1 : 0,
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                }}
                transition={{
                  duration: 0.3,
                  ease: "easeInOut"
                }}
                style={{
                  display: isActive ? 'block' : 'none',
                }}
                className="w-full"
              >
                <div className="h-full">
                  {step.content}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

const BottomGradient = () => {
  return (<>
    <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
    <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
  </>);
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
