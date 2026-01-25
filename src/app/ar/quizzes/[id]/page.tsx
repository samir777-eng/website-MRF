import { redirect } from "next/navigation";

interface Props {
  params: Promise<{ id: string }>;
}

// Redirect old quiz detail URL to new challenges page
export default async function QuizDetailPage({ params }: Props) {
  const { id } = await params;
  redirect(`/ar/challenges/${id}`);
}

