# Vitens Access Request Portal (Codex variant)

Een lichte webapplicatie (pure HTML/CSS/JS) die medewerkers helpt om snel Microsoft Visio licenties en SAP Purchase-to-Pay rollen aan te vragen.

## Functionaliteit

- 🔎 **Zoeken en filteren** in een vaste catalogus van Visio licenties en SAP P2P rollen.
- 🛒 **Winkelwagen** met overzicht van geselecteerde items en eenvoudig verwijderen.
- 🧑‍💼 **Formulier voor aanvrager** inclusief validatie en automatische opslag in `localStorage`.
- 🔁 **Modus switch** tussen demo (lokaal) en online (voor toekomstige GRC-koppeling).
- 🔔 **Notificaties** voor statusupdates (toegevoegd/verwijderd, validatiefouten, moduswissel).

## Projectstructuur

```text
.
├── index.html      # HTML-structuur en templates
├── styles.css      # Vitens-stijl en layout
├── app.js          # Businesslogica, state management en notificaties
└── README.md
```

## Snelle start

1. Clone de repository:
   ```bash
   git clone https://github.com/vocverl/vitens-access-request-app-codex.git
   ```
2. Open `index.html` in een browser (geen buildstap nodig).
3. Zoek op termen zoals "Visio" of "P2P" en voeg items toe aan de winkelwagen.
4. Vul het formulier in (verplichte velden worden automatisch gevalideerd) en dien de aanvraag in.

> In demo modus wordt de aanvraag alleen lokaal gelogd. Voor de online modus is een toekomstige koppeling met SAP GRC gepland.

## Modusbeheer

| Modus  | Beschrijving                                                                |
|--------|------------------------------------------------------------------------------|
| Demo   | Standaard. Aanvragen worden lokaal gesimuleerd en in de console gelogd.     |
| Online | Toekomstige integratie met SAP GRC (SOAP / API). Momenteel alleen mock flow. |

Je wisselt modus via de knop rechtsboven in de header.

## Roadmap / ideeën

- ✅ Veilig opslaan van formulierdata in `localStorage`.
- ⏳ Integratie met een echte backend voor SAP GRC access requests.
- ⏳ Externe catalogus (Excel of API) voor dynamische rollen en applicaties.
- ⏳ Unit tests (bijv. met Playwright of Jest + jsdom) voor zoek- en validatielogica.

## Bijdragen

Pull requests en issues zijn welkom. Richtlijnen:
- Houd het project dependency-free (HTML/CSS/JS zonder bundler).
- Gebruik consistente Vitens-stijlelementen en Nederlandse copy.
- Test in demo modus voordat je een PR indient.

## Licentie

MIT-licentie. Zie [LICENSE](LICENSE) (nog toe te voegen indien gewenst).
