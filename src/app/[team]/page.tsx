import { notFound } from "next/navigation";
import TeamSchedulePage from "@/components/TeamSchedulePage";
import { teamConfig, teamKeys, type TeamKey } from "@/lib/teams";

type TeamPageProps = {
  params: Promise<{ team: string }>;
};

export default async function TeamPage({ params }: TeamPageProps) {
  const { team } = await params;

  const teamKey = teamKeys.find((key) => teamConfig[key].slug === team) as
    TeamKey | undefined;

  if (!teamKey) {
    notFound();
  }

  return <TeamSchedulePage teamKey={teamKey} />;
}
