# 2026-11-15 — Apply independent-session changes (/about-me + repo fixes)

**Prompt (summary):** Apply the changes produced in an independent session
(`/about-me` landing page, hero scroll reveal, footer wording, hydration and
React 19 warning fixes, tests) onto a new branch off `develop`, verify they
work, and PR up the chain into `test` for the 11/20 release. The attached
`CODE_REVIEW.md` is reviewed in a follow-up step.

**Notes**

- Source files arrived with CRLF line endings; they were normalised to LF to
  match the repo, so the original `changes.diff` did not apply as-is.
- Verified: `yarn install --frozen-lockfile`, `tsc --noEmit`, `yarn test`
  (14 files, 68 tests), `api` tests (46), `yarn build`, and a browser smoke
  test of `/` and `/about-me` at mobile and desktop widths.
