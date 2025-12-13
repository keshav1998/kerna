"use client";

import { createPlaidLinkTokenAction } from "@/actions/institutions/create-plaid-link";
import { exchangePublicToken } from "@/actions/institutions/exchange-public-token";
import { useConnectParams } from "@/hooks/use-connect-params";
import { useTeamQuery } from "@/hooks/use-team";
import { useTRPC } from "@/trpc/client";
import { track } from "@kerna/events/client";
import { LogEvents } from "@kerna/events/events";
import { Button } from "@kerna/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@kerna/ui/dialog";
import { Input } from "@kerna/ui/input";
import { Skeleton } from "@kerna/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { usePlaidLink } from "react-plaid-link";
import { useDebounceValue, useScript } from "usehooks-ts";
import { BankLogo } from "../bank-logo";
import { ConnectBankProvider } from "../connect-bank-provider";
import { CountrySelector } from "../country-selector";
import { InstitutionInfo } from "../institution-info";

function SearchSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from(new Array(10), (_, index) => (
        <div className="flex items-center space-x-4" key={index.toString()}>
          <Skeleton className="h-9 w-9 rounded-full" />
          <div className="flex flex-col space-y-1">
            <Skeleton className="h-2 rounded-none w-[140px]" />
            <Skeleton className="h-2 rounded-none w-[40px]" />
          </div>
        </div>
      ))}
    </div>
  );
}

function formatProvider(provider: string) {
  switch (provider) {
    case "enablebanking":
      return "Enable Banking";
