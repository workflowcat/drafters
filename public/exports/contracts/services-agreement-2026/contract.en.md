
# Services Agreement

> **Negotiation brief.** This contract has 9 sections. Three get negotiated
> in almost every deal: **Liability cap** (§7 — always last to close),
> **IP ownership** (§4 — clients want full assignment, we want retained
> license for reusable tools), and **Payment terms** (§1 — cycle length
> and rate increase cap). The rest — dispute resolution, non-solicitation,
> termination — are usually accepted with minor edits.
>
> **Key trade-offs:**
> - If you give on liability carve-outs (uncapped for data breach) → hold
>   on the overall cap multiple (12 months minimum)
> - If you give on full IP assignment → hold on retained license for
>   generic components and background IP
> - If you give on payment cycle (15 → 30 days) → hold on late payment
>   interest (0.5%/day) as your safety net

**Start date:** \_\_\_\_\_\_\_\_\_\_\_

**Contractor:** **Acme Services GmbH**, a company incorporated
under the laws of the Federal Republic of Germany, Registry code
**HRB123456X**, VAT ID **DE999888777**, with its registered address
at Musterstraße 1, Berlin, 10115, Germany, represented by its
Director [Director Name] (hereinafter the "**Contractor**").

**Customer:** \_\_\_\_\_\_\_\_\_\_\_ (hereinafter the "**Customer**").

## 1. Key Terms

| Parameter | Value |
| :---- | :---- |
| **Service provided** | Software consulting and development (hereinafter the "**Services**") |
| **Payments for Services** | **Prepayment**, based on the estimated number of hours to be spent in the next month. |
| **Invoicing** | Every month. The Customer must pay within **15 calendar days** from the invoice date. |
| **Payment transfers** | To the banking account specified in the invoice. The sending party covers bank charges. |
| **Term and Termination** | At-will termination with **30 days** prior notice, then 14. |
| **Team** | The Contractor may engage subcontractors. |
| **Overtime** | Overtime = **2× Rate**. Only with Customer's written approval. |
| **Rate increase** | No more than once every 12 months. Not more than **12%** annually. |

> **🔍 Negotiation note — Payment terms.** 15 days is our standard for
> prepayment. Clients often request 30 or 45. Up to 30 is acceptable
> if combined with [[Late Payments Interest|late payment interest]].
> Beyond 30 — only for large, reliable clients.
> The 12% rate increase cap is a maximum, not automatic — in practice
> we increase 5-8%. If client pushes below 10%, accept 8-10% but no lower.

## 2. Payments



**Payment Dispute.** If any amount claimed as payable is disputed
in good faith, the **Customer** shall pay the undisputed portion
and give a **5 business days** notice specifying the basis of the
dispute in reasonable detail.

Payments that are undisputed by the Customer within 5 business
days of receipt are considered accepted.





**Late Payments.** If the Customer does not pay invoices when
due, interest on the unpaid amounts of **0.5% per calendar day**
will be charged starting the day after the payment becomes due.

## How this clause works in practice

Defensive mechanism for two reasons:

1. **Psychological pressure.** 0.5%/day ≈ 180% annualized. Client
   finance teams notice this number and bump our invoices up
   the payment queue.
2. **Legal footing.** If collection escalates to court, we have
   a clean contractual basis for including interest in the
   claim, without renegotiation.



> **🔗 How these two clauses interact.** Payment dispute is the process
> (client disputes → pays undisputed portion → 5 days to resolve).
> Late payment interest is the consequence (0.5%/day after due date).
> Together they create a two-layer system: fair process first,
> financial pressure second. Don't remove one without the other.

## 3. Non-solicitation

During the term of this agreement and for **1 year** after its
termination, the Customer shall not solicit, hire or encourage to
leave employment any person who is an employee or subcontractor of
the Contractor.

If any employee or subcontractor of the Contractor independently
approaches the Customer about employment, the Customer shall
immediately suspend such a request and notify the Contractor.

> **🔍 Negotiation note.** Clients rarely push back on non-solicitation.
> When they do, it's usually about the 1-year period (ask for 6 months)
> or about "independent approach" (they want to hire people who come
> to them unsolicited). The "suspend and notify" language is our
> compromise — we don't block the hire, we just want to know.

## 4. Deliverables and Intellectual Property



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



> **🔗 Critical interaction: IP ↔ Payment.** IP transfers to the
> Customer **only after full payment**. This is the Contractor's primary
> leverage in payment disputes. If you negotiate IP terms separately
> from payment terms, you lose this leverage. Always keep them linked.
>
> **🔍 Common client redline:** "We want IP to transfer on creation,
> not on payment." Response: "Work product created before payment
> carries our risk. Assignment on payment is the industry standard
> and protects both sides — you get clean title, we get paid."
>
> **Trade-off:** If client insists on full foreground IP assignment
> (which is our default), make sure background IP and generic
> tools/frameworks are explicitly excluded. We need to reuse our
> internal libraries across clients.

## 5. Publicity

The Contractor may mention a general description of the services
provided to the Customer on the Contractor's website for marketing
purposes only, and only with the Customer's prior written consent.

## 6. Term and Termination



**Term.** This agreement takes effect on the Start date and
continues until terminated by either party in accordance with
the terms below.

**At-will termination.** Either party may terminate this
agreement at any time, without cause, by giving the other
party **30 calendar days** prior written notice.

**Shortened notice.** After the initial 30-day notice period,
the parties may move to **14-day** notice for any further
amendments or terminations within the scope of this agreement.



> **🔍 Negotiation note.** 30 days is reasonable for most engagements.
> For large deals (5+ developers), push for 60-90 days or add a
> wind-down fee (1 month of the last invoice). The shortened 14-day
> second notice reflects that once you've decided to part, dragging
> it out helps nobody.
>
> **Client redline:** "We want 14 days from day one." Response:
> "14 days doesn't give us time to redeploy the team. 30 days is the
> industry standard and protects your knowledge transfer too."

## 7. Limitation of Liability and Indemnification



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



> **⚠️ This is the most negotiated clause in the contract.**
>
> **Our position:** Mutual cap at 12 months of fees. Both sides
> limited equally.
>
> **What clients want:** Uncapped carve-outs for data breaches,
> IP infringement, willful misconduct, and confidentiality breaches.
> Some clients want unlimited liability on the vendor side only.
>
> **What to concede:**
> - Carve-outs for willful misconduct and fraud — these are
>   reasonable and standard.
> - GDPR fines exclusion — regulatory fines bypass liability caps
>   by law anyway, so agreeing to exclude them costs nothing.
>
> **What to hold:**
> - The mutual nature — if liability is uncapped for us, it should
>   be uncapped for them too.
> - The 12-month floor — below that, a single incident can wipe
>   out all project revenue.
> - Indemnities should sit INSIDE the cap, not outside it.
>   If indemnities are outside the cap, the cap is meaningless.
>
> **Trade-off:** If you accept broader carve-outs, negotiate a
> higher cap multiple (18 or 24 months instead of 12).

## 8. Effect of Termination



**Payment Obligations.** Upon the expiration or termination of
this agreement, each party shall pay any amounts it owes to
the other party, including payment obligations for Services
already rendered, or refund any payments received but not yet
earned, including payments for Services not rendered.

**Performer Obligations.** Upon receipt of notice of such
termination, the [[Subcontractor]] (Subcontractor or Contractor,
depending on the agreement type) shall promptly terminate all
Services in progress, inform the principal of the extent to
which performance has been completed, and deliver to the
principal whatever [[Deliverables]] produced in the performance
of the Services.

**Survival.** Upon the termination of this agreement, the
obligations of the Parties regarding **intellectual property,
confidentiality, non-solicitation and non-compete** shall
survive.

## Three separate obligations

This clause breaks into three independent duties:

### 1. Settlement (Payment Obligations)

"Who owes, pays. Who got too much, refunds." A symmetric rule
that works in both directions:

- **Our debt** — if we haven't paid for work done before
  termination, we must settle.
- **Their debt** — if we pre-paid for work not yet done, they
  refund (or we agree to credit against future projects).

### 2. Handover (Performer obligations)

Immediate stop + status report + delivery. Three actions that
must happen the day notice is received:

- **Stop** — the performer takes on no new tasks
- **Report** — what's done, what's in progress, what's not started
- **Deliver** — all work product (code, docs, access) transfers
  to the principal

If the performer ignores this clause, we have legal grounds to
demand performance and to withhold the final payment until
handover is complete.

### 3. Survival

What stays in force after the agreement ends:

- **IP** — rights to delivered Deliverables remain with the
  principal
- **Confidentiality** — anything disclosed remains confidential
  (per [[Mutual Confidentiality]] terms)
- **Non-solicitation** — 1 year in subcontracts runs from Start
  date, not from termination
- **Non-compete** — same

Survival is the key mechanism that makes a clean termination
possible: if you exit, you don't walk away with the IP,
clients, confidential information, or the right to poach.



> **🔗 Interaction: Termination ↔ IP ↔ Payment.** This clause
> connects termination (§6), IP (§4), and payment (§2). On
> termination: (1) client pays for work done, (2) we deliver
> work-in-progress, (3) IP for paid work transfers. The three
> obligations are sequential — no delivery without payment,
> no IP transfer without delivery. Don't let anyone rearrange
> this sequence.

## 9. Dispute Resolution



**Negotiation.** In case of any controversy or claim arising out
of this agreement, the parties shall consult and negotiate with
each other and attempt to reach a mutually satisfactory solution.

**Choice of forum.** If the parties do not reach a settlement
within a period of **60 days**, any unresolved controversy or
claim shall be settled in the **courts of England and Wales**.



> **🔍 Negotiation note.** England & Wales is a neutral forum —
> neither our home jurisdiction nor theirs. This is actually a
> selling point: we're not trying to force our courts on the client.
> The 60-day negotiation period before litigation is standard and
> saves both sides legal fees. Clients rarely push back here.
>
> **If client insists on their jurisdiction:** Accept if it's a
> major EU jurisdiction with English-language commercial courts
> (Netherlands, Ireland). Push back on jurisdictions where we have
> no representation or where proceedings are in a language we don't
> speak.

## 10. Signatures

| **Acme Services GmbH** | **Customer** |
| :---- | :---- |
| Registry code: HRB123456X / VAT ID: DE999888777 | Company ID / VAT ID: \_\_\_\_\_\_\_\_\_\_\_ |
| Jurisdiction: Germany | Jurisdiction: \_\_\_\_\_\_\_\_\_\_\_ |
| Address: Musterstraße 1, Berlin, 10115, Germany | Address: \_\_\_\_\_\_\_\_\_\_\_ |
|  |  |
| **Signature:** \_\_\_\_\_\_\_\_\_\_\_ | **Signature:** \_\_\_\_\_\_\_\_\_\_\_ |
| **[Director Name], Director** | \_\_\_\_\_\_\_\_\_\_\_ |

---

## Attachment A — Rate Sheet

To the Services Agreement dated \_\_\_\_\_\_\_\_\_\_\_.

| Role | Hourly rate, EUR (€) |
| :---- | :---- |
|  |  |
|  |  |
|  |  |
