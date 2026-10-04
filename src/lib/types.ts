export type Match = {
  id: string;
  date: string;
  time?: string;
  homeTeam: string;
  awayTeam: string;
  venue?: string;
  round?: string;
  source?: string;
  score?: string;
  played?: boolean;
};
