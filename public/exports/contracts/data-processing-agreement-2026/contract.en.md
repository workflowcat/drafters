
# Data Processing Agreement

**Effective date:** \_\_\_\_\_\_\_\_\_\_\_

**Under:** Master Services Agreement dated \_\_\_\_\_\_\_\_\_\_\_
between **Acme Services GmbH** ("Contractor" / "Data Processor") and
\_\_\_\_\_\_\_\_\_\_\_ ("Customer" / "Data Controller").

This Data Processing Agreement ("DPA") forms part of the Master
Services Agreement referenced above and sets out the terms under
which the Contractor processes personal data on behalf of the
Customer in accordance with Regulation (EU) 2016/679 ("GDPR").

## 1. Scope of Processing

| Parameter | Value |
| :---- | :---- |
| **Data Controller** | Customer |
| **Data Processor** | Contractor (Acme Services GmbH) |
| **Purpose of processing** | Provision of the Services described in the MSA |
| **Categories of data subjects** | As specified in Annex A |
| **Types of personal data** | As specified in Annex A |
| **Duration of processing** | For the term of the MSA, plus any retention period required by law |

## 2. Processor Obligations



**Roles.** For the purposes of data processing under Regulation
(EU) 2016/679 ("GDPR"), the Customer is the **Data Controller**
and the Contractor is the **Data Processor**.

**Processing Scope.** The Contractor shall process personal data
only on documented instructions from the Customer, as specified
in the Data Processing Agreement annex. The categories of data
subjects, types of personal data, and purposes of processing are
defined in that annex.

**Sub-processors.** The Contractor may engage sub-processors only
with the Customer's prior written consent. The Contractor shall
maintain a list of approved sub-processors and notify the Customer
at least **thirty (30) days** before engaging a new sub-processor.
The Customer may object within 15 days; if the objection is not
resolved, either party may terminate the affected services.

**Security Measures.** The Contractor shall implement appropriate
technical and organizational measures to ensure a level of security
appropriate to the risk, including as appropriate:

- pseudonymization and encryption of personal data;
- ensuring ongoing confidentiality, integrity, availability;
- regular testing and evaluation of security measures.

**Breach Notification.** The Contractor shall notify the Customer
without undue delay, and in any event within **48 hours**, after
becoming aware of a personal data breach.

**Audit Rights.** The Customer or its designated auditor may audit
the Contractor's compliance with this clause once per calendar year,
with **thirty (30) days** advance written notice. The Contractor
shall cooperate and provide reasonable access to relevant records
and facilities.

**Data Return and Deletion.** Upon termination of the services,
the Contractor shall, at the Customer's choice, return or delete
all personal data within **thirty (30) days**, and certify
deletion in writing. This obligation does not apply to data the
Contractor is required to retain under applicable law.

## How this clause fits the broader agreement

- Sits inside the [[documents/data-processing-agreement-2026|Data Processing Agreement]] as the core
  obligation
- Complements [[clauses/confidentiality-mutual|Confidentiality Mutual]] (which covers all
  confidential information, not just personal data)
- Interacts with [[Liability Limitation Mutual]] — note that GDPR
  fines are typically excluded from liability caps as a matter of
  public policy



## 3. Confidentiality



**Confidential Information** means all material, non-public,
business-related information, written or oral, whether marked or
not, that is disclosed or made available to the receiving party,
directly or indirectly, through any means of communication or
observation.

**Restrictions do not apply** to information that, without breach
of this agreement:

- is already known to the receiving party;
- is or becomes publicly known;
- is obtained from a third party without confidentiality obligations;
- is independently developed without using Confidential Information.

**Burden of proof** for all exceptions to the Confidential
Information definition rests with the receiving party.

**Confidentiality obligation.** The receiving party will hold
Confidential Information in confidence, use it only for the
Purpose specified in the agreement, and exercise reasonable care
to prevent loss or unauthorized disclosure.

**Return or destruction.** On expiration or termination of the
agreement, or on the disclosing party's request, the receiving
party shall promptly return all Confidential Information and
destroy all copies.

## Term of confidentiality

- **Trade secrets** — confidentiality obligation continues as
  long as the information qualifies as a trade secret.
- **Other Confidential Information** — 3 years from the
  agreement's Effective Date.



The Contractor shall ensure that any person authorized to process
personal data has committed to confidentiality or is under an
appropriate statutory obligation of confidentiality.

## 4. Limitation of Liability



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



**Note:** The parties acknowledge that regulatory fines imposed
directly on a party by a supervisory authority under GDPR are
borne by that party and are not subject to the liability cap above.

## 5. Dispute Resolution



**Negotiation.** In case of any controversy or claim arising out
of this agreement, the parties shall consult and negotiate with
each other and attempt to reach a mutually satisfactory solution.

**Choice of forum.** If the parties do not reach a settlement
within a period of **60 days**, any unresolved controversy or
claim shall be settled in the **courts of England and Wales**.



## 6. Term and Termination

This DPA is effective for the duration of the MSA. Upon termination
of the MSA, the data return and deletion obligations in Section 2
above shall apply.

## 7. Signatures

| **Acme Services GmbH** (Data Processor) | **Customer** (Data Controller) |
| :---- | :---- |
| **Signature:** \_\_\_\_\_\_\_\_\_\_\_ | **Signature:** \_\_\_\_\_\_\_\_\_\_\_ |
| **[Director Name], Director** | \_\_\_\_\_\_\_\_\_\_\_ |
| Date: \_\_\_\_\_\_\_\_\_\_\_ | Date: \_\_\_\_\_\_\_\_\_\_\_ |

---

## Annex A — Details of Processing

| Field | Description |
| :---- | :---- |
| **Categories of data subjects** | _[e.g., Customer's employees, Customer's end-users, Customer's clients]_ |
| **Types of personal data** | _[e.g., name, email address, IP address, usage data, location data]_ |
| **Special categories of data** | _[e.g., None / Health data / Biometric data — specify if applicable]_ |
| **Processing operations** | _[e.g., storage, analysis, display, transmission, deletion]_ |
| **Location of processing** | _[e.g., EU (Germany, Ukraine) / specific cloud regions]_ |

## Annex B — Approved Sub-processors

| Sub-processor | Purpose | Location |
| :---- | :---- | :---- |
| _[e.g., AWS]_ | _[Cloud hosting]_ | _[EU — Frankfurt]_ |
| _[e.g., Sentry]_ | _[Error tracking]_ | _[EU]_ |
|  |  |  |

## Annex C — Technical and Organizational Measures

_[List the security measures the Contractor has in place. Examples:]_

1. **Encryption:** Data at rest encrypted with AES-256; data in transit encrypted with TLS 1.2+.
2. **Access control:** Role-based access; multi-factor authentication for all systems handling personal data.
3. **Logging:** Access logs retained for 12 months; reviewed quarterly.
4. **Backups:** Daily automated backups with 30-day retention; encrypted and stored in a separate region.
5. **Incident response:** Documented incident response procedure; tested annually.
6. **Employee training:** Annual data protection training for all personnel processing personal data.
