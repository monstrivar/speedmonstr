# Rørlegger Liene

> Client ID: `rorlegger-liene`
> Status: **Setup** | Ready | Active | Paused

## Business info

| Field | Value |
|-------|-------|
| Business name | Rørlegger Liene |
| Org number | — |
| Business type | Rørlegger |
| Contact person | Kim-Jarle |
| Contact email | kim@liene-vvs.no |
| Contact phone | 90707902 |
| Website | liene-vvs.no |

## Monstr config

| Field | Value |
|-------|-------|
| Sender ID | LieneVVS |
| SMS template | See below |
| Webhook URL | `https://monstr.no/api/webhook?client=rorlegger-liene` |
| Airtable base ID | apppLbO2YqIMYWh3X (SMS base) |
| SMS Logg table ID | tblKQIg7SIGS91HAV |
| Aktive Bedrifter table ID | tblfjGVLv2krsNwQk |
| Kohort | 1 |
| Pris/mnd | 2 999 kr |
| Onboarded | 2026-04-05 |

## SMS template

```
Hei {fornavn},
takk for henvendelsen.

Vi har mottatt den og tar kontakt med deg veldig snart.

Med vennlig hilsen, Rørlegger Liene
```

## Form field mapping

Source platform: Vercel (custom form)

| Webhook field name | Monstr standard field | Notes |
|-------------------|----------------------|-------|
| fornavn | `first_name` | |
| etternavn | `last_name` | |
| epost | `email` | |
| mobil | `phone` | |
| beskjed | `message` | Long text field |

### Raw payload example

```json
// Paste a sample webhook payload here for reference
```

## Notes

-
