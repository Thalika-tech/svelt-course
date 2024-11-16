// Copied from supabase docs
// This file just passes the session down from the server to the +layout.ts - step 2

import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async ({ locals: { safeGetSession }, cookies }) => {
  const { session } = await safeGetSession();
  return {
    session,
    cookies: cookies.getAll(),
  };
};
