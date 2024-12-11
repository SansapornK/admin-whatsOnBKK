"use client";
import { useState,useRef } from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import SelectGroupOne from "@/components/SelectGroup/SelectGroupOne";  // Type selection component
import SelectGroupTwo from "@/components/SelectGroup/SelectGroupTwo";  // Time selection component
import DatePickerOne from "@/components/FormElements/DatePicker/DatePickerOne";  // Date picker component
import axios from "axios";

// Define a type for the form data to ensure correct types for each field
interface EventFormData {
  name: string;
  description: string;
  type: string;
  location: {
    area: string;
    address: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  date: string;
  time: string;
  images: File[]; // Array of File objects for image files
}

const AddEventPage = () => {
  const [formData, setFormData] = useState<EventFormData>({
    name: "",
    description: "",  // This will be used for 'details' input
    type: "",
    date: "",
    time: "",
    location: {
      area: "",
      address: "",
      coordinates: { lat: 0, lng: 0 },
    },
    images: [],  // Array to store image files (File objects)
  });

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
  
    if (name === "lat" || name === "lng") {
      const floatRegex = /^-?\d*\.?\d*$/; // Allow decimal points for latitude and longitude
  
      if (!floatRegex.test(value)) return; // Reject invalid input
  
      setFormData((prev) => ({
        ...prev,
        location: {
          ...prev.location,
          coordinates: {
            ...prev.location.coordinates,
            [name]: value,
          },
        },
      }));
    } else if (["area", "address"].includes(name)) {
      setFormData((prev) => ({
        ...prev,
        location: {
          ...prev.location,
          [name]: value,
        },
      }));
    } else if (["date", "time", "type"].includes(name)) {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    } else if (
      e.target instanceof HTMLInputElement && e.target.type === "file" && e.target.files
    ) {
      // Handle file input (e.g., image upload)
      const files = e.target.files;
      if (files) {
        setFormData((prev) => ({
          ...prev,
          images: [...prev.images, ...Array.from(files)], // Add new files to the images array
        }));
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    const data = new FormData();
  
    // Convert location.coordinates.lat and location.coordinates.lng to strings
    const { lat, lng } = formData.location.coordinates;
    const coordinates = {
      lat: lat.toString(), // Convert to string
      lng: lng.toString(), // Convert to string
    };
  
    // Append other fields
    data.append("name", formData.name);
    data.append("description", formData.description);
    data.append("type", formData.type);
    data.append("date", formData.date);
    data.append("time", formData.time);

    data.append("location[area]", formData.location.area);
    data.append("location[address]", formData.location.address);
    data.append("location[coordinates][lat]", coordinates.lat);
    data.append("location[coordinates][lng]", coordinates.lng);
  
    // Append images (handle each file in the array)
    formData.images.forEach((image) => {
      data.append("images[]", image); // Correctly append image file as part of the FormData
    });

    if (!formData.name || !formData.description || !formData.date || !formData.time) {
      alert("Please fill all required fields.");
      return;
    }
  
    try {
      const response = await axios.post("/api/addEvent", data);
      alert("Event created successfully!");
      
      setFormData({
        name: "",
        description: "",
        type: "",
        date: "",
        time: "",
        location: {
          area: "",
          address: "",
          coordinates: { lat: 0, lng: 0 },
        },
        images: [],
      });

      if (fileInputRef.current) {
        fileInputRef.current.value = ""; // Reset file input
      }

    } catch (error) {
      console.error("Error creating event:", error);
      alert("Failed to create event. Please try again.");
    }
  };

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Add Event" />
      <div className="grid grid-cols-1 gap-9 sm">
        <div className="flex flex-col">
          <div className="rounded-sm border border-stroke bg-white shadow-default">
            <div className="border-b border-stroke px-6.5 py-4">
              <h3 className="font-medium text-black">Add new event</h3>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="p-6.5">
                {/* Event Name */}
                <div className="mb-4.5">
                  <label className="mb-3 block text-sm font-medium text-black">
                    Event name
                  </label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Enter event name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full rounded border-[1.5px] px-5 py-3 text-black"
                  />
                </div>
                {/* Date, Time, and Type */}
                <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                  <div className="w-full xl:w-1/3">
                    <DatePickerOne value={formData.date} onChange={(e) => handleChange(e)} />
                  </div>
                  <div className="w-full xl:w-1/3">
                    <SelectGroupTwo value={formData.time} onChange={handleChange} />
                  </div>
                  <div className="w-full xl:w-1/3">
                    <SelectGroupOne value={formData.type} onChange={handleChange} />
                  </div>
                </div>
                {/* Area */}
                <div className="mb-4.5">
                  <label className="mb-3 block text-sm font-medium text-black">
                    Area
                  </label>
                  <input
                    type="text"
                    name="area"
                    placeholder="Enter Event Area"
                    value={formData.location.area}
                    onChange={handleChange}
                    className="w-full rounded border-[1.5px] px-5 py-3 text-black"
                  />
                </div>
                {/* Address */}
                <div className="mb-4.5">
                  <label className="mb-3 block text-sm font-medium text-black">
                    Event Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    placeholder="Enter event address"
                    value={formData.location.address}
                    onChange={handleChange}
                    className="w-full rounded border-[1.5px] px-5 py-3 text-black"
                  />
                </div>
                {/* Latitude/Longitude */}
                <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                  <div className="w-full xl:w-1/2">
                    <label className="mb-3 block text-sm font-medium text-black">
                      Latitude
                    </label>
                    <input
                      type="text"
                      name="lat"
                      placeholder="Enter latitude"
                      value={formData.location.coordinates.lat || ""}
                      onChange={handleChange}
                      className="w-full rounded border-[1.5px] px-5 py-3 text-black"
                    />
                  </div>
                  <div className="w-full xl:w-1/2">
                    <label className="mb-3 block text-sm font-medium text-black">
                      Longitude
                    </label>
                    <input
                      type="text"
                      name="lng"
                      placeholder="Enter longitude"
                      value={formData.location.coordinates.lng || ""}
                      onChange={handleChange}
                      className="w-full rounded border-[1.5px] px-5 py-3 text-black"
                    />
                  </div>
                </div>
                {/* Details */}
                <div className="mb-6">
                  <label className="mb-3 block text-sm font-medium text-black">
                    Details
                  </label>
                  <textarea
                    rows={6}
                    name="description"
                    placeholder="Type event details."
                    value={formData.description}
                    onChange={handleChange}
                    className="w-full rounded border-[1.5px] px-5 py-3 text-black"
                  ></textarea>
                </div>
                {/* File Upload */}
                <div>
                  <label className="mb-3 block text-sm font-medium text-black">
                    Attach file (Image)
                  </label>
                  <input
                    type="file"
                    name="images[]"
                    multiple // Allow multiple files to be selected
                    onChange={handleChange}
                    className="w-full cursor-pointer rounded-lg border-[1.5px] px-5 py-3"
                  />
                </div>
                {/* Submit Button */}
                <button
                  type="submit"
                  className="mt-4 w-full rounded bg-primary p-3 text-gray"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default AddEventPage;
