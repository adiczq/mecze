export type TeamKey =
  | "zaki2019"
  | "zaki2018"
  | "orlik2017"
  | "trampkarze2013"
  | "junior2010"
  | "seniorzy";

export const teamConfig = {
  zaki2019: {
    name: "Żaki 2019",
    slug: "zaki-2019",
    description: "Terminarz drużyny Żaków 2019",
    source: "Łączy Nas Piłka",
    playId: "52adbd2d-362a-4e8a-bac4-721bf80732b1",
    teamId: "2646f052-f204-4f53-844a-5c910bf2240c",
    order: 1,
  },

  zaki2018: {
    name: "Żaki 2018",
    slug: "zaki-2018",
    description: "Terminarz drużyny Żaków 2018",
    source: "Łączy Nas Piłka",
    playId: "69cb1909-28e8-458e-a08a-2f920fb5a9e9",
    teamId: "157509d1-f1f0-4522-af37-07c06a3833e0",
    order: 2,
  },

  orlik2017: {
    name: "Orlik 2017",
    slug: "orlik-2017",
    description: "Terminarz drużyny Orlik 2017",
    source: "Łączy Nas Piłka",
    playId: "3f4acac7-5c00-4b18-9a6e-c24be8b7308f",
    teamId: "90f289d1-6264-4390-bb7c-5199afc7456a",
    order: 3,
  },

  trampkarze2013: {
    name: "Trampkarze 2013",
    slug: "trampkarze-2013",
    description: "Terminarz drużyny Trampkarzy 2013",
    source: "Łączy Nas Piłka",
    playId: "4af98b9d-c1d7-4035-8004-10b5b8bb7724",
    teamId: "19e16929-9281-4b94-be4a-30b36d873178",
    order: 4,
  },

  junior2010: {
    name: "Junior Młodszy 2010",
    slug: "junior-2010",
    description: "Terminarz drużyny Juniora Młodszego 2010",
    source: "Łączy Nas Piłka",
    playId: "9cbb2f52-b187-4f56-8d49-a4f4ea51829c",
    teamId: "e9b91bb5-2d16-4daf-ad5e-3b80e8543ca2",
    order: 5,
  },

  seniorzy: {
    name: "Seniorzy",
    slug: "seniorzy",
    description: "Terminarz drużyny Seniorów",
    source: "Łączy Nas Piłka",
    playId: "359dce4b-6ade-4766-af21-b26d473ca3d8",
    teamId: "b7c6e3a3-088b-4185-be3a-3f748a99b40c",
    order: 6,
  },
} satisfies Record<
  TeamKey,
  {
    name: string;
    slug: string;
    description: string;
    source: string;
    playId: string;
    teamId: string;
    order: number;
  }
>;

export const teamKeys = Object.keys(teamConfig) as TeamKey[];
