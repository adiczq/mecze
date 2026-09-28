import fs from "fs";

const inputFile = process.argv[2];
const outputFile = process.argv[3];

if (!inputFile || !outputFile) {
  console.log(
    "Użycie: node scripts/import-matches.mjs input.json output.json"
  );
  process.exit(1);
}

const raw = fs.readFileSync(inputFile, "utf8");
const data = JSON.parse(raw);

// Obsługa obu formatów:
// 1. zwykła tablica meczów
// 2. tablica kolejek: [{ queue: 5, matches: [...] }]
let sourceMatches = [];

if (Array.isArray(data)) {
  const hasQueues = data.some((item) => Array.isArray(item?.matches));

  if (hasQueues) {
    sourceMatches = data.flatMap((item) => item.matches ?? []);
  } else {
    sourceMatches = data;
  }
} else if (Array.isArray(data.matches)) {
  sourceMatches = data.matches;
} else if (Array.isArray(data.items)) {
  sourceMatches = data.items;
}

if (!sourceMatches.length) {
  throw new Error("Nie udało się znaleźć meczów w JSON-ie.");
}

const now = new Date();

const matches = sourceMatches
  .filter((match) => {
    if (!match.dateTime) return false;

    const matchDate = new Date(match.dateTime);

    const homeTeam = match.host?.name?.toUpperCase() ?? "";
    const awayTeam = match.guest?.name?.toUpperCase() ?? "";

    const isGornikRadlin =
      homeTeam.includes("GÓRNIK RADLIN") ||
      awayTeam.includes("GÓRNIK RADLIN");

    return matchDate >= now && isGornikRadlin;
  })
  .sort(
    (a, b) =>
      new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime()
  )
  .map((match) => ({
    id: match.matchId,

    date: match.dateTime.split("T")[0],

    time: match.dateTime.includes("T")
      ? match.dateTime.split("T")[1].slice(0, 5)
      : undefined,

    homeTeam: match.host?.name ?? "Brak danych",

    awayTeam: match.guest?.name ?? "Brak danych",

    venue: match.stadium || undefined,

    round:
      match.queue !== undefined ? `Kolejka ${match.queue}` : undefined,

    source: "Łączy Nas Piłka",
  }));

fs.writeFileSync(outputFile, JSON.stringify(matches, null, 2), "utf8");

console.log(`✅ Znaleziono ${sourceMatches.length} wszystkich meczów.`);
console.log(
  `✅ Zapisano ${matches.length} przyszłych meczów Górnika Radlin.`
);
console.log(`📁 ${outputFile}`);
