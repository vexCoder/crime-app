import { config } from "./env";
import {
  constructUrl
} from "./helper";

type FetchParams = {endpoint: string, json: string, extra?: Record<string, any>};
export const fetchMapBox = async ({ endpoint, json, extra }: FetchParams) => {
  const {mapbox} = config()
  const base = `${mapbox.url}/${endpoint}/${json}.json`;
  const params = extra || {};
  const url = constructUrl(base, { access_token: mapbox.key, ...params });
  try {
    const res = await fetch(url);
    const json = await res.json() as any;
    return {
      data: json
    };
  } catch (e) {
    return {
      error: e
    };
  }
};


type SearchParams = {address: string; autocomplete?: boolean};
export const searchAddress = async ({ address, autocomplete }: SearchParams): Promise<{data?: any[]; error?: string}> => {
  try {
    const res = await fetchMapBox({ endpoint: "mapbox.places", json: address, ...(!!autocomplete && { extra: { autocomplete: autocomplete ? "true" : "false" } }) });

    return {
      data: res.data?.features || []
    };
  } catch (e) {
    console.log((e as any).message);
    return {
      error: (e as any).message
    };
  }
};
