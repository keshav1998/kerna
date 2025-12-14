import { EnableBankingApi } from "@/providers/enablebanking/enablebanking-api";
import { hashInstitutionId } from "@/providers/enablebanking/transform";

import { PlaidApi } from "@/providers/plaid/plaid-api";
import { getFileExtension, getLogoURL } from "@/utils/logo";
import { getPopularity, getTellerData, matchLogoURL } from "./utils";

export async function getEnableBankingInstitutions() {
  const provider = new EnableBankingApi({
    // @ts-ignore
    envs: {
      ENABLEBANKING_APPLICATION_ID: process.env.ENABLEBANKING_APPLICATION_ID!,
      ENABLE_BANKING_KEY_CONTENT: process.env.ENABLE_BANKING_KEY_CONTENT!,
    },
  });

  const data = await provider.getInstitutions();

  return data.flatMap((institution) => {
    const hashId = hashInstitutionId(institution.name, institution.country);
    const baseInstitution = {
      name: institution.name,
      logo: getLogoURL(encodeURIComponent(institution.name), "png"),
      countries: [institution.country],
      maximum_consent_validity: institution.maximum_consent_validity,
      required_psu_headers: institution.required_psu_headers ?? null,
      provider: "enablebanking",
    };

    return (institution.psu_types ?? []).map((psuType) => ({
      ...baseInstitution,
      id: psuType === "business" ? hashId : `${hashId}-personal`,
      type: psuType,
      popularity: 10000,
    }));
  });
}


export async function getTellerInstitutions() {
  const data = await getTellerData();

  return data.map((institution) => ({
    id: institution.id,
    name: institution.name,
    logo: getLogoURL(institution.id),
    countries: ["US"],
    popularity: getPopularity(institution.id) ?? 10, // Make Teller higher priority,
    provider: "teller",
  }));
}

export async function getPlaidInstitutions() {
  const provider = new PlaidApi({
    // @ts-ignore
    envs: {
      PLAID_CLIENT_ID: process.env.PLAID_CLIENT_ID!,
      PLAID_SECRET: process.env.PLAID_SECRET!,
    },
  });

  const data = await provider.getInstitutions();

  return data.map((institution) => {
    return {
      id: institution.institution_id,
      name: institution.name,
      logo: institution.logo
        ? getLogoURL(institution.institution_id)
        : matchLogoURL(institution.institution_id),
      countries: institution.country_codes,
      popularity: getPopularity(institution.institution_id),
      provider: "plaid",
    };
  });
}

export async function getInstitutions() {
  const data = await Promise.all([
    // getTellerInstitutions(),
    // getPlaidInstitutions(),
    getEnableBankingInstitutions(),
  ]);

  return data.flat();
}
