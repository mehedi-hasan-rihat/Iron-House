import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { generateMemberId } from "@/lib/id-generator";
import bcrypt from "bcryptjs";

// GET /api/members?search=&status=&page=1&limit=20
export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = req.nextUrl;
  const search = searchParams.get("search") ?? "";
  const status = searchParams.get("status") ?? "";
  const page   = Math.max(1, Number(searchParams.get("page")  ?? 1));
  const limit  = Math.min(100, Number(searchParams.get("limit") ?? 20));
  const skip   = (page - 1) * limit;

  const where = {
    ...(status ? { status: status as "ACTIVE" | "SUSPENDED" | "FROZEN" } : {}),
    ...(search ? {
      OR: [
        { fullName: { contains: search, mode: "insensitive" as const } },
        { phone:    { contains: search                                  } },
        { email:    { contains: search, mode: "insensitive" as const } },
        { memberId: { contains: search, mode: "insensitive" as const } },
      ],
    } : {}),
  };

  const [members, total] = await Promise.all([
    prisma.member.findMany({
      where,
      skip,
      take:    limit,
      orderBy: { createdAt: "desc" },
      include: {
        memberships: {
          where:   { status: "ACTIVE" },
          include: { plan: true },
          take:    1,
          orderBy: { createdAt: "desc" },
        },
      },
    }),
    prisma.member.count({ where }),
  ]);

  return NextResponse.json({ members, total, page, limit });
}

// POST /api/members
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { fullName, phone, email, gender, dob, address, bloodGroup,
          medicalInfo, emergencyContact, password = "member123" } = body;

  if (!fullName || !phone) {
    return NextResponse.json({ error: "fullName and phone are required" }, { status: 400 });
  }

  // get member role
  const memberRole = await prisma.role.findUnique({ where: { name: "member" } });
  if (!memberRole) return NextResponse.json({ error: "Member role not found" }, { status: 500 });

  const memberId     = await generateMemberId();
  const hashedPass   = await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
    data: {
      email:    email ?? `${memberId.toLowerCase()}@fitgymcenter.local`,
      password: hashedPass,
      roleId:   memberRole.id,
      member: {
        create: {
          memberId,
          fullName,
          phone,
          email:           email     ?? null,
          gender:          gender    ?? null,
          dob:             dob       ? new Date(dob) : null,
          address:         address   ?? null,
          bloodGroup:      bloodGroup ?? null,
          medicalInfo:     medicalInfo ?? null,
          emergencyContact: emergencyContact ?? null,
          status:          "ACTIVE",
        },
      },
    },
    include: { member: true },
  });

  return NextResponse.json(user.member, { status: 201 });
}
