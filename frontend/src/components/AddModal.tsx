"use client";
import { useState } from "react";
import { Modal, TextField, FormControlLabel, Switch } from "@mui/material";
// import { alpha, styled } from "@mui/material/styles";

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
          <h4 className="font-medium  py-2 text-zinc-600">Task:</h4>
          <input
            value={title}
            onChange={handleTitleChange}
            placeholder="Task"
            className="rounded-full my-2 px-5 py-2 bg-transparent border-2 w-full border-zinc-300"
          />
        </div>

        <div>
          <h4 className="font-medium py-2 text-zinc-600">Course:</h4>
          <input
            value={course}
            onChange={handleCourseChange}
            placeholder="Course"
            className="rounded-full my-2 px-5 py-2 bg-transparent border-2 w-full border-zinc-300"
          />
        </div>

        <div>
          <h4 className="font-medium py-2 text-zinc-600">Due Date:</h4>
          <input
            value={duedate}
            onChange={handleDueChange}
            placeholder="Due Date"
            className="rounded-full my-2 px-5 py-2 bg-transparent border-2 w-full border-zinc-300"
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
