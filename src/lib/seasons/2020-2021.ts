import type { ArchiveSeason } from "./types";

export const season2020_2021: ArchiveSeason = {
  season: "2020/2021",

  teams: [
    {
      id: "seniorzy",
      name: "Seniorzy",
      teamId: "34d72877-c20a-4264-bdab-4b076ece47b1",
      category: "Klasa A",

      competitions: [
        {
          id: "dee0da69-7cea-4dd2-acd2-7204b4063390",
          name: 'Rybnik: Klasa A "FOOTBALL CENTER "',
          category: "League",
          label: "Liga",
        },
        {
          id: "4b24ef32-b2b0-42ed-9860-1ad10f18bf47",
          name: 'Puchar Polski "Podokręg RYBNIK"',
          category: "Championship",
          label: "Puchar Polski",
          stages: [
            {
              id: "bf69882d-adad-49f3-b48a-c50f8a5496e1",
              name: "RUNDA I",
            },
            {
              id: "bb379477-bf13-4f95-b0fe-76a245e79a00",
              name: "RUNDA II",
            },
          ],
        },
      ],
    },

    {
      id: "a1",
      name: "Juniorzy 2002",
      teamId: "60ea6fe1-a2c4-438c-8186-624d4996a0e0",
      category: "A1",

      competitions: [
        {
          id: "aab40d0f-2201-4977-843a-abeffb6f0acc",
          name: 'Rybnik: A1 Junior "PLJS 2002 RYBNIK"',
          category: "League",
          label: "Liga",
        },
      ],
    },

    {
      id: "c1",
      name: "Trampkarze 2006",
      teamId: "db574291-a261-4a39-bf3d-9bf9eb9b40fa",
      category: "C1",

      competitions: [
        {
          id: "8497d3be-c016-4dae-8d57-aef9610753cc",
          name: 'Rybnik: C1 Trampkarz "PLT 2006 A RYBNIK" Grupa 1',
          category: "League",
          label: "Jesień",
        },
        {
          id: "11dbe9b0-7ddf-42d6-9ca0-eb6464730ef9",
          name: 'Rybnik: C1 Trampkarz "PLT 2006 A Rybnik WIOSNA" Grupa 1 (RW)',
          category: "League",
          label: "Wiosna",
        },
      ],
    },

    {
      id: "d1",
      name: "Młodziki 2008",
      teamId: "b9954cd2-0326-4255-b2fd-044c510b67cc",
      category: "D1",

      competitions: [
        {
          id: "0f33dbbe-1595-4d51-8420-bd7ca56594cb",
          name: 'Rybnik: D1 Młodzik "PLM 2008 A RYBNIK" Grupa 1',
          category: "League",
          label: "Jesień",
        },
        {
          id: "620ce0ec-c48d-48be-835d-6fa7ff1ebcf6",
          name: 'Rybnik: D1 Młodzik "PLM 2008 A Rybnik WIOSNA" Grupa 1 (RW)',
          category: "League",
          label: "Wiosna",
        },
      ],
    },

    {
      id: "d2",
      name: "Młodziki 2009",
      teamId: "708d5ca4-6dc7-43fc-96cc-250d42819d5e",
      category: "D2",

      competitions: [
        {
          id: "f100ced8-e60a-4fc0-b368-93eca1d6dee3",
          name: 'Rybnik: D2 Młodzik "PLMM 2009 A RYBNIK" Grupa 1',
          category: "League",
          label: "Jesień",
        },
        {
          id: "5152f0b3-a922-4ebd-a914-10a19ccc4381",
          name: 'Rybnik: D2 Młodzik "PLMM 2009 A Rybnik WIOSNA" Grupa 1 (RW)',
          category: "League",
          label: "Wiosna",
        },
      ],
    },
  ],
};
