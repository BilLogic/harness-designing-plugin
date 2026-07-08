# The repo lived in $HOME for six weeks

- **Date:** 2026-07-08
- **Severity:** high (silent, compounding)
- **Rule candidate:** yes

## What happened

This repo's primary worktree was `/Users/billguo` — the `.git` directory sat at `$HOME/.git`, with ~220 payload files strewn across the home folder and 24 linked worktrees hanging off it, several created inside *unrelated* project folders (uno-blueprint, Greenhouse, keystone-proto-market). Any AI session opened in a directory without its own repo resolved upward to `$HOME` and silently "became" this repo — branches for at least one unrelated project (Parsnip iOS, `claude/goofy-raman`) were created here. One personal file (`Desktop/Vibe Coding/Lightning/README.md`) was committed into the repo. A stale `index.lock` from **May 29** additionally blocked every git write to the primary tree for six weeks, unnoticed.

## Fix (2026-07-08)

Untracked the personal file (`cd835353`) → moved `.git` to `~/Documents/Claude/Projects/harness-designing-plugin/` → materialized the `main` checkout there → repaired all 24 worktree pointers (batch `git worktree repair` fixed only some; the rest needed their `.git` files rewritten from `.git/worktrees/<id>/gitdir` records) → deleted the 219 payload files from `$HOME` after byte-comparing each against the repo.

## Lessons

1. **A repo rooted at `$HOME` converts every non-repo directory on the machine into "this repo".** Git resolves upward; the blast radius is the whole filesystem. Before creating a worktree or committing, verify `git rev-parse --show-toplevel` is where you think it is.
2. **A stale `index.lock` fails silently and indefinitely** — six weeks of blocked writes surfaced as vague "git is messed up" pain, never as an error anyone read. A health check (or any guard) that can fail without being seen is worse than none — same lesson as plus-uno's `validate-doc-links.sh`.
3. **Batch `git worktree repair` is not exhaustive** after a primary-worktree move — verify every worktree with `rev-parse` afterward and rewrite survivors' `.git` files from the admin `gitdir` records.

## Rule candidate

Session-start check: `git rev-parse --show-toplevel` must equal the intended project root; if it resolves to `$HOME` or a parent of the project, stop and flag before any git operation.
