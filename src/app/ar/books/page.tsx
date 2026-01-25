import { redirect } from "next/navigation";

export default function BooksPage() {
  redirect("/ar/store?tab=books");
}
