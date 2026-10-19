# Explainer video: script

`explainer.mp4`, 1920x1080, 1 minute 27 seconds, with narration (synthetic voice) and a light score.
Every figure matches the README; the source of each is listed under the line.

| Time | Narration | On screen | Source |
|---|---|---|---|
| 0:00 | In April 2026, one person's catalogue of data tools made 10 dollars in profit. | $10 on rolling digit tiles | The outcome table |
| 0:07 | In October, it is on pace for about 930 dollars a month. | Monthly profit bars April to October; October shows $509 so far and a dashed $930 pace | The outcome table, read 17 Oct 2026 |
| 0:11 | Since 18 July, AI agents have run it at full capacity, with no hires. | July ringed: "agents at full capacity from 18 Jul"; 0 hires | The outcome table |
| 0:17 | But the agents are not the interesting part. | Title | |
| 0:20 | The system that lets them work without doing damage is. | Serif line | |
| 0:24 | First, contracts. Every agent job lists what it may never do alone. 50 actions across 7 loops, from deploys to deletes to prices. | A trimmed loop contract with its `forbidden_without_gate` list; 50 | Section 2 |
| 0:34 | Second, isolation. API keys are injected by a network proxy, so they never enter the agent's machine. | Agent VM, proxy, service: the request leaves the VM without a key, the proxy adds the header | Section 3 |
| 0:42 | Third, the decision card. A risky step becomes a button that names its exact target. A human presses it, and can add a steer. | `assets/decision-card.png` (fictional values), the button ringed, a steer note typed | Section 4 |
| 0:50 | Each tap runs through an n8n workflow that logs it and rewrites the message. In the first week, 85 presses, 42 with a written steer. | The decision router workflow, the press branch outlined; then 85 and 42 | Section 4 |
| 1:00 | Fourth, evidence. Done means a check passed, not that the agent said so. | "Done." struck through beside a passing validator | Section 5 |
| 1:05 | That rule was learned the hard way. 65 corrections logged, and 14 were false done claims. | 65 dots, 14 lit | Section 5, `docs/failure-log.md` |
| 1:12 | The honest limit: this is one human approving, not a team of engineers. | One human. Not a team. | Section 9 |
| 1:17 | The agents were never the hard part. Deciding what they may do alone, and proving what they did, was. | The closing line, then the name card | |
