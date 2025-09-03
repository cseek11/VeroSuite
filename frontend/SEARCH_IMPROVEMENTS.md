# Search Improvements: Fuzzy & Suggestions

## Feature Flags
- VITE_ENABLE_FUZZY: enable fuzzy search RPC usage
- VITE_ENABLE_SUGGESTIONS: enable suggestion RPC usage

## Backend RPCs
- search_customers_fuzzy(uuid p_tenant_id, text p_query, double precision p_threshold, int p_limit)
- get_search_suggestions(uuid p_tenant_id, text p_query, int p_limit)

## Indexes (recommended)
Run `frontend/scripts/fuzzy_trgm_indexes.sql` in Supabase to add trigram indexes:
- name, email, address, city, state, zip_code (GIN, gin_trgm_ops)

## Threshold Tuning
- Start p_threshold = 0.30; evaluate false positives, adjust 0.25–0.35
- Keep limit ≤ 50; order by relevance desc, name asc

### Pros/Cons of 0.30
- Pros: balanced recall; catches common typos without flooding results; good default for small/medium datasets
- Cons: can admit mild false positives on noisy address fields; on very short queries (2–3 chars) may feel permissive

### When to adjust
- Lower to 0.25–0.29 if users report missed typo hits; small datasets where extra matches are cheap
- Raise to 0.31–0.35 if you see loose matches or precision complaints; large datasets impacting p95 latency

### Guardrails
- Require min query length ≥ 3 for fuzzy
- Blend exact phone-digit matches to outrank fuzzy text
- Cap results to 50 and monitor false-positive rate in analytics

## Frontend
- Flags read in `src/lib/config.ts` (window.appConfig in dev)
- Services: `advanced-search-service.ts` uses RPCs when flags are true, with fallbacks
- UI: `components/search/AdvancedSearchBar.tsx` has mode selector and suggestions dropdown

### Where to change the fuzzy threshold
- Primary (recommended): in `frontend/src/hooks/useAdvancedSearch.ts`, the default option `fuzzyThreshold = 0.3`. Updating this changes what the frontend passes to the RPC.
- Alternative (per-call): plumb a `fuzzyThreshold` prop into `AdvancedSearchBar` and pass through to `useAdvancedSearch` if you want UI-level control.
- Backend default: `frontend/scripts/search_customers_fuzzy.sql` defines `p_threshold double precision DEFAULT 0.3`. Changing this updates the DB default used when the client doesn’t pass an override.

## Validation
- Ensure tenant isolation in all RPCs (p_tenant_id filter)
- Monitor p95 latency: suggestions < 100ms; fuzzy < 200ms (current dataset)




