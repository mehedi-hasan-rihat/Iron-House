import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { generateMemberId } from "@/lib/id-generator";
import { apiHandler, checkPermission } from "@/lib/api";
import bcrypt from "bcryptjs";

export const GET = apiHandler(async (req: NextRequest) => {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const denied = await checkPermission(session, "members", "view");
  if (denied) return denied;

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
        { phone:    { contains: search } },
        { memberId: { contains: search, mode: "insensitive" as const } },
        { user: { email: { contains: search, mode: "insensitive" as const } } },
      ],
    } : {}),
  };

  const [members, total] = await Promise.all([
    prisma.member.findMany({
      where, skip, take: limit, orderBy: { createdAt: "desc" },
      include: {
        memberships: {
          where: { status: "ACTIVE" }, include: { plan: true },
          take: 1, orderBy: { createdAt: "desc" },
        },
      },
    }),
    prisma.member.count({ where }),
  ]);

  return NextResponse.json({ members, total, page, limit });
});

export const POST = apiHandler(async (req: NextRequest) => {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const denied = await checkPermission(session, "members", "create");
  if (denied) return denied;

  const body = await req.json();
  const { fullName, phone, email, gender, dob, address, bloodGroup,
          medicalInfo, emergencyContact, password = "member123" } = body;

  if (!fullName || !phone || !email) {
    return NextResponse.json({ error: "fullName, phone and email are required" }, { status: 400 });
  }

  if (dob) {
    const parsed = new Date(dob);
    if (isNaN(parsed.getTime())) {
      return NextResponse.json({ error: "Invalid date of birth." }, { status: 400 });
    }
  }

  const memberRole = await prisma.role.findUnique({ where: { name: "member" } });
  if (!memberRole) return NextResponse.json({ error: "Member role not found" }, { status: 500 });

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return NextResponse.json({ error: "A user with this email already exists." }, { status: 409 });

  const memberId   = await generateMemberId();
  const hashedPass = await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPass,
      roleId:   memberRole.id,
      member: {
        create: {
          memberId, fullName, phone,
          gender:          gender           ?? null,
          dob:             dob ? new Date(dob) : null,
          address:         address          ?? null,
          bloodGroup:      bloodGroup       ?? null,
          medicalInfo:     medicalInfo      ?? null,
          emergencyContact: emergencyContact ?? null,
          status:          "ACTIVE",
        },
      },
    },
    include: { member: true },
  });

  return NextResponse.json(user.member, { status: 201 });
});
