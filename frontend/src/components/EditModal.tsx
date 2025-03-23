"use client";
import { useState, useEffect } from "react";
import { Modal, TextField, FormControlLabel, Switch } from "@mui/material";
import { updateAssignment } from "@/app/api/assignmentApi";
import { fetchCourses } from "@/app/api/coursesApi";

const EditModal = ({ open, onClose, assignment, refreshAssignments }) => {
  const [title, setTitle] = useState("");
  const [courseId, setCourseId] = useState("");
  const [courses, setCourses] = useState([]);
  const [duedate, setDuedate] = useState("");

  useEffect(() => {
    if (assignment && open) {
      setTitle(assignment.title || "");
      setCourseId(assignment.course_id?.toString() || "");
      setDuedate(
        assignment.rawDueDate ? assignment.rawDueDate.slice(0, 16) : ""
      );
    }
  }, [assignment, open]);

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

  const handleSubmit = async () => {
    if (!title || !courseId || !duedate) {
      alert("Please fill out all fields.");
      return;
    }

    try {
      await updateAssignment(assignment.id, {
        title,
        course_id: courseId,
        due_date: duedate,
      });

      if (refreshAssignments) {
        await refreshAssignments();
      }

      onClose();
    } catch (error) {
      console.error("Error updating assignment:", error);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <div className="absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] bg-slate-50 mx-10 w-2/5 px-12 py-10 rounded-2xl border-zinc-500 border-8">
        <div>
          <h4 className="font-medium  py-2 text-zinc-600">Assignment:</h4>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Assignment"
            className="rounded-full my-2 px-5 py-2 bg-transparent border-2 w-full border-zinc-300"
            required
          />
        </div>

        <div>
          <h4 className="font-medium py-2 text-zinc-600">Course:</h4>
          <select
            value={courseId}
            onChange={(e) => setCourseId(e.target.value)}
            className="rounded-full my-2 px-5 py-2 bg-transparent border-2 w-full border-zinc-300"
            required
          >
            <option value="">Select a course</option>
            {courses.map((c) => (
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
            onChange={(e) => setDuedate(e.target.value)}
            aria-label="Date and time"
            type="datetime-local"
            className="rounded-full my-2 px-5 py-2 bg-transparent border-2 w-full border-zinc-300"
            required
          />
        </div>

        <div className="flex justify-center items-center pt-5 pb-[-1.5rem]">
          <button
            onClick={handleSubmit}
            className="bg-zinc-500 rounded-full py-2 px-6 m-2 text-white text-center mt-4"
          >
            Edit Assignment
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default EditModal;
