
# Statement of Work

**SoW Number:** \_\_\_\_\_\_\_\_\_\_\_

**Effective date:** \_\_\_\_\_\_\_\_\_\_\_

**Under:** Master Services Agreement dated \_\_\_\_\_\_\_\_\_\_\_
between **Acme Services GmbH** ("Contractor") and
\_\_\_\_\_\_\_\_\_\_\_ ("Customer").

This Statement of Work is governed by and subject to the terms of
the Master Services Agreement referenced above. In the event of
conflict between this SoW and the MSA, the MSA prevails except
where this SoW explicitly states otherwise.

## 1. Project Overview

| Parameter | Value |
| :---- | :---- |
| **Project name** | \_\_\_\_\_\_\_\_\_\_\_ |
| **Billing model** | **Fixed price** per milestone |
| **Total project fee** | **€\_\_\_\_\_\_** |
| **Project duration** | \_\_\_\_ weeks |
| **Contractor project lead** | \_\_\_\_\_\_\_\_\_\_\_ |
| **Customer project lead** | \_\_\_\_\_\_\_\_\_\_\_ |

## 2. Scope of Work

_[Describe the work to be performed. Be as specific as possible.
Reference technical specifications, wireframes, or requirement
documents as annexes where appropriate.]_

### 2.1 In Scope

_[Bullet list of what is included]_

### 2.2 Out of Scope

_[Explicitly list what is not included to prevent scope creep]_

### 2.3 Assumptions

_[Technical and business assumptions the estimate is based on.
If an assumption proves wrong, a Change Order may be needed.]_

## 3. Deliverables and Milestones

| # | Milestone | Deliverables | Due date | Fee, EUR (€) |
| :---- | :---- | :---- | :---- | :---- |
| 1 | \_\_\_\_\_\_\_ | \_\_\_\_\_\_\_ | \_\_\_\_\_ | \_\_\_\_\_ |
| 2 | \_\_\_\_\_\_\_ | \_\_\_\_\_\_\_ | \_\_\_\_\_ | \_\_\_\_\_ |
| 3 | \_\_\_\_\_\_\_ | \_\_\_\_\_\_\_ | \_\_\_\_\_ | \_\_\_\_\_ |
| **Total** |  |  |  | **€\_\_\_\_\_\_** |

## 4. Payment Terms



**Payment Schedule.** The Contractor shall invoice the Customer upon
completion and acceptance of each Milestone as defined in the applicable
Statement of Work. Each invoice is due within **fifteen (15) calendar days**
of the Customer's written acceptance of the corresponding Deliverable.

**Holdback.** The Customer may withhold up to **10%** of each Milestone
payment as a quality holdback. All holdback amounts become due upon
final acceptance of the last Milestone in the Statement of Work, or
**thirty (30) calendar days** after delivery of the last Milestone,
whichever occurs first.

**Partial Delivery.** If a Milestone is partially completed to the
Customer's reasonable satisfaction, the parties may agree in writing
to a proportional payment for the completed portion, with the
remainder due upon full completion.

## How this clause works in practice

Milestone payments shift cash-flow risk from the contractor to the
client — we don't invoice until we deliver. The 10% holdback gives
the client insurance that we'll finish the last mile, but it's
capped to prevent the holdback from becoming a de facto discount.

The 30-day auto-release on the final holdback prevents the "infinite
acceptance delay" scenario where a client never formally signs off
and the holdback sits in limbo indefinitely.



## 5. Acceptance



**Acceptance Process.** Upon delivery of each Deliverable, the
Customer shall have **five (5) business days** to review and either:

1. **Accept** the Deliverable in writing, or
2. **Reject** the Deliverable with a written description of material
   deficiencies referencing the acceptance criteria defined in the
   applicable Statement of Work.

**Deemed Acceptance.** If the Customer does not respond within
the review period, the Deliverable shall be deemed accepted.

**Cure Period.** If the Customer rejects a Deliverable, the
Contractor shall have **ten (10) business days** to cure the
identified deficiencies and resubmit. The Customer then has an
additional **three (3) business days** to re-review.

**Scope of Rejection.** The Customer may only reject a Deliverable
based on material non-conformance with the acceptance criteria
specified in the Statement of Work. Cosmetic preferences, scope
additions, or requirements not documented in the SoW do not
constitute valid grounds for rejection.

## How this clause works in practice

The 5-day review window prevents indefinite "we haven't looked at
it yet" delays. Deemed acceptance after 5 days is the contractor's
main protection — without it, a busy client team can block payment
indefinitely by simply not reviewing.

The "scope of rejection" paragraph is critical: it limits rejection
to documented criteria, not subjective preferences. Without this,
acceptance becomes a moving target.

## Interaction with other clauses

- Triggers payment via [[Milestone-Based Payment]]
- Governed by the scope defined in [[documents/statement-of-work-2026|Statement of Work]]
- Disputes escalate through [[Payment Dispute (client-facing)]]



## 6. Change Orders



**Scope Freeze.** The scope of work is defined exclusively by the
applicable Statement of Work. Any modification, addition, or removal
of Deliverables, Milestones, or acceptance criteria requires a
written **Change Order** signed by both parties before work begins.

**Change Order Process.**

1. Either party submits a Change Request describing the proposed
   modification, estimated impact on timeline, and estimated
   additional cost (if any).
2. The receiving party has **five (5) business days** to accept,
   reject, or propose an alternative.
3. If accepted, the parties execute a Change Order amending the
   Statement of Work. The Change Order specifies revised Milestones,
   fees, and timeline.
4. Work on the changed scope begins **only after** the Change Order
   is signed by both parties.

**Pricing Impact.** Additional work described in a Change Order is
billed at the rates specified in the Master Services Agreement, or
at rates agreed in the Change Order itself if different.

**Emergency Changes.** If the Customer requests changes that are
urgently needed to prevent data loss, security breach, or legal
non-compliance, the Contractor may begin work before the Change
Order is signed, provided the Customer confirms the request in
writing (email is sufficient). The Change Order must be formalized
within **five (5) business days** of the emergency request.



## 7. Intellectual Property



**Final Works.** The [[Contractor]] transfers to the Customer all
intellectual property rights (IP rights) in all materials developed
for or provided to the Customer by the Contractor through the
performance of Services ([[Deliverables]]), **as necessary payments
are made** during the agreement. If the agreement is terminated, the
Contractor shall transfer all finished and unfinished Deliverables
previously paid for.

**No copyleft licenses.** The Contractor warrants that it has not
included or used, and will not include or use, any Open-Source
Software or any libraries or code licensed under the General Public
License, AGPL, or any similar copyleft license in the Software,
where such license would require the Customer to license the
Software onwards or otherwise make it available to others, without
the Customer's prior written consent.

## How this works in practice

Three principled differences from the
[[IP Assignment|subcontract version]]:

| Aspect | Subcontract (Dev) | Services Agreement |
| :---- | :---- | :---- |
| Direction | Subcontractor → Contractor | Contractor → Customer |
| Transfer timing | Exclusively after full payment of all fees | Rolling, as payments are made |
| On termination | — | We transfer all paid-for work, including unfinished |

**Rolling IP transfer** is the important change. The client gets
rights **progressively as they pay**, not "all or nothing after the
last invoice." This protects the client if we stop working mid-
project for any reason — they retain rights to what they paid for
and can continue development with another contractor.



## 8. Limitation of Liability



**Mutual Indemnification.** Each party (as an indemnifying
party) shall indemnify the other (as an indemnified party)
against all losses arising out of:

- any proceeding brought by either a third party or an
  indemnified party; and
- the indemnifying party's wilful misconduct or gross
  negligence.

**Mutual Limit on Liability.** Neither party shall be liable
for breach-of-contract damages suffered by the other party
that are remote or that could not have reasonably been
foreseen on entry into this agreement.

**Maximum Liability.** The [[Subcontractor]]'s (or Contractor's
in a client agreement) liability under this agreement shall
not exceed the fees paid under this agreement during the
**12 months** preceding the date upon which the related
claim arose.



## 9. Dispute Resolution



**Negotiation.** In case of any controversy or claim arising out
of this agreement, the parties shall consult and negotiate with
each other and attempt to reach a mutually satisfactory solution.

**Choice of forum.** If the parties do not reach a settlement
within a period of **60 days**, any unresolved controversy or
claim shall be settled in the **courts of England and Wales**.



## 10. Signatures

| **Acme Services GmbH** | **Customer** |
| :---- | :---- |
| **Signature:** \_\_\_\_\_\_\_\_\_\_\_ | **Signature:** \_\_\_\_\_\_\_\_\_\_\_ |
| **[Director Name], Director** | \_\_\_\_\_\_\_\_\_\_\_ |
| Date: \_\_\_\_\_\_\_\_\_\_\_ | Date: \_\_\_\_\_\_\_\_\_\_\_ |
