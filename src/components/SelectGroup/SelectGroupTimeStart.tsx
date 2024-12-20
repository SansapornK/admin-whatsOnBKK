"use client";
import React, { useState } from "react";

interface SelectGroupTimeStartProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const SelectGroupTimeStart: React.FC<SelectGroupTimeStartProps> = ({ value, onChange }) => {
  const [isOptionSelected, setIsOptionSelected] = useState(false);

  const changeTextColor = () => {
    setIsOptionSelected(true);
  };

  return (
    <div className="mb-4.5">
      <label className="mb-2.5 block text-black dark:text-white">Time Start</label>
      <div className="relative z-20 bg-transparent dark:bg-form-input">
      <select
          name="timeStart"
          value={value} // Ensures the current value is shown
          onChange={(e) => {
            onChange(e); // Passes the change event to the parent component
            setIsOptionSelected(true); // Updates internal state for styling
            changeTextColor();
          }}
          className={`relative z-20 w-full appearance-none rounded border border-stroke bg-transparent px-5 py-3 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary ${
            isOptionSelected ? "text-black dark:text-white" : ""
          }`}
        >
          <option value="" disabled>
            Select event times
          </option>
          {[...Array(24)].map((_, index) => {
            const period = index < 12 ? "AM" : "PM";
            const hour = index === 0 || index === 12 ? 12 : index % 12;
            const timeLabel = `${hour.toString().padStart(2, "0")}:00 ${period}`;
            return (
              <option key={timeLabel} value={timeLabel}>
                {timeLabel}
              </option>
            );
          })}
        </select>
        <span className="absolute right-4 top-1/2 z-30 -translate-y-1/2">
          <svg
            className="fill-current"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g opacity="0.8">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M5.29289 8.29289C5.68342 7.90237 6.31658 7.90237 6.70711 8.29289L12 13.5858L17.2929 8.29289C17.6834 7.90237 18.3166 7.90237 18.7071 8.29289C19.0976 8.68342 19.0976 9.31658 18.7071 9.70711L12.7071 15.7071C12.3166 16.0976 11.6834 16.0976 11.2929 15.7071L5.29289 9.70711C4.90237 9.31658 4.90237 8.68342 5.29289 8.29289Z"
                fill=""
              ></path>
            </g>
          </svg>
        </span>
      </div>
    </div>
  );
};


export default SelectGroupTimeStart;
