# private-assets/

Files kept out of `public/` so they are **not** deployed or publicly fetchable.

Nothing here is served. Move a file back into `public/projects/<folder>/` only
after it has been sanitised.

## ticketing/details.png

A "Super Admin Ticket List" screenshot. Every ticket card carries an employee
name and employee ID (ticket owner, on-behalf creator, solver), plus internal
building and floor locations.

It was never referenced from `src/data/portfolio.ts`, but while it sat in
`public/` it was still fetchable at `/projects/ticketing/details.png` — where no
render-time mask could protect it.

**To use it:** re-capture the screen with demo data, then place the new file in
`public/projects/ticketing/` and add it to the project's `images` array.
