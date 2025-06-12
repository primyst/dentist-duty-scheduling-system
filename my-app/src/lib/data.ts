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
    id: "emerdoc001",
    name: "Dr. AbdulQudus",
    role: "doctor",
    department: department[0],
  },
  {
    id: "emerdoc002",
    name: "Dr. Adebukola",
    role: "doctor",
    department: department[0],
  },
  {
    id: "emerdoc003",
    name: "Dr. Akinwumi",
    role: "doctor",
    department: department[0],
  },
  {
    id: "emerdoc004",
    name: "Dr. Oyewale",
    role: "doctor",
    department: department[0],
  },
  {
    id: "emernur001",
    name: "Nurse Amao",
    role: "nurse",
    department: department[0],
  },
  {
    id: "emernur002",
    name: "Nurse Tayo",
    role: "nurse",
    department: department[0],
  },
  {
    id: "emernur003",
    name: "Nurse Ayomide",
    role: "nurse",
    department: department[0],
  },
  {
    id: "emernur004",
    name: "Nurse Oyetunji",
    role: "nurse",
    department: department[0],
  },

  {
    id: "pedidoc001",
    name: "Dr. Aminat",
    role: "doctor",
    department: department[1],
  },
  {
    id: "pedidoc002",
    name: "Dr. Barakat",
    role: "doctor",
    department: department[1],
  },
  {
    id: "pedidoc003",
    name: "Dr. Hakimat",
    role: "doctor",
    department: department[1],
  },
  {
    id: "pedidoc004",
    name: "Dr. Kamal",
    role: "doctor",
    department: department[1],
  },
  {
    id: "pedinur001",
    name: "Nurse Rahmat",
    role: "nurse",
    department: department[1],
  },
  {
    id: "pedinur002",
    name: "Nurse Kudirat",
    role: "nurse",
    department: department[1],
  },
  {
    id: "pedinur003",
    name: "Nurse Omar",
    role: "nurse",
    department: department[1],
  },
  {
    id: "pedinur004",
    name: "Nurse Ridwan",
    role: "nurse",
    department: department[1],
  },

  {
    id: "surgdoc001",
    name: "Dr. Banjo",
    role: "doctor",
    department: department[2],
  },
  {
    id: "surgdoc002",
    name: "Dr. Temitope",
    role: "doctor",
    department: department[2],
  },
  {
    id: "surgdoc003",
    name: "Dr. Akande",
    role: "doctor",
    department: department[2],
  },
  {
    id: "surgdoc004",
    name: "Dr. Aisha",
    role: "doctor",
    department: department[2],
  },
  {
    id: "surgnur001",
    name: "Nurse Funmi",
    role: "nurse",
    department: department[2],
  },
  {
    id: "surgnur002",
    name: "Nurse Wale",
    role: "nurse",
    department: department[2],
  },
  {
    id: "surgnur003",
    name: "Nurse Nasirat",
    role: "nurse",
    department: department[2],
  },
  {
    id: "surgnur004",
    name: "Nurse Grace",
    role: "nurse",
    department: department[2],
  },

  {
    id: "matedoc001",
    name: "Dr. Hassan",
    role: "doctor",
    department: department[3],
  },
  {
    id: "matedoc002",
    name: "Dr. Hussein",
    role: "doctor",
    department: department[3],
  },
  {
    id: "matedoc003",
    name: "Dr. Abdulquadri",
    role: "doctor",
    department: department[3],
  },
  {
    id: "matedoc004",
    name: "Dr. Abiodun",
    role: "doctor",
    department: department[3],
  },
  {
    id: "matenur001",
    name: "Nurse Yewande",
    role: "nurse",
    department: department[3],
  },
  {
    id: "matenur002",
    name: "Nurse Diallo",
    role: "nurse",
    department: department[3],
  },
  {
    id: "matenur003",
    name: "Nurse Blessing",
    role: "nurse",
    department: department[3],
  },
  {
    id: "matenur004",
    name: "Nurse Seun",
    role: "nurse",
    department: department[3],
  },

  {
    id: "radidoc001",
    name: "Dr. Ife",
    role: "doctor",
    department: department[4],
  },
  {
    id: "radidoc002",
    name: "Nurse Tope",
    role: "doctor",
    department: department[4],
  },
  {
    id: "radidoc003",
    name: "Dr. Chika",
    role: "doctor",
    department: department[4],
  },
  {
    id: "radidoc004",
    name: "Dr. Bola",
    role: "doctor",
    department: department[4],
  },
  {
    id: "radinur001",
    name: "Nurse Islammiyah",
    role: "nurse",
    department: department[4],
  },
  {
    id: "radinur002",
    name: "Nurse Anthony",
    role: "nurse",
    department: department[4],
  },
  {
    id: "radinur001",
    name: "Nurse Umar",
    role: "nurse",
    department: department[4],
  },
  {
    id: "radinur001",
    name: "Nurse Muiz",
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

