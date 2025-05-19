import { PrismaClient, Role } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const departments = await prisma.department.createMany({
    data: [
      { name: "Emergency" },
      { name: "Surgery" },
      { name: "Maternity" },
      { name: "Pediatrics" },
      { name: "Internal Medicine" },
    ],
  });

  const allDepartments = await prisma.department.findMany();
  const getDeptId = (name: string) =>
    allDepartments.find((d) => d.name === name)?.id ?? undefined;

  const staffData = [
    // --- Doctors ---
    { name: "Dr. Amina Yusuf", role: Role.doctor, department: "Emergency" },
    { name: "Dr. Musa Abdullahi", role: Role.doctor, department: "Emergency" },
    { name: "Dr. Amao Tayo", role: Role.doctor, department: "Surgery" },
    { name: "Dr. Oyetunji Lateefah", role: Role.doctor, department: "Surgery" },
    {
      name: "Dr. Abdulazeez Zainab",
      role: Role.doctor,
      department: "Maternity",
    },
    { name: "Dr. Ismael Aisha", role: Role.doctor, department: "Maternity" },
    { name: "Dr. Raji Kudirat", role: Role.doctor, department: "Pediatrics" },
    { name: "Ayinla Bayo", role: Role.doctor, department: "Pediatrics" },
    {
      name: "Dr. Haruna Aisha",
      role: Role.doctor,
      department: "Internal Medicine",
    },
    {
      name: "Dr. Akin Wale",
      role: Role.doctor,
      department: "Internal Medicine",
    },

    // --- Nurses ---
    { name: "Nurse Bello Fatima", role: Role.nurse, department: "Emergency" },
    { name: "Nurse Ahmed Musa", role: Role.nurse, department: "Emergency" },
    {
      name: "Nurse Olawale Ibrahim",
      role: Role.nurse,
      department: "Emergency",
    },
    { name: "Nurse Hassan Maryam", role: Role.nurse, department: "Emergency" },

    { name: "Nurse Chinedu Okoro", role: Role.nurse, department: "Surgery" },
    { name: "Nurse Rashid Taiwo", role: Role.nurse, department: "Surgery" },
    { name: "Nurse Omarr Blessing", role: Role.nurse, department: "Surgery" },
    { name: "Nurse Ayo Balogun", role: Role.nurse, department: "Surgery" },

    { name: "Nurse Ojo Seun", role: Role.nurse, department: "Maternity" },
    { name: "Nurse Akande Wumi", role: Role.nurse, department: "Maternity" },
    { name: "Nurse Aina Sade", role: Role.nurse, department: "Maternity" },
    { name: "Nurse Amad Diallo", role: Role.nurse, department: "Maternity" },

    { name: "Nurse Lateef Satar", role: Role.nurse, department: "Pediatrics" },
    {
      name: "Nurse Temitope Bukola",
      role: Role.nurse,
      department: "Pediatrics",
    },
    { name: "Nurse Abdullahi Isa", role: Role.nurse, department: "Pediatrics" },
    { name: "Nurse Rashid Kamal", role: Role.nurse, department: "Pediatrics" },

    {
      name: "Nurse Leyla Nnaji",
      role: Role.nurse,
      department: "Internal Medicine",
    },
    {
      name: "Nurse Al-hassan Farid",
      role: Role.nurse,
      department: "Internal Medicine",
    },
    {
      name: "Nurse Akinwumi Olabanjo",
      role: Role.nurse,
      department: "Internal Medicine",
    },
    {
      name: "Nurse Victor Boniface",
      role: Role.nurse,
      department: "Internal Medicine",
    },
  ];

  for (const staff of staffData) {
    await prisma.user.create({
      data: {
        name: staff.name,
        role: staff.role,
        departmentId: getDeptId(staff.department),
      },
    });
  }

  console.log("✅ Seeding complete.");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
