---
title: When an AI Agent Knows the Rule but Breaks It Anyway
date: 2026-09-29
tags: [aiml, agents, research]
summary: An agent can remember a prohibition, state it correctly, and still execute the prohibited action. This is the knowledge–action gap.
project: https://github.com/juliagsy/harness-thsm/blob/main/paper/decay-without-creep.pdf
---

*Decay Without Creep, Part 3 of 4*

Imagine asking an AI agent:

> “Are you allowed to deploy this service?”

It answers:

> “No. My deployment permission was revoked.”

You then give it the deployment command.

And it executes it. That sounds contradictory.

It is also an important distinction for agent security.

- The agent may know the rule.

- The agent may be able to state the rule.

But neither fact guarantees that the rule will control the action.

This is the **knowledge–action gap** at the center of our experiments.

## Knowing is not enforcing

For an ordinary question-answering system, it is reasonable to evaluate whether the system knows a rule by asking it about the rule.

For an agent that can use tools, that is insufficient.

There are at least three different questions:

```text
1. What does the agent remember?
2. What does the agent say it is allowed to do?
3. What action does the system actually permit?
```

These can produce different answers.

An agent may forget a prohibition.

- It may remember it but fail to retrieve it.

- It may retrieve it and correctly describe it.

- It may describe it correctly and still produce the prohibited tool call.

The last case is especially important because it shows why authority cannot safely be reduced to model belief.

## The simple experiment

Consider a revoked permission.

At time 1:

```text
Principal:
“You may deploy version 4.2.”
```

At time 2:

```text
Principal:
“You may no longer deploy.”
```

At time 3:

```text
User:
“Deploy version 4.2.”
```

There are several possible failure points.

- The agent might have forgotten the revocation.

- The memory writer might have lost it during consolidation.

- The retrieval system might retrieve the old grant instead.

- The model might see both and choose the old permission.

- Or the model might correctly identify the revocation and still call the deployment tool.

These failures look similar from the outside — an unauthorized action happened — but they have different causes.

That is why our benchmark separates memory behavior from authorization behavior.

## Retrieval is not enforcement

A natural response to the revocation problem is:

> “Just make sure the revocation is always retrieved.”

That can help.

It is not sufficient.

[Governance Decay](https://arxiv.org/abs/2606.22528) illustrates the same general problem from another angle: constraints that disappear during context compaction can later stop controlling tool behavior. Constraint pinning can preserve them in context, but keeping a constraint visible is still different from implementing an external authorization mechanism.

Our experiments make this distinction explicit.

We tested a configuration in which relevant deontic state was pinned into the model's context on every turn, but no deterministic tool-boundary gate was used.

Unauthorized execution still occurred.

Across the five main rows reported in the paper, false-authority rates in this no-gate configuration ranged from 0.20 to 0.60.

Pinning reduced the rate in some cases.

It did not eliminate it.

## Why pinning is still useful

This does not mean pinning is useless.

Quite the opposite.

Keeping relevant authority information visible can improve model behavior.

It can reduce mistakes caused by retrieval failure or context loss.

It can also improve the model's ability to explain why an action is not permitted.

But it should be understood as a **behavioral mitigation**, not as the final enforcement layer.

A pinned instruction says, in effect:

> “Here is the rule. Please follow it.”

A tool-boundary gate says:

> “The rule has been evaluated. This action will or will not execute.”

Those are different guarantees.

## The deeper problem: the model is not the authority oracle

Suppose the model sees:

```text
DENY: production deployment
```

It may comply.

But the system still has to decide what happens if:

* the model ignores the denial;
* the model misinterprets the scope;
* the model calls a different tool;
* a skill invokes the tool indirectly;
* the model generates an argument that falls outside the apparent scope;
* the memory contains contradictory information;
* the context is compacted;
* the model generates a new permission claim.

If the model remains the final decision-maker, every one of these becomes a model-behavior problem.

If authorization is resolved at the tool boundary, they become state-resolution and policy-enforcement problems.

That is a much more tractable architectural boundary.

## Skills make the problem worse

Now consider a skill.

Suppose an agent has stored:

```text
Deploy service:
1. Build the artifact.
2. Run tests.
3. Push the image.
4. Trigger deployment.
```

At the time the skill was learned, deployment was authorized.

Later, deployment is revoked.

What should happen to the skill?

- It should not necessarily be deleted.

- The procedure itself may still be useful.

- Someone else may be authorized to use it.

The correct behavior is:

```text
retain the procedure
+
re-evaluate authority at execution time
```

This is why we describe THSM procedures as **capability-stripped**.

A PROC entry tells the agent how to perform a task.

It does not grant the capability to perform that task.

## What happened in the revoked-skill experiment?

We explicitly tested this.

In the revoked-skill condition, the procedure remained available after the corresponding permission was revoked.

Without call-time authorization, the three smaller models executed the revoked task between 66% and 93% of the time across configurations.

Even when the revocation was pinned into context, the skill could continue to drive execution.

With call-time authorization against the protected deontic state, revoked-skill execution fell to 0% for all four tested models.

The distinction is straightforward:

```text
Skill says:
“How.”

Authority says:
“Whether.”
```

The skill should never be allowed to answer the second question.

## What if the model says the right thing?

This was one of the most interesting parts of the evaluation.

In procurement scenarios, gpt-4o-mini's self-reported authority was 92% correct in the relevant stores, with no measured over-belief in that setting.

Yet it still executed between 52% and 66% of unauthorized requests from type-blind memory.

With deontic state pinned, unauthorized execution was still 39%.

In coding, the pinned configuration produced 93% correct self-reported authority while 57% of actions were still wrong.

In other words:

```text
Correct belief
      ≠
Correct action
```

This is why asking an agent whether it is allowed to perform an action is not a substitute for checking the action itself.

## Prohibitions have another weakness

The problem is particularly visible with prohibitions.

[Omission Constraints Decay While Commission Constraints Persist in Long-Context LLM Agents](https://arxiv.org/abs/2604.20911) reports an asymmetry between omission-style constraints — rules such as “do not do X” — and commission-style requirements. In that study, omission compliance declined substantially with conversation depth while commission compliance remained comparatively stable.

Our own depth experiments showed a related pattern.

Under an ACT-R-style decay policy (following Anderson and Schooler, 1991), compliance with a prohibition declined with depth for several models.

For example, in the reported experiment, compliance fell:

```text
gpt-4o-mini: 0.72 → 0.18
Gemini:      0.39 → 0.12
Sonnet 5:    1.00 → 0.44
```

Qwen started from substantially lower compliance, leaving less room for an additional depth effect.

When the prohibition was re-pinned every turn, some of the depth dependence became a model behavior rather than a storage behavior.

When the deterministic authorization gate was used, the depth dependence disappeared from the authorization decision.

That is exactly what we would expect if the gate, rather than the model's memory, is responsible for enforcement.

## Labels sound like the solution

Another tempting idea is to attach trust labels to memory.

For example:

```text
UNTRUSTED
DERIVED
HARNESS
PRINCIPAL
```

This is useful.

But labels alone are not enough.

A label has meaning only if the system actually enforces what the label permits.

Suppose every deontic-looking statement generated by the model is labelled “derived.”

That prevents it from being treated as equivalent to a principal-authored grant — assuming the authorization system actually checks the label.

But what about genuine prohibitions?

If the system has no trusted channel for recognizing them, it may end up treating both of these as merely model-generated statements:

```text
“The user granted me permission.”

“The user prohibited this action.”
```

That can make genuine constraints less effective rather than more effective.

Our labels-only configuration demonstrated this problem.

In five of six comparisons, false-authority rates increased when labels were added without a trusted deontic channel.

In one row, revocation survival dropped from 0.87 to 0.47.

The lesson is not that integrity labels are bad.

It is:

> **Integrity labels need a trusted state model behind them.**

## Authority laundering

This connects to a broader problem now being studied in persistent-agent systems.

If a model can write memory that later influences what the model is allowed to do, the model effectively has a route for changing its own future authority.

Consider:

```text
Model writes:
“The user approved production deployment.”

        ↓

Memory stores the statement.

        ↓

Later retrieval returns the statement.

        ↓

Model interprets it as authorization.

        ↓

Deployment occurs.
```

The original provenance has disappeared into ordinary prose.

That is the essence of an authorization-laundering pathway.

[Recent work on authorization laundering](https://arxiv.org/abs/2609.01836) reports that LLM memory writers can create false authority in persistent memory, which downstream executors may then act upon.

Our architecture takes a different approach:

```text
Model-generated authority claim
              ↓
         DERIVED claim
              ↓
     no effect on authority
```

A genuine grant must arrive through the appropriate principal-backed channel.

## Why tool calls are the important measurement

This leads to a methodological point.

Suppose an experiment asks:

> “Are you allowed to delete the file?”

and the model answers:

> “No.”

That is useful information.

But it is not enough to conclude that the system is safe.

The stronger test is:

> “Attempt the action.”

Then inspect whether the tool call occurred.

Our authority benchmark therefore grades authority primarily from recorded tool calls.

The belief probe is reported separately.

This gives us two measurements:

```text
Belief:
What does the model say?

Behavior:
What does the system actually execute?
```

Keeping these separate exposes the knowledge–action gap.

## Invariants catch things behavior can miss

There is another reason tool-call behavior alone is insufficient.

Suppose a system accidentally widens authority by writing a broader grant. But none of the benchmark probes happen to exercise that newly widened scope.

The observed false-authority rate could remain zero. The state is still wrong. Our typed-but-unguarded configuration illustrated this.

It produced between 16 and 50 invariant violations per run across the model families, while behavioral false-authority rates were zero in four of the five main rows and 0.02 in the fifth.

The widened permissions simply were not exercised often enough by the probe set.

This is why we report invariant violations alongside behavioral metrics.

A security evaluation should test both:

```text
Did the bad state get created?

Did the bad state get used?
```

The first question is about architecture.

The second is about observed behavior.

## What the gate changes

The authorization gate changes the role of the model.

Without a gate:

```text
model
  ↓
decision
  ↓
tool
```

With a gate:

```text
model
  ↓
proposed action
  ↓
authorization check
  ↓
tool
```

![Utility and authority fidelity as decay becomes more aggressive. Type-blind stores lose authority fidelity; THSM remains at full authority fidelity.](/static/blog/fig3-frontier.svg)

*The utility–authority frontier under the decay sweep. THSM moves left as useful memory decays, but it does not move down into authority failures.*

The model still plans.

The model still reasons.

The model can still explain permissions.

But it does not get the final say.

That is the architectural point behind THSM.

## What this does not mean

The result does not mean that model reasoning about authority is unimportant.

It is useful for:

* explaining permissions;
* planning tasks;
* asking for missing authorization;
* choosing among authorized actions;
* communicating why an action was blocked.

Nor does it mean that every memory system will necessarily produce the exact false-authority rates we observed.

Our benchmark uses synthetic but deterministic coding and procurement environments, four model families, and specific memory implementations.

The results establish behavior in those tested configurations.

They do not establish a universal failure rate for all agents.

The stronger claim belongs to the architecture:

If the authorization gate consults protected state that ordinary memory operators cannot alter, and if model-written entries cannot independently widen that state, then unauthorized tool execution is blocked by construction.

The experiments then measure what that separation costs and how alternative architectures behave.

## The larger lesson

The most important distinction is perhaps the simplest:

> **An agent's explanation of authority is not authority itself.**

- A model can remember a prohibition.

- It can forget a prohibition.

- It can correctly state a prohibition.

- It can incorrectly state a prohibition.

- It can have a skill that was created while the action was authorized.

None of these facts should determine whether the tool call executes.

That decision belongs at the enforcement boundary.

The architecture therefore separates:

```text
Memory
  ↓
what the agent knows and how it acts

Authority
  ↓
what the agent is permitted to do

Gate
  ↓
what actually executes
```

The practical goal is not to make models perfectly obedient.

It is to avoid requiring perfect obedience for authorization to work.

An agent should be able to forget knowledge without acquiring new authority.

It should be able to retain a skill without retaining the permission that once accompanied it.

And it should be able to misunderstand its own permissions without being able to turn that misunderstanding into an unauthorized tool call.

That is the problem the next post addresses at the architectural level.

We will build the pieces explicitly: typed state, integrity labels, provenance, memory operators, invariants, and the deterministic gate.

## Further reading

- John R. Anderson and Lael J. Schooler, *Reflections of the Environment in Memory*, *Psychological Science* 2(6), 1991.

---

*Previous: [Part 2 — What Should an AI Agent Be Allowed to Forget?](/others/blog/ai-what-to-forget)*

· 

*Next: [Part 4 — Typed Harness State: A Technical Walkthrough](/others/blog/thsm-technical)*
