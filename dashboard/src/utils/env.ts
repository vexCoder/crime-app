export const config = () => {
  const mapbox = {
    url: (import.meta.env.VITE_BASE_URL || '') as string,
    key: (import.meta.env.VITE_MAPBOX_API_KEY || '') as string,
  }

  const app = {
    api: (import.meta.env.VITE_API_URL || '') as string,
  }

  return {
    mapbox,
    app
  }
}
