---
name: CRM decision - Airtable over custom backend
description: Decision to use Airtable for lead management instead of building a custom backend, with lead scoring and prioritization
type: project
---

Decided to use Airtable as the lead management/CRM backend rather than building custom infrastructure.

**Why:** Monstr is a service business at early stage — needs to validate before investing in custom tooling. Airtable provides views, sorting, filtering, formula-based lead scoring, and integrations (Make.com, Slack) out of the box. A custom backend would mean weeks of building admin UI, auth, database, and API before being able to sell.

**How to apply:** Wire the booking form to Airtable via serverless function. Build lead scoring with Airtable formula fields. Create filtered views for lead prioritization. Revisit if scaling past ~50 clients or needing real-time bidirectional CRM sync.
