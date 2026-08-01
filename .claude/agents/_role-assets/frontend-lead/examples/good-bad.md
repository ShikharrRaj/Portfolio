# Frontend Lead — Good vs Bad UI code (on-demand)

## Task: a document search results list

### ✅ GOOD
```tsx
// Presentational, prop-driven, all states, tokens only (per UI-01/03/08)
function SearchResults({ status, results }: SearchResultsProps) {
  if (status === 'loading') return <ResultsSkeleton />;              // loading
  if (status === 'error')   return <ErrorState onRetry={refetch} />; // error + recovery
  if (results.length === 0) return <EmptyState hint="Try another term" />; // empty, actionable
  return (
    <ul className="flex flex-col gap-2">                              {/* token spacing, not [8px] */}
      {results.map((r) => <SearchResultRow key={r.id} result={r} />)}
    </ul>
  );
}
```
Data-fetching lives in a container/hook that calls only the `api-contract`; `SearchResults` is pure.
Why good: four states covered (UI-03); tokens not arbitrary values (UI-02); stateless + prop-driven (UI-08);
keyed list; consumes typed contract shapes.

### ❌ BAD
```tsx
function SearchResults() {
  const [data, setData] = useState([]);
  useEffect(() => { fetch('/internal/db/search?q=' + q).then(r => r.json()).then(setData); }, []); // FM-4 backend reach-around
  return <div style={{ gap: '8px' }}>                                  {/* FM-2 hardcoded */}
    {data.map((r) => <div>{r.title}</div>)}                            {/* no key; no states (FM-1) */}
  </div>;
}
```
Why bad: calls a non-contract internal endpoint (FM-4 → should BLOCK to backend-lead); hardcoded style (FM-2);
no loading/empty/error (FM-1); missing keys; business/data logic in the view (FM-3). Fails review and DoD.
