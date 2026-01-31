import { SWRConfiguration } from "swr";

export const swrConfig: SWRConfiguration = {
  revalidateOnFocus: false,
  revalidateOnReconnect: true,
  dedupingInterval: 2000,
  errorRetryCount: 3,
  errorRetryInterval: 5000,
  shouldRetryOnError: true,
  keepPreviousData: true,

  // Cache configuration
  provider: () => new Map(),

  // Revalidation
  revalidateIfStale: true,
  revalidateOnMount: true,

  // Focus revalidation
  focusThrottleInterval: 5000,
};

// Fetcher function for API calls
export const fetcher = async (url: string) => {
  const res = await fetch(url);

  if (!res.ok) {
    const error = new Error("An error occurred while fetching the data.");
    throw error;
  }

  return res.json();
};
