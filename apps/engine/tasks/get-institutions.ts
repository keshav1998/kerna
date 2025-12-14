import { EnableBankingApi } from "@/providers/enablebanking/enablebanking-api";
import { hashInstitutionId } from "@/providers/enablebanking/transform";
import { getLogoURL } from "@/utils/logo";

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

export async function getInstitutions() {
  const data = await Promise.all([getEnableBankingInstitutions()]);

  return data.flat();
}
