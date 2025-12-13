"use client";

import { useTrackerParams } from "@/hooks/use-tracker-params";
import { Button } from "@kerna/ui/button";
import { Icons } from "@kerna/ui/icons";

export function OpenTrackerSheet() {
  const { setParams } = useTrackerParams();

  return (
    <div>
      <Button
        variant="outline"
        size="icon"
        onClick={() => setParams({ create: true })}
      >
        <Icons.Add />
      </Button>
    </div>
  );
}
