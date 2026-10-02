# Mecze Górnik Radlin

Aplikacja webowa do przeglądania terminarzy drużyn KS Górnik Radlin w jednym miejscu.

Projekt działa jako PWA, pobiera aktualne dane meczowe z oficjalnego API PZPN przez własne proxy z publicznym, stałym adresem IPv4 i posiada lokalne pliki JSON jako awaryjny fallback.

## Produkcja

- Aplikacja: `https://mecze.adiczq.dev`
- Proxy PZPN: `https://proxy.adiczq.dev`
- Hosting frontendu: Vercel
- Proxy/API: Hetzner Cloud VPS
- DNS: Cloudflare

## Technologie

- Next.js 16
- TypeScript
- Tailwind CSS
- React
- PWA / Service Worker
- Node.js + Express
- Caddy
- systemd
- Vercel
- Hetzner Cloud
- Cloudflare

## Architektura

```text
Użytkownik
    │
    ▼
mecze.adiczq.dev
Vercel / Next.js
    │
    │ x-proxy-secret
    ▼
proxy.adiczq.dev
Hetzner VPS / Express
    │
    │ PZPN_API_TOKEN
    │ stały IPv4 VPS
    ▼
Oficjalne API PZPN
```

Token PZPN nie jest przechowywany w aplikacji na Vercelu. Znajduje się wyłącznie na VPS-ie.

Proxy jest zabezpieczone osobnym sekretem przesyłanym w nagłówku:

```text
x-proxy-secret
```

## Źródło danych

Aplikacja pobiera terminarze z oficjalnego API PZPN:

```text
https://shared-api-ng.laczynaspilka.pl/api/lnp/shared/v1
```

Dla każdej drużyny wykorzystywany jest jej `playId`.

Proxy udostępnia między innymi:

```text
GET /health
GET /pzpn-test
GET /pzpn/plays/:playId/queues
GET /pzpn/plays/:playId/matches
```

Endpointy PZPN wymagają poprawnego `x-proxy-secret`.

Endpoint `/health` jest publiczny.

## Aktualizacja danych

Dane z PZPN są cache'owane przez Next.js:

```ts
next: {
  revalidate: 300,
}
```

Oznacza to maksymalnie około 5 minut cache.

Po wygaśnięciu cache pierwszy kolejny request pobiera świeże dane z PZPN.

Proxy dodaje do odpowiedzi nagłówek:

```text
x-data-updated-at
```

Dzięki temu aplikacja może pokazać rzeczywisty moment ostatniego pobrania danych z PZPN, zamiast czasu renderowania strony.

## Fallback

Jeżeli:

- proxy jest niedostępne,
- API PZPN zwróci błąd,
- brakuje konfiguracji drużyny,
- pobranie danych się nie powiedzie,

aplikacja korzysta z lokalnych plików JSON znajdujących się w:

```text
src/data/
```

Fallback pozostaje rozwiązaniem awaryjnym — podstawowym źródłem danych jest PZPN.

## Drużyny

Konfiguracja drużyn znajduje się w:

```text
src/lib/teams.ts
```

Każda drużyna posiada między innymi:

```ts
{
  name: "...",
  slug: "...",
  playId: "...",
  teamId: "...",
  order: 1
}
```

Aktualnie aplikacja obsługuje między innymi:

- Żaki 2019
- Żaki 2018
- Orlik 2017
- Orlik 2017 II
- Orlik 2016
- Trampkarze 2013
- Junior Młodszy 2010
- Seniorzy
- Seniorzy II

## Zmienne środowiskowe

### Lokalnie / Vercel

Plik lokalny:

```text
.env.local
```

Wymagane zmienne:

```env
PZPN_PROXY_URL=https://proxy.adiczq.dev
PROXY_SECRET=...
```

`.env.local` jest ignorowany przez Git i nie może być commitowany.

Sprawdzenie:

```powershell
git check-ignore .env.local
```

### VPS

Sekrety proxy znajdują się w:

```text
/etc/mecze-proxy.env
```

Przykładowa struktura:

```env
PZPN_API_TOKEN=...
PROXY_SECRET=...
PORT=3001
```

Plik powinien mieć uprawnienia:

```text
600
```

Sprawdzenie:

```bash
ls -l /etc/mecze-proxy.env
```

## Lokalny development

Instalacja zależności:

```powershell
npm install
```

Uruchomienie:

```powershell
npm run dev
```

Build:

```powershell
npm run build
```

Aplikacja lokalnie korzysta z tego samego proxy PZPN co produkcja.

## Deployment

Frontend wdrażany jest automatycznie przez Vercel po pushu do `main`.

Typowy workflow:

```powershell
npm run build
git status
git add .
git commit -m "Opis zmian"
git push
```

Przed `git add .` zawsze warto sprawdzić `git status`, aby upewnić się, że żaden sekret nie zostanie dodany do repozytorium.

## Proxy PZPN

Kod proxy znajduje się na VPS-ie w:

```text
/opt/mecze-proxy
```

Główny plik:

```text
/opt/mecze-proxy/server.js
```

Proxy działa jako usługa systemd:

```text
mecze-proxy.service
```

Status:

```bash
systemctl status mecze-proxy
```

Restart:

```bash
systemctl restart mecze-proxy
```

Logi:

```bash
journalctl -u mecze-proxy -n 100 --no-pager
```

Usługa jest włączona przy starcie systemu, więc działa również po restarcie VPS-a i po rozłączeniu SSH.

## HTTPS

HTTPS dla:

```text
proxy.adiczq.dev
```

obsługuje Caddy.

Konfiguracja:

```text
/etc/caddy/Caddyfile
```

Minimalna konfiguracja:

```caddy
proxy.adiczq.dev {
    reverse_proxy 127.0.0.1:3001
}
```

Sprawdzenie konfiguracji:

```bash
caddy validate --config /etc/caddy/Caddyfile
```

Status:

```bash
systemctl status caddy
```

## Test proxy

Publiczny healthcheck:

```powershell
curl.exe https://proxy.adiczq.dev/health
```

Oczekiwana odpowiedź:

```json
{
  "ok": true,
  "server": "mecze-proxy"
}
```

Endpoint PZPN bez sekretu powinien zwrócić:

```json
{
  "ok": false,
  "error": "Unauthorized"
}
```

Test z sekretem:

```powershell
curl.exe -H "x-proxy-secret: TWOJ_SEKRET" https://proxy.adiczq.dev/pzpn-test
```

Sekretu nie należy umieszczać w dokumentacji, commitach, issue ani logach publicznych.

## Diagnostyka produkcji

Po udanym pobraniu danych można tymczasowo użyć logu serwerowego:

```ts
console.log(`PZPN OK: ${team} - ${result.matches.length} meczów`);
```

Na produkcji log pojawi się w:

```text
Vercel → Project → Logs
```

Nie będzie widoczny w konsoli DevTools przeglądarki, ponieważ wykonuje się po stronie serwera.

## PWA

Aplikacja może być instalowana na urządzeniu jako PWA.

Najważniejsze pliki:

```text
public/manifest.webmanifest
public/sw.js
src/components/ServiceWorkerRegister.tsx
```

Na stronie dostępny jest przycisk instalacji PWA, gdy przeglądarka udostępni zdarzenie `beforeinstallprompt`.

## Bezpieczeństwo

Najważniejsze zasady:

- nie commitować `.env.local`,
- nie trzymać tokenu PZPN na Vercelu,
- nie wpisywać tokenu PZPN bezpośrednio do `server.js`,
- nie publikować `PROXY_SECRET`,
- po przypadkowym ujawnieniu sekretu wygenerować nowy,
- `PZPN_API_TOKEN` przechowywać tylko na VPS-ie,
- endpointy PZPN na proxy zabezpieczać `x-proxy-secret`,
- regularnie sprawdzać logi Vercela i VPS-a.

## Najważniejsze ścieżki

```text
src/lib/laczynaspilka.ts
src/lib/teams.ts
src/lib/types.ts
src/components/TeamSchedulePage.tsx
src/components/MatchList.tsx
src/data/
public/sw.js
public/manifest.webmanifest
```

## Autor

Projekt rozwijany przez **adiczq**.

`https://www.adiczq.dev`
