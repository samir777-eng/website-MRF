import { redirect } from "next/navigation";

// Corners hub has been deprecated
// Features are now accessible from the Dashboard
export default function CornersPage() {
  redirect("/ar/dashboard");
}
