"use client";

import { createClient } from "@kerna/supabase/client";
import { Button } from "@kerna/ui/button";

export function SignOutButton() {
  const supabase = createClient();

  return (
    <Button
      variant="outline"
      className="w-full"
      onClick={() => supabase.auth.signOut()}
    >
      Sign out
    </Button>
  );
}
