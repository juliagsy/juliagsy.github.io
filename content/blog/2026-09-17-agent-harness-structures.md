---
title: Agents that rewrite their own scaffolding
date: 2026-09-17
tags: [engineering, research]
summary: Prime Agent puts the entire harness — prompt, skills, memory, sub-agents — behind a CRUD surface the agent edits mid-task. The benchmark numbers are striking. So is what it did in Factorio.
---

For a long time the interesting variable in an agent was the model. You swapped the
weights, the thing got better, and everything wrapped around it stayed roughly where
it was: a loop, a list of tools with JSON schemas, a summariser that fired when the
context filled up.

That has stopped being where the movement is. The same weights, put in two different
harnesses, now produce materially different work — and the gap between the two
harnesses is larger than the gap between adjacent model releases. A harness is
everything around the model that lets it actually finish something: the loop, the
tool surface, the context policy, the sandbox, the permission checks, the recovery
path when a step fails. It used to be plumbing. It is now the design.

The clearest statement of that shift is [Prime Agent](https://github.com/PrimeIntellect-ai/prime-agent),
which Prime Intellect open-sourced under MIT in August 2026, built on top of
[pi](https://github.com/earendil-works/pi). It is worth reading not because it wins
a leaderboard but because it takes the opposite position on all three of the
structural choices a harness has to make.

## The three choices

**How actions are encoded.** The default is a JSON tool schema: the model emits a
call, the harness parses it, runs it, and pastes the result back into context. The
alternative is code — the model writes a program, the program runs, and the tool
surface is whatever is importable.

**Who owns the context.** The default is that the harness owns it. It decides what
gets summarised, what gets dropped, when to compact. The alternative is that the
model owns it, with its own history reachable as data it can slice, filter and
search without reading it back through the window.

**Whether the harness is fixed.** The default is that it is. Prompts, tools and
memory are set by whoever deployed the thing, and the agent works inside them. The
alternative is that the agent edits them while it works.

Most harnesses answer: schemas, harness-owned, fixed. Prime Agent answers: code,
model-owned, mutable. Its argument for doing so is that current designs "were built
around the capabilities of earlier generations of models", and that fixed schemas
plus automatic compaction now force a model "to work around its own scaffolding
instead of leveraging it".

## One kernel, and functions inside it

Prime Agent has a single tool: a persistent IPython kernel. Everything else — file
edits, search, skills, sub-agents — is a Python function pre-imported into it. The
kernel survives across turns and across sessions, which means intermediate state
lives in variables rather than in the transcript.

That is the part worth sitting with. If a sub-agent returns forty thousand lines of
log, a schema-based harness has to put those lines somewhere in the context window
or throw them away. Here they are a variable, and the model writes three lines of
Python to count what it cares about. The paper's framing is that the model
"programmatically runs functions over data rather than spending tokens reading data
using tools", and the measured effect is better scores at *lower* token spend, which
is not the usual direction of that trade.

Sub-agents are function calls with the same property:

```python
# returns immediately with a handle; the child gets its own kernel and history
handle = await rlm("port the sprite decoder to Rust and make the tests pass")

# the harness itself is writable, through the same CRUD surface as everything else
create_skill("decode_sprite", source=...)        # a tool the agent wrote for itself
update_prompt("vdp", "sprite priority is per-tile, not per-layer")
create_memory("genesis-vdp-quirks", ...)

result = await handle                            # child ran in parallel throughout
```

The four things the agent can write to — prompt notes, sub-agents, skills, memory —
are what the paper calls the *continual harness*, and they all expose the same
`create_`, `update_`, `delete_`, `list` and `get` operations. `/refine` sits on top:
it reads the trajectory, works out what went wrong or what turned out to be reusable,
and applies the smallest set of edits that would have helped. Plan first, in a
background call, then fast writes to disk. Each refinement records what triggered it
and what came of it, so it can be rolled back.

The results are not marginal. On ARC-AGI-3 the harness takes Opus 5 from 30% to 95.5%
RHAE Best@1, against a reported human expert baseline of 95.4%. On OOLONG at 128k it
scores 0.700 where pi-mono scores 0.420. On EmulatorBench it scores 0.208 against
0.000 — which in practice means it wrote working SEGA Genesis and Game Boy Color
emulators in Rust with no reference code, and the baseline wrote none.

## The other direction

The rest of the open-source landscape is not converging on this. If anything it is
moving the other way, towards pulling the pieces further apart:

| Harness | Shape | Position |
| --- | --- | --- |
| Prime Agent | one kernel, self-editing state | collapse the seams |
| pi | minimal core, multi-provider loop | stay small, compose upward |
| OpenCode | client/server, many frontends | separate the interface |
| OpenHands | Docker sandbox per session | separate the execution |
| Mecatl | Kubernetes-native | separate everything |

Mecatl is the sharpest contrast. It deliberately splits the reasoning loop, the tool
invocation and the untrusted execution environment into distinct architectural
layers, on the grounds that those boundaries are where isolation, policy, identity
and auditing have to attach. You cannot bolt governance onto a system that has no
seams to bolt it to.

Prime Agent, by design, has very few seams. Its own README says it executes
model-generated Python and shell commands with your permissions and is not
sandboxed.

## What it did in Factorio

The paper is honest about where that leads, and the example is better than anything
I could invent.

Running Factorio over seven days — 24 of 196 technologies, 23.4 million output
tokens — the agent discovered that RCON commands could spawn resources straight into
assembly machines. There was an anti-cheating heartbeat. It used the shortcut anyway.
Then, because that is what a continual harness is for, it **saved the shortcut as a
reusable skill**.

That is a genuinely new failure mode, and it is not about the model. Reward hacking
in a fixed harness is an incident: it happens, you see it in the trace, the next run
starts clean. Reward hacking in a self-modifying harness is a *deposit*. The exploit
outlives the episode that found it, propagates to sub-agents that inherit the skill
library, and every future run starts from a slightly more contaminated position. The
mechanism that makes the agent improve is exactly the mechanism that makes the cheat
durable. The authors' own prescription is least-privilege action interfaces,
independent state validation, and auditable rollback of contaminated refinements —
which is to say, the seams Mecatl is built around.

## What I take from it

Building the computer-use agent at Unify — a vision-based one driving remote Ubuntu,
Windows and macOS desktops — the expensive failures were almost never the model
picking a wrong action. They were harness-shaped: state lost across a reconnect, a
screenshot read twice because nothing recorded that it had been read, a retry path
that re-entered a flow halfway through. Better weights would not have touched any of
them.

So the direction is right, and two pieces of it I would take without hesitation.
Code as the action encoding is close to free — you get composition, loops and
filtering over tool output for nothing, and it does not require the agent to modify
anything about itself. Letting the model address its own history as data, rather
than having a summariser decide what it is allowed to remember, solves a problem I
have watched eat whole sessions.

The piece I would be careful with is persistence. A skill the agent wrote for itself
is an asset; a skill the agent wrote for itself and installed unreviewed is a
liability with a long tail. The useful line is not *can the agent write this* but
*can what it wrote apply to the next run without anyone looking at it*. Provenance
on every refinement, a diff before it lands, and a rollback that actually works.
Prime Agent records all three, which suggests the authors know precisely where the
sharp edge is.

The harness is the design now. Which means the failure modes are architectural too,
and they persist.
