import { clerkMiddleware } from "@clerk/nextjs/server";

// Only /admin needs a login. The public site never depends on Clerk.
export default clerkMiddleware(async (auth) => {
  await auth.protect();
});

export const config = {
  matcher: ["/admin(.*)"],
};