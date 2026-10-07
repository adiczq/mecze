import type { ArchiveSeason } from "./types";

export const season2023_2024: ArchiveSeason = {
  season: "2023/2024",

  teams: [
    {
      id: "seniorzy",
      name: "KS Górnik Radlin",
      teamId: "7ca5642e-8aa2-4f79-afce-0110e39365f9",
      category: "Klasa okręgowa",

      competitions: [
        {
          id: "93b0139a-b261-4a94-b2ad-91702d263e45",
          name: 'Racibórz: Klasa okręgowa "Racibórz-Rybnik" Grupa 3',
          category: "League",
          label: "Liga",
        },
        {
          id: "fd569497-26ea-4227-9f98-533f9e5cc779",
          name: 'Puchar Polski "POLTENT PUCHAR POLSKI PODOKRĘG RYBNIK"',
          category: "Championship",
          label: "Puchar Polski",
          stages: [
            {
              id: "af190126-9ec7-4094-99fb-3b16b1777f95",
              name: "I RUNDA",
            },
            {
              id: "3a58d943-10cb-41b9-af2e-06bea49b1872",
              name: "II RUNDA",
            },
            {
              id: "f9c25e5c-dccd-453f-ba4b-b2f6184437fa",
              name: "III RUNDA",
            },
          ],
        },
      ],
    },

    {
      id: "seniorzy-ii",
      name: "KS Górnik Radlin II",
      teamId: "5ed9f490-e5fc-488c-8942-0f9bb509edfa",
      category: "Klasa C",

      competitions: [
        {
          id: "bbf7f86d-55f2-4213-b2d2-a05e442c1c63",
          name: 'Rybnik: Klasa C "KLASA C"',
          category: "League",
          label: "Liga",
        },
        {
          id: "fd569497-26ea-4227-9f98-533f9e5cc779",
          name: 'Puchar Polski "POLTENT PUCHAR POLSKI PODOKRĘG RYBNIK"',
          category: "Championship",
          label: "Puchar Polski",
          stages: [
            {
              id: "af190126-9ec7-4094-99fb-3b16b1777f95",
              name: "I RUNDA",
            },
          ],
        },
      ],
    },

    {
      id: "c1",
      name: "Trampkarze 2009",
      teamId: "a4aabeb3-a6c0-47bf-93d3-da135954b45d",
      category: "C1",

      competitions: [
        {
          id: "a6485e81-9734-4f61-937c-64e397022ff6",
          name: 'Rybnik: C1 Trampkarz "PLT 2009 RYBNIK wiosna" Grupa 1',
          category: "League",
          label: "Wiosna",
        },
        {
          id: "7346c27f-cac9-4fc7-a498-65a6067176a4",
          name: 'Rybnik: C1 Trampkarz "PLT 2009 RYBNIK" Grupa 1',
          category: "League",
          label: "Jesień",
        },
      ],
    },

    {
      id: "d1",
      name: "Młodziki 2011",
      teamId: "ab0f9fd0-d3d9-4640-870e-49c055cad5c8",
      category: "D1",

      competitions: [
        {
          id: "d2415849-ac1a-4803-9406-7a0b97692f92",
          name: 'Rybnik: D1 Młodzik "PLM 2011 C RYBNIK" Grupa 3',
          category: "League",
          label: "Jesień",
        },
        {
          id: "d15e2bd4-0250-4f66-9e9e-f21ca0560dee",
          name: 'Rybnik: D1 Młodzik "PLM 2011 B RYBNIK wiosna" Grupa 2',
          category: "League",
          label: "Wiosna",
          teamId: "d226b86d-ea93-4816-9298-89a7c2b4fdc8",
        },
      ],
    },

    {
      id: "d2",
      name: "Młodziki 2012",
      teamId: "a1c7214e-cf2d-4611-937f-bdfc8613f72d",
      category: "D2",

      competitions: [
        {
          id: "0537fc60-8d01-4b71-8f2f-c62f016e704d",
          name: 'III liga wojewódzka D2 Młodzik "WLMM 2012 RYBNIK wiosna" Grupa 3',
          category: "League",
          label: "Wiosna",
        },
        {
          id: "5010ab16-6ef4-4049-8c87-7787a235bfd5",
          name: 'III liga wojewódzka D2 Młodzik "WLMM 2012 RYBNIK" Grupa 3',
          category: "League",
          label: "Jesień",
        },
        {
          id: "627aa9b9-19ba-4299-93ad-03ab5be321c8",
          name: 'Racibórz: D2 Młodzik "KSSE Młodzieżowa Liga Futsalu U-12 PÓŁFINAŁ"',
          category: "League",
          label: "Futsal",
          teamId: "ecffbf07-ee89-4f4b-b8e0-746747a13c60",
        },
      ],
    },
  ],
};
