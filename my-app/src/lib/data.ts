import { Department, Staff } from "./types";

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
  // Emergency - 12 doctors
  { id: "emerdoc001", name: "Dr. AbdulQudus", role: "doctor", department: "Emergency" },
  { id: "emerdoc002", name: "Dr. Adebukola", role: "doctor", department: "Emergency" },
  { id: "emerdoc003", name: "Dr. Akinwumi", role: "doctor", department: "Emergency" },
  { id: "emerdoc004", name: "Dr. Oyewale", role: "doctor", department: "Emergency" },
  { id: "emerdoc005", name: "Dr. Ubaydah", role: "doctor", department: "Emergency" },
  { id: "emerdoc006", name: "Dr. Bukunmi", role: "doctor", department: "Emergency" },
  { id: "emerdoc007", name: "Dr. Emmanuel", role: "doctor", department: "Emergency" },
  { id: "emerdoc008", name: "Dr. Banjo", role: "doctor", department: "Emergency" },
  { id: "emerdoc009", name: "Dr. Kehinde", role: "doctor", department: "Emergency" },
  { id: "emerdoc010", name: "Dr. Zainab", role: "doctor", department: "Emergency" },
  { id: "emerdoc011", name: "Dr. Rasaq", role: "doctor", department: "Emergency" },
  { id: "emerdoc012", name: "Dr. Jimoh", role: "doctor", department: "Emergency" },

  // Emergency - 12 nurses
  { id: "emernur001", name: "Nurse Amao", role: "nurse", department: "Emergency" },
  { id: "emernur002", name: "Nurse Tayo", role: "nurse", department: "Emergency" },
  { id: "emernur003", name: "Nurse Ayomide", role: "nurse", department: "Emergency" },
  { id: "emernur004", name: "Nurse Oyetunji", role: "nurse", department: "Emergency" },
  { id: "emernur005", name: "Nurse Durosinmi", role: "nurse", department: "Emergency" },
  { id: "emernur006", name: "Nurse Raji", role: "nurse", department: "Emergency" },
  { id: "emernur007", name: "Nurse Damilare", role: "nurse", department: "Emergency" },
  { id: "emernur008", name: "Nurse Habibat", role: "nurse", department: "Emergency" },
  { id: "emernur009", name: "Nurse Zulaihat", role: "nurse", department: "Emergency" },
  { id: "emernur010", name: "Nurse Kafayat", role: "nurse", department: "Emergency" },
  { id: "emernur011", name: "Nurse Taofeek", role: "nurse", department: "Emergency" },
  { id: "emernur012", name: "Nurse Sadiq", role: "nurse", department: "Emergency" },

  // Pediatrics - 8 doctors
  { id: "pedidoc001", name: "Dr. Aminat", role: "doctor", department: "Pediatrics" },
  { id: "pedidoc002", name: "Dr. Barakat", role: "doctor", department: "Pediatrics" },
  { id: "pedidoc003", name: "Dr. Hakimat", role: "doctor", department: "Pediatrics" },
  { id: "pedidoc004", name: "Dr. Kamal", role: "doctor", department: "Pediatrics" },
  { id: "pedidoc005", name: "Dr. Abdullateef", role: "doctor", department: "Pediatrics" },
  { id: "pedidoc006", name: "Dr. Adeoye", role: "doctor", department: "Pediatrics" },
  { id: "pedidoc007", name: "Dr. Furher", role: "doctor", department: "Pediatrics" },
  { id: "pedidoc008", name: "Dr. Sarafudeen", role: "doctor", department: "Pediatrics" },

  // Pediatrics - 8 nurses
  { id: "pedinur001", name: "Nurse Rahmat", role: "nurse", department: "Pediatrics" },
  { id: "pedinur002", name: "Nurse Kudirat", role: "nurse", department: "Pediatrics" },
  { id: "pedinur003", name: "Nurse Omar", role: "nurse", department: "Pediatrics" },
  { id: "pedinur004", name: "Nurse Ridwan", role: "nurse", department: "Pediatrics" },
  { id: "pedinur005", name: "Nurse Akinbola", role: "nurse", department: "Pediatrics" },
  { id: "pedinur006", name: "Nurse Sukurat", role: "nurse", department: "Pediatrics" },
  { id: "pedinur007", name: "Nurse Mubarak", role: "nurse", department: "Pediatrics" },
  { id: "pedinur008", name: "Nurse Titi", role: "nurse", department: "Pediatrics" },

  // Surgery - 8 doctors
  { id: "surgdoc001", name: "Dr. Banjo", role: "doctor", department: "Surgery" },
  { id: "surgdoc002", name: "Dr. Temitope", role: "doctor", department: "Surgery" },
  { id: "surgdoc003", name: "Dr. Akande", role: "doctor", department: "Surgery" },
  { id: "surgdoc004", name: "Dr. Aisha", role: "doctor", department: "Surgery" },
  { id: "surgdoc005", name: "Dr. Adunni", role: "doctor", department: "Surgery" },
  { id: "surgdoc006", name: "Dr. Khadijah", role: "doctor", department: "Surgery" },
  { id: "surgdoc007", name: "Dr. Oyewale", role: "doctor", department: "Surgery" },
  { id: "surgdoc008", name: "Dr. Tola", role: "doctor", department: "Surgery" },

  // Surgery - 8 nurses
  { id: "surgnur001", name: "Nurse Funmi", role: "nurse", department: "Surgery" },
  { id: "surgnur002", name: "Nurse Wale", role: "nurse", department: "Surgery" },
  { id: "surgnur003", name: "Nurse Nasirat", role: "nurse", department: "Surgery" },
  { id: "surgnur004", name: "Nurse Grace", role: "nurse", department: "Surgery" },
  { id: "surgnur005", name: "Nurse Olaoye", role: "nurse", department: "Surgery" },
  { id: "surgnur006", name: "Nurse Gretta", role: "nurse", department: "Surgery" },
  { id: "surgnur007", name: "Nurse Tunde", role: "nurse", department: "Surgery" },
  { id: "surgnur008", name: "Nurse Stella", role: "nurse", department: "Surgery" },

  // Maternity - 8 doctors
  { id: "matedoc001", name: "Dr. Hassan", role: "doctor", department: "Maternity" },
  { id: "matedoc002", name: "Dr. Hussein", role: "doctor", department: "Maternity" },
  { id: "matedoc003", name: "Dr. Abdulquadri", role: "doctor", department: "Maternity" },
  { id: "matedoc004", name: "Dr. Abiodun", role: "doctor", department: "Maternity" },
  { id: "matedoc005", name: "Dr. Habeeb", role: "doctor", department: "Maternity" },
  { id: "matedoc006", name: "Dr. Shuhaib", role: "doctor", department: "Maternity" },
  { id: "matedoc007", name: "Dr. Olawale", role: "doctor", department: "Maternity" },
  { id: "matedoc008", name: "Dr. Mark", role: "doctor", department: "Maternity" },

  // Maternity - 8 nurses
  { id: "matenur001", name: "Nurse Yewande", role: "nurse", department: "Maternity" },
  { id: "matenur002", name: "Nurse Diallo", role: "nurse", department: "Maternity" },
  { id: "matenur003", name: "Nurse Blessing", role: "nurse", department: "Maternity" },
  { id: "matenur004", name: "Nurse Seun", role: "nurse", department: "Maternity" },
  { id: "matenur005", name: "Nurse Fawaz", role: "nurse", department: "Maternity" },
  { id: "matenur006", name: "Nurse Dawud", role: "nurse", department: "Maternity" },
  { id: "matenur007", name: "Nurse Bose", role: "nurse", department: "Maternity" },
  { id: "matenur008", name: "Nurse Usman", role: "nurse", department: "Maternity" },

  // Radiology - 8 doctors
  { id: "radidoc001", name: "Dr. Ife", role: "doctor", department: "Radiology" },
  { id: "radidoc002", name: "Nurse Tope", role: "doctor", department: "Radiology" },
  { id: "radidoc003", name: "Dr. Chika", role: "doctor", department: "Radiology" },
  { id: "radidoc004", name: "Dr. Bola", role: "doctor", department: "Radiology" },
  { id: "radidoc005", name: "Dr. Kudus", role: "doctor", department: "Radiology" },
  { id: "radidoc006", name: "Nurse TemiTope", role: "doctor", department: "Radiology" },
  { id: "radidoc007", name: "Dr. Chinedu", role: "doctor", department: "Radiology" },
  { id: "radidoc008", name: "Dr. Wale", role: "doctor", department: "Radiology" },

  // Radiology - 8 nurses
  { id: "radinur001", name: "Nurse Islammiyah", role: "nurse", department: "Radiology" },
  { id: "radinur002", name: "Nurse Anthony", role: "nurse", department: "Radiology" },
  { id: "radinur003", name: "Nurse Umar", role: "nurse", department: "Radiology" },
  { id: "radinur004", name: "Nurse Muiz", role: "nurse", department: "Radiology" },
  { id: "radinur005", name: "Nurse Israel", role: "nurse", department: "Radiology" },
  { id: "radinur006", name: "Nurse Ishaq", role: "nurse", department: "Radiology" },
  { id: "radinur007", name: "Nurse Ibrahim", role: "nurse", department: "Radiology" },
  { id: "radinur008", name: "Nurse Abdullahi", role: "nurse", department: "Radiology" },
];