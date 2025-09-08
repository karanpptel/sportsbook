"use client";

import React, { useEffect, useState } from "react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { venueSchema, VenueFormValues } from "@/lib/validations/venue";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import { ProtectedRoutes } from "@/components/dashboard/layout/ProtectedRoute";
import { useRouter } from "next/navigation";
import VenueListPage from "@/components/owner/VenueListPage";

interface Venue {
  id: number;
  name: string;
  address: string;
  city: string;
  state: string;
  description: string;
  amenities: string[];
  photos: string[];
  approved: boolean;
}

const AMENITIES_OPTIONS = [
  "Parking",
  "Lights",
  "Locker Room",
  "WiFi",
  "Cafeteria",
  "Seating Area",
  "First Aid",
  "Equipment Rental",
  "Restrooms"
];

// PhotoPreview component with error handling
interface PhotoPreviewProps {
  src: string;
  alt: string;
  onRemove: () => void;
}

const PhotoPreview: React.FC<PhotoPreviewProps> = ({ src, alt, onRemove }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleImageLoad = () => {
    setImageLoaded(true);
    setIsLoading(false);
    setImageError(false);
  };

  const handleImageError = () => {
    setImageError(true);
    setIsLoading(false);
    setImageLoaded(false);
    console.error("Failed to load image:", src);
  };

  return (
    <div className="relative group">
      {/* Loading skeleton */}
      {isLoading && (
        <div className="w-full h-24 rounded-xl bg-slate-200 border-2 border-slate-200 animate-pulse flex items-center justify-center">
          <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
      )}

      {/* Error state */}
      {imageError && (
        <div className="w-full h-24 rounded-xl bg-red-50 border-2 border-red-200 flex flex-col items-center justify-center">
          <svg className="w-6 h-6 text-red-400 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <span className="text-xs text-red-500">Failed to load</span>
        </div>
      )}

      {/* Actual image */}
      <img
        src={src}
        alt={alt}
        onLoad={handleImageLoad}
        onError={handleImageError}
        className={`w-full h-24 rounded-xl object-cover border-2 border-slate-200 transition-opacity duration-200 ${
          imageLoaded ? 'opacity-100' : 'opacity-0 absolute inset-0'
        }`}
        style={{ display: imageError ? 'none' : 'block' }}
      />

      {/* Remove button overlay */}
      {(imageLoaded || imageError) && (
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 rounded-xl transition-all duration-200 flex items-center justify-center">
          <button
            type="button"
            onClick={onRemove}
            className="opacity-0 group-hover:opacity-100 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-all duration-200"
            title="Remove image"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};

export default function OwnerVenuePage() {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const form = useForm<VenueFormValues>({
    resolver: zodResolver(venueSchema),
    defaultValues: {
      name: "",
      address: "",
      city: "",
      state: "",
      description: "",
      amenities: [],
      photos: [],
    },
  });

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    getValues,
    setValue,
    watch,
    reset,
  } = form;

  const router = useRouter();

  // Fetch Venues
  useEffect(() => {
    async function fetchVenues() {
      setLoading(true);
      try {
        const res = await fetch("/api/dashboard/owner/venues");
        const data = await res.json();

        if (!res.ok) {
          toast.error(data.error || "Failed to fetch venues");
          return;
        }

        const normalized = data.venues.map((v: any) => ({
          id: v.id,
          name: v.name,
          description: v.description,
          address: v.address,
          city: v.city,
          state: v.state,
          amenities: v.amenities || [],
          photos: v.photos || [],
          approved: v.approved ?? false,
        }));

        setVenues(normalized);
      } catch (error) {
        console.error(error);
        toast.error("Something went wrong");
      } finally {
        setLoading(false);
      }
    }

    fetchVenues();
  }, []);

  // Handle Photo Upload
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {

    //Early return if no files selected
    if (!e.target.files || e.target.files.length === 0) {
      toast.error("Please select a file");
      return;
    }

    const file = e.target.files[0];

     // Validate file type and size
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      toast.error("Please select a valid image file (JPG, JPEG or PNG)");
      return;
    }

    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      toast.error("File is too large. Maximum size is 10MB");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "YOUR_CLOUDINARY_UPLOAD_PRESET");

    try {
      setUploading(true);
      const res = await fetch("/api/upload/venue", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (data.url) {
        const currentPhotos = (getValues("photos") || []) as string[];
        setValue("photos", [...currentPhotos, data.url]);
        toast.success("Photo uploaded successfully");
      } else {
        toast.error("Upload failed");
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload photo");
    } finally {
      setUploading(false);
      // Clear the input value to allow uploading the same file again
      e.target.value = '';
    }
  };

  // Submit Venue
  const onSubmit: SubmitHandler<VenueFormValues> = async (data) => {
    try {
      const res = await fetch("/api/dashboard/owner/venues", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const resData = await res.json();
      if (!res.ok) {
        toast.error(resData.error || "Failed to add venue");
        return;
      }
      toast.success("Venue created successfully");

      setVenues((prev) => [...prev, resData.venue]);
      reset();
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  };

  return (
    <ProtectedRoutes allowedRoles={["OWNER"]}>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-6 lg:p-8">
        <div className="mx-auto max-w-7xl space-y-8">
          {/* Header Section */}
          <div className="flex flex-col space-y-2">
            <h1 className="text-4xl font-bold tracking-tight text-slate-900">
              Manage Venues
            </h1>
            <p className="text-lg text-slate-600">
              Create and manage your sports venues with ease
            </p>
          </div>

          {/* Add Venue Form */}
          <Card className="rounded-3xl border-0 bg-white shadow-xl shadow-slate-200/50">
            <CardHeader className="pb-6">
              <div className="flex items-center space-x-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                  <svg className="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <div>
                  <CardTitle className="text-2xl font-semibold text-slate-900">
                    Add New Venue
                  </CardTitle>
                  <p className="text-sm text-slate-500 mt-1">
                    Fill in the details to create a new venue listing
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="px-6 pb-8">
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="grid gap-8 lg:grid-cols-2"
              >
              {/* Basic Information Section */}
                <div className="lg:col-span-2">
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">
                      Basic Information
                    </h3>
                    <p className="text-sm text-slate-500">
                      Enter the fundamental details about your venue
                    </p>
                  </div>
                  
                  <div className="grid gap-6 sm:grid-cols-2">
                    {/* Name */}
                    <div className="space-y-3">
                      <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                        <svg className="h-4 w-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        Venue Name
                      </label>
                      <Input 
                        {...register("name")} 
                        placeholder="Enter venue name"
                        className="h-12 rounded-xl border-slate-200 bg-slate-50/50 focus:bg-white focus:border-blue-300 focus:ring-blue-200 transition-all duration-200"
                      />
                      {errors.name && (
                        <p className="text-xs text-red-500 flex items-center gap-1">
                          <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                          {errors.name.message}
                        </p>
                      )}
                    </div>

                    {/* City */}
                    <div className="space-y-3">
                      <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                        <svg className="h-4 w-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        City
                      </label>
                      <Input 
                        {...register("city")} 
                        placeholder="Enter city"
                        className="h-12 rounded-xl border-slate-200 bg-slate-50/50 focus:bg-white focus:border-blue-300 focus:ring-blue-200 transition-all duration-200"
                      />
                      {errors.city && (
                        <p className="text-xs text-red-500 flex items-center gap-1">
                          <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                          {errors.city.message}
                        </p>
                      )}
                    </div>

                    {/* Address */}
                    <div className="space-y-3">
                      <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                        <svg className="h-4 w-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        Street Address
                      </label>
                      <Input
                        {...register("address")}
                        placeholder="Enter street address"
                        className="h-12 rounded-xl border-slate-200 bg-slate-50/50 focus:bg-white focus:border-blue-300 focus:ring-blue-200 transition-all duration-200"
                      />
                      {errors.address && (
                        <p className="text-xs text-red-500 flex items-center gap-1">
                          <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                          {errors.address.message}
                        </p>
                      )}
                    </div>

                    {/* State */}
                    <div className="space-y-3">
                      <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                        <svg className="h-4 w-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                        </svg>
                        State/Province
                      </label>
                      <Input 
                        {...register("state")} 
                        placeholder="Enter state or province"
                        className="h-12 rounded-xl border-slate-200 bg-slate-50/50 focus:bg-white focus:border-blue-300 focus:ring-blue-200 transition-all duration-200"
                      />
                      {errors.state && (
                        <p className="text-xs text-red-500 flex items-center gap-1">
                          <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                          {errors.state.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Description */}
                  <div className="mt-6 space-y-3">
                    <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                      <svg className="h-4 w-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                      </svg>
                      Description
                    </label>
                    <textarea
                      {...register("description")}
                      placeholder="Provide a detailed description of your venue, including facilities, capacity, and unique features..."
                      className="w-full rounded-xl border-slate-200 bg-slate-50/50 focus:bg-white focus:border-blue-300 focus:ring-blue-200 px-4 py-3 min-h-[120px] transition-all duration-200 resize-none"
                    />
                    {errors.description && (
                      <p className="text-xs text-red-500 flex items-center gap-1">
                        <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {errors.description.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Amenities & Media Section */}
                <div className="lg:col-span-2 space-y-8">
                  {/* Amenities */}
                  <div>
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold text-slate-900 mb-2 flex items-center gap-2">
                        <svg className="h-5 w-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Available Amenities
                      </h3>
                      <p className="text-sm text-slate-500">
                        Select all amenities available at your venue
                      </p>
                    </div>
                    
                    <Controller
                      control={control}
                      name="amenities"
                      render={({ field }) => (
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                          {AMENITIES_OPTIONS.map((amenity) => (
                            <label
                              key={amenity}
                              className="flex items-center gap-3 p-4 rounded-xl border-2 border-slate-200 bg-slate-50/30 hover:bg-blue-50 hover:border-blue-200 cursor-pointer transition-all duration-200 group"
                            >
                              <input
                                type="checkbox"
                                value={amenity}
                                checked={field.value?.includes(amenity) ?? false}
                                onChange={(e) => {
                                  const value = e.target.value;

                                  //Ensure field.value is an array
                                  const currentValue = field.value || [];
                                   if (e.target.checked) {
                                    field.onChange([...currentValue, value]);
                                  } else {
                                    field.onChange(
                                      currentValue.filter((v) => v !== value)
                                    );
                                  }
                                }}
                                className="h-4 w-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                              />
                              <span className="text-sm font-medium text-slate-700 group-hover:text-blue-700">
                                {amenity}
                              </span>
                            </label>
                          ))}
                        </div>
                      )}
                    />
                    {errors.amenities && (
                      <p className="text-xs text-red-500 flex items-center gap-1 mt-2">
                        <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {errors.amenities.message}
                      </p>
                    )}
                  </div>

                  {/* Photos */}
                  <div>
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold text-slate-900 mb-2 flex items-center gap-2">
                        <svg className="h-5 w-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Venue Photos
                      </h3>
                      <p className="text-sm text-slate-500">
                        Upload high-quality photos to showcase your venue
                      </p>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-center w-full">
                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-slate-300 border-dashed rounded-xl cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors duration-200">
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <svg className="w-8 h-8 mb-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                            <p className="mb-2 text-sm text-slate-500">
                              <span className="font-semibold">Click to upload</span> or drag and drop
                            </p>
                            <p className="text-xs text-slate-500">PNG, JPG or JPEG (MAX. 10MB)</p>
                          </div>
                          <input
                            type="file"
                            accept="image/jpeg,image/png,image/jpg"
                            onChange={handlePhotoUpload}
                            disabled={uploading}
                            className="hidden"
                          />
                        </label>
                      </div>
                      
                      {uploading && (
                        <div className="flex items-center justify-center p-4 bg-blue-50 rounded-xl">
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          <span className="text-sm text-blue-600 font-medium">Uploading photo...</span>
                        </div>
                      )}

                      {/* Photos grid */}
                      {(watch("photos") || []).length > 0 && (
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                          {(watch("photos") || []).map((photo, idx) => (
                            <PhotoPreview
                              key={`${photo}-${idx}`}
                              src={photo}
                              alt={`Venue photo ${idx + 1}`}
                              onRemove={() => {
                                const currentPhotos = getValues("photos") || [];
                                setValue("photos", currentPhotos.filter((_, i) => i !== idx));
                              }}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="flex justify-end pt-6 border-t border-slate-200">
                    <Button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center gap-2">
                          <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Creating Venue...
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                          Create Venue
                        </div>
                      )}
                    </Button>
                  </div>
                </div>
            </form>
          </CardContent>
        </Card>

        {/* Venue List */}
          <VenueListPage venues={venues} />
        </div>
      </div>
    </ProtectedRoutes>
  );
}
