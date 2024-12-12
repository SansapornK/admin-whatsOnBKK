"use client";

import { useState, useEffect, useRef } from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { useRouter } from "next/navigation";
import axios from "axios";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import DatePickerStart from "@/components/FormElements/DatePicker/DatePickerStart";
import DatePickerEnd from "@/components/FormElements/DatePicker/DatePickerEnd";
import SelectGroupTypes from "@/components/SelectGroup/SelectGroupTypes";

const EditEventPage = ({ params }: { params: { id: string } }) => {
  const { id } = params;
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    type: "",
    dateStart: "",
    dateEnd: "",
    timeStart: "",
    timeEnd: "",
    isPublic: true,
    location: {
      area: "",
      address: "",
      coordinates: { lat: 0, lng: 0 },
    },
    images: [],
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const convertTo24Hour = (time12h: string) => {
      const [time, modifier] = time12h.split(" ");
      let [hours, minutes] = time.split(":").map(Number);

      if (modifier === "PM" && hours !== 12) {
        hours += 12;
      }
      if (modifier === "AM" && hours === 12) {
        hours = 0;
      }

      return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
    };

    const fetchEvent = async () => {
      try {
        const response = await axios.get(`/api/events/${id}`);
        const event = response.data;

        setFormData({
          ...event,
          dateStart: event.dateStart.split("T")[0],
          dateEnd: event.dateEnd.split("T")[0],
          timeStart: convertTo24Hour(event.timeStart),
          timeEnd: convertTo24Hour(event.timeEnd),
        });
      } catch (error) {
        console.error("Error fetching event:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.put(`/api/events/${id}`, formData);
      alert("Event updated successfully!");
      router.push("/allEvent");
    } catch (error) {
      console.error("Error updating event:", error);
      alert("Failed to update event.");
    }
  };


  if (loading) return <p>Loading...</p>;

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Edit Event" />
      <div className="grid grid-cols-1 gap-9 sm">
        <div className="flex flex-col">
          <div className="rounded-sm border border-stroke bg-white shadow-default">
            <div className="border-b border-stroke px-6.5 py-4">
              <h3 className="font-medium text-black">Edit Event</h3>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="p-6.5">
                <div className="mb-4.5">
                  <label className="mb-3 block text-sm font-medium text-black">Event Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full rounded border-[1.5px] px-5 py-3 text-black"
                    required
                  />
                </div>

                <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                  <div className="w-full xl:w-1/3">
                    <DatePickerStart value={formData.dateStart} onChange={(e) => handleInputChange(e)} />
                  </div>
                  <div className="w-full xl:w-1/3">
                    <DatePickerEnd value={formData.dateEnd} onChange={(e) => handleInputChange(e)} />
                  </div>
                </div>

                <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                  <div className="w-full xl:w-1/4">
                    <label className="mb-3 block text-sm font-medium text-black">Start Time</label>
                    <input
                      type="time"
                      name="timeStart"
                      value={formData.timeStart}
                      onChange={handleInputChange}
                      required
                      className="w-full rounded border-[1.5px] px-5 py-3 text-black"
                    />
                  </div>
                  <div className="w-full xl:w-1/4">
                    <label className="mb-3 block text-sm font-medium text-black">End Time</label>
                    <input
                      type="time"
                      name="timeEnd"
                      value={formData.timeEnd}
                      onChange={handleInputChange}
                      required
                      className="w-full rounded border-[1.5px] px-5 py-3 text-black"
                    />
                  </div>
                </div>

                <div className="mb-4.5">
                  <div className="w-full xl:w-1/3">
                    <SelectGroupTypes value={formData.type} onChange={(e) => handleInputChange(e)} />
                  </div>
                </div>

                <div className="mb-4.5">
                  <label className="mb-3 block text-sm font-medium text-black">Location Area</label>
                  <input
                    type="text"
                    name="location.area"
                    value={formData.location.area}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        location: { ...prev.location, area: e.target.value },
                      }))
                    }
                    className="w-full rounded border-[1.5px] px-5 py-3 text-black"
                    required
                  />
                </div>

                <div className="mb-4.5">
                  <label className="mb-3 block text-sm font-medium text-black">Address</label>
                  <input
                    type="text"
                    name="location.address"
                    value={formData.location.address}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        location: { ...prev.location, address: e.target.value },
                      }))
                    }
                    className="w-full rounded border-[1.5px] px-5 py-3 text-black"
                    required
                  />
                </div>

                <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                  <div className="w-full xl:w-1/2">
                    <label className="mb-3 block text-sm font-medium text-black">Latitude</label>
                    <input
                      type="text"
                      name="location.coordinates.lat"
                      value={formData.location.coordinates?.lat || ""}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          location: {
                            ...prev.location,
                            coordinates: {
                              ...prev.location.coordinates,
                              lat: parseFloat(e.target.value),
                            },
                          },
                        }))
                      }
                      className="w-full rounded border-[1.5px] px-5 py-3 text-black"
                      required
                    />
                  </div>
                  <div className="w-full xl:w-1/2">
                    <label className="mb-3 block text-sm font-medium text-black">Longitude</label>
                    <input
                      type="text"
                      name="location.coordinates.lng"
                      value={formData.location.coordinates?.lng || ""}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          location: {
                            ...prev.location,
                            coordinates: {
                              ...prev.location.coordinates,
                              lng: parseFloat(e.target.value),
                            },
                          },
                        }))
                      }
                      className="w-full rounded border-[1.5px] px-5 py-3 text-black"
                      required
                    />
                  </div>
                </div>

                <div className="mb-6">
                  <label className="mb-3 block text-sm font-medium text-black">Description</label>
                  <textarea
                    rows={6}
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full rounded border-[1.5px] px-5 py-3 text-black"
                    required
                  />
                </div>

                <div className="mb-6">
                  <label className="mb-3 block text-sm font-medium text-black">Attach file (Image)</label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    onChange={handleInputChange}
                    className="w-full rounded border-[1.5px] px-5 py-3 text-black"
                  />
                </div>

                <div className="mb-6">
                  <button
                    type="submit"
                    className="bg-primary text-white px-6 py-3 rounded"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default EditEventPage;