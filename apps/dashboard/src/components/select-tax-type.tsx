"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@kerna/ui/select";
import { taxTypes } from "@kerna/utils/tax";

type Props = {
  value: string;
  onChange: (value: string) => void;
};

export function SelectTaxType({ value, onChange }: Props) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger>
        <SelectValue placeholder="Select a tax type" />
      </SelectTrigger>
      <SelectContent>
        {taxTypes.map((taxType) => (
          <SelectItem key={taxType.value} value={taxType.value}>
            {taxType.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
