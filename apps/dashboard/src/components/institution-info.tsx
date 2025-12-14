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
      case "teller":
        return "Teller provides banking connectivity for US institutions.";
      case "plaid":
        return "Plaid provides banking connectivity for US and Canadian institutions.";
      case "enablebanking":
        return "Enable Banking provides banking connectivity for European institutions.";
      default:
        return "Banking connectivity provider.";
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
