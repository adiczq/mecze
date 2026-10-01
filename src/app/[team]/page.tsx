import { notFound } from "next/navigation";
import TeamSchedulePage from "@/components/TeamSchedulePage";
import { teamConfig, type TeamKey } from "@/lib/teams";

type TeamPageProps = {
  params: Promise<{
    team: string;
  }>;
};

export default async function TeamPage({ params }: TeamPageProps) {
  const { team } = await params;
  if (!(team in teamConfig)) {
    notFound();
  }

  return <TeamSchedulePage teamKey={team as TeamKey} />;
}
