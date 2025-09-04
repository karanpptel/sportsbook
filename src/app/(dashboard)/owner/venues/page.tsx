"use client"


import React, { useEffect, useState } from "react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { venueSchema, VenueFormValues } from "@/lib/validations/venue";
import { DashboardLayout } from "@/components/dashboard/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
//import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"; // your multi-select component
import { toast } from "react-toastify";
import { ProtectedRoutes } from "@/components/dashboard/layout/ProtectedRoute";
import { useRouter } from "next/navigation";
import VenueListPage from "@/components/owner/VenueListPage";




interface Venue {
  id: number;
  name: string;
  address: string;
  city: string;
  state?: string;
  description?: string;
  amenities?: string[];
  photos?: string[];
  approved?: boolean;
}

const AMENITIES_OPTIONS = ["Parking", "Lights", "Locker Room", "WiFi", "Cafeteria"];


export default function OwnerVenuePage() {

  const [venue, setVenue] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(false);

  //for upload image 
const [uploading, setUploading] = useState(false);

  const form = useForm({
    resolver: zodResolver(venueSchema),
    defaultValues:{
      name: "",
      address: "",
      city: "",
      state: "",
      description: "",
      amenities: [],
      photos: [],
    }
  });



  const { register, handleSubmit, control, formState: { errors, isSubmitting }, getValues, setValue, watch } = form;

  const router = useRouter();

  useEffect(() => {
  async function fetchVenue() {
    try {
      const res = await fetch("/api/dashboard/owner/venues");
      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Failed to fetch venues");
        setLoading(false);
        return;
      }

      // Normalize venue data
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

      setVenue(normalized);
      setLoading(false);
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
      setLoading(false);
    }
  }

  fetchVenue();
}, []);



  //for upload image
    const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;

        const file = e.target.files[0];
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
            // Append uploaded URL to photos array in RHF
            const currentPhotos = (getValues("photos") || []) as string[];
            setValue("photos", [...currentPhotos, data.url]);
            toast.success("Photo uploaded successfully");
          } else {
            toast.error("Upload failed");
          }
        } catch (error) {
          console.error(error);
          toast.error("Upload error");
        } finally {
          setUploading(false);
        }
};


  const onSubmit:SubmitHandler<VenueFormValues> = async (data) => {
    try {
      const res = await fetch("/api/dashboard/owner/venues", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      const resData = await res.json();
       if (!res.ok) {
        toast.error(resData.error || "Failed to add venue");
        return;
      }
      toast.success("Venue created successfully");
      
      setVenue((prevVenues) => [...prevVenues, resData.venue]);
      form.reset(); // reset the form
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  }




  return (
    <ProtectedRoutes allowedRoles={["OWNER"]}>
      <DashboardLayout>
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Add New Venue</h2>

          <Card className="shadow-sm rounded-2xl p-6">
            <CardHeader>
              <CardTitle>Venue Form</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <label className="block mb-1">Name</label>
                  <Input {...register("name")} />
                  {errors.name && <p className="text-red-500">{errors.name.message}</p>}
                </div>

                <div>
                  <label className="block mb-1">Address</label>
                  <Input {...register("address")} />
                  {errors.address && <p className="text-red-500">{errors.address.message}</p>}
                </div>

                <div>
                  <label className="block mb-1">City</label>
                  <Input {...register("city")} />
                  {errors.city && <p className="text-red-500">{errors.city.message}</p>}
                </div>

                <div>
                  <label className="block mb-1">State</label>
                  <Input {...register("state")} />
                  {errors.state && <p className="text-red-500">{errors.state.message}</p>}
                </div>

                <div>
                  <label className="block mb-1">Description</label>
                  <Input {...register("description")} />
                  {errors.description && <p className="text-red-500">{errors.description.message}</p>}
                </div>

                <div>
                  <label className="block mb-1">Amenities</label>
                  <Controller
                    control={control}
                    name="amenities"
                    render={({ field }) => (
                      <div className="space-y-1">
                        {AMENITIES_OPTIONS.map((amenity) => (
                          <label key={amenity} className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              value={amenity}
                              checked={field.value?.includes(amenity) || false}
                              onChange={(e) => {
                                const value = e.target.value;
                                if (e.target.checked) {
                                  field.onChange([...(field.value || []), value]);
                                } else {
                                  field.onChange((field.value || []).filter((v) => v !== value));
                                }
                              }}
                            />
                            {amenity}
                          </label>
                        ))}
                      </div>
                    )}
                  />

                  {errors.amenities && (
                    <p className="text-red-500">{errors.amenities.message}</p>
                  )}

                </div>

                {/* Cloudinary Photo Upload can be added here */}
                <div>
                  <label className="block mb-1">Photos</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    disabled={uploading}
                  />
                  {uploading && <p className="text-gray-500">Uploading...</p>}

                  <div className="flex flex-wrap mt-2 gap-2">
                    {watch("photos")?.map((photo: string, idx: number) => (
                      <img key={idx} src={photo} alt={`Venue photo ${idx}`} className="w-20 h-20 object-cover rounded" />
                    ))}
                  </div>
                </div>



                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Adding..." : "Add Venue"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Venues List Table */}
         <VenueListPage venues={venue} />
       

        </div>
      </DashboardLayout>
    </ProtectedRoutes>
  )
}
