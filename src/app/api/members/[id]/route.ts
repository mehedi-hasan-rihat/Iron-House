import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { apiHandler } from "@/lib/api";

export const GET = apiHandler(async (_req, { params }) => {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params!;
  const member = await prisma.member.findUnique({
    where: { id },
    include: {
      memberships: { include: { plan: true, trainer: true }, orderBy: { createdAt: "desc" } },
      payments:    { orderBy: { createdAt: "desc" }, take: 10 },
      documents:   true,
      notes:       { orderBy: { createdAt: "desc" } },
    },
  });
  if (!member) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(member);
});

export const PATCH = apiHandler(async (req, { params }) => {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params!;
  const body   = await req.json();
  const actor  = session.user.email ?? "system";

  // ── Status transitions — each has side-effects ──────────────────────────
  if (body.status) {
    const newStatus = body.status as "ACTIVE" | "SUSPENDED" | "FROZEN";

    // Fetch current member + active membership in one shot
    const member = await prisma.member.findUnique({
      where:   { id },
      include: {
        memberships: {
          where:   { status: { in: ["ACTIVE", "FROZEN"] } },
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
    });
    if (!member) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const activeMembership = member.memberships[0] ?? null;

    if (newStatus === "SUSPENDED") {
      // ── Suspend ──────────────────────────────────────────────────────────
      // Member cannot enter. Membership clock keeps running (they still owe time).
      await prisma.$transaction(async (tx) => {
        await tx.member.update({ where: { id }, data: { status: "SUSPENDED" } });

        if (activeMembership) {
          await tx.membershipTimeline.create({
            data: {
              membershipId: activeMembership.id,
              event:        "SUSPENDED",
              note:         body.note ?? "Member suspended by admin.",
              createdBy:    actor,
            },
          });
        }
      });

    } else if (newStatus === "FROZEN") {
      // ── Freeze ───────────────────────────────────────────────────────────
      // Member requested pause. Membership clock stops.
      // We record the freeze start timestamp in the timeline note so we can
      // calculate the extension when they unfreeze.
      await prisma.$transaction(async (tx) => {
        await tx.member.update({ where: { id }, data: { status: "FROZEN" } });

        if (activeMembership) {
          await tx.membership.update({
            where: { id: activeMembership.id },
            data:  { status: "FROZEN" },
          });

          await tx.membershipTimeline.create({
            data: {
              membershipId: activeMembership.id,
              event:        "FROZEN",
              note:         JSON.stringify({
                reason:     body.note ?? "Member requested freeze.",
                frozenAt:   new Date().toISOString(),
              }),
              createdBy:    actor,
            },
          });
        }
      });

    } else if (newStatus === "ACTIVE") {
      // ── Activate ─────────────────────────────────────────────────────────
      // If coming from FROZEN: find the freeze start, extend endDate by the
      // number of days frozen. If coming from SUSPENDED: just reactivate.
      await prisma.$transaction(async (tx) => {
        await tx.member.update({ where: { id }, data: { status: "ACTIVE" } });

        if (activeMembership) {
          let updatedEndDate = activeMembership.endDate;

          if (member.status === "FROZEN") {
            // Find the most recent FROZEN timeline entry to get frozenAt
            const freezeEntry = await tx.membershipTimeline.findFirst({
              where:   { membershipId: activeMembership.id, event: "FROZEN" },
              orderBy: { createdAt: "desc" },
            });

            if (freezeEntry?.note) {
              try {
                const parsed   = JSON.parse(freezeEntry.note);
                const frozenAt = new Date(parsed.frozenAt);
                const now      = new Date();
                const frozenMs = now.getTime() - frozenAt.getTime();
                const frozenDays = Math.ceil(frozenMs / (1000 * 60 * 60 * 24));
                // Extend endDate by exact frozen duration
                updatedEndDate = new Date(
                  activeMembership.endDate.getTime() + frozenMs
                );
                console.log(`Freeze extended endDate by ${frozenDays} day(s)`);
              } catch {
                // Malformed note — skip extension, still reactivate
              }
            }
          }

          await tx.membership.update({
            where: { id: activeMembership.id },
            data:  { status: "ACTIVE", endDate: updatedEndDate },
          });

          await tx.membershipTimeline.create({
            data: {
              membershipId: activeMembership.id,
              event:        "ACTIVATED",
              note:         body.note ?? (
                member.status === "FROZEN"
                  ? "Member unfrozen — end date extended."
                  : "Member reactivated by admin."
              ),
              createdBy:    actor,
            },
          });
        }
      });

    } else {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const updated = await prisma.member.findUnique({ where: { id } });
    return NextResponse.json(updated);
  }

  // ── Non-status field updates ─────────────────────────────────────────────
  const member = await prisma.member.update({
    where: { id },
    data: {
      fullName:         body.fullName         ?? undefined,
      phone:            body.phone            ?? undefined,
      email:            body.email            ?? undefined,
      gender:           body.gender           ?? undefined,
      dob:              body.dob ? new Date(body.dob) : undefined,
      address:          body.address          ?? undefined,
      bloodGroup:       body.bloodGroup       ?? undefined,
      medicalInfo:      body.medicalInfo      ?? undefined,
      emergencyContact: body.emergencyContact ?? undefined,
    },
  });
  return NextResponse.json(member);
});

export const DELETE = apiHandler(async (_req, { params }) => {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params!;
  await prisma.member.delete({ where: { id } });
  return NextResponse.json({ success: true });
});
