# Claude-verktøykassen

**Tre Skills som gjør Claude til din — ikke bare en generisk chatbot.**

Laget av Monstr AI for foredraget "Fra leke til arbeidskraft" — april 2026.

---

## Hva er en Skill?

En Skill er en tekstfil med instrukser du gir Claude én gang. Den definerer *hvordan* Claude skal jobbe — tonefall, format, hva den skal gjøre og ikke gjøre. Tenk på det som en håndbok for en ny medarbeider.

Når Skillen er på plass, bruker Claude den automatisk hver gang den er relevant. Du trenger aldri forklare det igjen.

---

## Slik bruker du dem

### I Claude.ai (enklest)
1. Gå til [claude.ai](https://claude.ai)
2. Opprett et nytt **Project** (eller åpne et eksisterende)
3. Klikk på **tannhjulet** (prosjektinnstillinger)
4. Under **"Custom Instructions"** — lim inn innholdet fra én av filene
5. Ferdig. Claude bruker instruksjonene automatisk i dette prosjektet.

> **Tips:** Du kan ha én Skill per Project, eller kombinere flere i samme. Start med én — legg til flere etterhvert.

### I Claude Code (for utviklere)
1. Lagre filen som `.claude/skills/[navn]/SKILL.md` i prosjektet
2. Claude Code oppdager den automatisk

---

## Filene

| Fil | Hva den gjør | Når du bruker den |
|-----|-------------|-------------------|
| `01-møtereferat-beslutninger.md` | Gjør kaotiske møtenotater til skarpe beslutningsdokumenter med eierskap og frister | Etter hvert møte |
| `02-dokumentknuseren.md` | Analyserer hva som helst — rapport, kontrakt, policy, e-post-tråd — og trekker ut det som betyr noe | Når du har et dokument du ikke har tid til å lese ordentlig |
| `03-frontend-design.md` | Bygger nettsider, landing pages, og UI-komponenter fra en beskrivelse | Når du vil lage noe visuelt uten designer |

---

## Tips for å gjøre dem til dine

Disse Skillene fungerer ut av boksen, men de blir *mye* sterkere med kontekst. Legg til i prosjektinstruksjonene:

```
Min rolle: [din tittel]
Min bedrift: [bedriftsnavn, kort beskrivelse]
Bransje: [bransjen din]
Det viktigste for meg: [hva du prioriterer — kostnad, tid, kvalitet, risiko?]
Tonefall: [formelt, uformelt, direkte, diplomatisk?]
```

Jo mer Claude vet om deg, jo mindre generisk blir output.

---

## Spørsmål?

**Ivar André Knutsen**
907 07 902 · ivar@monstr.no · [monstr.no](https://monstr.no)

Vi holder workshops der vi tar hele teamet ditt gjennom Claude — tilpasset deres bedrift. Snakk med oss.
