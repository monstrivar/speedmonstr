# Client Onboarding

This folder contains one `.md` file per Monstr client. Each file is the single source of truth for that client's configuration — webhook setup, form field mapping, Twilio sender ID, and Airtable references.

## How to onboard a new client

Tell Claude: **"We got a new client"** — and provide whatever info you have. Claude will ask follow-up questions to fill in the gaps, then:

1. Create the client config file in this folder
2. Create/configure the Airtable base and table (via MCP)
3. Provide the webhook URL and setup instructions
4. Verify the integration works

## What Claude needs to know

| Field | Required | Example |
|-------|----------|---------|
| Business name | Yes | Rørlegger Hansen AS |
| Contact person | Yes | Ole Hansen |
| Contact email | Yes | ole@hansen-ror.no |
| Contact phone | Yes | +47 912 34 567 |
| Business type | Yes | Plumber / Electrician / Painter / etc. |
| Alphanumeric sender ID | Yes | HansenRor (max 11 chars, no spaces) |
| Website | No | hansen-ror.no |
| Form platform | Yes | WordPress / Gravity Forms / Webflow / custom / etc. |
| Form fields | Yes | See field mapping below |

## Form field mapping

Every client's contact form is different. We need to know what fields they collect and what the field names are in their webhook payload. Claude will ask about this and map them to Monstr's standard fields:

### Monstr standard fields

| Standard field | Type | Required | Description |
|---------------|------|----------|-------------|
| `first_name` | string | Yes | Customer first name |
| `last_name` | string | No | Customer last name |
| `phone` | string | Yes | Customer phone (for SMS + callback) |
| `email` | string | No | Customer email |
| `message` | string | No | What they need help with |
| `address` | string | No | Service address |
| `service_type` | string | No | Type of service requested |
| `images` | array | No | Photos attached to the form |
| `source` | string | Auto | Which form/page the lead came from |

### Example mapping

A client using Gravity Forms might send:
```json
{
  "input_1": "Kari",        → first_name
  "input_2": "Nordmann",    → last_name
  "input_3": "kari@mail.no",→ email
  "input_5": "91234567",    → phone
  "input_7": "Lekkasje...", → message
}
```

Claude stores this mapping in the client's config file so the webhook knows how to parse it.

## Webhook URL format

Each client gets a unique webhook URL:
```
https://monstr.no/api/webhook?client={client_id}
```

The client (or their web developer) adds this URL as the form's webhook/notification endpoint.

## File naming convention

`{client-id}.md` — lowercase, hyphenated. Example: `hansen-ror.md`
