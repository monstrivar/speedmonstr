---
name: newclient
description: Onboard a new Monstr client — gather info, create config, provision Airtable, set up SMS automation
---

# New Client Onboarding

You are onboarding a new client for Monstr (speed-to-lead platform). Walk through the process step by step using AskUserQuestion with selection options wherever possible.

IMPORTANT: All Norwegian text (SMS templates, field labels, etc.) MUST preserve Norwegian characters (æ, ø, å) exactly. Never strip or replace them.

## Step 1: Basic info

Use AskUserQuestion to ask for the business type first:

Question 1 (header: "Business type"):
- Plumber (Rørlegger)
- Electrician (Elektriker)
- Painter (Maler)
- Carpenter (Snekker)
- Other (let them type)

Then ask for each piece of info one at a time using AskUserQuestion. Since AskUserQuestion requires at least 2 options, provide example/placeholder options that guide the user — they can always use "Other" to type their own value.

Question 2 (header: "Bedriftsnavn"):
"What is the business name?"
- Example: "Olsen Rør AS" (description: "Use Other to type the real name")
- Example: "Berg Elektro" (description: "Use Other to type the real name")

Question 3 (header: "Kontakt"):
"Who is the main contact person?"
- Example: "Ola Nordmann" (description: "Use Other to type the real name")
- Example: "Kari Hansen" (description: "Use Other to type the real name")

Question 4 (header: "E-post"):
"What is the contact email?"
- Example: "ola@firma.no" (description: "Use Other to type the real email")
- Example: "post@firma.no" (description: "Use Other to type the real email")

Question 5 (header: "Telefon"):
"What is the contact phone number?"
- Example: "91234567" (description: "Use Other to type the real number")
- Example: "47654321" (description: "Use Other to type the real number")

Question 6 (header: "Nettside"):
"What is their website? (optional — skip with any option if none)"
- No website (description: "Skip this field")
- Example: "www.firma.no" (description: "Use Other to type the real URL")

Question 7 (header: "Org.nr"):
"What is the organization number? (optional — skip with any option if none)"
- No org number (description: "Skip this field")
- Example: "912345678" (description: "Use Other to type the real org number")

## Step 2: Sender ID and plan

Use AskUserQuestion:

Question 1 (header: "Plan"):
- Vekst (5 000 kr/mnd)
- Bedrift (10 000 kr/mnd)

Question 2 (header: "Sender ID"):
Ask them to provide the alphanumeric sender ID. Max 11 characters, no spaces — this is what appears as the SMS sender name. Suggest two options based on the business name (e.g. shortened versions). The user can pick one or type their own via "Other".

## Step 3: Form platform and field mapping

Use AskUserQuestion for the form platform only:

Question 1 (header: "Form platform"):
- WordPress / Contact Form 7
- WordPress / Gravity Forms
- Webflow
- Framer
- Typeform
- Custom / other

Then ask the user (as plain text, NOT AskUserQuestion) to list all the fields their contact form collects, and what the field names are in the webhook payload. Offer to figure it out from a sample payload if they have one. This varies too much per client for structured options — always collect this manually as free text.

## Step 4: SMS template

Show them the default SMS template and ask if they want to customize it:

Default:
```
Hei, {fornavn}! Takk for forespørselen! Du hører fra oss veldig snart.

Med vennlig hilsen,
{kontaktperson}
```

Available placeholders (any `{variable}` from the list below):

**Lead fields** (from the form submission):
`{fornavn}`, `{etternavn}`, `{epost}`, `{telefon}`, `{melding}`, `{selskap}`, `{nettside_lead}`
English aliases: `{first_name}`, `{last_name}`, `{email}`, `{phone}`, `{message}`, `{company}`

**Business fields** (from Aktive Bedrifter — set during onboarding):
`{bedriftsnavn}`, `{kontaktperson}`, `{kontakt_epost}`, `{kontakt_telefon}`, `{kontakt_nettside}`, `{bransje}`, `{plan}`, `{sender_id}`
English aliases: `{business_name}`, `{contact_person}`

Use AskUserQuestion:
- Use default template (Recommended)
- Customize template

IMPORTANT: The SMS template MUST always include proper Norwegian characters (ø, æ, å). Never output "foresporselen" — it's "forespørselen". Never output "horer" — it's "hører".

## Step 5: Create everything

This step provisions the client across the SMS Airtable base and creates the local config.

### A. SMS Base — Aktive Bedrifter table (client record)

Use the Airtable API token to create a record in the Aktive Bedrifter table:

- **Base:** SMS (`apppLbO2YqIMYWh3X`)
- **Table:** Aktive Bedrifter (`tblfjGVLv2krsNwQk`)
- **First**, generate a unique webhook key: `python3 -c "import secrets; print(secrets.token_urlsafe(32))"`
- **Fields to set:**
  - `fldRsvuQ8RzucyL8O` (Bedriftsnavn): {business name}
  - `fld2AtEDjubHknxkj` (Client ID): {client-id} (lowercase-hyphenated slug)
  - `fldn1FVhMemsmQqqc` (Kontaktperson): {contact person}
  - `fldXPOYVjNKvGclOL` (E-post): {contact email}
  - `fldkpdAmkAHStLHCU` (Telefon): {contact phone}
  - `fldhtY1Q5pnt5nunW` (Nettside): {website or empty}
  - `flduKA6iqRO7oZJDO` (Bransje): {business type in Norwegian}
  - `fldduzJCh19SmsxlP` (Sender ID): {chosen sender ID}
  - `fldDaV7Cyl2ANBjdC` (Plan): {Vekst or Bedrift}
  - `fld5N1bXzlLJS1bAU` (Status): "Onboarding"
  - `fldISMaIeKH3E5LA0` (Onboardet): {current date/time ISO}
  - `fld6D1ZOvOU1JtZHa` (SMS Mal): {SMS template text}
  - `fld1x4jHGu38oi1H4` (Webhook Key): {generated unique key}

Use this curl command pattern to create the record:
```bash
curl -s -X POST "https://api.airtable.com/v0/apppLbO2YqIMYWh3X/tblfjGVLv2krsNwQk" \
  -H "Authorization: Bearer {AIRTABLE_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{"fields": { ... }}'
```

The Airtable token: first run `source .env` to load environment variables, then use $AIRTABLE_TOKEN. If still not available, ask the user for it.

### B. Client config file

Create `clients/{client-id}.md` based on `clients/_template.md`. Fill in all fields including:
- The SMS base record ID (from step A) so we can reference it
- The webhook URL: `https://monstr.no/api/webhook?client={client-id}&key={webhook-key}`
- All field mappings from step 3
- SMS Logg table ID: `tblKQIg7SIGS91HAV`
- Aktive Bedrifter table ID: `tblfjGVLv2krsNwQk`

### C. Set status to Active

After everything is created, update the Aktive Bedrifter record status from "Onboarding" to "Aktiv":
```bash
curl -s -X PATCH "https://api.airtable.com/v0/apppLbO2YqIMYWh3X/tblfjGVLv2krsNwQk/{record-id}" \
  -H "Authorization: Bearer {AIRTABLE_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{"fields": {"fld5N1bXzlLJS1bAU": "Aktiv"}}'
```

### D. Send test webhook

After status is set to Active, send a test POST to verify the full flow works end-to-end:
```bash
curl -s -X POST "https://monstr.no/api/webhook?client={client-id}&key={webhook-key}" \
  -H "Content-Type: application/json" \
  -d '{"Fornavn": "Test", "Telefonnummer": "+4700000000", "Beskjed": "Testmelding fra onboarding"}'
```
Check the response for `{"success": true}`. If it fails, debug before showing the summary.

## Step 6: Summary

Show a summary of everything that was set up:
- Client name and ID
- Webhook URL: `https://monstr.no/api/webhook?client={client-id}&key={webhook-key}`
- Sender ID (what the SMS will come from)
- SMS template (with proper Norwegian characters!)
- Airtable: added to Aktive Bedrifter (SMS base), record ID
- Form field mapping

**What happens automatically from now on:**
1. Client's form sends data to the webhook URL
2. Webhook looks up the client in Aktive Bedrifter → gets their Sender ID + SMS template
3. SMS is sent via Twilio with the client's business name as sender
4. Lead is logged to SMS Logg table (`tblKQIg7SIGS91HAV`), linked to the company
5. Any extra/unknown form fields are captured in "Ekstra data" so nothing is lost
6. Telegram notification is sent to Monstr team

**The business contact also receives a notification SMS** from "Monstr" whenever a lead comes in. This SMS lists all the form fields, e.g.:

```
Ny henvendelse i skjema!

Fornavn: Ola
Etternavn: Nordmann
Telefonnummer: 912 34 567
Beskjed: Trenger hjelp med rør i kjelleren
```

This is sent to the phone number in the "Telefon" field in Aktive Bedrifter — the contact person's mobile. No extra setup needed; it happens automatically.

Tell the user what the client/their web dev needs to do: set the webhook URL (which includes the key) as the form's POST endpoint. No headers needed — the key is in the URL.

## Airtable reference IDs

| Resource | ID |
|----------|-----|
| SMS Base | `apppLbO2YqIMYWh3X` |
| Aktive Bedrifter table | `tblfjGVLv2krsNwQk` |
| SMS Logg table | `tblKQIg7SIGS91HAV` |

### Aktive Bedrifter field IDs

| Field | ID |
|-------|-----|
| Bedriftsnavn | `fldRsvuQ8RzucyL8O` |
| Client ID | `fld2AtEDjubHknxkj` |
| Kontaktperson | `fldn1FVhMemsmQqqc` |
| E-post | `fldXPOYVjNKvGclOL` |
| Telefon | `fldkpdAmkAHStLHCU` |
| Nettside | `fldhtY1Q5pnt5nunW` |
| Bransje | `flduKA6iqRO7oZJDO` |
| Sender ID | `fldduzJCh19SmsxlP` |
| Plan | `fldDaV7Cyl2ANBjdC` |
| Status | `fld5N1bXzlLJS1bAU` |
| Onboardet | `fldISMaIeKH3E5LA0` |
| SMS Mal | `fld6D1ZOvOU1JtZHa` |
| Notater | `fldrnWs105nzY5rPu` |
| Webhook Key | `fld1x4jHGu38oi1H4` |
| SMS Logg (link) | `fldFFwIN5KNzfOEef` |
