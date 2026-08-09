# Presenton (vendored for Hex)

Upstream: [presenton/presenton](https://github.com/presenton/presenton) (Apache 2.0).

Hex runs this as a Docker sidecar for AI presentation generation:

```bash
pnpm presenton:up   # uses ../../docker-compose.presenton.yml
```

See the repo root `.env.example` for `PRESENTON_*` and LLM keys. Hex UI lives at `/create/presentation`; the sidecar API is proxied via `src/app/api/presenton/generate`.

This directory is a trimmed vendor copy: marketing assets and upstream CI were removed; runtime code (`servers/`, `templates/`, `static/icons/`, Docker files) is kept for local builds.
