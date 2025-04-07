"use client";
import { useEffect, useState } from "react";
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
import { fetchAssignmentsByUser } from "../api/assignmentApi";
import { updateAssignmentStatus } from "../api/assignmentApi";

const Assignment = () => {
  const [tab, setTab] = useState("All");
  const [addModal, setAddModal] = useState(false);
  const [assignments, setAssignments] = useState<Array<{
    id: number;
    title: string;
    duedate: string;
    rawDueDate: string;
    course_id: number;
    course: string;
    status: string;
  }>>([]);
  const [loading, setLoading] = useState(true);
  const userId = 55141;

  const getData = async () => {
    try {
      const data = await fetchAssignmentsByUser(userId);

      const formatDate = (iso: string) => {
        if (!iso) return "No due date";
        return new Date(iso).toLocaleString("en-US", {
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
          timeZone: "UTC",
        });
      };

      const formatted = data.map((a) => ({
        id: a.id,
        title: a.title,
        duedate: formatDate(a.due_date),
        rawDueDate: a.due_date,
        course_id: a.courses?.id || 0, // Use optional chaining and provide a fallback
        course: a.courses?.title || "No Course", // Use optional chaining and provide a fallback
        status: a.status ?? "In Progress",
      }));

      formatted.sort((a, b) => {
        if (a.status === "Completed" && b.status !== "Completed") return 1;
        if (b.status === "Completed" && a.status !== "Completed") return -1;

        const dateA = a.rawDueDate ? new Date(a.rawDueDate) : null;
        const dateB = b.rawDueDate ? new Date(b.rawDueDate) : null;

        if (dateA && dateB) return dateA - dateB;
        if (!dateA && dateB) return 1;
        if (dateA && !dateB) return -1;
        return 0;
      });

      setAssignments(formatted);
    } catch (err) {
      console.error("Error fetching assignments", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const toggleStatus = async (id: number) => {
    const updated = assignments.map((assignment) => {
      if (assignment.id === id) {
        const newStatus =
          assignment.status === "Completed" ? "In Progress" : "Completed";
        return { ...assignment, status: newStatus };
      }
      return assignment;
    });

    setAssignments(updated);

    // Find the updated status and add null check
    const changed = updated.find((a) => a.id === id);
    try {
      if (changed) {
        await updateAssignmentStatus(id, changed.status);
      } else {
        console.error("Assignment not found after update");
      }
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  const handleAddModal = () => {
    setAddModal(!addModal);
  };

  const filteredAssignments =
    tab === "All" ? assignments : assignments.filter((a) => a.status === tab);

  return (
    <div className="container mx-10 my-10 ">
      <div className="flex justify-between my-8">
        <h1 className="font-bold text-2xl ">Assignments</h1>
        <button
          onClick={handleAddModal}
          className="bg-zinc-600 rounded-full py-2 px-6  text-white font-semibold text-center cursor-pointer transition hover:bg-zinc-400"
        >
          Add Assignment
        </button>
      </div>
      <AddModal
        open={addModal}
        onClose={handleAddModal}
        refreshAssignments={getData}
      />
      <div className="border rounded-2xl my-4 h-5/6 overflow-scroll">
        <div className="flex space-x-4 px-2 py-4 bg-zinc-50 rounded-t-2xl sticky top-0 z-10">
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
        <div className="">
          {filteredAssignments.length > 0 ? (
            <Table>
              <TableBody>
                {filteredAssignments.map((assignment) => (
                  <TableRow key={assignment.id}>
                    <TableCell>
                      <div
                        className={`${
                          assignment.status === "Completed" ? "bg-zinc-100" : ""
                        }`}
                      >
                        <AssignmentCheckbox
                          id={assignment.id}
                          title={assignment.title}
                          duedate={assignment.duedate}
                          rawdate={assignment.rawDueDate}
                          course={assignment.course}
                          course_id={assignment.course_id}
                          status={assignment.status}
                          toggleStatus={toggleStatus}
                          refreshAssignments={getData}
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
    </div>
  );
};

export default Assignment;
