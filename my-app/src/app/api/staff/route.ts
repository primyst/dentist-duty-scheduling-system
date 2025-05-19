import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // Adjust if your prisma client path is different

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      include: { department: true },
    });
    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}
