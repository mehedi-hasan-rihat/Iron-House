# Permissions

## How it works

Permissions in Iron House are **code-defined and JWT-cached**. There are no permissions tables in the database. The single source of truth is `src/lib/permissions.ts`.

### Flow

```
Login
  → authorize() looks up user.role.name from DB
  → getPermissionsForRole(role) returns a flat PermissionKey[] from DEFAULT_PERMISSIONS
  → array is embedded in the JWT token

Every request
  → session.user.permissions is read directly from the JWT (zero DB calls)
  → page guards and API routes check .includes("module:action") on that array
```

Permissions are baked into the token at login. If you change `DEFAULT_PERMISSIONS`, existing sessions won't pick up the new values until the user logs out and back in.

---

## Permission keys

Every permission is a `module:action` string typed as `PermissionKey` — e.g. `members:create`, `payments:refund`.

**Modules:** `dashboard` · `members` · `plans` · `memberships` · `payments` · `staff` · `roles`

**Actions:** `view` · `create` · `edit` · `delete` · `refund`

Not every module supports every action. Only combinations that are actually enforced somewhere in the codebase exist in the matrix.

---

## Role matrix

| Permission | owner | manager | receptionist | trainer | accountant |
|---|:---:|:---:|:---:|:---:|:---:|
| dashboard:view | ✅ | ✅ | ✅ | ✅ | ✅ |
| members:view | ✅ | ✅ | ✅ | ✅ | |
| members:create | ✅ | ✅ | ✅ | | |
| members:edit | ✅ | ✅ | | | |
| plans:view | ✅ | ✅ | ✅ | | ✅ |
| plans:create | ✅ | ✅ | | | |
| plans:edit | ✅ | ✅ | | | |
| plans:delete | ✅ | | | | |
| memberships:view | ✅ | ✅ | ✅ | ✅ | ✅ |
| memberships:create | ✅ | ✅ | ✅ | | |
| memberships:edit | ✅ | ✅ | | | |
| payments:view | ✅ | ✅ | ✅ | | ✅ |
| payments:edit | ✅ | | | | |
| payments:refund | ✅ | | | | ✅ |
| staff:view | ✅ | ✅ | | | |
| staff:create | ✅ | | | | |
| staff:edit | ✅ | | | | |
| staff:delete | ✅ | | | | |
| roles:view | ✅ | ✅ | | | |

`member` role has no admin permissions — members use a completely separate layout and ecosystem and are not subject to this RBAC system.

---

## Enforcing permissions

### Layout (automatic)

The `(admin)` layout calls `requireStaff()` once. Every page inside `/admin/*` is automatically protected — no need to repeat it on individual pages.

```ts
// src/app/(admin)/layout.tsx
const session = await requireStaff();
```

### Pages that need a specific permission

For create/edit pages where direct URL access should be blocked, use `requirePermission`:

```ts
// src/app/(admin)/admin/members/new/page.tsx
import { requirePermission } from "@/lib/auth-guard";

export default async function NewMemberPage() {
  await requirePermission("members", "create");
  // ...
}
```

### Pages that conditionally show/hide UI

For list/detail pages that render different buttons based on role, read `session.user.permissions` directly from `auth()` — no guard call needed since the layout already handles that:

```ts
// src/app/(admin)/admin/plans/page.tsx
import { auth } from "@/auth";

export default async function PlansPage() {
  const session   = await auth();
  const perms     = session!.user.permissions ?? [];
  const canCreate = perms.includes("plans:create");
  const canEdit   = perms.includes("plans:edit");
  const canDelete = perms.includes("plans:delete");
  // ...
}
```

Detail pages that also need a permission gate (e.g. only those with `memberships:view` can open a membership) use `requirePermission` and then read permissions from the returned session:

```ts
const session = await requirePermission("memberships", "view");
const canEdit = session.user.permissions.includes("memberships:edit");
```

### API routes

Use `checkPermission(session, module, action)` from `src/lib/api.ts`. Returns a `403 NextResponse` if denied, `null` if the check passes.

```ts
import { auth } from "@/auth";
import { apiHandler, checkPermission } from "@/lib/api";

export const POST = apiHandler(async (req) => {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const denied = await checkPermission(session, "members", "create");
  if (denied) return denied;

  // proceed...
});
```

### Client components

Pass permission flags as props from the server page rather than reading from a hook. The server is the authority.

```tsx
// Server page resolves the permission
const canEdit = session!.user.permissions.includes("members:edit");

// Passed down to client component
<MemberNotes memberId={id} canEdit={canEdit} initialNotes={notes} />
```

For client components that need to check permissions themselves, use the context hook from `AdminShell`:

```ts
import { useHasPermission } from "@/components/admin/AdminShell";

export default function SomeClientComponent() {
  const canRefund = useHasPermission("payments:refund");
  return canRefund ? <RefundButton /> : null;
}
```

---

## Adding or changing permissions

1. Edit `DEFAULT_PERMISSIONS` in `src/lib/permissions.ts`
2. If adding a new module, add it to the `Module` type in the same file
3. Add `checkPermission` / `requirePermission` calls to the relevant API routes and pages
4. Ask affected users to log out and back in — permissions are cached in the JWT

No migrations, no DB changes, no seed changes needed.

---

## Adding a new role

1. Add the role name and its permissions to `DEFAULT_PERMISSIONS` in `src/lib/permissions.ts`
2. Run `npx prisma db seed` to create the role row in the database
3. The role is now assignable to staff via the staff creation form

```ts
// src/lib/permissions.ts
export const DEFAULT_PERMISSIONS = {
  // ...existing roles...

  supervisor: [
    "dashboard:view",
    "members:view",
    "memberships:view",
    "payments:view",
  ] satisfies PermissionKey[],
};
```
