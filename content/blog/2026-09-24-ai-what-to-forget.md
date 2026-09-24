---
title: What Should an AI Agent Be Allowed to Forget?
date: 2026-09-24
tags: [aiml, agents, research]
summary: Knowledge, skills, episodic history, and authority do not have the same lifecycle. A useful agent memory architecture should treat them differently.
project: https://github.com/juliagsy/harness-thsm/blob/main/paper/decay-without-creep.pdf

---

Forgetting sounds like the opposite of memory.

For an AI agent, it may actually be part of having a good memory.

A long-running agent cannot indefinitely accumulate every observation, intermediate result, old instruction, failed attempt, tool output, and generated note without eventually facing practical problems. Retrieval becomes harder. Context becomes larger. Old information can conflict with newer information. Storage grows.

This is why selective forgetting has become an important part of agent-memory research.

But there is a question that comes before deciding **how** to forget:

> What kind of thing are we forgetting?

That question is the focus of this post.

Our work on the Typed Harness State Model starts from the premise that an agent's persistent state should not be treated as one homogeneous collection of memories.

Different kinds of state have different meanings. And therefore they can have different lifecycles.

## Four kinds of state

We divide persistent harness state into four categories:

```text
EPI    Episodic state
SEM    Semantic state
PROC   Procedural state
DEON   Deontic state
```

The names are less important than the distinction.

### Episodic state: what happened?

Episodic state records events.

For example:

```text
The agent ran tests at 14:32.
The deployment failed.
The user changed the configuration.
The payment API returned an error.
```

These records are useful as historical evidence.

In our model, episodic entries are immutable and append-only. They form the event-sourced substrate from which other state can be derived. That makes them different from ordinary summaries. A summary can change.

An event record should not silently change because a memory writer decided that a different summary would be more convenient.

### Semantic state: what is believed to be true?

Semantic state represents derived knowledge.

For example:

```text
The service uses PostgreSQL.
The production environment is in region A.
The repository uses Python 3.12.
The procurement workflow requires two approvals above a threshold.
```

These facts can become stale. If the repository migrates from Python 3.12 to 3.13, an old fact should eventually be updated.

This is exactly the kind of state for which retrieval, consolidation, relevance scoring, and selective forgetting can make sense.

### Procedural state: how do I do something?

Procedural state contains skills or workflows.

For example:

```text
To deploy the application:
1. Run the tests.
2. Build the image.
3. Push the image.
4. Trigger deployment.
```

Procedures also have a lifecycle.

- A deployment workflow can change.

- A command can become obsolete.

- A skill can drift.

- A procedure can be replaced by a better procedure.

So procedural memory needs lifecycle management too.

Our model therefore allows PROC entries to decay and consolidate.

But there is one important restriction:

> A procedure does not carry authority.

A skill can describe how to perform an action. It cannot, by itself, establish that the agent is currently permitted to perform that action.

### Deontic state: what may I do?

Deontic state is different.

It describes permissions, prohibitions, revocations, and obligations.

In our model, these are represented as:

```text
GRANT
DENY
REVOKE
OBLIGE
```

- A grant might allow a specific tool and resource.

- A deny might prohibit it.

- A revoke can invalidate a previous grant.

- An obligation can require an action under specified conditions.

The important property is that deontic state determines authorization.

That gives it a fundamentally different role from ordinary knowledge.

## Why age is not enough

Consider these two memories:

```text
The service was deployed using version 4.2.
```

and:

```text
The agent is not authorized to deploy to production.
```

Both might have been written six months ago. Their age tells us almost nothing about whether they should be treated the same way.

- The first may be obsolete.

- The second may still be fully valid.

The same problem appears with access frequency.

- A fact about an obscure part of a repository may rarely be retrieved but remain useful.

- A prohibition may rarely be retrieved because nobody has attempted the prohibited action.

Low access frequency does not imply low authority.

This matters because many forgetting strategies use signals such as:

* time since last access;
* access frequency;
* semantic relevance;
* task usefulness;
* outcome value;
* redundancy.

Those signals can be reasonable indicators for memory utility. They are not automatically indicators of authorization validity.

## Selective forgetting is not the enemy

It is important not to draw the wrong conclusion.

The answer is not:

> “Never forget anything.”

That would throw away the advantages of selective memory.

Systems such as MemoryBank and FadeMem explicitly investigate mechanisms for retaining useful memories while allowing less useful information to fade. Other recent work studies selective forgetting as a way to control memory growth and improve efficiency.

The architectural lesson is narrower:

> **Do not assume that one forgetting policy should govern every type of state.**

A memory system can still forget aggressively. It just should not use the same operator on everything.

## A type-specific lifecycle

This gives us a simple picture:

```text
                     HARNESS STATE
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
       EPI                SEM                PROC
        │                  │                  │
    immutable          decayable          decayable
    event log         + consolidable      + consolidable
        │                  │                  │
        └──────────────────┴──────────────────┘

                         DEON
                          │
                 protected lifecycle
                          │
                provenance-backed change
                          │
                  deterministic gate
```

That separation is the core of THSM.

- Episodic history is retained as an evidence layer.

- Semantic knowledge can change.

- Procedures can change.

- Authority changes only through appropriate governance events.

## What does “protected” mean?

Protecting deontic state does not mean permissions can never change.

Permissions need to change. A user may grant access. Later, they may revoke it. A temporary permission may expire. A harness may narrow permissions after a mode change.

The distinction is between **changing authority** and **decaying authority**.

In THSM, a permission can disappear because an authorized event revoked or expired it. It does not disappear because a memory scorer decided that it was old.

Similarly, a new permission does not become effective simply because the model wrote a convincing note saying:

> “The user approved this.”

The source of authority matters.

## Provenance matters

Our integrity model assigns different trust levels to different sources.

Conceptually:

```text
UNTRUSTED < DERIVED < HARNESS < PRINCIPAL
```

1. External content and tool results are untrusted.

2. LLM-generated memory is derived.

3. Deterministic harness logic has harness-level integrity.

4. An authenticated principal is the trusted source for widening authority.

This does not mean that everything written by a model is useless.

Model-generated information can still be valuable as knowledge. It simply cannot become a trusted authorization event merely because it is stored in a memory database.

This distinction is particularly important because recent research has shown that persistent memory can itself become a source of authorization errors. In the authorization-laundering setting, a memory writer can produce spurious permission information that later influences an executor.

## Consolidation creates another risk

Forgetting is not the only problem.

Consolidation can also change meaning.

Imagine the event history:

```text
09:00  Principal grants deployment permission.
10:00  Agent deploys successfully.
11:00  Principal revokes deployment permission.
```

A summarizer might produce:

```text
The agent has permission to deploy.
```

The summary is shorter. It is also wrong. Nothing malicious had to happen. The summarizer simply compressed a sequence of events while losing a state transition.

This is why our architecture excludes DEON entries from ordinary consolidation.

The system may summarize the history.

- It may summarize the procedure.

- It may summarize knowledge derived from the history.

But the current authorization state is resolved separately.

## Skills need the same distinction

Procedures create another interesting case.

- Suppose an agent learned a deployment skill while it had permission to deploy.

- Later, the permission is revoked.

The skill itself may still be perfectly valid as a procedure.

- The commands may still work.

- The workflow may still be useful to someone who is authorized.

What changed was not the procedure.

What changed was whether the current agent is allowed to execute it.

Therefore:

```text
Skill:
“How to deploy”

Authority:
“May I deploy now?”
```

These are separate questions.

If they are combined, a durable skill can accidentally preserve stale authority.

Our experiments specifically tested this scenario and found that revoked skills could continue to drive unauthorized execution when there was no call-time authorization gate.

## Why retrieval should not decide authorization

There is another useful distinction:

```text
Retrieval asks:
“What information is relevant?”

Authorization asks:
“Is this action permitted?”
```

These are not the same computation.

- A retrieval system may rank a permission-related note highly.

- It may rank it poorly.

- It may retrieve both an old grant and a later revocation.

- It may retrieve neither.

None of these retrieval outcomes should determine the final authorization decision.

The authorization layer should have its own state and its own decision procedure.

## The role of the tool boundary

This leads to the final piece.

The agent proposes an action:

```text
run deployment command
```

The harness receives the request.

The harness resolves the current authority:

```text
Does the current DEON state authorize this action?
```

Only then does the tool execute.

- The model remains useful for planning and reasoning.

- The harness remains responsible for enforcement.

This is not a claim that models cannot reason about authorization. They clearly can, at least some of the time.

It is a claim about where the final security decision belongs.

## What we measured

Our benchmark was designed around this separation.

The scenarios contain changing facts, changing tasks, grants, revocations, denies, expirations, untrusted tool output, compaction, and session boundaries.

- We measure utility through knowledge and task-performance metrics.

- We measure authority separately through actual tool calls.

This matters because a model's answer to:

> “Are you allowed to do this?”

is not equivalent to the result of:

> “Did the system allow the tool call?”

The paper therefore reports both.

## The six invariants

The architecture is also expressed through six checkable properties:

1. **Monotone authority:** authority cannot widen without an authorized widening event.
2. **No laundering:** deontic state must have an appropriate provenance chain.
3. **Revocation permanence:** ordinary lossy operators cannot erase revocations or denies.
4. **Label monotonicity:** lower-integrity sources cannot manufacture higher-integrity authority.
5. **Skill/authority separation:** executing a procedure never bypasses authorization.
6. **Episodic immutability:** the event substrate is not rewritten by ordinary memory operations.

These are useful because they turn some safety questions into properties of the state-management system rather than properties we have to infer from model behavior.

## The broader design principle

The larger lesson is not that every agent needs exactly four memory types.

The more general principle is:

> **Persistent state should be typed according to the consequences of changing it.**

- If forgetting a fact merely makes the agent less informed, ordinary memory policies may be appropriate.

- If forgetting a procedure makes the agent less capable, a different lifecycle may be appropriate.

- If changing a state determines whether an action is permitted, that state deserves stronger provenance and enforcement guarantees.

That is the distinction we explore in the next post.

Because once authority is separated from ordinary memory, a surprising question remains:

> What happens when the model knows the rule perfectly — and still breaks it?
