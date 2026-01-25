import { notFound } from "next/navigation";
import { getRequestConfig } from "next-intl/server";

// Can be imported from a shared config
export const locales = ["ar", "en"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "ar";

export const localeConfig = {
  ar: {
    label: "العربية",
    dir: "rtl" as const,
    flag: "🇪🇬",
  },
  en: {
    label: "English",
    dir: "ltr" as const,
    flag: "🇺🇸",
  },
};

export default getRequestConfig(async ({ locale }) => {
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as Locale)) notFound();

  return {
    locale: locale as Locale,
    messages: (await import(`./messages/${locale}.json`)).default,
  };
});

export function getDirection(locale: Locale): "rtl" | "ltr" {
  return localeConfig[locale].dir;
}

export function getLocaleLabel(locale: Locale): string {
  return localeConfig[locale].label;
}

export function getLocaleFlag(locale: Locale): string {
  return localeConfig[locale].flag;
}
