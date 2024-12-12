'use client';
import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import Link from "next/link";

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
  dateStart: string;
  dateEnd: string;
  timeStart: string;
  timeEnd: string;
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

  const deleteEvent = async (id: string) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this event?");
    if (!confirmDelete) return;

    try {
      const response = await fetch(`/api/deleteEvent?id=${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setEvents((prevEvents) => prevEvents.filter((event) => event._id !== id));
      } else {
        const errorData = await response.json();
        console.error("Failed to delete event:", errorData);
      }
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };


  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="px-4 py-6 md:px-6 xl:px-7.5">
        <h4 className="text-xl font-semibold text-black dark:text-white">
          Events
        </h4>
      </div>

      {/* Table Headers */}
      <div className="grid grid-cols-10 border-t border-stroke px-4 py-4.5 dark:border-strokedark sm:grid-cols-9 md:px-6 2xl:px-7.5">
        <div className="col-span-2 flex items-center">
          <p className="font-medium">Event Name</p>
        </div>
        <div className="col-span-2 hidden items-center sm:flex">
          <p className="font-medium">Date</p>
        </div>
        <div className="col-span-2 hidden items-center sm:flex">
          <p className="font-medium">Time</p>
        </div>
        <div className="col-span-1 flex items-center">
          <p className="font-medium">Area</p>
        </div>
        <div className="col-span-1 flex items-center justify-center">
          <p className="font-medium">Edit</p>
        </div>
        <div className="col-span-1 flex items-center justify-center">
          <p className="font-medium">Delete</p>
        </div>
      </div>

      {/* Table Rows */}
      {events.length > 0 ? (
        events.map((event) => (
          <div
            className="grid grid-cols-10 border-t border-stroke px-4 py-4.5 dark:border-strokedark sm:grid-cols-9 md:px-6 2xl:px-7.5"
            key={event._id}
          >
            {/* Event Name */}
            <div className="col-span-2 flex items-center">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <p className="text-sm text-black dark:text-white">
                  {event.name}
                </p>
              </div>
            </div>

            {/* Date */}
            <div className="col-span-2 hidden items-center sm:flex">
              <p className="text-sm text-black dark:text-white">
                {event.dateStart ? format(new Date(event.dateStart), "MMM dd, yyyy") : "N/A"}{" "}-{" "}
                {event.dateEnd ? format(new Date(event.dateEnd), "MMM dd, yyyy"): "N/A"}
              </p>
            </div>

            {/* Time */}
            <div className="col-span-2 hidden items-center sm:flex">
              <p className="text-sm text-black dark:text-white">
                {event.timeStart} - {event.timeEnd}
              </p>
            </div>

            {/* Area */}
            <div className="col-span-1 flex items-center">
              <p className="text-sm text-black dark:text-white">
                {event.location.area}
              </p>
            </div>

            {/* Edit Button */}
            <div className="col-span-1 flex items-center justify-center">
            <Link
              href={`/edit/${event._id}`} // Redirects to the edit page with the event's ID
              className="inline-flex items-center justify-center rounded bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-opacity-90"
            >
              Edit
            </Link>

            </div>
            {/* Delete Button */}
            <div className="col-span-1 flex items-center justify-center">
            <button
                onClick={() => deleteEvent(event._id)}
                className="inline-flex items-center justify-center rounded bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600"
              >
                Delete
              </button>

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
