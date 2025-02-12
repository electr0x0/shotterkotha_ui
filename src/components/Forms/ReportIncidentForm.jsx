"use client";
import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Upload, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import AIImageDescription from "@/components/Posts/AIImageDescription";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { toast } from "sonner";
import axiosInstance from '@/utils/axiosInstance';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import bangladeshGeo from '@/data/geo/bangladesh.json';

// Fix Leaflet default icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Define the form schema
const formSchema = z.object({
  title: z.string().min(10, "Title must be at least 10 characters"),
  description: z.string().default(" xyz"),
  severity: z.enum(["low", "medium", "high"]),
  category: z.enum([
    "theft", "assault", "fraud", "vandalism", "murder",
    "rape", "kidnapping", "arson", "terrorism", "bribery", "other"
  ]),
  fullAddress: z.string().min(5, "Full address is required"),
  district: z.string().min(1, "District is required"),
  division: z.string().min(1, "Division is required"),
  crime_time: z.string().min(1, "Crime time is required"),
  latitude: z.number().transform(val => Number(val.toFixed(6))),
  longitude: z.number().transform(val => Number(val.toFixed(6))),
});

function MapPicker({ onLocationSelect }) {
  const [position, setPosition] = useState([23.8103, 90.4125]); // Default to Dhaka

  const map = useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      const formattedLat = Number(lat.toFixed(6));
      const formattedLng = Number(lng.toFixed(6));
      setPosition([formattedLat, formattedLng]);
      onLocationSelect(formattedLat, formattedLng);
    },
  });

  return (
    <Marker position={position} />
  );
}

export function ReportIncidentForm({ onClose }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mediaFiles, setMediaFiles] = useState([]);
  const [districts, setDistricts] = useState([]);

  // Initialize form
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      severity: "low",
      category: "other",
      fullAddress: "",
      district: "",
      division: "",
      crime_time: new Date().toISOString().slice(0, 16),
      latitude: 23.8103,
      longitude: 90.4125,
    },
  });

  // Update districts when division changes
  const onDivisionChange = (division) => {
    form.setValue('division', division);
    form.setValue('district', '');
    setDistricts(bangladeshGeo.divisions[division] || []);
  };

  // Handle location selection
  const handleLocationSelect = (lat, lng) => {
    form.setValue('latitude', lat);
    form.setValue('longitude', lng);
  };

  // Handle media upload
  const handleMediaUpload = (e) => {
    const files = Array.from(e.target.files);
    const newMediaFiles = files.map((file, index) => ({
      file,
      media_type: file.type.startsWith('image/') ? 'image' : 'video',
      preview: URL.createObjectURL(file),
    }));
    setMediaFiles([...mediaFiles, ...newMediaFiles]);
  };

  // Remove media
  const removeMedia = (index) => {
    setMediaFiles(mediaFiles.filter((_, i) => i !== index));
  };

  // Update media description
  const updateMediaDescription = (index, description) => {
    const updatedFiles = mediaFiles.map((media, i) => 
      i === index ? { ...media, ai_description: description } : media
    );
    setMediaFiles(updatedFiles);
  };

  // Form submission
  const onSubmit = async (values) => {
    try {
      setIsSubmitting(true);

      if (mediaFiles.length === 0) {
        toast.error("Please upload at least one photo or video");
        return;
      }

      const formData = new FormData();

      // Append basic fields with proper formatting
      Object.keys(values).forEach(key => {
        if (key === 'crime_time') {
          formData.append(key, new Date(values[key]).toISOString());
        } else if (key === 'latitude' || key === 'longitude') {
          // Format coordinates to 6 decimal places
          formData.append(key, Number(values[key]).toFixed(6));
        } else if (key === 'description') {
          // Send a single space for description
          formData.append(key, " ");
        } else {
          formData.append(key, values[key] || '');
        }
      });

      // Append media files
      mediaFiles.forEach(media => {
        formData.append('media', media.file);
      });

      await axiosInstance.post('reports/posts/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success("Incident reported successfully");
      onClose();
    } catch (error) {
      console.error('Submission error:', error);
      toast.error(error.response?.data?.message || "Failed to submit report");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Brief title describing the incident" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="severity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Severity</FormLabel>
              <FormControl>
                <select 
                  {...field} 
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <FormControl>
                <select 
                  {...field} 
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="theft">Theft</option>
                  <option value="assault">Assault</option>
                  <option value="fraud">Fraud</option>
                  <option value="vandalism">Vandalism</option>
                  <option value="murder">Murder</option>
                  <option value="rape">Rape</option>
                  <option value="kidnapping">Kidnapping</option>
                  <option value="arson">Arson</option>
                  <option value="terrorism">Terrorism</option>
                  <option value="bribery">Bribery</option>
                  <option value="other">Other</option>
                </select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="division"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Division</FormLabel>
              <FormControl>
                <select 
                  {...field}
                  onChange={(e) => onDivisionChange(e.target.value)}
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="">Select Division</option>
                  {Object.keys(bangladeshGeo.divisions).map((division) => (
                    <option key={division} value={division}>
                      {division}
                    </option>
                  ))}
                </select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="district"
          render={({ field }) => (
            <FormItem>
              <FormLabel>District</FormLabel>
              <FormControl>
                <select 
                  {...field}
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="">Select District</option>
                  {districts.map((district) => (
                    <option key={district} value={district}>
                      {district}
                    </option>
                  ))}
                </select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="fullAddress"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Address</FormLabel>
              <FormControl>
                <Input placeholder="Enter the incident location" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="crime_time"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date and Time</FormLabel>
              <FormControl>
                <Input
                  type="datetime-local"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormItem>
          <FormLabel>Location (Click to select)</FormLabel>
          <div className="h-[300px] w-full rounded-md border">
            <MapContainer
              center={[23.8103, 90.4125]}
              zoom={6}
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              <MapPicker onLocationSelect={handleLocationSelect} />
            </MapContainer>
          </div>
        </FormItem>

        <div className="space-y-4">
          <FormLabel>Media</FormLabel>
          <div className="grid grid-cols-2 gap-4">
            {mediaFiles.map((media, index) => (
              <div key={index} className="relative group">
                {media.media_type === 'image' ? (
                  <img
                    src={media.preview}
                    alt={`Upload ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                ) : (
                  <video
                    src={media.preview}
                    className="w-full h-32 object-cover rounded-lg"
                    controls
                  />
                )}
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => removeMedia(index)}
                >
                  ×
                </Button>
              </div>
            ))}
          </div>
          <div className="flex justify-center">
            <Input
              type="file"
              accept="image/*,video/*"
              multiple
              onChange={handleMediaUpload}
              className="hidden"
              id="media-upload"
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => document.getElementById('media-upload').click()}
              className="w-full"
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload Photos/Videos
            </Button>
          </div>
          {mediaFiles.length === 0 && (
            <p className="text-sm text-muted-foreground">
              Please upload at least one photo or video
            </p>
          )}
        </div>

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button 
            type="submit"
            disabled={isSubmitting || mediaFiles.length === 0}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              'Submit Report'
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}