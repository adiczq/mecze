import type { ArchiveSeason } from "./types";

export const season2022_2023: ArchiveSeason = {
  season: "2022/2023",

  teams: [
    {
      id: "seniorzy",
      name: "Seniorzy",
      teamId: "8e495ef3-5e1d-4d70-834c-973b40db3156",
      category: "Klasa okręgowa",

      competitions: [
        {
          id: "e274d857-16b8-4e13-a668-f1eb18364fad",
          name: 'Rybnik: Klasa okręgowa "Rybnik-Racibórz" Grupa 3',
          category: "League",
          label: "Liga",
        },
        {
          id: "87d816fd-704d-4938-ab87-284898beecd3",
          name: 'Puchar Polski "POLTENT PODOKRĘG RYBNIK"',
          category: "Championship",
          label: "Puchar Polski",
          stages: [
            {
              id: "e3e94a7c-1ae8-4776-bafe-067a8d0b7d84",
              name: "I Runda",
            },
            {
              id: "f916e7dd-0c30-4d96-8851-8dad00133142",
              name: "II Runda",
            },
            {
              id: "00a150fd-dcc5-4199-98cb-333f8482c649",
              name: "III Runda",
            },
            {
              id: "fd07c8ae-2733-41d9-bc6b-0254fe6454ff",
              name: "1/2 Finału",
            },
          ],
        },
      ],
    },

    {
      id: "seniorzy-ii",
      name: "Seniorzy II",
      teamId: "a1ff467b-f6bd-49b8-9440-1bd8e54afe1b",
      category: "Klasa C",

      competitions: [
        {
          id: "d7efcd4a-a7c8-4fe8-8fa3-9a94fe176a71",
          name: "Rybnik: Klasa C",
          category: "League",
          label: "Liga",
        },
      ],
    },

    {
      id: "c1",
      name: "Trampkarze 2008",
      teamId: "31aa8cd7-8d75-4145-9882-1c31d1e50f70",
      category: "C1",

      competitions: [
        {
          id: "eef8fc1b-f142-43d2-86b9-be0a07ff8cd7",
          name: "II liga wojewódzka C1 Trampkarz Grupa płd.",
          category: "League",
          label: "Jesień",
        },
        {
          id: "90f39500-766b-4177-bc48-78ae906022db",
          name: 'III liga wojewódzka C1 Trampkarz "WLT 2008 RYBNIK WIOSNA" Grupa 3',
          category: "League",
          label: "Wiosna",
          teamId: "c7cf6a0a-b9ae-4183-bdce-2c690dfbbc1e",
        },
      ],
    },

    {
      id: "d1",
      name: "Młodziki 2010",
      teamId: "6bb96685-1063-4a5a-a066-172778ad1a98",
      category: "D1",

      competitions: [
        {
          id: "220c8210-e02e-4838-843f-18172cdab5b2",
          name: 'Rybnik: D1 Młodzik "PLM 2010 C RYBNIK" Grupa 3',
          category: "League",
          label: "Jesień",
        },
        {
          id: "4338026b-cbc4-4c41-be65-8c14a8cb91af",
          name: 'Rybnik: D1 Młodzik "PLM 2010 C RYBNIK WIOSNA" Grupa 3',
          category: "League",
          label: "Wiosna",
        },
      ],
    },

    {
      id: "d2",
      name: "Młodziki 2011",
      teamId: "175562b1-eac9-4c9e-b1e3-78ad2e63ad09",
      category: "D2",

      competitions: [
        {
          id: "9817c444-2208-44b4-9e28-3d0366271672",
          name: 'Rybnik: D2 Młodzik "PLMM 2011 E RYBNIK" Grupa 5',
          category: "League",
          label: "Jesień",
        },
        {
          id: "92f800f7-160d-4c81-9064-6d568866c526",
          name: 'Rybnik: D2 Młodzik "PLMM 2011 D RYBNIK WIOSNA" Grupa 4',
          category: "League",
          label: "Wiosna",
          teamId: "40ae6c3f-5d4f-4fd2-ab89-132f3dc72801",
        },
      ],
    },
  ],
};
