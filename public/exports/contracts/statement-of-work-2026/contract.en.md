
# Statement of Work

> **Переговорний бриф: Fixed-Price SoW**
>
> **Тип контракту:** фіксована ціна за milestone. Ключова динаміка -- клієнт платить за результат, а не за час. Вся маржа залежить від точності оцінки та контролю scope.
>
> **Головні ризики для нас:**
> - Scope creep без Change Order -- безкоштовна робота, яка з'їдає маржу
> - Нечіткі Acceptance Criteria -- клієнт блокує оплату через суб'єктивні зауваження
> - Holdback понад 10% -- замороження cash flow на місяці
> - Assumptions, які виявляються невірними -- якщо не зафіксовані, це наш ризик
>
> **Наші key protections:**
> - Deemed acceptance (5 днів мовчання = прийнято) -- найважливіший захист
> - Чіткий Out of Scope -- не менш важливий, ніж In Scope
> - Change Order process -- будь-що поза scope = нова оцінка + додаткова оплата
> - Assumptions як trigger для Change Order -- невірне assumption != безкоштовна переробка
>
> **Переговорна позиція:** "Фіксована ціна = фіксований scope. Ми гарантуємо ціну за чітко визначений обсяг. Будь-які зміни -- це Change Order з окремим estimate."

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

<Voice voice="business">Total project fee -- це наша фіксована ціна. Клієнт іноді очікує гнучкості в ціні, зберігаючи весь scope. Позиція: "Ціна фіксована так само, як і scope. Зміна одного тягне зміну іншого." Тривалість проекту -- якщо вона збільшиться з вини клієнта (затримки з feedback, late approvals), це має бути підставою для Change Order, а не для безкоштовної переробки.</Voice>

<Voice voice="negotiations">Billing model "per milestone" -- це наша перевага. Клієнт платить за конкретний результат, а не за час. Якщо клієнт тисне на знижку загальної суми, краще прибрати частину scope, ніж знижувати ціну за той самий обсяг. Ніколи не погоджуйтесь на "ми потім додамо scope, але ціна така ж."</Voice>

<Voice voice="delivery">Project lead з обох сторін -- обов'язково зафіксуйте. Без визначеного контакту на боці клієнта затримки з approvals стають нормою. Рекомендація: в окремому листі погодити SLA на response time (наприклад, 2 робочих дні на feedback).</Voice>

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

<Voice voice="legal">Scope of Work -- це юридичне визначення того, за що ми відповідаємо. Все, що не вказано в In Scope, de facto є Out of Scope. Але без явного Out of Scope клієнт буде аргументувати "це ж очевидно мається на увазі." Формулюйте In Scope максимально конкретно: не "розробка веб-додатку", а перелік конкретних модулів, екранів, інтеграцій.</Voice>

<Voice voice="business">Out of Scope -- це ваш захист маржі. Кожен пропущений пункт тут може стати безкоштовною роботою. Типові пункти, які клієнт "забуває": міграція даних, інтеграції з третіми системами, мобільна версія, навчання користувачів, підтримка після запуску.</Voice>

<Voice voice="negotiations">Assumptions -- це ваш trigger для Change Order. Формулюйте їх чітко: "Ми виходимо з того, що API клієнта повертає дані у форматі X. Якщо формат інший, це Change Order." Клієнт часто погоджується на Assumptions, не усвідомлюючи їх вагу. Це нормально -- саме для того вони й потрібні.</Voice>

<Voice voice="delivery">Команда має брати участь у написанні Scope та Assumptions. Тільки розробники знають, де ховаються неочевидні складності. Якщо PM пише scope без інженерів -- оцінка буде неточною, а маржа під загрозою.</Voice>

<Voice voice="interaction">Scope прямо пов'язаний із Deliverables (Sec. 3), Change Orders (Sec. 6) та Acceptance Criteria (Sec. 5). Будь-яка неточність тут каскадно вплине на всі три секції. Assumptions є юридичною підставою для Change Order -- якщо assumption виявляється невірним, ми маємо право на перегляд scope і ціни.</Voice>

## 3. Deliverables and Milestones

| # | Milestone | Deliverables | Due date | Fee, EUR (€) |
| :---- | :---- | :---- | :---- | :---- |
| 1 | \_\_\_\_\_\_\_ | \_\_\_\_\_\_\_ | \_\_\_\_\_ | \_\_\_\_\_ |
| 2 | \_\_\_\_\_\_\_ | \_\_\_\_\_\_\_ | \_\_\_\_\_ | \_\_\_\_\_ |
| 3 | \_\_\_\_\_\_\_ | \_\_\_\_\_\_\_ | \_\_\_\_\_ | \_\_\_\_\_ |
| **Total** |  |  |  | **€\_\_\_\_\_\_** |

<Voice voice="business">Розбивка на milestones -- це не лише графік, а й інструмент управління cash flow. Оптимально: перший milestone (Discovery/Setup) -- 20-30% від суми, далі рівномірно. Ніколи не погоджуйтесь на milestone "фінальна здача" із 40%+ оплати -- це замороження грошей і важіль тиску клієнта.</Voice>

<Voice voice="negotiations">Кожен milestone має мати чіткі, вимірювані deliverables. "Розробка бекенду" -- погано. "API endpoints згідно специфікації в Annex A, задеплоєні на staging" -- добре. Чим конкретніше deliverable, тим менше суб'єктивності при acceptance.</Voice>

<Voice voice="delivery">Due dates мають включати buffer (мінімум +20%). Клієнт бачить лише фінальну дату, ваша внутрішня deadline -- раніше. Якщо milestone залежить від input від клієнта (контент, API доступ, feedback), зафіксуйте це в Assumptions.</Voice>

<Voice voice="interaction">Таблиця Deliverables є основою для Payment Terms (Sec. 4) та Acceptance (Sec. 5). Кожен рядок тут = один payment trigger. Сума всіх milestones повинна точно дорівнювати Total project fee з Sec. 1.</Voice>

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



<Voice voice="legal">Milestone-based payment -- стандарт для fixed-price, але ключове питання -- holdback. Клієнт хоче 15-20% holdback до фінальної здачі. Наша позиція -- максимум 10%. Holdback понад 10% суттєво впливає на cash flow і створює дисбаланс: ми вже виконали роботу, а гроші заморожені.</Voice>

<Voice voice="business">Рахуйте реальний cash flow: якщо проект на 6 місяців із 15% holdback, це означає, що значна сума заморожена на півроку. Для невеликої компанії це може бути критично. Пропонуйте альтернативу: оплата milestone протягом 10 днів після acceptance, без holdback, але з warranty period.</Voice>

<Voice voice="negotiations">Якщо клієнт наполягає на holdback, торгуйтесь: "Ми готові на 10% holdback, який звільняється протягом 14 днів після фінальної acceptance. Натомість -- warranty 30 днів на виправлення дефектів." Це дає клієнту захист без заморожування наших грошей.</Voice>

<Voice voice="interaction">Payment Terms прив'язані до Deliverables (Sec. 3) та Acceptance (Sec. 5). Без чіткої acceptance процедури клієнт може нескінченно відкладати оплату milestone, аргументуючи "ще не прийняли."</Voice>

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



<Voice voice="legal">Deemed acceptance -- це наш найважливіший захист у fixed-price контракті. Механізм: якщо клієнт не надає feedback протягом 5 робочих днів, deliverable вважається прийнятим. Без цього клієнт може мовчати тижнями, блокуючи оплату. Клієнт може вимагати 10-15 днів -- тримайтесь на 5, максимум 7.</Voice>

<Voice voice="business">Кожен день затримки acceptance = день затримки оплати. Якщо milestone оплачується net-30 після acceptance, а acceptance затягується на 2 тижні, реальний термін оплати -- 44 дні. Deemed acceptance це запобіжник.</Voice>

<Voice voice="negotiations">Клієнт боїться deemed acceptance ("а якщо ми не встигнемо перевірити?"). Відповідь: "Deemed acceptance не означає, що ви не можете подати bug report пізніше. Воно лише запускає оплату за milestone. Дефекти виправляються за warranty." Це знімає страх.</Voice>

<Voice voice="delivery">Перед подачею на acceptance -- внутрішнє demo + QA. Якщо клієнт постійно знаходить дефекти при acceptance, довіра падає і він почне вимагати довший review period. Якість deliverable = швидша acceptance = швидша оплата.</Voice>

<Voice voice="interaction">Acceptance запускає Payment (Sec. 4) і починає Warranty period. Deemed acceptance також означає, що IP передається клієнту (Sec. 7). Все пов'язано: нечітка acceptance блокує і гроші, і IP transfer, і warranty clock.</Voice>

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



<Voice voice="legal">Change Order -- це юридичний механізм, який перетворює усний запит "а можна ще ось це" на формальну зміну контракту з переглядом ціни та строків. Без нього будь-яке розширення scope стає безкоштовною роботою. Процедура має бути чіткою: письмовий запит -> оцінка -> погодження -> підпис -> тільки тоді робота.</Voice>

<Voice voice="business">Change Orders -- це не проблема, а можливість. Кожен CR (Change Request) -- це додатковий revenue. Але тільки якщо process працює. Якщо команда починає робити "маленькі зміни" без CR, маржа танення. Правило: будь-яка зміна, що потребує більше 2 годин роботи, -- це Change Order.</Voice>

<Voice voice="negotiations">Клієнт часто каже: "Це ж дрібниця, навіщо формальний процес?" Відповідь: "Change Order process захищає вас так само, як і нас. Ви завжди знаєте точну вартість до початку роботи. Жодних сюрпризів у рахунку." Подавайте це як transparency, а не бюрократію.</Voice>

<Voice voice="delivery">Навчіть команду розпізнавати scope creep: якщо клієнт просить щось, чого немає в Scope (Sec. 2), перша відповідь -- "Ми з радістю це зробимо через Change Order." PM/Team Lead повинен мати повноваження сказати "ні" без ескалації.</Voice>

<Voice voice="interaction">Change Order змінює Scope (Sec. 2), Deliverables (Sec. 3), Payment (Sec. 4) та строки. Кожен підписаний Change Order стає amendment до SoW. Assumptions (Sec. 2.3) -- це автоматичний trigger для Change Order, якщо вони виявляються невірними.</Voice>

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



<Voice voice="legal">IP assignment у fixed-price -- клієнт отримує все IP після повної оплати. Ключове слово -- "після повної оплати." Поки не оплачено, IP залишається у нас. Це наш leverage: клієнт не може використовувати неоплачений код. Переконайтесь, що clause чітко прив'язує IP transfer до payment.</Voice>

<Voice voice="business">Збережіть right to use pre-existing IP, frameworks та бібліотеки, які ви використовуєте в інших проектах. Формулювання: "Contractor retains ownership of pre-existing tools, frameworks, and libraries." Без цього клієнт може аргументувати, що ваш internal framework тепер його.</Voice>

<Voice voice="negotiations">Клієнт хоче "all IP created during the project." Наша відповідь: "Ви отримуєте повне право на весь custom code, створений для вашого проекту. Наші pre-existing tools залишаються нашими, але ви отримуєте perpetual license на їх використання у вашому продукті."</Voice>

<Voice voice="interaction">IP transfer залежить від Acceptance (Sec. 5) і Payment (Sec. 4). Якщо клієнт не платить, IP не передається. Це пов'язує три секції в єдиний захисний ланцюг: delivery -> acceptance -> payment -> IP transfer.</Voice>

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



<Voice voice="legal">У fixed-price контракті limitation of liability критично важливий. Стандарт -- обмеження загальної відповідальності сумою контракту (Total project fee). Клієнт може вимагати 2x-3x від суми контракту -- не погоджуйтесь. Також обов'язково виключіть consequential damages (втрачений прибуток, втрачені можливості).</Voice>

<Voice voice="business">Liability cap = Total project fee -- це абсолютний максимум нашого ризику. Якщо проект на 50K EUR, максимум, що ми можемо втратити -- 50K EUR. Без cap теоретична відповідальність необмежена, що може загрожувати всьому бізнесу через один невдалий проект.</Voice>

<Voice voice="negotiations">Клієнт каже: "А якщо ваш баг зламає наш production?" Відповідь: "Саме тому Acceptance Criteria (Sec. 5) такі важливі -- ви перевіряєте все до деплою. Наша відповідальність обмежена сумою контракту, і це стандарт індустрії." Якщо клієнт дуже наполягає, можна запропонувати окремий Support/SLA contract після launch.</Voice>

<Voice voice="interaction">Liability cap прив'язаний до Total project fee (Sec. 1). При кожному Change Order (Sec. 6) cap автоматично зростає на суму CR. Warranty period (з Acceptance, Sec. 5) -- це період підвищеного ризику; після його закінчення наша відповідальність за дефекти мінімальна.</Voice>

## 9. Dispute Resolution



**Negotiation.** In case of any controversy or claim arising out
of this agreement, the parties shall consult and negotiate with
each other and attempt to reach a mutually satisfactory solution.

**Choice of forum.** If the parties do not reach a settlement
within a period of **60 days**, any unresolved controversy or
claim shall be settled in the **courts of England and Wales**.



<Voice voice="legal">Dispute resolution у SoW зазвичай наслідує MSA. Типові суперечки у fixed-price: "це було в scope" vs "це Out of Scope", якість deliverable при acceptance, затримки строків. Перший крок -- завжди escalation до senior management обох сторін. Якщо не допомогло -- mediation дешевше за арбітраж.</Voice>

<Voice voice="business">Найчастіший dispute у fixed-price -- scope disagreement. Профілактика: детальний Scope (Sec. 2), чіткий Out of Scope (Sec. 2.2), задокументовані Assumptions (Sec. 2.3). Якщо ці три секції написані добре, 90% суперечок не виникнуть.</Voice>

<Voice voice="negotiations">Якщо клієнт наполягає на арбітражі у своїй юрисдикції, пропонуйте компроміс: медіація спочатку (neutral ground), арбітраж тільки якщо медіація не дала результату. Це дешевше для обох сторін і зберігає бізнес-відносини.</Voice>

<Voice voice="delivery">Найкращий dispute resolution -- це хороша комунікація. Якщо project lead бачить ознаки незадоволення клієнта, ескалюйте одразу, не чекаючи формальної скарги. Щотижневі status calls + written summary -- найкраща профілактика суперечок.</Voice>

## 10. Signatures

| **Acme Services GmbH** | **Customer** |
| :---- | :---- |
| **Signature:** \_\_\_\_\_\_\_\_\_\_\_ | **Signature:** \_\_\_\_\_\_\_\_\_\_\_ |
| **[Director Name], Director** | \_\_\_\_\_\_\_\_\_\_\_ |
| Date: \_\_\_\_\_\_\_\_\_\_\_ | Date: \_\_\_\_\_\_\_\_\_\_\_ |
