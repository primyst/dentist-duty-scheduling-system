import { Department, Staff } from "./types";
import { Swap } from "./types";

export const department: Department[] = [
  {
    name: "Emergency",
    workdays: [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ],
    time: ["6:00am - 4:00pm", "4:00pm - 10:00pm", "10:00pm - 6:00am"],
  },
  {
    name: "Pediatrics",
    workdays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    time: ["6:00am - 4:00pm"],
  },
  {
    name: "Surgery",
    workdays: ["Monday", "Thursday"],
    time: ["6:00am - 4:00pm", "10:00pm - 6:00am"],
  },
  {
    name: "Maternity",
    workdays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    time: ["6:00am - 4:00pm", "4:00pm - 10:00pm", "10:00pm - 6:00am"],
  },
  {
    name: "Radiology",
    workdays: ["Monday", "Wednesday", "Friday"],
    time: ["6:00am - 4:00pm"],
  },
];

export const validAdminIds = ["admin007", "admin026"];
export const validStaffIds = [
  "staff11",
  "staff4",
  "doc001",
  "nur002",
  "doc002",
  "nur003",
];

export const staff: Staff[] = [
  {
    id: "doc001",
    name: "Dr. Aminat",
    role: "doctor",
    department: department[0],
  },
  {
    id: "nur002",
    name: "Nurse Tolu",
    role: "nurse",
    department: department[0],
  },
  {
    id: "doc002",
    name: "Dr. Bayo",
    role: "doctor",
    department: department[1],
  },
  {
    id: "nur003",
    name: "Nurse Funmi",
    role: "nurse",
    department: department[1],
  },
  {
    id: "doc003",
    name: "Dr. Hassan",
    role: "doctor",
    department: department[2],
  },
  {
    id: "nur004",
    name: "Nurse Yewande",
    role: "nurse",
    department: department[2],
  },
  {
    id: "doc004",
    name: "Dr. Ife",
    role: "doctor",
    department: department[3],
  },
  {
    id: "nur005",
    name: "Nurse Tope",
    role: "nurse",
    department: department[3],
  },
  {
    id: "doc005",
    name: "Dr. Chika",
    role: "doctor",
    department: department[4],
  },
  {
    id: "nur006",
    name: "Nurse Bola",
    role: "nurse",
    department: department[4],
  },
];

export const swapRequests: Swap[] = [
  {
    id: "swap001",
    requesterId: "staff11",
    requesterName: "Dr. Ayo",
    to: "Dr. Abdulqudus",
    department: "Emergency",
    day: "Monday",
    shift: "6:00am - 4:00pm",
    status: "Pending",
  },
  {
    id: "swap002",
    requesterId: "staff4",
    requesterName: "Nurse Fatima",
    to: "Dr. Abdulqudus",
    department: "Pediatrics",
    day: "Tuesday",
    shift: "6:00am - 4:00pm",
    status: "Approved",
  },
];

