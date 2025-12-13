"use client";

import { createClient } from "@kerna/supabase/client";
import { DropdownMenuItem } from "@kerna/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function SignOut() {
  const [isLoading, setLoading] = useState(false);
  const supabase = createClient();
  const router = useRouter();

  const handleSignOut = async () => {
    setLoading(true);

    await supabase.auth.signOut({
      scope: "local",
    });

    router.push("/login");
  };

  return (
    <DropdownMenuItem className="text-xs" onClick={handleSignOut}>
      {isLoading ? "Loading..." : "Sign out"}
    </DropdownMenuItem>
  );
}
