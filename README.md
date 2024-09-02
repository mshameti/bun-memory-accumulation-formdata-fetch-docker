### Minimal reproduction of issue involving memory accumulation and a subsequent crash using Bun 1.1.26 running in a container.

Conditions for this to occur:

- Running in a containerized environment.
- Repeatedly sending FormData as request bodies in fetch().

Node included for comparison that shows no memory accumulation.

### Potentially Related:

https://github.com/oven-sh/bun/issues/5507
https://github.com/oven-sh/bun/pull/7470

### Run with:

LEAK=1 docker compose up --build

OR

LEAK=2 docker compose up --build

See terminal for logs of memory accumulation.

## Attributions

This project uses third-party images. For detailed attribution information, please see the [ATTRIBUTIONS.md](ATTRIBUTIONS.md) file.
