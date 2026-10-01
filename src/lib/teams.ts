export type TeamKey =
  | "zaki"
  | "trampkarze"
  | "seniorzy";

export const teamConfig = {
  zaki: {
    name: "Żaki",
    slug: "zaki",
    description: "Terminarz drużyny Żaków",
    source: "ŚLZPN",
    playId: "",
    order: 1,
  },

  trampkarze: {
    name: "Trampkarze",
    slug: "trampkarze",
    description: "Terminarz drużyny Trampkarzy",
    source: "Łączy Nas Piłka",
    playId: "4af98b9d-c1d7-4035-8004-10b5b8bb7724",
    order: 2,
  },

  seniorzy: {
    name: "Seniorzy",
    slug: "seniorzy",
    description: "Terminarz drużyny Seniorów",
    source: "Łączy Nas Piłka",
    playId: "359dce4b-6ade-4766-af21-b26d473ca3d8",
    order: 3,
  },
} satisfies Record<
  TeamKey,
  {
    name: string;
    slug: string;
    description: string;
    source: string;
    playId: string;
    order: number;
  }
>;

export const teamKeys = Object.keys(teamConfig) as TeamKey[];