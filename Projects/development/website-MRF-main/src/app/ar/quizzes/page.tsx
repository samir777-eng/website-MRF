import { redirect } from "next/navigation";

// Redirect old quizzes URL to new challenges page
export default function ArabicQuizzesPage() {
  redirect("/ar/challenges");
}
