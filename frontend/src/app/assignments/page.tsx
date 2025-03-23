"use client";
import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import AssignmentCheckbox from "@/components/checkbox";
import AddModal from "@/components/AddModal";
import { fetchAssignmentsByUser } from "../api/assignmentApi";
import { updateAssignmentStatus } from "../api/assignmentApi";
import { PlusCircle, Book, CheckCircle, ClipboardList } from "lucide-react";
import styles from "./assignments.module.css";

const Assignment = () => {
  const [tab, setTab] = useState("All");
  const [addModal, setAddModal] = useState(false);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = 55141;

  const getData = async () => {
    try {
      const data = await fetchAssignmentsByUser(userId);

      const formatDate = (iso) => {
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
        course_id: a.courses.id,
        course: a.courses.title,
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

  const toggleStatus = async (id) => {
    const updated = assignments.map((assignment) => {
      if (assignment.id === id) {
        const newStatus =
          assignment.status === "Completed" ? "In Progress" : "Completed";
        return { ...assignment, status: newStatus };
      }
      return assignment;
    });

    setAssignments(updated);

    // Find the updated status
    const changed = updated.find((a) => a.id === id);
    try {
      await updateAssignmentStatus(id, changed.status);
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
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.headerTitle}>
          Assignments
          <span className={styles.headerAccent}></span>
        </h1>
        <p className={styles.subheader}>Track and manage your academic tasks</p>
      </div>

      <div className={styles.actionBar}>
        <div className={styles.statsCards}>
          <div className={styles.statCard}>
            <ClipboardList size={20} className={styles.statIcon} />
            <div>
              <h3 className={styles.statTitle}>Total</h3>
              <p className={styles.statValue}>{assignments.length}</p>
            </div>
          </div>
          <div className={styles.statCard}>
            <Book size={20} className={styles.statIcon} />
            <div>
              <h3 className={styles.statTitle}>In Progress</h3>
              <p className={styles.statValue}>
                {assignments.filter((a) => a.status === "In Progress").length}
              </p>
            </div>
          </div>
          <div className={styles.statCard}>
            <CheckCircle size={20} className={styles.statIcon} />
            <div>
              <h3 className={styles.statTitle}>Completed</h3>
              <p className={styles.statValue}>
                {assignments.filter((a) => a.status === "Completed").length}
              </p>
            </div>
          </div>
        </div>

        <button onClick={handleAddModal} className={styles.addButton}>
          <PlusCircle size={18} className="mr-2" />
          Add Assignment
        </button>
      </div>

      <AddModal
        open={addModal}
        onClose={handleAddModal}
        refreshAssignments={getData}
      />

      <div className={styles.tableContainer}>
        <div className={styles.tabContainer}>
          {["All", "In Progress", "Completed"].map((status) => (
            <button
              key={status}
              onClick={() => setTab(status)}
              className={`${styles.tabButton} ${
                tab === status ? styles.activeTab : ""
              }`}
            >
              {status === "All" && <ClipboardList size={16} className="mr-2" />}
              {status === "In Progress" && <Book size={16} className="mr-2" />}
              {status === "Completed" && (
                <CheckCircle size={16} className="mr-2" />
              )}
              {status}
            </button>
          ))}
        </div>

        {loading ? (
          <div className={styles.loadingState}>
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="animate-pulse flex items-center p-4 border-b"
              >
                <div className="h-4 w-4 bg-gray-200 rounded-full mr-4"></div>
                <div className="flex-1">
                  <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredAssignments.length > 0 ? (
          <Table>
            <TableBody>
              {filteredAssignments.map((assignment) => (
                <TableRow key={assignment.id} className={styles.tableRow}>
                  <TableCell className={styles.tableCell}>
                    <div
                      className={`${
                        assignment.status === "Completed"
                          ? styles.completedRow
                          : ""
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
          <div className={styles.emptyState}>
            <ClipboardList size={40} className={styles.emptyIcon} />
            <h2 className={styles.emptyTitle}>No assignments found</h2>
            <p className={styles.emptyText}>
              {tab === "All"
                ? "Add your first assignment to get started"
                : tab === "In Progress"
                ? "No assignments in progress"
                : "No completed assignments yet"}
            </p>
            <button onClick={handleAddModal} className={styles.emptyButton}>
              <PlusCircle size={16} className="mr-2" />
              Add Assignment
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Assignment;
