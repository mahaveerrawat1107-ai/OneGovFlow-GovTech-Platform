---
name: Supabase MCP runtime
description: How the connected Supabase project is used by OneGovFlow across agent tooling and browser runtime.
---

The selected Supabase connection is an MCP connection for project administration and SQL operations. It does not provide an application SDK client directly to the API server. Browser-safe persistence uses the project's Data API with its public URL and publishable key, while privileged operations stay in MCP or server-side integrations.

**Why:** The connected integration is mounted as MCP tools, so treating it like a normal server-side connector would create a non-working runtime path or expose privileged credentials.

**How to apply:** Use MCP to provision or inspect Supabase tables and policies. Use publishable-key Data API calls for public client preferences only when RLS policies are explicitly scoped; move account-bound data to authenticated user policies when Supabase Auth is added.