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
      category: "F2",
      order: 1,
      archive: false,

      competitions: [
        {
          id: "52adbd2d-362a-4e8a-bac4-721bf80732b1",
          name: 'Rybnik: F2 Żak "ŻAKI 2019 A RYBNIK" Grupa 1',
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
      category: "F1",
      order: 2,
      archive: false,

      competitions: [
        {
          id: "69cb1909-28e8-458e-a08a-2f920fb5a9e9",
          name: 'Rybnik: F1 Żak "ŻAKI 2018 A RYBNIK" Grupa 1',
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
      category: "E2",
      order: 3,
      archive: false,

      competitions: [
        {
          id: "3f4acac7-5c00-4b18-9a6e-c24be8b7308f",
          name: 'Rybnik: E2 Orlik "PLOM 2017 A RYBNIK" Grupa 1',
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
      category: "E2",
      order: 4,
      archive: false,

      competitions: [
        {
          id: "b4b47c2c-5352-427a-919b-66a665ed135d",
          name: 'Rybnik: E2 Orlik "PLOM 2017 H RYBNIK" Grupa 8',
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
      category: "E1",
      order: 5,
      archive: false,

      competitions: [
        {
          id: "d1ad72e4-035b-459a-ab4d-45bf28fa8176",
          name: 'Rybnik: E1 Orlik "PLO 2016 E RYBNIK" Grupa 5',
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
      category: "C2",
      order: 6,

      competitions: [
        {
          id: "4af98b9d-c1d7-4035-8004-10b5b8bb7724",
          name: 'Rybnik: C2 Trampkarz "PLTM 2013 A RYBNIK" Grupa 1',
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
      category: "B1",
      order: 7,

      competitions: [
        {
          id: "9cbb2f52-b187-4f56-8d49-a4f4ea51829c",
          name: 'Rybnik: B1 Junior Młodszy "PLJM 2010 RYBNIK" Grupa 1',
          category: "League",
          label: "Liga",
        },
      ],
    },

    {
      id: "seniorzy",
      name: "KS Górnik Radlin",
      slug: "seniorzy",
      description: "Terminarz drużyny Seniorów",
      source: "Łączy Nas Piłka",
      teamId: "b7c6e3a3-088b-4185-be3a-3f748a99b40c",
      category: "Klasa okręgowa",
      order: 8,

      competitions: [
        {
          id: "359dce4b-6ade-4766-af21-b26d473ca3d8",
          name: 'Rybnik: Klasa okręgowa "III Liga Śląska Rybnik - Racibórz" Grupa 3',
          category: "League",
          label: "Liga",
        },
        {
          id: "b514ad6b-1f70-4c84-b560-5b4f7a893758",
          name: 'Puchar Polski "POLTENT PUCHAR POLSKI PODOKRĘG RYBNIK"',
          category: "Championship",
          label: "Puchar Polski",
          stages: [
            {
              id: "47e534ff-2881-44de-b8b2-3901afe6d33f",
              name: "III RUNDA",
            },
            {
              id: "3ac0fe72-937c-417c-9475-bf5d42f6a2c5",
              name: "IV RUNDA",
            },
          ],
        },
      ],
    },

    {
      id: "seniorzyII",
      name: "KS Górnik Radlin II",
      slug: "seniorzy-ii",
      description: "Terminarz drużyny Seniorów II",
      source: "Łączy Nas Piłka",
      teamId: "f2d19c24-b939-4ce0-b8cf-2b048488f030",
      category: "Klasa B",
      order: 9,

      competitions: [
        {
          id: "c9cda44d-6dee-43f9-99dc-e0caeb902303",
          name: 'Rybnik: Klasa B "Grupa 1 RYBNIK"',
          category: "League",
          label: "Liga",
        },
        {
          id: "b514ad6b-1f70-4c84-b560-5b4f7a893758",
          name: 'Puchar Polski "POLTENT PUCHAR POLSKI PODOKRĘG RYBNIK"',
          category: "Championship",
          label: "Puchar Polski",
          stages: [
            {
              id: "7ce4eb99-eb60-4ebf-80a7-1d90c20a75f9",
              name: "I RUNDA",
            },
          ],
        },
      ],
    },
  ],
};
