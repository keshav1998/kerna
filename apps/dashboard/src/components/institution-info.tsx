import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@kerna/ui/tooltip";
import type { ReactNode } from "react";

type Props = {
  provider: string;
  children: ReactNode;
};

export function InstitutionInfo({ provider, children }: Props) {
  const getDescription = () => {
    switch (provider) {
    }
  };

  return (
    <TooltipProvider delayDuration={100}>
      <Tooltip>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent className="w-[300px] text-xs" side="right">
          {getDescription()}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
