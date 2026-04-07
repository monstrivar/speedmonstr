# Monstr AS

> Client ID: `monstr-as`
> Status: **Setup** | Ready | Active | Paused

## Business info

| Field | Value |
|-------|-------|
| Business name | Monstr AS |
| Org number | 933378179 |
| Business type | AIByrå |
| Contact person | Ivar Knutsen |
| Contact email | ivar@monstr.no |
| Contact phone | 90707902 |
| Website | monstr.no |

## Monstr config

| Field | Value |
|-------|-------|
| Sender ID | Monstr |
| SMS template | See below |
| Webhook URL | `https://monstr.no/api/webhook?client=monstr-as` |
| Airtable base ID | apppLbO2YqIMYWh3X (SMS base) |
| SMS Logg table ID | tblKQIg7SIGS91HAV |
| Aktive Bedrifter table ID | tblfjGVLv2krsNwQk |
| SMS base record ID | recBBLlvxm5RQT5Jc |
| Plan | Owner |
| Onboarded | 2026-04-06 |

## SMS template

```
Hei, {fornavn}! Takk for forespørselen! Du hører fra oss veldig snart.

Med vennlig hilsen,
{kontaktperson}
```

## Notification SMS (to business owner)

Sent automatically to contact phone (90707902) from "Monstr" when a lead arrives:

```
Ny henvendelse i skjema!

Fornavn: {value}
Etternavn: {value}
Telefonnummer: {value}
...all form fields listed
```

## Form field mapping

Source platform: Custom

| Webhook field name | Monstr standard field | Notes |
|-------------------|----------------------|-------|
| fornavn | `first_name` | |
| etternavn | `last_name` | |
| bedrift | `company` | |
| telefonnummer | `phone` | |
| e-post | `email` | |
| nettside | `website` | |
| henvendelser_per_mnd | `monthly_inquiries` | Single select |
| henvendelser_kilde | `inquiry_sources` | Multiple choice |
| oppfolging_prosess | `followup_process` | Single select |
| kundeverdi | `customer_value` | Single select |

### Raw payload example

```json
// No sample payload yet — field names are assumed from form labels
```

## Notes

- Test client (our own platform)
- Airtable fully provisioned: Aktive Bedrifter record recBBLlvxm5RQT5Jc, status Aktiv
- SMS Logg in SMS base is the leads/log table
