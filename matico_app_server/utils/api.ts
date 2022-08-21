import useSwr from "swr";

export interface ApiOptions {
  initialData?: any;
  params?: Record<string, any>;
}

export const fetcher = async (url: string) => fetch(url).then((r) => r.json());

export const useApi = (apiPath: string | null, options: ApiOptions) => {
  const { initialData, params } = options;
  let fullUrl = apiPath;
  if (params) {
    const paramString = Object.entries(params)
      .map(
        ([key, val]) => `${encodeURIComponent(key)}=${encodeURIComponent(val)}`
      )
      .join("&");
    fullUrl = `${fullUrl}?${paramString}`;
  }
  return useSwr(fullUrl, fetcher, { fallbackData: initialData });
};
