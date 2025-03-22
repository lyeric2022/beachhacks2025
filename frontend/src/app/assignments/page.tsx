"use client";
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import AssignmentCheckbox from "@/components/checkbox";
import AddModal from "@/components/AddModal";

const Assignment = () => {
  const [tab, setTab] = useState("All");
  const [addModal, setAddModal] = useState(false);
  const [assignments, setAssignments] = useState([
    {
      id: 1,
      title: "Math Homework 1",
      duedate: "Nov. 15 at 11:59",
      course: "Calculus II",
      status: "In Progress",
    },
    {
      id: 2,
      title: "History Essay",
      duedate: "2025-03-28",
      course: "World History",
      status: "Completed",
    },
    {
      id: 3,
      title: "Physics Lab Report",
      duedate: "2025-03-27",
      course: "Physics 101",
      status: "In Progress",
    },
    {
      id: 4,
      title: "Computer Science Project",
      duedate: "2025-04-02",
      course: "Intro to Programming",
      status: "In Progress",
    },
  ]);

  const toggleStatus = (id) => {
    setAssignments((prevAssignments) =>
      prevAssignments.map((assignment) =>
        assignment.id === id
          ? {
              ...assignment,
              status:
                assignment.status === "Completed" ? "In Progress" : "Completed",
            }
          : assignment
      )
    );
  };

  const handleAddModal = () => {
    setAddModal(!addModal);
  };

  const filteredAssignments =
    tab === "All" ? assignments : assignments.filter((a) => a.status === tab);

  return (
    <div className="container mx-auto my-20">
      <div className="flex justify-between my-8">
        <h1 className="font-bold text-2xl ">Assignments</h1>
        <button
          onClick={handleAddModal}
          className="bg-zinc-600 rounded-full py-2 px-6  text-white font-semibold text-center cursor-pointer transition hover:bg-zinc-400"
        >
          Add Assignment
        </button>
      </div>
      <AddModal open={addModal} onClose={handleAddModal} />
      <div className="border rounded-2xl my-4 ">
        <div className="flex space-x-4 px-2 py-4 bg-zinc-50 rounded-t-2xl">
          {["All", "In Progress", "Completed"].map((status) => (
            <button
              key={status}
              onClick={() => setTab(status)}
              className={`cursor-pointer py-2 px-4 mx-2 rounded-xl transition hover:bg-zinc-200 ${
                tab === status
                  ? "bg-zinc-600 font-semibold text-white"
                  : "bg-transparent"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
        <hr />
        {filteredAssignments.length > 0 ? (
          <Table>
            <TableBody>
              {filteredAssignments.map((assignment) => (
                <TableRow key={assignment.id}>
                  <TableCell>
                    <div
                      className={`${
                        assignment.status === "Completed"
                          ? "bg-zinc-100"
                          : "none"
                      }`}
                    >
                      <AssignmentCheckbox
                        id={assignment.id}
                        title={assignment.title}
                        duedate={assignment.duedate}
                        course={assignment.course}
                        status={assignment.status}
                        toggleStatus={toggleStatus}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <h2 className="text-center text-gray-500">No assignments found</h2>
        )}
      </div>
    </div>
  );
};

export default Assignment;
