export type TeamKey =
  | "zaki2019"
  | "zaki2018"
  | "orlik2017"
  | "orlik2017II"
  | "orlik2016"
  | "trampkarze2013"
  | "junior2010"
  | "seniorzy"
  | "seniorzyII";

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

  orlik2017II: {
    name: "Orlik 2017 II",
    slug: "orlik-2017-ii",
    description: "Terminarz drużyny Orlik 2017 II",
    source: "Łączy Nas Piłka",
    playId: "b4b47c2c-5352-427a-919b-66a665ed135d",
    teamId: "c2c57d1e-d736-4218-8e7f-a6ee1a63a5e9",
    order: 4,
  },

  orlik2016: {
    name: "Orlik 2016",
    slug: "orlik-2016",
    description: "Terminarz drużyny Orlik 2016",
    source: "Łączy Nas Piłka",
    playId: "d1ad72e4-035b-459a-ab4d-45bf28fa8176",
    teamId: "888f7138-35ac-47da-826b-8ed368a58ed0",
    order: 5,
  },

  trampkarze2013: {
    name: "Trampkarze 2013",
    slug: "trampkarze-2013",
    description: "Terminarz drużyny Trampkarzy 2013",
    source: "Łączy Nas Piłka",
    playId: "4af98b9d-c1d7-4035-8004-10b5b8bb7724",
    teamId: "19e16929-9281-4b94-be4a-30b36d873178",
    order: 6,
  },

  junior2010: {
    name: "Junior Młodszy 2010",
    slug: "junior-2010",
    description: "Terminarz drużyny Juniora Młodszego 2010",
    source: "Łączy Nas Piłka",
    playId: "9cbb2f52-b187-4f56-8d49-a4f4ea51829c",
    teamId: "e9b91bb5-2d16-4daf-ad5e-3b80e8543ca2",
    order: 7,
  },

  seniorzy: {
    name: "Seniorzy",
    slug: "seniorzy",
    description: "Terminarz drużyny Seniorów",
    source: "Łączy Nas Piłka",
    playId: "359dce4b-6ade-4766-af21-b26d473ca3d8",
    teamId: "b7c6e3a3-088b-4185-be3a-3f748a99b40c",
    order: 8,
  },

  seniorzyII: {
    name: "Seniorzy II",
    slug: "seniorzy-ii",
    description: "Terminarz drużyny Seniorów II",
    source: "Łączy Nas Piłka",
    playId: "c9cda44d-6dee-43f9-99dc-e0caeb902303",
    teamId: "f2d19c24-b939-4ce0-b8cf-2b048488f030",
    order: 9,
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
