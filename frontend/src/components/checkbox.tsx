"use client";
import { useState } from "react";

const AssignmentCheckbox = ({
  id,
  title,
  duedate,
  course,
  status,
  toggleStatus,
}) => {
  const [isChecked, setIsChecked] = useState(status === "Completed");

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
    toggleStatus(id);
  };

  return (
    <div className="w-full flex items-center gap-4 p-6">
      <input
        id={id}
        type="checkbox"
        checked={isChecked}
        onChange={handleCheckboxChange}
        className="w-5 h-5 accent-zinc-500"
      />
      <label htmlFor={id} className="w-full cursor-pointer">
        <div className="flex justify-between">
          <div>
            <h2
              className={`text-lg font-semibold ${
                status === "Completed" ? "line-through text-zinc-500" : "none"
              }`}
            >
              {title}
            </h2>
            <p className="text-sm text-gray-600">{course}</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium">{duedate}</p>
            <p
              className={`text-sm font-semibold ${
                status === "Completed" ? "text-green-600" : "text-red-600"
              }`}
            >
              {status}
            </p>
          </div>
        </div>
      </label>
    </div>
  );
};

export default AssignmentCheckbox;
