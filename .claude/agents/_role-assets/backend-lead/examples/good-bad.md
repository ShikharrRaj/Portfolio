# Backend Lead — Good vs Bad API code (on-demand)

## Task: a document search endpoint

### ✅ GOOD
```ts
// thin controller → service; validated input; authz first; scoped query
const SearchQuery = z.object({ q: z.string().min(1), k: z.number().int().max(50).default(10) });

@Get('/search')
async search(@Req() req, @Query() raw: unknown) {
  const user = requireUser(req);                       // authz, fail closed (AR-10)
  const { q, k } = SearchQuery.parse(raw);             // validate at edge (CS-06)
  return this.searchService.search({ userId: user.id, q, k }); // scoped to principal (AR-05)
}
```
`searchService` holds the logic (no framework types); results match the published `api-contract`; errors map to
a stable taxonomy. A new index for this query is handed to `database`, not written here.
Why good: thin controller (no FM-1); input validated (CS-06); authz + principal-scoped (AR-10, AR-05);
contract-conformant; migration/index handed off correctly.

### ❌ BAD
```ts
@Get('/search')
async search(@Query('q') q: string) {
  const rows = await this.prisma.$queryRawUnsafe(`SELECT * FROM chunks WHERE text LIKE '%${q}%'`); // injection + no authz
  await this.prisma.$executeRaw`CREATE INDEX ...`;      // FM-5: tuning is database's job
  return rows;                                          // FM-2 unvalidated, FM-3 no authz, leaks all users' data
}
```
Why bad: raw-string SQL = injection + unvalidated input (FM-2); no authz, returns every user's data (FM-3 →
security-critical); creates an index inline (FM-5 → hand to `database`); no contract conformance. Fails
security review and DoD.
