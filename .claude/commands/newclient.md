---
name: newclient
description: Onboard a new Monstr client — gather info, create config, provision Airtable
---

# New Client Onboarding

This command delegates to the full skill file. See `.claude/skills/newclient.md` for the complete onboarding flow.

Follow all steps in `.claude/skills/newclient.md` exactly — it contains:
- Step 0: Pull from Airtable lead list (pre-fill from B&A 10-50M)
- Step 1-4: Gather remaining info (business type, sender ID, form platform, SMS template)
- Step 5: Create everything (webhook key, Airtable record, client config file)
- Step 6: Verification (test webhook sends both SMSes to Ivar's phone)
- Step 7: Summary with next steps

Read and execute `.claude/skills/newclient.md` now.
