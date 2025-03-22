import React from "react";
import AssignmentCheckbox from "@/components/checkbox";

const page = () => {
  return (
    <div>
      <AssignmentCheckbox
        title="title"
        duedate="duedate"
        course="course"
        status="status"
      />
    </div>
  );
};

export default page;
