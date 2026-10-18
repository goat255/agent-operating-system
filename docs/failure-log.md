# Failure log

Each entry is a real incident from running agents on production work, and the rule or mechanism it
produced. Kept because the incidents are more informative than the rules: they show which failure
modes autonomous agents actually hit.

Across 65 logged corrections, the largest clusters were:

| Cluster | Count | What it looks like |
|---|---|---|
| False "done" claims | 14 | "It works" with no check after the last change |
| Wrong identity or target | 10 | Right action, wrong account, profile or client |
| Out-of-scope changes | 8 | Fixing something nobody asked to be touched |
| Skipping the authoritative playbook | 6 | Working a tool from memory and concluding "it cannot be done" |

## Evidence

**A scheduler's "succeeded" is not a run (4 to 6 Oct 2026).**
A usage limit made 16 consecutive scheduled runs exit within seconds. Both schedulers reported
success, so the dashboards stayed green while the deliverables were missing.
*Now:* a run counts only through validator output or a metric. A code-only watcher checks for the
deliverable itself, and a watchdog checks every slot for evidence within a grace window.

**A completion notice is not evidence (Aug 2026).**
A piped background install reported exit 0; the exit code was the pipe's, and the
install had failed.
*Now:* `pipefail` in every script; output is read, not inferred from the notice.

**A dry run is not a readiness check (Aug 2026).**
A dry run reported "ready" against a server-side lock it had no way to see.
*Now:* "ready" is never claimed from a dry run, and every write is followed by a re-read of the
real state.

**Installed is not running (Aug 2026).**
A job was reported as running three times in one day when it was only installed.
*Now:* "running" must name what triggers the job and when it last fired.

## Configuration

**Jobs ran on a model nobody chose (15 Oct 2026).**
Desktop jobs created without an explicit model fell back to a cheaper default.
*Now:* model and effort are chosen per job by the capability it needs (mechanical work, customer-facing
writing, money or research), set explicitly, and read back after creation.

**Rewrites drop keys (recurring).**
A configuration rewrite silently removed a deploy secret; an unattended tool repriced 84 of 88
products.
*Now:* a hook diffs rewrites and reports removed keys; pricing is a gated action in every loop that
can reach it.

## Execution

**Editing a script while it runs (8 Oct 2026).**
Shell reads a script as it executes. An in-place edit crashed a long-running render.
*Now:* write a new file and swap it in atomically.

**A blocked send is destroyed, not deferred (Aug 2026).**
A message blocked by quiet hours was dropped.
*Now:* blocked sends are scheduled for the end of quiet hours.

**Unattended sessions still stopped for prompts.**
Long-running sessions stalled on confirmation prompts triggered by command shapes such as
recursive deletes with variables, nested shells and desktop scripting.
*Now:* those shapes are banned in every agent brief, which removed the prompts without widening
permissions.

## Secrets

**A transcript cannot be redacted (Aug 2026).**
A diagnostic command printed environment values into a session transcript.
*Now:* rotation is the only remedy, verified by count. Commands that print environments or
secret values are banned; secrets are read from the keychain by name and piped to the consumer.

**Piping a secret into an interpreter's stdin executes it (Jul 2026).**
`python3 -` treats stdin as the script, so a piped key was executed and echoed in the error.
*Now:* that pattern is banned outright.
