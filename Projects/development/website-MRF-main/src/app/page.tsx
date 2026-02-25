import { redirect } from "next/navigation";
import { defaultLocale } from "@/lib/i18n/config";

// This page only renders when the user is on the root path
export default function RootPage() {
  redirect(`/${defaultLocale}`);
}
