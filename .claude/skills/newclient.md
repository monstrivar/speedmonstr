---
name: newclient
description: Onboard a new Monstr client — gather info, create config, provision Airtable, set up SMS automation
---

# New Client Onboarding

You are onboarding a new client for Monstr (speed-to-lead platform). Walk through the process step by step using AskUserQuestion with selection options wherever possible.

IMPORTANT: All Norwegian text (SMS templates, field labels, etc.) MUST preserve Norwegian characters (æ, ø, å) exactly. Never strip or replace them.

## Step 0: Pull from Airtable lead list (optional but recommended)

Before asking manual questions, check if we already have data from the lead list.

Use AskUserQuestion:

Question (header: "Pull from Airtable?"):
- Yes — search the lead list (description: "Pre-fill from B&A 10-50M table")
- No — enter everything manually

If **Yes**:

1. Ask for the business name (free text via AskUserQuestion)
2. Search the **B&A 10-50M** table in the Monstr base for a matching record:

```bash
# Search by business name (use AIRTABLE_TOKEN from env)
source .env 2>/dev/null
curl -s "https://api.airtable.com/v0/appM5wdT9AbJ1YRCy/tblbfTAp2R1p9Dafe?filterByFormula=SEARCH(LOWER(%22{search_term}%22)%2CLOWER(%7BBedriftsnavn%7D))&maxRecords=5" \
  -H "Authorization: Bearer $AIRTABLE_TOKEN" | python3 -m json.tool
```

3. If multiple matches, use AskUserQuestion to let the user pick the right one.

4. Extract all available fields from the matched record:

| B&A 10-50M field | Field ID | Maps to |
|-----------------|----------|---------|
| Bedriftsnavn | `fld3WHFnHNWbtiUW2` | Business name |
| DL Fornavn | `fld704SdVk79pPcpw` | Contact first name |
| DL Etternavn | `fld4PrFeeutuEDAOY` | Contact last name |
| Mobilnumer | `flddaR9mV9wngpmwy` | Contact phone (fallback) |
| Bransje | `fldGc1fYpKSLWUEmr` | Business type |
| Mobilnummer du vil få varsel på | `flduDK0qoHW40HlsN` | Notification phone (preferred) |
| Hvem er ansvarlig for nettsiden | `fldCA9VlKnAfiplXz` | Web responsibility |
| Navn på eksterne | `fld4FUzbKYDYwaS3w` | External web person name |
| Mobilnummer på eksterne | `fldiexq4z4sfFIlMk` | External web person phone |
| Epost på eksterne | `fldEnJ8zMeC1ybC0p` | External web person email |
| Navn på kollega | `fldqpJLs4MVhVmkS7` | Colleague name |
| Mobilnummer på kollega | `fld5BqDp8jnOnB8GB` | Colleague phone |

5. Also save the **Airtable record ID** from the lead list — useful for updating Sales Stage later.

6. Show the user what was found and what's still needed. Skip any Step 1/2 questions that are already answered. The user can override any pre-filled value.

**Airtable reference for lead list:**
- Base: Monstr (`appM5wdT9AbJ1YRCy`)
- Table: B&A 10-50M (`tblbfTAp2R1p9Dafe`)
- Sales Stage field: `fldGfMGAJg28JwGDs` — update to "Trial - Setup (Green)" after onboarding

## Step 1: Basic info

Skip any questions already answered from Step 0.

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

Question 1 (header: "Kohort og pris"):
Ask the user which cohort the client falls into based on current active client count. Reference docs/salg/PRISMODELL.md for the pricing ladder:
- Kohort 1 (kunde 1–5): 2 999 kr/mnd
- Kohort 2 (kunde 6–10): 3 599 kr/mnd
- Kohort 3 (kunde 11–15): 4 319 kr/mnd
- Kohort 4 (kunde 16–20): 5 183 kr/mnd
- Kohort 5 (kunde 21–25): 6 219 kr/mnd
- Kohort 6 (kunde 26–30): 7 463 kr/mnd

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
- Lovable
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

### A. Generate webhook key

Generate a unique webhook key:
```bash
python3 -c "import secrets; print(secrets.token_urlsafe(32))"
```

Save this — it's used in steps B, C, and the webhook URL.

### B. SMS Base — Aktive Bedrifter table (client record)

Create a record in the Aktive Bedrifter table. **IMPORTANT: Use Ivar's phone number (+4790707902) as Telefon initially** — this routes all test notifications to Ivar, not the client. The real client phone is set after verification in Step 6.

- **Base:** SMS (`apppLbO2YqIMYWh3X`)
- **Table:** Aktive Bedrifter (`tblfjGVLv2krsNwQk`)
- **Fields to set:**
  - `fldRsvuQ8RzucyL8O` (Bedriftsnavn): {business name}
  - `fld2AtEDjubHknxkj` (Client ID): {client-id} (lowercase-hyphenated slug)
  - `fldn1FVhMemsmQqqc` (Kontaktperson): {contact person}
  - `fldXPOYVjNKvGclOL` (E-post): {contact email}
  - `fldkpdAmkAHStLHCU` (Telefon): **+4790707902** (Ivar's number — temporary for testing)
  - `fldhtY1Q5pnt5nunW` (Nettside): {website or empty}
  - `flduKA6iqRO7oZJDO` (Bransje): {business type in Norwegian}
  - `fldduzJCh19SmsxlP` (Sender ID): {chosen sender ID}
  - `fldDaV7Cyl2ANBjdC` (Plan): {kohort number, e.g. "Kohort 1 — 2 999 kr/mnd"}
  - `fld5N1bXzlLJS1bAU` (Status): "Onboarding"
  - `fldISMaIeKH3E5LA0` (Onboardet): {current date/time ISO}
  - `fld6D1ZOvOU1JtZHa` (SMS Mal): {SMS template text}
  - `fld1x4jHGu38oi1H4` (Webhook Key): {generated key from step A}

Use this curl command pattern to create the record:
```bash
curl -s -X POST "https://api.airtable.com/v0/apppLbO2YqIMYWh3X/tblfjGVLv2krsNwQk" \
  -H "Authorization: Bearer $AIRTABLE_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"fields": { ... }}'
```

The Airtable token: first run `source .env` to load environment variables, then use $AIRTABLE_TOKEN. If still not available, ask the user for it.

### C. Client config file

Create `clients/{client-id}.md` based on `clients/_template.md`. Fill in all fields including:
- The SMS base record ID (from step B) so we can reference it
- The webhook URL: `https://monstr.no/api/webhook?client={client-id}&key={webhook-key}`
- All field mappings from step 3
- SMS Logg table ID: `tblKQIg7SIGS91HAV`
- Aktive Bedrifter table ID: `tblfjGVLv2krsNwQk`
- Note the real client phone number in the Notes section (to be set after testing)

## Step 6: Verification — test the full flow

This step sends a test through the REAL webhook to verify everything works end-to-end. Both SMSes go to Ivar's phone — the client never sees test data.

### Send test webhook

```bash
curl -s -X POST "https://monstr.no/api/webhook?client={client-id}&key={webhook-key}" \
  -H "Content-Type: application/json" \
  -d '{"fornavn": "Test", "etternavn": "Testesen", "telefon": "+4790707902", "beskjed": "Testmelding fra onboarding — alt fungerer!"}'
```

**What should happen:**
1. Customer SMS → sent to +4790707902 (Ivar) with the client's Sender ID and SMS template
2. Notification SMS → sent to +4790707902 (Ivar, because Telefon is temporarily his number) from "Monstr" with lead details
3. SMS Logg → new record created in Airtable, linked to the client's Aktive Bedrifter record

**Check the response:** should be `{"success": true, "smsStatus": "Sendt", ...}`

Ask the user: **"Did you receive both SMSes? Check your phone."**

Use AskUserQuestion:
- Yes, both arrived! (description: "Proceed to activate")
- Only one arrived (description: "Debug which one failed")
- Neither arrived (description: "Debug the full flow")

### If verification passes:

1. **Update Telefon to the real client phone number:**
```bash
curl -s -X PATCH "https://api.airtable.com/v0/apppLbO2YqIMYWh3X/tblfjGVLv2krsNwQk/{record-id}" \
  -H "Authorization: Bearer $AIRTABLE_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"fields": {"fldkpdAmkAHStLHCU": "{real-client-phone}"}}'
```

2. **Set status to Active:**
```bash
curl -s -X PATCH "https://api.airtable.com/v0/apppLbO2YqIMYWh3X/tblfjGVLv2krsNwQk/{record-id}" \
  -H "Authorization: Bearer $AIRTABLE_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"fields": {"fld5N1bXzlLJS1bAU": "Aktiv"}}'
```

3. **Delete the test record from SMS Logg** (the test lead):
Use the leadId from the webhook response to delete it so the client's SMS Logg starts clean.
```bash
curl -s -X DELETE "https://api.airtable.com/v0/apppLbO2YqIMYWh3X/tblKQIg7SIGS91HAV/{test-lead-id}" \
  -H "Authorization: Bearer $AIRTABLE_TOKEN"
```

4. **Update lead list Sales Stage** (if pulled from Airtable in Step 0):
```bash
curl -s -X PATCH "https://api.airtable.com/v0/appM5wdT9AbJ1YRCy/tblbfTAp2R1p9Dafe/{lead-record-id}" \
  -H "Authorization: Bearer $AIRTABLE_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"fields": {"fldGfMGAJg28JwGDs": "Trial - Setup (Green)"}}'
```

### If verification fails:

Debug by checking:
- Is the client record in Aktive Bedrifter? (correct Client ID, Webhook Key set?)
- Does the webhook URL match exactly?
- Is the Sender ID valid (alphanumeric, max 11 chars)?
- Are Twilio env vars set on Vercel?

## Step 7: Summary

Show a summary of everything that was set up:
- Client name and ID
- Webhook URL: `https://monstr.no/api/webhook?client={client-id}&key={webhook-key}`
- Sender ID (what the SMS will come from)
- SMS template (with proper Norwegian characters!)
- Airtable: added to Aktive Bedrifter (SMS base), record ID
- Form field mapping
- Verification: PASSED / FAILED
- Web responsibility: who needs to add the webhook (from onboarding form data)

**If web responsibility is known from Step 0:**
- "Jeg" (business owner): They need guidance — offer to help on a call
- "En kollega": Show colleague name + phone from onboarding data — the user can forward webhook URL to them
- "Eksterne" (external agency): Show external contact name + phone + email — the user can forward webhook URL to them

**What happens automatically from now on:**
1. Client's form sends data to the webhook URL
2. Webhook looks up the client in Aktive Bedrifter → gets their Sender ID + SMS template
3. SMS is sent via Twilio with the client's business name as sender
4. Lead is logged to SMS Logg table (`tblKQIg7SIGS91HAV`), linked to the company
5. Any extra/unknown form fields are captured in "Ekstra data" so nothing is lost
6. Business owner receives a notification SMS from "Monstr" with all lead details

Tell the user what the client/their web dev needs to do: set the webhook URL (which includes the key) as the form's POST endpoint. No headers needed — the key is in the URL.

## Airtable reference IDs

### SMS Base (client config + lead log)

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

### Monstr Base (lead list)

| Resource | ID |
|----------|-----|
| Monstr Base | `appM5wdT9AbJ1YRCy` |
| B&A 10-50M table | `tblbfTAp2R1p9Dafe` |

### B&A 10-50M field IDs (for pre-filling)

| Field | ID |
|-------|-----|
| Bedriftsnavn | `fld3WHFnHNWbtiUW2` |
| DL Fornavn | `fld704SdVk79pPcpw` |
| DL Etternavn | `fld4PrFeeutuEDAOY` |
| Mobilnumer | `flddaR9mV9wngpmwy` |
| Bransje | `fldGc1fYpKSLWUEmr` |
| Mobilnummer du vil få varsel på | `flduDK0qoHW40HlsN` |
| Hvem er ansvarlig for nettsiden | `fldCA9VlKnAfiplXz` |
| Navn på eksterne | `fld4FUzbKYDYwaS3w` |
| Mobilnummer på eksterne | `fldiexq4z4sfFIlMk` |
| Epost på eksterne | `fldEnJ8zMeC1ybC0p` |
| Navn på kollega | `fldqpJLs4MVhVmkS7` |
| Mobilnummer på kollega | `fld5BqDp8jnOnB8GB` |
| Sales Stage | `fldGfMGAJg28JwGDs` |
