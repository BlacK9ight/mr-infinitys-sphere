import { auth } from "@clerk/nextjs/server";

/**
 * Being signed in is not enough: only the Clerk account whose ID is stored in
 * ADMIN_CLERK_USER_ID counts as the admin. If that variable is missing, nobody
 * is an admin (fails closed).
 */
export async function getAdminState() {
  const { userId } = await auth();
  const adminId = process.env.ADMIN_CLERK_USER_ID;
  return {
    userId,
    configured: Boolean(adminId),
    admin: Boolean(userId && adminId && userId === adminId),
  };
}
