"use client";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import EditModal from "@/components/EditModal";

const AssignmentCheckbox = ({
  id,
  title,
  duedate,
  course,
  status,
  toggleStatus,
}) => {
  const [isChecked, setIsChecked] = useState(status === "Completed");
  const [editModal, setEditModal] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState(null);

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
    toggleStatus(id);
  };

  const handleEditModal = () => {
    setEditingAssignment({ id, title, duedate, course });
    setEditModal(true);
  };

  // const handleDelete = async () => {
  //   try {
  //     await deleteDoc(docRef);
  //     onClose();
  //   } catch (error) {
  //     console.error("Error deleting document: ", error);
  //   }
  // };

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
          <div className="text-right flex items-center">
            <div>
              <p className="text-sm font-medium">{duedate}</p>
              <p
                className={`text-sm font-semibold ${
                  status === "Completed" ? "text-green-600" : "text-red-600"
                }`}
              >
                {status}
              </p>
            </div>
            <div className="px-2">
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <img src="/ellipsis.svg" className="cursor-pointer" />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={handleEditModal}>
                    Edit
                  </DropdownMenuItem>

                  {/* <DropdownMenuItem onClick={() => handleDelete}> */}
                  {/* Delete */}
                  {/* </DropdownMenuItem> */}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </label>
      <EditModal
        open={editModal}
        onClose={() => setEditModal(false)}
        assignment={editingAssignment}
      />
    </div>
  );
};

export default AssignmentCheckbox;
