import { CountryCode } from "./countries";
import { constructUrl } from "./helper";

const apiurl = "https://emergencynumberapi.com/api/country/";

export const getEmergencyHotlines = async(code: CountryCode) => {
  const url = constructUrl(apiurl + code.code, {});
  try {
    const res = await fetch(url);
    const json = await res.json() as any;
    return {
      data: json.data
    };
  } catch (e) {
    return {
      error: e
    };
  }
};