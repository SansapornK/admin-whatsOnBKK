'use client';
import React, { useState, useEffect } from "react";
import { format } from "date-fns";

interface Coordinates {
  lat: number;
  lng: number;
}

interface Location {
  area: string;
  address: string;
  coordinates: Coordinates;
}

interface Event {
  _id: string;
  name: string;
  description: string;
  type: string;
  location: Location;
  date: string; // MongoDB stores date as a string in ISO format
  time: string;
  images: string[]; // Array of image URLs
}

const TableTwo = () => {
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("/api/showEvent"); // Adjust the endpoint as needed
        const data: Event[] = await response.json();

        if (Array.isArray(data)) {
          setEvents(data);
        } else {
          console.error("Fetched data is not an array:", data);
        }
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="px-4 py-6 md:px-6 xl:px-7.5">
        <h4 className="text-xl font-semibold text-black dark:text-white">
          Events
        </h4>
      </div>

      {/* Table Headers */}
      <div className="grid grid-cols-6 border-t border-stroke px-4 py-4.5 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5">
        <div className="col-span-3 flex items-center">
          <p className="font-medium">Event Name</p>
        </div>
        <div className="col-span-2 hidden items-center sm:flex">
          <p className="font-medium">Date & Time</p>
        </div>
        <div className="col-span-1 flex items-center">
          <p className="font-medium">Area</p>
        </div>
      </div>

      {/* Table Rows */}
      {events.length > 0 ? (
        events.map((event) => (
          <div
            className="grid grid-cols-6 border-t border-stroke px-4 py-4.5 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5"
            key={event._id}
          >
            {/* Event Name */}
            <div className="col-span-3 flex items-center">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <p className="text-sm text-black dark:text-white">
                  {event.name}
                </p>
              </div>
            </div>

            {/* Date & Time */}
            <div className="col-span-2 hidden items-center sm:flex">
              <p className="text-sm text-black dark:text-white">
                {format(new Date(event.date), "MMM dd, yyyy")} {event.time}
              </p>
            </div>

            {/* Area */}
            <div className="col-span-1 flex items-center">
              <p className="text-sm text-black dark:text-white">
                {event.location.area}
              </p>
            </div>
          </div>
        ))
      ) : (
        <div className="px-4 py-4.5">
          <p className="text-sm text-gray-500">No events found.</p>
        </div>
      )}
    </div>
  );
};

export default TableTwo;
