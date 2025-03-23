"use client";
import React from "react";
import { useState } from "react";
import AssignmentCheckbox from "@/components/checkbox";

const page = () => {
  const [duedate, setDuedate] = useState();

  return (
    <>
      <input aria-label="Date and time" type="datetime-local" />
    </>
  );
};

export default page;
