export type TeamKey = "zaki" | "trampkarze" | "seniorzy";

export const teamConfig = {
  zaki: {
    name: "Żaki",
    playId: "",
  },

  trampkarze: {
    name: "Trampkarze",
    playId: "4af98b9d-c1d7-4035-8004-10b5b8bb7724",
  },

  seniorzy: {
    name: "Seniorzy",
    playId: "359dce4b-6ade-4766-af21-b26d473ca3d8",
  },
} satisfies Record<
  TeamKey,
  {
    name: string;
    playId: string;
  }
>;
