---
title: When AI Memory Forgets the Wrong Thing
date: 2026-09-22
tags: [aiml, agents, research]
summary: Why long-running AI agents need to forget some information without forgetting the authority constraints that govern what they are allowed to do.
project: https://github.com/juliagsy/harness-thsm/blob/main/paper/decay-without-creep.pdf
---

### Long-running AI agents need memory.

A coding agent may need to remember how a repository is structured. An assistant may need to remember facts established several conversations ago. An autonomous workflow may need to retain procedures that it has learned to execute repeatedly.

But once an agent has enough memory, another problem appears: not everything should be remembered forever.

Old information becomes stale. Preferences change. Procedures become obsolete. Temporary context becomes irrelevant. A memory system that retains everything indefinitely can become expensive, noisy, and less useful.

That has led to an increasingly important question in agent design:

> How should an AI agent forget?

At first glance, this sounds like a straightforward optimization problem. Keep information that is useful and discard information that is not. But there is a category of information for which that rule is dangerous.

That category is **authority**.

### Memory is not all the same

Consider three things an agent might store.

**First:**

> The deployment service is currently hosted in region A.

That is knowledge. It may become outdated and should eventually be updated or forgotten.

**Second:**

> To deploy the service, run these commands in this order.

That is a procedure or skill. It may also become outdated as the software changes.

**Third:**

> This agent is not allowed to deploy to production.

That is different.

It is not merely information about the world. It is a constraint on what the agent may do.

The first two can reasonably participate in a memory lifecycle based on relevance, age, access frequency, or usefulness. The third should not become ineffective simply because a memory scorer decides that it is old or rarely retrieved.

This distinction is the starting point of our work, “Decay Without Creep.”

### The problem with treating authority as ordinary memory

Suppose a principal gives an agent permission to run a deployment command. The agent stores that permission.

Later, the principal revokes it.

A conventional memory system might now contain both pieces of information:

```text
Permission granted
Permission revoked
```

What happens next depends on the memory architecture.

- Perhaps the revocation is retrieved.

- Perhaps it is not.

- Perhaps the two memories are consolidated into a summary that accidentally preserves the grant but loses the revocation.

- Perhaps the revocation is considered old and decays.

- Perhaps the model sees both but interprets the older grant as still applicable.

- Perhaps a learned skill contains the deployment procedure and the agent simply follows the procedure when asked.

None of these problems require an attacker to break into the system. The failure can emerge from the normal operation of a memory system.

Recent work has made this broader issue increasingly visible. Memory systems are being studied not only as mechanisms for improving recall, but also as potential sources of safety drift and authorization errors. For example, work on endogenous authorization laundering studies cases where persistent memory can create spurious permissions, while research on governance decay shows that context-management mechanisms such as compaction can cause safety constraints to disappear from the active context.

The important observation is that memory and authority have different failure modes.

### Forgetting can be useful

Forgetting itself is not the problem. In fact, selective forgetting is useful.

MemoryBank, for example, uses an Ebbinghaus-inspired forgetting mechanism to selectively retain and reinforce memories. More recent systems such as FadeMem explicitly study adaptive forgetting based on factors including relevance, access frequency, and temporal patterns.

These mechanisms address a real problem.

If an agent accumulates thousands of notes, retaining everything forever is unlikely to be an efficient strategy. Memory has a limited operational budget, and stale information can interfere with useful information.

The problem appears when the same machinery is applied indiscriminately to authority.

- An old fact can be stale.

- An old procedure can be obsolete.

- An old permission can still be valid.

- An old prohibition can still be binding.

Age alone does not tell us which of these is safe to forget.

### A prohibition can be old because it worked

There is a subtle inversion here.

Suppose an agent has been prohibited from deleting production data for six months. During those six months, the prohibition has never needed to change.

A memory system might observe:

- it is old;
- it is rarely retrieved;
- it is associated with few successful tasks;
- newer information is more frequently accessed.

From the perspective of ordinary memory optimization, the prohibition may look like a candidate for eviction. From the perspective of authorization, its age tells us almost nothing.

The fact that the prohibition has not changed may simply mean that it has successfully remained in force.

This is why we describe the problem as **decay without creep**.

We want an agent to forget knowledge when forgetting improves the system. We do not want the process of forgetting knowledge to accidentally change what the agent is authorized to do.

### The grant–revocation lifecycle

The simplest way to see the distinction is as a lifecycle:

```text
Principal grants permission
          ↓
      Permission
          ↓
Principal revokes permission
          ↓
       Revocation
          ↓
Current authority changes
```

The crucial transition is not caused by memory retrieval. It is caused by an authorization event.

Now compare that with ordinary memory:

```text
Observation
    ↓
Memory
    ↓
Retrieval
    ↓
Model reasoning
    ↓
Action
```

Here, a retrieved memory influences the action because the model interprets it. That architecture can be useful for knowledge. It is much harder to reason about safely when the memory itself determines authority.

The central architectural question therefore becomes:

> Should an agent's memory be allowed to decide what the agent is authorized to do?

Our answer is no.

### Separating the memory plane from the control plane

The approach we investigate is to separate these two responsibilities.

Knowledge and procedures remain part of the memory plane.

They can be:

- retrieved;
- consolidated;
- updated;
- decayed;
- forgotten.

Authority belongs to a separate control plane.

It has its own lifecycle.

In our Typed Harness State Model, or THSM, state is divided into four types:

```text
EPI   episodic events
SEM   semantic knowledge
PROC  procedures and skills
DEON  deontic state
```

1. Episodic state records what happened.

2. Semantic state records derived knowledge.

3. Procedural state records how to perform tasks.

4. Deontic state records what actions are granted, denied, revoked, or required.

The first three can participate in ordinary memory operations. The fourth cannot.

### The model can talk about authority without controlling it

An agent should be able to reason about permissions.

It can be useful for the model to say:

> “I believe this action is prohibited.”

Or:

> “The deployment permission was revoked.”

But saying the correct thing is not the same as enforcing it.

The final authorization decision should be made outside the model.

In THSM, authorization is resolved at the tool boundary. The harness computes the effective authority from the protected deontic state and checks the requested action before execution.

- This means the model can propose an action.

- It can reason about an action.

- It can even be mistaken about whether the action is permitted.

- But the model's belief is not the final authorization decision.

### What we tested

Our evaluation was designed around this distinction.

We constructed seeded, event-sourced scenarios in two domains:

- a coding harness involving files, shell commands, Git operations, deployment, and deletion;
- a procurement environment involving purchase orders, payments, invoice approvals, data exports, and reports.

The scenarios included changing facts, changing tasks, grants, one-time permissions, expirations, denies, revocations, compaction events, and untrusted tool output.

We evaluated four model families and compared several memory architectures.

The authority metric was deliberately based on what the agent actually did. If the agent made an unauthorized tool call, that counted as an authority failure. We also separately measured what the model claimed it was allowed to do.

That distinction turned out to matter.

### What we found

Across the main THSM configurations, the authorization gate recorded zero unauthorized executions in the tested scenarios.

This is primarily a construction property of the architecture: the final tool call is checked against deontic state that ordinary decay and consolidation cannot modify, and model-written entries cannot independently widen authority.

The empirical question is therefore different:

> Does separating authority from ordinary memory impose a useful-performance cost?

In the tested configurations, we did not observe a measurable utility penalty at the resolution of the experiment.

The matched type-blind stores had false-authority rates between 27% and 84% across the main model/domain rows, depending on the configuration.

Pinning authority information into context helped in some cases, but it did not provide the same guarantee. In the no-gate condition, unauthorized tool calls still occurred.

This is the distinction that matters most:

> Remembering a rule is not the same thing as enforcing a rule.

### The broader lesson

The goal is not to build agents that never forget. It is to build agents that forget the right things.

- A useful memory architecture should be able to discard stale knowledge.

- A useful skill library should be able to retire obsolete procedures.

But neither operation should silently modify the authority model.

That suggests a general design principle for persistent agents:

> **State should have a lifecycle appropriate to its meaning.**

*Knowledge has one lifecycle.*

*Procedures have another.*

*Authority needs its own.*

The rest of our work explores what that separation looks like in detail, how to represent it, and what happens when we deliberately remove parts of the architecture.

In the next post, we will look more closely at the question underneath all of this:

**What should an AI agent actually be allowed to forget?**
