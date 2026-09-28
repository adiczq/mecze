# Górnik Radlin – Mecze

Prosta strona z terminarzem najbliższych meczów:

- Żaków
- Trampkarzy
- Seniorów

Dane są pobierane ręcznie ze źródłowych stron rozgrywek, a następnie przetwarzane przez importer.

## Aktualizacja terminarzy

### 1. Pobierz aktualne dane

Dla każdej drużyny otwórz stronę rozgrywek i w DevTools:

1. Otwórz `Network`
2. Znajdź request `matches`
3. Otwórz `Response`
4. Skopiuj cały JSON

Wklej dane do odpowiedniego pliku:

```
zaki-raw.json
trampkarze-raw.json
seniorzy-raw.json
```
