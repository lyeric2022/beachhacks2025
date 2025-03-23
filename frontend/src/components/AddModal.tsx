"use client";
import { useState } from "react";
import { Modal } from "@mui/material";
// import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
// import { DateTimePicker } from '@mui/x-date-pickers';
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import DateTimePicker from "react-datetime-picker";

const AddModal = ({ open, onClose }) => {
  const [title, setTitle] = useState("");
  const [course, setCourse] = useState("");
  const [duedate, setDuedate] = useState("");

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleCourseChange = (e) => {
    setCourse(e.target.value);
  };

  const handleDueChange = (e) => {
    setDuedate(e.target.value);
  };

  //   const handleSubmit = async () => {
  //     if (!itemName || !category || !quantity) {
  //       alert("Please fill out all fields.");
  //       return;
  //     }
  //     try {
  //       await addDoc(collection(db, "items"), {
  //         item: itemName,
  //         category,
  //         quantity: isSwitchOn ? parseFloat(quantity) : quantity,
  //       });
  //       onClose();
  //       setItemName("");
  //       setCategory("");
  //       setQuantity("low");
  //     } catch (error) {
  //       console.error("Error adding document: ", error);
  //     }
  //   };

  return (
    <Modal open={open} onClose={onClose}>
      <div className="absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] bg-slate-50 mx-10 w-2/5 px-12 py-10 rounded-2xl border-zinc-500 border-8">
        {/* <div> */}
        <div>
          <h4 className="font-medium  py-2 text-zinc-600">Assignment:</h4>
          <input
            value={title}
            onChange={handleTitleChange}
            placeholder="Assignment"
            className="rounded-full my-2 px-5 py-2 bg-transparent border-2 w-full border-zinc-300"
            required
          />
        </div>

        <div>
          <h4 className="font-medium py-2 text-zinc-600">Course:</h4>
          <input
            value={course}
            onChange={handleCourseChange}
            placeholder="Course"
            className="rounded-full my-2 px-5 py-2 bg-transparent border-2 w-full border-zinc-300"
            required
          />
        </div>

        <div className="w-full">
          <h4 className="font-medium py-2 text-zinc-600">Due Date:</h4>
          <input
            value={duedate}
            onChange={handleDueChange}
            aria-label="Date and time"
            type="datetime-local"
            placeholder="Due Date"
            className="rounded-full my-2 px-5 py-2 bg-transparent border-2 w-full border-zinc-300"
            required
          />
        </div>

        <div className="flex justify-center items-center pt-5 pb-[-1.5rem]">
          <button
            // onClick={handleSubmit}
            className="bg-zinc-500 rounded-full py-2 px-6 m-2 text-white text-center mt-4"
          >
            Add Assignment
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default AddModal;
