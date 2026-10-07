import type { ArchiveSeason } from "./types";

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

export const season2026_2027: ArchiveSeason = {
  season: "2026/2027",

  teams: [
    {
      id: "zaki2019",
      name: "Żaki 2019",
      slug: "zaki-2019",
      description: "Terminarz drużyny Żaków 2019",
      source: "Łączy Nas Piłka",
      teamId: "2646f052-f204-4f53-844a-5c910bf2240c",
      category: "Żaki",
      order: 1,

      // Nie pokazujemy tej kategorii w archiwum po zakończeniu sezonu.
      archive: false,

      competitions: [
        {
          id: "52adbd2d-362a-4e8a-bac4-721bf80732b1",
          name: "Rozgrywki Żaki 2019",
          category: "League",
          label: "Liga",
        },
      ],
    },

    {
      id: "zaki2018",
      name: "Żaki 2018",
      slug: "zaki-2018",
      description: "Terminarz drużyny Żaków 2018",
      source: "Łączy Nas Piłka",
      teamId: "157509d1-f1f0-4522-af37-07c06a3833e0",
      category: "Żaki",
      order: 2,
      archive: false,

      competitions: [
        {
          id: "69cb1909-28e8-458e-a08a-2f920fb5a9e9",
          name: "Rozgrywki Żaki 2018",
          category: "League",
          label: "Liga",
        },
      ],
    },

    {
      id: "orlik2017",
      name: "Orlik 2017",
      slug: "orlik-2017",
      description: "Terminarz drużyny Orlik 2017",
      source: "Łączy Nas Piłka",
      teamId: "90f289d1-6264-4390-bb7c-5199afc7456a",
      category: "Orlik",
      order: 3,
      archive: false,

      competitions: [
        {
          id: "3f4acac7-5c00-4b18-9a6e-c24be8b7308f",
          name: "Rozgrywki Orlik 2017",
          category: "League",
          label: "Liga",
        },
      ],
    },

    {
      id: "orlik2017II",
      name: "Orlik 2017 II",
      slug: "orlik-2017-ii",
      description: "Terminarz drużyny Orlik 2017 II",
      source: "Łączy Nas Piłka",
      teamId: "c2c57d1e-d736-4218-8e7f-a6ee1a63a5e9",
      category: "Orlik",
      order: 4,
      archive: false,

      competitions: [
        {
          id: "b4b47c2c-5352-427a-919b-66a665ed135d",
          name: "Rozgrywki Orlik 2017 II",
          category: "League",
          label: "Liga",
        },
      ],
    },

    {
      id: "orlik2016",
      name: "Orlik 2016",
      slug: "orlik-2016",
      description: "Terminarz drużyny Orlik 2016",
      source: "Łączy Nas Piłka",
      teamId: "888f7138-35ac-47da-826b-8ed368a58ed0",
      category: "Orlik",
      order: 5,
      archive: false,

      competitions: [
        {
          id: "d1ad72e4-035b-459a-ab4d-45bf28fa8176",
          name: "Rozgrywki Orlik 2016",
          category: "League",
          label: "Liga",
        },
      ],
    },

    {
      id: "trampkarze2013",
      name: "Trampkarze 2013",
      slug: "trampkarze-2013",
      description: "Terminarz drużyny Trampkarzy 2013",
      source: "Łączy Nas Piłka",
      teamId: "19e16929-9281-4b94-be4a-30b36d873178",
      category: "Trampkarze",
      order: 6,

      competitions: [
        {
          id: "4af98b9d-c1d7-4035-8004-10b5b8bb7724",
          name: "Rozgrywki Trampkarze 2013",
          category: "League",
          label: "Liga",
        },
      ],
    },

    {
      id: "junior2010",
      name: "Junior Młodszy 2010",
      slug: "junior-2010",
      description: "Terminarz drużyny Juniora Młodszego 2010",
      source: "Łączy Nas Piłka",
      teamId: "e9b91bb5-2d16-4daf-ad5e-3b80e8543ca2",
      category: "Junior Młodszy",
      order: 7,

      competitions: [
        {
          id: "9cbb2f52-b187-4f56-8d49-a4f4ea51829c",
          name: "Rozgrywki Junior Młodszy 2010",
          category: "League",
          label: "Liga",
        },
      ],
    },

    {
      id: "seniorzy",
      name: "Seniorzy",
      slug: "seniorzy",
      description: "Terminarz drużyny Seniorów",
      source: "Łączy Nas Piłka",
      teamId: "b7c6e3a3-088b-4185-be3a-3f748a99b40c",
      category: "Seniorzy",
      order: 8,

      competitions: [
        {
          id: "359dce4b-6ade-4766-af21-b26d473ca3d8",
          name: "Rozgrywki Seniorów",
          category: "League",
          label: "Liga",
        },
      ],
    },

    {
      id: "seniorzyII",
      name: "Seniorzy II",
      slug: "seniorzy-ii",
      description: "Terminarz drużyny Seniorów II",
      source: "Łączy Nas Piłka",
      teamId: "f2d19c24-b939-4ce0-b8cf-2b048488f030",
      category: "Seniorzy",
      order: 9,

      competitions: [
        {
          id: "c9cda44d-6dee-43f9-99dc-e0caeb902303",
          name: "Rozgrywki Seniorów II",
          category: "League",
          label: "Liga",
        },
      ],
    },
  ],
};
