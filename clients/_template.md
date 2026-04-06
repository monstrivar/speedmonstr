# {Business Name}

> Client ID: `{client-id}`
> Status: **Setup** | Ready | Active | Paused

## Business info

| Field | Value |
|-------|-------|
| Business name | |
| Org number | |
| Business type | |
| Contact person | |
| Contact email | |
| Contact phone | |
| Website | |

## Monstr config

| Field | Value |
|-------|-------|
| Sender ID | _(max 11 chars, alphanumeric, no spaces)_ |
| SMS template | See below |
| Webhook URL | `https://monstr.no/api/webhook?client={client-id}&key={webhook-key}` |
| Airtable base ID | apppLbO2YqIMYWh3X |
| Aktive Bedrifter table ID | tblfjGVLv2krsNwQk |
| SMS Logg table ID | tblKQIg7SIGS91HAV |
| SMS base record ID | _{Aktive Bedrifter record ID from SMS base}_ |
| Plan | Vekst / Bedrift |
| Onboarded | YYYY-MM-DD |

## SMS template

```
Hei {fornavn},
takk for henvendelsen.

Vi har mottatt den og tar kontakt med deg veldig snart.

Med vennlig hilsen, {bedriftsnavn}
```

## Form field mapping

Source platform: _(WordPress / Gravity Forms / Webflow / Typeform / custom)_

| Webhook field name | Monstr standard field | Notes |
|-------------------|----------------------|-------|
| | `first_name` | |
| | `last_name` | |
| | `phone` | |
| | `email` | |
| | `message` | |
| | `address` | |
| | `service_type` | |
| | `images` | |

### Raw payload example

```json
// Paste a sample webhook payload here for reference
```

## Notes

-
