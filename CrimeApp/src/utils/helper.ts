import {
  ReactNativeFile,
} from "apollo-upload-client";
import mime from "mime";


export const createFile = (uri: string, name: string) => {
  return new ReactNativeFile({
    uri,
    type: mime.getType(uri) || "image/jpeg",
    name,
  });
};

export const extractError = (res: any, key: string) => {
  const serverError = res?.error;
  const request = res?.data;

  if (request) {
    if (serverError) {
      return serverError.message;
    }

    const requestError = request[key]?.error;
    if (requestError) {
      return requestError;
    }
  }

  return null;
};

export const constructUrl = (
  base: string,
  query: Record<string, string | string[] | null | undefined>
) => {
  if (!query) return base;
  const queries = Object.keys(query);
  return (
    base +
    queries
      .filter((v) => query[v] !== null && query[v] !== undefined)
      .reduce(
        (p, c, i) =>
          p +
          `${i > 0 ? "&" : ""}${c}=${
            typeof query[c] === "string"
              ? query[c]
              : ((query[c] as string[]) || []).join(",")
          }`,
        "?"
      )
  );
};

export const metersPerPixel = (latitude: number, zoomLevel: number) => {
  const earthCircumference = 40075017;
  const latitudeRadians = latitude * (Math.PI/180);
  return earthCircumference * Math.cos(latitudeRadians) / Math.pow(2, zoomLevel + 9);
};

export const meter2Pixel = (latitude: number, meters: number, zoomLevel: number) => {
  return meters / metersPerPixel(latitude, zoomLevel);
};

export const rainbow = (n: number, s = 100, l = 50) => {
  n = n * 240 / 255;
  return `hsl(${n},${s}%,${l}%)`;
};