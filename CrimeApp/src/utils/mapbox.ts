import {
  constructUrl 
} from "./helper";

const BASEURL = "https://api.mapbox.com/geocoding/v5";
const APIKEY = "pk.eyJ1IjoidmFuaXR5MDExIiwiYSI6ImNrZmYyM29ndzBhaTQyeXBqNWFhY24ybHYifQ.0dCVSTLN0OH6WH9IW02Tjw";

type GetDataParams = {lng: number; lat: number};
export const getData = async ({ lng, lat }: GetDataParams) => {
  const base = `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json`;
  const url = constructUrl(base, { access_token: APIKEY });
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

export const getCountry = async ({ data }: {data: GetDataParams}) => {
  try {
    const loc = await getData(data);
    if(!loc.data.features || !loc.data.features?.length){
      return {
        error: "Location Unidentified"
      };
    }

    if(loc.data) {
      return {
        data: loc.data.features[4].place_name
      };
    }else{
      return {
        error: loc.error
      };
    }
  } catch (e) {
    return {
      error: e.message
    };
  }
};

type FetchParams = {endpoint: string, json: string, extra?: Record<string, any>};
export const fetchMapBox = async ({ endpoint, json, extra }: FetchParams) => {
  const base = `${BASEURL}/${endpoint}/${json}.json`;
  const params = extra || {};
  const url = constructUrl(base, { access_token: APIKEY, ...params });
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
    console.log(e.message);
    return {
      error: e.message
    };
  }
};