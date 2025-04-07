"use client";
import { useState, useEffect, ChangeEvent } from "react";
import { Modal } from "@mui/material";
import { addAssignment } from "@/app/api/assignmentApi";
import { fetchCourses } from "@/app/api/coursesApi";

// Update the props definition
interface AddModalProps {
  open: boolean;
  onClose: () => void;
  refreshAssignments: () => Promise<void>;
}

// Define Course interface
interface Course {
  id: number;
  title: string;
}

const AddModal = ({ open, onClose, refreshAssignments }: AddModalProps) => {
  const [title, setTitle] = useState("");
  const [course, setCourse] = useState("");
  const [duedate, setDuedate] = useState("");
  const [courses, setCourses] = useState<Course[]>([]);

  const handleTitleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setTitle(e.target.value);
  };

  const handleCourseChange = (e: ChangeEvent<HTMLSelectElement>): void => {
    setCourse(e.target.value);
  };

  const handleDueChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setDuedate(e.target.value);
  };

  useEffect(() => {
    const loadCourses = async () => {
      try {
        const data = await fetchCourses();
        setCourses(data);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    loadCourses();
  }, []);

  const handleSubmit = async (): Promise<void> => {
    if (!title || !course || !duedate) {
      alert("Please fill out all fields.");
      return;
    }
    try {
      await addAssignment({
        title,
        course_id: parseInt(course),
        due_date: duedate,
        user_id: 55141, // or get from auth context
        status: "In Progress", // optional default
      });

      if (refreshAssignments) {
        await refreshAssignments(); // 🔄 re-fetch assignments
      }

      onClose();
      setTitle("");
      setCourse("");
      setDuedate("");
    } catch (error) {
      console.error("Error adding assignment: ", error);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <div className="absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] bg-slate-50 mx-10 w-2/5 px-12 py-10 rounded-2xl border-zinc-500 border-8">
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
          <select
            value={course}
            onChange={handleCourseChange}
            className="rounded-full my-2 px-5 py-2 bg-transparent border-2 w-full border-zinc-300"
            required
          >
            <option value="">Select a course</option>
            {courses.map((c: Course) => (
              <option key={c.id} value={c.id}>
                {c.title}
              </option>
            ))}
          </select>
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
            onClick={handleSubmit}
            className="bg-zinc-500 rounded-full py-2 px-6 m-2 text-white text-center mt-4 cursor-pointer"
          >
            Add Assignment
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default AddModal;
