::: chapter-meta
id: CHMETA-d5fde7b099875c02
code: CH-01
number: 1
title: Introduction to OPA and Rego
level: [beginner]
prerequisites: []
sections: [1.1 Why Policy as Code?, 1.2 What is OPA?, 1.3 What is Rego?, 1.4 The OPA Ecosystem]
digest: f8e99bfdf56eccc50a33aca47d691d018fcfc324848522c4250f81d58f461dfa
symbol_refs: []
semantic_role: structure
embedding_hint_importance: high
embedding_hint_scope: chapter
embedding_hint_chunk: auto
role_notes_added: True
graph_prerequisites_direct: []
graph_prerequisites_all: []
graph_neighbors: [CHMETA-e13a48ceca0d1333]
graph_degree: 1
graph_two_hop: [CHMETA-715fae85c2aafc79]
graph_three_hop: [CHMETA-682833df3d4534db]
chapter: CH-01
:::
:::

::: chapter-meta
id: CHMETA-e13a48ceca0d1333
code: CH-02
number: 2
title: Language Specification
level: [beginner]
prerequisites: []
sections: [2.1 Syntax Overview, 2.2 Grammar (Complete EBNF), 2.3 Comments and Formatting, 2.4 Metadata Annotations]
digest: 9b859cc085e6166d39a8ec413fe66733815993124b0017cca0dfbcc8c4440b6d
symbol_refs: []
semantic_role: structure
embedding_hint_importance: high
embedding_hint_scope: chapter
embedding_hint_chunk: auto
role_notes_added: True
graph_prerequisites_direct: [CH-01]
graph_prerequisites_all: [CH-01]
graph_neighbors: [CHMETA-715fae85c2aafc79, CHMETA-d5fde7b099875c02]
graph_degree: 2
graph_two_hop: [CHMETA-682833df3d4534db]
graph_three_hop: [CHMETA-71ac1fc6225ce2b1]
chapter: CH-02
:::
:::

::: chapter-meta
id: CHMETA-715fae85c2aafc79
code: CH-03
number: 3
title: Core Concepts and Evaluation Model
level: [intermediate]
prerequisites: []
sections: [3.1 World Model, 3.2 Rules — The Building Blocks, 3.3 Evaluation Semantics, 3.4 Undefined vs False, 3.5 Logical Conjunction and Disjunction, 3.6 Rule Conflicts and Resolution]
digest: e68c978763ace9e05e09ea022995bc1798926dca5b6114bbfb16b570718ed4f6
symbol_refs: []
semantic_role: structure
embedding_hint_importance: high
embedding_hint_scope: chapter
embedding_hint_chunk: auto
role_notes_added: True
graph_prerequisites_direct: [CH-02, CH-11]
graph_prerequisites_all: [CH-02, CH-11]
semantic_categories: [truth-values]
graph_neighbors: [CHMETA-682833df3d4534db, CHMETA-e13a48ceca0d1333]
graph_degree: 2
graph_two_hop: [CHMETA-d5fde7b099875c02, CHMETA-71ac1fc6225ce2b1]
graph_three_hop: []
chapter: CH-03
:::
:::

::: chapter-meta
id: CHMETA-682833df3d4534db
code: CH-04
number: 4
title: Variables, References, and Operators
level: [intermediate]
prerequisites: []
sections: [4.1 Variables and Unification, 4.2 References — Traversing Documents, 4.3 The `some` Keyword, 4.4 Operators, Assignment and Equality, Comparison Operators, Arithmetic Operators, Bitwise Operators, Membership: The `in` Operator]
digest: cab24768109a9cc27953d2926e44568a0105dd4bb4e5b00347a227d8e342ead2
symbol_refs: []
semantic_role: structure
embedding_hint_importance: high
embedding_hint_scope: chapter
embedding_hint_chunk: auto
role_notes_added: True
graph_prerequisites_direct: [CH-03]
graph_prerequisites_all: [CH-03]
semantic_categories: [unification]
graph_neighbors: [CHMETA-715fae85c2aafc79, CHMETA-71ac1fc6225ce2b1]
graph_degree: 2
graph_two_hop: [CHMETA-e13a48ceca0d1333]
graph_three_hop: [CHMETA-d5fde7b099875c02]
chapter: CH-04
:::
:::

::: chapter-meta
id: CHMETA-71ac1fc6225ce2b1
code: CH-05
number: 5
title: Control Flow and Iteration
level: [intermediate]
prerequisites: []
sections: [5.1 Logical Conjunction (AND), 5.2 Logical Disjunction (OR), 5.3 Comprehensions, 5.4 Universal Quantification (FOR ALL), 1. Using `every` (Modern, Recommended), 2. Using Negation (Helper Pattern), 3. Using Comprehensions, 5.5 Negation]
digest: 624c1fce96be9507e4a0956a8bc146e7037848ad4b0949860f1a40b6ebbd690d
symbol_refs: []
semantic_role: structure
embedding_hint_importance: high
embedding_hint_scope: chapter
embedding_hint_chunk: auto
role_notes_added: True
graph_prerequisites_direct: [CH-04, CH-08, CH-09, CH-10, CH-11, CH-14, CH-15, CH-17]
graph_prerequisites_all: [CH-04, CH-08, CH-09, CH-10, CH-11, CH-14, CH-15, CH-17]
semantic_categories: [negation]
graph_neighbors: [CHMETA-682833df3d4534db]
graph_degree: 1
graph_two_hop: [CHMETA-715fae85c2aafc79]
graph_three_hop: [CHMETA-e13a48ceca0d1333]
chapter: CH-05
:::
:::

::: concept
id: BLK-1a1e9be7c0791aec
summary: ## 📘 Preface — Why This Book Exists.
digest: ecb28284ae0b815c6785c524b8e6037569f39e32a9e9b9279860f0a4b15a35bf
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that ## 📘 Preface — Why This Book Exists..
vector_summary: ## 📘 Preface — Why This Book Exists.
:::
## 📘 Preface — Why This Book Exists
:::

::: concept
id: BLK-aab2646fb63f3856
summary: Datalog (1980s) - Logic programming for databases - Prolog (1972) - Logic programming paradigm - Relational Calculus (1970s) - Theoretical foundati...
digest: ce955f1d0d00567c5ef447ab929f71323bab75c772b00359d4c8a01e0c3d6480
symbol_refs: [Modern Distributed Systems, Datalog, Relational Calculus, Prolog]
semantic_role: architecture
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Datalog (1980s) - Logic programming for databases - Prolog (1972) - Logic programming paradigm - Relational Calculus (1970s) - Theoretical foundati....
vector_summary: Datalog (1980s) - Logic programming for databases - Prolog (1972) - Logic programming paradigm - Relational Calculus (1970s) - Theoretical foundati...
graph_neighbors: [TERM-e46fa93c46b299f4]
graph_degree: 1
graph_two_hop: []
graph_three_hop: []
:::
- **Datalog** (1980s) - Logic programming for databases - **Prolog** (1972) - Logic programming paradigm - **Relational Calculus** (1970s) - Theoretical foundations - **Modern Distributed Systems** (2010s+) - Cloud-native architectures
:::

::: concept
id: BLK-188b3f5e12b5f024
summary: This Bible serves multiple audiences with unprecedented depth:
digest: a48effe84264cefdd85ad9ce91c5792ec4776070a0aa189dd460b195ccf08ed3
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that This Bible serves multiple audiences with unprecedented depth:.
vector_summary: This Bible serves multiple audiences with unprecedented depth:
:::
This Bible serves multiple audiences with unprecedented depth:
:::

::: concept
id: BLK-67bb749c0671c42b
summary: Beginners — Practical, example-driven explanations with progressive learning 2.
digest: 792e24978734f9745f1580c7655fe8268104785517efcc98623f8c198a8e7b22
symbol_refs: [Practitioners, Enterprise Engineers, Researchers & Architects, Beginners]
semantic_role: architecture
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Beginners — Practical, example-driven explanations with progressive learning 2..
semantic_categories: [testing, theory]
vector_summary: Beginners — Practical, example-driven explanations with progressive learning 2.
graph_neighbors: [CODE-213aa0a6ee07643a, CODE-efd78ba9916ca447, CODE-141a39bba2be1ded, CODE-031e381b7120fc25, CODE-8ac93f8eb365af28]
graph_degree: 5
graph_two_hop: []
graph_three_hop: []
:::
1. **Beginners** — Practical, example-driven explanations with progressive learning 2. **Practitioners** — Design patterns, testing strategies, and deployment architectures 3. **Researchers & Architects** — Formal semantics, fixpoint models, and enterprise policy theory 4. **Enterprise Engineers** — Governance frameworks, multi-tenant patterns, and observability
:::

::: fact
id: BLK-24d056bb78be8a2d
summary: # The REGO & OPA Bible — Ultimate Expanded Edition.
digest: 9a305ddf7f88d2b595ff883fd930b3b7f8604ff0d3696f2b74ef4f12ae66625c
symbol_refs: []
semantic_role: assertion
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that # The REGO & OPA Bible — Ultimate Expanded Edition..
vector_summary: # The REGO & OPA Bible — Ultimate Expanded Edition.
:::
# The REGO & OPA Bible — Ultimate Expanded Edition
:::

::: fact
id: BLK-bcf609f83239fab7
summary: Definitive Guide to the Rego Language and the Open Policy Agent (OPA) Ecosystem.
digest: c38e92bd8efb1cabc941cac3fbdf853cc68993506905fd8ea6bf18fb72176836
symbol_refs: []
semantic_role: assertion
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Definitive Guide to the Rego Language and the Open Policy Agent (OPA) Ecosystem..
vector_summary: Definitive Guide to the Rego Language and the Open Policy Agent (OPA) Ecosystem.
:::
**Definitive Guide to the Rego Language and the Open Policy Agent (OPA) Ecosystem**
:::

::: fact
id: BLK-09dfc188b90c17d9
summary: Version: 2025-12-05 (Expanded) Author: Prof.
digest: 1edbef5985a36ee31b28b4f003fa78bc409178f9051d965cc1b1f16e5b945fe0
symbol_refs: []
semantic_role: assertion
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Version: 2025-12-05 (Expanded) Author: Prof..
vector_summary: Version: 2025-12-05 (Expanded) Author: Prof.
:::
Version: 2025-12-05 (Expanded) Author: Prof. [Your Name], Ph.D. Discipline: Computer Engineering, Logic Programming, Declarative Policy Systems
:::

::: fact
id: BLK-f27503706039bad4
summary: Rego and Open Policy Agent (OPA) are not "just another policy framework." They represent the culmination of 40+ years of declarative programming re...
digest: b98969c83fd780b9ff17fc793911c0b2d8af3474c3047e6bcad66e4df6b1fd8e
symbol_refs: []
semantic_role: assertion
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Rego and Open Policy Agent (OPA) are not "just another policy framework." They represent the culmination of 40+ years of declarative programming re....
vector_summary: Rego and Open Policy Agent (OPA) are not "just another policy framework." They represent the culmination of 40+ years of declarative programming re...
:::
Rego and Open Policy Agent (OPA) are not "just another policy framework." They represent the culmination of 40+ years of declarative programming research, drawing from:
:::

::: constraint
id: CONSTR-4e81cb406c9e17d0
chapter: 
source_id: 
type: forbidden
digest: adae5d6130a9c78185a66001988d5cd7078ecd6b33bcf10d31b6dcbe1dd1ff6e
symbol_refs: []
semantic_role: content
:::
This block describes a forbidden or disallowed behavior.
:::

::: qa
id: QA-11f97ce0266d712d
chapter: 
q: What is Definitive Guide to the Rego Language and the Open Policy Agent (OPA) Ecosystem. in the context of Rego/OPA?
a: **Definitive Guide to the Rego Language and the Open Policy Agent (OPA) Ecosystem**
reference: BLK-bcf609f83239fab7
digest: f0491c2c55af98c6e555a424fb9286c6ca0352f20da28981bdf3e8f11e743a54
symbol_refs: []
semantic_role: explanation
:::
:::

::: reasoning-chain
id: CHAIN-2e520f532a93de14
chapter: 
qa_id: QA-11f97ce0266d712d
reference: BLK-bcf609f83239fab7
semantic_categories: [truth-values]
digest: 75241ba474034fd1cb7f32aea677d7269e703acfad74a61fe489af458615f8cf
symbol_refs: []
semantic_role: content
:::
- Read the question carefully.
- Recall the relevant definition or rule.
- Match the question scenario to the rule.
- Consider edge cases (e.g., undefined vs false).
- Summarize the conclusion clearly.
:::

::: inference
id: INFER-6e2862322abea38d
from: CH-03
to: CH-11
relation: reference
digest: 4e16609fb8448cab2390b2e5d2d1f26c757133c18168777a8d6e31cd12f978a8
symbol_refs: []
semantic_role: reference
:::
If CH-03 reference CH-11, understanding CH-03 usually helps understand CH-11.
:::

::: inference
id: INFER-e295177aaefd57db
from: community-tools
to: vscode-opa
relation: used_by
digest: 2ec9cd75e32ef1a35eba67c1d4b3ceec7e2111966003ec4994632000d20f021a
symbol_refs: []
semantic_role: content
:::
If community-tools used_by vscode-opa, understanding community-tools usually helps understand vscode-opa.
:::

::: inference
id: INFER-f8cf8376de0fd3b2
from: modern-syntax-opa-10
to: if
relation: used_by
digest: 2e9e20eec7dba5ce9161a1b8eeae255e8f4f76d80b6938079f16646c0beaefb9
symbol_refs: []
semantic_role: content
:::
If modern-syntax-opa-10 used_by if, understanding modern-syntax-opa-10 usually helps understand if.
:::

::: inference
id: INFER-d391cb22670cb5f5
from: CH-05
to: n
relation: contradicts
digest: 8db76a8884cafcb9021f80b14bdc683d0679e120991c082a218a2bfd7c215342
symbol_refs: []
semantic_role: content
:::
If CH-05 contradicts n, understanding CH-05 usually helps understand n.
:::

::: inference
id: INFER-b25e791b10117e8c
from: CH-05
to: CH-08
relation: used_by
digest: f3aa86fcb56056ecac1fbd6cafc3399393af070c6e971cdb00fc240edf879d02
symbol_refs: []
semantic_role: content
:::
If CH-05 used_by CH-08, understanding CH-05 usually helps understand CH-08.
:::

::: inference
id: INFER-30936191a8878aa0
from: CH-05
to: CH-09
relation: used_by
digest: 930781d33f705a8bd7b8be8f2a614dd30954decbb56e5b9dd1218456817dd56f
symbol_refs: []
semantic_role: content
:::
If CH-05 used_by CH-09, understanding CH-05 usually helps understand CH-09.
:::

::: inference
id: INFER-03f024a9d3fcdceb
from: CH-05
to: CH-09
relation: implements
digest: 3f8211e8f189582c63783c0c69acadfc14fda27fdef82a3bc02dcd7d1d1d19da
symbol_refs: []
semantic_role: content
:::
If CH-05 implements CH-09, understanding CH-05 usually helps understand CH-09.
:::

::: inference
id: INFER-391b5467528f93db
from: CH-05
to: CH-10
relation: used_by
digest: 3828fbfdfb489e14c1357342b5449124f834a8aa140f1610bbdefc9cdaea001b
symbol_refs: []
semantic_role: content
:::
If CH-05 used_by CH-10, understanding CH-05 usually helps understand CH-10.
:::

::: inference
id: INFER-460dc16d7b899eae
from: CH-05
to: CH-11
relation: used_by
digest: 2fc959da1300b1ca0d8167ae4b42d0b97ae91e0079a390c88c776962a50639c2
symbol_refs: []
semantic_role: content
:::
If CH-05 used_by CH-11, understanding CH-05 usually helps understand CH-11.
:::

::: inference
id: INFER-18172eec1625bedc
from: CH-05
to: CH-14
relation: used_by
digest: fb604433e39a54eddb72c7e908591314d56c0e895f34bccda1e2d77f27e2b949
symbol_refs: []
semantic_role: content
:::
If CH-05 used_by CH-14, understanding CH-05 usually helps understand CH-14.
:::

::: inference
id: INFER-81f2160e58430322
from: CH-05
to: CH-15
relation: requires
digest: 6549d28033b09f3ebd4e4058e55a929dedbe520c711279af267ea9aa6ee684ab
symbol_refs: []
semantic_role: content
:::
If CH-05 requires CH-15, understanding CH-05 usually helps understand CH-15.
:::

::: inference
id: INFER-36e695eabbfa9587
from: CH-05
to: CH-15
relation: used_by
digest: e3de0fe37da68089684a17f1a904cbda8ff8b74f6f21aac284c35b07df5e7d96
symbol_refs: []
semantic_role: content
:::
If CH-05 used_by CH-15, understanding CH-05 usually helps understand CH-15.
:::

::: inference
id: INFER-d02d124e5d2e3d25
from: CH-17
to: CH-18
relation: requires
digest: db7975a9a9897077d446e98bc4c35691c35a063f14da87e5d8a227ad7c927cbc
symbol_refs: []
semantic_role: content
:::
If CH-17 requires CH-18, understanding CH-17 usually helps understand CH-18.
:::

::: inference
id: INFER-c876533cdab041a4
from: CH-17
to: CH-18
relation: extends
digest: f92126003e3e98a859deda11d15cfeb2f1b62c9e0ef0689b77f41c06205ebbab
symbol_refs: []
semantic_role: content
:::
If CH-17 extends CH-18, understanding CH-17 usually helps understand CH-18.
:::

::: inference
id: INFER-60ed9008016025d7
from: CH-05
to: CH-17
relation: used_by
digest: 4591725f9e3737dc64339419a3ef6e5a04bc651393160ffaec2899f35e9ab837
symbol_refs: []
semantic_role: content
:::
If CH-05 used_by CH-17, understanding CH-05 usually helps understand CH-17.
:::

::: inference
id: INFER-ae73acbeb349173a
from: CH-17
to: CH-18
relation: used_by
digest: ac574ff30e6a759d5c22a53d01a99110194363c2da45acc422feb33239139045
symbol_refs: []
semantic_role: content
:::
If CH-17 used_by CH-18, understanding CH-17 usually helps understand CH-18.
:::

::: inference
id: INFER-3d488dd4800b1840
from: CH-17
to: CH-18
relation: part_of
digest: dcc11874dded0d978f478f86f4825a8bbf375448c4cfaec15e18dfa1e1349c3a
symbol_refs: []
semantic_role: content
:::
If CH-17 part_of CH-18, understanding CH-17 usually helps understand CH-18.
:::

::: inference
id: INFER-d210a7c7b095c924
from: important
to: CH-19
relation: requires
digest: 2c31b40229fe709137730cc07245372ff601514fbec6b7e064a9bc7c05325145
symbol_refs: []
semantic_role: content
:::
If important requires CH-19, understanding important usually helps understand CH-19.
:::

::: inference
id: INFER-4b4d89fcdd207f3a
from: important
to: CH-19
relation: used_by
digest: 1704bf7d9d95d914dbc9355915cc90f1540811166e66909997c6524e2b787bbf
symbol_refs: []
semantic_role: content
:::
If important used_by CH-19, understanding important usually helps understand CH-19.
:::

::: inference
id: INFER-772b833bf08a37d3
from: rationale
to: maintainability
relation: used_by
digest: f0c2b275792eb735b313c9a62ef2c6061c622de9ec84c8a91895a7710d3a159c
symbol_refs: []
semantic_role: content
:::
If rationale used_by maintainability, understanding rationale usually helps understand maintainability.
:::

::: inference
id: INFER-572b18d67d944eca
from: CH-02
to: CH-01
relation: extends
digest: 9c10943c27787d3040a6d07da053da4b1ac431d3f3a6e388d9dd9c64fd287b39
symbol_refs: []
semantic_role: content
:::
If CH-02 extends CH-01, understanding CH-02 usually helps understand CH-01.
:::

::: inference
id: INFER-cd5be72ea795c948
from: CH-03
to: CH-02
relation: extends
digest: d893ce81aae1999456834cc98bf54ce78f3c931c6c954a7577840364937bc198
symbol_refs: []
semantic_role: content
:::
If CH-03 extends CH-02, understanding CH-03 usually helps understand CH-02.
:::

::: inference
id: INFER-565c03aadbdcde0f
from: CH-04
to: CH-03
relation: extends
digest: 2fcc40f27028e24397ccdbc1ac90114b75735f367a984189aa4e99af9acf1c15
symbol_refs: []
semantic_role: content
:::
If CH-04 extends CH-03, understanding CH-04 usually helps understand CH-03.
:::

::: inference
id: INFER-690eb2eb3d1e98ff
from: CH-05
to: CH-04
relation: extends
digest: d827e9aff646f7ceb1809ec30a186b8a9ec019c21189fc3e94cdec3c6a3000b2
symbol_refs: []
semantic_role: content
:::
If CH-05 extends CH-04, understanding CH-05 usually helps understand CH-04.
:::

::: pathway
id: PATH-86aca65ba7691608
from: CH-03
to: CH-02
digest: a45cf063ab8b197cf4d78a78a699791755fa10838573a36368a02ca7c755dc9d
symbol_refs: []
semantic_role: content
:::
Learning pathway from CH-03 to CH-02 via chapter dependency graph.
:::

::: pathway
id: PATH-439a2977ba961c83
from: CH-03
to: CH-11
digest: 6e35f6061536f0bb1999a4874d204608f869fc0e82a6aa6afb159cb015276ee2
symbol_refs: []
semantic_role: content
:::
Learning pathway from CH-03 to CH-11 via chapter dependency graph.
:::

::: pathway
id: PATH-2579e490d27dbbde
from: CH-05
to: CH-15
digest: d677c9df667b2a5337da34e15d7ab2ade31c5b588b0732143e1bbc1ff4e6b801
symbol_refs: []
semantic_role: content
:::
Learning pathway from CH-05 to CH-15 via chapter dependency graph.
:::

::: pathway
id: PATH-ee2d908e7542712b
from: CH-05
to: CH-10
digest: c1596ad1ef12e80778db53654b786f4b3d1d3b2fec1848f08c349825fde419bb
symbol_refs: []
semantic_role: content
:::
Learning pathway from CH-05 to CH-10 via chapter dependency graph.
:::

::: pathway
id: PATH-b2cbba2e28702283
from: CH-05
to: CH-08
digest: fff0cf9fa6f4af9cf98f77f038c00f399e815778ee5789386c57a4d8811a6c03
symbol_refs: []
semantic_role: content
:::
Learning pathway from CH-05 to CH-08 via chapter dependency graph.
:::

::: pathway
id: PATH-a2ccd3043ec6ad75
from: CH-05
to: CH-14
digest: 2c870ac2257cca0de67cea8e55914cac3277f2b367983a4a87caaeae25c4ba2a
symbol_refs: []
semantic_role: content
:::
Learning pathway from CH-05 to CH-14 via chapter dependency graph.
:::

::: pathway
id: PATH-2d078711e7000693
from: CH-05
to: CH-11
digest: 95ea2db3cd526532532632756337288df7b2313d424fcd55523f51993d0880ba
symbol_refs: []
semantic_role: content
:::
Learning pathway from CH-05 to CH-11 via chapter dependency graph.
:::

::: pathway
id: PATH-5b851d6370f9ce06
from: CH-05
to: CH-09
digest: 57f590389ecff69c9b5db736882be7c9af594ff3a680f2564bacdb8734a87cc9
symbol_refs: []
semantic_role: content
:::
Learning pathway from CH-05 to CH-09 via chapter dependency graph.
:::

::: pathway
id: PATH-df6f187ec15f4e33
from: CH-05
to: CH-04
digest: 13fd4e40d5368b228b0937bafa2ec5bc401a721e3ee4bf58cf0c1fdf569ccb55
symbol_refs: []
semantic_role: content
:::
Learning pathway from CH-05 to CH-04 via chapter dependency graph.
:::

::: pathway
id: PATH-82f5f70f873fe619
from: CH-05
to: CH-17
digest: 984781943f11bc9f190e698dd8e6482d2cfd4a457673c2c6e31085cae2272e29
symbol_refs: []
semantic_role: content
:::
Learning pathway from CH-05 to CH-17 via chapter dependency graph.
:::

::: pathway
id: PATH-4570f8f2393829da
from: CH-17
to: CH-18
digest: 542005aa5dd0b85c1fc61ba4c64615fc6216d97f59abfa2c3cfa76d34f12b269
symbol_refs: []
semantic_role: content
:::
Learning pathway from CH-17 to CH-18 via chapter dependency graph.
:::

::: pathway
id: PATH-9130d2f8f96b3757
from: CH-02
to: CH-01
digest: 205b8a43e786429cfc198530e0f05fecc53338e9d51c36ae2d4ca91d1840a731
symbol_refs: []
semantic_role: content
:::
Learning pathway from CH-02 to CH-01 via chapter dependency graph.
:::

::: pathway
id: PATH-c4403a8dc6a15998
from: CH-04
to: CH-03
digest: a869319936de268dff6efb4b0d64c25d1e361562018717a26aafba6be4407674
symbol_refs: []
semantic_role: content
:::
Learning pathway from CH-04 to CH-03 via chapter dependency graph.
:::

::: uncertainty
id: UNCERT-8a699aa655d280ed
chapter: 
source_id: 
digest: 88db6534eacce9da6fcb81c10cd196b4635d5d77139f5ae3040a45e49521f841
symbol_refs: []
semantic_role: content
:::
This content may have ambiguous or context-dependent interpretation.
:::

::: relation
id: REL-6e2862322abea38d
from: CH-03
to: CH-11
type: reference
context: However, performance may differ (covered in Chapter 11).
confidence: 0.9
from_namespace: default
to_namespace: default
digest: 55224ec2bd414b73e5136ddb9e4b4924fe86903643b5a590b5d9008ab4b206a0
symbol_refs: []
semantic_role: connection
embedding_hint_importance: low
embedding_hint_scope: local
embedding_hint_chunk: auto
:::
However, performance may differ (covered in Chapter 11).
:::

::: relation
id: REL-390697990b76b5e6
from: community-tools
to: vscode-opa
type: used_by
confidence: 0.8
evidence: support
context:  Rego linter
- **opa-idea-plugin**: IntelliJ IDEA support
- **vscode-opa**: VS Code extension
- **rego-play
from_namespace: default
to_namespace: default
source_id: community-tools
target_id: vscode-opa
relation_type: used_by
embedding_hint_importance: low
embedding_hint_scope: local
embedding_hint_chunk: auto
digest: eadee756ee14a4347e07c8288f5e062ec083e988572a9006f8459291fa6d4d76
symbol_refs: []
semantic_role: connection
:::
support
:::

::: relation
id: REL-df6ec3df654c57cd
from: modern-syntax-opa-10
to: if
type: used_by
confidence: 0.8
evidence: enables
context: **Modern Syntax (OPA 1.0+)**:
- `import rego.v1` enables modern keywords by default
- Keywords: `if`, `in`
from_namespace: default
to_namespace: default
source_id: modern-syntax-opa-10
target_id: if
relation_type: used_by
embedding_hint_importance: low
embedding_hint_scope: local
embedding_hint_chunk: auto
digest: ec20db07069f19aaaf5c8f53d34a8410227f608e69c0713a126ac53988c8db3a
symbol_refs: []
semantic_role: connection
:::
enables
:::

::: relation
id: REL-9114283e1eb99acb
from: CH-05
to: n
type: contradicts
confidence: 0.85
evidence: Unlike
context:  because they preserve actual newline characters. Unlike double-quoted strings where `\n` is a literal two
from_namespace: default
to_namespace: default
source_id: CH-05
target_id: n
relation_type: contradicts
embedding_hint_importance: low
embedding_hint_scope: local
embedding_hint_chunk: auto
digest: 5cc7bb8d169d07c25136d33cdf30a5cc6449c15672aaeccdd7d54b274eab1b93
symbol_refs: []
semantic_role: connection
:::
Unlike
:::

::: relation
id: REL-fa6316168f36e7ce
from: CH-05
to: CH-08
type: used_by
confidence: 0.8
evidence: allow
context: hem.
	Look for panics, regressions, or surprising allow/deny.
	Mutation testing:
	Mutate policies (flip c
from_namespace: default
to_namespace: default
source_id: CH-05
target_id: CH-08
relation_type: used_by
embedding_hint_importance: low
embedding_hint_scope: local
embedding_hint_chunk: auto
semantic_categories: [testing]
digest: 527320b0a028ee3dc0fc1f4554e8ceda73a64fb57cba0ab7603e0941d81ff939
symbol_refs: []
semantic_role: connection
:::
allow
:::

::: relation
id: REL-bf496641905faa53
from: CH-05
to: CH-09
type: implements
confidence: 0.9
evidence: Implement
context: t overlays – per customer/tenant customizations.
	Implement via:
	Multiple bundles merged in OPA.
	Data-drive
from_namespace: default
to_namespace: default
source_id: CH-05
target_id: CH-09
relation_type: implements
embedding_hint_importance: low
embedding_hint_scope: local
embedding_hint_chunk: auto
semantic_categories: [distribution]
digest: 47d1e48d14f90d6a543511280d0c35a19bb569f0f9f1eb27f09118db2606b3f7
symbol_refs: []
semantic_role: connection
:::
Implement
:::

::: relation
id: REL-eceb61aa33ea549f
from: CH-05
to: CH-15
type: requires
confidence: 0.9
evidence: needs
context: ty & Auditability
A compliant audit story usually needs:
•	Given:
o	bundle_revision
o	policy_version
o	in
from_namespace: default
to_namespace: default
source_id: CH-05
target_id: CH-15
relation_type: requires
embedding_hint_importance: low
embedding_hint_scope: local
embedding_hint_chunk: auto
semantic_categories: [distribution]
digest: 08da9320d90737699cee778cf6f2ca7525eb10d429801b4e1606665361451fcf
symbol_refs: []
semantic_role: connection
:::
needs
:::

::: relation
id: REL-55229de8ef0b3911
from: CH-17
to: CH-18
type: requires
confidence: 0.9
evidence: require
context: t be visible in logs”
o	“Admin role modifications require approval”
2.	LLM drafts:
o	Rego module.
o	Test su
from_namespace: default
to_namespace: default
source_id: CH-17
target_id: CH-18
relation_type: requires
embedding_hint_importance: low
embedding_hint_scope: local
embedding_hint_chunk: auto
digest: 9bbacdc9e1f4075dccd5c5683009ff64ee46665b65ce636c0ef75eb47d225b09
symbol_refs: []
semantic_role: connection
:::
require
:::

::: relation
id: REL-b5a39684b8607b02
from: CH-17
to: CH-18
type: extends
confidence: 0.9
evidence: Extends
context:  additional tests (edge cases, negative paths).
o	Extends _test.rego.
4.	Reviewer agent:
o	Summarizes behav
from_namespace: default
to_namespace: default
source_id: CH-17
target_id: CH-18
relation_type: extends
embedding_hint_importance: low
embedding_hint_scope: local
embedding_hint_chunk: auto
digest: 9580f658640bd01eaf435f39a00301a33858515c9eea43055f323e7a9dc28cb0
symbol_refs: []
semantic_role: connection
:::
Extends
:::

::: relation
id: REL-b0959e0edc414c52
from: CH-05
to: CH-17
type: used_by
confidence: 0.8
evidence: Allows
context: his pattern:
•	Keeps data access rules central.
•	Allows multiple services to enforce the same logic.
____
from_namespace: default
to_namespace: default
source_id: CH-05
target_id: CH-17
relation_type: used_by
embedding_hint_importance: low
embedding_hint_scope: local
embedding_hint_chunk: auto
digest: 770ce18d6da970169cb608a31281d1f1cb80efcf5efdfad4ac79ea68844e98ab
symbol_refs: []
semantic_role: connection
:::
Allows
:::

::: relation
id: REL-75ef71ffeff4a878
from: CH-17
to: CH-18
type: part_of
confidence: 0.7
evidence: inside
context: eport.
This turns Rego into a ground truth oracle inside an agentic system.
______________________________
from_namespace: default
to_namespace: default
source_id: CH-17
target_id: CH-18
relation_type: part_of
embedding_hint_importance: low
embedding_hint_scope: local
embedding_hint_chunk: auto
digest: 5535475de83f6abef8aaf519c0bc225c0b6588b344f696ee2ca64d87d7806bd1
symbol_refs: []
semantic_role: connection
:::
inside
:::

::: relation
id: REL-2e06bcbd06dd8ec2
from: important
to: CH-19
type: requires
confidence: 0.9
evidence: requires
context: n function (e.g., `set([1,2,3])` → `{1,2,3}`) and requires an argument. To create an empty set, use `{}` dir
from_namespace: default
to_namespace: default
source_id: important
target_id: CH-19
relation_type: requires
embedding_hint_importance: low
embedding_hint_scope: local
embedding_hint_chunk: auto
digest: a78e9cf175786224fbffa8077b217de8801020ba8ce52da9a440887ea10149b6
symbol_refs: []
semantic_role: connection
:::
requires
:::

::: relation
id: REL-00e7405f1bdc4465
from: CH-02
to: CH-01
type: extends
confidence: 0.5
evidence: Sequential chapters
context: Introduction to OPA and Rego → Language Specification
from_namespace: default
to_namespace: default
source_id: CH-02
target_id: CH-01
relation_type: extends
embedding_hint_importance: low
embedding_hint_scope: local
embedding_hint_chunk: auto
digest: 24b74094d67805d9eeef9ae661001c94e724bc63f7663dc20f447dfb2d9699b7
symbol_refs: []
semantic_role: connection
:::
Sequential chapters
:::

::: ssm-meta
id: SSMMETA-33d6c5928b456d51
compiler_version: 3.0.0
ssm_schema_version: 1.0.0
bible_version: 2025-12-05
namespace: default
digest: fcd7bf271256a414d5c79fd9853ecfbab41180ba657b2e386d6133baae290fe5
symbol_refs: []
semantic_role: content
embedding_hint_importance: low
embedding_hint_scope: local
embedding_hint_chunk: auto
:::
:::

::: part-meta
id: PARTMETA-854e19b238ba209f
part_number: I
title: FOUNDATIONS AND INTRODUCTION
chapters: [CH-01, CH-02]
digest: 89ce80152582592533747e741d5f5d0ca6650a32aba355488e328bf3e59351c0
symbol_refs: []
semantic_role: structure
embedding_hint_importance: low
embedding_hint_scope: local
embedding_hint_chunk: auto
:::
:::

::: antipattern
id: antipattern-767-1327
problem: 2
solution: # ❌ Invalid reference starts
x := [1, 2, 3][0]
y := {"name": "Alice"}.name

# ✅ Valid: Assign first
arr := [1, 2, 3]
x := arr[0]

obj := {"name": "Alice"}
y := obj.name
rationale: 
severity: low
chapter: CH-04
embedding_hint_importance: low
embedding_hint_scope: local
embedding_hint_chunk: auto
digest: 9848c99b89bd05a07d3cc6863f81ab4c1fff1b4f305cf0ce64b62b986500c5b9
symbol_refs: []
semantic_role: reference
:::
2

Solution: # ❌ Invalid reference starts
x := [1, 2, 3][0]
y := {"name": "Alice"}.name

# ✅ Valid: Assign first
arr := [1, 2, 3]
x := arr[0]

obj := {"name": "Alice"}
y := obj.name
:::

::: antipattern
id: antipattern-811-1328
problem: # ❌ Invalid: literals are values, not reference roots
x := [1, 2, 3][0]
y := {"name": "Alice"}.name
z := {1, 2, 3}[0]
solution: 
rationale: 
severity: low
chapter: CH-04
embedding_hint_importance: low
embedding_hint_scope: local
embedding_hint_chunk: auto
digest: f1cfe9915e1c862ce4be3150d9ab408876e84bda74f4d702c84ff5c2042158eb
symbol_refs: []
semantic_role: reference
:::
# ❌ Invalid: literals are values, not reference roots
x := [1, 2, 3][0]
y := {"name": "Alice"}.name
z := {1, 2, 3}[0]
:::

::: antipattern
id: antipattern-1205-1329
problem: **Common Pitfall — Existential vs Universal**:
solution: # ❌ WRONG: "Is there any element != 'foo'?"
# This is true if ANY element is not "foo"
has_non_foo if {
    items[_] != "foo"  # Existential quantification
}

# ✅ CORRECT: "Is 'foo' not in array?"
foo_not_present if {
    not "foo" in items
}

# ✅ CORRECT: "Are all elements not foo?"
all_non_foo if not any_foo

any_foo if {
    some item in items
    item == "foo"
}
rationale: 
severity: low
chapter: CH-05
embedding_hint_importance: low
embedding_hint_scope: local
embedding_hint_chunk: auto
digest: abda6aa332f509067a27de370a0ba8901175e6a5e1fa9005c0c3b83e1f8772cf
symbol_refs: []
semantic_role: antipattern
:::
**Common Pitfall — Existential vs Universal**:

Solution: # ❌ WRONG: "Is there any element != 'foo'?"
# This is true if ANY element is not "foo"
has_non_foo if {
    items[_] != "foo"  # Existential quantification
}

# ✅ CORRECT: "Is 'foo' not in array?"
foo_not_present if {
    not "foo" in items
}

# ✅ CORRECT: "Are all elements not foo?"
all_non_foo if not any_foo

any_foo if {
    some item in items
    item == "foo"
}
:::

::: antipattern
id: antipattern-1487-1330
problem: Pitfall: contains is substring, not set membership (for that use in).
solution: in)
rationale: 
severity: low
chapter: CH-05
embedding_hint_importance: low
embedding_hint_scope: local
embedding_hint_chunk: auto
digest: 8a5e9d1107429193341b7a97246f3f7d892d7879c4d54d6b0f69eb3c4f966fed
symbol_refs: []
semantic_role: antipattern
:::
Pitfall: contains is substring, not set membership (for that use in).

Solution: in)
:::

::: antipattern
id: antipattern-2290-1331
problem: Harness: performs all file I/O and passes JSON into Rego as input or data
solution: capture these
rationale: ing (rule success/failure)
severity: low
chapter: CH-05
embedding_hint_importance: low
embedding_hint_scope: local
embedding_hint_chunk: auto
digest: 16382260403ac33fd41734fc338a284362030da1d187f11110368a3c5c89c060
symbol_refs: []
semantic_role: antipattern
:::
Harness: performs all file I/O and passes JSON into Rego as input or data

Solution: capture these
:::

::: antipattern
id: antipattern-2496-1332
problem: 7.9.1 The Case Sensitivity Trap
solution: # Policy checks for lowercase "temporary"
has_meaningful_todo_keywords(file) if {
    contains(file.diff, "FIXME:")
    contains(file.diff, "temporary")  # Lowercase required
}

# ❌ TEST FAILS: Test uses "Temporary" (capital T)
test_example if {
    mock_input := {"diff": "+ // FIXME: Temporary hack"}
    # Policy doesn't match "Temporary" (capital T)
    # Test expects warning but gets none
}

# ✅ TEST PASSES: Test uses "temporary" (lowercase)
test_example if {
    mock_input := {"diff": "+ // FIXME: temporary hack"}
    # Policy matches "temporary" correctly
}
rationale: 
severity: low
chapter: CH-05
embedding_hint_importance: low
embedding_hint_scope: local
embedding_hint_chunk: auto
digest: e4d65b779f3f717941cb593dd66896e8054146c53154aa1d13192f496a7fc83c
symbol_refs: []
semantic_role: warning
:::
7.9.1 The Case Sensitivity Trap

Solution: # Policy checks for lowercase "temporary"
has_meaningful_todo_keywords(file) if {
    contains(file.diff, "FIXME:")
    contains(file.diff, "temporary")  # Lowercase required
}

# ❌ TEST FAILS: Test uses "Temporary" (capital T)
test_example if {
    mock_input := {"diff": "+ // FIXME: Temporary hack"}
    # Policy doesn't match "Temporary" (capital T)
    # Test expects warning but gets none
}

# ✅ TEST PASSES: Test uses "temporary" (lowercase)
test_example if {
    mock_input := {"diff": "+ // FIXME: temporary hack"}
    # Policy matches "temporary" correctly
}
:::

::: antipattern
id: antipattern-2623-1333
problem: use :latest tag"
	}
	Envoy / API Gateway
	Envoy external authorization filter calls OPA with HTTP headers, method, path, source IP
solution: :latest tag"
	}
	Envoy / API Gateway
	Envoy external authorization filter calls OPA with HTTP headers, method, path, source IP
rationale: 
severity: low
chapter: CH-05
embedding_hint_importance: low
embedding_hint_scope: local
embedding_hint_chunk: auto
semantic_categories: [authz]
digest: ef49f05fc00e62623384a7fca7208f7f8c7684e68d7a90c5deb88f2547f29ee2
symbol_refs: []
semantic_role: antipattern
:::
use :latest tag"
	}
	Envoy / API Gateway
	Envoy external authorization filter calls OPA with HTTP headers, method, path, source IP

Solution: :latest tag"
	}
	Envoy / API Gateway
	Envoy external authorization filter calls OPA with HTTP headers, method, path, source IP
:::

::: antipattern
id: antipattern-3422-1334
problem: become a data breach
solution: :
o	Log hashed fields (hash(email))
o	Log ids / foreign keys
o	Redact sensitive values (e
rationale: 
severity: low
chapter: CH-05
embedding_hint_importance: low
embedding_hint_scope: local
embedding_hint_chunk: auto
digest: 65d7f9bc81c0998f4bb26d57f52767171dcb86e7c5f7cff9dfc9676414dbc097
symbol_refs: []
semantic_role: antipattern
:::
become a data breach

Solution: :
o	Log hashed fields (hash(email))
o	Log ids / foreign keys
o	Redact sensitive values (e
:::

::: antipattern
id: antipattern-3802-1335
problem: be visible in logs”
o	“Admin role modifications require approval”
2
solution: s_for(user) := {"active"} if {
  not "admin" in user
rationale: 
severity: high
chapter: CH-05
embedding_hint_importance: low
embedding_hint_scope: local
embedding_hint_chunk: auto
digest: 762388c2995b36619003608ec003390d1cd05b1d8d5c467c29aadd503bf6b228
symbol_refs: []
semantic_role: antipattern
:::
be visible in logs”
o	“Admin role modifications require approval”
2

Solution: s_for(user) := {"active"} if {
  not "admin" in user
:::

::: antipattern
id: antipattern-4677-1336
problem: Pitfall 1: Accidental Variable Shadowing
solution: Inner blocks can rebind a variable name used in an outer block, changing meaning silently.
rationale: 
severity: low
chapter: CH-05
embedding_hint_importance: low
embedding_hint_scope: local
embedding_hint_chunk: auto
digest: d208eff1f79510420f105643b52f894525de278584e2830520e9342628cdd740
symbol_refs: []
semantic_role: antipattern
:::
Pitfall 1: Accidental Variable Shadowing

Solution: Inner blocks can rebind a variable name used in an outer block, changing meaning silently.
:::

::: antipattern
id: antipattern-4698-1337
problem: Pitfall 2: Unsafe Variables in Rules
solution: A variable is unsafe if it’s used in a rule head or expression but not bound on all paths in the body.
rationale: 
severity: low
chapter: CH-05
embedding_hint_importance: low
embedding_hint_scope: local
embedding_hint_chunk: auto
digest: 9b82877042ecf242e4d684ec2617d85c7d227f397722e8a5cdbdf12101c83dfa
symbol_refs: []
semantic_role: antipattern
:::
Pitfall 2: Unsafe Variables in Rules

Solution: A variable is unsafe if it’s used in a rule head or expression but not bound on all paths in the body.
:::

::: antipattern
id: antipattern-4709-1338
problem: # ❌ Unsafe: r is not always bound
deny[r] if {
    input.violations[_] == v
    v.level == "HIGH"
    r := v.reason
} else {
    # no binding for r here
}
solution: Use opa check to detect this and refactor to ensure all head variables are always bound:
rationale: } else {
    # no binding for r here
}
severity: low
chapter: CH-05
embedding_hint_importance: low
embedding_hint_scope: local
embedding_hint_chunk: auto
digest: 4e6008fc8bc62d30bce8e77578116f0f84f39aef8d4855131843b4b7eb663224
symbol_refs: []
semantic_role: antipattern
:::
# ❌ Unsafe: r is not always bound
deny[r] if {
    input.violations[_] == v
    v.level == "HIGH"
    r := v.reason
} else {
    # no binding for r here
}

Solution: Use opa check to detect this and refactor to ensure all head variables are always bound:
:::

::: antipattern
id: antipattern-4721-1339
problem: Pitfall 3: Misusing some in Comprehensions
solution: some x introduces a new variable local to the current expression. Using it incorrectly can over-constrain or under-constrain rules.
rationale: 
severity: low
chapter: CH-05
embedding_hint_importance: low
embedding_hint_scope: local
embedding_hint_chunk: auto
digest: 76352b60644c651586cae21c3319a17c7362ca85d154fbeba2d80ca863cd2875
symbol_refs: []
semantic_role: antipattern
:::
Pitfall 3: Misusing some in Comprehensions

Solution: some x introduces a new variable local to the current expression. Using it incorrectly can over-constrain or under-constrain rules.
:::

::: antipattern
id: antipattern-4723-1340
problem: some x introduces a new variable local to the current expression
solution: Here the second some i doesn’t “reuse” the first one; it introduces a new i but still scoped to the whole body in practice. Use distinct names:
rationale: 
severity: medium
chapter: CH-05
embedding_hint_importance: low
embedding_hint_scope: local
embedding_hint_chunk: auto
digest: 2d1cc441df3d97c01d6df13dd3d11b36999a3f4f99fa62cc2a2425f416c1c7a4
symbol_refs: []
semantic_role: antipattern
:::
some x introduces a new variable local to the current expression

Solution: Here the second some i doesn’t “reuse” the first one; it introduces a new i but still scoped to the whole body in practice. Use distinct names:
:::

::: antipattern
id: antipattern-4731-1341
problem: # ❌ Over-constrained: 'some i' appears twice, but you really wanted two different indices
bad if {
    some i
    arr[i] == "a"
    some i
    arr[i] == "b"
}
solution: Here the second some i doesn’t “reuse” the first one; it introduces a new i but still scoped to the whole body in practice. Use distinct names:
rationale: 
severity: low
chapter: CH-05
embedding_hint_importance: low
embedding_hint_scope: local
embedding_hint_chunk: auto
digest: e682200891ea67421939995d7cc0a4ce407451bf0292bdf3d7d84b41ccbda2b6
symbol_refs: []
semantic_role: antipattern
:::
# ❌ Over-constrained: 'some i' appears twice, but you really wanted two different indices
bad if {
    some i
    arr[i] == "a"
    some i
    arr[i] == "b"
}

Solution: Here the second some i doesn’t “reuse” the first one; it introduces a new i but still scoped to the whole body in practice. Use distinct names:
:::

::: antipattern
id: antipattern-4744-1342
problem: Pitfall 4: Assuming Global State in Rules
solution: 
rationale: 
severity: low
chapter: CH-05
embedding_hint_importance: low
embedding_hint_scope: local
embedding_hint_chunk: auto
digest: 9680d0d842d788fb41f80c7ff256fbe63bf36dc348277360f96749443b52feef
symbol_refs: []
semantic_role: antipattern
:::
Pitfall 4: Assuming Global State in Rules
:::

::: antipattern
id: antipattern-4749-1343
problem: # ❌ Misleading mental model: this does not "increment" anything
counter := counter + 1 if { ..
solution: Instead, build sets or arrays with comprehensions, then aggregate:
rationale: 
severity: low
chapter: CH-05
embedding_hint_importance: low
embedding_hint_scope: local
embedding_hint_chunk: auto
digest: 4e22195c8491845afa7ce95d6be465fc3c71d7d7c9b18854b81864283d332176
symbol_refs: []
semantic_role: antipattern
:::
# ❌ Misleading mental model: this does not "increment" anything
counter := counter + 1 if { ..

Solution: Instead, build sets or arrays with comprehensions, then aggregate:
:::

::: antipattern
id: antipattern-4767-1344
problem: Pitfall 1: Accessing Missing Fields Directly
solution: # ❌ Panics if input.user is null or missing
email := input.user.email
rationale: 
severity: low
chapter: CH-05
embedding_hint_importance: low
embedding_hint_scope: local
embedding_hint_chunk: auto
digest: e38eb33ba0c41f41c377c60dd19a47bb0b341b3d52fa2fd46234af4745199593
symbol_refs: []
semantic_role: antipattern
:::
Pitfall 1: Accessing Missing Fields Directly

Solution: # ❌ Panics if input.user is null or missing
email := input.user.email
:::

::: antipattern
id: antipattern-4769-1345
problem: # ❌ Panics if input.user is null or missing
email := input.user.email
solution: r is null or missing
email := input
rationale: 
severity: low
chapter: CH-05
embedding_hint_importance: low
embedding_hint_scope: local
embedding_hint_chunk: auto
digest: 7c31c28b586ec337979477d89ae6ed04d03a911980cdc3b942d100359072a101
symbol_refs: []
semantic_role: antipattern
:::
# ❌ Panics if input.user is null or missing
email := input.user.email

Solution: r is null or missing
email := input
:::

::: antipattern
id: antipattern-4794-1346
problem: Pitfall 2: Null vs Missing vs Falsy
solution: Missing: input.user.email → error if user missing or not object.
rationale: 
severity: low
chapter: CH-05
embedding_hint_importance: low
embedding_hint_scope: local
embedding_hint_chunk: auto
digest: 1299a2ba6ce2eda329423d8a4a30f32771a2aebe3ada2984e937bb50abeb489c
symbol_refs: []
semantic_role: antipattern
:::
Pitfall 2: Null vs Missing vs Falsy

Solution: Missing: input.user.email → error if user missing or not object.
:::

::: antipattern
id: antipattern-4811-1347
problem: Pitfall 3: Using array.concat on Non-Arrays
solution: Wrap in a safe helper or use guards:
rationale: 
severity: low
chapter: CH-05
embedding_hint_importance: low
embedding_hint_scope: local
embedding_hint_chunk: auto
digest: 66eb79797aa51202e2cd7ce6162086b253c602669e1a96eb33677a94d21f16a6
symbol_refs: []
semantic_role: antipattern
:::
Pitfall 3: Using array.concat on Non-Arrays

Solution: Wrap in a safe helper or use guards:
:::

::: antipattern
id: antipattern-4813-1348
problem: # ❌ Panics if path is null or not an array
full := concat(".", array.concat(path, [field]))
solution: Wrap in a safe helper or use guards:
rationale: 
severity: low
chapter: CH-05
embedding_hint_importance: low
embedding_hint_scope: local
embedding_hint_chunk: auto
digest: 51e3fc5747c5586579200a007008a63b8fdb5158acf590ca6ae14121627ab86d
symbol_refs: []
semantic_role: antipattern
:::
# ❌ Panics if path is null or not an array
full := concat(".", array.concat(path, [field]))

Solution: Wrap in a safe helper or use guards:
:::

::: antipattern
id: antipattern-4831-1349
problem: Pitfall 4: Equality Checks with Mixed Types
solution: # ❌ May silently fail if left/right have different types
allowed if input.user.id == data.allowed_ids[_]
rationale: 
severity: low
chapter: CH-05
embedding_hint_importance: low
embedding_hint_scope: local
embedding_hint_chunk: auto
digest: 76fe33e0cad6b480a14909cb497bdbd7a5fbf847ba1978f04bf7222e769c1c35
symbol_refs: []
semantic_role: antipattern
:::
Pitfall 4: Equality Checks with Mixed Types

Solution: # ❌ May silently fail if left/right have different types
allowed if input.user.id == data.allowed_ids[_]
:::

::: antipattern
id: antipattern-4833-1350
problem: # ❌ May silently fail if left/right have different types
allowed if input.user.id == data.allowed_ids[_]
solution: r
rationale: 
severity: low
chapter: CH-05
embedding_hint_importance: low
embedding_hint_scope: local
embedding_hint_chunk: auto
digest: c3eedfcfa2a98b1d79fcef845c9149b09aa6800c0be565c0740956e5b124f8da
symbol_refs: []
semantic_role: antipattern
:::
# ❌ May silently fail if left/right have different types
allowed if input.user.id == data.allowed_ids[_]

Solution: r
:::

::: antipattern
id: antipattern-4843-1351
problem: Pitfall 5: Assuming in Works Like SQL for All Types
solution: 
rationale: 
severity: low
chapter: CH-05
embedding_hint_importance: low
embedding_hint_scope: local
embedding_hint_chunk: auto
digest: fb52bfa97b9dc4db098e4ff48d8c1e440d4c9ce8e4194a578f5b3f3e0025997e
symbol_refs: []
semantic_role: antipattern
:::
Pitfall 5: Assuming in Works Like SQL for All Types
:::

::: antipattern
id: antipattern-4866-1352
problem: Pitfall 1: Unbounded Linear Scans on Huge Collections
solution: Better approaches:
rationale: 
severity: low
chapter: CH-05
embedding_hint_importance: low
embedding_hint_scope: local
embedding_hint_chunk: auto
digest: 8fc901f21ed6e24c53d99353768e697f1d95974f2d1db72c7215c615353cf6e2
symbol_refs: []
semantic_role: antipattern
:::
Pitfall 1: Unbounded Linear Scans on Huge Collections

Solution: Better approaches:
:::

::: antipattern
id: antipattern-4871-1353
problem: # ❌ Potentially O(N) scan on large data set every request
deny if {
    some i
    data.events[i].ip == input.client_ip
}
solution: Better approaches:
rationale: 
severity: low
chapter: CH-05
embedding_hint_importance: low
embedding_hint_scope: local
embedding_hint_chunk: auto
digest: 7f778fb62751148d85b21ac5de5236a834b588f34bb7d3ebd16b1b47ba5a79b2
symbol_refs: []
semantic_role: antipattern
:::
# ❌ Potentially O(N) scan on large data set every request
deny if {
    some i
    data.events[i].ip == input.client_ip
}

Solution: Better approaches:
:::

::: antipattern
id: antipattern-4886-1354
problem: Pitfall 2: Heavy Regex in Hot Paths
solution: # ❌ Expensive regex on every request
deny if re_match(".*(admin|root).*", input.user.name)
rationale: 
severity: low
chapter: CH-05
embedding_hint_importance: low
embedding_hint_scope: local
embedding_hint_chunk: auto
digest: 16be449800efeaedd93df55c75cf69adca25bc46cc124ec6cf784dc1fa2a4263
symbol_refs: []
semantic_role: antipattern
:::
Pitfall 2: Heavy Regex in Hot Paths

Solution: # ❌ Expensive regex on every request
deny if re_match(".*(admin|root).*", input.user.name)
:::

::: antipattern
id: antipattern-4888-1355
problem: # ❌ Expensive regex on every request
deny if re_match(".*(admin|root).*", input.user.name)
solution: r
rationale: 
severity: low
chapter: CH-05
embedding_hint_importance: low
embedding_hint_scope: local
embedding_hint_chunk: auto
digest: 61c4131a356364f91ccb18c7c8c11329fa833e16787dd88f181e874b0677d903
symbol_refs: []
semantic_role: antipattern
:::
# ❌ Expensive regex on every request
deny if re_match(".*(admin|root).*", input.user.name)

Solution: r
:::

::: antipattern
id: antipattern-4899-1356
problem: Pitfall 3: Recomputing the Same Expression Repeatedly
solution: # ❌ Recomputes parse for each use
deny if {
    re_match("admin", input.user.name)
    some p in data.profiles
    re_match("admin", input.user.name)  # repeated
}
rationale: 
severity: low
chapter: CH-05
embedding_hint_importance: low
embedding_hint_scope: local
embedding_hint_chunk: auto
digest: 0e74ea335757f3ae37ee9bbea1ca3b6723be4104a875ebe3753356c3979681d8
symbol_refs: []
semantic_role: antipattern
:::
Pitfall 3: Recomputing the Same Expression Repeatedly

Solution: # ❌ Recomputes parse for each use
deny if {
    re_match("admin", input.user.name)
    some p in data.profiles
    re_match("admin", input.user.name)  # repeated
}
:::

::: antipattern
id: antipattern-4905-1357
problem: # ❌ Recomputes parse for each use
deny if {
    re_match("admin", input.user.name)
    some p in data.profiles
    re_match("admin", input.user.name)  # repeated
}
solution: deny if {
    re_match("admin", input
rationale: 
severity: low
chapter: CH-05
embedding_hint_importance: low
embedding_hint_scope: local
embedding_hint_chunk: auto
digest: b805db5f653bb91d61414948ab1ebf53db1f6662c2aec3fe6169b2268a2b1664
symbol_refs: []
semantic_role: antipattern
:::
# ❌ Recomputes parse for each use
deny if {
    re_match("admin", input.user.name)
    some p in data.profiles
    re_match("admin", input.user.name)  # repeated
}

Solution: deny if {
    re_match("admin", input
:::

::: antipattern
id: antipattern-4920-1358
problem: Pitfall 4: Ignoring Partial Evaluation Opportunities
solution: 
rationale: 
severity: low
chapter: CH-05
embedding_hint_importance: low
embedding_hint_scope: local
embedding_hint_chunk: auto
semantic_categories: [performance]
digest: fa5c3a147ab2b8d8158f1ab638b86e126b290ddc268646478507df998fb71161
symbol_refs: []
semantic_role: antipattern
:::
Pitfall 4: Ignoring Partial Evaluation Opportunities
:::

::: antipattern
id: antipattern-4925-1359
problem: # ❌ CLI call with huge static config in input
opa eval -d policies/ -i big_config.json 'data.authz.allow'
solution: If most config is static, bake it into data and use partial evaluation:
rationale: 
severity: low
chapter: CH-05
embedding_hint_importance: low
embedding_hint_scope: local
embedding_hint_chunk: auto
semantic_categories: [performance]
digest: 546b8684cdc7d8fc0a7ee9c890064f3b74c3e3d3c1dca126851b803dd5c7bee2
symbol_refs: []
semantic_role: antipattern
:::
# ❌ CLI call with huge static config in input
opa eval -d policies/ -i big_config.json 'data.authz.allow'

Solution: If most config is static, bake it into data and use partial evaluation:
:::

::: antipattern
id: antipattern-4936-1360
problem: Pitfall 5: Overusing walk on Large Trees
solution: walk is powerful but traverses entire trees. Instead:
rationale: 
severity: low
chapter: CH-05
embedding_hint_importance: low
embedding_hint_scope: local
embedding_hint_chunk: auto
digest: 3a0101f3e2fd82a20d6377c9257f9240f32f434dda4a97740acfa0fb262f8099
symbol_refs: []
semantic_role: antipattern
:::
Pitfall 5: Overusing walk on Large Trees

Solution: walk is powerful but traverses entire trees. Instead:
:::

::: antipattern
id: antipattern-4942-1361
problem: # ❌ walk(data) over a huge universe
deny if {
    some path, value
    walk(data, [path, value])
    value == "secret"
}
solution: walk is powerful but traverses entire trees. Instead:
rationale: 
severity: low
chapter: CH-05
embedding_hint_importance: low
embedding_hint_scope: local
embedding_hint_chunk: auto
digest: 234989e2dcfbc501f21e426198fcd6306cc272c4289df7d776e96a7cb78dbc70
symbol_refs: []
semantic_role: antipattern
:::
# ❌ walk(data) over a huge universe
deny if {
    some path, value
    walk(data, [path, value])
    value == "secret"
}

Solution: walk is powerful but traverses entire trees. Instead:
:::

::: antipattern
id: antipattern-5106-1362
problem: if [ -n "$unused" ]; then
  echo "❌ Unused imports detected:"
  echo "$unused"
  exit 1
fi
solution: d" ]; then
  echo "❌ Unused imports detected:"
  echo "$unused"
  exit 1
fi
rationale: 
severity: low
chapter: CH-05
embedding_hint_importance: low
embedding_hint_scope: local
embedding_hint_chunk: auto
digest: 0dba214bdf40c31c02c114372e8088f0f4ff2de8246eb9ff013c69fb47be3a46
symbol_refs: []
semantic_role: antipattern
:::
if [ -n "$unused" ]; then
  echo "❌ Unused imports detected:"
  echo "$unused"
  exit 1
fi

Solution: d" ]; then
  echo "❌ Unused imports detected:"
  echo "$unused"
  exit 1
fi
:::

::: antipattern
id: antipattern-5126-1363
problem: 🧩 Summary — Best Way to Handle Rego Unused Imports
Method	Effectiveness	Recommended
opa fmt	❌ Does not remove unused imports	Useful, but not enough
opa check --strict	🔶 Detects unused variables, not imports	Use always
rgl (Rego Lint)	✅ Detects unused imports	Best open-source option
Styra DAS	🔥 Enterprise-grade policy analyzer	Best paid option
CI + opa inspect + jq	🔥 Fully reliable in CI	Recommended
Cursor/VSCode rules	🔶 Helps devs during coding	Recommended
solution: d Imports
Method	Effectiveness	Recommended
opa fmt	❌ Does not remove unused imports	Useful, but not enough
opa check --strict	🔶 Detects unused variables, not imports	Use always
rgl (Rego Lint)	✅ Detects unused imports	Best open-source option
Styra DAS	🔥 Enterprise-grade policy analyzer	Best paid option
CI + opa inspect + jq	🔥 Fully reliable in CI	Recommended
Cursor/VSCode rules	🔶 Helps devs during coding	Recommended
rationale: 
severity: low
chapter: CH-05
embedding_hint_importance: low
embedding_hint_scope: local
embedding_hint_chunk: auto
digest: 173d47c86810b534adedbbe740a73836894b829e5194555facb1c030cfa894c5
symbol_refs: []
semantic_role: antipattern
:::
🧩 Summary — Best Way to Handle Rego Unused Imports
Method	Effectiveness	Recommended
opa fmt	❌ Does not remove unused imports	Useful, but not enough
opa check --strict	🔶 Detects unused variables, not imports	Use always
rgl (Rego Lint)	✅ Detects unused imports	Best open-source option
Styra DAS	🔥 Enterprise-grade policy analyzer	Best paid option
CI + opa inspect + jq	🔥 Fully reliable in CI	Recommended
Cursor/VSCode rules	🔶 Helps devs during coding	Recommended

Solution: d Imports
Method	Effectiveness	Recommended
opa fmt	❌ Does not remove unused imports	Useful, but not enough
opa check --strict	🔶 Detects unused variables, not imports	Use always
rgl (Rego Lint)	✅ Detects unused imports	Best open-source option
Styra DAS	🔥 Enterprise-grade policy analyzer	Best paid option
CI + opa inspect + jq	🔥 Fully reliable in CI	Recommended
Cursor/VSCode rules	🔶 Helps devs during coding	Recommended
:::

::: antipattern
id: antipattern-5235-1364
problem: ❌ Bad
solution: ✔️ Correct
rationale: 
severity: low
chapter: CH-05
embedding_hint_importance: low
embedding_hint_scope: local
embedding_hint_chunk: auto
digest: e72e5030e363240c425f4b8fc7e44f2589028280309c8cc8557590fd8826940f
symbol_refs: []
semantic_role: antipattern
:::
❌ Bad

Solution: ✔️ Correct
:::

::: antipattern
id: antipattern-5317-1365
problem: 🧠 The Better Fix (What I Would Do)
❌ Instead of removing the import
✔️ Fix the test to use the import explicitly
import data.compliance.tech_debt
solution: of removing the import
✔️ Fix the test to use the import explicitly
import data
rationale: 
severity: low
chapter: CH-05
embedding_hint_importance: low
embedding_hint_scope: local
embedding_hint_chunk: auto
digest: e3fef71147465e54d3ae90e69f6cbabac93aaabd8cf686e5a43387a48a60e2d1
symbol_refs: []
semantic_role: antipattern
:::
🧠 The Better Fix (What I Would Do)
❌ Instead of removing the import
✔️ Fix the test to use the import explicitly
import data.compliance.tech_debt

Solution: of removing the import
✔️ Fix the test to use the import explicitly
import data
:::

::: antipattern
id: antipattern-5364-1366
problem: **Anti-Pattern:**
solution: 🛠️ Recommended Final Fix for your file
Instead of removing the unused import:
Fix the test to reference it:
package compliance.tech_debt_r14_test
rationale: 
severity: low
chapter: CH-05
embedding_hint_importance: low
embedding_hint_scope: local
embedding_hint_chunk: auto
digest: c21e2f74e3ff69c4800554add96c1c1e9548c2cc763a975ae4359d1631968c19
symbol_refs: []
semantic_role: reference
:::
**Anti-Pattern:**

Solution: 🛠️ Recommended Final Fix for your file
Instead of removing the unused import:
Fix the test to reference it:
package compliance.tech_debt_r14_test
:::

::: antipattern
id: antipattern-5394-1367
problem: ❌ But in Rego test files, a string such as:
"diff": "+ // TODO:\n+ function getUsers() {"
solution: rs() {"
rationale: 
severity: low
chapter: CH-05
embedding_hint_importance: low
embedding_hint_scope: local
embedding_hint_chunk: auto
digest: 7200e46d40277ab2bcb96c3b24f46efd37c95d729d5089a9cb4bda13637b6bd3
symbol_refs: []
semantic_role: antipattern
:::
❌ But in Rego test files, a string such as:
"diff": "+ // TODO:\n+ function getUsers() {"

Solution: rs() {"
:::

::: rationale
id: rationale-12-1368
explanation: This Book Exists
related_to: 
chapter: 
embedding_hint_importance: low
embedding_hint_scope: local
embedding_hint_chunk: auto
digest: cd8e853e1889c1b53cae0d5a0d0b56deccbac16614308c888b2bf39b66d3f881
symbol_refs: []
semantic_role: rationale
:::
This Book Exists
:::

::: rationale
id: rationale-44-1369
explanation: Traditional approaches fail because:
related_to: Microservices Architecture
chapter: CH-01
embedding_hint_importance: low
embedding_hint_scope: local
embedding_hint_chunk: auto
digest: f686f921870c2d9f14b9759a2e90cdfbd3cf4bae2683bede5fc9da0ba4102d6c
symbol_refs: []
semantic_role: rationale
:::
Traditional approaches fail because:
:::

::: rationale
id: rationale-68-1370
explanation: OPA (Open Policy Agent) is a **general-purpose policy decision engine** that:
related_to: 
chapter: CH-01
embedding_hint_importance: low
embedding_hint_scope: local
embedding_hint_chunk: auto
digest: 884d2aac56cb49a6e8c48d28b2c550bed4ab6509c191a7068a181ffb7be0347d
symbol_refs: [general-purpose policy decision engine]
semantic_role: rationale
:::
OPA (Open Policy Agent) is a **general-purpose policy decision engine** that:
:::

::: rationale
id: rationale-375-1371
explanation: When you should use opa fmt
1. Every time you write or modify Rego
Just like go fmt or black for Python:
•	run opa fmt -w before committing
•	ensures consistent indentation, spacing, rule structure
Use it when:
•	adding new policies
•	editing existing rules
•	refactoring code
•	reviewing a pull request
________________________________________
2. Automatically in CI
Use it in CI to prevent unformatted code from merging.
Why?
•	Prevents style drift
•	Prevents person-to-person formatting debates
•	Keeps code reviews focused on logic, not style
CI check:
opa fmt --diff .
Use it when you want CI to enforce a formatting contract.
________________________________________
3. Before generating OPA bundles or deploying
Formatting helps avoid:
•	unnecessary diff churn
•	unreadable bundle changes
•	merge conflicts caused by spacing differences
Use it when preparing a release or bundle.
________________________________________
4. When onboarding new developers
New devs often write inconsistent Rego.
opa fmt makes their code instantly match the organization’s style without a learning curve.
Use it during:
•	onboarding
•	training
•	AI code generation reviews
________________________________________
5. After using AI tools (Cursor, ChatGPT, GitHub Copilot, etc.)
AI-generated Rego is usually:
•	valid
•	but not formatted to OPA conventions
You should run opa fmt immediately after AI/model generation.
This is especially true if:
•	you use Prompt Engineering to generate complex Rego
•	Cursor writes policy libraries
•	models generate example data
________________________________________
6. When converting JSON/YAML schemas into Rego
If you auto-generate code (e.g., from OPA schemas), format it afterward so it becomes readable.
________________________________________
7. Anytime code readability matters
Examples:
•	cross-team policy review
•	audits
•	security reviews
•	discussions with legal/compliance teams
•	contract policy negotiations
Formatted policies reduce friction with stakeholders.
________________________________________
🚫 When NOT to use it (rare cases)
1. When investigating a bug caused by whitespace or formatting
Almost never happens in Rego, but if you're comparing raw text output or diffing a policy artifact to reproduce an issue, you might avoid opa fmt temporarily.
2. If formatting breaks a handcrafted test snapshot
If you have an exact string match test involving policy source code, formatting will change the file.
But this is extremely rare in real OPA projects.
related_to: 
chapter: CH-02
embedding_hint_importance: low
embedding_hint_scope: local
embedding_hint_chunk: auto
semantic_categories: [distribution]
digest: 81a5527dbf49f91f36fa3565902d580d9bf0e70e6a5c7a3fb86e259233a69181
symbol_refs: []
semantic_role: rationale
:::
When you should use opa fmt
1. Every time you write or modify Rego
Just like go fmt or black for Python:
•	run opa fmt -w before committing
•	ensures consistent indentation, spacing, rule structure
Use it when:
•	adding new policies
•	editing existing rules
•	refactoring code
•	reviewing a pull request
________________________________________
2. Automatically in CI
Use it in CI to prevent unformatted code from merging.
Why?
•	Prevents style drift
•	Prevents person-to-person formatting debates
•	Keeps code reviews focused on logic, not style
CI check:
opa fmt --diff .
Use it when you want CI to enforce a formatting contract.
________________________________________
3. Before generating OPA bundles or deploying
Formatting helps avoid:
•	unnecessary diff churn
•	unreadable bundle changes
•	merge conflicts caused by spacing differences
Use it when preparing a release or bundle.
________________________________________
4. When onboarding new developers
New devs often write inconsistent Rego.
opa fmt makes their code instantly match the organization’s style without a learning curve.
Use it during:
•	onboarding
•	training
•	AI code generation reviews
________________________________________
5. After using AI tools (Cursor, ChatGPT, GitHub Copilot, etc.)
AI-generated Rego is usually:
•	valid
•	but not formatted to OPA conventions
You should run opa fmt immediately after AI/model generation.
This is especially true if:
•	you use Prompt Engineering to generate complex Rego
•	Cursor writes policy libraries
•	models generate example data
________________________________________
6. When converting JSON/YAML schemas into Rego
If you auto-generate code (e.g., from OPA schemas), format it afterward so it becomes readable.
________________________________________
7. Anytime code readability matters
Examples:
•	cross-team policy review
•	audits
•	security reviews
•	discussions with legal/compliance teams
•	contract policy negotiations
Formatted policies reduce friction with stakeholders.
________________________________________
🚫 When NOT to use it (rare cases)
1. When investigating a bug caused by whitespace or formatting
Almost never happens in Rego, but if you're comparing raw text output or diffing a policy artifact to reproduce an issue, you might avoid opa fmt temporarily.
2. If formatting breaks a handcrafted test snapshot
If you have an exact string match test involving policy source code, formatting will change the file.
But this is extremely rare in real OPA projects.
:::

::: rationale
id: rationale-581-1372
explanation: It Matters**:
related_to: 
chapter: CH-03
embedding_hint_importance: low
embedding_hint_scope: local
embedding_hint_chunk: auto
digest: c30cfa96f3ef5d7bdff7f780eb8c33ad11008e21b01f53cf7d03183661b6725d
symbol_refs: []
semantic_role: rationale
:::
It Matters**:
:::

::: rationale
id: rationale-976-1373
explanation: **Dual Purpose**: Membership testing AND iteration
related_to: 
chapter: CH-04
embedding_hint_importance: low
embedding_hint_scope: local
embedding_hint_chunk: auto
semantic_categories: [testing]
digest: 39552790a4a23ecfc2cfbe5d582e83b66e6fa9b356f94ac6c3716cd5fd9180de
symbol_refs: [Dual Purpose]
semantic_role: rationale
:::
**Dual Purpose**: Membership testing AND iteration
:::

::: rationale
id: rationale-1278-1374
explanation: Purpose: Reduce collections to scalars (counts, sums, min/max, logical AND/OR).
related_to: 
chapter: CH-05
embedding_hint_importance: low
embedding_hint_scope: local
embedding_hint_chunk: auto
digest: 549e0b36e2d6d184b0e88176a6787f99f6113ab9a5b3fe5fc145d9b1843fb985
symbol_refs: []
semantic_role: rationale
:::
Purpose: Reduce collections to scalars (counts, sums, min/max, logical AND/OR).
:::

::: rationale
id: rationale-1515-1375
explanation: they preserve actual newline characters
related_to: Exception: Multi-Line Test Data
chapter: CH-05
embedding_hint_importance: low
embedding_hint_scope: local
embedding_hint_chunk: auto
digest: ddff6efbfe29532d67e329016d26ed9a9420c28afc2561d1e4ac96d0ca18f8ad
symbol_refs: []
semantic_role: rationale
:::
they preserve actual newline characters
:::

::: rationale
id: rationale-2290-1376
explanation: Harness: performs all file I/O and passes JSON into Rego as input or data.
________________________________________
7.4 Debugging with print and opa eval
print is your printf.
	Signature: print(x1, x2, ...)
	Always returns true, so you can drop it directly inside rule bodies.
debug_threshold if {
    t := input.threshold
    print("Threshold is:", t)
    t > 10
}
Where output appears
	opa eval → printed to stderr / logs.
	Embedded OPA → appears in OPA logs; your host system should capture these.
Key points
	print doesn’t alter semantics (just like adding true).
	Good for:
	Inspecting variable bindings.
	Confirming which rule body is being hit.
	Bad for:
	Production policies with PII.
	Flooding logs; use sparingly or behind a debug flag.
________________________________________
7.5 opa eval Explain & Profile Modes
opa eval is both a REPL and microscope.
Explain modes
opa eval --explain=notes -d policy.rego -i input.json 'data.authz.allow'
opa eval --explain=full  ...
	notes = high-level reasoning (rule success/failure).
	full = full derivation tree; great for debugging, painful for huge queries.
Profile mode
opa eval --profile -d . -i input.json 'data.compliance'
You get:
	Per-rule evaluation counts and cumulative time.
	A ranking of “hot” rules (the ones to optimize or refactor).
Typical workflow
	Problem: “Policy is slow for large PRs / big cluster.”
	Run: opa eval --profile ...
	Identify rules with:
	Many evaluations (thousands or millions).
	High total time.
	Refactor:
	Use sets/objects instead of scanning arrays.
	Add guard conditions (cheap predicates before expensive ones).
	Use partial evaluation (§11).
________________________________________
7.6 Common Errors and How to Diagnose Them
	rego_unsafe_var_error – unsafe variables
	# ❌ Unsafe: user appears only under negation
	deny if {
	    not blacklisted[user]
	}
Fix: Bind user outside negation.
deny if {
    user := input.user
    not blacklisted[user]
}
	rego_type_error – type mismatch
	Example: using to_number on an object, or sum over [1, "two"].
	Fix:
	Guard with is_* built-ins (is_number(x), is_array(x)).
	Normalize incoming data.
	Rule conflict errors
	Multiple complete rules with same name produce different values for same input.
	f(1) := 2
	f(1) := 3  # conflict
	For sets/partial objects this is okay (results are merged); for complete rules & functions it’s an error.
	Infinite or pathological recursion
	Patterns that refer back to themselves without a base case.
	OPA has guardrails, but logic errors can still create huge evaluation trees.
Mitigate with:
	Explicit depth counters.
	Clear base rules.
________________________________________
7.7 String Literal Handling in Tests: JSON vs Rego String Semantics
related_to: 
chapter: CH-05
embedding_hint_importance: low
embedding_hint_scope: local
embedding_hint_chunk: auto
semantic_categories: [negation, performance]
digest: feeacac3b561ceae5195c7567fad2fe15f01a9e041e9ef454ff12dfd5136a343
symbol_refs: []
semantic_role: rationale
:::
Harness: performs all file I/O and passes JSON into Rego as input or data.
________________________________________
7.4 Debugging with print and opa eval
print is your printf.
	Signature: print(x1, x2, ...)
	Always returns true, so you can drop it directly inside rule bodies.
debug_threshold if {
    t := input.threshold
    print("Threshold is:", t)
    t > 10
}
Where output appears
	opa eval → printed to stderr / logs.
	Embedded OPA → appears in OPA logs; your host system should capture these.
Key points
	print doesn’t alter semantics (just like adding true).
	Good for:
	Inspecting variable bindings.
	Confirming which rule body is being hit.
	Bad for:
	Production policies with PII.
	Flooding logs; use sparingly or behind a debug flag.
________________________________________
7.5 opa eval Explain & Profile Modes
opa eval is both a REPL and microscope.
Explain modes
opa eval --explain=notes -d policy.rego -i input.json 'data.authz.allow'
opa eval --explain=full  ...
	notes = high-level reasoning (rule success/failure).
	full = full derivation tree; great for debugging, painful for huge queries.
Profile mode
opa eval --profile -d . -i input.json 'data.compliance'
You get:
	Per-rule evaluation counts and cumulative time.
	A ranking of “hot” rules (the ones to optimize or refactor).
Typical workflow
	Problem: “Policy is slow for large PRs / big cluster.”
	Run: opa eval --profile ...
	Identify rules with:
	Many evaluations (thousands or millions).
	High total time.
	Refactor:
	Use sets/objects instead of scanning arrays.
	Add guard conditions (cheap predicates before expensive ones).
	Use partial evaluation (§11).
________________________________________
7.6 Common Errors and How to Diagnose Them
	rego_unsafe_var_error – unsafe variables
	# ❌ Unsafe: user appears only under negation
	deny if {
	    not blacklisted[user]
	}
Fix: Bind user outside negation.
deny if {
    user := input.user
    not blacklisted[user]
}
	rego_type_error – type mismatch
	Example: using to_number on an object, or sum over [1, "two"].
	Fix:
	Guard with is_* built-ins (is_number(x), is_array(x)).
	Normalize incoming data.
	Rule conflict errors
	Multiple complete rules with same name produce different values for same input.
	f(1) := 2
	f(1) := 3  # conflict
	For sets/partial objects this is okay (results are merged); for complete rules & functions it’s an error.
	Infinite or pathological recursion
	Patterns that refer back to themselves without a base case.
	OPA has guardrails, but logic errors can still create huge evaluation trees.
Mitigate with:
	Explicit depth counters.
	Clear base rules.
________________________________________
7.7 String Literal Handling in Tests: JSON vs Rego String Semantics
:::

::: rationale
id: rationale-2411-1377
explanation: Variable Binding is Preferred:**
- Explicit evaluation context: `with input as mock_input` applies to the rule evaluation, not the `count()` call
- Clearer semantics: The rule is evaluated with mocked input, then the result is counted
- More reliable: Avoids potential evaluation order issues in complex test expressions
- Better debugging: Can inspect `warnings` set before counting
related_to: 
chapter: CH-05
embedding_hint_importance: low
embedding_hint_scope: local
embedding_hint_chunk: auto
digest: 73a442f09fe67d6c5a3b7b158f807fbea36379fbd9b1b6bcf023db7795f78088
symbol_refs: [count(), with input as mock_input, warnings]
semantic_role: warning
:::
Variable Binding is Preferred:**
- Explicit evaluation context: `with input as mock_input` applies to the rule evaluation, not the `count()` call
- Clearer semantics: The rule is evaluated with mocked input, then the result is counted
- More reliable: Avoids potential evaluation order issues in complex test expressions
- Better debugging: Can inspect `warnings` set before counting
:::

::: rationale
id: rationale-2997-1378
explanation: about correctness, or write academic work
related_to: 
chapter: CH-05
embedding_hint_importance: low
embedding_hint_scope: local
embedding_hint_chunk: auto
digest: 51cb83b59ed8d6ba16dfa2a67f20bb477e4fcc1b9800f69ee52009ea28e752cb
symbol_refs: []
semantic_role: rationale
:::
about correctness, or write academic work
:::

::: rationale
id: rationale-3032-1379
explanation: Because:
	Herbrand base is finite for a given finite data and bounded terms.
	T_Pis monotonic for stratified, positive fragments.
→ Fixpoint is reached in finite steps.
________________________________________
12.3 Unification & =, :=, ==
	Unification (=): find a most general unifier (MGU) that makes two terms equal.
	If both sides partially unbound, unify them structurally.
Example:
[x, "world"] = ["hello", y]
	MGU: {x↦"hello",y↦"world"}.
	Assignment (:=): one-way binding; fails if variable is already bound to a different value.
	Equality (==): no variable binding; pure comparison.
In implementation, OPA uses a mixture of:
	Unification-like semantics to explore bindings.
	Assignments and comparisons for clarity and performance in v1 syntax.
________________________________________
12.4 Negation-as-Failure & Stratification
Rego uses NAF (Negation-as-Failure):
not p(X)
means: “it is not provable that p(X) holds”.
Formally:
"Eval"(P)⊨"not " p(t)"  "⟺"  Eval"(P)⊭p(t)
related_to: 
chapter: CH-05
embedding_hint_importance: low
embedding_hint_scope: local
embedding_hint_chunk: auto
semantic_categories: [negation, theory, unification]
digest: bbb5233a99caf52e0831a1cc1a1b1a7dcb5b0cda79d7bd3bac8376281ee9ff39
symbol_refs: []
semantic_role: rationale
:::
Because:
	Herbrand base is finite for a given finite data and bounded terms.
	T_Pis monotonic for stratified, positive fragments.
→ Fixpoint is reached in finite steps.
________________________________________
12.3 Unification & =, :=, ==
	Unification (=): find a most general unifier (MGU) that makes two terms equal.
	If both sides partially unbound, unify them structurally.
Example:
[x, "world"] = ["hello", y]
	MGU: {x↦"hello",y↦"world"}.
	Assignment (:=): one-way binding; fails if variable is already bound to a different value.
	Equality (==): no variable binding; pure comparison.
In implementation, OPA uses a mixture of:
	Unification-like semantics to explore bindings.
	Assignments and comparisons for clarity and performance in v1 syntax.
________________________________________
12.4 Negation-as-Failure & Stratification
Rego uses NAF (Negation-as-Failure):
not p(X)
means: “it is not provable that p(X) holds”.
Formally:
"Eval"(P)⊨"not " p(t)"  "⟺"  Eval"(P)⊭p(t)
:::

::: rationale
id: rationale-3051-1380
explanation: variables in negated expressions must be grounded elsewhere; otherwise, the semantics become ill-defined
related_to: 
chapter: CH-05
embedding_hint_importance: low
embedding_hint_scope: local
embedding_hint_chunk: auto
digest: 7ec4a0e8b3234def16dabcb701f892360fddeec3c72f46825181f2c61df44d71
symbol_refs: []
semantic_role: rationale
:::
variables in negated expressions must be grounded elsewhere; otherwise, the semantics become ill-defined
:::

::: rationale
id: rationale-3564-1381
explanation: Rego is JSON-native
related_to: 
chapter: CH-05
embedding_hint_importance: low
embedding_hint_scope: local
embedding_hint_chunk: auto
digest: fe51e3294afd568026e6b32f7081916f1a70f9a8ba1aeb8ff62ba7aced06e402
symbol_refs: []
semantic_role: rationale
:::
Rego is JSON-native
:::

::: rationale
id: rationale-3959-1382
explanation: **Important:** `set()` is a type conversion function (e.g., `set([1,2,3])` → `{1,2,3}`) and requires an argument. To create an empty set, use `{}` directly. Using `set()` without arguments will cause a runtime error.
________________________________________
18.4 Iteration
Implicit:
arr[_]               # all values
obj[k]               # binds k to each key
set[v]               # binds v to each member
Explicit with some ... in:
some x in arr        # values
some i, x in arr     # index, value
some k, v in obj     # key, value
some v in set        # members
________________________________________
18.5 Quantifiers
•	Existential: some x in xs { ... }
•	Universal:
o	Using every:
o	all_valid if {
o	  every x in xs {
o	    x.valid == true
o	  }
o	}
o	Or via negation:
o	all_valid if not any_invalid
o	any_invalid if {
o	  some x in xs
o	  not x.valid
o	}
________________________________________
18.6 Negation
not cond = “cannot prove cond.”
Safety: variables in cond must be bound beforehand.
deny if {
  user := input.user
  not blacklisted[user]
}
________________________________________
18.7 Built-in Highlights
•	Aggregates: count, sum, max, min
•	Strings: concat, contains, startswith, endswith, split, replace
•	Regex: regex.match, regex.split
•	JSON: json.marshal, json.unmarshal
•	Time: time.now_ns, time.parse_rfc3339_ns, time.clock
•	Crypto: crypto.sha256, io.jwt.*
________________________________________
18.8 Testing
•	Tests: package ending in _test, rules starting with test_.
•	Use with to override input, data, or built-ins.
test_admin_can_read if {
  authz.allow with input as {"user": "alice", "role": "admin"}
}
Run:
opa test .
________________________________________
18.9 Best Practices (Ultra Condensed)
•	Always opa fmt and lint.
•	Use modern syntax (import rego.v1 or future.keywords).
•	Prefer sets/objects for membership tests.
•	Avoid inline comprehensions in complex allow/deny.
•	Use helper rules with clear names.
•	Always have tests for deny/allow semantics.
________________________________________
Chapter 19 – Glossary (Rigorous)
Alphabetical list of core terms.
________________________________________
ABAC (Attribute-Based Access Control)
Access model where decisions are based on attributes of subject, resource, action, and environment, not just roles.
Allow / Deny (Effects)
Canonical authorization decision outcomes. Frequently modeled via Rego rules like allow and deny or decision documents with effects.
AST (Abstract Syntax Tree)
Tree representation of parsed input (e.g., GraphQL query), often passed to OPA as input for fine-grained policies.
Baseline Policy (Global Baseline)
Organization-wide invariant policy layer that lower layers cannot override or weaken (e.g., “No public S3 buckets”).
Bundle
A versioned tarball containing Rego policies, data, and a .manifest file. Used by OPA to load and update policies in production.
Complete Rule
A Rego rule that defines a single final value (e.g., max_conns := 10 or allow := true). Multiple definitions that produce different values for the same input cause conflicts.
ConstraintTemplate (Gatekeeper)
Kubernetes CRD that defines reusable OPA policies for Gatekeeper. Users instantiate constraints based on templates.
Correlation ID
Identifier used to tie together logs and traces across systems, included in OPA decision logs for observability.
Data (in OPA)
Persistent, relatively static information (loaded from bundles or in-memory), accessed as data.*. May mirror configuration, schemas, user roles, etc.
Decision Document
The JSON result of an OPA query (e.g., data.authz.allow or a more complex document with allow, deny, effects, risk_score).
Decision Log
Structured record of each OPA evaluation: includes path, input (or hash), result, metrics, and bundle revision, used for audit and observability.
Datalog
A subset of Prolog used for declarative logic programming, without complex function symbols. Rego is inspired by Datalog and extends it with JSON-like structures.
Deny Rule
A partial rule (often deny[msg] or deny contains msg) that accumulates violation messages, typically used in compliance and validation policies.
Effect
The semantic outcome of a policy evaluation (e.g., "allow", "deny", "warn", "override"), often encoded in decision documents.
Fixpoint
A stable interpretation of a logic program where applying the immediate consequence operator (deriving new facts) produces no new facts. Rego’s semantics can be described via least fixpoints.
Future Keywords
The future.keywords import (Rego v0.x) that enables newer language constructs like if, in, contains, every. In OPA 1.0+ this is replaced by import rego.v1.
Global Baseline
See Baseline Policy: global layer of policies applied to all services/tenants, usually with highest precedence for security.
GraphQL Policy
Policy that operates on GraphQL queries represented as AST; can enforce field-level auth, query depth, or cost.
HTTP Sidecar
Deployment pattern where OPA runs as a sidecar container next to a service, receiving authorization queries over localhost.
Input (in OPA)
Per-request JSON document provided by the caller to OPA, containing details like user, action, resource, HTTP request, etc. Accessed as input.*.
LLM (Large Language Model)
Neural network model (like ChatGPT) used to generate or refactor Rego; OPA then validates and executes resulting policies.
NAF (Negation-as-Failure)
Logic programming semantics where not p(X) means “p(X) cannot be proven.” Used in Rego for negation.
OPA (Open Policy Agent)
General-purpose policy decision engine that evaluates Rego policies against JSON inputs and data.
PDP (Policy Decision Point)
Component that computes policy decisions (e.g., OPA).
PEP (Policy Enforcement Point)
Component that enforces decisions (e.g., API gateway, Kubernetes admission controller).
Partial Evaluation (PE)
Technique where OPA specializes policies with respect to known input and data, producing an optimized, often smaller program or WASM artifact.
Partial Rule
A Rego rule that defines members of a virtual set or object incrementally (e.g., deny[msg] or roles[user] := role).
Rego
OPA’s declarative policy language, inspired by Datalog and designed for reasoning over JSON-like documents.
Regal
A dedicated linter for Rego, enforcing style and correctness rules beyond opa fmt.
Rule Conflict
Runtime error when multiple complete rules or function rules with the same name and arguments produce different values.
Schema (JSON Schema)
Formal type definition for JSON documents. OPA can use schemas to perform type checking on input or data.
Sidecar
Deployment pattern where OPA runs alongside an application in the same Pod/host, reducing network latency for policy queries.
Stateful Policy
Policy whose decision depends on past events or accumulated state. Implemented in OPA by passing state snapshots as data or input, not by mutability in Rego.
Stratification
Property of a logic program whereby cycles through negation are avoided, enabling well-defined semantics for negation-as-failure.
Temporal Policy
Policy that involves time (e.g., deadlines, windows, schedules), typically implemented with time.* built-ins and time-stamped state.
Tenant Overlay
Per-tenant policy or configuration that tightens (but does not weaken) global/domain rules, often stored under data.tenants[tenant_id].
Virtual Document
A Rego rule or package that behaves like a JSON document when queried (e.g., data.authz.allow), although it is computed on demand rather than stored.
WASM (WebAssembly)
Portable binary format that can run Rego policies compiled from OPA in multiple environments (browsers, proxies, services).
With (Keyword)
Rego keyword that allows overriding input, data, or built-ins for the scope of an expression; heavily used in testing and mocking.
Zero-Trust Architecture
Security model where no implicit trust is granted to assets or user accounts based solely on network location; OPA policies often implement zero-trust authorization logic.
related_to: 
chapter: CH-05
embedding_hint_importance: low
embedding_hint_scope: local
embedding_hint_chunk: auto
semantic_categories: [authz, distribution, negation, observability, performance, testing, theory]
digest: 8a0ab874403825c7786d0bbae314eb0e57529afce9a665d27fc7692bd2b9ae88
symbol_refs: [Important:, {1,2,3}, set([1,2,3]), set(), {}]
semantic_role: architecture
:::
**Important:** `set()` is a type conversion function (e.g., `set([1,2,3])` → `{1,2,3}`) and requires an argument. To create an empty set, use `{}` directly. Using `set()` without arguments will cause a runtime error.
________________________________________
18.4 Iteration
Implicit:
arr[_]               # all values
obj[k]               # binds k to each key
set[v]               # binds v to each member
Explicit with some ... in:
some x in arr        # values
some i, x in arr     # index, value
some k, v in obj     # key, value
some v in set        # members
________________________________________
18.5 Quantifiers
•	Existential: some x in xs { ... }
•	Universal:
o	Using every:
o	all_valid if {
o	  every x in xs {
o	    x.valid == true
o	  }
o	}
o	Or via negation:
o	all_valid if not any_invalid
o	any_invalid if {
o	  some x in xs
o	  not x.valid
o	}
________________________________________
18.6 Negation
not cond = “cannot prove cond.”
Safety: variables in cond must be bound beforehand.
deny if {
  user := input.user
  not blacklisted[user]
}
________________________________________
18.7 Built-in Highlights
•	Aggregates: count, sum, max, min
•	Strings: concat, contains, startswith, endswith, split, replace
•	Regex: regex.match, regex.split
•	JSON: json.marshal, json.unmarshal
•	Time: time.now_ns, time.parse_rfc3339_ns, time.clock
•	Crypto: crypto.sha256, io.jwt.*
________________________________________
18.8 Testing
•	Tests: package ending in _test, rules starting with test_.
•	Use with to override input, data, or built-ins.
test_admin_can_read if {
  authz.allow with input as {"user": "alice", "role": "admin"}
}
Run:
opa test .
________________________________________
18.9 Best Practices (Ultra Condensed)
•	Always opa fmt and lint.
•	Use modern syntax (import rego.v1 or future.keywords).
•	Prefer sets/objects for membership tests.
•	Avoid inline comprehensions in complex allow/deny.
•	Use helper rules with clear names.
•	Always have tests for deny/allow semantics.
________________________________________
Chapter 19 – Glossary (Rigorous)
Alphabetical list of core terms.
________________________________________
ABAC (Attribute-Based Access Control)
Access model where decisions are based on attributes of subject, resource, action, and environment, not just roles.
Allow / Deny (Effects)
Canonical authorization decision outcomes. Frequently modeled via Rego rules like allow and deny or decision documents with effects.
AST (Abstract Syntax Tree)
Tree representation of parsed input (e.g., GraphQL query), often passed to OPA as input for fine-grained policies.
Baseline Policy (Global Baseline)
Organization-wide invariant policy layer that lower layers cannot override or weaken (e.g., “No public S3 buckets”).
Bundle
A versioned tarball containing Rego policies, data, and a .manifest file. Used by OPA to load and update policies in production.
Complete Rule
A Rego rule that defines a single final value (e.g., max_conns := 10 or allow := true). Multiple definitions that produce different values for the same input cause conflicts.
ConstraintTemplate (Gatekeeper)
Kubernetes CRD that defines reusable OPA policies for Gatekeeper. Users instantiate constraints based on templates.
Correlation ID
Identifier used to tie together logs and traces across systems, included in OPA decision logs for observability.
Data (in OPA)
Persistent, relatively static information (loaded from bundles or in-memory), accessed as data.*. May mirror configuration, schemas, user roles, etc.
Decision Document
The JSON result of an OPA query (e.g., data.authz.allow or a more complex document with allow, deny, effects, risk_score).
Decision Log
Structured record of each OPA evaluation: includes path, input (or hash), result, metrics, and bundle revision, used for audit and observability.
Datalog
A subset of Prolog used for declarative logic programming, without complex function symbols. Rego is inspired by Datalog and extends it with JSON-like structures.
Deny Rule
A partial rule (often deny[msg] or deny contains msg) that accumulates violation messages, typically used in compliance and validation policies.
Effect
The semantic outcome of a policy evaluation (e.g., "allow", "deny", "warn", "override"), often encoded in decision documents.
Fixpoint
A stable interpretation of a logic program where applying the immediate consequence operator (deriving new facts) produces no new facts. Rego’s semantics can be described via least fixpoints.
Future Keywords
The future.keywords import (Rego v0.x) that enables newer language constructs like if, in, contains, every. In OPA 1.0+ this is replaced by import rego.v1.
Global Baseline
See Baseline Policy: global layer of policies applied to all services/tenants, usually with highest precedence for security.
GraphQL Policy
Policy that operates on GraphQL queries represented as AST; can enforce field-level auth, query depth, or cost.
HTTP Sidecar
Deployment pattern where OPA runs as a sidecar container next to a service, receiving authorization queries over localhost.
Input (in OPA)
Per-request JSON document provided by the caller to OPA, containing details like user, action, resource, HTTP request, etc. Accessed as input.*.
LLM (Large Language Model)
Neural network model (like ChatGPT) used to generate or refactor Rego; OPA then validates and executes resulting policies.
NAF (Negation-as-Failure)
Logic programming semantics where not p(X) means “p(X) cannot be proven.” Used in Rego for negation.
OPA (Open Policy Agent)
General-purpose policy decision engine that evaluates Rego policies against JSON inputs and data.
PDP (Policy Decision Point)
Component that computes policy decisions (e.g., OPA).
PEP (Policy Enforcement Point)
Component that enforces decisions (e.g., API gateway, Kubernetes admission controller).
Partial Evaluation (PE)
Technique where OPA specializes policies with respect to known input and data, producing an optimized, often smaller program or WASM artifact.
Partial Rule
A Rego rule that defines members of a virtual set or object incrementally (e.g., deny[msg] or roles[user] := role).
Rego
OPA’s declarative policy language, inspired by Datalog and designed for reasoning over JSON-like documents.
Regal
A dedicated linter for Rego, enforcing style and correctness rules beyond opa fmt.
Rule Conflict
Runtime error when multiple complete rules or function rules with the same name and arguments produce different values.
Schema (JSON Schema)
Formal type definition for JSON documents. OPA can use schemas to perform type checking on input or data.
Sidecar
Deployment pattern where OPA runs alongside an application in the same Pod/host, reducing network latency for policy queries.
Stateful Policy
Policy whose decision depends on past events or accumulated state. Implemented in OPA by passing state snapshots as data or input, not by mutability in Rego.
Stratification
Property of a logic program whereby cycles through negation are avoided, enabling well-defined semantics for negation-as-failure.
Temporal Policy
Policy that involves time (e.g., deadlines, windows, schedules), typically implemented with time.* built-ins and time-stamped state.
Tenant Overlay
Per-tenant policy or configuration that tightens (but does not weaken) global/domain rules, often stored under data.tenants[tenant_id].
Virtual Document
A Rego rule or package that behaves like a JSON document when queried (e.g., data.authz.allow), although it is computed on demand rather than stored.
WASM (WebAssembly)
Portable binary format that can run Rego policies compiled from OPA in multiple environments (browsers, proxies, services).
With (Keyword)
Rego keyword that allows overriding input, data, or built-ins for the scope of an expression; heavily used in testing and mocking.
Zero-Trust Architecture
Security model where no implicit trust is granted to assets or user accounts based solely on network location; OPA policies often implement zero-trust authorization logic.
:::

::: rationale
id: rationale-4107-1383
explanation: := "Global: public writes forbidden"
}
related_to: 
chapter: CH-05
embedding_hint_importance: low
embedding_hint_scope: local
embedding_hint_chunk: auto
digest: 365a0835908eae1f07b53f3a1a5211f9c6a9180866eabf8a5ed0302af600c955
symbol_refs: []
semantic_role: rationale
:::
:= "Global: public writes forbidden"
}
:::

::: rationale
id: rationale-4114-1384
explanation: := "Domain(EU): consent required"
}
related_to: 
chapter: CH-05
embedding_hint_importance: low
embedding_hint_scope: local
embedding_hint_chunk: auto
digest: 7022c0fd3867c727743e18ab6cd5b422c4f7220532b94d997bf375d8056b8789
symbol_refs: []
semantic_role: rationale
:::
:= "Domain(EU): consent required"
}
:::

::: rationale
id: rationale-4121-1385
explanation: := "Team(Billing): admin role required"
}
related_to: 
chapter: CH-05
embedding_hint_importance: low
embedding_hint_scope: local
embedding_hint_chunk: auto
digest: cac0c7f6ae1401949392de4866c56bd606eb5acde0018e22a107401a7c752b4c
symbol_refs: []
semantic_role: rationale
:::
:= "Team(Billing): admin role required"
}
:::

::: rationale
id: rationale-4128-1386
explanation: := "Tenant override: feature-x beta allow"
}
related_to: 
chapter: CH-05
embedding_hint_importance: low
embedding_hint_scope: local
embedding_hint_chunk: auto
digest: b02c0077dfbcb95584b2120f52c1cbde82f15f182ae947d56d6d769b01770f7d
symbol_refs: []
semantic_role: rationale
:::
:= "Tenant override: feature-x beta allow"
}
:::

::: rationale
id: rationale-4139-1387
explanation: if {
    some r
    r := global_deny[r]  # global always first
} or {
    some r
    r := domain_deny[r]
} or {
    some r
    r := team_deny[r]
}
related_to: 
chapter: CH-05
embedding_hint_importance: low
embedding_hint_scope: local
embedding_hint_chunk: auto
digest: c2f5d64edaeb8ffd98185999dbe6e9817ace82997dd7f4c607f20d81a4e5605e
symbol_refs: []
semantic_role: rationale
:::
if {
    some r
    r := global_deny[r]  # global always first
} or {
    some r
    r := domain_deny[r]
} or {
    some r
    r := team_deny[r]
}
:::

::: rationale
id: rationale-4182-1388
explanation: Audit trails (who allowed what, when, and why).
related_to: 
chapter: CH-05
embedding_hint_importance: low
embedding_hint_scope: local
embedding_hint_chunk: auto
digest: c0f4d00fc28a20f1f353d3b9d34960c15686db4ad94a8cc4687716eef2ad87ac
symbol_refs: []
semantic_role: rationale
:::
Audit trails (who allowed what, when, and why).
:::

::: rationale
id: rationale-4303-1389
explanation: epoch)
    now := time
related_to: 
chapter: CH-05
embedding_hint_importance: low
embedding_hint_scope: local
embedding_hint_chunk: auto
digest: adab83084be69723576562ea8d103b345da033a0f2c52ca8c9d4117fe49ab145
symbol_refs: []
semantic_role: rationale
:::
epoch)
    now := time
:::

::: rationale
id: rationale-4709-1390
explanation: } else {
    # no binding for r here
}
related_to: 
chapter: CH-05
embedding_hint_importance: low
embedding_hint_scope: local
embedding_hint_chunk: auto
digest: 4bf1aaa764b271f535a06c420615aec2f6d6cdc56114df709e18b4bbdd3a7ea2
symbol_refs: []
semantic_role: rationale
:::
} else {
    # no binding for r here
}
:::

::: rationale
id: rationale-4719-1391
explanation: some v in input
related_to: 
chapter: CH-05
embedding_hint_importance: low
embedding_hint_scope: local
embedding_hint_chunk: auto
digest: 2f6c1913d2eaf27ba2bb79d24fb189c8c2aa18cb97a302487ceb785124cee42c
symbol_refs: []
semantic_role: rationale
:::
some v in input
:::

::: rationale
id: rationale-5078-1392
explanation: Why?
related_to: 
chapter: CH-05
embedding_hint_importance: low
embedding_hint_scope: local
embedding_hint_chunk: auto
digest: 907e915190880a387ca440d53f6a8c7fd11e6a5c6339cb17add36093b6a74ff7
symbol_refs: []
semantic_role: rationale
:::
Why?
:::

::: rationale
id: rationale-5137-1394
explanation: tests that depend on bare rule names (warn, deny, allow, audit, etc
related_to: 
chapter: CH-05
embedding_hint_importance: low
embedding_hint_scope: local
embedding_hint_chunk: auto
digest: fc439d95bd0bf7ab91033e32d3067eae6ea73e18ef1097b10eede0737eb476d1
symbol_refs: []
semantic_role: rationale
:::
tests that depend on bare rule names (warn, deny, allow, audit, etc
:::

::: rationale
id: rationale-5168-1395
explanation: the test never uses tech_debt
related_to: 
chapter: CH-05
embedding_hint_importance: low
embedding_hint_scope: local
embedding_hint_chunk: auto
digest: b4e347c5723a5c0b02f9067686fe0420b5f9126754c176a1ab68f4f453f5d1d7
symbol_refs: []
semantic_role: rationale
:::
the test never uses tech_debt
:::

::: rationale
id: rationale-5210-1396
explanation: OPA never needs the alias tech_debt to find the rule
related_to: 
chapter: CH-05
embedding_hint_importance: low
embedding_hint_scope: local
embedding_hint_chunk: auto
digest: f40ca5025f8cf03f248fab12b4f3f00f6ea2aec26b346ccb491bfa498bb7e93d
symbol_refs: []
semantic_role: rationale
:::
OPA never needs the alias tech_debt to find the rule
:::

::: rationale
id: rationale-5212-1397
explanation: this is risky
related_to: 
chapter: CH-05
embedding_hint_importance: low
embedding_hint_scope: local
embedding_hint_chunk: auto
digest: 1e7404b384ce35c528cdabde525535b4ccf72793adad3bbc13035f6dc1d91c15
symbol_refs: []
semantic_role: rationale
:::
this is risky
:::

::: rationale
id: rationale-5258-1398
explanation: tests still work
related_to: 
chapter: CH-05
embedding_hint_importance: low
embedding_hint_scope: local
embedding_hint_chunk: auto
digest: c09a747eebb6f898969a4459208f16787a336deca8a287aac00553571f30436b
symbol_refs: []
semantic_role: rationale
:::
tests still work
:::

::: rationale
id: rationale-5260-1399
explanation: Because:
related_to: 
chapter: CH-05
embedding_hint_importance: low
embedding_hint_scope: local
embedding_hint_chunk: auto
digest: 19c395b37a01f25da9eebff04e17a1c273ef117747ccf3f5c6f4f2d29da25190
symbol_refs: []
semantic_role: rationale
:::
Because:
:::

::: rationale
id: rationale-5283-1400
explanation: Why?
1. Bare rule names (warn) are ambiguous
related_to: 
chapter: CH-05
embedding_hint_importance: low
embedding_hint_scope: local
embedding_hint_chunk: auto
digest: 729a871bedef9ec017ba5106424a8a6fe559e6eefdb81bb2212723e8a61d04f9
symbol_refs: []
semantic_role: rationale
:::
Why?
1. Bare rule names (warn) are ambiguous
:::

::: rationale
id: rationale-5362-1401
explanation: **Rationale:**
1. **Ambiguity Prevention**: Multiple packages may define rules with common names (`warn`, `deny`, `allow`). Explicit references eliminate ambiguity.
2. **Maintainability**: Tests remain stable when new policies are added that might introduce naming conflicts.
3. **Clarity**: Explicit references make test intent clear and reduce cognitive load during code review.
4. **Refactoring Safety**: Policy package reorganization doesn't break tests that use explicit references.
related_to: 
chapter: CH-05
embedding_hint_importance: low
embedding_hint_scope: local
embedding_hint_chunk: auto
digest: 4b09f4a9be0c2ba1c21e3ead148b2457d5d6b17d0a0e9e45d5c368b007e8e0cd
symbol_refs: [warn, Refactoring Safety, Clarity, Maintainability, deny, allow, Rationale:, Ambiguity Prevention]
semantic_role: reference
:::
**Rationale:**
1. **Ambiguity Prevention**: Multiple packages may define rules with common names (`warn`, `deny`, `allow`). Explicit references eliminate ambiguity.
2. **Maintainability**: Tests remain stable when new policies are added that might introduce naming conflicts.
3. **Clarity**: Explicit references make test intent clear and reduce cognitive load during code review.
4. **Refactoring Safety**: Policy package reorganization doesn't break tests that use explicit references.
:::

::: rationale
id: rationale-5391-1402
explanation: JSON escapes it as a newline character
related_to: 
chapter: CH-05
embedding_hint_importance: low
embedding_hint_scope: local
embedding_hint_chunk: auto
digest: 8278c6ef986b978d6b6e43d5d5697b248b8a935a614c3fbb7dbea257a32bc38e
symbol_refs: []
semantic_role: rationale
:::
JSON escapes it as a newline character
:::

::: rationale
id: rationale-5428-1403
explanation: the three affected tests fail
1
related_to: 
chapter: CH-05
embedding_hint_importance: low
embedding_hint_scope: local
embedding_hint_chunk: auto
digest: 89655c9233ad2980a7c71cc5ae74ca13e9eb234bd5cf1db1bddd7db9b856014b
symbol_refs: []
semantic_role: rationale
:::
the three affected tests fail
1
:::

::: rationale
id: rationale-5472-1404
explanation: does this fail?
related_to: 
chapter: CH-05
embedding_hint_importance: low
embedding_hint_scope: local
embedding_hint_chunk: auto
digest: 67aadc221f74ccb6caa35bbb2fb40ab506c2648eb08b1bac85d2437a0de14444
symbol_refs: []
semantic_role: rationale
:::
does this fail?
:::

::: rationale
id: rationale-5474-1405
explanation: your test framework wraps the diff in a JSON string inside Rego, so additional escaping happens, e
related_to: 
chapter: CH-05
embedding_hint_importance: low
embedding_hint_scope: local
embedding_hint_chunk: auto
digest: 378c311f8e71b311edd31f6d6d8ccb91eeadfdf64e20f87584f6a2b9c7f7ff31
symbol_refs: []
semantic_role: rationale
:::
your test framework wraps the diff in a JSON string inside Rego, so additional escaping happens, e
:::

::: rationale
id: rationale-5499-1406
explanation: whitespace escaping does NOT behave like in JSON
related_to: 
chapter: CH-05
embedding_hint_importance: low
embedding_hint_scope: local
embedding_hint_chunk: auto
digest: 7aedf36a602e6357016107bd009f16d2f61c737da7c4a9df745d1f6b6cf0ff61
symbol_refs: []
semantic_role: rationale
:::
whitespace escaping does NOT behave like in JSON
:::

::: rationale
id: rationale-5501-1407
explanation: direct opa eval --input JSON works
related_to: 
chapter: CH-05
embedding_hint_importance: low
embedding_hint_scope: local
embedding_hint_chunk: auto
digest: c8423ffc3f2f56e1f102b4e9e5b75c9f96ec351bd4cfa4f04f754db0be62874f
symbol_refs: []
semantic_role: rationale
:::
direct opa eval --input JSON works
:::

::: rationale
id: rationale-5503-1408
explanation: JSON → OPA decoding translates \n into real newlines
related_to: 
chapter: CH-05
embedding_hint_importance: low
embedding_hint_scope: local
embedding_hint_chunk: auto
digest: 5dad0b7a8a3a29eedc6800c0808653964d696218ac5215222e806e1af0a5c3e7
symbol_refs: []
semantic_role: rationale
:::
JSON → OPA decoding translates \n into real newlines
:::

::: rationale
id: rationale-5555-1409
explanation: you’re building an enterprise system:
related_to: 
chapter: CH-05
embedding_hint_importance: low
embedding_hint_scope: local
embedding_hint_chunk: auto
digest: 40cbb5a3cb0e5f7b36c83acf01c22cea1ef5fe3ff6c9ef9834ea7fa1f8a92fde
symbol_refs: []
semantic_role: rationale
:::
you’re building an enterprise system:
:::

::: contrast
id: contrast-182-1410
concept_a: Community Tools**:
- **Regal**: Official Rego linter
- **opa-idea-plugin**: IntelliJ IDEA support
- **vscode-opa**:
concept_b: Code extension
- **rego-playground**: Web-based testing
differences: **Community Tools**:
- **Regal**: Official Rego linter
- **opa-idea-plugin**: IntelliJ IDEA support
- **vscode-opa**: VS Code extension
- **rego-playground**: Web-based testing
chapter: CH-01
embedding_hint_importance: low
embedding_hint_scope: local
embedding_hint_chunk: auto
semantic_categories: [testing]
digest: 9bdfd19778529841d306403bd137820afb3a4dafdb629d4026f12200d9d52d72
symbol_refs: []
semantic_role: comparison
:::
Community Tools**:
- **Regal**: Official Rego linter
- **opa-idea-plugin**: IntelliJ IDEA support
- **vscode-opa**: vs Code extension
- **rego-playground**: Web-based testing

**Community Tools**:
- **Regal**: Official Rego linter
- **opa-idea-plugin**: IntelliJ IDEA support
- **vscode-opa**: VS Code extension
- **rego-playground**: Web-based testing
:::

::: contrast
id: contrast-559-1411
concept_a: Undefined
concept_b: False
differences: 3.4 Undefined vs False
chapter: CH-03
embedding_hint_importance: low
embedding_hint_scope: local
embedding_hint_chunk: auto
semantic_categories: [truth-values]
digest: 3186c5f2d25982338fd54fdf8effbf28472ebb149e3dc9642b83bbf68e815d69
symbol_refs: []
semantic_role: comparison
:::
Undefined vs False

3.4 Undefined vs False
:::

::: contrast
id: contrast-802-1412
concept_a: What Cannot Start a Reference (Literals
concept_b: References)
differences: 4.2 What Cannot Start a Reference (Literals vs References)
chapter: CH-04
embedding_hint_importance: low
embedding_hint_scope: local
embedding_hint_chunk: auto
digest: 0cc799a7872c11c3f270ae1390984c9df4842a175d0a2cb22ba6c0eebfd0845a
symbol_refs: []
semantic_role: reference
:::
What Cannot Start a Reference (Literals vs References)

4.2 What Cannot Start a Reference (Literals vs References)
:::

::: contrast
id: contrast-1205-1413
concept_a: Common Pitfall — Existential
concept_b: Universal**:
differences: **Common Pitfall — Existential vs Universal**:
chapter: CH-05
embedding_hint_importance: low
embedding_hint_scope: local
embedding_hint_chunk: auto
digest: 5125274577da9052fe3553f657c320367c51025a811d4d0cc60d0c4fdd1c2827
symbol_refs: []
semantic_role: comparison
:::
Common Pitfall — Existential vs Universal**:

**Common Pitfall — Existential vs Universal**:
:::

::: contrast
id: contrast-1272-1414
concept_a: Error Semantics: Strict
concept_b: non-strict behavior
differences: Error Semantics: Strict vs non-strict behavior
chapter: CH-05
embedding_hint_importance: low
embedding_hint_scope: local
embedding_hint_chunk: auto
digest: 5a04177c408028794ff0be604ba8fe90d9ea7c0a81caddee3473271be7582ef8
symbol_refs: []
semantic_role: comparison
:::
Error Semantics: Strict vs non-strict behavior

Error Semantics: Strict vs non-strict behavior
:::

::: contrast
id: contrast-1346-1415
concept_a: Indexing
concept_b: slicing:
differences: Indexing vs slicing:
chapter: CH-05
embedding_hint_importance: low
embedding_hint_scope: local
embedding_hint_chunk: auto
digest: f32bfcad4349c2d7b060152e783747ed571591073a9fb2f4eccb169a697a8d1d
symbol_refs: []
semantic_role: comparison
:::
Indexing vs slicing:

Indexing vs slicing:
:::

::: contrast
id: contrast-1656-1416
concept_a: Parse JWT payload manually (not recommended
concept_b: io
differences: # Parse JWT payload manually (not recommended vs io.jwt.* but illustrative)
parts := split(input.token, ".")
payload_b64 := parts[1]
payload_json := base64url.decode(payload_b64)
claims := json.unmarshal(payload_json)
chapter: CH-05
embedding_hint_importance: low
embedding_hint_scope: local
embedding_hint_chunk: auto
digest: 8e6a5d1b4095d68d5f9c06fb26a92ef7a89d87b938775863cae7466c55f6a5dd
symbol_refs: []
semantic_role: comparison
:::
Parse JWT payload manually (not recommended vs io

# Parse JWT payload manually (not recommended vs io.jwt.* but illustrative)
parts := split(input.token, ".")
payload_b64 := parts[1]
payload_json := base64url.decode(payload_b64)
claims := json.unmarshal(payload_json)
:::

::: contrast
id: contrast-2177-1417
concept_a: Unit Tests
concept_b: Integration Tests vs “Golden” Tests
Testing & Tooling
differences: ________________________________________
7.3 Unit Tests vs Integration Tests vs “Golden” Tests
Testing & Tooling
chapter: CH-05
embedding_hint_importance: low
embedding_hint_scope: local
embedding_hint_chunk: auto
semantic_categories: [testing]
digest: 6c273f4deed7f267800ba259bcf1ce23654d5ee20df01ca7569a2caa0026be8e
symbol_refs: []
semantic_role: comparison
:::
Unit Tests vs Integration Tests vs “Golden” Tests
Testing & Tooling

________________________________________
7.3 Unit Tests vs Integration Tests vs “Golden” Tests
Testing & Tooling
:::

::: contrast
id: contrast-2290-1418
concept_a: String Literal Handling in Tests: JSON
concept_b: Rego String Semantics
differences: Rule conflict errors
	Multiple complete rules with same name produce different values for same input
chapter: CH-05
embedding_hint_importance: low
embedding_hint_scope: local
embedding_hint_chunk: auto
digest: 7e0b9de0ac5a7e02372ca3f4208ea56e532ae85d05260fbcd84f9d8790fa8a3c
symbol_refs: []
semantic_role: comparison
:::
String Literal Handling in Tests: JSON vs Rego String Semantics

Rule conflict errors
	Multiple complete rules with same name produce different values for same input
:::

::: contrast
id: contrast-2292-1419
concept_a: A critical distinction exists between how string literals are interpreted in JSON inputs
concept_b: Rego test files
differences: A critical distinction exists between how string literals are interpreted in JSON inputs versus Rego test files
chapter: CH-05
embedding_hint_importance: low
embedding_hint_scope: local
embedding_hint_chunk: auto
digest: 29d38c714a0c8c09726051411d3eb4f9bebb829fb7273a370a65dfbdef104dfd
symbol_refs: []
semantic_role: comparison
:::
A critical distinction exists between how string literals are interpreted in JSON inputs vs Rego test files

A critical distinction exists between how string literals are interpreted in JSON inputs versus Rego test files
:::

::: contrast
id: contrast-2355-1420
concept_a: When to Use Raw Strings
concept_b: Double-Quoted:**
- **Raw strings (backticks)**: Multi-line content
differences: **When to Use Raw Strings vs Double-Quoted:**
- **Raw strings (backticks)**: Multi-line content, actual newlines needed, regex patterns matching line breaks
- **Double-quoted**: Single-line content, escape sequences acceptable, JSON-like strings
chapter: CH-05
embedding_hint_importance: low
embedding_hint_scope: local
embedding_hint_chunk: auto
digest: 7fdf8cd4c288d91ccf5f40cf69a12b8a61f99194cc109d55cbb5df29b6407d5a
symbol_refs: []
semantic_role: comparison
:::
When to Use Raw Strings vs Double-Quoted:**
- **Raw strings (backticks)**: Multi-line content

**When to Use Raw Strings vs Double-Quoted:**
- **Raw strings (backticks)**: Multi-line content, actual newlines needed, regex patterns matching line breaks
- **Double-quoted**: Single-line content, escape sequences acceptable, JSON-like strings
:::

::: contrast
id: contrast-2384-1421
concept_a: Direct Evaluation
concept_b: Variable Binding
differences: 7.8.1 Direct Evaluation vs Variable Binding
chapter: CH-05
embedding_hint_importance: low
embedding_hint_scope: local
embedding_hint_chunk: auto
digest: a84e580f502f68981123eb3ced6d3c4ec6ae1ba4922bc1c519ad222ff91b88a4
symbol_refs: []
semantic_role: comparison
:::
Direct Evaluation vs Variable Binding

7.8.1 Direct Evaluation vs Variable Binding
:::

::: contrast
id: contrast-2743-1422
concept_a: Compare decisions
concept_b: stable
differences: Compare decisions vs stable
chapter: CH-05
embedding_hint_importance: low
embedding_hint_scope: local
embedding_hint_chunk: auto
digest: 80242025544f4ddeace43d1089dba464166b24b7c15fac3fe7f483e542394fbc
symbol_refs: []
semantic_role: comparison
:::
Compare decisions vs stable

Compare decisions vs stable
:::

::: contrast
id: contrast-3051-1423
concept_a: Partial
concept_b: Complete Rules: Semantic Interpretation
	Complete rule (one final value):
	max_memory := 4 if
differences: ________________________________________
12.5 Partial vs Complete Rules: Semantic Interpretation
	Complete rule (one final value):
	max_memory := 4 if ..
chapter: CH-05
embedding_hint_importance: low
embedding_hint_scope: local
embedding_hint_chunk: auto
digest: 17efe4c46fa30060845afced13cb87a657411170416fa5ba339b9ff8c222a791
symbol_refs: []
semantic_role: comparison
:::
Partial vs Complete Rules: Semantic Interpretation
	Complete rule (one final value):
	max_memory := 4 if

________________________________________
12.5 Partial vs Complete Rules: Semantic Interpretation
	Complete rule (one final value):
	max_memory := 4 if ..
:::

::: contrast
id: contrast-4026-1424
concept_a: Chapter 8 – Deployment Topologies (Sidecar
concept_b: Central vs Embedded)
8
differences: Chapter 8 – Deployment Topologies (Sidecar vs Central vs Embedded)
8.X Topology Overview Diagram
chapter: CH-05
embedding_hint_importance: low
embedding_hint_scope: local
embedding_hint_chunk: auto
digest: 2ac470a9829cde6f4fef8fc8240e9461aa0a532b223bcd4f6b96efeee399f4ae
symbol_refs: []
semantic_role: architecture
:::
Chapter 8 – Deployment Topologies (Sidecar vs Central vs Embedded)
8

Chapter 8 – Deployment Topologies (Sidecar vs Central vs Embedded)
8.X Topology Overview Diagram
:::

::: contrast
id: contrast-4091-1425
concept_a: EU
concept_b: US data rules)
differences: Domain: Variants per product/region (e.g., EU vs US data rules).
chapter: CH-05
embedding_hint_importance: low
embedding_hint_scope: local
embedding_hint_chunk: auto
digest: 2d4137a09903fa5141400a2d53455794b98eea1ac117a8e8be95ce4740bafa5c
symbol_refs: []
semantic_role: comparison
:::
EU vs US data rules)

Domain: Variants per product/region (e.g., EU vs US data rules).
:::

::: contrast
id: contrast-4362-1426
concept_a: authz/
concept_b: pricing/)
differences: Using disjoint roots (e.g., authz/ vs pricing/).
chapter: CH-05
embedding_hint_importance: low
embedding_hint_scope: local
embedding_hint_chunk: auto
digest: 6e326e1fcb31303d0b715b0af3eeed8d28ae10d5ad0a7f618a06755293c7c115
symbol_refs: []
semantic_role: comparison
:::
authz/ vs pricing/)

Using disjoint roots (e.g., authz/ vs pricing/).
:::

::: contrast
id: contrast-4794-1427
concept_a: Pitfall 2: Null
concept_b: Missing vs Falsy
differences: Pitfall 2: Null vs Missing vs Falsy
chapter: CH-05
embedding_hint_importance: low
embedding_hint_scope: local
embedding_hint_chunk: auto
digest: 89d29c43d19d4c65969d6d481cd6a362bce5c59d9bc646e96b170fcad665a471
symbol_refs: []
semantic_role: comparison
:::
Pitfall 2: Null vs Missing vs Falsy

Pitfall 2: Null vs Missing vs Falsy
:::

::: contrast
id: contrast-5425-1428
concept_a: They are being accessed — the content is just
concept_b: what your rules assume
differences: They are being accessed — the content is just different from what your rules assume.
chapter: CH-05
embedding_hint_importance: low
embedding_hint_scope: local
embedding_hint_chunk: auto
digest: 8169fe35012214974d5d8dfc758ce5a9076de7e06cd405a7df913cdba291e807
symbol_refs: []
semantic_role: comparison
:::
They are being accessed — the content is just vs what your rules assume

They are being accessed — the content is just different from what your rules assume.
:::

::: term
id: TERM-7a1b28224d1efb01
name: OPA's Solution
definition: Externalize policy logic into a declarative language that: - Runs anywhere (Kubernetes, API gateways, applications, CI/CD) - Evaluates consistently - Supports auditing and testing - Enables policy-as-code workflows
aliases: []
chapter: CH-01
digest: 1ffbb67f8eb62dbd47fcb9b50b427fcc72741bed0c026910ee886468b4ae495c
symbol_refs: [OPA's Solution]
semantic_role: definition
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
semantic_categories: [testing]
vector_summary: Externalize policy logic into a declarative language that: - Runs anywhere (Kubernetes, API gateways, applications, CI/CD) - Evaluates consistently - Supports auditing and testing - Enables policy-as-code workflows
:::
:::

::: concept
id: BLK-382d8e86d5d4bffc
summary: Modern distributed systems face unprecedented complexity:.
digest: 059323c73cac38c5036f5a2c75cf86a88c2f661ed64a5ef37d46c00a06304049
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Modern distributed systems face unprecedented complexity:..
vector_summary: Modern distributed systems face unprecedented complexity:.
chapter: CH-01
:::
Modern distributed systems face unprecedented complexity:
:::

::: concept
id: BLK-c7dcd752342ecff0
summary: Traditional approaches fail because:.
digest: 6c629d62745cb1c0fc17f5ab6e593273ca455867544ae0d7b965281490a890d4
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Traditional approaches fail because:..
vector_summary: Traditional approaches fail because:.
chapter: CH-01
:::
Traditional approaches fail because:
:::

::: concept
id: BLK-efdaa64e667461dd
summary: RBAC Limitations: Role-based access control cannot express: - Context-dependent decisions - Attribute-based logic - Relationship-based access - Tim...
digest: 629e34fed86c769bf14c11edbdafe7f4bbd1d0a028d12caa92c776538187ad98
symbol_refs: [RBAC Limitations]
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that RBAC Limitations: Role-based access control cannot express: - Context-dependent decisions - Attribute-based logic - Relationship-based access - Tim....
semantic_categories: [authz]
vector_summary: RBAC Limitations: Role-based access control cannot express: - Context-dependent decisions - Attribute-based logic - Relationship-based access - Tim...
chapter: CH-01
:::
2. **RBAC Limitations**: Role-based access control cannot express: - Context-dependent decisions - Attribute-based logic - Relationship-based access - Time-based constraints
:::

::: concept
id: BLK-363d990e2c667210
summary: Lack of Portability: Policies tied to specific languages/frameworks.
digest: fe63e6bb9aa704c4d64b2d2c5a18256633c847e3e2c390b8a33ebe0717c9e66d
symbol_refs: [Lack of Portability]
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Lack of Portability: Policies tied to specific languages/frameworks..
vector_summary: Lack of Portability: Policies tied to specific languages/frameworks.
chapter: CH-01
:::
3. **Lack of Portability**: Policies tied to specific languages/frameworks
:::

::: concept
id: BLK-f280742f145feb92
summary: Kubernetes Admission Control - Gatekeeper validates/mutates resources - Prevents non-compliant deployments - Enforces security policies.
digest: d77292943d839fe2a41f0cbcab38d1bcdd7f1b7233d8d41f9cbbe2782ae72b4e
symbol_refs: [Kubernetes Admission Control]
semantic_role: architecture
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Kubernetes Admission Control - Gatekeeper validates/mutates resources - Prevents non-compliant deployments - Enforces security policies..
vector_summary: Kubernetes Admission Control - Gatekeeper validates/mutates resources - Prevents non-compliant deployments - Enforces security policies.
chapter: CH-01
:::
1. **Kubernetes Admission Control** - Gatekeeper validates/mutates resources - Prevents non-compliant deployments - Enforces security policies
:::

::: concept
id: BLK-f8b1ab79fa1735f0
summary: API Gateways & Service Meshes - Envoy External Authorization - Istio/Linkerd integration - Kong/Traefik plugins.
digest: f512d928fb83f368d7ec14b5ac6b5e93896e42db874f9da51aeb2106ac41628c
symbol_refs: [API Gateways & Service Meshes]
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that API Gateways & Service Meshes - Envoy External Authorization - Istio/Linkerd integration - Kong/Traefik plugins..
semantic_categories: [authz]
vector_summary: API Gateways & Service Meshes - Envoy External Authorization - Istio/Linkerd integration - Kong/Traefik plugins.
graph_neighbors: [CODE-1f681853ebf733fb, CODE-3152b6a89a146d23, CODE-4d2ad0d6df9f48c1, CODE-e3021412b7e801e0, CODE-e8a2139bac84c4a0, CODE-ff0c5e5c7e41a636, CODE-322fb8a04486fb51, CODE-22a3c940e76c1893, CODE-ae589d488d5196d2, CODE-4b643428b4f2edd0, CODE-f9165857ee2c0c68]
graph_degree: 11
graph_two_hop: []
graph_three_hop: []
chapter: CH-01
:::
2. **API Gateways & Service Meshes** - Envoy External Authorization - Istio/Linkerd integration - Kong/Traefik plugins
:::

::: concept
id: BLK-b695e4fd74c356a4
summary: Application Authorization - Microservices decisions - GraphQL field authorization - Database query filtering.
digest: 5b0b3d51b8b68168788b454d7824419d939ecbd1e093026e98c63564efec24a9
symbol_refs: [Application Authorization]
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Application Authorization - Microservices decisions - GraphQL field authorization - Database query filtering..
semantic_categories: [authz]
vector_summary: Application Authorization - Microservices decisions - GraphQL field authorization - Database query filtering.
graph_neighbors: [CODE-1f681853ebf733fb, CODE-3152b6a89a146d23, CODE-4d2ad0d6df9f48c1, CODE-e3021412b7e801e0, CODE-e8a2139bac84c4a0, CODE-ff0c5e5c7e41a636, CODE-322fb8a04486fb51, CODE-22a3c940e76c1893, CODE-ae589d488d5196d2, CODE-4b643428b4f2edd0, CODE-f9165857ee2c0c68]
graph_degree: 11
graph_two_hop: []
graph_three_hop: []
chapter: CH-01
:::
4. **Application Authorization** - Microservices decisions - GraphQL field authorization - Database query filtering
:::

::: fact
id: BLK-ea6c1037e9ae2b22
summary: Microservices Architecture: 10-1000+ services requiring consistent authorization - Zero-Trust Networks: Every request must be authenticated and aut...
digest: 2f2aadda6fcb4112a828ff9785678e610e8cdd58fc8816a5170fd7e10f7b5241
symbol_refs: []
semantic_role: architecture
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Microservices Architecture: 10-1000+ services requiring consistent authorization - Zero-Trust Networks: Every request must be authenticated and aut....
semantic_categories: [authz]
vector_summary: Microservices Architecture: 10-1000+ services requiring consistent authorization - Zero-Trust Networks: Every request must be authenticated and aut...
chapter: CH-01
:::
- **Microservices Architecture**: 10-1000+ services requiring consistent authorization - **Zero-Trust Networks**: Every request must be authenticated and authorized - **Multi-Cloud Deployments**: Policies must work across AWS, Azure, GCP, on-prem - **Regulatory Compliance**: GDPR, HIPAA, SOC2, PCI-DSS requirements - **Dynamic Infrastructure**: Kubernetes, service meshes, serverless functions
:::

::: fact
id: BLK-deebb1848e375afc
summary: Hardcoded Logic: Authorization embedded in application code creates: - Inconsistency across services - Difficult auditing and compliance - Slow pol...
digest: 6803fe28effd712c6e13b24473396a856b9550d02628a84747ea1640599f19b7
symbol_refs: []
semantic_role: architecture
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Hardcoded Logic: Authorization embedded in application code creates: - Inconsistency across services - Difficult auditing and compliance - Slow pol....
semantic_categories: [authz]
vector_summary: Hardcoded Logic: Authorization embedded in application code creates: - Inconsistency across services - Difficult auditing and compliance - Slow pol...
chapter: CH-01
:::
1. **Hardcoded Logic**: Authorization embedded in application code creates: - Inconsistency across services - Difficult auditing and compliance - Slow policy updates requiring redeployments - No centralized visibility
:::

::: fact
id: BLK-9b13ed19c42c1aac
summary: OPA (Open Policy Agent) is a general-purpose policy decision engine that:.
digest: 005d7fa37878b907841bf13f11463c8f336bbe5c9760cd9265ae22aa61283d61
symbol_refs: []
semantic_role: assertion
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that OPA (Open Policy Agent) is a general-purpose policy decision engine that:..
vector_summary: OPA (Open Policy Agent) is a general-purpose policy decision engine that:.
chapter: CH-01
:::
OPA (Open Policy Agent) is a **general-purpose policy decision engine** that:
:::

::: fact
id: BLK-a944c2c95e8b60cc
summary: CI/CD Pipelines - Infrastructure-as-Code validation - Terraform plan analysis - Docker image policy enforcement.
digest: d80c71e9e804d2021eb5677bd9dadd3353d23d656103615409865830e32e03d1
symbol_refs: []
semantic_role: assertion
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that CI/CD Pipelines - Infrastructure-as-Code validation - Terraform plan analysis - Docker image policy enforcement..
vector_summary: CI/CD Pipelines - Infrastructure-as-Code validation - Terraform plan analysis - Docker image policy enforcement.
chapter: CH-01
:::
3. **CI/CD Pipelines** - Infrastructure-as-Code validation - Terraform plan analysis - Docker image policy enforcement
:::

::: fact
id: BLK-c3fda219db4b4a9e
summary: Cloud Security - AWS IAM policy validation - Azure ARM template scanning - GCP resource compliance.
digest: be910ddf056d93d63fbb511fabcd7051ec86ed41a5a81f553f9e81d426295cc1
symbol_refs: []
semantic_role: assertion
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Cloud Security - AWS IAM policy validation - Azure ARM template scanning - GCP resource compliance..
vector_summary: Cloud Security - AWS IAM policy validation - Azure ARM template scanning - GCP resource compliance.
chapter: CH-01
:::
5. **Cloud Security** - AWS IAM policy validation - Azure ARM template scanning - GCP resource compliance
:::

::: fact
id: BLK-40e7559486f5e766
summary: Rego is a declarative logic language with unique characteristics:.
digest: b2efb8b4dfba782d40b0d63ac3cccffd2033946a3c94d6e7fcfed38ed6daf837
symbol_refs: []
semantic_role: assertion
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Rego is a declarative logic language with unique characteristics:..
vector_summary: Rego is a declarative logic language with unique characteristics:.
chapter: CH-01
:::
Rego is a **declarative logic language** with unique characteristics:
:::

::: example
id: CODE-005dd023ebcc6940
language: rego
chapter: CH-01
source: term:Architecture Model
purpose: definition-example
digest: 9a4770709e0866673797877701ec3e7d1204e71ce8ed664da3b2562c62865445
symbol_refs: []
semantic_role: example
embedding_hint_importance: medium
embedding_hint_scope: local
embedding_hint_chunk: auto
:::
┌─────────────┐
│ Application │
└──────┬──────┘
       │ Query
       ▼
┌─────────────┐     ┌──────────┐
│     OPA     │────▶│ Policies │
│   Engine    │     └──────────┘
└──────┬──────┘
       │ Decision
       ▼
┌─────────────┐
│   Result    │
└─────────────┘
:::

::: example
id: CODE-ab5611427fe142db
language: rego
chapter: CH-01
source: term:Design Philosophy
purpose: definition-example
digest: eb6a57ab1f35d584bb5405d54b990d8abc0c8e6df3a8a33aa98b0ad6021525b4
symbol_refs: []
semantic_role: example
embedding_hint_importance: medium
embedding_hint_scope: local
embedding_hint_chunk: auto
:::
SQL:  Queries over relational tables
Rego: Queries over hierarchical JSON documents
:::

::: example
id: CODE-86e2fac48990bc06
language: python
chapter: CH-01
source: term:Example Comparison
purpose: definition-example
digest: 37beac4af7da8138cbbe961cc86cb742154ac27cec68f92f25aac2eadb8551c9
symbol_refs: [user, is_admin, role]
semantic_role: example
embedding_hint_importance: medium
embedding_hint_scope: local
embedding_hint_chunk: auto
:::
# Python (Procedural)
def is_admin(user):
    if user is None:
        return False
    if 'roles' not in user:
        return False
    for role in user['roles']:
        if role == 'admin':
            return True
    return False
:::

::: example
id: CODE-83a1975da93b48d8
language: rego
chapter: CH-01
source: term:Example Comparison
purpose: definition-example
digest: 58155527d6860f701c2eecfcf34d500f155501f2e966b5e5b2d718dc93c8fac4
symbol_refs: []
semantic_role: example
embedding_hint_importance: medium
embedding_hint_scope: local
embedding_hint_chunk: auto
:::
# Rego (Declarative)
is_admin if "admin" in input.user.roles
:::

::: code-pattern
id: CODE-d4560f3ef9c1c8e2
chapter: CH-01
language: python
role: code-pattern:python-structure
tags: [python]
pattern_type: python-structure
digest: 1188db9fa071e6c08024bab1452532b0523f0dde048a529a06c7187f3dd1fd0b
symbol_refs: [user, is_admin, role]
semantic_role: pattern
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
:::
# Python (Procedural)
def is_admin(user):
    if user is None:
        return False
    if 'roles' not in user:
        return False
    for role in user['roles']:
        if role == 'admin':
            return True
    return False
:::

::: table
id: TABLE-9e656aa852fe3e8f
chapter: CH-01
headers: [Aspect, Procedural (Python/Java), Declarative (Rego)]
row_count: 5
caption: 
rows: [['Focus', 'How to compute', 'What should be true'], ['Execution', 'Sequential steps', 'Search-based evaluation'], ['Variables', 'Mutable state', 'Immutable bindings'], ['Control Flow', 'if/for/while', 'Logical conjunction/disjunction'], ['Side Effects', 'Common', 'Prohibited']]
digest: 127066b3e42a7eb3aa0f599d30dce70325c07f0d84eb49d46bb5f80e94d99760
symbol_refs: []
semantic_role: reference
embedding_hint_importance: low
embedding_hint_scope: local
embedding_hint_chunk: auto
:::
:::

::: table
id: TABLE-ca9fb1ed9ebf3089
chapter: CH-01
type: dos-donts
headers: [Do, Don't]
rows: [['Microservices Architecture: 10-1000+ services requiring consistent authorization - Zero-Trust Networks: Every request must be authenticated and aut...', ''], ['Hardcoded Logic: Authorization embedded in application code creates: - Inconsistency across services - Difficult auditing and compliance - Slow pol...', ''], ['OPA (Open Policy Agent) is a general-purpose policy decision engine that:.', ''], ['CI/CD Pipelines - Infrastructure-as-Code validation - Terraform plan analysis - Docker image policy enforcement.', ''], ['Cloud Security - AWS IAM policy validation - Azure ARM template scanning - GCP resource compliance.', ''], ['Rego is a declarative logic language with unique characteristics:.', '']]
semantic_categories: [authz]
digest: 700c3678f3b723370ab1c6df183ab8cb738c8d49cb9a7231884bee0cb61b652c
symbol_refs: []
semantic_role: architecture
:::
| Do | Don't |
| --- | --- |
| Microservices Architecture: 10-1000+ services requiring consistent authorization - Zero-Trust Networks: Every request must be authenticated and aut... |  |
| Hardcoded Logic: Authorization embedded in application code creates: - Inconsistency across services - Difficult auditing and compliance - Slow pol... |  |
| OPA (Open Policy Agent) is a general-purpose policy decision engine that:. |  |
| CI/CD Pipelines - Infrastructure-as-Code validation - Terraform plan analysis - Docker image policy enforcement. |  |
| Cloud Security - AWS IAM policy validation - Azure ARM template scanning - GCP resource compliance. |  |
| Rego is a declarative logic language with unique characteristics:. |  |
:::

::: qa
id: QA-7fd331f59b31937f
chapter: CH-01
q: What is OPA's Solution in the context of Rego/OPA?
a: Externalize policy logic into a declarative language that: - Runs anywhere (Kubernetes, API gateways, applications, CI/CD) - Evaluates consistently - Supports auditing and testing - Enables policy-as-code workflows
reference: TERM-7a1b28224d1efb01
semantic_categories: [testing]
digest: 47819494051e50821a92c7638fe61285da098f409afbecc7567bc88a004b9b88
symbol_refs: []
semantic_role: explanation
:::
:::

::: qa
id: QA-3f340460853b3ead
chapter: CH-01
q: What is Modern distributed systems face unprecedented complexity in the context of Rego/OPA?
a: Modern distributed systems face unprecedented complexity:
reference: BLK-382d8e86d5d4bffc
digest: 8d2d54e2beffebdb19647621c81794ffbdc2450cca8f4a38b2a9193ae4c60259
symbol_refs: []
semantic_role: explanation
:::
:::

::: reasoning-chain
id: CHAIN-52053a86ff2fbfc2
chapter: CH-01
qa_id: QA-7fd331f59b31937f
reference: TERM-7a1b28224d1efb01
semantic_categories: [truth-values]
digest: f7816efe0eb32dbd755a99cdb6ac1b4c8868979c8f505d1a42d609b84e6e21ef
symbol_refs: []
semantic_role: content
:::
- Read the question carefully.
- Recall the relevant definition or rule.
- Match the question scenario to the rule.
- Consider edge cases (e.g., undefined vs false).
- Summarize the conclusion clearly.
:::

::: role-note
id: ROLE-b43048dfaa3c4437
chapter: CH-01
role: Policy Author
guidance: Focus on correctness & clarity of rules in this chapter.
digest: e8686f05c9ea64c69b7e6a5ac75effa1133223742bcefc5ff7b87c8ba831a744
symbol_refs: []
semantic_role: content
:::
:::

::: diagram
id: DIAG-157573d5d7a6e5d9
chapter: CH-01
language: ascii
diagram_type: diagram
summary: diagram diagram
nodes: [{'id': 'node_0', 'label': 'Application'}, {'id': 'node_1', 'label': 'Query ▼ ┌─────────────┐     ┌──────────┐ OPA     ────▶ Policies'}, {'id': 'node_2', 'label': 'OPA     ────▶ Policies'}, {'id': 'node_3', 'label': 'Decision ▼ ┌─────────────┐ Result'}, {'id': 'node_4', 'label': 'Result'}]
edges: []
normalized_content: [Application]
[Query ▼ ┌─────────────┐     ┌──────────┐ OPA     ────▶ Policies]
[OPA     ────▶ Policies]
[Decision ▼ ┌─────────────┐ Result]
[Result]
digest: 7297e939c78738599cb5ec1d32e37efd10f737b13cbc734281354817c1f2ea6b
symbol_refs: []
semantic_role: visualization
embedding_hint_importance: medium
embedding_hint_scope: local
embedding_hint_chunk: auto
:::
┌─────────────┐
│ Application │
└──────┬──────┘
       │ Query
       ▼
┌─────────────┐     ┌──────────┐
│     OPA     │────▶│ Policies │
│   Engine    │     └──────────┘
└──────┬──────┘
       │ Decision
       ▼
┌─────────────┐
│   Result    │
└─────────────┘
:::

::: test-hint
id: TEST-b115a71ce58827de
chapter: CH-01
source_id: CODE-83a1975da93b48d8
digest: ae94a462661b2f1c5a425e0545f4c92f7a9244480a2888eb7582990265a2230c
symbol_refs: []
semantic_role: content
:::
Convert this snippet into a unit test by constructing input and asserting allow/deny.
:::

::: section-meta
id: SECMETA-1238e5d26f0d67ba
title: 1.1 Why Policy as Code?
level: 3
chapter: CH-01
parent_section: None
line_no: 33
digest: b047f4b96f0f561271239b4161ec3f2861024a659c071fc9aeeb0bd9f6a62fa3
symbol_refs: []
semantic_role: structure
token_range: (33, 33)
char_offset: (2560, 2583)
source_ref: {'line': 33, 'column': 0}
embedding_hint_importance: low
embedding_hint_scope: local
embedding_hint_chunk: auto
:::
:::

::: term
id: TERM-52f0b79a221e0655
name: Modern Syntax (OPA 1.0+)
definition: - `import rego.v1` enables modern keywords by default - Keywords: `if`, `in`, `contains`, `every` - Legacy syntax still supported with `--v0-compatible`
aliases: []
chapter: CH-02
digest: 61d20b87109eaa493c16b9c6ce80f7415238b5f58662a8aa119a73fc478619f4
symbol_refs: [Modern Syntax (OPA 1.0+)]
semantic_role: definition
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
vector_summary: - `import rego.v1` enables modern keywords by default - Keywords: `if`, `in`, `contains`, `every` - Legacy syntax still supported with `--v0-compatible`
:::
:::

::: concept
id: CODE-eb4e22abb4667ba3
chapter: CH-02
language: rego
role: code-pattern:authorization:allow-rule
tags: [authorization, allow-rule]
explanation: scope: document
confidence: 0.9
digest: c0e823856d36fc15b96f5fa8851319e4164ea0d5752994d2d6612486a04e53f7
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
semantic_categories: [authz]
vector_summary: package authz.api
:::
package authz.api

:::

::: fact
id: BLK-f06f72fec6a23bfd
summary: A Rego module consists of three components:.
digest: cc1b435db0a02c2d18a2b17021d326b62e4daf8eb4c9d2f76048485dc3254f90
symbol_refs: []
semantic_role: assertion
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that A Rego module consists of three components:..
vector_summary: A Rego module consists of three components:.
chapter: CH-02
:::
A Rego module consists of three components:
:::

::: fact
id: BLK-b1486f7db7792024
summary: When you should use opa fmt 1.
digest: deba12ec75cc63dbe7a179e9659b155d9b55fed613efc15d6d339863f8b1a446
symbol_refs: []
semantic_role: assertion
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that When you should use opa fmt 1..
semantic_categories: [distribution]
vector_summary: When you should use opa fmt 1.
chapter: CH-02
:::
When you should use opa fmt 1. Every time you write or modify Rego Just like go fmt or black for Python: • run opa fmt -w before committing • ensures consistent indentation, spacing, rule structure Use it when: • adding new policies • editing existing rules • refactoring code • reviewing a pull request ________________________________________ 2. Automatically in CI Use it in CI to prevent unformatted code from merging. Why? • Prevents style drift • Prevents person-to-person formatting debates • Keeps code reviews focused on logic, not style CI check: opa fmt --diff . Use it when you want CI to enforce a formatting contract. ________________________________________ 3. Before generating OPA bundles or deploying Formatting helps avoid: • unnecessary diff churn • unreadable bundle changes • merge conflicts caused by spacing differences Use it when preparing a release or bundle. ________________________________________ 4. When onboarding new developers New devs often write inconsistent Rego. opa fmt makes their code instantly match the organization’s style without a learning curve. Use it during: • onboarding • training • AI code generation reviews ________________________________________ 5. After using AI tools (Cursor, ChatGPT, GitHub Copilot, etc.) AI-generated Rego is usually: • valid • but not formatted to OPA conventions You should run opa fmt immediately after AI/model generation. This is especially true if: • you use Prompt Engineering to generate complex Rego • Cursor writes policy libraries • models generate example data ________________________________________ 6. When converting JSON/YAML schemas into Rego If you auto-generate code (e.g., from OPA schemas), format it afterward so it becomes readable. ________________________________________ 7. Anytime code readability matters Examples: • cross-team policy review • audits • security reviews • discussions with legal/compliance teams • contract policy negotiations Formatted policies reduce friction with stakeholders. ________________________________________ 🚫 When NOT to use it (rare cases) 1. When investigating a bug caused by whitespace or formatting Almost never happens in Rego, but if you're comparing raw text output or diffing a policy artifact to reproduce an issue, you might avoid opa fmt temporarily. 2. If formatting breaks a handcrafted test snapshot If you have an exact string match test involving policy source code, formatting will change the file. But this is extremely rare in real OPA projects.
:::

::: example
id: CODE-8d7b448579651102
language: rego
chapter: CH-02
source: term:Reserved Keywords
purpose: definition-example
digest: 5a543013049dc09bf10e4762c1fc768ef68d1cc168be6a25ddab15fd239eafb0
symbol_refs: [some, in]
semantic_role: example
embedding_hint_importance: medium
embedding_hint_scope: local
embedding_hint_chunk: auto
:::
as       default   else      every     false
if       import    in        input     not
null     package   some      true      with
data
:::

::: example
id: CODE-feca7c6c91b820bb
language: bash
chapter: CH-02
source: term:Formatting Tool
purpose: definition-example
digest: c9699c071b95446312da163982b988f1eaa9840bc76abd55dfaf8c9ab4de776c
symbol_refs: []
semantic_role: example
embedding_hint_importance: medium
embedding_hint_scope: local
embedding_hint_chunk: auto
:::
# Format all files in directory
opa fmt --write .

# Check formatting (CI)
opa fmt --fail .

# Use Rego v1 syntax
opa fmt --rego-v1 --write .
:::

::: example
id: CODE-b53a3bf42bfabaf9
language: rego
chapter: CH-02
source: term:Queryable Metadata
purpose: definition-example
digest: a7044033fe7286fee67a63c72c354bf192b47a6fc2ec33ff11e14db9ccaa03e9
symbol_refs: [chain_metadata, rule_metadata]
semantic_role: example
embedding_hint_importance: medium
embedding_hint_scope: local
embedding_hint_chunk: auto
:::
rule_metadata := rego.metadata.rule()
chain_metadata := rego.metadata.chain()
:::

::: example
id: CODE-8c5d54970e116521
chapter: CH-02
language: rego
role: code-pattern:authorization:allow-rule
tags: [authorization, allow-rule]
explanation: Single-line comment
confidence: 0.9
digest: 366739371bda76faab5819415945276045352bebe7055ce27f5a27d74d3cac23
symbol_refs: []
semantic_role: example
embedding_hint_importance: medium
embedding_hint_scope: local
embedding_hint_chunk: auto
semantic_categories: [authz]
:::
:::

::: example
id: CODE-0fae084775ed560e
chapter: CH-02
language: bash
role: example
tags: []
explanation: Format all files in directory
confidence: 0.9
digest: ab64e13bb26bf99d364256656fd0da4a00f21faab46796ec208611a8e5d037a8
symbol_refs: []
semantic_role: example
embedding_hint_importance: medium
embedding_hint_scope: local
embedding_hint_chunk: auto
:::
opa fmt --write .

:::

::: example
id: CODE-22378fa3e5975cce
chapter: CH-02
language: bash
role: example
tags: []
explanation: Check formatting (CI)
confidence: 0.9
digest: a26003931e909f0e3b4d2c967b76c40f21c9b2a6698f66318bd914f82d692c3c
symbol_refs: []
semantic_role: example
embedding_hint_importance: medium
embedding_hint_scope: local
embedding_hint_chunk: auto
:::
opa fmt --fail .

:::

::: example
id: CODE-be520f15f84e9ee8
chapter: CH-02
language: bash
role: example
tags: []
explanation: Use Rego v1 syntax
confidence: 0.9
digest: 5b4a11eacfe2754f3794e9433167e19fb1b92edef11f976549aeba432ee64417
symbol_refs: []
semantic_role: example
embedding_hint_importance: medium
embedding_hint_scope: local
embedding_hint_chunk: auto
:::
opa fmt --rego-v1 --write .
:::

::: example
id: CODE-7c30e9d59af87e8a
chapter: CH-02
language: rego
role: code-pattern:authorization:allow-rule
tags: [authorization, allow-rule]
explanation: scope: rule
confidence: 0.9
digest: 2ef74637335b6a131c7c59bf825b44658706e2bac94d98b35fb53e36a2cc60d2
symbol_refs: []
semantic_role: example
embedding_hint_importance: medium
embedding_hint_scope: local
embedding_hint_chunk: auto
semantic_categories: [authz]
:::
allow if {
    _is_admin
}
:::

::: code-pattern
id: CODE-9a303317da8e5b55
language: rego
chapter: CH-02
source: term:Comment Styles
purpose: definition-example
pattern_type: rule_head
pattern_subtype: allow
tags: [rule_head, allow]
pattern_metadata: {'rule_type': 'allow'}
digest: c5ed7067064b1bbc9472eda7539e4533bea440a480c659a3879fe06d805e1e2e
symbol_refs: [user]
semantic_role: pattern
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
:::
# Single-line comment

# Multi-line documentation
# can span several lines
# with consistent indentation

allow if {
    input.user == "admin"  # Inline comment
}
:::

::: code-pattern
id: CODE-7aedf32081653252
chapter: CH-02
language: rego
role: code-pattern:authorization:allow-rule
tags: [authorization, allow-rule, rule_head, allow]
pattern_type: rule_head
pattern_subtype: allow
pattern_metadata: {'rule_type': 'allow'}
digest: c4bcb7d3d64287745d387bf10ca7f8213ab6b403d58400ba9c600105d1772903
symbol_refs: [Declaration, rego.v1, method, path, input.request, allow, data.users, http.authz, role]
semantic_role: pattern
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
semantic_categories: [authz]
:::
# 1. Package Declaration (required)
package http.authz

# 2. Imports (optional)
import rego.v1
import data.users
import input.request as req

# 3. Rules (policy logic)
default allow := false

allow if {
    input.user.role == "admin"
}

allow if {
    input.method == "GET"
    input.path == "/public"
}
:::

::: code-pattern
id: CODE-957fbe78b55be1dc
chapter: CH-02
language: ebnf
role: code-pattern:generic
tags: [generic]
pattern_type: generic
digest: 97cf72a70e06fef5f459dc83e3d7132845eb6972843facc54ed28f5c37d77fff
symbol_refs: []
semantic_role: pattern
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
:::
module     ::= package { import } policy
package    ::= "package" ref
import     ::= "import" ref [ "as" var ]
policy     ::= { rule }

rule       ::= [ "default" ] rule-name [ rule-key ] [ rule-value ] [ "if" ] rule-body
rule-name  ::= var | ref
rule-key   ::= "[" term "]" | "contains" term
rule-value ::= "=" term | ":=" term
rule-body  ::= "{" query "}" | literal

query      ::= literal { ( ";" | LF ) literal }
literal    ::= ( some-decl | expr | "not" expr ) { with-modifier }
with-modifier ::= "with" term "as" term
some-decl  ::= "some" var { "," var } [ "in" expr ]

expr       ::= term
             | expr infix-operator expr
             | unary-operator expr
             | call-expr
             | "(" expr ")"
             | "every" var [ "," var ] "in" expr "{" query "}"

call-expr  ::= ref "(" [ term { "," term } ] ")"

term       ::= ref | var | scalar | array | object | set
             | array-compr | object-compr | set-compr

array-compr  ::= "[" term "|" query "]"
set-compr    ::= "{" term "|" query "}"
object-compr ::= "{" object-item "|" query "}"

infix-operator ::= ":=" | "=" | "==" | "!=" | "<" | ">" | ">=" | "<="
                 | "+" | "-" | "*" | "/" | "%" | "&" | "|" | "in"

unary-operator ::= "-"

ref      ::= ref-base { ref-arg }
ref-base ::= var | call-expr
ref-arg  ::= "." var | "[" ( scalar | var | array | object | set | "_" ) "]"

var      ::= ( ALPHA | "_" ) { ALPHA | DIGIT | "_" }
scalar   ::= string | NUMBER | TRUE | FALSE | NULL
string   ::= STRING | raw-string
raw-string ::= "`" { CHAR-"`" } "`"

array    ::= "[" [ term { "," term } ] "]"
object   ::= "{" [ object-item { "," object-item } ] "}"
object-item ::= ( scalar | var | ref ) ":" term
set      ::= "{" term { "," term } "}" | "set(" ")"
:::

::: code-pattern
id: CODE-64d3f0b391064236
chapter: CH-02
language: 
role: code-pattern:generic
tags: [generic]
pattern_type: generic
digest: 5172c819069dbe629ddade89895f0d55cab1604190fdceb2d54d8c15a6df7918
symbol_refs: [some, in]
semantic_role: pattern
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
:::
as       default   else      every     false
if       import    in        input     not
null     package   some      true      with
data
:::

::: code-pattern
id: CODE-322fb8a04486fb51
chapter: CH-02
language: rego
role: code-pattern:authorization:allow-rule
tags: [authorization, allow-rule]
explanation: with consistent indentation
confidence: 0.9
pattern_type: authorization
pattern_subtype: allow-rule
digest: 594623381b1b2e4a5a48d4900f74a9c1849ef3a0006c18729999a55b79e51ac9
symbol_refs: [user]
semantic_role: pattern
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
semantic_categories: [authz]
:::

allow if {
    input.user == "admin"  # Inline comment
}
:::

::: code-pattern
id: CODE-fa97df2a115ae029
chapter: CH-02
language: rego
role: code-pattern:introspection:metadata
tags: [introspection, metadata]
pattern_type: introspection
pattern_subtype: metadata
digest: 9b72800c6584758c493512178a650a8d971cd8b6d4b7254643a19e21c8ec4347
symbol_refs: [chain_metadata, rule_metadata]
semantic_role: pattern
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
:::
rule_metadata := rego.metadata.rule()
chain_metadata := rego.metadata.chain()
:::

::: code-pattern
id: CODEPAT-25e513db069ef052
language: rego
pattern_type: rule_head
pattern_subtype: allow
tags: [rule_head, allow, rule_head, allow]
chapter: CH-02
metadata: {'rule_type': 'allow'}
pattern_metadata: {'rule_type': 'allow'}
digest: 56e2eb1d7e125fe8535db0681cc903eb51ca445a92d0ca062e9ccbd7c0e4f7d4
symbol_refs: [organizations, authz.api, description, allow, title, scope, authors]
semantic_role: pattern
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
semantic_categories: [authz]
:::
# METADATA
# title: API Authorization Policy
# description: Controls access to API resources based on user roles
# authors:
# - Security Team <security@example.com>
# organizations:
# - Example Corp
# scope: document
package authz.api

# METADATA
# title: Admin Access Rule
# description: Grants full access to users with admin role
# scope: rule
allow if {
    _is_admin
}
:::

::: constraint
id: CONSTR-e5e31823e1332fbc
chapter: CH-02
source_id: TERM-c1f015240cf9e498
type: forbidden
digest: f51e736bd24d0cfb6b52873d1086f663b7c647156460b679aa0632978c06b86b
symbol_refs: []
semantic_role: content
:::
This block describes a forbidden or disallowed behavior.
:::

::: table
id: TABLE-2bfcb4b007b1266d
chapter: CH-02
type: dos-donts
headers: [Do, Don't]
rows: [['A Rego module consists of three components:.', ''], ['When you should use opa fmt 1.', '']]
digest: e3bb545aa84789002f80542fc8beabe1cb991c0d52f43c269e500e5116e74513
symbol_refs: []
semantic_role: reference
:::
| Do | Don't |
| --- | --- |
| A Rego module consists of three components:. |  |
| When you should use opa fmt 1. |  |
:::

::: qa
id: QA-2c6d00b5a79e022f
chapter: CH-02
q: What is Modern Syntax (OPA 1.0+) in the context of Rego/OPA?
a: - `import rego.v1` enables modern keywords by default - Keywords: `if`, `in`, `contains`, `every` - Legacy syntax still supported with `--v0-compatible`
reference: TERM-52f0b79a221e0655
digest: 97d4c306f9578a36150159def58379833218240a4a96a1c931f06ec783463ca9
symbol_refs: []
semantic_role: explanation
:::
:::

::: qa
id: QA-8bab5b1175ef4bdb
chapter: CH-02
q: What is A Rego module consists of three components in the context of Rego/OPA?
a: A Rego module consists of three components:
reference: BLK-f06f72fec6a23bfd
digest: 7894757a99eb0fcdb6deb96daba4427c5a2d250f28d39fd0daea3b8dd09c98d4
symbol_refs: []
semantic_role: explanation
:::
:::

::: reasoning-chain
id: CHAIN-e120d521c9947f35
chapter: CH-02
qa_id: QA-2c6d00b5a79e022f
reference: TERM-52f0b79a221e0655
semantic_categories: [truth-values]
digest: 97892690bdcac413efce444d0048c34d358929f2bfed1e59fd2c4ca9ec927c94
symbol_refs: []
semantic_role: content
:::
- Read the question carefully.
- Recall the relevant definition or rule.
- Match the question scenario to the rule.
- Consider edge cases (e.g., undefined vs false).
- Summarize the conclusion clearly.
:::

::: role-note
id: ROLE-4e759a827b205998
chapter: CH-02
role: Policy Author
guidance: Focus on correctness & clarity of rules in this chapter.
digest: 5b011dac1809183412c69cef77c0c83125daee55cc9cd362cd0dac5724db2096
symbol_refs: []
semantic_role: content
:::
:::

::: diagram
id: DIAG-a41275c6925dc440
chapter: CH-02
language: ascii
diagram_type: diagram
summary: diagram diagram
nodes: []
edges: []
normalized_content: 
digest: 331a708a14757f535937d1ebdcf3aa3236fe10b5d1bfb446634a39fb943e79f2
symbol_refs: []
semantic_role: visualization
embedding_hint_importance: medium
embedding_hint_scope: local
embedding_hint_chunk: auto
:::
module     ::= package { import } policy
package    ::= "package" ref
import     ::= "import" ref [ "as" var ]
policy     ::= { rule }

rule       ::= [ "default" ] rule-name [ rule-key ] [ rule-value ] [ "if" ] rule-body
rule-name  ::= var | ref
rule-key   ::= "[" term "]" | "contains" term
rule-value ::= "=" term | ":=" term
rule-body  ::= "{" query "}" | literal

query      ::= literal { ( ";" | LF ) literal }
literal    ::= ( some-decl | expr | "not" expr ) { with-modifier }
with-modifier ::= "with" term "as" term
some-decl  ::= "some" var { "," var } [ "in" expr ]

expr       ::= term
             | expr infix-operator expr
             | unary-operator expr
             | call-expr
             | "(" expr ")"
             | "every" var [ "," var ] "in" expr "{" query "}"

call-expr  ::= ref "(" [ term { "," term } ] ")"

term       ::= ref | var | scalar | array | object | set
             | array-compr | object-compr | set-compr

array-compr  ::= "[" term "|" query "]"
set-compr    ::= "{" term "|" query "}"
object-compr ::= "{" object-item "|" query "}"

infix-operator ::= ":=" | "=" | "==" | "!=" | "<" | ">" | ">=" | "<="
                 | "+" | "-" | "*" | "/" | "%" | "&" | "|" | "in"

unary-operator ::= "-"

ref      ::= ref-base { ref-arg }
ref-base ::= var | call-expr
ref-arg  ::= "." var | "[" ( scalar | var | array | object | set | "_" ) "]"

var      ::= ( ALPHA | "_" ) { ALPHA | DIGIT | "_" }
scalar   ::= string | NUMBER | TRUE | FALSE | NULL
string   ::= STRING | raw-string
raw-string ::= "`" { CHAR-"`" } "`"

array    ::= "[" [ term { "," term } ] "]"
object   ::= "{" [ object-item { "," object-item } ] "}"
object-item ::= ( scalar | var | ref ) ":" term
set      ::= "{" term { "," term } "}" | "set(" ")"
:::

::: test-hint
id: TEST-73dc3062ddbcf796
chapter: CH-02
source_id: CODE-9a303317da8e5b55
digest: f7a54e697e111f4c8e5e5a5df05d4ce2e24dbfa429e62d0e79f4c8c62fcb3ac4
symbol_refs: []
semantic_role: content
:::
Convert this snippet into a unit test by constructing input and asserting allow/deny.
:::

::: section-meta
id: SECMETA-751debbcfeceab1d
title: 2.1 Syntax Overview
level: 3
chapter: CH-02
parent_section: None
line_no: 191
digest: 2f6aad905a0ff70d5433a6f281754e481a6f6b86bb763319902b422e1d824e4a
symbol_refs: []
semantic_role: structure
token_range: (191, 191)
char_offset: (15200, 15219)
source_ref: {'line': 191, 'column': 0}
embedding_hint_importance: low
embedding_hint_scope: local
embedding_hint_chunk: auto
:::
:::

::: term
id: TERM-7055bd73b15a8d51
name: Example Request
definition: ```json
{
  "input": {
    "user": {
      "id": "alice",
      "role": "developer",
      "department": "engineering"
    },
    "resource": {
      "type": "repository",
      "id": "backend-api",
      "owner": "engineering"
    },
    "action": "push"
  }
}
```
aliases: []
chapter: CH-03
digest: fe4ab9d8217bc44f6311541be5a5e28748279997e45bb163fd59bf7a51af0f50
symbol_refs: [Example Request]
semantic_role: definition
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
vector_summary: ```json { "input": { "user": { "id": "alice", "role": "developer", "department": "engineering" }, "resource": { "type": "repository", "id": "backend-api", "owner": "engineering" }, "action": "push" } } ```
:::
:::

::: concept
id: BLK-480e6ac62d9bdadc
summary: Input Document (input): - Provided per query - Represents current request/context - Typically contains: - User identity and attributes - Resource b...
digest: 703b09414ea1fc15dcb281263f07dd27fb5417e85bdcbdc788c571bdc5c241c1
symbol_refs: [Input Document, input]
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Input Document (input): - Provided per query - Represents current request/context - Typically contains: - User identity and attributes - Resource b....
vector_summary: Input Document (input): - Provided per query - Represents current request/context - Typically contains: - User identity and attributes - Resource b...
chapter: CH-03
:::
**Input Document** (`input`): - Provided per query - Represents current request/context - Typically contains: - User identity and attributes - Resource being accessed - Action/operation requested - Environmental context (time, location)
:::

::: concept
id: BLK-dc443db53fff92d3
summary: However, performance may differ (covered in Chapter 11).
digest: 2240d27cd4da24b262ab3a8f4f3e7f1415cb4b370222551c4535f2406690e55f
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that However, performance may differ (covered in Chapter 11)..
vector_summary: However, performance may differ (covered in Chapter 11).
chapter: CH-03
:::
However, performance may differ (covered in Chapter 11).
:::

::: concept
id: BLK-8c7716e5431fa29f
summary: For Sets (Union Works):.
digest: 2f49cff68f304db5757de38a0199cc4fb2df77f4831e1d794eccdbc42e334883
symbol_refs: [For Sets (Union Works):]
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that For Sets (Union Works):..
vector_summary: For Sets (Union Works):.
chapter: CH-03
:::
**For Sets (Union Works):**
:::

::: fact
id: BLK-fca3fe13b2ec32f2
summary: OPA operates on a two-document model:.
digest: 3a2126b2745e673d37b8167bfa449a36da3dfb1324a9b24914eab0a86f3261f5
symbol_refs: []
semantic_role: assertion
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that OPA operates on a two-document model:..
vector_summary: OPA operates on a two-document model:.
chapter: CH-03
:::
OPA operates on a **two-document model**:
:::

::: fact
id: BLK-0dd280f3e2ee752f
summary: Data Document (data): - Loaded into OPA at startup or via bundles - Contains: - Policy rules (your Rego code) - Static reference data - Configurati...
digest: 29b2a5f67db805f8d505bfc6e1318c3d18e9d4032bef4cf634f92af8e8817086
symbol_refs: []
semantic_role: reference
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Data Document (data): - Loaded into OPA at startup or via bundles - Contains: - Policy rules (your Rego code) - Static reference data - Configurati....
semantic_categories: [distribution]
vector_summary: Data Document (data): - Loaded into OPA at startup or via bundles - Contains: - Policy rules (your Rego code) - Static reference data - Configurati...
chapter: CH-03
:::
**Data Document** (`data`): - Loaded into OPA at startup or via bundles - Contains: - Policy rules (your Rego code) - Static reference data - Configuration - External data from APIs
:::

::: fact
id: BLK-69c0318ca03db573
summary: Rules are logical assertions about your world model.
digest: 683823ebe2502d7aa0f82444dce6dbc11eef5ed9afc71467f7bb2301d6be2079
symbol_refs: []
semantic_role: assertion
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Rules are logical assertions about your world model..
vector_summary: Rules are logical assertions about your world model.
chapter: CH-03
:::
Rules are **logical assertions** about your world model.
:::

::: fact
id: BLK-90b472c5727ce911
summary: Parse: Convert Rego text to AST 2.
digest: b696f9dc75e75fe7cd2b9810a7263635192ceded1ca4e579ece81c31ea993687
symbol_refs: []
semantic_role: assertion
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Parse: Convert Rego text to AST 2..
vector_summary: Parse: Convert Rego text to AST 2.
chapter: CH-03
:::
1. **Parse**: Convert Rego text to AST 2. **Compile**: Build evaluation plan 3. **Ground**: Bind variables systematically 4. **Unify**: Match patterns and values 5. **Search**: Explore all possibilities 6. **Collect**: Gather valid solutions
:::

::: fact
id: BLK-b510316c3c4d2fdc
summary: Critical: Set Union Behavior in Partial Rules.
digest: 5928bfa1d68092a2fbd3c344a48f7dfb906b223332acead50cf474c9c9b36d5f
symbol_refs: []
semantic_role: assertion
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Critical: Set Union Behavior in Partial Rules..
vector_summary: Critical: Set Union Behavior in Partial Rules.
chapter: CH-03
:::
**Critical: Set Union Behavior in Partial Rules**
:::

::: fact
id: BLK-0d0f670ad5683689
summary: Multiple rule bodies with the same partial rule name create a union for sets and objects, but this only works when each rule body adds distinct ele...
digest: b02c0653a8cceaa76b8e9d085cb6324aa5303a1dadec3f112c8edcf92b33c7e6
symbol_refs: []
semantic_role: assertion
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Multiple rule bodies with the same partial rule name create a union for sets and objects, but this only works when each rule body adds distinct ele....
vector_summary: Multiple rule bodies with the same partial rule name create a union for sets and objects, but this only works when each rule body adds distinct ele...
chapter: CH-03
:::
Multiple rule bodies with the same partial rule name create a **union** for sets and objects, but this only works when each rule body adds distinct elements. For complete rules (single value), multiple bodies create conflicts.
:::

::: fact
id: BLK-02fa19270211b5c5
summary: For Complete Rules with Sets (Use Comprehensions):.
digest: 3fe8d90bf27ae80dc3ebbabf66a32ed0ea5f354dd648696c3e8c87a83e8a8f03
symbol_refs: []
semantic_role: assertion
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that For Complete Rules with Sets (Use Comprehensions):..
vector_summary: For Complete Rules with Sets (Use Comprehensions):.
chapter: CH-03
:::
**For Complete Rules with Sets (Use Comprehensions):**
:::

::: fact
id: BLK-9e14dbd37949da40
summary: Key Insight: - Partial rules (contains, [key] := value): Multiple bodies union automatically - Complete rules (:= value): Multiple bodies with diff...
digest: c9230aba0bc570e27a06250f73cfac60c29c7de67dd8355b8fac75888d854669
symbol_refs: []
semantic_role: assertion
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Key Insight: - Partial rules (contains, [key] := value): Multiple bodies union automatically - Complete rules (:= value): Multiple bodies with diff....
vector_summary: Key Insight: - Partial rules (contains, [key] := value): Multiple bodies union automatically - Complete rules (:= value): Multiple bodies with diff...
chapter: CH-03
:::
**Key Insight:** - **Partial rules** (`contains`, `[key] := value`): Multiple bodies union automatically - **Complete rules** (`:= value`): Multiple bodies with different values create conflicts or non-deterministic selection - **Best Practice:** For building sets from multiple conditions, use a single rule with a comprehension that unions all possibilities
:::

::: example
id: CODE-ea5f634c13657a5f
language: json
chapter: CH-03
source: term:Example Request
purpose: definition-example
digest: dee9dc69dc069e81a7ea1c18a40b694c1677096018f6420d03b0df09aaad6af6
symbol_refs: []
semantic_role: example
embedding_hint_importance: medium
embedding_hint_scope: local
embedding_hint_chunk: auto
:::
{
  "input": {
    "user": {
      "id": "alice",
      "role": "developer",
      "department": "engineering"
    },
    "resource": {
      "type": "repository",
      "id": "backend-api",
      "owner": "engineering"
    },
    "action": "push"
  }
}
:::

::: example
id: CODE-8a90234eaba803d9
language: rego
chapter: CH-03
source: term:Rule Categories
purpose: definition-example
digest: 39785280a7c02a24c6f2503ffd8cecf0c788b6a5ae245856a3c387ac478d5fdf
symbol_refs: [user_role, max_memory]
semantic_role: example
embedding_hint_importance: medium
embedding_hint_scope: local
embedding_hint_chunk: auto
:::
max_memory := 32
   user_role := "admin"
:::

::: example
id: CODE-49b75c96fe3eceba
language: rego
chapter: CH-03
source: term:Rule Categories
purpose: definition-example
digest: 430d56c5bbaa4e566482f29076d0924596ade70407b3ec0625af88ecd3d5b114
symbol_refs: [active]
semantic_role: example
embedding_hint_importance: medium
embedding_hint_scope: local
embedding_hint_chunk: auto
:::
# Partial Set
   valid_users contains user.id if {
       some user in data.users
       user.active == true
   } # Partial Object
   user_roles[user.id] := user.role if {
       some user in data.users
   }
:::

::: example
id: CODE-754bc28c87fac504
language: rego
chapter: CH-03
source: term:Rule Categories
purpose: definition-example
digest: 70b2dce7ce741734a5bc98768d4058cb262a681368ead7a8659675576ab82d81
symbol_refs: [role]
semantic_role: example
embedding_hint_importance: medium
embedding_hint_scope: local
embedding_hint_chunk: auto
:::
allow if {
       input.user.role == "admin"
   }
:::

::: example
id: CODE-e134fa925e8a413c
language: rego
chapter: CH-03
source: term:Rule Categories
purpose: definition-example
digest: 3420c07fbe4731a778746bf6d96f88aed81075a2b672828d12746866be841197
symbol_refs: []
semantic_role: example
embedding_hint_importance: medium
embedding_hint_scope: local
embedding_hint_chunk: auto
:::
full_name(user) := concat(" ", [user.first, user.last])
:::

::: example
id: CODE-a80e1a4c63b47f1c
language: rego
chapter: CH-03
source: term:Key Principle
purpose: definition-example
digest: b43b48c016d309d6566825cf63e6ca02e78b8a2f1b09fe774c25836bd5c344e7
symbol_refs: []
semantic_role: walkthrough
embedding_hint_importance: medium
embedding_hint_scope: local
embedding_hint_chunk: auto
:::
Procedural: Execute step-by-step
Declarative: Find all valid solutions
:::

::: example
id: CODE-555d2aff842efec7
language: rego
chapter: CH-03
source: term:Complete Rule Conflicts
purpose: definition-example
digest: 201bc9cd65e07b52e4adaa2f2199be5d482ad9fb52aade083fd12a3716988530
symbol_refs: [max_value]
semantic_role: example
embedding_hint_importance: medium
embedding_hint_scope: local
embedding_hint_chunk: auto
:::
# ❌ ERROR: Conflict
max_value := 10 if condition1
max_value := 20 if condition2
# If both conditions true → conflict error
:::

::: example
id: CODE-f3be71b365fb49b3
language: rego
chapter: CH-03
source: term:Resolution Strategy
purpose: definition-example
digest: f641a7bedac796fecf337b4c01330cb1c45ec4b54e69de1cdae9cd1c7b314c5e
symbol_refs: [max_value]
semantic_role: example
embedding_hint_importance: medium
embedding_hint_scope: local
embedding_hint_chunk: auto
:::
# ✅ Use default + conditional override
default max_value := 10
max_value := 20 if high_priority_user
:::

::: example
id: CODE-8f24b7a18a0648d4
language: rego
chapter: CH-03
source: term:Partial Rules
purpose: definition-example
digest: e394f38eb5e62cd6e99fefd95cbebce060636bd7620a058f23ca7f9da36a0a0b
symbol_refs: []
semantic_role: example
embedding_hint_importance: medium
embedding_hint_scope: local
embedding_hint_chunk: auto
:::
# ✅ OK: Set accumulates values (union)
admins contains "alice" if alice_is_admin
admins contains "bob" if bob_is_admin
# Result: {"alice", "bob"} if both true
:::

::: example
id: CODE-ca436281c06aebde
language: rego
chapter: CH-03
source: term:Partial Rules
purpose: definition-example
digest: afdb6857dfeb0def08ca77e2ca3b18ee1630a393ea2c289db07b3ef59cd09df6
symbol_refs: []
semantic_role: example
embedding_hint_importance: medium
embedding_hint_scope: local
embedding_hint_chunk: auto
:::
# ✅ CORRECT: Each body adds to the set
admins contains "alice" if alice_is_admin
admins contains "bob" if bob_is_admin
# Result: {"alice", "bob"} if both true (union)
:::

::: example
id: CODE-de62385ba8bec777
chapter: CH-03
language: 
role: example
tags: []
digest: f7c61fff1962eda8d05c704f858b9432008ebdb8aeb0a11be153b9de9523ca6e
symbol_refs: []
semantic_role: reference
embedding_hint_importance: medium
embedding_hint_scope: local
embedding_hint_chunk: auto
:::
┌─────────────────────────────────┐
│         OPA Universe            │
├─────────────────┬───────────────┤
│     input       │     data      │
│  (transient)    │  (persistent) │
├─────────────────┼───────────────┤
│  • Request      │  • Policies   │
│  • Context      │  • Config     │
│  • User info    │  • Reference  │
│  • Resource     │  • Lookup     │
└─────────────────┴───────────────┘
:::

::: example
id: CODE-3d012ba6dae74718
chapter: CH-03
language: rego
role: code-pattern:generic
tags: [generic]
explanation: ✅ CORRECT: Single rule with comprehension creates union
confidence: 0.9
digest: 498a745e6484815ded63510212dc09f72ba4ee8e3a7efe843a459428b6a29ebf
symbol_refs: [missing_set]
semantic_role: example
embedding_hint_importance: medium
embedding_hint_scope: local
embedding_hint_chunk: auto
:::
_missing_patterns_set(content) := missing_set if {
    missing_set := {
        name |
        some name in ["error_handling", "audit_logging", "structured_logging"]
        not pattern_present(name, content)
    }
}
:::

::: example
id: CODE-eda88bdf5c109417
chapter: CH-03
language: rego
role: code-pattern:generic
tags: [generic]
explanation: This creates a set containing ALL missing patterns
confidence: 0.9
digest: ca59f113b76a7cbca0e8fd8d92aa1954c1a6ca4c9095af5457f8eaa2cf189bf4
symbol_refs: []
semantic_role: example
embedding_hint_importance: medium
embedding_hint_scope: local
embedding_hint_chunk: auto
:::
:::

::: example
id: CODE-aee586e0808c2fa3
chapter: CH-03
language: rego
role: code-pattern:generic
tags: [generic]
explanation: ❌ WRONG: Multiple complete rules with different set values
confidence: 0.9
digest: ae6106441920f821582310ab8895a5196e8dd144e1018dfc7b3bc20f50d81a64
symbol_refs: []
semantic_role: example
embedding_hint_importance: medium
embedding_hint_scope: local
embedding_hint_chunk: auto
code_smell_probability: 0.3
:::
_missing_patterns_set(content) := {"error_handling"} if { not error_handling }
_missing_patterns_set(content) := {"audit_logging"} if { not audit_logging }
:::

::: example
id: BLK-adf99062fbd06b04
summary: Complete Rules: Define a single value ``rego max_memory := 32 user_role := "admin" ``.
digest: e56e192e3a0cf03514fee696565eaad050999965dcb05b1088622c064699bea3
symbol_refs: [user_role, max_memory]
semantic_role: example
embedding_hint_importance: medium
embedding_hint_scope: local
embedding_hint_chunk: auto
chapter: CH-03
:::
1. **Complete Rules**: Define a single value ```rego max_memory := 32 user_role := "admin" ```
:::

::: example
id: BLK-c32cebb868f3736b
summary: Partial Rules: Define sets or objects incrementally ```rego # Partial Set valid_users contains user.id if { some user in data.users user.active == ...
digest: b6632214d54b6537620f2a00ebb87ab1aa9712f22d0d2a26f285315659689a8b
symbol_refs: [active]
semantic_role: example
embedding_hint_importance: medium
embedding_hint_scope: local
embedding_hint_chunk: auto
chapter: CH-03
:::
2. **Partial Rules**: Define sets or objects incrementally ```rego # Partial Set valid_users contains user.id if { some user in data.users user.active == true }
:::

::: example
id: BLK-277ca132ad70528a
summary: # Partial Object user_roles[user.id] := user.role if { some user in data.users } ```.
digest: 7eb23fa2f52b33e6e3562281422b6c1a6504db81f6c0d863f4667352e97114fc
symbol_refs: []
semantic_role: example
embedding_hint_importance: medium
embedding_hint_scope: local
embedding_hint_chunk: auto
chapter: CH-03
:::
# Partial Object user_roles[user.id] := user.role if { some user in data.users } ```
:::

::: example
id: BLK-916086bea807b611
summary: Boolean Rules: Produce true/undefined ``rego allow if { input.user.role == "admin" } ``.
digest: 2b93d79ce144aa53048317b645951aed3fc455eb208a86fb2649ddbd3cad2337
symbol_refs: [role]
semantic_role: example
embedding_hint_importance: medium
embedding_hint_scope: local
embedding_hint_chunk: auto
chapter: CH-03
:::
3. **Boolean Rules**: Produce true/undefined ```rego allow if { input.user.role == "admin" } ```
:::

::: example
id: BLK-ee318260cb042823
summary: Functions: Take parameters, return values ``rego full_name(user) := concat(" ", [user.first, user.last]) ``.
digest: 57942e9d97a60824882e259507302ad87dda4d803e503c4f2003e4dc21b59c5d
symbol_refs: []
semantic_role: example
embedding_hint_importance: medium
embedding_hint_scope: local
embedding_hint_chunk: auto
chapter: CH-03
:::
4. **Functions**: Take parameters, return values ```rego full_name(user) := concat(" ", [user.first, user.last]) ```
:::

::: code-pattern
id: CODE-5431f07c9453d310
language: rego
chapter: CH-03
source: term:Example Evaluation
purpose: definition-example
pattern_type: quantifier
pattern_subtype: existential
tags: [quantifier, existential]
pattern_metadata: {'quantifier': 'some'}
digest: 27e40f91c364a6069697c50835cc93ef89ce412fee32b57d60c884d1d2e696d8
symbol_refs: [role]
semantic_role: pattern
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
:::
allow if {
    some role in input.user.roles
    role == "admin"
}
:::

::: code-pattern
id: CODE-a67d7c106e51bb7b
language: rego
chapter: CH-03
source: term:Critical Insight
purpose: definition-example
pattern_type: quantifier
pattern_subtype: existential
tags: [quantifier, existential]
pattern_metadata: {'quantifier': 'some'}
digest: 6a7759267444d7cb9c5c09e91d5bc6deb4a69f88fe20665dd9cd8c38b20c129c
symbol_refs: [role]
semantic_role: pattern
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
:::
# These are equivalent
allow if {
    role == "admin"
    some role in input.user.roles
}

allow if {
    some role in input.user.roles
    role == "admin"
}
:::

::: code-pattern
id: CODE-1568ccce629f9455
language: rego
chapter: CH-03
source: term:Critical Distinction
purpose: definition-example
pattern_type: rule_head
pattern_subtype: deny
tags: [rule_head, deny]
pattern_metadata: {'rule_type': 'deny'}
digest: 03aaf050b05a0c9edb08147970fbe5bae9d0fafd31847262227ff6b27bb3867c
symbol_refs: [matches, role, deny]
semantic_role: pattern
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
:::
# Returns false explicitly
deny := false if input.user.role != "admin"

# Returns undefined (no rule matches)
deny if input.user.role == "admin"
# When user.role is "developer", deny is undefined, not false
:::

::: code-pattern
id: CODE-a5a15aa8ec17589f
language: rego
chapter: CH-03
source: term:Why It Matters
purpose: definition-example
pattern_type: rule_head
pattern_subtype: allow
tags: [rule_head, allow]
pattern_metadata: {'rule_type': 'allow'}
digest: 882e6bbeea5be2783035b43d2c1079ad90a69f04620dc9b1478cebda93e08a4e
symbol_refs: [deny]
semantic_role: pattern
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
:::
# ❌ Common mistake
allow if not deny  # Broken if deny is undefined

# ✅ Correct
default deny := false
allow if not deny
:::

::: code-pattern
id: CODE-33872740dcd72389
language: rego
chapter: CH-03
source: term:Conjunction (AND)
purpose: definition-example
pattern_type: rule_head
pattern_subtype: allow
tags: [rule_head, allow]
pattern_metadata: {'rule_type': 'allow'}
digest: 79529349771dba04b38e1e877a865637871488f951e2c5487c1cc2a2728386ac
symbol_refs: []
semantic_role: pattern
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
:::
allow if {
    expr1  # AND
    expr2  # AND
    expr3  # All must be true
}
:::

::: code-pattern
id: CODE-929e95e5abeadac4
language: rego
chapter: CH-03
source: term:Disjunction (OR)
purpose: definition-example
pattern_type: rule_head
pattern_subtype: allow
tags: [rule_head, allow]
pattern_metadata: {'rule_type': 'allow'}
digest: b0ad7bdae1fa2439eeb02b3818b631f11a9448aa714388c5c46ed6024d2bb6d8
symbol_refs: []
semantic_role: pattern
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
:::
allow if { expr1 }  # OR
allow if { expr2 }  # OR
allow if { expr3 }  # Any can be true
:::

::: code-pattern
id: CODE-51338c0a334665a0
language: rego
chapter: CH-03
source: term:Complex Example
purpose: definition-example
pattern_type: rule_head
pattern_subtype: allow
tags: [rule_head, allow]
pattern_metadata: {'rule_type': 'allow'}
digest: 545341917b589a649bcf0a40add789b82676159f59da6be755420b812c60a9c1
symbol_refs: [owner, role, active]
semantic_role: pattern
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
:::
# (admin OR owner) AND active
allow if {
    input.user.role == "admin"
    input.user.active == true
}

allow if {
    input.resource.owner == input.user.id
    input.user.active == true
}
:::

::: code-pattern
id: CODE-48a55b2d311b7fb1
language: rego
chapter: CH-03
source: term:Partial Rules
purpose: definition-example
pattern_type: quantifier
pattern_subtype: existential
tags: [quantifier, existential]
pattern_metadata: {'quantifier': 'some'}
digest: 11d42c82bcaf65ac71b1c01fcacb858c3884b3a2f8fe79ed205c266adaed3af9
symbol_refs: [missing_set, with]
semantic_role: pattern
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
code_smell_probability: 0.3
:::
# ✅ CORRECT: Single rule with comprehension creates union
_missing_patterns_set(content) := missing_set if {
    missing_set := {
        name |
        some name in ["error_handling", "audit_logging", "structured_logging"]
        not pattern_present(name, content)
    }
}
# This creates a set containing ALL missing patterns

# ❌ WRONG: Multiple complete rules with different set values
_missing_patterns_set(content) := {"error_handling"} if { not error_handling }
_missing_patterns_set(content) := {"audit_logging"} if { not audit_logging }
# Problem: These are complete rules (:=), not partial (contains)
# If both conditions true, you get a conflict or non-deterministic selection
# Only ONE value will be chosen, not a union
:::

::: code-pattern
id: CODE-22a3c940e76c1893
chapter: CH-03
language: rego
role: code-pattern:authorization:deny-rule
tags: [authorization, deny-rule]
explanation: Returns false explicitly
confidence: 0.9
pattern_type: authorization
pattern_subtype: deny-rule
digest: d42bddc4aa9495b348e8f0d9043f4b5b5cd2ea5bd6c116f1cb21ca896e40db64
symbol_refs: [deny]
semantic_role: pattern
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
semantic_categories: [authz]
:::
deny := false if input.user.role != "admin"

:::

::: code-pattern
id: CODE-4d2ad0d6df9f48c1
chapter: CH-03
language: rego
role: code-pattern:authorization:deny-rule
tags: [authorization, deny-rule]
explanation: Returns undefined (no rule matches)
confidence: 0.9
pattern_type: authorization
pattern_subtype: deny-rule
digest: 514dade502e5e473f80cd64c58beaac3c63b2d650e31641d288d471bffe9a0f4
symbol_refs: [role]
semantic_role: pattern
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
semantic_categories: [authz]
:::
deny if input.user.role == "admin"
:::

::: table
id: TABLE-748d371f78160f37
chapter: CH-03
headers: [Rule Output, Meaning, Example]
row_count: 3
caption: 
rows: [['`true`', 'Explicitly true', '`allow := true`'], ['`false`', 'Explicitly false', '`allow := false`'], ['`undefined`', 'No rule produced value', 'No matching rule body']]
digest: 0b8410cfae78a4efbba82b4c904b0bdab859ebaef91ee8860371ccf418bb268e
symbol_refs: []
semantic_role: reference
embedding_hint_importance: low
embedding_hint_scope: local
embedding_hint_chunk: auto
:::
:::

::: table
id: TABLE-2564f122b06d6c6c
chapter: CH-03
type: dos-donts
headers: [Do, Don't]
rows: [['OPA operates on a two-document model:.', ''], ['Data Document (data): - Loaded into OPA at startup or via bundles - Contains: - Policy rules (your Rego code) - Static reference data - Configurati...', ''], ['Rules are logical assertions about your world model.', ''], ['Parse: Convert Rego text to AST 2.', ''], ['Critical: Set Union Behavior in Partial Rules.', ''], ['Multiple rule bodies with the same partial rule name create a union for sets and objects, but this only works when each rule body adds distinct ele...', ''], ['For Complete Rules with Sets (Use Comprehensions):.', ''], ['Key Insight: - Partial rules (contains, [key] := value): Multiple bodies union automatically - Complete rules (:= value): Multiple bodies with diff...', '']]
semantic_categories: [distribution]
digest: 53d68988d0e4076bea2bfa3eccd4f1fc5717a21feac7e2f77453c98e476db14b
symbol_refs: []
semantic_role: reference
:::
| Do | Don't |
| --- | --- |
| OPA operates on a two-document model:. |  |
| Data Document (data): - Loaded into OPA at startup or via bundles - Contains: - Policy rules (your Rego code) - Static reference data - Configurati... |  |
| Rules are logical assertions about your world model. |  |
| Parse: Convert Rego text to AST 2. |  |
| Critical: Set Union Behavior in Partial Rules. |  |
| Multiple rule bodies with the same partial rule name create a union for sets and objects, but this only works when each rule body adds distinct ele... |  |
| For Complete Rules with Sets (Use Comprehensions):. |  |
| Key Insight: - Partial rules (contains, [key] := value): Multiple bodies union automatically - Complete rules (:= value): Multiple bodies with diff... |  |
:::

::: qa
id: QA-596b5610eea33d51
chapter: CH-03
q: What is Example Request in the context of Rego/OPA?
a: ```json { "input": { "user": { "id": "alice", "role": "developer", "department": "engineering" }, "resource": { "type": "repository", "id": "backend-api", "owner": "engineering" }, "action": "push" } } ```
reference: TERM-7055bd73b15a8d51
digest: 82db2986fb1fc4148b4a3509014f50b615cc64c2ff549e2544873b82789544cb
symbol_refs: []
semantic_role: explanation
:::
:::

::: qa
id: QA-75291b96e8d48135
chapter: CH-03
q: What is OPA operates on a two-document model in the context of Rego/OPA?
a: OPA operates on a **two-document model**:
reference: BLK-fca3fe13b2ec32f2
digest: c13c94f0eb23fcbad43b808dc4d9139f483991459a9f5d86411705361eeb8f95
symbol_refs: []
semantic_role: explanation
:::
:::

::: reasoning-chain
id: CHAIN-c483fd533041f0d9
chapter: CH-03
qa_id: QA-596b5610eea33d51
reference: TERM-7055bd73b15a8d51
semantic_categories: [truth-values]
digest: 98240dbfa25492ecd3f753a1ff211902f6472b08f2e5d0261270494154d33b6f
symbol_refs: []
semantic_role: content
:::
- Read the question carefully.
- Recall the relevant definition or rule.
- Match the question scenario to the rule.
- Consider edge cases (e.g., undefined vs false).
- Summarize the conclusion clearly.
:::

::: role-note
id: ROLE-6f2de71449bf6150
chapter: CH-03
role: Policy Author
guidance: Focus on correctness & clarity of rules in this chapter.
digest: 44adb4012b44e1b53d53e354a49bd3fdde1570bdf37e2adf2ee9f269efda80b0
symbol_refs: []
semantic_role: content
:::
:::

::: diagram
id: DIAG-6dd1fd866550db53
chapter: CH-03
language: ascii
diagram_type: diagram
summary: diagram diagram
nodes: [{'id': 'node_0', 'label': 'OPA Universe ├─────────────────┬───────────────┤ input            data (transient)      (persistent) ├─────────────────┼───────────────┤ • Request        • Policies • Context        • Config • User info      • Reference • Resource       • Lookup'}, {'id': 'node_1', 'label': 'input            data (transient)      (persistent) ├─────────────────┼───────────────┤ • Request        • Policies • Context        • Config • User info      • Reference • Resource       • Lookup'}]
edges: []
normalized_content: [OPA Universe ├─────────────────┬───────────────┤ input            data (transient)      (persistent) ├─────────────────┼───────────────┤ • Request        • Policies • Context        • Config • User info      • Reference • Resource       • Lookup]
[input            data (transient)      (persistent) ├─────────────────┼───────────────┤ • Request        • Policies • Context        • Config • User info      • Reference • Resource       • Lookup]
digest: 2327531b749b4cc6f989ddad3062fc358663d162d2283c21496b392005cb627b
symbol_refs: []
semantic_role: reference
embedding_hint_importance: medium
embedding_hint_scope: local
embedding_hint_chunk: auto
:::
┌─────────────────────────────────┐
│         OPA Universe            │
├─────────────────┬───────────────┤
│     input       │     data      │
│  (transient)    │  (persistent) │
├─────────────────┼───────────────┤
│  • Request      │  • Policies   │
│  • Context      │  • Config     │
│  • User info    │  • Reference  │
│  • Resource     │  • Lookup     │
└─────────────────┴───────────────┘
:::

::: diagram
id: DIAG-aa1bcb902547f29e
chapter: CH-03
language: ascii
diagram_type: diagram
summary: diagram diagram
nodes: []
edges: []
normalized_content: 
digest: 20254c69f96458dbd17d0a432277ce11935e882e0aca0da85b722c97e1681b9a
symbol_refs: []
semantic_role: visualization
embedding_hint_importance: medium
embedding_hint_scope: local
embedding_hint_chunk: auto
:::
# ✅ Use default + conditional override
default max_value := 10
max_value := 20 if high_priority_user
:::

::: test-hint
id: TEST-0f6f8aa3279b3c76
chapter: CH-03
source_id: CODE-754bc28c87fac504
digest: ae8d819cb55b5d5f90dc284ae76698c8d61430f1e7425cdb9e2e80ccd3beed97
symbol_refs: []
semantic_role: content
:::
Convert this snippet into a unit test by constructing input and asserting allow/deny.
:::

::: section-meta
id: SECMETA-f884251d72908ead
title: 3.1 World Model
level: 3
chapter: CH-03
parent_section: None
line_no: 419
digest: 663f4ce3ea3fff3604a7181e9a66f7007db33924ec235e24b388665f0b957305
symbol_refs: []
semantic_role: structure
token_range: (419, 419)
char_offset: (33440, 33455)
source_ref: {'line': 419, 'column': 0}
embedding_hint_importance: low
embedding_hint_scope: local
embedding_hint_chunk: auto
:::
:::

::: term
id: TERM-1a0cf4c1598ec141
name: Variable Declaration
definition: ```rego
# Assignment with :=
x := 42
name := input.user.name

# Variables are immutable within scope
x := 42
x := 43  # ❌ ERROR: Variable x referenced above
```
aliases: []
chapter: CH-04
digest: ad3efea4ee01a998d4b83bd1028830192cd609eb7edf469d11d3fb4d7ae09d9c
symbol_refs: [Variable Declaration]
semantic_role: definition
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
vector_summary: ```rego # Assignment with := x := 42 name := input.user.name # Variables are immutable within scope x := 42 x := 43 # ❌ ERROR: Variable x referenced above ```
:::
:::

::: concept
id: BLK-9810d9b02b25133e
summary: References & the Data Model.
digest: 37b472ddd822fd51ade2bb51acb8796d8a787d462f7527ad2228a3a5cdd9142d
symbol_refs: []
semantic_role: reference
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that References & the Data Model..
vector_summary: References & the Data Model.
chapter: CH-04
:::
References & the Data Model
:::

::: concept
id: BLK-95cc3b002d8754e2
summary: Valid reference roots:.
digest: df8955762c3451784aecf21718d20e7318a87d100f1013a13d1a7d9c9f43e7a6
symbol_refs: []
semantic_role: reference
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Valid reference roots:..
vector_summary: Valid reference roots:.
chapter: CH-04
:::
Valid reference roots:
:::

::: concept
id: BLK-78afb368bfa631d2
summary: Input – request-scoped data.
digest: 61ee0767e0fd847d54e77f244f228f1a82c8432a4c3821fedcf9c882b29c7f1a
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Input – request-scoped data..
vector_summary: Input – request-scoped data.
chapter: CH-04
:::
input – request-scoped data
:::

::: concept
id: BLK-69421e4d60031cee
summary: Data – bundle-scoped data (policies + static data).
digest: a6ae41ed4837b91c81d475c0275a27c6254b3cf41afffe43f590c00e8fa30476
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Data – bundle-scoped data (policies + static data)..
semantic_categories: [distribution]
vector_summary: Data – bundle-scoped data (policies + static data).
chapter: CH-04
:::
data – bundle-scoped data (policies + static data)
:::

::: concept
id: BLK-9fa59c36fe5eb07e
summary: Function calls (results assigned to a variable first).
digest: b810ccda209ec52e45d930949a31c8c4fca3c4ef35ebb400c9b222fbf03dbef2
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Function calls (results assigned to a variable first)..
vector_summary: Function calls (results assigned to a variable first).
chapter: CH-04
:::
function calls (results assigned to a variable first)
:::

::: concept
id: BLK-5a1c45e69659b266
summary: Input.user.id data.config.defaults.timeout user := input.user user.profile.email.
digest: 454b303e833a6dc5b88accaa66f6b3d24abcbc5d3795a25c01a238d17eb1bff9
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Input.user.id data.config.defaults.timeout user := input.user user.profile.email..
vector_summary: Input.user.id data.config.defaults.timeout user := input.user user.profile.email.
chapter: CH-04
:::
input.user.id data.config.defaults.timeout user := input.user user.profile.email
:::

::: concept
id: BLK-a408b5cb37163856
summary: 4.2 What Cannot Start a Reference (Literals vs References).
digest: 270296d831db557c3d161106368830d180a9a21768171b951e359b0f5ec48823
symbol_refs: []
semantic_role: reference
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that 4.2 What Cannot Start a Reference (Literals vs References)..
vector_summary: 4.2 What Cannot Start a Reference (Literals vs References).
chapter: CH-04
:::
4.2 What Cannot Start a Reference (Literals vs References)
:::

::: concept
id: BLK-967e2935894c77e0
summary: You cannot start a reference with:.
digest: 82c43dcb2a1f8192a20443360dc9a2f78ae0162dae079336b243ac07d7afb3de
symbol_refs: []
semantic_role: reference
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that You cannot start a reference with:..
vector_summary: You cannot start a reference with:.
chapter: CH-04
:::
You cannot start a reference with:
:::

::: concept
id: BLK-243c144ec9ef9fec
summary: You can assign literals to variables and then reference them:.
digest: 35af2cd357d19bb85a4d5253913e99315d4efffd04861d41e48dd310d33afa76
symbol_refs: []
semantic_role: reference
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that You can assign literals to variables and then reference them:..
vector_summary: You can assign literals to variables and then reference them:.
chapter: CH-04
:::
You can assign literals to variables and then reference them:
:::

::: concept
id: BLK-c7bb77c124e34850
summary: Obj := {"name": "Alice"} y := obj.name.
digest: b065d949ba271fdf738502129801ad3495e1652d0d04720adb10660d4b116945
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Obj := {"name": "Alice"} y := obj.name..
vector_summary: Obj := {"name": "Alice"} y := obj.name.
chapter: CH-04
:::
obj := {"name": "Alice"} y := obj.name
:::

::: concept
id: BLK-9b4015c66b260e6b
summary: S := {1, 2, 3} contains_one if 1 in s.
digest: 0b58203d72d2d2e8fe85bfe0df45bbe26cf25ab621ec3d2b7c2bcfe7a4a5a721
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that S := {1, 2, 3} contains_one if 1 in s..
vector_summary: S := {1, 2, 3} contains_one if 1 in s.
chapter: CH-04
:::
s := {1, 2, 3} contains_one if 1 in s
:::

::: concept
id: BLK-4b8e3328604ba9ff
summary: Think of literals as values.
digest: 78e8811c84fa5373e65454796696c8918e08545120429bfe8060cc56a5f0432f
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Think of literals as values..
vector_summary: Think of literals as values.
chapter: CH-04
:::
Think of literals as values.
:::

::: concept
id: BLK-db27a696242d571c
summary: Refs start from input, data, locals, or function results.
digest: 73f28a712a6a7a1d43839dc27d9efa5df9a3e80c381f5a7abe8825041d8dab0c
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Refs start from input, data, locals, or function results..
vector_summary: Refs start from input, data, locals, or function results.
chapter: CH-04
:::
Refs start from input, data, locals, or function results.
:::

::: concept
id: BLK-fc5db223276d9413
summary: Use a local binding when you want to operate on a literal in “reference form”.
digest: 3f636a7d9034b3396d3a8459ac3766e08a2f08849d97b75440874f6f56a090ac
symbol_refs: []
semantic_role: reference
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Use a local binding when you want to operate on a literal in “reference form”..
vector_summary: Use a local binding when you want to operate on a literal in “reference form”.
chapter: CH-04
:::
Use a local binding when you want to operate on a literal in “reference form”.
:::

::: fact
id: BLK-365e79b627669b85
summary: Variables must be "grounded" (defined) before use in: - Negated expressions - Certain built-in function arguments - Comparisons (when using ==).
digest: 80a71d583ef00e97cc7f8e67f4fbbfc32791063fbd500fbe6c5d365baee49990
symbol_refs: []
semantic_role: assertion
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Variables must be "grounded" (defined) before use in: - Negated expressions - Certain built-in function arguments - Comparisons (when using ==)..
vector_summary: Variables must be "grounded" (defined) before use in: - Negated expressions - Certain built-in function arguments - Comparisons (when using ==).
chapter: CH-04
:::
Variables must be "grounded" (defined) before use in: - Negated expressions - Certain built-in function arguments - Comparisons (when using `==`)
:::

::: fact
id: BLK-374855f2833979c7
summary: Must start with: - Variable - input or data (implicitly imported) - Function call.
digest: 8d0b5493d8c2c7d51eef6d9a333df117451ff92d93f56f1c881537846ae122eb
symbol_refs: []
semantic_role: assertion
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Must start with: - Variable - input or data (implicitly imported) - Function call..
vector_summary: Must start with: - Variable - input or data (implicitly imported) - Function call.
chapter: CH-04
:::
1. Must start with: - Variable - `input` or `data` (implicitly imported) - Function call
:::

::: fact
id: BLK-01542ca1939f1e90
summary: Rego references let you navigate input, data, and local bindings.
digest: 7e863df2a6acbcad7fc5de9830e2d4c29f8f7553c439de3c4d7e1c3beb09ece0
symbol_refs: []
semantic_role: reference
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Rego references let you navigate input, data, and local bindings..
vector_summary: Rego references let you navigate input, data, and local bindings.
chapter: CH-04
:::
Rego references let you navigate input, data, and local bindings.
:::

::: fact
id: BLK-ac51d7f44d5b9f6f
summary: Local variables (from rule heads or := in bodies).
digest: 1c53cbbeb9560d76a000094d79325c7877a077df9a434cd6077952a545d17f56
symbol_refs: []
semantic_role: assertion
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Local variables (from rule heads or := in bodies)..
vector_summary: Local variables (from rule heads or := in bodies).
chapter: CH-04
:::
local variables (from rule heads or := in bodies)
:::

::: fact
id: BLK-6a91b47966fe0914
summary: Rego’s reference grammar requires that a reference start from a reference root, not a literal value.
digest: 7522539a01ff1a2bcefc0b127e7f6ceada2a543fb64dbbbf9a09a4fc2d259ae9
symbol_refs: []
semantic_role: reference
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Rego’s reference grammar requires that a reference start from a reference root, not a literal value..
vector_summary: Rego’s reference grammar requires that a reference start from a reference root, not a literal value.
chapter: CH-04
:::
Rego’s reference grammar requires that a reference start from a reference root, not a literal value.
:::

::: fact
id: BLK-0099fb0394aef55d
summary: The problem is not that indexing literals is conceptually impossible; it’s that in Rego, literals are not references.
digest: 63e31c47062a20ed5f2a6e71924ba427e812093780fca31e31e3ca72b0f843c8
symbol_refs: []
semantic_role: reference
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that The problem is not that indexing literals is conceptually impossible; it’s that in Rego, literals are not references..
vector_summary: The problem is not that indexing literals is conceptually impossible; it’s that in Rego, literals are not references.
chapter: CH-04
:::
The problem is not that indexing literals is conceptually impossible; it’s that in Rego, literals are not references.
:::

::: fact
id: BLK-6764c41841ecebec
summary: # ✅ Valid: assign literal to variable then index/select arr := [1, 2, 3] x := arr[0].
digest: 2f122d6ae08e526a5f47cff872eedde804c871a625012eb2630180c8fd6d3fd9
symbol_refs: []
semantic_role: assertion
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that # ✅ Valid: assign literal to variable then index/select arr := [1, 2, 3] x := arr[0]..
vector_summary: # ✅ Valid: assign literal to variable then index/select arr := [1, 2, 3] x := arr[0].
chapter: CH-04
:::
# ✅ Valid: assign literal to variable then index/select arr := [1, 2, 3] x := arr[0]
:::

::: example
id: CODE-43fdfdc8d23de345
language: rego
chapter: CH-04
source: term:Variable Declaration
purpose: definition-example
digest: ff4fd4fcb452b5bfcd78d8cffde7dce6bb12d5f35c26c3772139054619c57373
symbol_refs: [with, name, x]
semantic_role: reference
embedding_hint_importance: medium
embedding_hint_scope: local
embedding_hint_chunk: auto
:::
# Assignment with :=
x := 42
name := input.user.name

# Variables are immutable within scope
x := 42
x := 43  # ❌ ERROR: Variable x referenced above
:::

::: example
id: CODE-a02a421a6fac4f98
language: rego
chapter: CH-04
source: term:Unification with =
purpose: definition-example
digest: b09de44d031d71621af668d926ab64be8948ca6398058cedb1fede5fca74552e
symbol_refs: [x]
semantic_role: example
embedding_hint_importance: medium
embedding_hint_scope: local
embedding_hint_chunk: auto
semantic_categories: [unification]
:::
# Pattern matching
[first, second] = [1, 2]
# first → 1, second → 2

# Symmetric unification
x = y  # Makes x and y equal

# Complex patterns
{"user": user, "role": role} = input.request
:::

::: example
id: CODE-b007cb357523f444
language: rego
chapter: CH-04
source: term:Safety Requirement
purpose: definition-example
digest: a9b453547a166e98ea7f18a408bf9020dcfa1aaef402e93a7e34e1594f7eb6e6
symbol_refs: [user]
semantic_role: example
embedding_hint_importance: medium
embedding_hint_scope: local
embedding_hint_chunk: auto
code_smell_probability: 1.0
:::
# ❌ Unsafe
bad_rule if {
    not blacklisted[user]  # user never defined
}

# ✅ Safe
good_rule if {
    user := input.user.id
    not blacklisted[user]
}
:::

::: example
id: CODE-cd9f75f4f505f98f
language: rego
chapter: CH-04
source: term:Reference Syntax
purpose: definition-example
digest: 3de0fd12e42a512890f9b6064ef73d352bffa242806228944191552b844c3779
symbol_refs: [underscore]
semantic_role: example
embedding_hint_importance: medium
embedding_hint_scope: local
embedding_hint_chunk: auto
:::
# Dot notation (for simple keys)
input.user.name
data.roles.admin

# Bracket notation (for complex keys)
input["user"]["name"]
data["user-roles"]["admin-user"]

# Variable keys
users[user_id]
data.permissions[input.user.role]

# Array indices
items[0]
items[i]  # Iteration
items[_]  # All values (underscore = wildcard)
:::

::: example
id: CODE-b95dcb5f7af9c909
language: rego
chapter: CH-04
source: term:Reference Rules
purpose: definition-example
digest: d79bc6bf5ee5844d7fa398598d3fa760440bd6e53feda2f20c0715e6720d35cb
symbol_refs: [arr, obj, y, x]
semantic_role: reference
embedding_hint_importance: medium
embedding_hint_scope: local
embedding_hint_chunk: auto
:::
# ❌ Invalid reference starts
x := [1, 2, 3][0]
y := {"name": "Alice"}.name

# ✅ Valid: Assign first
arr := [1, 2, 3]
x := arr[0]

obj := {"name": "Alice"}
y := obj.name
:::

::: example
id: CODE-9480eddfd36d6bd8
language: rego
chapter: CH-04
source: term:Deep Traversal
purpose: definition-example
digest: c1e2ed1223c141d1131867d2a4829713723c67896fa9625890ba0afb7d31a582
symbol_refs: [all_hostnames, hostname]
semantic_role: example
embedding_hint_importance: medium
embedding_hint_scope: local
embedding_hint_chunk: auto
:::
# Multi-level access
sites[i].servers[j].hostname

# With wildcards
all_hostnames := sites[_].servers[_].hostname

# Safe access with default
hostname := input.server.hostname if input.server.hostname
default hostname := "unknown"
:::

::: example
id: CODE-4f7ad951c5e8fc13
language: rego
chapter: CH-04
source: term:When to Use
purpose: definition-example
digest: 4463173ca88315123eac7db4ef772036fc95303f49d2772888d9ce5f1c7a84ed
symbol_refs: [count]
semantic_role: example
embedding_hint_importance: medium
embedding_hint_scope: local
embedding_hint_chunk: auto
:::
# := for clear assignment (preferred)
count := array.length(items)

# = for pattern matching
[first, second] = [1, 2]

# == for comparison
result if count == 5
:::

::: example
id: CODE-4c3840c3d511c14f
language: rego
chapter: CH-04
source: term:Type Compatibility
purpose: definition-example
digest: 986e499b192f6c8cb1c89f1b66fcda18406f3754e3babc7c795eae7c1787fdb1
symbol_refs: []
semantic_role: example
embedding_hint_importance: medium
embedding_hint_scope: local
embedding_hint_chunk: auto
:::
# Same types
1 < 2                    # ✅ true
"a" < "b"                # ✅ true

# Different types
1 < "2"                  # ❌ undefined (not an error)
:::

::: example
id: CODE-eb69c158485adda6
language: rego
chapter: CH-04
source: term:Examples
purpose: definition-example
digest: 3e9eec5f9aaa29242b2d6910727c028f4f371630c4ee6cbd6090414aa8133b82
symbol_refs: [diff, remainder, product, sum, quotient]
semantic_role: example
embedding_hint_importance: medium
embedding_hint_scope: local
embedding_hint_chunk: auto
:::
sum := 10 + 5        # 15
diff := 10 - 5       # 5
product := 10 * 5    # 50
quotient := 10 / 5   # 2 (float)
remainder := 10 % 3  # 1
:::

::: example
id: CODE-52f9fdd779656e38
language: rego
chapter: CH-04
source: term:Use Cases
purpose: definition-example
digest: 1f1485ef1b35afb721b25e2e9f0f756d62522576bd16d50cf3608a01fba55213
symbol_refs: [has_write, execute_bit, read_bit, write_bit]
semantic_role: example
embedding_hint_importance: medium
embedding_hint_scope: local
embedding_hint_chunk: auto
:::
# Permission bits
read_bit := 1
write_bit := 2
execute_bit := 4

has_write := (permissions & write_bit) != 0
:::

::: example
id: CODE-d32e8615902ca0d6
chapter: CH-04
language: rego
role: example
tags: []
explanation: Variables are immutable within scope
confidence: 0.9
digest: 3f0a90039b8a8726d5bf012f3e328f67176aa1f00fa4739853c07e294e8d12b9
symbol_refs: [x]
semantic_role: reference
embedding_hint_importance: medium
embedding_hint_scope: local
embedding_hint_chunk: auto
:::
x := 42
x := 43  # ❌ ERROR: Variable x referenced above
:::

::: example
id: CODE-1e2dafd1a36095b9
chapter: CH-04
language: rego
role: example
tags: []
explanation: Pattern matching
confidence: 0.9
digest: 5bda2c6816772f627f8631d4ff7980c1bc55bb08cb768c9182eadd922b9be203
symbol_refs: []
semantic_role: example
embedding_hint_importance: medium
embedding_hint_scope: local
embedding_hint_chunk: auto
:::
[first, second] = [1, 2]
:::

::: example
id: CODE-7583d41130ecfa94
chapter: CH-04
language: rego
role: example
tags: []
explanation: first → 1, second → 2
confidence: 0.9
digest: 7cdf397f18251e45b864cee4d5b5ac93b7cb9a522383896e8fe2f9f402c1ffd0
symbol_refs: []
semantic_role: example
embedding_hint_importance: medium
embedding_hint_scope: local
embedding_hint_chunk: auto
:::
:::

::: example
id: CODE-74e04ec1775f8da0
chapter: CH-04
language: rego
role: example
tags: []
explanation: Symmetric unification
confidence: 0.9
digest: 2b9741b5f9c85b17020bac0ed8f70d79909d93f17f98c407afb55efc324f2354
symbol_refs: [x]
semantic_role: example
embedding_hint_importance: medium
embedding_hint_scope: local
embedding_hint_chunk: auto
semantic_categories: [unification]
:::
x = y  # Makes x and y equal

:::

::: example
id: CODE-bceca388eebe308f
chapter: CH-04
language: rego
role: example
tags: []
explanation: Bracket notation (for complex keys)
confidence: 0.9
digest: acbb548f7eb7905195759bc212b7900c1b85d35e94f7c4017d6009494508ac3a
symbol_refs: []
semantic_role: example
embedding_hint_importance: medium
embedding_hint_scope: local
embedding_hint_chunk: auto
:::
input["user"]["name"]
data["user-roles"]["admin-user"]

:::

::: example
id: CODE-d7b342344490c7a4
chapter: CH-04
language: rego
role: example
tags: []
explanation: Array indices
confidence: 0.9
digest: f5063435184952990a4fca1926070c472e7d195b929da0507cf633c487f4a9f0
symbol_refs: [underscore]
semantic_role: example
embedding_hint_importance: medium
embedding_hint_scope: local
embedding_hint_chunk: auto
:::
items[0]
items[i]  # Iteration
items[_]  # All values (underscore = wildcard)
:::

::: example
id: CODE-a62771a93b1461e1
chapter: CH-04
language: rego
role: example
tags: []
explanation: Multi-level access
confidence: 0.9
digest: c99970168ef1ddc1bdc4d2a4b95c7cd84eba22753e20e9d9a241d20fbe221242
symbol_refs: []
semantic_role: example
embedding_hint_importance: medium
embedding_hint_scope: local
embedding_hint_chunk: auto
:::
sites[i].servers[j].hostname

:::

::: example
id: CODE-0408bf157b036da2
chapter: CH-04
language: rego
role: example
tags: []
explanation: With wildcards
confidence: 0.9
digest: 761f25ede9fb45dffb8abc958fab72fb8a8f8d4641c58bd11fd2d6983ec1a97e
symbol_refs: [all_hostnames]
semantic_role: example
embedding_hint_importance: medium
embedding_hint_scope: local
embedding_hint_chunk: auto
:::
all_hostnames := sites[_].servers[_].hostname

:::

::: example
id: CODE-e8957c6cca7ec960
chapter: CH-04
language: rego
role: code-pattern:generic
tags: [generic]
explanation: Without 'some' (implicit)
confidence: 0.9
digest: af2e23abc769a60c44b010f4d5bee123d7c357345c550c56cbc670ca24f8e7a7
symbol_refs: [region]
semantic_role: example
embedding_hint_importance: medium
embedding_hint_scope: local
embedding_hint_chunk: auto
:::
result if {
    sites[i].region == "west"
}

:::

::: example
id: CODE-6871411455d74e80
chapter: CH-04
language: rego
role: code-pattern:generic
tags: [generic]
explanation: With 'some' (explicit - recommended)
confidence: 0.9
digest: 1529b0d79a8fa09c08e55835234cbb254d1164ba94a46c998495277ef75575b4
symbol_refs: [region]
semantic_role: example
embedding_hint_importance: medium
embedding_hint_scope: local
embedding_hint_chunk: auto
:::
result if {
    some i
    sites[i].region == "west"
}

:::

::: example
id: CODE-cd41f44b1e3b1413
chapter: CH-04
language: rego
role: code-pattern:generic
tags: [generic]
explanation: Modern style with 'in'
confidence: 0.9
digest: bd994cc168dc0c1fce57b5dc0ab9a2ab8534d7dd6777d15450947562cf15e264
symbol_refs: [region]
semantic_role: example
embedding_hint_importance: medium
embedding_hint_scope: local
embedding_hint_chunk: auto
:::
result if {
    some site in sites
    site.region == "west"
}
:::

::: example
id: CODE-bcbba9623c35b340
chapter: CH-04
language: rego
role: example
tags: []
digest: d2bdb987b6e75ffb116642759ec714efb508dcc32d7ea1a236d588cddfd58504
symbol_refs: []
semantic_role: example
embedding_hint_importance: medium
embedding_hint_scope: local
embedding_hint_chunk: auto
:::
x + y    # Addition
x - y    # Subtraction
x * y    # Multiplication
x / y    # Division (float result)
x % y    # Modulo (remainder)
:::

::: example
id: CODE-9a2d4c6c1eb05ea6
chapter: CH-04
language: rego
role: example
tags: []
digest: 2d7bb45bacd6af26c6d7d366fbbc36cc4528225835ca9c89abff33faded1a6cc
symbol_refs: []
semantic_role: example
embedding_hint_importance: medium
embedding_hint_scope: local
embedding_hint_chunk: auto
:::
x & y    # Bitwise AND
x | y    # Bitwise OR
:::

::: example
id: CODE-c85bb93a7ccfac64
chapter: CH-04
language: rego
role: code-pattern:generic
tags: [generic]
explanation: Membership testing (returns boolean)
confidence: 0.9
digest: 8a39334538e282aa1098005676551d2ddd2b491da65c405d1a17fdcc8fc117f3
symbol_refs: []
semantic_role: example
embedding_hint_importance: medium
embedding_hint_scope: local
embedding_hint_chunk: auto
semantic_categories: [testing]
:::
"admin" in user.roles                 # true/false
3 in [1, 2, 3]                        # true
"key" in {"key": "value"}             # true (checks keys in objects)

:::

::: example
id: CODE-2f56e9162c110a40
chapter: CH-04
language: rego
role: code-pattern:generic
tags: [generic]
explanation: Iteration (with 'some')
confidence: 0.9
digest: d7bfab6026d9015d07f11924012099b80bc07ea9f92517283ca58a6d7d4476b2
symbol_refs: []
semantic_role: example
embedding_hint_importance: medium
embedding_hint_scope: local
embedding_hint_chunk: auto
:::
some role in user.roles
some i, item in items                 # index and value
some key, value in object             # key and value

:::

::: example
id: CODE-a84c6328e44a8505
chapter: CH-04
language: rego
role: code-pattern:generic
tags: [generic]
explanation: Negation
confidence: 0.9
digest: fb3a1c783913fe3578af2b3142775cdcbef727e57a9d38b485c8f2413a21a818
symbol_refs: []
semantic_role: example
embedding_hint_importance: medium
embedding_hint_scope: local
embedding_hint_chunk: auto
semantic_categories: [negation]
:::
not "admin" in user.roles
:::

::: example
id: CODE-b624b208cd3b5ba3
chapter: CH-04
language: rego
role: code-pattern:generic
tags: [generic]
explanation: Values only
confidence: 0.9
digest: 95e54e88345cb60d1cf41d41d98e6b1af67388184efad285e87ad661f3cb5b8f
symbol_refs: []
semantic_role: example
embedding_hint_importance: medium
embedding_hint_scope: local
embedding_hint_chunk: auto
:::
some item in [1, 2, 3]

:::

::: example
id: CODE-bf5174631e66f074
chapter: CH-04
language: rego
role: code-pattern:generic
tags: [generic]
explanation: Index and value
confidence: 0.9
digest: 01b8b8a4634540e150ba19cd25a2ec39add4978826a54bf05bff8cfc6d9b1d60
symbol_refs: []
semantic_role: example
embedding_hint_importance: medium
embedding_hint_scope: local
embedding_hint_chunk: auto
:::
some i, item in [1, 2, 3]
:::

::: example
id: CODE-9410c91f9d9d046f
chapter: CH-04
language: rego
role: code-pattern:generic
tags: [generic]
explanation: Values only
confidence: 0.9
digest: 570680c6d8439d1b23ad345107f92a3558ec5ec98bd6947e82d23e63c375daf5
symbol_refs: []
semantic_role: example
embedding_hint_importance: medium
embedding_hint_scope: local
embedding_hint_chunk: auto
:::
some val in {"a": 1, "b": 2}

:::

::: example
id: CODE-228f7ddbcb6151ad
chapter: CH-04
language: rego
role: code-pattern:generic
tags: [generic]
explanation: Key and value
confidence: 0.9
digest: 1fd932b25eff04956f00368945b2d69c2dbbb1d555c69bacacf47d211613df3e
symbol_refs: []
semantic_role: example
embedding_hint_importance: medium
embedding_hint_scope: local
embedding_hint_chunk: auto
:::
some key, val in {"a": 1, "b": 2}
:::

::: code-pattern
id: CODE-33cc2f66fa073f3a
language: rego
chapter: CH-04
source: term:Explicit Variable Declaration
purpose: definition-example
pattern_type: quantifier
pattern_subtype: existential
tags: [quantifier, existential]
pattern_metadata: {'quantifier': 'some'}
digest: f33d1b1290fcc0dac0afc86eb801664ea382d2213eb22151c8dae6600ec03009
symbol_refs: [region]
semantic_role: pattern
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
:::
# Without 'some' (implicit)
result if {
    sites[i].region == "west"
}

# With 'some' (explicit - recommended)
result if {
    some i
    sites[i].region == "west"
}

# Modern style with 'in'
result if {
    some site in sites
    site.region == "west"
}
:::

::: code-pattern
id: CODE-3cb95b2fa63c007b
language: rego
chapter: CH-04
source: term:Multiple Variables
purpose: definition-example
pattern_type: quantifier
pattern_subtype: existential
tags: [quantifier, existential]
pattern_metadata: {'quantifier': 'some'}
digest: fc8db581a7c734242050d4c40a993dd5e8e59b16682dfd8f59d5afe6ce07e803
symbol_refs: [name, hostname]
semantic_role: pattern
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
:::
result if {
    some i, j
    sites[i].servers[j].name == "web-0"
    hostname := sites[i].servers[j].hostname
}

# Or with 'in'
result if {
    some site in sites
    some server in site.servers
    server.name == "web-0"
}
:::

::: code-pattern
id: CODE-ea38956bc4339e53
language: rego
chapter: CH-04
source: term:Dual Purpose
purpose: definition-example
pattern_type: quantifier
pattern_subtype: existential
tags: [quantifier, existential]
pattern_metadata: {'quantifier': 'some'}
digest: d4d9e120975a5baf850281efa9613b3749aaa2e4fdb738ac3a0a953775101e31
symbol_refs: []
semantic_role: pattern
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
semantic_categories: [negation, testing]
:::
# Membership testing (returns boolean)
"admin" in user.roles                 # true/false
3 in [1, 2, 3]                        # true
"key" in {"key": "value"}             # true (checks keys in objects)

# Iteration (with 'some')
some role in user.roles
some i, item in items                 # index and value
some key, value in object             # key and value

# Negation
not "admin" in user.roles
:::

::: code-pattern
id: CODE-1b107ec7cb6ae135
language: rego
chapter: CH-04
source: term:Array Iteration
purpose: definition-example
pattern_type: quantifier
pattern_subtype: existential
tags: [quantifier, existential]
pattern_metadata: {'quantifier': 'some'}
digest: 242d316b3c5a2ed07fd275d9f3249c354cf501d8369748c7904eaa258ea2bf02
symbol_refs: [i, item]
semantic_role: pattern
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
:::
# Values only
some item in [1, 2, 3]

# Index and value
some i, item in [1, 2, 3]
# Binds: i=0, item=1; then i=1, item=2; etc.
:::

::: code-pattern
id: CODE-46f9779c90ce8a98
language: rego
chapter: CH-04
source: term:Object Iteration
purpose: definition-example
pattern_type: quantifier
pattern_subtype: existential
tags: [quantifier, existential]
pattern_metadata: {'quantifier': 'some'}
digest: f089032b1880f993255a3dab5038be0752f67f8c38a8d982a4ba5f70ab4a051c
symbol_refs: []
semantic_role: pattern
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
:::
# Values only
some val in {"a": 1, "b": 2}

# Key and value
some key, val in {"a": 1, "b": 2}
:::

::: code-pattern
id: CODE-f0186ce6d764df50
language: rego
chapter: CH-04
source: term:Set Iteration
purpose: definition-example
pattern_type: quantifier
pattern_subtype: existential
tags: [quantifier, existential]
pattern_metadata: {'quantifier': 'some'}
digest: e0c9be9dce08e6ff6d1b4d4908fd3e4d6ce3b22fd492b693005036e04c4103fe
symbol_refs: []
semantic_role: pattern
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
:::
# Members
some member in {1, 2, 3}
:::

::: code-pattern
id: CODE-7d36c777bc54eff2
chapter: CH-04
language: rego
role: example
tags: []
explanation: Assignment with :=
confidence: 0.9
pattern_type: generic
digest: 1d70e506114a632d5bc9a3d0a92544d1ab67c51d67b8807fb0675f7608eb38f2
symbol_refs: [name, x]
semantic_role: pattern
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
:::
x := 42
name := input.user.name

:::

::: code-pattern
id: CODE-16006224b7fc05e6
chapter: CH-04
language: rego
role: example
tags: []
explanation: Complex patterns
confidence: 0.9
pattern_type: generic
digest: f3e38d6092a666a1d6bea50c27b31b29a6cdefc435cc529b2cce45b5891aaefc
symbol_refs: []
semantic_role: pattern
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
:::
{"user": user, "role": role} = input.request
:::

::: code-pattern
id: CODE-6657dc626f7f81a0
chapter: CH-04
language: rego
role: code-pattern:generic
tags: [generic]
pattern_type: generic
digest: 4815782f2c4ed409f4e37d46a2ceb47a78efe694594f20edab89d6a659e5d003
symbol_refs: [user]
semantic_role: pattern
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
code_smell_probability: 1.0
:::
# ❌ Unsafe
bad_rule if {
    not blacklisted[user]  # user never defined
}

# ✅ Safe
good_rule if {
    user := input.user.id
    not blacklisted[user]
}
:::

::: code-pattern
id: CODE-2f6d9a5bbe34c891
chapter: CH-04
language: rego
role: example
tags: []
explanation: Dot notation (for simple keys)
confidence: 0.9
pattern_type: generic
digest: 30cee5856e1d937aeef7464bff66b950deeee223bb09f96a5a5bb2978733f869
symbol_refs: []
semantic_role: pattern
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
:::
input.user.name
data.roles.admin

:::

::: code-pattern
id: CODE-917af16bdaf9c69e
chapter: CH-04
language: rego
role: example
tags: []
explanation: Variable keys
confidence: 0.9
pattern_type: generic
digest: b567b769075d0977204d613c1b59d4cfcdbc393f653bd0dd282ec673fb0fe796
symbol_refs: []
semantic_role: pattern
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
:::
users[user_id]
data.permissions[input.user.role]

:::

::: code-pattern
id: CODE-a177475f64f6ae17
chapter: CH-04
language: rego
role: example
tags: []
explanation: Safe access with default
confidence: 0.9
pattern_type: generic
digest: 3bd0e6564271caf008c6e99e9abe6fdd5585a024f4e4a137bd9b5f0c03d99abb
symbol_refs: [hostname]
semantic_role: pattern
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
:::
hostname := input.server.hostname if input.server.hostname
default hostname := "unknown"
:::

::: code-pattern
id: CODE-eb1bcfa56e45915a
chapter: CH-04
language: rego
role: code-pattern:generic
tags: [generic]
pattern_type: generic
digest: 65c98312aea89cade27ca804a077bf06d864e935e6f2ad72911f01779a05a3ea
symbol_refs: [x]
semantic_role: pattern
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
:::
x == y   # Equal
x != y   # Not equal
x < y    # Less than
x <= y   # Less than or equal
x > y    # Greater than
x >= y   # Greater than or equal
:::

::: code-pattern
id: CODE-d89dfa73fd3f18f9
chapter: CH-04
language: rego
role: code-pattern:generic
tags: [generic]
pattern_type: generic
digest: f92aef99ec73b60f017bf250094010f7671336f0fede72f594573a041e07d57a
symbol_refs: []
semantic_role: pattern
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
:::
# Same types
1 < 2                    # ✅ true
"a" < "b"                # ✅ true

# Different types
1 < "2"                  # ❌ undefined (not an error)
:::

::: common-mistake
id: BLK-d7c09f7edc839a82
summary: Cannot start with: - Literal arrays: [1,2,3][0] ❌ - Literal objects: {"a":1}.a ❌ - Literal sets: {1,2,3}[0] ❌.
digest: 7945843ab4b3590597b4e631956ac5122077459b24644290347dd60fa3cf21b4
symbol_refs: []
semantic_role: content
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
code_smell_probability: 0.8
pattern_role: anti-pattern
severity: high
chapter: CH-04
:::
2. Cannot start with: - Literal arrays: `[1,2,3][0]` ❌ - Literal objects: `{"a":1}.a` ❌ - Literal sets: `{1,2,3}[0]` ❌
:::

::: common-mistake
id: BLK-91f77ccc9a537a4b
summary: # ❌ Invalid: literals are values, not reference roots x := [1, 2, 3][0] y := {"name": "Alice"}.name z := {1, 2, 3}[0].
digest: 9ea6df714152c58dc74a655a59d990622c75b318d434682bc0986472265def8a
symbol_refs: []
semantic_role: reference
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
code_smell_probability: 0.8
pattern_role: anti-pattern
severity: high
chapter: CH-04
:::
# ❌ Invalid: literals are values, not reference roots x := [1, 2, 3][0] y := {"name": "Alice"}.name z := {1, 2, 3}[0]
:::

::: constraint
id: CONSTR-b960952c21854a8d
chapter: CH-04
source_id: TERM-da82327651a758ef
type: forbidden
digest: 2d0acf879fa226a685c954d80f3414d4549dc0839411f2bbe47dc4748e5087ba
symbol_refs: []
semantic_role: content
:::
This block describes a forbidden or disallowed behavior.
:::

::: table
id: TABLE-40d7c73b90f30b23
chapter: CH-04
headers: [Operator, Name, Usage, Rebind Allowed?]
row_count: 3
caption: 
rows: [['`:=`', 'Assignment', '`x := 10`', 'No'], ['`=`', 'Unification', '`x = y`', 'Yes (pattern match)'], ['`==`', 'Equality', '`x == y`', 'Yes (comparison)']]
digest: 142788e5f519ae35c785c9e4f9f9d8eb251af3b227b88775f344ca8976686189
symbol_refs: []
semantic_role: reference
embedding_hint_importance: low
embedding_hint_scope: local
embedding_hint_chunk: auto
semantic_categories: [unification]
:::
:::

::: table
id: TABLE-9a6e7e95ed856ec4
chapter: CH-04
type: dos-donts
headers: [Do, Don't]
rows: [['Variables must be "grounded" (defined) before use in: - Negated expressions - Certain built-in function arguments - Comparisons (when using ==).', 'Cannot start with: - Literal arrays: [1,2,3][0] ❌ - Literal objects: {"a":1}.a ❌ - Literal sets: {1,2,3}[0] ❌.'], ['Must start with: - Variable - input or data (implicitly imported) - Function call.', '# ❌ Invalid: literals are values, not reference roots x := [1, 2, 3][0] y := {"name": "Alice"}.name z := {1, 2, 3}[0].'], ['Rego references let you navigate input, data, and local bindings.', ''], ['Local variables (from rule heads or := in bodies).', ''], ['Rego’s reference grammar requires that a reference start from a reference root, not a literal value.', ''], ['The problem is not that indexing literals is conceptually impossible; it’s that in Rego, literals are not references.', ''], ['# ✅ Valid: assign literal to variable then index/select arr := [1, 2, 3] x := arr[0].', '']]
digest: 32bc877c9d626139521d86714851659294797924790fd5c7bb2f76908121d9dc
symbol_refs: []
semantic_role: reference
:::
| Do | Don't |
| --- | --- |
| Variables must be "grounded" (defined) before use in: - Negated expressions - Certain built-in function arguments - Comparisons (when using ==). | Cannot start with: - Literal arrays: [1,2,3][0] ❌ - Literal objects: {"a":1}.a ❌ - Literal sets: {1,2,3}[0] ❌. |
| Must start with: - Variable - input or data (implicitly imported) - Function call. | # ❌ Invalid: literals are values, not reference roots x := [1, 2, 3][0] y := {"name": "Alice"}.name z := {1, 2, 3}[0]. |
| Rego references let you navigate input, data, and local bindings. |  |
| Local variables (from rule heads or := in bodies). |  |
| Rego’s reference grammar requires that a reference start from a reference root, not a literal value. |  |
| The problem is not that indexing literals is conceptually impossible; it’s that in Rego, literals are not references. |  |
| # ✅ Valid: assign literal to variable then index/select arr := [1, 2, 3] x := arr[0]. |  |
:::

::: qa
id: QA-1367c92c537068f6
chapter: CH-04
q: What is Variable Declaration in the context of Rego/OPA?
a: ```rego Assignment with := x := 42 name := input.user.name Variables are immutable within scope x := 42 x := 43 # ❌ ERROR: Variable x referenced above ```
reference: TERM-1a0cf4c1598ec141
digest: 159535d5829cc6e385494e812663dc57f0c9c616e2f979a3279f4932086dac0c
symbol_refs: []
semantic_role: explanation
:::
:::

::: qa
id: QA-6e39e8d9737e442a
chapter: CH-04
q: What is Must start with in the context of Rego/OPA?
a: Must start with: - Variable - `input` or `data` (implicitly imported) - Function call
reference: BLK-374855f2833979c7
digest: a8b5fcb838c6ff1fb9c8e5a88b58e4cb9efb48767772ede49c46b9699c34d41c
symbol_refs: []
semantic_role: explanation
:::
:::

::: reasoning-chain
id: CHAIN-1a588b6ed48183f3
chapter: CH-04
qa_id: QA-1367c92c537068f6
reference: TERM-1a0cf4c1598ec141
semantic_categories: [truth-values]
digest: 3a996ef04cc3c742225172abb69a2c15780bebca170863035fbe1e09d04ea8cd
symbol_refs: []
semantic_role: content
:::
- Read the question carefully.
- Recall the relevant definition or rule.
- Match the question scenario to the rule.
- Consider edge cases (e.g., undefined vs false).
- Summarize the conclusion clearly.
:::

::: role-note
id: ROLE-e847e3a1070d248e
chapter: CH-04
role: Policy Author
guidance: Focus on correctness & clarity of rules in this chapter.
digest: 2e81f22a709d2e14f36a2f7388f1f8ded0bd41a3dd0f85c28fc6abedbe4eb367
symbol_refs: []
semantic_role: content
:::
:::

::: diagram
id: DIAG-b21d3dfa30d02e7e
chapter: CH-04
language: ascii
diagram_type: decision
summary: decision diagram
nodes: [{'id': 'node_0', 'label': 'first, second'}, {'id': 'node_1', 'label': '1, 2'}, {'id': 'node_2', 'label': '"user": user, "role": role'}]
edges: [{'source': 'node_0', 'target': 'node_1', 'type': 'directed'}, {'source': 'node_1', 'target': 'node_2', 'type': 'directed'}]
normalized_content: [first, second]
[1, 2]
["user": user, "role": role]
node_0 -> node_1
node_1 -> node_2
digest: 01603ea8a42d2ebe5ed01a6ce19bfaef54228b5f2e847288c35e3bf1966820ff
symbol_refs: []
semantic_role: visualization
embedding_hint_importance: medium
embedding_hint_scope: local
embedding_hint_chunk: auto
semantic_categories: [unification]
:::
# Pattern matching
[first, second] = [1, 2]
# first → 1, second → 2

# Symmetric unification
x = y  # Makes x and y equal

# Complex patterns
{"user": user, "role": role} = input.request
:::

::: diagram
id: DIAG-d95104493c915f24
chapter: CH-04
language: ascii
diagram_type: diagram
summary: diagram diagram
nodes: []
edges: []
normalized_content: 
digest: 85ed2cf408494b309484303f2c41696f243604c7579f051b686c6e813609edbc
symbol_refs: []
semantic_role: visualization
embedding_hint_importance: medium
embedding_hint_scope: local
embedding_hint_chunk: auto
:::
x + y    # Addition
x - y    # Subtraction
x * y    # Multiplication
x / y    # Division (float result)
x % y    # Modulo (remainder)
:::

::: diagram
id: DIAG-1d2989eaca3d9c18
chapter: CH-04
language: ascii
diagram_type: diagram
summary: diagram diagram
nodes: []
edges: []
normalized_content: 
digest: bc534f5121682462b86643469714fc6c5451970c0169404fbad0e1fc8fea7d96
symbol_refs: []
semantic_role: visualization
embedding_hint_importance: medium
embedding_hint_scope: local
embedding_hint_chunk: auto
:::
sum := 10 + 5        # 15
diff := 10 - 5       # 5
product := 10 * 5    # 50
quotient := 10 / 5   # 2 (float)
remainder := 10 % 3  # 1
:::

::: test-hint
id: TEST-9806c513344f1306
chapter: CH-04
source_id: CODE-43fdfdc8d23de345
digest: fb711cbb731cc406f7a4ba86a32477d14e5179bae25f4d795b584704d712f0c3
symbol_refs: []
semantic_role: content
:::
Convert this snippet into a unit test by constructing input and asserting allow/deny.
:::

::: section-meta
id: SECMETA-ecdd76c8aec57949
title: 4.1 Variables and Unification
level: 3
chapter: CH-04
parent_section: None
line_no: 688
digest: d0a0d9e119a661c1f9ca52387be1055c98b34eb86962c751440a56458f1f5520
symbol_refs: []
semantic_role: structure
token_range: (688, 688)
char_offset: (54960, 54989)
source_ref: {'line': 688, 'column': 0}
embedding_hint_importance: low
embedding_hint_scope: local
embedding_hint_chunk: auto
semantic_categories: [unification]
:::
:::

::: term
id: TERM-b522fb509bee52d0
name: Multiple expressions in a rule body
definition: ```rego
allow if {
    input.user.role == "admin"       # Must be true AND
    input.user.active == true         # Must be true AND
    input.resource.sensitive == false # Must be true
}
```
aliases: []
chapter: CH-05
digest: 4c5a3c04ae14e5ad1b616359fd773b0192428d42895f9d502cea44ac4f8eb49f
symbol_refs: [Multiple expressions in a rule body]
semantic_role: definition
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
vector_summary: ```rego allow if { input.user.role == "admin" # Must be true AND input.user.active == true # Must be true AND input.resource.sensitive == false # Must be true } ```
:::
:::

::: concept
id: BLK-ef0eb00e6bda8ba3
summary: 6.2 Built-in Function Categories (Overview).
digest: ba196881ebd3f85a68c175e308223c851e5e76dfbc1821eb7000c5a3b037eb52
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that 6.2 Built-in Function Categories (Overview)..
vector_summary: 6.2 Built-in Function Categories (Overview).
chapter: CH-05
:::
6.2 Built-in Function Categories (Overview)
:::

::: concept
id: BLK-49055f6875f1cc73
summary: For orientation, here is the taxonomy we’ll use in this chapter:.
digest: d6daa4b0d9b9d5545660a5bb22a7bd069363ef4b05ce3f6a9eafccfc12e75f7f
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that For orientation, here is the taxonomy we’ll use in this chapter:..
vector_summary: For orientation, here is the taxonomy we’ll use in this chapter:.
chapter: CH-05
:::
For orientation, here is the taxonomy we’ll use in this chapter:
:::

::: concept
id: BLK-cf46e6696f6b22f0
summary: Aggregates: count, sum, product, min, max, sort, all, any.
digest: f3d2cd46b8d2dfda463b61a5a619ac87bd07fcb3e60eb7098c70ec3308bd3e0c
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Aggregates: count, sum, product, min, max, sort, all, any..
vector_summary: Aggregates: count, sum, product, min, max, sort, all, any.
chapter: CH-05
:::
Aggregates: count, sum, product, min, max, sort, all, any
:::

::: concept
id: BLK-b772a28e5960357e
summary: Arrays: array.concat, array.slice, array.reverse, array.sort, array.filter.
digest: 336a600a3a0b6d13a1b12bd154db932bab97064ad5fade25646eee7f2123708f
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Arrays: array.concat, array.slice, array.reverse, array.sort, array.filter..
vector_summary: Arrays: array.concat, array.slice, array.reverse, array.sort, array.filter.
chapter: CH-05
:::
Arrays: array.concat, array.slice, array.reverse, array.sort, array.filter
:::

::: concept
id: BLK-6e16416ce945a0fe
summary: Sets & Set-like operations: union, intersection, set_diff, minus, distinct, to_set.
digest: 21b445bcbce27e419233f950efa141abdc6c3dd97510af83de45e6d5882333fe
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Sets & Set-like operations: union, intersection, set_diff, minus, distinct, to_set..
vector_summary: Sets & Set-like operations: union, intersection, set_diff, minus, distinct, to_set.
chapter: CH-05
:::
Sets & Set-like operations: union, intersection, set_diff, minus, distinct, to_set
:::

::: concept
id: BLK-b6acfeb73ecfb3bd
summary: Objects & JSON paths: object.get, object.remove, object.union, object.filter, json.filter.
digest: 04c69d2b6e1d66a8a1d45dfd987553268907e845313dc00bac850ff5ba60ccaf
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Objects & JSON paths: object.get, object.remove, object.union, object.filter, json.filter..
vector_summary: Objects & JSON paths: object.get, object.remove, object.union, object.filter, json.filter.
chapter: CH-05
:::
Objects & JSON paths: object.get, object.remove, object.union, object.filter, json.filter
:::

::: concept
id: BLK-ffa6ad16a050d7d9
summary: Strings: concat, contains, startswith, endswith, indexof, lower, upper, replace, split, sprintf, substring, trim* family.
digest: dd5826e76368354c89c9c0aaa7082cf28fd380a5e5f3b40611d3d760ded34cb1
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Strings: concat, contains, startswith, endswith, indexof, lower, upper, replace, split, sprintf, substring, trim* family..
vector_summary: Strings: concat, contains, startswith, endswith, indexof, lower, upper, replace, split, sprintf, substring, trim* family.
chapter: CH-05
:::
Strings: concat, contains, startswith, endswith, indexof, lower, upper, replace, split, sprintf, substring, trim* family
:::

::: concept
id: BLK-3d88482e4061db9e
summary: Regular Expressions: regex.is_valid, regex.match, regex.find_n, regex.split.
digest: fb59c631a1bee0a7f96c143b496ceac9a479ed5a6ab5ea63d8b3d5e398d64505
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Regular Expressions: regex.is_valid, regex.match, regex.find_n, regex.split..
vector_summary: Regular Expressions: regex.is_valid, regex.match, regex.find_n, regex.split.
chapter: CH-05
:::
Regular Expressions: regex.is_valid, regex.match, regex.find_n, regex.split
:::

::: concept
id: BLK-aad1a170dd666677
summary: Numbers & Numeric Utilities: abs, ceil, floor, round, numbers.range, comparisons.
digest: bb6f4964c96aabbace6f40e0dd48b99617084f24f97e16a0a5baf5898fefece5
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Numbers & Numeric Utilities: abs, ceil, floor, round, numbers.range, comparisons..
vector_summary: Numbers & Numeric Utilities: abs, ceil, floor, round, numbers.range, comparisons.
chapter: CH-05
:::
Numbers & Numeric Utilities: abs, ceil, floor, round, numbers.range, comparisons
:::

::: concept
id: BLK-ccdb280747300dd7
summary: Type Conversion & Validation: to_number, to_string, to_set, to_array, to_object, cast_*, json.is_valid, yaml.is_valid.
digest: cc810f8df810c448038b6c6a6bdb71f6ec68750a4b0be96752d3011328cf2acc
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Type Conversion & Validation: to_number, to_string, to_set, to_array, to_object, cast_*, json.is_valid, yaml.is_valid..
vector_summary: Type Conversion & Validation: to_number, to_string, to_set, to_array, to_object, cast_*, json.is_valid, yaml.is_valid.
chapter: CH-05
:::
Type Conversion & Validation: to_number, to_string, to_set, to_array, to_object, cast_*, json.is_valid, yaml.is_valid
:::

::: concept
id: BLK-6019bf75ef6624c0
summary: Encoding/Decoding & Serialization: base64.*, base64url.*, hex.*, json.marshal/unmarshal, yaml.marshal/unmarshal, urlquery.*.
digest: d2a6d30479bd0e615a1ae4a011c36348a59cc3b4e8e02b4195e74e83d881fc02
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Encoding/Decoding & Serialization: base64.*, base64url.*, hex.*, json.marshal/unmarshal, yaml.marshal/unmarshal, urlquery.*..
vector_summary: Encoding/Decoding & Serialization: base64.*, base64url.*, hex.*, json.marshal/unmarshal, yaml.marshal/unmarshal, urlquery.*.
chapter: CH-05
:::
Encoding/Decoding & Serialization: base64.*, base64url.*, hex.*, json.marshal/unmarshal, yaml.marshal/unmarshal, urlquery.*
:::

::: concept
id: BLK-6b408802776a93cd
summary: Type Introspection: is_array, is_boolean, is_null, is_number, is_object, is_set, is_string, type_name.
digest: d94fea50fb0624b9534133b1541892eea8967d0da40a807bb9ce6a547edfdb94
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Type Introspection: is_array, is_boolean, is_null, is_number, is_object, is_set, is_string, type_name..
vector_summary: Type Introspection: is_array, is_boolean, is_null, is_number, is_object, is_set, is_string, type_name.
graph_neighbors: [CODE-fa97df2a115ae029]
graph_degree: 1
graph_two_hop: []
graph_three_hop: []
chapter: CH-05
:::
Type Introspection: is_array, is_boolean, is_null, is_number, is_object, is_set, is_string, type_name
:::

::: concept
id: BLK-f4ead349338c8ef6
summary: Cryptography & Security: crypto.* hashes, HMAC, PBKDF, bcrypt, JWT (io.jwt.*), crypto.x509.*.
digest: 8bbef7b238a0b074fb6f0f5fb8b60f4819ac3cfbe0b7ed990f92aad000fa7daa
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Cryptography & Security: crypto.* hashes, HMAC, PBKDF, bcrypt, JWT (io.jwt.*), crypto.x509.*..
vector_summary: Cryptography & Security: crypto.* hashes, HMAC, PBKDF, bcrypt, JWT (io.jwt.*), crypto.x509.*.
chapter: CH-05
:::
Cryptography & Security: crypto.* hashes, HMAC, PBKDF, bcrypt, JWT (io.jwt.*), crypto.x509.*
:::

::: concept
id: BLK-54e2cf6d9a981dc3
summary: Time & Temporal Logic: time.now_ns, time.parse_*, time.date, time.clock, time.weekday, diffs.
digest: c2e7b35fae5158fc8a8976a841108ed88075fdca8c7222958c1d57e9540282b5
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Time & Temporal Logic: time.now_ns, time.parse_*, time.date, time.clock, time.weekday, diffs..
vector_summary: Time & Temporal Logic: time.now_ns, time.parse_*, time.date, time.clock, time.weekday, diffs.
chapter: CH-05
:::
Time & Temporal Logic: time.now_ns, time.parse_*, time.date, time.clock, time.weekday, diffs
:::

::: concept
id: BLK-c595ba2ed67a0e45
summary: HTTP & I/O: http.send for outbound HTTP calls.
digest: adcdd4fa4cc860361a1ed82756f6cd6b451474cb4a72ae1ec0076125533c2ae1
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that HTTP & I/O: http.send for outbound HTTP calls..
vector_summary: HTTP & I/O: http.send for outbound HTTP calls.
chapter: CH-05
:::
HTTP & I/O: http.send for outbound HTTP calls
:::

::: concept
id: BLK-c7baced805939b57
summary: Network & CIDR: net.cidr_contains, net.cidr_expand, net.cidr_intersects, net.cidr_merge.
digest: a90d7ff390ad1b4acf3292c6cf637c3ca477f63855d6f28fccd160af56f3cbcd
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Network & CIDR: net.cidr_contains, net.cidr_expand, net.cidr_intersects, net.cidr_merge..
vector_summary: Network & CIDR: net.cidr_contains, net.cidr_expand, net.cidr_intersects, net.cidr_merge.
chapter: CH-05
:::
Network & CIDR: net.cidr_contains, net.cidr_expand, net.cidr_intersects, net.cidr_merge
:::

::: concept
id: BLK-82cc3ccae9f078e0
summary: UUID/ULID: uuid.*, ulid.generate.
digest: 760dd3cdab43df16516b74a7feb7927787d021ac61549844dfba88d3959b6ce8
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that UUID/ULID: uuid.*, ulid.generate..
vector_summary: UUID/ULID: uuid.*, ulid.generate.
chapter: CH-05
:::
UUID/ULID: uuid.*, ulid.generate
:::

::: concept
id: BLK-cdbdae08e6768e75
summary: Graph & Structural Walks: graph.reachable, walk.
digest: f0e1b62d3ebce4c42bd109d546df366114b3a4b5d27fb3e82629a925ce88538a
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Graph & Structural Walks: graph.reachable, walk..
vector_summary: Graph & Structural Walks: graph.reachable, walk.
chapter: CH-05
:::
Graph & Structural Walks: graph.reachable, walk
:::

::: concept
id: BLK-872e72b8a1e0cda1
summary: Units: units.parse, units.parse_bytes.
digest: 2c2707ccfa9db50bd16c82233eb09cd55fb97f24410fbc5cc077187aee4845b7
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Units: units.parse, units.parse_bytes..
vector_summary: Units: units.parse, units.parse_bytes.
chapter: CH-05
:::
Units: units.parse, units.parse_bytes
:::

::: concept
id: BLK-00a76d3fd313f7d0
summary: Debugging: print, trace.
digest: d8d3838f96e8e6baf3055a45b5d8d1e67439fc37963e573ed0e63bbd6653ace8
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Debugging: print, trace..
vector_summary: Debugging: print, trace.
chapter: CH-05
:::
Debugging: print, trace
:::

::: concept
id: BLK-2ef44c7e2eba38d6
summary: Error Semantics: Strict vs non-strict behavior.
digest: 7eb4a177571432e6319a7770a031beb7f716887d7bf7da13fb04256d2d3464d6
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Error Semantics: Strict vs non-strict behavior..
vector_summary: Error Semantics: Strict vs non-strict behavior.
chapter: CH-05
:::
Error Semantics: Strict vs non-strict behavior
:::

::: concept
id: BLK-962ae7799bfaea26
summary: We’ll now go category by category, with semantics, examples, and pitfalls.
digest: de41e11cf5d44150f8ccdd6102b7ec6c46e431f0014138db928e712b90ef5e33
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that We’ll now go category by category, with semantics, examples, and pitfalls..
vector_summary: We’ll now go category by category, with semantics, examples, and pitfalls.
graph_neighbors: [TERM-7189e73f44e918ef]
graph_degree: 1
graph_two_hop: []
graph_three_hop: []
chapter: CH-05
:::
We’ll now go category by category, with semantics, examples, and pitfalls.
:::

::: concept
id: BLK-596d0d11df0a2b34
summary: Purpose: Reduce collections to scalars (counts, sums, min/max, logical AND/OR).
digest: 44f58fc8f7ff63548be69487e74890a7bd56b466a3237260d62803b69bd29ebe
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Purpose: Reduce collections to scalars (counts, sums, min/max, logical AND/OR)..
vector_summary: Purpose: Reduce collections to scalars (counts, sums, min/max, logical AND/OR).
chapter: CH-05
:::
Purpose: Reduce collections to scalars (counts, sums, min/max, logical AND/OR).
:::

::: concept
id: BLK-7934af716417f7d8
summary: Count(x) # length of array, set, or string sum(array) # numeric sum of array elements product(array) # numeric product max(array) # maximum element...
digest: 3c1cd4957cdf1f0df8eca75945fa3187e0ee9fc2952094ad128f8b4b8b6f1864
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Count(x) # length of array, set, or string sum(array) # numeric sum of array elements product(array) # numeric product max(array) # maximum element....
vector_summary: Count(x) # length of array, set, or string sum(array) # numeric sum of array elements product(array) # numeric product max(array) # maximum element...
chapter: CH-05
:::
count(x) # length of array, set, or string sum(array) # numeric sum of array elements product(array) # numeric product max(array) # maximum element min(array) # minimum element sort(array) # sorted copy (ascending) all(array_bool) # AND over boolean array any(array_bool) # OR over boolean array
:::

::: concept
id: BLK-791542a3ee72c589
summary: # Count API keys api_key_count := count(input.api_keys).
digest: 4cac19509195ee7736b155bd6f8ad6ec2bd9848da923669325e66bc70b99f97a
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that # Count API keys api_key_count := count(input.api_keys)..
vector_summary: # Count API keys api_key_count := count(input.api_keys).
chapter: CH-05
:::
# Count API keys api_key_count := count(input.api_keys)
:::

::: concept
id: BLK-f48113faff5c16ae
summary: # Any admin users? has_admin if { any([role == "admin" | some role in input.user.roles]) }.
digest: 9527a1bbfcdbae3d3ebb88b39ec279ad0982d774e10f44cd13e29858e105e5a0
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that # Any admin users? has_admin if { any([role == "admin" | some role in input.user.roles]) }..
vector_summary: # Any admin users? has_admin if { any([role == "admin" | some role in input.user.roles]) }.
chapter: CH-05
:::
# Any admin users? has_admin if { any([role == "admin" | some role in input.user.roles]) }
:::

::: concept
id: BLK-74ff565e561f01ba
summary: Sum, product, max, min require arrays of numbers; mixing types → expression undefined.
digest: 733590d33f82c6d0394d8af8f1eef7b781cf543283387776bb6f4a14c61d42d2
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Sum, product, max, min require arrays of numbers; mixing types → expression undefined..
vector_summary: Sum, product, max, min require arrays of numbers; mixing types → expression undefined.
chapter: CH-05
:::
sum, product, max, min require arrays of numbers; mixing types → expression undefined.
:::

::: concept
id: BLK-2c081e539ff9ca26
summary: Count accepts arrays, sets, strings:.
digest: 2f47ce9220e1db533d40876624168f0f231f1ab62e02abf2305b670059d6eb31
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Count accepts arrays, sets, strings:..
vector_summary: Count accepts arrays, sets, strings:.
chapter: CH-05
:::
count accepts arrays, sets, strings:
:::

::: concept
id: BLK-15482deb4216bdc0
summary: Count("abc") # 3 count({"a", "b"}) # 2.
digest: 59b555036443d043a9b52ce83a453b5428bd149369015972ec330a3480809c5b
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Count("abc") # 3 count({"a", "b"}) # 2..
vector_summary: Count("abc") # 3 count({"a", "b"}) # 2.
chapter: CH-05
:::
count("abc") # 3 count({"a", "b"}) # 2
:::

::: concept
id: BLK-99bc66bd2d2d22ac
summary: Pattern: Use count for guardrails:.
digest: 7009c0f15e92c507e9b0ade36a2ef2012cea3893bbd773148ea6f95934562aab
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Pattern: Use count for guardrails:..
vector_summary: Pattern: Use count for guardrails:.
chapter: CH-05
:::
Pattern: Use count for guardrails:
:::

::: concept
id: BLK-bbc8d74e03606e88
summary: Deny[msg] if { count(input.changed_files) > 100 msg := "PR changes too many files" }.
digest: b64ea629921a991987420dbc9cd41c98146174d242b53a886923c512b0cbd10e
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Deny[msg] if { count(input.changed_files) > 100 msg := "PR changes too many files" }..
vector_summary: Deny[msg] if { count(input.changed_files) > 100 msg := "PR changes too many files" }.
chapter: CH-05
:::
deny[msg] if { count(input.changed_files) > 100 msg := "PR changes too many files" }
:::

::: concept
id: BLK-63f3203792f6dd9a
summary: Arrays are ordered; built-ins treat them as such.
digest: 90ddeef5ace95fc365eeb05e84416e303b0fed88560806a8d14095e8236071a4
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Arrays are ordered; built-ins treat them as such..
vector_summary: Arrays are ordered; built-ins treat them as such.
chapter: CH-05
:::
Arrays are ordered; built-ins treat them as such.
:::

::: concept
id: BLK-0170fbca460ac05f
summary: Array.concat(a, b) # [a..., b...] array.slice(a, start, end) # a[start:end], end-exclusive array.reverse(a) # reversed copy.
digest: c3acd7de6bf285ba431e2acceecd39f78a8ac22593368c0cae724ef5528a4c7f
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Array.concat(a, b) # [a..., b...] array.slice(a, start, end) # a[start:end], end-exclusive array.reverse(a) # reversed copy..
vector_summary: Array.concat(a, b) # [a..., b...] array.slice(a, start, end) # a[start:end], end-exclusive array.reverse(a) # reversed copy.
chapter: CH-05
:::
array.concat(a, b) # [a..., b...] array.slice(a, start, end) # a[start:end], end-exclusive array.reverse(a) # reversed copy
:::

::: concept
id: BLK-fe1ce0476ba80606
summary: # Pagination utilities page(slice_start, slice_len) := array.slice(input.results, slice_start, slice_start+slice_len).
digest: 8c50ab4dc393e722df43aaa1cb9ddd473fc549dda4df5e93b3ecc3faf4ae8b82
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that # Pagination utilities page(slice_start, slice_len) := array.slice(input.results, slice_start, slice_start+slice_len)..
vector_summary: # Pagination utilities page(slice_start, slice_len) := array.slice(input.results, slice_start, slice_start+slice_len).
chapter: CH-05
:::
# Pagination utilities page(slice_start, slice_len) := array.slice(input.results, slice_start, slice_start+slice_len)
:::

::: concept
id: BLK-404c395d3ea15d7a
summary: # Compose routes full_path := concat("/", ["api", input.version, "users", input.user_id]) reversed := array.reverse([1, 2, 3]) # [3, 2, 1].
digest: 346e5cb98f392e46ef9facbde3351f4514ac4871a9a0819d9a071f563bb30013
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that # Compose routes full_path := concat("/", ["api", input.version, "users", input.user_id]) reversed := array.reverse([1, 2, 3]) # [3, 2, 1]..
vector_summary: # Compose routes full_path := concat("/", ["api", input.version, "users", input.user_id]) reversed := array.reverse([1, 2, 3]) # [3, 2, 1].
chapter: CH-05
:::
# Compose routes full_path := concat("/", ["api", input.version, "users", input.user_id]) reversed := array.reverse([1, 2, 3]) # [3, 2, 1]
:::

::: concept
id: BLK-21aad7baea9ba2e2
summary: Indexing vs slicing:.
digest: 0e1f4dfe100f500e3ab70afe698e9d9a9fef3326a67639f03b6dffc52e15b7cb
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Indexing vs slicing:..
vector_summary: Indexing vs slicing:.
chapter: CH-05
:::
Indexing vs slicing:
:::

::: concept
id: BLK-e94daebb356ba43f
summary: Out-of-range indices → expression undefined.
digest: 164dea8ed9f4ce4e5f2bc597b75b1077496538b6fa9d9ead074583093776bca7
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Out-of-range indices → expression undefined..
vector_summary: Out-of-range indices → expression undefined.
chapter: CH-05
:::
Out-of-range indices → expression undefined.
:::

::: concept
id: BLK-08cda054b5b03bbf
summary: 6.5 Sets and Set-like Operations.
digest: f47456072d5fb42c7586ef3cc662983a4e78b776c5bf7054a5a70bcb9e987ffa
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that 6.5 Sets and Set-like Operations..
vector_summary: 6.5 Sets and Set-like Operations.
chapter: CH-05
:::
6.5 Sets and Set-like Operations
:::

::: concept
id: BLK-e37b22113d09ec95
summary: Intersection(s1, s2) # {x | x in s1 ∧ x in s2} union(s1, s2) # {x | x in s1 ∨ x in s2} set_diff(s1, s2) # {x | x in s1 ∧ x ∉ s2} to_set(array) # co...
digest: aa76a84ed6064e2596cd79bc1b716bdb7ccc5f0c168f0d951d8a754adc96f541
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Intersection(s1, s2) # {x | x in s1 ∧ x in s2} union(s1, s2) # {x | x in s1 ∨ x in s2} set_diff(s1, s2) # {x | x in s1 ∧ x ∉ s2} to_set(array) # co....
vector_summary: Intersection(s1, s2) # {x | x in s1 ∧ x in s2} union(s1, s2) # {x | x in s1 ∨ x in s2} set_diff(s1, s2) # {x | x in s1 ∧ x ∉ s2} to_set(array) # co...
chapter: CH-05
:::
intersection(s1, s2) # {x | x in s1 ∧ x in s2} union(s1, s2) # {x | x in s1 ∨ x in s2} set_diff(s1, s2) # {x | x in s1 ∧ x ∉ s2} to_set(array) # convert array to set
:::

::: concept
id: BLK-12487ad1b10432e4
summary: Allowed_regions := {"us-east-1", "us-west-2"} requested_regions := to_set(input.regions).
digest: fce5b47def5dcf548e5c0c995d1f6134144403cd0caf2b87bf166b4045ee3b2a
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Allowed_regions := {"us-east-1", "us-west-2"} requested_regions := to_set(input.regions)..
vector_summary: Allowed_regions := {"us-east-1", "us-west-2"} requested_regions := to_set(input.regions).
chapter: CH-05
:::
allowed_regions := {"us-east-1", "us-west-2"} requested_regions := to_set(input.regions)
:::

::: concept
id: BLK-3db95d70e67fc31e
summary: Invalid_regions := set_diff(requested_regions, allowed_regions).
digest: cfb5369ef0140e1c75ffde9a26e39cedc4ce62cb80678ed0a45c24ffc2f07107
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Invalid_regions := set_diff(requested_regions, allowed_regions)..
vector_summary: Invalid_regions := set_diff(requested_regions, allowed_regions).
chapter: CH-05
:::
invalid_regions := set_diff(requested_regions, allowed_regions)
:::

::: concept
id: BLK-523debf78d115993
summary: Deny[msg] if { invalid_regions != set() msg := sprintf("Invalid regions: %v", [invalid_regions]) }.
digest: 79f4a78c90c062cf23ce92a4b32227613161300b6fb515836c2a7ce4bdb1dcdf
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Deny[msg] if { invalid_regions != set() msg := sprintf("Invalid regions: %v", [invalid_regions]) }..
vector_summary: Deny[msg] if { invalid_regions != set() msg := sprintf("Invalid regions: %v", [invalid_regions]) }.
chapter: CH-05
:::
deny[msg] if { invalid_regions != set() msg := sprintf("Invalid regions: %v", [invalid_regions]) }
:::

::: concept
id: BLK-d047ca3d47b07bab
summary: Performance pattern: Prefer sets for membership:.
digest: cdd32f7479109e10a67a0da6dfb3f197fc552acb1523d8075e96cbee5f91ac85
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Performance pattern: Prefer sets for membership:..
vector_summary: Performance pattern: Prefer sets for membership:.
chapter: CH-05
:::
Performance pattern: Prefer sets for membership:
:::

::: concept
id: BLK-958bba1048ce58c0
summary: # Fast: O(1) admin_users := {"alice", "bob"} allow if input.user in admin_users.
digest: 7b573ac7d4e905d77b7f62067704e0f1a92bc8bc86b6be3d206d6cab5d151563
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that # Fast: O(1) admin_users := {"alice", "bob"} allow if input.user in admin_users..
vector_summary: # Fast: O(1) admin_users := {"alice", "bob"} allow if input.user in admin_users.
chapter: CH-05
:::
# Fast: O(1) admin_users := {"alice", "bob"} allow if input.user in admin_users
:::

::: concept
id: BLK-9936fd64e4071bcd
summary: # Slower: O(n) admin_list := ["alice", "bob"] allow if input.user in admin_list.
digest: 5dfaa35d9c3c34215d18e7d4ea00a341ce6469a97470aea528b3bcd702787bd4
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that # Slower: O(n) admin_list := ["alice", "bob"] allow if input.user in admin_list..
vector_summary: # Slower: O(n) admin_list := ["alice", "bob"] allow if input.user in admin_list.
chapter: CH-05
:::
# Slower: O(n) admin_list := ["alice", "bob"] allow if input.user in admin_list
:::

::: concept
id: BLK-b7a1e245e128d594
summary: 6.6 Objects & JSON Path Helpers.
digest: 5a82afa25ee18dd8fb97d56759490afa28e264ee15b722d7182806623ce39931
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that 6.6 Objects & JSON Path Helpers..
vector_summary: 6.6 Objects & JSON Path Helpers.
chapter: CH-05
:::
6.6 Objects & JSON Path Helpers
:::

::: concept
id: BLK-6896accc71c6a5e8
summary: Objects represent mappings from scalar keys to arbitrary values.
digest: 5cad10cd3ce4c7429586fceffc73106e4b48a8a3308607ff203263c8fc2a939b
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Objects represent mappings from scalar keys to arbitrary values..
vector_summary: Objects represent mappings from scalar keys to arbitrary values.
chapter: CH-05
:::
Objects represent mappings from scalar keys to arbitrary values.
:::

::: concept
id: BLK-6809c3d7905f3972
summary: Object.get(obj, key, default) # obj[key] or default object.remove(obj, keys_array) # remove listed keys object.union(o1, o2) # merge, o2 wins on co...
digest: a89a5242db6f43340119b3e8d3ea989d7dfe9277527ef892838bd653c69faf72
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Object.get(obj, key, default) # obj[key] or default object.remove(obj, keys_array) # remove listed keys object.union(o1, o2) # merge, o2 wins on co....
vector_summary: Object.get(obj, key, default) # obj[key] or default object.remove(obj, keys_array) # remove listed keys object.union(o1, o2) # merge, o2 wins on co...
chapter: CH-05
:::
object.get(obj, key, default) # obj[key] or default object.remove(obj, keys_array) # remove listed keys object.union(o1, o2) # merge, o2 wins on conflict object.filter(obj, keys_array) # keep only listed keys json.filter(obj, paths_array) # filter by JSON paths (e.g., "a/b/c")
:::

::: concept
id: BLK-64caf7147f83da01
summary: # Defensive access with default timeout_ms := object.get(input.config, "timeout_ms", 1000).
digest: 4504e4e4eaf25a3240feaf1c4f1724e7d455eca828a16f50978610976f2f6134
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that # Defensive access with default timeout_ms := object.get(input.config, "timeout_ms", 1000)..
vector_summary: # Defensive access with default timeout_ms := object.get(input.config, "timeout_ms", 1000).
chapter: CH-05
:::
# Defensive access with default timeout_ms := object.get(input.config, "timeout_ms", 1000)
:::

::: concept
id: BLK-966c15b0885f6587
summary: # Drop sensitive keys before logging sanitized := object.remove(input.request, ["password", "token", "secret"]).
digest: 243cb615762e6481ad625151c0714a03215b54a142a9a23f282c54f751de6914
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that # Drop sensitive keys before logging sanitized := object.remove(input.request, ["password", "token", "secret"])..
vector_summary: # Drop sensitive keys before logging sanitized := object.remove(input.request, ["password", "token", "secret"]).
chapter: CH-05
:::
# Drop sensitive keys before logging sanitized := object.remove(input.request, ["password", "token", "secret"])
:::

::: concept
id: BLK-e6aca8c5011c2c92
summary: # Only retain whitelisted fields log_payload := object.filter(input.request, ["method", "path", "user.id"]).
digest: b97a22aa1c758fa95a6e935c29b5e73f5a800cd373deb20be3df71b1f69f0fe5
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that # Only retain whitelisted fields log_payload := object.filter(input.request, ["method", "path", "user.id"])..
vector_summary: # Only retain whitelisted fields log_payload := object.filter(input.request, ["method", "path", "user.id"]).
chapter: CH-05
:::
# Only retain whitelisted fields log_payload := object.filter(input.request, ["method", "path", "user.id"])
:::

::: concept
id: BLK-f16c75347a49cfc8
summary: # Filter by paths log_payload2 := json.filter(input.request, ["user/id", "request/path"]).
digest: a9b7606832c725c461ac0629a7d14224041fbec1463581936b615b6a063913e2
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that # Filter by paths log_payload2 := json.filter(input.request, ["user/id", "request/path"])..
vector_summary: # Filter by paths log_payload2 := json.filter(input.request, ["user/id", "request/path"]).
chapter: CH-05
:::
# Filter by paths log_payload2 := json.filter(input.request, ["user/id", "request/path"])
:::

::: concept
id: BLK-bc0e62af97ec9ecb
summary: Use object.get instead of chaining if input.config.timeout_ms checks everywhere.
digest: ec840b36fd495999d064c4b48fdcfe13d64876d3b3c781fdd4f5cfaebad3ff2f
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Use object.get instead of chaining if input.config.timeout_ms checks everywhere..
vector_summary: Use object.get instead of chaining if input.config.timeout_ms checks everywhere.
chapter: CH-05
:::
Use object.get instead of chaining if input.config.timeout_ms checks everywhere.
:::

::: concept
id: BLK-8db7cb02fa0d8019
summary: Use object.remove before logging to avoid PII leaks.
digest: 013c00bf48bbed1040e23048d392573ee426310f8d87b380579ac781da1d8916
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Use object.remove before logging to avoid PII leaks..
vector_summary: Use object.remove before logging to avoid PII leaks.
chapter: CH-05
:::
Use object.remove before logging to avoid PII leaks.
:::

::: concept
id: BLK-7ff764ddb3c09d45
summary: 6.6 JSON Filter (json.filter).
digest: 6bfcb52e36f5fdfe43639afce930ec9ec980762d6c870f078ca221b5cc9b00ec
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that 6.6 JSON Filter (json.filter)..
vector_summary: 6.6 JSON Filter (json.filter).
chapter: CH-05
:::
6.6 JSON Filter (json.filter)
:::

::: concept
id: BLK-560f57c44741f42a
summary: Json.filter allows you to keep only selected fields from a JSON object.
digest: 8dabb9f19af5c6ed6223034679922640d630e532474b1983a70b00043ad8498b
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Json.filter allows you to keep only selected fields from a JSON object..
vector_summary: Json.filter allows you to keep only selected fields from a JSON object.
chapter: CH-05
:::
json.filter allows you to keep only selected fields from a JSON object.
:::

::: concept
id: BLK-5d036547953a8f35
summary: Signature (conceptual):.
digest: 8f989705311136df54dc822d647f6580e0bac1ba657a2d7f643f8ac22b7c24ed
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Signature (conceptual):..
vector_summary: Signature (conceptual):.
chapter: CH-05
:::
Signature (conceptual):
:::

::: concept
id: BLK-aa4996164f00b4c3
summary: Json.filter(obj, paths_array) # paths_array: array of slash-delimited strings.
digest: 581ac7b33d03fd60b5489d5dea9c8864143b51f5ad04d2dc16838f789dd8d5d8
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Json.filter(obj, paths_array) # paths_array: array of slash-delimited strings..
vector_summary: Json.filter(obj, paths_array) # paths_array: array of slash-delimited strings.
chapter: CH-05
:::
json.filter(obj, paths_array) # paths_array: array of slash-delimited strings
:::

::: concept
id: BLK-f8d1eedc439ab8ec
summary: # Keep only user ID and requested path filtered := json.filter(input.request, ["user/id", "request/path"]).
digest: 8146c75d185630409bf6addd69a09ba9c7137b09bdab35f63fbc51f8dcd3623e
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that # Keep only user ID and requested path filtered := json.filter(input.request, ["user/id", "request/path"])..
vector_summary: # Keep only user ID and requested path filtered := json.filter(input.request, ["user/id", "request/path"]).
chapter: CH-05
:::
# Keep only user ID and requested path filtered := json.filter(input.request, ["user/id", "request/path"])
:::

::: concept
id: BLK-f9b6faf28a2028a5
summary: Path strings are JSON Pointer–style:.
digest: 87826b867e95073db43941875a0a141c9137bc40ce8e38a6992b7a49aa4da359
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Path strings are JSON Pointer–style:..
vector_summary: Path strings are JSON Pointer–style:.
chapter: CH-05
:::
Path strings are JSON Pointer–style:
:::

::: concept
id: BLK-0bb7c9be9909cc35
summary: "user/id" corresponds to conceptual path segments ["user", "id"].
digest: 32dbfc7ce4ef4106a17b5b034e828b5180451f9d003dd4eb4fc83f6e1a0f7ed3
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that "user/id" corresponds to conceptual path segments ["user", "id"]..
vector_summary: "user/id" corresponds to conceptual path segments ["user", "id"].
chapter: CH-05
:::
"user/id" corresponds to conceptual path segments ["user", "id"].
:::

::: concept
id: BLK-a9fcb33c5ea171bc
summary: "request/path" corresponds to ["request", "path"].
digest: e58632c1e7d7a223fa9f215de9c5460e81b44bc37ce7d6a391a5cbf4dbef5286
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that "request/path" corresponds to ["request", "path"]..
vector_summary: "request/path" corresponds to ["request", "path"].
chapter: CH-05
:::
"request/path" corresponds to ["request", "path"].
:::

::: concept
id: BLK-5054224961c85436
summary: Think of each string as a slash-delimited path from the root of obj.
digest: 6662ea2c78306d1ae0b7ee662b305aada1b8ec52403145d0a5bd8f9b1581bc8e
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Think of each string as a slash-delimited path from the root of obj..
vector_summary: Think of each string as a slash-delimited path from the root of obj.
chapter: CH-05
:::
Think of each string as a slash-delimited path from the root of obj. The function returns a new object containing only the specified paths.
:::

::: concept
id: BLK-1827c164cec5cced
summary: Concat(sep, array) # join strings with separator contains(s, substr) # substring test startswith(s, prefix) endswith(s, suffix) format_int(int, bas...
digest: 52ea81c30862e3f0d6c350fa841f4c7cdaca0ad2e431d55c829f4882b7716c2e
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Concat(sep, array) # join strings with separator contains(s, substr) # substring test startswith(s, prefix) endswith(s, suffix) format_int(int, bas....
vector_summary: Concat(sep, array) # join strings with separator contains(s, substr) # substring test startswith(s, prefix) endswith(s, suffix) format_int(int, bas...
chapter: CH-05
:::
concat(sep, array) # join strings with separator contains(s, substr) # substring test startswith(s, prefix) endswith(s, suffix) format_int(int, base) # "2a" in base 16, etc. indexof(s, substr) # index or -1 lower(s) / upper(s) replace(s, old, new) # replace all occurrences split(s, sep) # split into array sprintf(format, args_array) # printf-style format substring(s, start, length) # slice of string trim(s, chars) # trim characters from both ends trim_space(s) # trim whitespace trim_prefix(s, prefix) trim_suffix(s, suffix)
:::

::: concept
id: BLK-d1f0e80b99a8855a
summary: # Normalize emails norm_email := lower(trim_space(input.user.email)).
digest: 590e6fed91c085ec698d8f1841278dbd85ae9425b1a4771f13e55140d80ed06f
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that # Normalize emails norm_email := lower(trim_space(input.user.email))..
vector_summary: # Normalize emails norm_email := lower(trim_space(input.user.email)).
chapter: CH-05
:::
# Normalize emails norm_email := lower(trim_space(input.user.email))
:::

::: concept
id: BLK-034df081487c6e14
summary: # Path manipulation endpoint := trim_prefix(input.path, "/api/v1/") segments := split(endpoint, "/").
digest: 2b027814f6c19a31a4c284251cd28eccd8933ffdf861d959aed4e2a0eea65399
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that # Path manipulation endpoint := trim_prefix(input.path, "/api/v1/") segments := split(endpoint, "/")..
vector_summary: # Path manipulation endpoint := trim_prefix(input.path, "/api/v1/") segments := split(endpoint, "/").
chapter: CH-05
:::
# Path manipulation endpoint := trim_prefix(input.path, "/api/v1/") segments := split(endpoint, "/")
:::

::: concept
id: BLK-3d6a7a0519d02f65
summary: # Slugify a title (rough example) slug := lower(replace(input.title, " ", "-")).
digest: 03d085931fbdc77b1f3dc82c3d604816deed211d67a933b543dd9d3b32ad913c
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that # Slugify a title (rough example) slug := lower(replace(input.title, " ", "-"))..
vector_summary: # Slugify a title (rough example) slug := lower(replace(input.title, " ", "-")).
chapter: CH-05
:::
# Slugify a title (rough example) slug := lower(replace(input.title, " ", "-"))
:::

::: concept
id: BLK-5f55f27905af292b
summary: # Format numeric IDs hex_id := format_int(input.id, 16) # hex.
digest: 4c93d8458cd71556c4f246146304f8d15f4e20b1c41ed3c963c180589f16fdc0
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that # Format numeric IDs hex_id := format_int(input.id, 16) # hex..
vector_summary: # Format numeric IDs hex_id := format_int(input.id, 16) # hex.
chapter: CH-05
:::
# Format numeric IDs hex_id := format_int(input.id, 16) # hex
:::

::: concept
id: BLK-99ce09c802bf60a2
summary: # Human-readable messages msg := sprintf("User %s attempted %s on %s", [input.user.id, input.action, input.resource.id]).
digest: 66188b4564ee7cad43e623b20cd680bfd1015e420e16b62547e5ca37cf7039b1
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that # Human-readable messages msg := sprintf("User %s attempted %s on %s", [input.user.id, input.action, input.resource.id])..
vector_summary: # Human-readable messages msg := sprintf("User %s attempted %s on %s", [input.user.id, input.action, input.resource.id]).
chapter: CH-05
:::
# Human-readable messages msg := sprintf("User %s attempted %s on %s", [input.user.id, input.action, input.resource.id])
:::

::: concept
id: BLK-8d0cec0d56f71772
summary: 6.8 Regular Expressions.
digest: a3bf0a38f0df507f4dc0e7c5a9eee749d90f71b5dda52b89472658ad5ba73344
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that 6.8 Regular Expressions..
vector_summary: 6.8 Regular Expressions.
chapter: CH-05
:::
6.8 Regular Expressions
:::

::: concept
id: BLK-c2126d6032b00de1
summary: Regex built-ins are powerful but expensive; use carefully.
digest: 8b8b634653161aaa5420b09fd016750075482a0019d6a5917cedda5386deb2ac
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Regex built-ins are powerful but expensive; use carefully..
vector_summary: Regex built-ins are powerful but expensive; use carefully.
chapter: CH-05
:::
Regex built-ins are powerful but expensive; use carefully.
:::

::: concept
id: BLK-d0a0341eae3035cf
summary: Regex.is_valid(pattern) # sanity check regex.match(pattern, string) # boolean regex.find_n(pattern, string, n) # up to n matches regex.split(patter...
digest: 1a407f98fd3b22d755a291391b731ba1ea34fa7bf9a25ae672c5e8bbabef2e02
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Regex.is_valid(pattern) # sanity check regex.match(pattern, string) # boolean regex.find_n(pattern, string, n) # up to n matches regex.split(patter....
vector_summary: Regex.is_valid(pattern) # sanity check regex.match(pattern, string) # boolean regex.find_n(pattern, string, n) # up to n matches regex.split(patter...
chapter: CH-05
:::
regex.is_valid(pattern) # sanity check regex.match(pattern, string) # boolean regex.find_n(pattern, string, n) # up to n matches regex.split(pattern, string) # array of splits
:::

::: concept
id: BLK-19d08c340d427069
summary: Raw Strings (Backticks) - Implementation Note:.
digest: 8baaec764f0cb6e9601d85f38c8caf9d095c55f2bfb59bced77f793b11b773f5
symbol_refs: [Raw Strings (Backticks) - Implementation Note:]
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Raw Strings (Backticks) - Implementation Note:..
vector_summary: Raw Strings (Backticks) - Implementation Note:.
chapter: CH-05
:::
**Raw Strings (Backticks) - Implementation Note:**
:::

::: concept
id: BLK-c2a495572332a234
summary: However, raw strings may not be supported in all OPA versions or implementations.
digest: ff0bd93f56c92a011c0feffb7b33eb7bade66aaf279baf5b58d511982ee02768
symbol_refs: [" } ", raw strings may not be supported in all OPA versions or implementations, raw-string ::= "]
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that However, raw strings may not be supported in all OPA versions or implementations..
vector_summary: However, raw strings may not be supported in all OPA versions or implementations.
graph_neighbors: [TERM-7189e73f44e918ef]
graph_degree: 1
graph_two_hop: []
graph_three_hop: []
chapter: CH-05
:::
The grammar defines raw strings with backticks (`raw-string ::= "`" { CHAR-"`" } "`"`), and examples in documentation may show them. However, **raw strings may not be supported in all OPA versions or implementations**. For maximum compatibility, prefer double-quoted strings with proper escaping:
:::

::: concept
id: BLK-cea8ae8e888936e9
summary: # Compatible (recommended) is_hex if regex.match("^[0-9a-fA-F]+$", input.value).
digest: 60f82b36a01b6c041a84bf46b28c0711c4bc543838d924da8c92fdedab76272c
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that # Compatible (recommended) is_hex if regex.match("^[0-9a-fA-F]+$", input.value)..
vector_summary: # Compatible (recommended) is_hex if regex.match("^[0-9a-fA-F]+$", input.value).
chapter: CH-05
:::
# Compatible (recommended) is_hex if regex.match("^[0-9a-fA-F]+$", input.value)
:::

::: concept
id: BLK-85c57404aa7470a5
summary: Exception: Multi-Line Test Data.
digest: 6f21de52b5136969756e970854646b98b244104b329315f98e9c7c5fe5e70363
symbol_refs: [Exception: Multi-Line Test Data]
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Exception: Multi-Line Test Data..
vector_summary: Exception: Multi-Line Test Data.
chapter: CH-05
:::
**Exception: Multi-Line Test Data**
:::

::: concept
id: BLK-5653ea053fcd305c
summary: For test files containing multi-line content (diffs, code blocks, structured text), raw strings are the preferred approach because they preserve ac...
digest: 64587bf205bacae9937715d1dce64c822e6ff8c157e097854f643ed64a41601f
symbol_refs: [\n]
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that For test files containing multi-line content (diffs, code blocks, structured text), raw strings are the preferred approach because they preserve ac....
vector_summary: For test files containing multi-line content (diffs, code blocks, structured text), raw strings are the preferred approach because they preserve ac...
chapter: CH-05
:::
For test files containing multi-line content (diffs, code blocks, structured text), raw strings are the preferred approach because they preserve actual newline characters. Unlike double-quoted strings where `\n` is a literal two-character sequence, raw strings interpret newlines as actual line breaks:
:::

::: concept
id: BLK-5b85cd23416fe10a
summary: When to Use Double-Quoted Strings: - Single-line strings - Regex patterns (for maximum compatibility) - Strings where escape sequences are acceptable.
digest: b9a4c92eae3266aadf16940781b10f54e7ed3de9bc2c54f001237c657f8ad0d9
symbol_refs: [When to Use Double-Quoted Strings:]
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that When to Use Double-Quoted Strings: - Single-line strings - Regex patterns (for maximum compatibility) - Strings where escape sequences are acceptable..
vector_summary: When to Use Double-Quoted Strings: - Single-line strings - Regex patterns (for maximum compatibility) - Strings where escape sequences are acceptable.
graph_neighbors: [TERM-4176bf4a5b555c86]
graph_degree: 1
graph_two_hop: []
graph_three_hop: []
chapter: CH-05
:::
**When to Use Double-Quoted Strings:** - Single-line strings - Regex patterns (for maximum compatibility) - Strings where escape sequences are acceptable
:::

::: concept
id: BLK-0aca188dad8fd4c4
summary: Avoid regex in tight loops over large collections if possible.
digest: 2eb2c5a2752e4f598841a26a6c1fde8afc09aa8e61dcd30b52245303d8c54c6c
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Avoid regex in tight loops over large collections if possible..
vector_summary: Avoid regex in tight loops over large collections if possible.
chapter: CH-05
:::
Avoid regex in tight loops over large collections if possible.
:::

::: concept
id: BLK-27494b43ea9a88cc
summary: Pre-validate patterns with regex.is_valid when patterns are dynamic (e.g., user-supplied).
digest: aa2e03a0e88ef413a160d33c75a0df4b7209738f74429cf788904a045b146e3d
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Pre-validate patterns with regex.is_valid when patterns are dynamic (e.g., user-supplied)..
vector_summary: Pre-validate patterns with regex.is_valid when patterns are dynamic (e.g., user-supplied).
chapter: CH-05
:::
Pre-validate patterns with regex.is_valid when patterns are dynamic (e.g., user-supplied).
:::

::: concept
id: BLK-bffd0561a132a3ee
summary: 6.9 Numbers & Numeric Utilities.
digest: 093db37466694e8e3e6d7a994b19d80bc3ad1395dfe261b6eccbe3211b33b8ae
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that 6.9 Numbers & Numeric Utilities..
vector_summary: 6.9 Numbers & Numeric Utilities.
chapter: CH-05
:::
6.9 Numbers & Numeric Utilities
:::

::: concept
id: BLK-cfbd6b5720d1c8c4
summary: Basic numeric helpers:.
digest: 065aadb82c1ae17efcb75895d646c9c03bc845cbdaeb4631dec04caa7d47ea9f
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Basic numeric helpers:..
vector_summary: Basic numeric helpers:.
chapter: CH-05
:::
Basic numeric helpers:
:::

::: concept
id: BLK-dc5923a0cbbecea4
summary: Abs(x) # absolute value ceil(x) # smallest integer ≥ x floor(x) # greatest integer ≤ x round(x) # round half-up numbers.range(start, end) # [start,...
digest: a7f10d7b35e6bfc2e2c59e381b8492902bd507d5af6d898e88652db993135467
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Abs(x) # absolute value ceil(x) # smallest integer ≥ x floor(x) # greatest integer ≤ x round(x) # round half-up numbers.range(start, end) # [start,....
vector_summary: Abs(x) # absolute value ceil(x) # smallest integer ≥ x floor(x) # greatest integer ≤ x round(x) # round half-up numbers.range(start, end) # [start,...
chapter: CH-05
:::
abs(x) # absolute value ceil(x) # smallest integer ≥ x floor(x) # greatest integer ≤ x round(x) # round half-up numbers.range(start, end) # [start, ..., end-1]
:::

::: concept
id: BLK-389040bd2c4e208b
summary: # Generate ports 8000 to 8099 ports := numbers.range(8000, 8100).
digest: ffa37f6c5c3f27487c6270723144b2af46b43a5f5007da5a85366fdc3d64d075
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that # Generate ports 8000 to 8099 ports := numbers.range(8000, 8100)..
vector_summary: # Generate ports 8000 to 8099 ports := numbers.range(8000, 8100).
chapter: CH-05
:::
# Generate ports 8000 to 8099 ports := numbers.range(8000, 8100)
:::

::: concept
id: BLK-78c2cb371a96496e
summary: # Check resource usage thresholds over_limit if { usage := input.usage limit := input.limit usage > limit * 1.10 # 10% over limit }.
digest: ea3c71c7f5d0e193b3c1d583c08dcf458afef9fa64c276e5b50d49811c9be1fe
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that # Check resource usage thresholds over_limit if { usage := input.usage limit := input.limit usage > limit * 1.10 # 10% over limit }..
vector_summary: # Check resource usage thresholds over_limit if { usage := input.usage limit := input.limit usage > limit * 1.10 # 10% over limit }.
chapter: CH-05
:::
# Check resource usage thresholds over_limit if { usage := input.usage limit := input.limit usage > limit * 1.10 # 10% over limit }
:::

::: concept
id: BLK-7a4ef4151bc05f13
summary: Combine with aggregates:.
digest: 6aa964248fc193e8ce8b272cc2470e1022f59ae8e2dc722a2ba383d0f70c2f3f
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Combine with aggregates:..
vector_summary: Combine with aggregates:.
chapter: CH-05
:::
Combine with aggregates:
:::

::: concept
id: BLK-a307644bd6c65dd0
summary: # Ensure all latencies below 100ms all_fast if { not any_slow } any_slow if { some lat in input.latencies lat > 100 }.
digest: cccf48c36a2c8158dfeedee7f36cedb8d2b2a3a5d07e26f8af9c40e1459b6e21
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that # Ensure all latencies below 100ms all_fast if { not any_slow } any_slow if { some lat in input.latencies lat > 100 }..
vector_summary: # Ensure all latencies below 100ms all_fast if { not any_slow } any_slow if { some lat in input.latencies lat > 100 }.
chapter: CH-05
:::
# Ensure all latencies below 100ms all_fast if { not any_slow } any_slow if { some lat in input.latencies lat > 100 }
:::

::: concept
id: BLK-da60e2ba3a9d9f8b
summary: 6.10 Type Conversion & Validation.
digest: 055c2261fef2dafa3f125b08b33f452d3f717affbedb939c5dc87f7cadf0db19
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that 6.10 Type Conversion & Validation..
vector_summary: 6.10 Type Conversion & Validation.
chapter: CH-05
:::
6.10 Type Conversion & Validation
:::

::: concept
id: BLK-92acd8f218475798
summary: Sometimes you ingest loosely typed JSON (forms, CSV turned JSON).
digest: a7795be7d9e032ac8a22e87e52add8a16349c165d4cd7c747ca324f13a61446c
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Sometimes you ingest loosely typed JSON (forms, CSV turned JSON)..
vector_summary: Sometimes you ingest loosely typed JSON (forms, CSV turned JSON).
chapter: CH-05
:::
Sometimes you ingest loosely typed JSON (forms, CSV turned JSON). Use conversion and validation built-ins:
:::

::: concept
id: BLK-7df6e314b23533aa
summary: To_number(x) # best-effort numeric conversion to_string(x) to_set(x) to_array(x) to_object(x) # shape-dependent cast_number(x) cast_string(x) cast_...
digest: 14f67a39f0086e7af8872277a404908d555fe1f873660559c401f231f8c2442b
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that To_number(x) # best-effort numeric conversion to_string(x) to_set(x) to_array(x) to_object(x) # shape-dependent cast_number(x) cast_string(x) cast_....
vector_summary: To_number(x) # best-effort numeric conversion to_string(x) to_set(x) to_array(x) to_object(x) # shape-dependent cast_number(x) cast_string(x) cast_...
chapter: CH-05
:::
to_number(x) # best-effort numeric conversion to_string(x) to_set(x) to_array(x) to_object(x) # shape-dependent cast_number(x) cast_string(x) cast_bool(x) json.is_valid(str) # syntactic JSON validation yaml.is_valid(str)
:::

::: concept
id: BLK-d5763b6b5eb0bf7a
summary: # Robust score parsing score_is_valid if { json.is_valid(input.body) body := json.unmarshal(input.body) s := to_number(body.score) s >= 0 s <= 100 }.
digest: 95f052f9a6b94ba63c7d8f83dc9973edebf7872eac6e78e12d89ef3155991146
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that # Robust score parsing score_is_valid if { json.is_valid(input.body) body := json.unmarshal(input.body) s := to_number(body.score) s >= 0 s <= 100 }..
vector_summary: # Robust score parsing score_is_valid if { json.is_valid(input.body) body := json.unmarshal(input.body) s := to_number(body.score) s >= 0 s <= 100 }.
chapter: CH-05
:::
# Robust score parsing score_is_valid if { json.is_valid(input.body) body := json.unmarshal(input.body) s := to_number(body.score) s >= 0 s <= 100 }
:::

::: concept
id: BLK-c7d5202b059d4f66
summary: # Convert dynamic lists tags_set := to_set(input.tags).
digest: 918120c257d6e48cc1d152ae258b5a44433e3d9d25a664de57747e597c820470
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that # Convert dynamic lists tags_set := to_set(input.tags)..
vector_summary: # Convert dynamic lists tags_set := to_set(input.tags).
chapter: CH-05
:::
# Convert dynamic lists tags_set := to_set(input.tags)
:::

::: concept
id: BLK-f103384b14a876e2
summary: 6.11 Encoding, Decoding & Serialization.
digest: 0ad2c3324b9574070f36a555f263fdb4cb658e535fe53a187a8d46534969a1cd
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that 6.11 Encoding, Decoding & Serialization..
vector_summary: 6.11 Encoding, Decoding & Serialization.
chapter: CH-05
:::
6.11 Encoding, Decoding & Serialization
:::

::: concept
id: BLK-fb68755b272d7cd1
summary: Used to transform payloads between formats or safely embed them.
digest: c2e0c3d82876fc4ef8b7a7c9533f3adbb7adf5c8fbe4743e719391f53c754d52
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Used to transform payloads between formats or safely embed them..
vector_summary: Used to transform payloads between formats or safely embed them.
chapter: CH-05
:::
Used to transform payloads between formats or safely embed them.
:::

::: concept
id: BLK-c57d596903f7cb47
summary: # Base64 base64.encode("hello") # "aGVsbG8=" base64.decode("aGVsbG8=") # "hello" base64url.encode("hello") # URL-safe base64url.decode("...").
digest: eb374ce4185658cd761020ceb5b236192ad4e4298b40667bc588fdcfce646eb1
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that # Base64 base64.encode("hello") # "aGVsbG8=" base64.decode("aGVsbG8=") # "hello" base64url.encode("hello") # URL-safe base64url.decode("...")..
vector_summary: # Base64 base64.encode("hello") # "aGVsbG8=" base64.decode("aGVsbG8=") # "hello" base64url.encode("hello") # URL-safe base64url.decode("...").
chapter: CH-05
:::
# Base64 base64.encode("hello") # "aGVsbG8=" base64.decode("aGVsbG8=") # "hello" base64url.encode("hello") # URL-safe base64url.decode("...")
:::

::: concept
id: BLK-e5d2cae50c0adf8e
summary: # Hex hex.encode("hello") # "68656c6c6f" hex.decode("68656c6c6f") # "hello".
digest: 2613244dd6091aa534b694187a451ba3c6b90e06fed17ef197cd4f4fde861a33
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that # Hex hex.encode("hello") # "68656c6c6f" hex.decode("68656c6c6f") # "hello"..
vector_summary: # Hex hex.encode("hello") # "68656c6c6f" hex.decode("68656c6c6f") # "hello".
chapter: CH-05
:::
# Hex hex.encode("hello") # "68656c6c6f" hex.decode("68656c6c6f") # "hello"
:::

::: concept
id: BLK-773b97e3f4d9044f
summary: # JSON json.marshal(x) # value → JSON string json.unmarshal(json_str) # JSON string → value.
digest: 1ca56d1b4d5ab1bc864b1a891931090f1e53c4f20c56414d49aa079c7044f80b
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that # JSON json.marshal(x) # value → JSON string json.unmarshal(json_str) # JSON string → value..
vector_summary: # JSON json.marshal(x) # value → JSON string json.unmarshal(json_str) # JSON string → value.
chapter: CH-05
:::
# JSON json.marshal(x) # value → JSON string json.unmarshal(json_str) # JSON string → value
:::

::: concept
id: BLK-7f1aa0c4b22de975
summary: # YAML yaml.marshal(x) yaml.unmarshal(yaml_str).
digest: 9d17a5bf5cebcb21ac9460490a7402b8bff03cc77c82efd08f981b7b25733d17
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that # YAML yaml.marshal(x) yaml.unmarshal(yaml_str)..
vector_summary: # YAML yaml.marshal(x) yaml.unmarshal(yaml_str).
chapter: CH-05
:::
# YAML yaml.marshal(x) yaml.unmarshal(yaml_str)
:::

::: concept
id: BLK-f25b0aaead0e1ce8
summary: # URL query urlquery.encode("a=1&b=2") # "a%3D1%26b%3D2" urlquery.decode("a%3D1") # "a=1".
digest: 6fb8378601fa47b86ac83df8b3cb876433c4452600118a27e07dd2f077dc4ea0
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that # URL query urlquery.encode("a=1&b=2") # "a%3D1%26b%3D2" urlquery.decode("a%3D1") # "a=1"..
vector_summary: # URL query urlquery.encode("a=1&b=2") # "a%3D1%26b%3D2" urlquery.decode("a%3D1") # "a=1".
chapter: CH-05
:::
# URL query urlquery.encode("a=1&b=2") # "a%3D1%26b%3D2" urlquery.decode("a%3D1") # "a=1"
:::

::: concept
id: BLK-3bd110a004054aa9
summary: # Parse JWT payload manually (not recommended vs io.jwt.* but illustrative) parts := split(input.token, ".") payload_b64 := parts[1] payload_json :...
digest: 83968d95daaf567450b1d067d5aa1ff3ef52f49ba71bc93822f2a748c90bd249
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that # Parse JWT payload manually (not recommended vs io.jwt.* but illustrative) parts := split(input.token, ".") payload_b64 := parts[1] payload_json :....
vector_summary: # Parse JWT payload manually (not recommended vs io.jwt.* but illustrative) parts := split(input.token, ".") payload_b64 := parts[1] payload_json :...
chapter: CH-05
:::
# Parse JWT payload manually (not recommended vs io.jwt.* but illustrative) parts := split(input.token, ".") payload_b64 := parts[1] payload_json := base64url.decode(payload_b64) claims := json.unmarshal(payload_json)
:::

::: concept
id: BLK-365175335364136d
summary: # Marshal deny messages for logs deny_json := json.marshal(deny_msgs).
digest: 0de3e944cb5914e2276740e22bec6ce1c0dc498a1882643a2dfebd4ab6af1443
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that # Marshal deny messages for logs deny_json := json.marshal(deny_msgs)..
vector_summary: # Marshal deny messages for logs deny_json := json.marshal(deny_msgs).
chapter: CH-05
:::
# Marshal deny messages for logs deny_json := json.marshal(deny_msgs)
:::

::: concept
id: BLK-393080aa0cc18d4b
summary: 6.12 Type Introspection.
digest: c8f014b6c50514fc20c7256ab32cfcc7a80ccf730d1bb20014a2959b4bcaae68
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that 6.12 Type Introspection..
vector_summary: 6.12 Type Introspection.
graph_neighbors: [CODE-fa97df2a115ae029]
graph_degree: 1
graph_two_hop: []
graph_three_hop: []
chapter: CH-05
:::
6.12 Type Introspection
:::

::: concept
id: BLK-f590cb8820f569fa
summary: Type predicates and type_name are invaluable for robust policies:.
digest: 0ca48671eba7412df630e5fae27e7c044ef4f58bbad57cb49145e57bdbf80f80
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Type predicates and type_name are invaluable for robust policies:..
vector_summary: Type predicates and type_name are invaluable for robust policies:.
chapter: CH-05
:::
Type predicates and type_name are invaluable for robust policies:
:::

::: concept
id: BLK-74c7bb9f41c91813
summary: Is_array(x) is_boolean(x) is_null(x) is_number(x) is_object(x) is_set(x) is_string(x) type_name(x) # "array", "object", "set", "string", "number", ...
digest: 79e5e302837d873016f05cd74e345d61160b83d6d392e9ffc0ed73fcc3627c26
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Is_array(x) is_boolean(x) is_null(x) is_number(x) is_object(x) is_set(x) is_string(x) type_name(x) # "array", "object", "set", "string", "number", ....
vector_summary: Is_array(x) is_boolean(x) is_null(x) is_number(x) is_object(x) is_set(x) is_string(x) type_name(x) # "array", "object", "set", "string", "number", ...
chapter: CH-05
:::
is_array(x) is_boolean(x) is_null(x) is_number(x) is_object(x) is_set(x) is_string(x) type_name(x) # "array", "object", "set", "string", "number", "null", "boolean"
:::

::: concept
id: BLK-26988fbc99af1428
summary: Pattern: Defensive guards before deeper logic:.
digest: a383e99a8ee764b3a96d47011a234da5c31e1228eb3d73e74f0fe32b2ccbf4f0
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Pattern: Defensive guards before deeper logic:..
vector_summary: Pattern: Defensive guards before deeper logic:.
chapter: CH-05
:::
Pattern: Defensive guards before deeper logic:
:::

::: concept
id: BLK-3e50cfb0dfea9e5b
summary: Valid_request if { is_object(input) is_object(input.user) is_string(input.user.id) is_string(input.action) }.
digest: 19e612a887dc3cb19835218daac37fe78eee422b5398b1cb05ca98b8937c9924
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Valid_request if { is_object(input) is_object(input.user) is_string(input.user.id) is_string(input.action) }..
vector_summary: Valid_request if { is_object(input) is_object(input.user) is_string(input.user.id) is_string(input.action) }.
chapter: CH-05
:::
valid_request if { is_object(input) is_object(input.user) is_string(input.user.id) is_string(input.action) }
:::

::: concept
id: BLK-fe1e428678f12304
summary: Input Safety Best Practices:.
digest: 8a94ad86c46f5578011ff88c96ef82cc251eeae1c5ce39d88c59a260f9c46cd2
symbol_refs: [Input Safety Best Practices:]
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Input Safety Best Practices:..
vector_summary: Input Safety Best Practices:.
chapter: CH-05
:::
**Input Safety Best Practices:**
:::

::: concept
id: BLK-9931b529da7c6226
summary: 6.13 Cryptography & Security Built-ins.
digest: 53d7d4fe5477ab58bd17c8807576c95ade736fdf8908285ce4d9879bc35e9c16
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that 6.13 Cryptography & Security Built-ins..
vector_summary: 6.13 Cryptography & Security Built-ins.
chapter: CH-05
:::
6.13 Cryptography & Security Built-ins
:::

::: concept
id: BLK-7ad70344cf0fd579
summary: Security-sensitive policies rely heavily on crypto built-ins.
digest: bc9dec89424675ec47966bcd762811ff08863349d93a1e9734495cd30584fda5
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Security-sensitive policies rely heavily on crypto built-ins..
vector_summary: Security-sensitive policies rely heavily on crypto built-ins.
chapter: CH-05
:::
Security-sensitive policies rely heavily on crypto built-ins.
:::

::: concept
id: BLK-e82692da642da4e6
summary: Hash functions & HMAC:.
digest: adc5f11648de1d22765e4eec3059839d2b3544819c15e692bedc1b6b541f4fcc
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Hash functions & HMAC:..
vector_summary: Hash functions & HMAC:.
chapter: CH-05
:::
Hash functions & HMAC:
:::

::: concept
id: BLK-07cc51248e326726
summary: Crypto.md5(data) crypto.sha1(data) crypto.sha256(data) crypto.sha3_256(data) crypto.hmac.sha256(key, data).
digest: 7a4d80b94b39da6c5fcf25479bb5f75a92c94d1753db0b334aacbc4ff8a969fc
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Crypto.md5(data) crypto.sha1(data) crypto.sha256(data) crypto.sha3_256(data) crypto.hmac.sha256(key, data)..
vector_summary: Crypto.md5(data) crypto.sha1(data) crypto.sha256(data) crypto.sha3_256(data) crypto.hmac.sha256(key, data).
chapter: CH-05
:::
crypto.md5(data) crypto.sha1(data) crypto.sha256(data) crypto.sha3_256(data) crypto.hmac.sha256(key, data)
:::

::: concept
id: BLK-0c4673919ffeab0f
summary: Key-derivation & password hashing:.
digest: 708949db0642797837dfb4f4f517f89d228bb1260658d103413c27d78fd3d34b
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Key-derivation & password hashing:..
vector_summary: Key-derivation & password hashing:.
chapter: CH-05
:::
Key-derivation & password hashing:
:::

::: concept
id: BLK-760d822b72ca8385
summary: Crypto.pbkdf2(hash_alg, password, salt, rounds) crypto.bcrypt.hash(password) crypto.bcrypt.compare(hash, password).
digest: ccb809d67640588bde06af1bc4fcd9bc161c0bf3b85af5bf9043cf0ed8b90b7f
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Crypto.pbkdf2(hash_alg, password, salt, rounds) crypto.bcrypt.hash(password) crypto.bcrypt.compare(hash, password)..
vector_summary: Crypto.pbkdf2(hash_alg, password, salt, rounds) crypto.bcrypt.hash(password) crypto.bcrypt.compare(hash, password).
chapter: CH-05
:::
crypto.pbkdf2(hash_alg, password, salt, rounds) crypto.bcrypt.hash(password) crypto.bcrypt.compare(hash, password)
:::

::: concept
id: BLK-38e55e81ea44e29b
summary: X.509 and certificates:.
digest: eed5212e744ce5107f24f85c29a61836653b6af095548dded7f2493ad6c767f7
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that X.509 and certificates:..
vector_summary: X.509 and certificates:.
chapter: CH-05
:::
X.509 and certificates:
:::

::: concept
id: BLK-92df017ca6dd0a84
summary: Crypto.x509.parse_certificates(pem) # parse PEM bundle → array of certs.
digest: e989cacb1e424f562bf992230d4c54e358c2be268a35c7a6f976bcb6ec834efa
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Crypto.x509.parse_certificates(pem) # parse PEM bundle → array of certs..
semantic_categories: [distribution]
vector_summary: Crypto.x509.parse_certificates(pem) # parse PEM bundle → array of certs.
chapter: CH-05
:::
crypto.x509.parse_certificates(pem) # parse PEM bundle → array of certs
:::

::: concept
id: BLK-bca085b327a54593
summary: JWT helpers (in io.jwt namespace):.
digest: 18034f893532e5690667a25f6e5a20686da6b5b4f7c5646958aa6ae07f579025
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that JWT helpers (in io.jwt namespace):..
vector_summary: JWT helpers (in io.jwt namespace):.
chapter: CH-05
:::
JWT helpers (in io.jwt namespace):
:::

::: concept
id: BLK-c51a72be2c4f7943
summary: Io.jwt.decode(token) # [header, payload, signature] or undefined io.jwt.verify_hs256(token, key) # boolean io.jwt.verify_rs256(token, cert) io.jwt....
digest: 7fbd76a3e471e75006982747ae8bed6b3a6026e75116ca8f1b18000935c720a7
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Io.jwt.decode(token) # [header, payload, signature] or undefined io.jwt.verify_hs256(token, key) # boolean io.jwt.verify_rs256(token, cert) io.jwt.....
vector_summary: Io.jwt.decode(token) # [header, payload, signature] or undefined io.jwt.verify_hs256(token, key) # boolean io.jwt.verify_rs256(token, cert) io.jwt....
chapter: CH-05
:::
io.jwt.decode(token) # [header, payload, signature] or undefined io.jwt.verify_hs256(token, key) # boolean io.jwt.verify_rs256(token, cert) io.jwt.verify_es256(token, cert) io.jwt.verify_ps256(token, cert) io.jwt.encode_sign_raw(headers, payload, key)
:::

::: concept
id: BLK-9c235109ac4fb55a
summary: Valid_token if { io.jwt.verify_hs256(input.token, data.jwt_secret) }.
digest: 5b32cd3a0867df9a5060b4268b428dcfaec58edd4794d19f3f0ac5ef17a20e2c
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Valid_token if { io.jwt.verify_hs256(input.token, data.jwt_secret) }..
vector_summary: Valid_token if { io.jwt.verify_hs256(input.token, data.jwt_secret) }.
chapter: CH-05
:::
valid_token if { io.jwt.verify_hs256(input.token, data.jwt_secret) }
:::

::: concept
id: BLK-79d62f89dc8c2bbe
summary: Deny[msg] if { not valid_token msg := "Invalid JWT" }.
digest: 6f6242d580cb8c2c178d8e9eaa98919e5e3e2a7aec22deca5742348ae8022497
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Deny[msg] if { not valid_token msg := "Invalid JWT" }..
vector_summary: Deny[msg] if { not valid_token msg := "Invalid JWT" }.
chapter: CH-05
:::
deny[msg] if { not valid_token msg := "Invalid JWT" }
:::

::: concept
id: BLK-381855197c8a3986
summary: Use strong algorithms (avoid MD5/SHA1 except for legacy fingerprints).
digest: 80a182386c556961ea59ab35dfb20958c507d2fb1b52ceed112d9497ffbb5ed6
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Use strong algorithms (avoid MD5/SHA1 except for legacy fingerprints)..
vector_summary: Use strong algorithms (avoid MD5/SHA1 except for legacy fingerprints).
chapter: CH-05
:::
Use strong algorithms (avoid MD5/SHA1 except for legacy fingerprints).
:::

::: concept
id: BLK-cb82c0a969ee513d
summary: 6.4 Arrays & array.concat.
digest: 55c7e7b640f3bbd9a58bc5d89d9f5b53756210b1d5a694bcff9171ad1ba3df22
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that 6.4 Arrays & array.concat..
vector_summary: 6.4 Arrays & array.concat.
chapter: CH-05
:::
6.4 Arrays & array.concat
:::

::: concept
id: BLK-492775404d6858a1
summary: Arrays are ubiquitous: paths, lists of scopes, resource IDs, etc.
digest: daf818768b59abad25fa4adb3b0ebb5792a9e63e46f8517a6de5e69e175250f4
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Arrays are ubiquitous: paths, lists of scopes, resource IDs, etc..
vector_summary: Arrays are ubiquitous: paths, lists of scopes, resource IDs, etc.
chapter: CH-05
:::
Arrays are ubiquitous: paths, lists of scopes, resource IDs, etc.
:::

::: concept
id: BLK-803815e4948a9134
summary: Count(arr) # length arr[i] # index arr[_] # iterate concat(".", arr) # join into string array.concat(a, b) # concatenate arrays.
digest: 46e6fef5f3482801920054c64f0073a3993e714749713a7fdac231d9bbeaa307
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Count(arr) # length arr[i] # index arr[_] # iterate concat(".", arr) # join into string array.concat(a, b) # concatenate arrays..
vector_summary: Count(arr) # length arr[i] # index arr[_] # iterate concat(".", arr) # join into string array.concat(a, b) # concatenate arrays.
chapter: CH-05
:::
count(arr) # length arr[i] # index arr[_] # iterate concat(".", arr) # join into string array.concat(a, b) # concatenate arrays
:::

::: concept
id: BLK-6d905df2ae0be4ca
summary: Array.concat([1, 2], [3]) # => [1, 2, 3].
digest: 53b164458734dec0ec6e442bc5567c0366ed0e94264dc41ca8bf5c898b07b585
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Array.concat([1, 2], [3]) # => [1, 2, 3]..
vector_summary: Array.concat([1, 2], [3]) # => [1, 2, 3].
chapter: CH-05
:::
array.concat([1, 2], [3]) # => [1, 2, 3]
:::

::: concept
id: BLK-95bea7dff21c1179
summary: For defensive code, wrap it:.
digest: 252b1bf130a501eea89773d648bd888bdb34bee93ad9e97a17875449a40d5d54
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that For defensive code, wrap it:..
vector_summary: For defensive code, wrap it:.
chapter: CH-05
:::
For defensive code, wrap it:
:::

::: concept
id: BLK-01eb9f65fbee8e12
summary: Safe_concat(a, b) := array.concat(a, b) if { is_array(a) is_array(b) }.
digest: 9e7a6658972fadb72ba0486fcdde7d3bc76780938e16a80cd5610f1f85ece851
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Safe_concat(a, b) := array.concat(a, b) if { is_array(a) is_array(b) }..
vector_summary: Safe_concat(a, b) := array.concat(a, b) if { is_array(a) is_array(b) }.
chapter: CH-05
:::
safe_concat(a, b) := array.concat(a, b) if { is_array(a) is_array(b) }
:::

::: concept
id: BLK-5970ca9ef37640be
summary: Use safe_concat in paths or pipelines where inputs may be missing or partially null.
digest: 337ad44290fc6bea6d184384c8db5eb884a9088c9acb553171d81bce55468393
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Use safe_concat in paths or pipelines where inputs may be missing or partially null..
vector_summary: Use safe_concat in paths or pipelines where inputs may be missing or partially null.
chapter: CH-05
:::
Use safe_concat in paths or pipelines where inputs may be missing or partially null.
:::

::: concept
id: BLK-03437db7242e9e11
summary: Time Functions (No time.diff).
digest: 3ac12bdc08553ad2001cee924b99d8af96ed9c3bf357b1f27c56a211762e5ce9
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Time Functions (No time.diff)..
vector_summary: Time Functions (No time.diff).
chapter: CH-05
:::
Time Functions (No time.diff)
:::

::: concept
id: BLK-323678c5fae3b216
summary: Time built-ins revolve around:.
digest: 9edd994746e1b5c8d3182d22801260290fa185fe4ed27beca91d78285d53ebb6
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Time built-ins revolve around:..
vector_summary: Time built-ins revolve around:.
chapter: CH-05
:::
Time built-ins revolve around:
:::

::: concept
id: BLK-36093a3541d6fac4
summary: Getting the current time (time.now_ns).
digest: 51469e926b7784e7be770b985d7122c61fb2dbd9dbc7613081e4986ed244af1d
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Getting the current time (time.now_ns)..
vector_summary: Getting the current time (time.now_ns).
chapter: CH-05
:::
Getting the current time (time.now_ns)
:::

::: concept
id: BLK-9f58a11b445194e4
summary: Parsing timestamps (time.parse_rfc3339_ns).
digest: 5e7cdcceea4aebcee8b30b6d627f29112c1bb20790cbf5aa4702094c48a9b055
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Parsing timestamps (time.parse_rfc3339_ns)..
vector_summary: Parsing timestamps (time.parse_rfc3339_ns).
chapter: CH-05
:::
Parsing timestamps (time.parse_rfc3339_ns)
:::

::: concept
id: BLK-98d4acbef290299c
summary: Formatting (time.format, etc.).
digest: a6585ef4752cd903bece6a2e224454d0636fdcd1489e1c574d214d69735d9a60
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Formatting (time.format, etc.)..
vector_summary: Formatting (time.format, etc.).
chapter: CH-05
:::
Formatting (time.format, etc.)
:::

::: concept
id: BLK-4b147b9e016ab307
summary: Example of computing a duration:.
digest: 1bafbcb200a100416bb600ff3f16157b2a39d850e2b674258b81457b88870cc9
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Example of computing a duration:..
vector_summary: Example of computing a duration:.
chapter: CH-05
:::
Example of computing a duration:
:::

::: concept
id: BLK-5110d5b6e76c6c72
summary: Now := time.now_ns() start := time.parse_rfc3339_ns(input.window.start) end := time.parse_rfc3339_ns(input.window.end).
digest: d3814664011b3a50fb25bf8c9fb6e45e16e9bb5004a2ae58688d4d1507ebe632
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Now := time.now_ns() start := time.parse_rfc3339_ns(input.window.start) end := time.parse_rfc3339_ns(input.window.end)..
vector_summary: Now := time.now_ns() start := time.parse_rfc3339_ns(input.window.start) end := time.parse_rfc3339_ns(input.window.end).
chapter: CH-05
:::
now := time.now_ns() start := time.parse_rfc3339_ns(input.window.start) end := time.parse_rfc3339_ns(input.window.end)
:::

::: concept
id: BLK-4f8b95221334c8fd
summary: Duration_ns := end - start.
digest: 7157b2197fe7538455ef0406d65e6b67854b775134a5d57b7e4c5a11116d5579
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Duration_ns := end - start..
vector_summary: Duration_ns := end - start.
chapter: CH-05
:::
duration_ns := end - start
:::

::: concept
id: BLK-b93a0cab2b781de4
summary: Too_long if { duration_ns > 5 * 60 * 1e9 # > 5 minutes }.
digest: ef87d227b8fd5aa1cce8f7b65e8d69e5759c65d89c06dedceca518bc4992b177
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Too_long if { duration_ns > 5 * 60 * 1e9 # > 5 minutes }..
vector_summary: Too_long if { duration_ns > 5 * 60 * 1e9 # > 5 minutes }.
chapter: CH-05
:::
too_long if { duration_ns > 5 * 60 * 1e9 # > 5 minutes }
:::

::: concept
id: BLK-17b123b1fff6830e
summary: Differences are computed with normal arithmetic on integer nanosecond timestamps:.
digest: 31b2f857525f84a9505e122629243e5fa1e66f477f51773fdc3a75517b86f101
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Differences are computed with normal arithmetic on integer nanosecond timestamps:..
vector_summary: Differences are computed with normal arithmetic on integer nanosecond timestamps:.
chapter: CH-05
:::
Differences are computed with normal arithmetic on integer nanosecond timestamps:
:::

::: concept
id: BLK-9f8bb9e36136d01a
summary: Duration_ns := end_ns - start_ns.
digest: fda62d00144038ae673bb27eaa5c842eb69e17ff376fb58f97728f3ac4432050
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Duration_ns := end_ns - start_ns..
vector_summary: Duration_ns := end_ns - start_ns.
chapter: CH-05
:::
duration_ns := end_ns - start_ns.
:::

::: concept
id: BLK-91a7da1dc4599199
summary: This approach works consistently across CLI, server, and WASM runtime.
digest: 4b2e2e5b969660db99c870d99ad137ec6942f567bb5283f61eba023b7b501176
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that This approach works consistently across CLI, server, and WASM runtime..
vector_summary: This approach works consistently across CLI, server, and WASM runtime.
chapter: CH-05
:::
This approach works consistently across CLI, server, and WASM runtime.
:::

::: concept
id: BLK-aced02aaabc583d3
summary: Http.send allows policies to call external services.
digest: 8c8b77366211f848b2877f77ede545e262927f1e68f3764f45257b742ab4c328
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Http.send allows policies to call external services..
vector_summary: Http.send allows policies to call external services.
chapter: CH-05
:::
http.send allows policies to call external services. Use with discipline.
:::

::: concept
id: BLK-7e8468a95010fff3
summary: Resp := http.send({ "method": "GET", "url": "https://example.com/api/v1/status", "headers": {"Accept": "application/json"}, "timeout": "3s" # optio...
digest: 56371c1aeb8a2abd7fb8653367ce292e4c85524fc1a76fbc4c61a5e0de5078c4
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Resp := http.send({ "method": "GET", "url": "https://example.com/api/v1/status", "headers": {"Accept": "application/json"}, "timeout": "3s" # optio....
vector_summary: Resp := http.send({ "method": "GET", "url": "https://example.com/api/v1/status", "headers": {"Accept": "application/json"}, "timeout": "3s" # optio...
chapter: CH-05
:::
resp := http.send({ "method": "GET", "url": "https://example.com/api/v1/status", "headers": {"Accept": "application/json"}, "timeout": "3s" # optional, string with units })
:::

::: concept
id: BLK-0c67765085ae094c
summary: # resp = {"status": 200, "body": ..., "headers": {...}}.
digest: 41c67655dcc5485fc94bd242a0e292046aaf415f94232dd02f8493a547621a13
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that # resp = {"status": 200, "body": ..., "headers": {...}}..
vector_summary: # resp = {"status": 200, "body": ..., "headers": {...}}.
chapter: CH-05
:::
# resp = {"status": 200, "body": ..., "headers": {...}}
:::

::: concept
id: BLK-c7e05fd3fbe19ba7
summary: Potentially slow and side-effectful.
digest: d51de9d42431c9d6728cee8bdb11941db02b5bc2c467800571fd9092b3302599
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Potentially slow and side-effectful..
vector_summary: Potentially slow and side-effectful.
chapter: CH-05
:::
Potentially slow and side-effectful.
:::

::: concept
id: BLK-1d62064b846fefe8
summary: Memoized: same arguments → single call per evaluation, cached for subsequent uses in the same query.
digest: 60256c3d37bf740db90a539a9ea2680b2385f45e84c80baf2098a94634a7119b
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Memoized: same arguments → single call per evaluation, cached for subsequent uses in the same query..
vector_summary: Memoized: same arguments → single call per evaluation, cached for subsequent uses in the same query.
graph_neighbors: [TERM-77eaf07b79028829, TERM-2e68e77273483d64]
graph_degree: 2
graph_two_hop: []
graph_three_hop: []
chapter: CH-05
:::
Memoized: same arguments → single call per evaluation, cached for subsequent uses in the same query.
:::

::: concept
id: BLK-1f0979248041848f
summary: Prefer to fetch external data ahead of time and feed via data or input.
digest: 21cc3f0c41531d39facaa589c14402c9af7980ef39fc79818519da48a2064552
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Prefer to fetch external data ahead of time and feed via data or input..
vector_summary: Prefer to fetch external data ahead of time and feed via data or input.
chapter: CH-05
:::
Prefer to fetch external data ahead of time and feed via data or input.
:::

::: concept
id: BLK-4f352c6a1c6b58e9
summary: In CI or admission controllers, avoid http.send altogether if possible.
digest: 6a47fa246de8283107cd12db22091381b902e6698f8588258aa72fbb6f439281
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that In CI or admission controllers, avoid http.send altogether if possible..
vector_summary: In CI or admission controllers, avoid http.send altogether if possible.
chapter: CH-05
:::
In CI or admission controllers, avoid http.send altogether if possible.
:::

::: concept
id: BLK-0275e80b2c04c6f4
summary: 6.16 Network & CIDR Built-ins.
digest: f9afc6e2fa95f11e62bab741670fa8e57f586184f14037fee2036764a14862c5
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that 6.16 Network & CIDR Built-ins..
vector_summary: 6.16 Network & CIDR Built-ins.
chapter: CH-05
:::
6.16 Network & CIDR Built-ins
:::

::: concept
id: BLK-52d1864741c9bdce
summary: Networking helpers are invaluable for Kubernetes and cloud policies.
digest: dfc8757ba4591362f993e6fc0a3a799a26809127ef7e11c09a8882a233c7c5da
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Networking helpers are invaluable for Kubernetes and cloud policies..
vector_summary: Networking helpers are invaluable for Kubernetes and cloud policies.
chapter: CH-05
:::
Networking helpers are invaluable for Kubernetes and cloud policies.
:::

::: concept
id: BLK-d809a65103391f7e
summary: Net.cidr_contains(cidr, ip) # true if ip ∈ CIDR net.cidr_expand(cidr) # list of IPs in small range net.cidr_intersects(c1, c2) # overlap? net.cidr_...
digest: 4a16c1f1007188327236dd3b57d70e7f04d4bfd05f9c3fcfeb857296599fbdcc
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Net.cidr_contains(cidr, ip) # true if ip ∈ CIDR net.cidr_expand(cidr) # list of IPs in small range net.cidr_intersects(c1, c2) # overlap? net.cidr_....
vector_summary: Net.cidr_contains(cidr, ip) # true if ip ∈ CIDR net.cidr_expand(cidr) # list of IPs in small range net.cidr_intersects(c1, c2) # overlap? net.cidr_...
chapter: CH-05
:::
net.cidr_contains(cidr, ip) # true if ip ∈ CIDR net.cidr_expand(cidr) # list of IPs in small range net.cidr_intersects(c1, c2) # overlap? net.cidr_merge(cidr_list) # merge overlapping ranges
:::

::: concept
id: BLK-44848643a647fa46
summary: Deny[msg] if { not net.cidr_contains("10.0.0.0/8", input.source_ip) msg := "Source IP outside corporate network" }.
digest: bfaf8304af4d1c87d3b242753c4c976df34277495dc0981d3575268dd87b268d
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Deny[msg] if { not net.cidr_contains("10.0.0.0/8", input.source_ip) msg := "Source IP outside corporate network" }..
vector_summary: Deny[msg] if { not net.cidr_contains("10.0.0.0/8", input.source_ip) msg := "Source IP outside corporate network" }.
chapter: CH-05
:::
deny[msg] if { not net.cidr_contains("10.0.0.0/8", input.source_ip) msg := "Source IP outside corporate network" }
:::

::: concept
id: BLK-da20c90c9d182979
summary: 6.17 UUID & ULID Generation.
digest: c6ce192feba7c5000ea9bf3884f31b96ade36cddd412580f90a6aa81f85b784e
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that 6.17 UUID & ULID Generation..
vector_summary: 6.17 UUID & ULID Generation.
chapter: CH-05
:::
6.17 UUID & ULID Generation
:::

::: concept
id: BLK-fd859354759e8d82
summary: Some deployments expose helpers in the standard library or via plugins.
digest: a75a13134543994b970956b1f31c6697525b2716b7419eb9655efa3f8299a7d6
symbol_refs: []
semantic_role: architecture
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Some deployments expose helpers in the standard library or via plugins..
vector_summary: Some deployments expose helpers in the standard library or via plugins.
chapter: CH-05
:::
Some deployments expose helpers in the standard library or via plugins. Common patterns:
:::

::: concept
id: BLK-eebd69b192e04b25
summary: Uuid := uuid.rfc4122(seed) ulid := ulid.generate().
digest: d624325399d959a38a7a5de21fa0ce2708061cc65acfd14778ae806d04e68e17
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Uuid := uuid.rfc4122(seed) ulid := ulid.generate()..
vector_summary: Uuid := uuid.rfc4122(seed) ulid := ulid.generate().
chapter: CH-05
:::
uuid := uuid.rfc4122(seed) ulid := ulid.generate()
:::

::: concept
id: BLK-22cafa7883ad8583
summary: Deterministic for a given string seed.
digest: 8240e35721323cc38801a70975fccb15444467e41e491c4200b00a5afccd345f
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Deterministic for a given string seed..
vector_summary: Deterministic for a given string seed.
chapter: CH-05
:::
Deterministic for a given string seed.
:::

::: concept
id: BLK-9e2b48aeaea0a3b0
summary: Ideal for tests where you want stable IDs.
digest: f9b3d16a51a5921a506711945f2d14f62030e2beb021a1280080ddf1bc019bfa
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Ideal for tests where you want stable IDs..
vector_summary: Ideal for tests where you want stable IDs.
chapter: CH-05
:::
Ideal for tests where you want stable IDs.
:::

::: concept
id: BLK-088670189c3d74cf
summary: Time-based and non-deterministic.
digest: 19cb316c4ab7890f3fb146ae20161c63a437d723a6c3a004e351ca5c14e4d0e6
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Time-based and non-deterministic..
vector_summary: Time-based and non-deterministic.
chapter: CH-05
:::
Time-based and non-deterministic.
:::

::: concept
id: BLK-3bd9a709d1537f2e
summary: Great for production identifiers, but brittle in tests.
digest: b51da24378ab56d15c6d9a94f096c505c46ac9488bcef5dce53377d772fc860c
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Great for production identifiers, but brittle in tests..
vector_summary: Great for production identifiers, but brittle in tests.
chapter: CH-05
:::
Great for production identifiers, but brittle in tests.
:::

::: concept
id: BLK-dabc7897b0693fc8
summary: Testing recommendations:.
digest: 21481ce531c5ee38b504da7f8fb382bcc788c424ab26ac3100d4f17933cf89e4
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Testing recommendations:..
semantic_categories: [testing]
vector_summary: Testing recommendations:.
graph_neighbors: [CODE-213aa0a6ee07643a, CODE-efd78ba9916ca447, CODE-141a39bba2be1ded, CODE-031e381b7120fc25, CODE-8ac93f8eb365af28]
graph_degree: 5
graph_two_hop: []
graph_three_hop: []
chapter: CH-05
:::
Testing recommendations:
:::

::: concept
id: BLK-170f2a1e591e04fa
summary: # Stable UUID in tests test_id := uuid.rfc4122("test-seed-123").
digest: a44d966ca50fc35ee98920285f7123dcd9cacb893a70b33108ec0971838e07d2
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that # Stable UUID in tests test_id := uuid.rfc4122("test-seed-123")..
vector_summary: # Stable UUID in tests test_id := uuid.rfc4122("test-seed-123").
chapter: CH-05
:::
# Stable UUID in tests test_id := uuid.rfc4122("test-seed-123")
:::

::: concept
id: BLK-a04d8dafcc0fa4ec
summary: # - mock it with: with ulid.generate as "fixed-ulid".
digest: 8e0a6cf65434576c662dc58a24ce8a0f3c687a86a9eae3e590eff8d3d5633b7c
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that # - mock it with: with ulid.generate as "fixed-ulid"..
vector_summary: # - mock it with: with ulid.generate as "fixed-ulid".
chapter: CH-05
:::
# - mock it with: with ulid.generate as "fixed-ulid"
:::

::: concept
id: BLK-8c0b2ddbd669fce8
summary: # - or only check that a ULID exists / matches a regex, not its exact value.
digest: 1d2ac2015e928dcb644356c49dd66d0ba897799ca97ec56a8a09507505eb54f0
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that # - or only check that a ULID exists / matches a regex, not its exact value..
vector_summary: # - or only check that a ULID exists / matches a regex, not its exact value.
chapter: CH-05
:::
# - or only check that a ULID exists / matches a regex, not its exact value
:::

::: concept
id: BLK-25b1b7cd937cb1b3
summary: 6.18 Graph & Structural Walks.
digest: 457e07f6a43a792653ab46abcfd69b432e5484589d221ea70589f1d9e85743ac
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that 6.18 Graph & Structural Walks..
vector_summary: 6.18 Graph & Structural Walks.
chapter: CH-05
:::
6.18 Graph & Structural Walks
:::

::: concept
id: BLK-5893372fbb305323
summary: Graph.* functions operate on graph structures (represented as adjacency lists).
digest: 3a530638838eaf92ca4c1c0875132d0d074676d4164d609ef9bad08cff207035
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Graph.* functions operate on graph structures (represented as adjacency lists)..
vector_summary: Graph.* functions operate on graph structures (represented as adjacency lists).
chapter: CH-05
:::
graph.* functions operate on graph structures (represented as adjacency lists).
:::

::: concept
id: BLK-40bcf556b793fb46
summary: Graph.reachable(graph, ["start"]) # list of reachable nodes.
digest: 9338f43eadcc1ab2b2fc847645c9f96d911b096ef30e5b7f89a0c3a8aa8aa56b
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Graph.reachable(graph, ["start"]) # list of reachable nodes..
vector_summary: Graph.reachable(graph, ["start"]) # list of reachable nodes.
chapter: CH-05
:::
graph.reachable(graph, ["start"]) # list of reachable nodes
:::

::: concept
id: BLK-a50a80fdc1c25566
summary: Walk(x) traverses nested structures and returns [path, value] pairs:.
digest: b0937fa6a915cb027d9049b3a6c605b4ac669eb73d7f1979c1e6e22dcfb3ed91
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Walk(x) traverses nested structures and returns [path, value] pairs:..
vector_summary: Walk(x) traverses nested structures and returns [path, value] pairs:.
chapter: CH-05
:::
walk(x) traverses nested structures and returns [path, value] pairs:
:::

::: concept
id: BLK-92e3fc7d804a2808
summary: Pairs := walk(input).
digest: 2fa7fe34f8142429d4004c40e61e0ebafc3d86e0bd130c5dc11efa6e0d29c965
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Pairs := walk(input)..
vector_summary: Pairs := walk(input).
chapter: CH-05
:::
pairs := walk(input)
:::

::: concept
id: BLK-7bf0cd27ee7a741b
summary: # pairs is [[["path","to","value"], value], ...].
digest: 4a568fd3e45068e4f03b9cc0c04a6e446c8857e3dad77dfadcba79cc820864c7
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that # pairs is [[["path","to","value"], value], ...]..
vector_summary: # pairs is [[["path","to","value"], value], ...].
chapter: CH-05
:::
# pairs is [[["path","to","value"], value], ...]
:::

::: concept
id: BLK-bf0bc41d6b2d1316
summary: # Find all values under keys called "id" ids := {v | [p, v] := walk(input) p[_] == "id" }.
digest: 13a0facb14c5c8432c4cac2d1dcf6d3ca364353f7e7e27eb50dd8342920b13b2
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that # Find all values under keys called "id" ids := {v | [p, v] := walk(input) p[_] == "id" }..
vector_summary: # Find all values under keys called "id" ids := {v | [p, v] := walk(input) p[_] == "id" }.
chapter: CH-05
:::
# Find all values under keys called "id" ids := {v | [p, v] := walk(input) p[_] == "id" }
:::

::: concept
id: BLK-c8affe0478937bf0
summary: 6.19 Units & Parsing.
digest: 82f84d402679dba7818692177f8d9e237b9e430509b5e7deae83cc8b10825211
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that 6.19 Units & Parsing..
vector_summary: 6.19 Units & Parsing.
chapter: CH-05
:::
6.19 Units & Parsing
:::

::: concept
id: BLK-b205c1c7c5b4d6cf
summary: For human-friendly sizes or durations:.
digest: 989338814271fdd1dc2e2f44f950f41a85c5d97217a767430166107505d1e6e1
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that For human-friendly sizes or durations:..
vector_summary: For human-friendly sizes or durations:.
chapter: CH-05
:::
For human-friendly sizes or durations:
:::

::: concept
id: BLK-6ff4f186b7b2630a
summary: Units.parse("10GB") # parse size with units → numeric bytes units.parse_bytes("10MB") # synonym-focused variant.
digest: 1ba0ff0e1c248f45710ee41d48f84f8e4244d7c4c74a8592d4f8505d18953a95
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Units.parse("10GB") # parse size with units → numeric bytes units.parse_bytes("10MB") # synonym-focused variant..
vector_summary: Units.parse("10GB") # parse size with units → numeric bytes units.parse_bytes("10MB") # synonym-focused variant.
chapter: CH-05
:::
units.parse("10GB") # parse size with units → numeric bytes units.parse_bytes("10MB") # synonym-focused variant
:::

::: concept
id: BLK-af94401090888bac
summary: Useful for policies over resource limits:.
digest: 95f3f3dd9a5b5446db8113cbdc6e81b2035cdf92094da2f0106e70592504294d
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Useful for policies over resource limits:..
vector_summary: Useful for policies over resource limits:.
chapter: CH-05
:::
Useful for policies over resource limits:
:::

::: concept
id: BLK-3b7e4e77e5997407
summary: Deny[msg] if { limit_bytes := units.parse(input.spec.resources.limits.memory) limit_bytes > units.parse("4Gi") msg := "Pod memory limit exceeds 4Gi...
digest: 79c47a2fc2a65cea753eca71547178c9ce8385106a4c8ae2038decb1d85cf10e
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Deny[msg] if { limit_bytes := units.parse(input.spec.resources.limits.memory) limit_bytes > units.parse("4Gi") msg := "Pod memory limit exceeds 4Gi....
vector_summary: Deny[msg] if { limit_bytes := units.parse(input.spec.resources.limits.memory) limit_bytes > units.parse("4Gi") msg := "Pod memory limit exceeds 4Gi...
chapter: CH-05
:::
deny[msg] if { limit_bytes := units.parse(input.spec.resources.limits.memory) limit_bytes > units.parse("4Gi") msg := "Pod memory limit exceeds 4Gi" }
:::

::: concept
id: BLK-37ac9c46cd3b8691
summary: 6.20 Metadata & Annotations.
digest: 402dcd400880c35b37d5bc21c0c3232b10714705d3b4d9b3642a8c4dcc80adda
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that 6.20 Metadata & Annotations..
vector_summary: 6.20 Metadata & Annotations.
chapter: CH-05
:::
6.20 Metadata & Annotations
:::

::: concept
id: BLK-42bca06a919a5ae8
summary: Drive governance features (e.g., map violations back to policy owners).
digest: b56657e172a56d5069f1f12e381ef96c8d6c4ecf28c52bd34203ce7f9033ab0a
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Drive governance features (e.g., map violations back to policy owners)..
vector_summary: Drive governance features (e.g., map violations back to policy owners).
chapter: CH-05
:::
Drive governance features (e.g., map violations back to policy owners).
:::

::: concept
id: BLK-89b0fd99072a7ad9
summary: 6.21 Debugging Built-ins: print and trace.
digest: be0eee97166378f60c5f6d39d57a9f83e24b6d6cbe7801b39a04156ffee1e5d2
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that 6.21 Debugging Built-ins: print and trace..
vector_summary: 6.21 Debugging Built-ins: print and trace.
chapter: CH-05
:::
6.21 Debugging Built-ins: print and trace
:::

::: concept
id: BLK-fb39667760c12b4c
summary: Print(...) always returns true, so it does not change logical semantics.
digest: cb776a73a12d1abefd255a53c3ff801faca5a475904783abd8a3d646da96ec6e
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Print(...) always returns true, so it does not change logical semantics..
vector_summary: Print(...) always returns true, so it does not change logical semantics.
chapter: CH-05
:::
print(...) always returns true, so it does not change logical semantics.
:::

::: concept
id: BLK-e1788d332fd4b6ad
summary: Trace may also be available as an alias in some environments; print is the standard.
digest: b38b3b925f78094720397bf8d524365ac80a0bc71331b70f303726246964b127
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Trace may also be available as an alias in some environments; print is the standard..
vector_summary: Trace may also be available as an alias in some environments; print is the standard.
chapter: CH-05
:::
trace may also be available as an alias in some environments; print is the standard.
:::

::: concept
id: BLK-abf7fb28b77ba86b
summary: Use print liberally during development and experiments.
digest: 4180a2b7410f5bbc16aa2a6cfa8910ef604d9acb4c7792af7f78d2e188fbdf93
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Use print liberally during development and experiments..
vector_summary: Use print liberally during development and experiments.
chapter: CH-05
:::
Use print liberally during development and experiments.
:::

::: concept
id: BLK-e61c1e6a7ef98607
summary: Remove or gate print statements in production policies to avoid log noise and PII leaks (many style guides enforce no print in prod).
digest: 51e951de56c495ceac91a2788a13161f4c2965f6bff59df1bcc3ae6ea679fc94
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Remove or gate print statements in production policies to avoid log noise and PII leaks (many style guides enforce no print in prod)..
vector_summary: Remove or gate print statements in production policies to avoid log noise and PII leaks (many style guides enforce no print in prod).
chapter: CH-05
:::
Remove or gate print statements in production policies to avoid log noise and PII leaks (many style guides enforce no print in prod).
:::

::: concept
id: BLK-9de1de98fdc727e3
summary: 6.22 Error Semantics & Strict Mode.
digest: 635d4447db1744b724c9020672b2c09239dd545bee0881f251724dac94254f3b
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that 6.22 Error Semantics & Strict Mode..
vector_summary: 6.22 Error Semantics & Strict Mode.
chapter: CH-05
:::
6.22 Error Semantics & Strict Mode
:::

::: concept
id: BLK-98bcb77cc1ac5811
summary: By default, built-in errors make expressions undefined:.
digest: dabc15f4cb6ff4ac6b33a4c4066d4105caa68a74b90b6413226c72137e382e59
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that By default, built-in errors make expressions undefined:..
vector_summary: By default, built-in errors make expressions undefined:.
chapter: CH-05
:::
By default, built-in errors make expressions undefined:
:::

::: concept
id: BLK-8cc9eedcab25fd2b
summary: For higher assurance, strict builtin errors convert such errors into hard failures:.
digest: 62ffa3cc87a53f33c0703cc7970ef73566f895ff95787f138dbc685d6679891b
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that For higher assurance, strict builtin errors convert such errors into hard failures:..
vector_summary: For higher assurance, strict builtin errors convert such errors into hard failures:.
chapter: CH-05
:::
For higher assurance, strict builtin errors convert such errors into hard failures:
:::

::: concept
id: BLK-629475ec5c0d3bfb
summary: HTTP API: strict-builtin-errors=true query parameter.
digest: 7ea50fbb7044110acd064fc083069b7538a4de2aeac274f77fb770803c753641
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that HTTP API: strict-builtin-errors=true query parameter..
vector_summary: HTTP API: strict-builtin-errors=true query parameter.
chapter: CH-05
:::
HTTP API: strict-builtin-errors=true query parameter.
:::

::: concept
id: BLK-93ad46a2fdd8ff11
summary: In CI to catch unexpected type mismatches and invalid data.
digest: d2a77a33e47f5c138ec082a5926f96891537939278f98df58b9f35dfa0d51c95
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that In CI to catch unexpected type mismatches and invalid data..
vector_summary: In CI to catch unexpected type mismatches and invalid data.
chapter: CH-05
:::
In CI to catch unexpected type mismatches and invalid data.
:::

::: concept
id: BLK-557953aa35227612
summary: In critical policies where silent undefined behavior is unacceptable.
digest: 15f1a0a0251640ccc8179c923be1c5f97c3472284cf25f709577f27f62e592b7
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that In critical policies where silent undefined behavior is unacceptable..
vector_summary: In critical policies where silent undefined behavior is unacceptable.
chapter: CH-05
:::
In critical policies where silent undefined behavior is unacceptable.
:::

::: concept
id: BLK-22b57961d600fe2f
summary: Pattern: Combine strict mode in tests with non-strict mode in production, or vice versa, depending on risk posture.
digest: 6b9303b921147f9a3f063da6001b64a8cc50f6afdc57511370eccf25fbc6bb69
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Pattern: Combine strict mode in tests with non-strict mode in production, or vice versa, depending on risk posture..
vector_summary: Pattern: Combine strict mode in tests with non-strict mode in production, or vice versa, depending on risk posture.
chapter: CH-05
:::
Pattern: Combine strict mode in tests with non-strict mode in production, or vice versa, depending on risk posture.
:::

::: concept
id: BLK-f3b1c72ce3eb55c9
summary: 6.23 Performance Patterns with Built-ins.
digest: c1f703d785d0c8285ce674c5a54c57a7661063e3042229262b0dc8ec6e24535e
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that 6.23 Performance Patterns with Built-ins..
vector_summary: 6.23 Performance Patterns with Built-ins.
chapter: CH-05
:::
6.23 Performance Patterns with Built-ins
:::

::: concept
id: BLK-52537d28f7f19d80
summary: Guard expensive built-ins with cheap checks.
digest: 032e4a0ea6e573e0525f6c339f875920f412fd3dafba736e99e37a59af434779
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Guard expensive built-ins with cheap checks..
vector_summary: Guard expensive built-ins with cheap checks.
chapter: CH-05
:::
Guard expensive built-ins with cheap checks
:::

::: concept
id: BLK-2a74bde34951ff9b
summary: # Good: fast predicate first deny if { input.method == "POST" regex.match((?i)password, input.body) }.
digest: ac4cfbf773f0a3d99cca5f2484ba0b235393bea17ce173cb0aac7963be28d853
symbol_refs: [(?i)password]
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that # Good: fast predicate first deny if { input.method == "POST" regex.match((?i)password, input.body) }..
vector_summary: # Good: fast predicate first deny if { input.method == "POST" regex.match((?i)password, input.body) }.
chapter: CH-05
:::
# Good: fast predicate first deny if { input.method == "POST" regex.match(`(?i)password`, input.body) }
:::

::: concept
id: BLK-85e73235529b5c88
summary: Avoid large intermediate arrays via comprehensions if a boolean will do.
digest: 01132c449fb30f43d5db9bdbc45ea3ed10db4b01be777040b920f29a989c1a4a
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Avoid large intermediate arrays via comprehensions if a boolean will do..
vector_summary: Avoid large intermediate arrays via comprehensions if a boolean will do.
graph_neighbors: [CODE-2cbe0767daa4b7a0]
graph_degree: 1
graph_two_hop: []
graph_three_hop: []
chapter: CH-05
:::
Avoid large intermediate arrays via comprehensions if a boolean will do
:::

::: concept
id: BLK-c6e81d159f73459d
summary: # Bad admins := {u | some u in users; "admin" in u.roles} has_admin if count(admins) > 0.
digest: c1352ade30b117a51bb43abb00d78378b4d5ae32569e629320599c70bcab9b07
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that # Bad admins := {u | some u in users; "admin" in u.roles} has_admin if count(admins) > 0..
vector_summary: # Bad admins := {u | some u in users; "admin" in u.roles} has_admin if count(admins) > 0.
chapter: CH-05
:::
# Bad admins := {u | some u in users; "admin" in u.roles} has_admin if count(admins) > 0
:::

::: concept
id: BLK-8237d2a05c87c232
summary: # Good has_admin if { some u in users "admin" in u.roles }.
digest: 27d842462ccca01eb7a8f17a4584aaf0b7f7e2510a1eb50e940859a932786ac9
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that # Good has_admin if { some u in users "admin" in u.roles }..
vector_summary: # Good has_admin if { some u in users "admin" in u.roles }.
chapter: CH-05
:::
# Good has_admin if { some u in users "admin" in u.roles }
:::

::: concept
id: BLK-c15df4c67851208d
summary: Use sets for membership, arrays for ordered sequences.
digest: 58caa27a0a73db5861444a9628621a760ec17f65826c48e9c1b28ac1107d6107
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Use sets for membership, arrays for ordered sequences..
vector_summary: Use sets for membership, arrays for ordered sequences.
chapter: CH-05
:::
Use sets for membership, arrays for ordered sequences
:::

::: concept
id: BLK-62c2e97c399eb38b
summary: Memoization awareness.
digest: fbc18f7834dc7e92038c03f6ea719bfdccb01e55e528741fc1052cee604ced46
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Memoization awareness..
vector_summary: Memoization awareness.
chapter: CH-05
:::
Memoization awareness
:::

::: concept
id: BLK-a6bde4c24ae6370c
summary: Expensive built-ins with same arguments (e.g., http.send, complex regex.match) will be evaluated once per query and cached.
digest: bf8ad31e158a1d29eba66c6306f93f443e0e810ae4856f023d9d07d6d1c2f2de
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Expensive built-ins with same arguments (e.g., http.send, complex regex.match) will be evaluated once per query and cached..
vector_summary: Expensive built-ins with same arguments (e.g., http.send, complex regex.match) will be evaluated once per query and cached.
chapter: CH-05
:::
Expensive built-ins with same arguments (e.g., http.send, complex regex.match) will be evaluated once per query and cached.
:::

::: concept
id: BLK-25cc50c2bf8d6039
summary: If inputs differ slightly each time, caching may not help; consider pre-processing.
digest: fa6b1d88baff63c21187f2f5fb30ccb4bdd363e996cd27a20507e92767a77367
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that If inputs differ slightly each time, caching may not help; consider pre-processing..
vector_summary: If inputs differ slightly each time, caching may not help; consider pre-processing.
chapter: CH-05
:::
If inputs differ slightly each time, caching may not help; consider pre-processing.
:::

::: concept
id: BLK-f78bd271000af25a
summary: Safe logging: Use object.remove + json.marshal + trim* to avoid PII leaks.
digest: a084fffa29408daac8f82444733c3cee460a2ec9e5f993be65cdb608ba702e18
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Safe logging: Use object.remove + json.marshal + trim* to avoid PII leaks..
vector_summary: Safe logging: Use object.remove + json.marshal + trim* to avoid PII leaks.
chapter: CH-05
:::
Safe logging: Use object.remove + json.marshal + trim* to avoid PII leaks.
:::

::: concept
id: BLK-6d542199f9475a27
summary: Overuse of regex in hot loops will tank performance.
digest: 0663f1e05c5be6e238a201eb01decd2678c8ef423a41932e127c9de442112ee3
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Overuse of regex in hot loops will tank performance..
vector_summary: Overuse of regex in hot loops will tank performance.
chapter: CH-05
:::
Overuse of regex in hot loops will tank performance.
:::

::: concept
id: BLK-5851e4a3db9f9ac3
summary: Prefer startswith, endswith, contains, or exact matches when sufficient.
digest: cdf498b8582cc4da924226e6936bbe92c4abf72a93659747e61d966aed84ca62
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Prefer startswith, endswith, contains, or exact matches when sufficient..
vector_summary: Prefer startswith, endswith, contains, or exact matches when sufficient.
chapter: CH-05
:::
Prefer startswith, endswith, contains, or exact matches when sufficient.
:::

::: concept
id: BLK-2467bf0ffb43ccb1
summary: Hidden type conversions:.
digest: 308a968eb989e6d1d181b550e53d4bf6f89f081a9dead90be959bd123ef10048
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Hidden type conversions:..
vector_summary: Hidden type conversions:.
chapter: CH-05
:::
Hidden type conversions:
:::

::: concept
id: BLK-e4f27c62a91903fd
summary: Relying on to_number implicitly instead of checking type leads to brittle policies.
digest: d30890386382102ab25284e664bdca82629ac6c5527e4068dc02da484231976a
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Relying on to_number implicitly instead of checking type leads to brittle policies..
vector_summary: Relying on to_number implicitly instead of checking type leads to brittle policies.
chapter: CH-05
:::
Relying on to_number implicitly instead of checking type leads to brittle policies.
:::

::: concept
id: BLK-4510e9e029402fb5
summary: Unbounded http.send usage:.
digest: 02278c4f96dfcc3bc3301260535cd3ecde5b36324a4305c36c2f7121193b5693
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Unbounded http.send usage:..
vector_summary: Unbounded http.send usage:.
chapter: CH-05
:::
Unbounded http.send usage:
:::

::: concept
id: BLK-fe080225bb5195ba
summary: Using HTTP calls per request is rarely acceptable in admission controllers or hot authorization paths.
digest: a140d22740839d420b9e5e4a911085026e492f609d02e282425b6e84f538847e
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Using HTTP calls per request is rarely acceptable in admission controllers or hot authorization paths..
semantic_categories: [authz]
vector_summary: Using HTTP calls per request is rarely acceptable in admission controllers or hot authorization paths.
graph_neighbors: [CODE-1f681853ebf733fb, CODE-3152b6a89a146d23, CODE-4d2ad0d6df9f48c1, CODE-e3021412b7e801e0, CODE-e8a2139bac84c4a0, CODE-ff0c5e5c7e41a636, CODE-322fb8a04486fb51, CODE-22a3c940e76c1893, CODE-ae589d488d5196d2, CODE-4b643428b4f2edd0, CODE-f9165857ee2c0c68]
graph_degree: 11
graph_two_hop: []
graph_three_hop: []
chapter: CH-05
:::
Using HTTP calls per request is rarely acceptable in admission controllers or hot authorization paths.
:::

::: concept
id: BLK-980b341fb19bb54f
summary: Import data.authz.api.
digest: 948a4bbaf15d659b760b8143d97631a2e78039c0eecc97cf29a1bf9835c7ba7f
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Import data.authz.api..
vector_summary: Import data.authz.api.
chapter: CH-05
:::
import data.authz.api
:::

::: concept
id: BLK-aee13c5bae097378
summary: Test_admin_can_read if { api.allow with input as { "user": {"id": "alice", "roles": ["admin"]}, "action": "read", "resource": {"id": "123"} } }.
digest: 9133360bcfa72642013d76c89d866b7fdf7612570a11d8c2bd6124a3270fe0a3
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Test_admin_can_read if { api.allow with input as { "user": {"id": "alice", "roles": ["admin"]}, "action": "read", "resource": {"id": "123"} } }..
vector_summary: Test_admin_can_read if { api.allow with input as { "user": {"id": "alice", "roles": ["admin"]}, "action": "read", "resource": {"id": "123"} } }.
chapter: CH-05
:::
test_admin_can_read if { api.allow with input as { "user": {"id": "alice", "roles": ["admin"]}, "action": "read", "resource": {"id": "123"} } }
:::

::: concept
id: BLK-0b8df7beeb5c08e5
summary: Test_guest_cannot_write if { not api.allow with input as { "user": {"id": "guest", "roles": ["guest"]}, "action": "write", "resource": {"id": "123"...
digest: 92afc85eeb0ef95d2daf453fe88a6a9d2ee9406d8c5e6fe8365e4e984916e0fd
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Test_guest_cannot_write if { not api.allow with input as { "user": {"id": "guest", "roles": ["guest"]}, "action": "write", "resource": {"id": "123"....
vector_summary: Test_guest_cannot_write if { not api.allow with input as { "user": {"id": "guest", "roles": ["guest"]}, "action": "write", "resource": {"id": "123"...
chapter: CH-05
:::
test_guest_cannot_write if { not api.allow with input as { "user": {"id": "guest", "roles": ["guest"]}, "action": "write", "resource": {"id": "123"} } } Running tests
:::

::: concept
id: BLK-ed251b560e4430b0
summary: # in test: test_within_business_hours_if_daytime if { within_business_hours with time.now_ns as 1700000000000000000 # some daytime timestamp } This...
digest: b96ce283eb277276d5acf44fa3b5922d67fe77f5d8d58a61d93e5109a12ec105
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that # in test: test_within_business_hours_if_daytime if { within_business_hours with time.now_ns as 1700000000000000000 # some daytime timestamp } This....
semantic_categories: [testing]
vector_summary: # in test: test_within_business_hours_if_daytime if { within_business_hours with time.now_ns as 1700000000000000000 # some daytime timestamp } This...
graph_neighbors: [CODE-213aa0a6ee07643a, CODE-efd78ba9916ca447, CODE-141a39bba2be1ded, CODE-031e381b7120fc25, CODE-8ac93f8eb365af28]
graph_degree: 5
graph_two_hop: []
graph_three_hop: []
chapter: CH-05
:::
# in test: test_within_business_hours_if_daytime if { within_business_hours with time.now_ns as 1700000000000000000 # some daytime timestamp } This makes your policies deterministic and testable, even when they rely on clocks, network calls, or external data. ________________________________________ 7.3 Unit Tests vs Integration Tests vs “Golden” Tests Testing & Tooling
:::

::: concept
id: BLK-f47d37f0ebabc839
summary: This chapter describes patterns for unit tests, integration tests, and golden tests.
digest: 84a16e831d720d4f04787a83bac6eb8b5084ca8fd89f4c872b38ce7b7137e095
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that This chapter describes patterns for unit tests, integration tests, and golden tests..
vector_summary: This chapter describes patterns for unit tests, integration tests, and golden tests.
chapter: CH-05
:::
This chapter describes patterns for unit tests, integration tests, and golden tests.
:::

::: concept
id: BLK-2fb586d6bc481c5d
summary: Golden tests compare the decision against a “golden” expected result stored in a file.
digest: 0da44fcee0fb18c61cc5036023b021fcc964c8db018f7c601c037bc1934b8c3a
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Golden tests compare the decision against a “golden” expected result stored in a file..
vector_summary: Golden tests compare the decision against a “golden” expected result stored in a file.
chapter: CH-05
:::
Golden tests compare the decision against a “golden” expected result stored in a file. Critically:
:::

::: concept
id: BLK-a43afad2bf2ed56f
summary: A realistic pattern:.
digest: f94dde84a56ecc24ecf53ae58b2a7aa2f8ca98dae8ba815bb518e4b6371e9d6a
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that A realistic pattern:..
vector_summary: A realistic pattern:.
chapter: CH-05
:::
A realistic pattern:
:::

::: concept
id: BLK-12a6c33c25aad45a
summary: Package compliance_test.
digest: 17dfb8533166e20f81561fb9bdee2b27baa061f04c1013c4a1ed363d11345c0a
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Package compliance_test..
vector_summary: Package compliance_test.
chapter: CH-05
:::
package compliance_test
:::

::: concept
id: BLK-ee543555b43f4c19
summary: Import data.compliance.
digest: db5f4fefd814b5eb7709f9a6093eef17df525d93a3e831eec15d675f6f3e6621
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Import data.compliance..
vector_summary: Import data.compliance.
chapter: CH-05
:::
import data.compliance
:::

::: concept
id: BLK-216d33dfeabb69f0
summary: Test_large_pr_risk_profile if { # Harness loads JSON from disk into data.tests.* input_case := data.tests["pr_large"].input expected := data.tests[...
digest: 55dfc375d3a1bf191ecdc3a26109fdb860ab6bc0415cfaaf1b14bc3965f3f020
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Test_large_pr_risk_profile if { # Harness loads JSON from disk into data.tests.* input_case := data.tests["pr_large"].input expected := data.tests[....
vector_summary: Test_large_pr_risk_profile if { # Harness loads JSON from disk into data.tests.* input_case := data.tests["pr_large"].input expected := data.tests[...
chapter: CH-05
:::
test_large_pr_risk_profile if { # Harness loads JSON from disk into data.tests.* input_case := data.tests["pr_large"].input expected := data.tests["pr_large"].expected
:::

::: concept
id: BLK-72a460040bb5dc02
summary: Result := compliance with input as input_case result == expected }.
digest: 4f433abef52cfc5c404829953f6ecf9f1aceef77674d14abc1ba327533dd1548
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Result := compliance with input as input_case result == expected }..
vector_summary: Result := compliance with input as input_case result == expected }.
chapter: CH-05
:::
result := compliance with input as input_case result == expected }
:::

::: concept
id: BLK-3418174c65cc2e6b
summary: Typical harness responsibilities:.
digest: 7f2e26c51c5491058e21121dbf24e285ddd0f1b16e4744ce101aa7210bf0d16e
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Typical harness responsibilities:..
vector_summary: Typical harness responsibilities:.
chapter: CH-05
:::
Typical harness responsibilities:
:::

::: concept
id: BLK-b114e264b1a95140
summary: Read tests/inputs/pr_large.json and tests/expected/pr_large.json from disk.
digest: e636427a5744c4aa82a8c6580cedf7951b837e35d4785e0c09b426e9d84eb7ae
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Read tests/inputs/pr_large.json and tests/expected/pr_large.json from disk..
vector_summary: Read tests/inputs/pr_large.json and tests/expected/pr_large.json from disk.
chapter: CH-05
:::
Read tests/inputs/pr_large.json and tests/expected/pr_large.json from disk.
:::

::: concept
id: BLK-ae51cdad26736c7b
summary: Optionally parameterize tests via CLI flags or environment.
digest: ea1d7313ecb6b964af6d3a3a79e51e6394f918c1b68c09bac159f2311ed30b1d
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Optionally parameterize tests via CLI flags or environment..
vector_summary: Optionally parameterize tests via CLI flags or environment.
chapter: CH-05
:::
Optionally parameterize tests via CLI flags or environment.
:::

::: concept
id: BLK-b4984dc6c3976f8c
summary: 7.7.1 The Newline Escape Sequence Problem.
digest: 770eab61b0508f4019c9e44f783ba3ee5c52447412a04e23f293fd428cefe548
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that 7.7.1 The Newline Escape Sequence Problem..
vector_summary: 7.7.1 The Newline Escape Sequence Problem.
chapter: CH-05
:::
7.7.1 The Newline Escape Sequence Problem
:::

::: concept
id: BLK-2fefd1ebc0822d3c
summary: When testing policies that operate on multi-line content (e.g., file diffs, code blocks, structured text), developers often encounter a subtle but ...
digest: 961922dac1822c548a1efda6dc71407133bb237feeedd3438ced13b096eac1bf
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that When testing policies that operate on multi-line content (e.g., file diffs, code blocks, structured text), developers often encounter a subtle but ....
semantic_categories: [testing]
vector_summary: When testing policies that operate on multi-line content (e.g., file diffs, code blocks, structured text), developers often encounter a subtle but ...
graph_neighbors: [CODE-213aa0a6ee07643a, CODE-efd78ba9916ca447, CODE-141a39bba2be1ded, CODE-031e381b7120fc25, CODE-8ac93f8eb365af28]
graph_degree: 5
graph_two_hop: []
graph_three_hop: []
chapter: CH-05
:::
When testing policies that operate on multi-line content (e.g., file diffs, code blocks, structured text), developers often encounter a subtle but critical difference:
:::

::: concept
id: BLK-bc9f823fd5cedebf
summary: Impact on Regex Patterns:.
digest: f7c42c53bb2592f96000cd03618dcd4fdb12ba95137b959471886283e59a7f6d
symbol_refs: [Impact on Regex Patterns:]
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Impact on Regex Patterns:..
vector_summary: Impact on Regex Patterns:.
chapter: CH-05
:::
**Impact on Regex Patterns:**
:::

::: concept
id: BLK-e8ea5973a9c2c4fa
summary: The regex pattern TODO:\\s*\\n expects an actual newline character, but receives the literal string "\n", causing the match to fail.
digest: 9c38ebb249ee28e7d0b35c6767d8e94b70e38736d7fcd0164edb378e21994a0e
symbol_refs: [TODO:\\s*\\n]
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that The regex pattern TODO:\\s*\\n expects an actual newline character, but receives the literal string "\n", causing the match to fail..
vector_summary: The regex pattern TODO:\\s*\\n expects an actual newline character, but receives the literal string "\n", causing the match to fail.
chapter: CH-05
:::
The regex pattern `TODO:\\s*\\n` expects an actual newline character, but receives the literal string "\n", causing the match to fail.
:::

::: concept
id: BLK-d8d63540cecf04c9
summary: 7.7.2 Solution: Raw Strings (Backticks) for Multi-Line Test Data.
digest: cdc13702d9d05ea6bf8290d5f145d4d4b248cfd58ce54ae656f235c760b7fbab
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that 7.7.2 Solution: Raw Strings (Backticks) for Multi-Line Test Data..
vector_summary: 7.7.2 Solution: Raw Strings (Backticks) for Multi-Line Test Data.
chapter: CH-05
:::
7.7.2 Solution: Raw Strings (Backticks) for Multi-Line Test Data
:::

::: concept
id: BLK-a733b1236eb837cb
summary: For test inputs containing multi-line content, use raw strings (backticks) which preserve actual newlines:.
digest: 20a742d87424ee9698476b11cdf91b6654233fedf5da1b988a43ccdee157e067
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that For test inputs containing multi-line content, use raw strings (backticks) which preserve actual newlines:..
vector_summary: For test inputs containing multi-line content, use raw strings (backticks) which preserve actual newlines:.
chapter: CH-05
:::
For test inputs containing multi-line content, use raw strings (backticks) which preserve actual newlines:
:::

::: concept
id: BLK-3ab344a17a6684a1
summary: Raw String Properties: - Preserve actual newline characters (not \n literals) - Do not interpret escape sequences (\n, \t, etc.) - Ideal for multi-...
digest: d9d38bf71a5c1c1e3ddf01014744346cc32e1af401df1ccae344049d534fa7ea
symbol_refs: [\t, \n, Raw String Properties:]
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Raw String Properties: - Preserve actual newline characters (not \n literals) - Do not interpret escape sequences (\n, \t, etc.) - Ideal for multi-....
vector_summary: Raw String Properties: - Preserve actual newline characters (not \n literals) - Do not interpret escape sequences (\n, \t, etc.) - Ideal for multi-...
chapter: CH-05
:::
**Raw String Properties:** - Preserve actual newline characters (not `\n` literals) - Do not interpret escape sequences (`\n`, `\t`, etc.) - Ideal for multi-line test data (diffs, code blocks, structured text) - Compatible with regex patterns expecting real newlines
:::

::: concept
id: BLK-82a0ab5d24aee213
summary: When to Use Raw Strings vs Double-Quoted: - Raw strings (backticks): Multi-line content, actual newlines needed, regex patterns matching line break...
digest: 4654b64c230263e8dae63dc6905d1fc64868f74ff73b278b3017c67baa267303
symbol_refs: [Double-quoted, Raw strings (backticks), When to Use Raw Strings vs Double-Quoted:]
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that When to Use Raw Strings vs Double-Quoted: - Raw strings (backticks): Multi-line content, actual newlines needed, regex patterns matching line break....
vector_summary: When to Use Raw Strings vs Double-Quoted: - Raw strings (backticks): Multi-line content, actual newlines needed, regex patterns matching line break...
graph_neighbors: [TERM-4176bf4a5b555c86]
graph_degree: 1
graph_two_hop: []
graph_three_hop: []
chapter: CH-05
:::
**When to Use Raw Strings vs Double-Quoted:** - **Raw strings (backticks)**: Multi-line content, actual newlines needed, regex patterns matching line breaks - **Double-quoted**: Single-line content, escape sequences acceptable, JSON-like strings
:::

::: concept
id: BLK-b18ce5c52c9d7ec8
summary: 7.7.3 Debugging String Literal Issues.
digest: 5818c396e23d2f375012c0adcd1d1fd2cda15939d96b1be371be8e79c94c0527
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that 7.7.3 Debugging String Literal Issues..
vector_summary: 7.7.3 Debugging String Literal Issues.
chapter: CH-05
:::
7.7.3 Debugging String Literal Issues
:::

::: concept
id: BLK-7c6331f584245e6f
summary: ________________________________________ 7.8 Test Evaluation Context and Variable Binding Patterns.
digest: 1462b0b8f7b901034504abb6f8cf0df1e22583940f0e84796b0769496effe067
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that ________________________________________ 7.8 Test Evaluation Context and Variable Binding Patterns..
vector_summary: ________________________________________ 7.8 Test Evaluation Context and Variable Binding Patterns.
graph_neighbors: [TERM-77eaf07b79028829, TERM-2e68e77273483d64]
graph_degree: 2
graph_two_hop: []
graph_three_hop: []
chapter: CH-05
:::
________________________________________ 7.8 Test Evaluation Context and Variable Binding Patterns
:::

::: concept
id: BLK-86120ccbf9fd371f
summary: 7.8.1 Direct Evaluation vs Variable Binding.
digest: c65a15b1a9dc71c1bb5bbe04da026e8ee6547ebeec456e233091ee8ff6f6ec39
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that 7.8.1 Direct Evaluation vs Variable Binding..
vector_summary: 7.8.1 Direct Evaluation vs Variable Binding.
graph_neighbors: [TERM-77eaf07b79028829, TERM-2e68e77273483d64]
graph_degree: 2
graph_two_hop: []
graph_three_hop: []
chapter: CH-05
:::
7.8.1 Direct Evaluation vs Variable Binding
:::

::: concept
id: BLK-df4e849b650f07a7
summary: When testing rules that return sets (e.g., warn, deny), the method of accessing results matters:.
digest: e6774b5a0ac24498225099c52158fb57bd6d2b8b78019cf11a833309078d316d
symbol_refs: [warn, deny]
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that When testing rules that return sets (e.g., warn, deny), the method of accessing results matters:..
semantic_categories: [testing]
vector_summary: When testing rules that return sets (e.g., warn, deny), the method of accessing results matters:.
graph_neighbors: [CODE-213aa0a6ee07643a, CODE-efd78ba9916ca447, CODE-141a39bba2be1ded, CODE-031e381b7120fc25, CODE-8ac93f8eb365af28]
graph_degree: 5
graph_two_hop: []
graph_three_hop: []
chapter: CH-05
:::
When testing rules that return sets (e.g., `warn`, `deny`), the method of accessing results matters:
:::

::: concept
id: BLK-0acff6661b16050d
summary: Pattern 1: Direct Evaluation (May Fail).
digest: 7fcd6fdacdee69bc132d74b71338ff4f2cc28f8a99ebf8cd6b4d571370512495
symbol_refs: [Pattern 1: Direct Evaluation (May Fail)]
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Pattern 1: Direct Evaluation (May Fail)..
vector_summary: Pattern 1: Direct Evaluation (May Fail).
graph_neighbors: [TERM-77eaf07b79028829, TERM-2e68e77273483d64]
graph_degree: 2
graph_two_hop: []
graph_three_hop: []
chapter: CH-05
:::
**Pattern 1: Direct Evaluation (May Fail)**
:::

::: concept
id: BLK-7cbd323bc9f94955
summary: Pattern 2: Variable Binding (Recommended).
digest: 12efabe7563fdabfed43e8a53d7363fb30627e7ecf488432e65c41855d353f80
symbol_refs: [Pattern 2: Variable Binding (Recommended)]
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Pattern 2: Variable Binding (Recommended)..
vector_summary: Pattern 2: Variable Binding (Recommended).
chapter: CH-05
:::
**Pattern 2: Variable Binding (Recommended)**
:::

::: concept
id: BLK-cf01220d4f2b5562
summary: Why Variable Binding is Preferred: - Explicit evaluation context: with input as mock_input applies to the rule evaluation, not the count() call - C...
digest: d476163450e9a27ae77e49e9f3fefc2ace3e4f20efac56a13e8a9f86714ed890
symbol_refs: [count(), with input as mock_input, warnings, Why Variable Binding is Preferred:]
semantic_role: warning
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Why Variable Binding is Preferred: - Explicit evaluation context: with input as mock_input applies to the rule evaluation, not the count() call - C....
vector_summary: Why Variable Binding is Preferred: - Explicit evaluation context: with input as mock_input applies to the rule evaluation, not the count() call - C...
graph_neighbors: [TERM-77eaf07b79028829, TERM-2e68e77273483d64]
graph_degree: 2
graph_two_hop: []
graph_three_hop: []
chapter: CH-05
:::
**Why Variable Binding is Preferred:** - Explicit evaluation context: `with input as mock_input` applies to the rule evaluation, not the `count()` call - Clearer semantics: The rule is evaluated with mocked input, then the result is counted - More reliable: Avoids potential evaluation order issues in complex test expressions - Better debugging: Can inspect `warnings` set before counting
:::

::: concept
id: BLK-9bf695cdc0aa522c
summary: 7.8.2 Accessing Set Elements in Tests.
digest: ed60b90d886b3f2672b4a0e7d7ffa24fc8eedad786d5b5f068e79fb414d42951
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that 7.8.2 Accessing Set Elements in Tests..
vector_summary: 7.8.2 Accessing Set Elements in Tests.
chapter: CH-05
:::
7.8.2 Accessing Set Elements in Tests
:::

::: concept
id: BLK-eab8babc80ad3a19
summary: Pattern for Multiple Assertions:.
digest: c1d3d2e08ae4ba3fc56798ba297120350ba666e22213cc70c22d147fae16b679
symbol_refs: [Pattern for Multiple Assertions:]
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Pattern for Multiple Assertions:..
vector_summary: Pattern for Multiple Assertions:.
chapter: CH-05
:::
**Pattern for Multiple Assertions:**
:::

::: concept
id: BLK-33daea6eded19bdb
summary: Test Design Strategy:.
digest: 64226abd7e9e1365612176f41747d1805a4838814e2f7399e28431a825af04b0
symbol_refs: [Test Design Strategy:]
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Test Design Strategy:..
vector_summary: Test Design Strategy:.
chapter: CH-05
:::
**Test Design Strategy:**
:::

::: concept
id: BLK-3cce476e79eee5ee
summary: ________________________________________ 7.9 Case Sensitivity and String Matching in Tests.
digest: d871a9825df27bdffc0fc4e7be6d6eabd3ecc0a9c686d10773153da858abe284
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that ________________________________________ 7.9 Case Sensitivity and String Matching in Tests..
vector_summary: ________________________________________ 7.9 Case Sensitivity and String Matching in Tests.
chapter: CH-05
:::
________________________________________ 7.9 Case Sensitivity and String Matching in Tests
:::

::: concept
id: BLK-8e340303a8cff7d0
summary: The contains() function performs case-sensitive substring matching:.
digest: c5a8c308b0e39321710dde869c56302d2ff3b613d028a31fed4f284fa7889d46
symbol_refs: [contains()]
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that The contains() function performs case-sensitive substring matching:..
vector_summary: The contains() function performs case-sensitive substring matching:.
chapter: CH-05
:::
The `contains()` function performs case-sensitive substring matching:
:::

::: concept
id: BLK-76ca8f44b0c02913
summary: 7.9.2 Mitigation Strategies.
digest: 953bf34000229b2a8a668f430bb2593b29fcecc3b19a2297fba925ea452f4d70
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that 7.9.2 Mitigation Strategies..
vector_summary: 7.9.2 Mitigation Strategies.
chapter: CH-05
:::
7.9.2 Mitigation Strategies
:::

::: concept
id: BLK-67d5c6760b15e129
summary: Option 1: Normalize Test Inputs.
digest: fad8472dc6cabb9854b1c3d05b03285bc813776130de4aa00eb0cc6c241ed3a6
symbol_refs: [Option 1: Normalize Test Inputs]
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Option 1: Normalize Test Inputs..
vector_summary: Option 1: Normalize Test Inputs.
chapter: CH-05
:::
**Option 1: Normalize Test Inputs**
:::

::: concept
id: BLK-2d0d11c237ce14cb
summary: Look for panics, regressions, or surprising allow/deny.
digest: 09f19703a61d761484ba06de3527efcd70e17a7b6d44115593c0b6605c34f477
symbol_refs: []
semantic_role: architecture
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Look for panics, regressions, or surprising allow/deny..
semantic_categories: [testing]
vector_summary: Look for panics, regressions, or surprising allow/deny.
graph_neighbors: [CODE-213aa0a6ee07643a, TERM-7189e73f44e918ef, CODE-efd78ba9916ca447, CODE-141a39bba2be1ded, CODE-8ac93f8eb365af28, CODE-031e381b7120fc25]
graph_degree: 6
graph_two_hop: []
graph_three_hop: []
chapter: CH-05
:::
________________________________________ 7.7 Advanced Testing: Fuzzing & Mutation For high-assurance policies (security, compliance): Fuzzing: Generate random or adversarial JSON inputs. Run opa eval or opa test against them. Look for panics, regressions, or surprising allow/deny. Mutation testing: Mutate policies (flip conditions, remove clauses). Check that test suite fails appropriately. Failing to detect "killed" mutants = missing tests. This is often orchestrated by external tooling (Python/Go harnesses that call OPA), but the principles are Rego-agnostic. ________________________________________ Chapter 8 – OPA Architecture & Integration Patterns This chapter is about where and how you run OPA. ________________________________________ 8.1 The PDP / PEP Split PDP (Policy Decision Point): OPA, evaluating Rego. PEP (Policy Enforcement Point): Your app, proxy, or platform component that: Collects input (HTTP request, Kubernetes object, Terraform plan, CI metadata). Sends it to PDP. Enforces the decision (allow/deny/mutate/log). OPA is only the PDP. The PEP is your responsibility. ________________________________________ 8.2 Deployment Topologies Sidecar / local daemon OPA runs alongside your service, often in the same Pod. Low latency, no network hop beyond localhost. Typical: Envoy external authz → OPA. Kubernetes admission controller → OPA sidecar in same namespace. Central PDP service OPA (or OPA-based service) runs as a central API. Multiple services call it over the network. Tradeoffs: Pros: Single place to manage policies; simpler distribution. Cons: Latency, scalability, SPOF (unless HA), multi-tenant complexity. Library / SDK Embed OPA: Go: github.com/open-policy-agent/opa/rego WASM: compile Rego to WASM and embed in any WASM host (Node, Rust, etc.). Useful for: Client-side enforcement (e.g., in a browser or mobile app). Edge scenarios. ________________________________________ 8.3 Integration Examples Kubernetes (Gatekeeper & friends) Admission review → OPA policy. Rego receives: input.request (raw AdmissionReview). data includes ConstraintTemplates, constraints, reference data. Typical structure: package kubernetes.admission
:::

::: concept
id: BLK-94d881df8f040676
summary: Default allow := false.
digest: 925fe20c397c155dd276a6de96ae2fc02b885e1df68cc4a7420c81bb63add8fb
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Default allow := false..
vector_summary: Default allow := false.
chapter: CH-05
:::
default allow := false
:::

::: concept
id: BLK-226d4d54f908a22c
summary: Allow if { input.attributes.request.http.method == "GET" input.attributes.request.http.path == "/status" } CI/CD – GitHub Actions, GitLab CI, etc.
digest: 85a6e1d42cef6c75bc56921c2c786d02e1f3788fc0aeec7589216165e719cc7c
symbol_refs: []
semantic_role: architecture
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Allow if { input.attributes.request.http.method == "GET" input.attributes.request.http.path == "/status" } CI/CD – GitHub Actions, GitLab CI, etc..
semantic_categories: [distribution, observability]
vector_summary: Allow if { input.attributes.request.http.method == "GET" input.attributes.request.http.path == "/status" } CI/CD – GitHub Actions, GitLab CI, etc.
graph_neighbors: [TERM-77eaf07b79028829, TERM-2e68e77273483d64]
graph_degree: 2
graph_two_hop: []
graph_three_hop: []
chapter: CH-05
:::
allow if { input.attributes.request.http.method == "GET" input.attributes.request.http.path == "/status" } CI/CD – GitHub Actions, GitLab CI, etc. PR/diff metadata → JSON (opa-input.json). OPA evaluates data.compliance. CI interprets deny, warn, override arrays and posts PR comments / fails build. IaC scanning (Terraform, Kubernetes YAML) Terraform plan JSON or Kubernetes manifests as input. Policies check: Public buckets. Unencrypted volumes. Exposed security groups. ________________________________________ 8.4 Multi-layer Policy Architecture on OPA Layers usually look like: Global baseline – org-level security/compliance invariants. Domain policies – per product or platform (e.g., CRM, billing). Team/service policies – localized rules. Tenant overlays – per customer/tenant customizations. Implement via: Multiple bundles merged in OPA. Data-driven toggles (e.g., data.tenants[tenant_id].overrides). Rego evaluation order (e.g., base allow, then deny overlays). ________________________________________ 8.5 OPA as a Policy Mesh In large environments, you might have: Many OPAs running across clusters/namespaces. A central bundle server pushing policies. Decision logs shipped to SIEM / data lake. Rego itself doesn’t change; the architecture around it does. ________________________________________ Chapter 9 – Policy Bundling & Distribution OPA is not just an evaluator; it has a bundle system for shipping policies and data. ________________________________________ 9.1 Bundle Basics A bundle is: A .tar.gz containing: /policies/*.rego /data/*.json (or YAML, etc.) .manifest file with metadata. Example manifest (conceptual): { "revision": "git-sha-1234", "roots": ["authz", "compliance"], "metadata": { "version": "1.2.3", "built_at": "2025-12-05T12:00:00Z" } } OPA config: services: policy: url: https://opa-bundles.example.com
:::

::: concept
id: BLK-e5ca9a3a2bcfb757
summary: _is_admin(user) if "admin" in user.roles.
digest: db89002efbfec0af4de87eb2fbb92799ac5ac4d3d094885b1a4b4fa7153a1458
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that _is_admin(user) if "admin" in user.roles..
vector_summary: _is_admin(user) if "admin" in user.roles.
chapter: CH-05
:::
_is_admin(user) if "admin" in user.roles
:::

::: concept
id: BLK-c25057b8a38b65d8
summary: Jobs: lint: runs-on: ubuntu-latest steps: - uses: actions/checkout@v4.
digest: f98161d7db2aa2b50978f9223c3508028cadee3426fc65e026feeafd7628d6dc
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Jobs: lint: runs-on: ubuntu-latest steps: - uses: actions/checkout@v4..
vector_summary: Jobs: lint: runs-on: ubuntu-latest steps: - uses: actions/checkout@v4.
chapter: CH-05
:::
jobs: lint: runs-on: ubuntu-latest steps: - uses: actions/checkout@v4
:::

::: concept
id: BLK-fb09f96c638665e9
summary: Name: Install Regal run: | curl -sSL https://raw.githubusercontent.com/styrainc/regal/main/install.sh | sh sudo mv regal /usr/local/bin/regal.
digest: 4f27b533fdd564ec3aec8bfd1ac0f422b0a652d96e83c918232c8a2f5960ef56
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Name: Install Regal run: | curl -sSL https://raw.githubusercontent.com/styrainc/regal/main/install.sh | sh sudo mv regal /usr/local/bin/regal..
vector_summary: Name: Install Regal run: | curl -sSL https://raw.githubusercontent.com/styrainc/regal/main/install.sh | sh sudo mv regal /usr/local/bin/regal.
chapter: CH-05
:::
- name: Install Regal run: | curl -sSL https://raw.githubusercontent.com/styrainc/regal/main/install.sh | sh sudo mv regal /usr/local/bin/regal
:::

::: concept
id: BLK-2af9eec9bfb6a27e
summary: # Good: cheap, selective checks first deny[msg] if { input.method == "POST" # cheap size := input.body_size # cheap size > 1e6 # cheap expensive_re...
digest: 32e97bdf697bd043276d0a48c41cb22264879bac2bee715d7a393eec25cac8f6
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that # Good: cheap, selective checks first deny[msg] if { input.method == "POST" # cheap size := input.body_size # cheap size > 1e6 # cheap expensive_re....
vector_summary: # Good: cheap, selective checks first deny[msg] if { input.method == "POST" # cheap size := input.body_size # cheap size > 1e6 # cheap expensive_re...
chapter: CH-05
:::
# Good: cheap, selective checks first deny[msg] if { input.method == "POST" # cheap size := input.body_size # cheap size > 1e6 # cheap expensive_regex_check() # expensive }
:::

::: concept
id: BLK-a55ef7691563b3b5
summary: # Bad: expensive runs for all inputs deny[msg] if { expensive_regex_check() input.method == "POST" } ________________________________________ 11.3 ...
digest: d0c18136b59bc8c9c27611b23cad9dfc3d7bff2623dc176eae057c02987f9f76
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that # Bad: expensive runs for all inputs deny[msg] if { expensive_regex_check() input.method == "POST" } ________________________________________ 11.3 ....
vector_summary: # Bad: expensive runs for all inputs deny[msg] if { expensive_regex_check() input.method == "POST" } ________________________________________ 11.3 ...
chapter: CH-05
:::
# Bad: expensive runs for all inputs deny[msg] if { expensive_regex_check() input.method == "POST" } ________________________________________ 11.3 Index-friendly Data Modeling Given:
:::

::: concept
id: BLK-8ce4a80f2b54bd39
summary: # Bad admins := {u | some u in users; "admin" in u.roles} has_admin if count(admins) > 0 ________________________________________ 11.6 Partial Eval...
digest: 355eb7f1814a1efee2e8ae27b0d24dea318ec6520789bbd01624529401951d47
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that # Bad admins := {u | some u in users; "admin" in u.roles} has_admin if count(admins) > 0 ________________________________________ 11.6 Partial Eval....
semantic_categories: [performance]
vector_summary: # Bad admins := {u | some u in users; "admin" in u.roles} has_admin if count(admins) > 0 ________________________________________ 11.6 Partial Eval...
graph_neighbors: [TERM-77eaf07b79028829, TERM-2e68e77273483d64]
graph_degree: 2
graph_two_hop: []
graph_three_hop: []
chapter: CH-05
:::
# Bad admins := {u | some u in users; "admin" in u.roles} has_admin if count(admins) > 0 ________________________________________ 11.6 Partial Evaluation & Compilation Partial evaluation is like compiling away some of your logic for known inputs. 11.6 Partial Evaluation & WASM Build Modes
:::

::: concept
id: BLK-79fbf7e37836b953
summary: Partial evaluation lets OPA pre-compute parts of a policy given known inputs (e.g., config, topology) and unknown inputs (e.g., request-time data).
digest: a40df4bc9937ad65a9c66d459eabf4116b9dcfba87e08328f01e71ff9c1b8a5b
symbol_refs: []
semantic_role: architecture
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Partial evaluation lets OPA pre-compute parts of a policy given known inputs (e.g., config, topology) and unknown inputs (e.g., request-time data)..
semantic_categories: [performance]
vector_summary: Partial evaluation lets OPA pre-compute parts of a policy given known inputs (e.g., config, topology) and unknown inputs (e.g., request-time data).
graph_neighbors: [TERM-77eaf07b79028829, TERM-2e68e77273483d64]
graph_degree: 2
graph_two_hop: []
graph_three_hop: []
chapter: CH-05
:::
Partial evaluation lets OPA pre-compute parts of a policy given known inputs (e.g., config, topology) and unknown inputs (e.g., request-time data).
:::

::: concept
id: BLK-c4708b67898ef8d9
summary: Two important workflows:.
digest: 73efed25dc16244d85a704e2c93ad79f8992bc6921d89ecc731f8b7ba6b48090
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Two important workflows:..
vector_summary: Two important workflows:.
chapter: CH-05
:::
Two important workflows:
:::

::: concept
id: BLK-30f8a1f3bad5f945
summary: 11.6.1 WASM Compilation (Edge / Embedded).
digest: 76e88bbe0ad5cdd1f9608f0ca3fbf9c6ecd4ba076f933768070aa72b378efe29
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that 11.6.1 WASM Compilation (Edge / Embedded)..
vector_summary: 11.6.1 WASM Compilation (Edge / Embedded).
chapter: CH-05
:::
11.6.1 WASM Compilation (Edge / Embedded)
:::

::: concept
id: BLK-94d092d110d895e4
summary: -t wasm → produce a WebAssembly binary.
digest: 52b746fef0813e65ca82cba4a9b5853469df509c656ad424656e7946538136fd
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that -t wasm → produce a WebAssembly binary..
vector_summary: -t wasm → produce a WebAssembly binary.
chapter: CH-05
:::
-t wasm → produce a WebAssembly binary.
:::

::: concept
id: BLK-c1e7ab5edbc34051
summary: -e 'data.authz.allow' → fix the entrypoint.
digest: ce9c8aa9a7c13ac543b55eef572fadc57e6052979dc2aed9a9964b00eec7fab3
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that -e 'data.authz.allow' → fix the entrypoint..
vector_summary: -e 'data.authz.allow' → fix the entrypoint.
chapter: CH-05
:::
-e 'data.authz.allow' → fix the entrypoint.
:::

::: concept
id: BLK-da13a43f73416bc2
summary: In-process SDKs (Go, Node, etc.).
digest: 02bff77c495778ec777a003343215853837e19669ea9baf37da1c1013ffbe1d5
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that In-process SDKs (Go, Node, etc.)..
vector_summary: In-process SDKs (Go, Node, etc.).
chapter: CH-05
:::
In-process SDKs (Go, Node, etc.)
:::

::: concept
id: BLK-23529cac1f63a029
summary: Edge runtimes or sidecars.
digest: 53e8b93cc638d28603aa293070da8ceff7334f525f175b35404accfd2518c4f9
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Edge runtimes or sidecars..
vector_summary: Edge runtimes or sidecars.
chapter: CH-05
:::
Edge runtimes or sidecars.
:::

::: concept
id: BLK-ad917938449c7e7e
summary: The build process performs internal partial evaluation for the chosen entrypoint and emits an optimized WASM module.
digest: d739cfaada1ae7224c4447e075d7a6176386759807c454f8939f7141ea3ae195
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that The build process performs internal partial evaluation for the chosen entrypoint and emits an optimized WASM module..
semantic_categories: [performance]
vector_summary: The build process performs internal partial evaluation for the chosen entrypoint and emits an optimized WASM module.
graph_neighbors: [TERM-77eaf07b79028829, TERM-2e68e77273483d64]
graph_degree: 2
graph_two_hop: []
graph_three_hop: []
chapter: CH-05
:::
The build process performs internal partial evaluation for the chosen entrypoint and emits an optimized WASM module.
:::

::: concept
id: BLK-ba6adeec0ea6c0dd
summary: 11.6.2 General Partial Evaluation (Bundles / CLI).
digest: 644eaeba9f2c2bea5866cfb2791748a2954b542cbf71554d082c0c522f38707c
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that 11.6.2 General Partial Evaluation (Bundles / CLI)..
semantic_categories: [distribution, performance]
vector_summary: 11.6.2 General Partial Evaluation (Bundles / CLI).
graph_neighbors: [TERM-77eaf07b79028829, TERM-2e68e77273483d64]
graph_degree: 2
graph_two_hop: []
graph_three_hop: []
chapter: CH-05
:::
11.6.2 General Partial Evaluation (Bundles / CLI)
:::

::: concept
id: BLK-524a614cce84f31a
summary: For non-WASM optimization:.
digest: 4c8397b1933d8866e9165e10e596e3d533aa344196ff133899acbccb178dcf8d
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that For non-WASM optimization:..
vector_summary: For non-WASM optimization:.
chapter: CH-05
:::
For non-WASM optimization:
:::

::: concept
id: BLK-923558ff279a8861
summary: Exploratory / ad-hoc partial evaluation:.
digest: 23e5e4e479e6bd5e16ca2b991324e896b66ac320fd01b4966c1c04954cad301e
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Exploratory / ad-hoc partial evaluation:..
semantic_categories: [performance]
vector_summary: Exploratory / ad-hoc partial evaluation:.
graph_neighbors: [TERM-77eaf07b79028829, TERM-2e68e77273483d64]
graph_degree: 2
graph_two_hop: []
graph_three_hop: []
chapter: CH-05
:::
Exploratory / ad-hoc partial evaluation:
:::

::: concept
id: BLK-0d6e5a6876e52458
summary: Lets you inspect how much work can be pre-computed,.
digest: eef0cf2dcbb177e96de85b3bb91828c87bfa57a08a3b940cbc1dd82c3f95c374
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Lets you inspect how much work can be pre-computed,..
vector_summary: Lets you inspect how much work can be pre-computed,.
chapter: CH-05
:::
Lets you inspect how much work can be pre-computed,
:::

::: concept
id: BLK-2f48550b2fa1529c
summary: Is useful for iterative tuning and performance analysis.
digest: 00920b27fe8ce3744295cdf0df86f296f44d15942dfd3148f426f06ddea70b78
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Is useful for iterative tuning and performance analysis..
vector_summary: Is useful for iterative tuning and performance analysis.
chapter: CH-05
:::
Is useful for iterative tuning and performance analysis.
:::

::: concept
id: BLK-e3939d7108ad8277
summary: Some syntactic sugar (arrays, objects, comprehensions) desugar to relational forms.
digest: 6413d81a3392f74d1cb5502deadbff2a6bf9b475086bfcca839332832fc05f1c
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Some syntactic sugar (arrays, objects, comprehensions) desugar to relational forms..
semantic_categories: [theory]
vector_summary: Some syntactic sugar (arrays, objects, comprehensions) desugar to relational forms.
graph_neighbors: [CODE-2cbe0767daa4b7a0]
graph_degree: 1
graph_two_hop: []
graph_three_hop: []
chapter: CH-05
:::
Some syntactic sugar (arrays, objects, comprehensions) desugar to relational forms. Interpretation: An interpretation Iassigns truth values to all ground atoms (e.g., p("alice", "admin")). The meaning of a program Pis the least fixed point of the immediate consequence operator T_P, analogous to classical Datalog. ________________________________________ 12.2 Immediate Consequence Operator & Fixpoint Define T_Pover interpretations: T_P (I)= set of all heads h(t ˉ)such that there exists a rule h(t ˉ)⇐b_1,…,b_nand all b_iare satisfied under I. Iterative construction: I_0=∅I_(k+1)=T_P (I_k)"Eval"(P)=⋃_(k=0)^∞ I_k
:::

::: concept
id: BLK-137908516f846d9b
summary: Because: Herbrand base is finite for a given finite data and bounded terms.
digest: 0b2bb5046bd47b464c464326e392f86a712be18bae0baeb3bb68fb245fca577e
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Because: Herbrand base is finite for a given finite data and bounded terms..
semantic_categories: [negation, theory, unification]
vector_summary: Because: Herbrand base is finite for a given finite data and bounded terms.
chapter: CH-05
:::
Because: Herbrand base is finite for a given finite data and bounded terms. T_Pis monotonic for stratified, positive fragments. → Fixpoint is reached in finite steps. ________________________________________ 12.3 Unification & =, :=, == Unification (=): find a most general unifier (MGU) that makes two terms equal. If both sides partially unbound, unify them structurally. Example: [x, "world"] = ["hello", y] MGU: {x↦"hello",y↦"world"}. Assignment (:=): one-way binding; fails if variable is already bound to a different value. Equality (==): no variable binding; pure comparison. In implementation, OPA uses a mixture of: Unification-like semantics to explore bindings. Assignments and comparisons for clarity and performance in v1 syntax. ________________________________________ 12.4 Negation-as-Failure & Stratification Rego uses NAF (Negation-as-Failure): not p(X) means: “it is not provable that p(X) holds”. Formally: "Eval"(P)⊨"not " p(t)" "⟺" Eval"(P)⊭p(t)
:::

::: concept
id: BLK-cc03bee3c83123fb
summary: The semantics is set union of instances.
digest: 08a7f3a9432a205f10590f1fe9a1e134ab138eea58a9ffdb6debfdcc6905fd4e
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that The semantics is set union of instances..
semantic_categories: [negation, performance]
vector_summary: The semantics is set union of instances.
graph_neighbors: [TERM-77eaf07b79028829, TERM-2e68e77273483d64, CODE-2cbe0767daa4b7a0]
graph_degree: 3
graph_two_hop: []
graph_three_hop: []
chapter: CH-05
:::
The semantics is set union of instances. ________________________________________ 12.6 Complexity of Evaluation Let: ∣D∣= size of data. ∣I∣= size of input. ∣P∣= size (number of rules/clauses) of program. Then: Basic evaluation (no recursion) is polynomial in ∣D∣+∣I∣. General Datalog with negation can be EXPTIME-complete in the worst case, but OPA: Forbids or discourages patterns that would lead to blow-ups. Optimizes with indexing, partial evaluation, grounding. Rule-of-thumb: Flattened, non-recursive Rego with bounded comprehensions behaves like complex SQL queries in terms of complexity. Recursive policies (e.g., graph reachability) behave like graph algorithms. ________________________________________ 12.7 Partial Evaluation Semantics Given: Program P. Known input fragment K⊆(data,input). Define the partial evaluation operator: PE(P,K)→P^'
:::

::: concept
id: BLK-c1c5efdfcf097b54
summary: Such that for all remaining inputs U: "Eval"(P^',U)≡"Eval"(P,K∪U).
digest: 9382f799e268f37955de7ad1d9a26d96ffc066b653d19cdc79f5828e997ee072
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Such that for all remaining inputs U: "Eval"(P^',U)≡"Eval"(P,K∪U)..
vector_summary: Such that for all remaining inputs U: "Eval"(P^',U)≡"Eval"(P,K∪U).
chapter: CH-05
:::
such that for all remaining inputs U: "Eval"(P^',U)≡"Eval"(P,K∪U)
:::

::: concept
id: BLK-91f4730964a13670
summary: Deny[msg] if { resource := input.terraform.resources[_] resource.type == "aws_s3_bucket" resource.acl == "public-read" msg := {"rule_id": __meta__....
digest: 8499eea9a30f51794443d750085c00f22979b8a64a61bdf633454c422a9adac7
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Deny[msg] if { resource := input.terraform.resources[_] resource.type == "aws_s3_bucket" resource.acl == "public-read" msg := {"rule_id": __meta__.....
vector_summary: Deny[msg] if { resource := input.terraform.resources[_] resource.type == "aws_s3_bucket" resource.acl == "public-read" msg := {"rule_id": __meta__....
chapter: CH-05
:::
deny[msg] if { resource := input.terraform.resources[_] resource.type == "aws_s3_bucket" resource.acl == "public-read" msg := {"rule_id": __meta__.rule_id, "msg": "Public S3 bucket forbidden"} } ________________________________________ 13.4 Override Precedence and Combining Layers You need a formal precedence model so people don’t guess. Think in terms of layer priority and decision semantics. 13.4.1 Priority Model Assign numeric ranks to layers: package policy.layers
:::

::: concept
id: BLK-4984619c0e0050a5
summary: Layer_rank := { "global": 100, "domain": 80, "team": 60, "tenant": 40, } Now, each decision includes: • effect: "allow" | "deny" | "override" | "wa...
digest: 7143016e8f0b001aa42672248436cbe67f54f52acff82ae774219073948d7c30
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Layer_rank := { "global": 100, "domain": 80, "team": 60, "tenant": 40, } Now, each decision includes: • effect: "allow" | "deny" | "override" | "wa....
vector_summary: Layer_rank := { "global": 100, "domain": 80, "team": 60, "tenant": 40, } Now, each decision includes: • effect: "allow" | "deny" | "override" | "wa...
graph_neighbors: [CODE-4522197481045bd4, CODEPAT-c4c47ef6c7df1e75, CODEPAT-3f603bb00d12d7e6, CODE-8cd9f756e7ad785f, CODEPAT-ce3111aa333c1369, CODE-704f6e731c295b92, CODE-6fd3a2913e47883e, CODEPAT-e3a1766e8b78df14, CODEPAT-190e5fc8d209ddec, CODE-1b4cef265aa6f5e3, CODEPAT-67fa0ef89ef6b03c, CODEPAT-a00d797a81733169, CODEPAT-f8e30e7deeeb39fa, CODEPAT-90bf40e525478abf, CODE-55a5cc5eed674559]
graph_degree: 15
graph_two_hop: []
graph_three_hop: []
chapter: CH-05
:::
layer_rank := { "global": 100, "domain": 80, "team": 60, "tenant": 40, } Now, each decision includes: • effect: "allow" | "deny" | "override" | "warn" • layer: "global" | "domain" | "team" | "tenant" ________________________________________ 13.4.2 Decision Aggregation Pattern Define a canonical decision document: package decision
:::

::: concept
id: BLK-f7e87b62755ad0fa
summary: Default result := { "allow": false, "effects": [], # list of all hits from all layers }.
digest: fb082d38f978c023fd36652b42b1d58cfb015f75057f3b01c0155d61631408ba
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Default result := { "allow": false, "effects": [], # list of all hits from all layers }..
vector_summary: Default result := { "allow": false, "effects": [], # list of all hits from all layers }.
chapter: CH-05
:::
default result := { "allow": false, "effects": [], # list of all hits from all layers }
:::

::: concept
id: BLK-69c05c427b8cd3f3
summary: # Collect all candidate effects from all packages effects[eff] if { eff := data.global.baseline.effects[_] }.
digest: 71297b72b1ad25a28c999110290cceb1813044b308ee3b89884969b2fa1c8c5b
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that # Collect all candidate effects from all packages effects[eff] if { eff := data.global.baseline.effects[_] }..
vector_summary: # Collect all candidate effects from all packages effects[eff] if { eff := data.global.baseline.effects[_] }.
chapter: CH-05
:::
# Collect all candidate effects from all packages effects[eff] if { eff := data.global.baseline.effects[_] }
:::

::: concept
id: BLK-10a064964dd99bf1
summary: Effects[eff] if { eff := data.domain.crm.authz.effects[_] }.
digest: ca3595a8637058e70baa2abff71ae5ddf1ad369d3fb150e31f81af33465b0aac
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Effects[eff] if { eff := data.domain.crm.authz.effects[_] }..
vector_summary: Effects[eff] if { eff := data.domain.crm.authz.effects[_] }.
chapter: CH-05
:::
effects[eff] if { eff := data.domain.crm.authz.effects[_] }
:::

::: concept
id: BLK-57b5b916a2a46835
summary: Some deny in all_effects deny.effect == "deny" deny.severity == "BLOCK" allow := false }.
digest: 042fc46f8f5ffcd2f36b35422d71b5f8a666982f75895bae1ef641f60612761a
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Some deny in all_effects deny.effect == "deny" deny.severity == "BLOCK" allow := false }..
vector_summary: Some deny in all_effects deny.effect == "deny" deny.severity == "BLOCK" allow := false }.
chapter: CH-05
:::
some deny in all_effects deny.effect == "deny" deny.severity == "BLOCK" allow := false }
:::

::: concept
id: BLK-06a52347059013ef
summary: Base_allow if { data.global.authz.allow }.
digest: 23d1c3c54bb2438e505ce399cd86b11c5f9d7cf164bae98c1745d31a4ae8201c
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Base_allow if { data.global.authz.allow }..
vector_summary: Base_allow if { data.global.authz.allow }.
chapter: CH-05
:::
base_allow if { data.global.authz.allow }
:::

::: concept
id: BLK-8c1040019d74489c
summary: Base_allow if { data.domain.crm.authz.allow }.
digest: 0f10d269683cf61f4ee5efaa0b0d749775db26a82c26eb06bc8f32b5bcc386f9
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Base_allow if { data.domain.crm.authz.allow }..
vector_summary: Base_allow if { data.domain.crm.authz.allow }.
chapter: CH-05
:::
base_allow if { data.domain.crm.authz.allow }
:::

::: concept
id: BLK-b530a84aa5f3112f
summary: Tenant_extra_deny[msg] if { tenant := input.tenant_id eff := data.tenants[tenant].overlays.effects[_] eff.effect == "deny" msg := eff.msg }.
digest: 5b42b850451c45de50fa5449330e0798730c6998001261ea9b614dc4efbf1b10
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Tenant_extra_deny[msg] if { tenant := input.tenant_id eff := data.tenants[tenant].overlays.effects[_] eff.effect == "deny" msg := eff.msg }..
vector_summary: Tenant_extra_deny[msg] if { tenant := input.tenant_id eff := data.tenants[tenant].overlays.effects[_] eff.effect == "deny" msg := eff.msg }.
chapter: CH-05
:::
tenant_extra_deny[msg] if { tenant := input.tenant_id eff := data.tenants[tenant].overlays.effects[_] eff.effect == "deny" msg := eff.msg }
:::

::: concept
id: BLK-52900d5604afced9
summary: Trace_id := input.request.headers["x-request-id"].
digest: 8e343771af9e4d4a1f2e8571f5c65beaa7334b775a27531426aa44f698927116
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Trace_id := input.request.headers["x-request-id"]..
vector_summary: Trace_id := input.request.headers["x-request-id"].
chapter: CH-05
:::
trace_id := input.request.headers["x-request-id"]
:::

::: concept
id: BLK-4eae47b5b88ac30b
summary: Allow if { # ...logic...
digest: 8c4e6d30048406a7a202372076d5ddf72d63f2ac02b6b4d97d481b43b83d53a6
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Allow if { # ...logic....
vector_summary: Allow if { # ...logic...
chapter: CH-05
:::
allow if { # ...logic... }
:::

::: concept
id: BLK-5d68765eb3fb6b23
summary: 15.1 External State for Rate-Limiting & Anomaly Detection.
digest: cff16c980b2076f25fb471b0a75628f07126e14180715155b9d96ef93f7a4b55
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that 15.1 External State for Rate-Limiting & Anomaly Detection..
vector_summary: 15.1 External State for Rate-Limiting & Anomaly Detection.
chapter: CH-05
:::
15.1 External State for Rate-Limiting & Anomaly Detection
:::

::: concept
id: BLK-602cdb4b50a087c9
summary: Example of externally managed login counts:.
digest: 994852af2a2277fc72b31e4764f862444456d27caa19a372d739f5f1df5a3b66
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Example of externally managed login counts:..
vector_summary: Example of externally managed login counts:.
chapter: CH-05
:::
Example of externally managed login counts:
:::

::: concept
id: BLK-d3b7e29e9b95c9dc
summary: # External system populates:.
digest: 75d2ebbdee9c4e061890ebdb8aa5030c88455bcad3b80b2e5d8351d86d98cc56
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that # External system populates:..
vector_summary: # External system populates:.
chapter: CH-05
:::
# External system populates:
:::

::: concept
id: BLK-7c4c29ca27d52d01
summary: # data.state.login_counts = {.
digest: c0ccca441209ed1d22926f4232a6675f0275174b82ba90ee136467dc7785dd8f
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that # data.state.login_counts = {..
vector_summary: # data.state.login_counts = {.
chapter: CH-05
:::
# data.state.login_counts = {
:::

::: concept
id: BLK-881ee9741315002c
summary: # "alice": {"last_5m": 12, "last_1h": 42},.
digest: 43b110e28d1e841f72bec251a33c17f3e8ef4b9a3009b7363933f4670be38bce
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that # "alice": {"last_5m": 12, "last_1h": 42},..
vector_summary: # "alice": {"last_5m": 12, "last_1h": 42},.
chapter: CH-05
:::
# "alice": {"last_5m": 12, "last_1h": 42},
:::

::: concept
id: BLK-0016265f5a3c2c5b
summary: # "bob": {"last_5m": 2, "last_1h": 8},.
digest: 68e5c0aa8fb672c166eb20981e78abe9b343e055e6349fcc0e98111230cec064
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that # "bob": {"last_5m": 2, "last_1h": 8},..
vector_summary: # "bob": {"last_5m": 2, "last_1h": 8},.
chapter: CH-05
:::
# "bob": {"last_5m": 2, "last_1h": 8},
:::

::: concept
id: BLK-044c7de784844b9b
summary: Too_many_logins[user] if { counts := data.state.login_counts[user] counts.last_5m > 10 }.
digest: fdff20cb930b29172a51a9828befb94bea0d06dd93ad9cc220e4ebcef10aa62b
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Too_many_logins[user] if { counts := data.state.login_counts[user] counts.last_5m > 10 }..
vector_summary: Too_many_logins[user] if { counts := data.state.login_counts[user] counts.last_5m > 10 }.
chapter: CH-05
:::
too_many_logins[user] if { counts := data.state.login_counts[user] counts.last_5m > 10 }
:::

::: concept
id: BLK-7fb970abfedb4ed3
summary: A separate component (stream processor, cron job, gateway) periodically:.
digest: 4910e0f8f8ad5427066b0b600fe0f0cd28430840e26845e020753abae3b5a829
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that A separate component (stream processor, cron job, gateway) periodically:..
vector_summary: A separate component (stream processor, cron job, gateway) periodically:.
chapter: CH-05
:::
A separate component (stream processor, cron job, gateway) periodically:
:::

::: concept
id: BLK-301f517072826bc8
summary: Reads raw events (e.g., login attempts),.
digest: a11ed1e006d5e0325689fb2d74bfab1029d346c16ed94f48a322dd0b86be842e
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Reads raw events (e.g., login attempts),..
vector_summary: Reads raw events (e.g., login attempts),.
chapter: CH-05
:::
reads raw events (e.g., login attempts),
:::

::: concept
id: BLK-fa54db274a3f8d73
summary: Aggregates them (windowed counts),.
digest: 5fe91881051fa916f4daacd2e435a7f12fd597cabaf6f1d3f7e9419271561c4e
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Aggregates them (windowed counts),..
vector_summary: Aggregates them (windowed counts),.
chapter: CH-05
:::
aggregates them (windowed counts),
:::

::: concept
id: BLK-c0d4ff0c2c28803e
summary: Publishes a new snapshot to:.
digest: c6c23915931ab0fcfa51d8aac8962c755344e8a77bc998d733f3b51b5bd6411c
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Publishes a new snapshot to:..
vector_summary: Publishes a new snapshot to:.
chapter: CH-05
:::
publishes a new snapshot to:
:::

::: concept
id: BLK-9b773aae56da6674
summary: Think of the pattern:.
digest: 1c0eed490f1ff6c07cf693d9d5016b38d6bb64bcccdae1c8e85c36ba89c42294
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Think of the pattern:..
vector_summary: Think of the pattern:.
chapter: CH-05
:::
Think of the pattern:
:::

::: concept
id: BLK-53fedeb32bc6499b
summary: Events → (Kafka / Kinesis / PubSub / Logs).
digest: 48b59a4fe48c6dbab116c3f0ef4192eec1d7e84f5a3bac56921951ce299f9d27
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Events → (Kafka / Kinesis / PubSub / Logs)..
vector_summary: Events → (Kafka / Kinesis / PubSub / Logs).
chapter: CH-05
:::
Events → (Kafka / Kinesis / PubSub / Logs)
:::

::: concept
id: BLK-a9c9f10372751d58
summary: Aggregator → (Flink / custom job / Lambda).
digest: 2d70e6e484aa123bb84bedf468e5b1bef5d8496ca8e8efa22c8887eaa4b9da72
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Aggregator → (Flink / custom job / Lambda)..
vector_summary: Aggregator → (Flink / custom job / Lambda).
chapter: CH-05
:::
Aggregator → (Flink / custom job / Lambda)
:::

::: concept
id: BLK-79a22ef860c5e85f
summary: State Snapshot → (bundle / data.state.*).
digest: 1be05a42d7d00d3b20f0ac5e9ed423dbc0cababbbbd50b3eb85f2eed5f31bec1
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that State Snapshot → (bundle / data.state.*)..
semantic_categories: [distribution]
vector_summary: State Snapshot → (bundle / data.state.*).
chapter: CH-05
:::
State Snapshot → (bundle / data.state.*)
:::

::: concept
id: BLK-0765a0f81e468faa
summary: Default allow := true.
digest: a27145391660d1518c9fa7ab29971acfb9a060b59a228698c1bcb4a3f058bde2
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Default allow := true..
vector_summary: Default allow := true.
chapter: CH-05
:::
default allow := true
:::

::: concept
id: BLK-e89c971ac66c2591
summary: Deny[msg] if { now := input.now_ns cutoff := now - 5 * 60 * 1e9 # last 5 minutes in ns.
digest: eadd0c0db9ba70185ba6e1f86fc6cb9392320168d40aed5185d8d78220e86f85
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Deny[msg] if { now := input.now_ns cutoff := now - 5 * 60 * 1e9 # last 5 minutes in ns..
vector_summary: Deny[msg] if { now := input.now_ns cutoff := now - 5 * 60 * 1e9 # last 5 minutes in ns.
chapter: CH-05
:::
deny[msg] if { now := input.now_ns cutoff := now - 5 * 60 * 1e9 # last 5 minutes in ns
:::

::: concept
id: BLK-3641c3e33c8e8566
summary: # events: [{"ts": ..., "action": "login_failure", "user": "alice"}, ...] recent_failures := {e | some e in input.events e.user == input.user_id e.a...
digest: c36d3360b4dc9d5d058d6ebef518676cedd0e2b2a53fc0c50cff234b58d01f86
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that # events: [{"ts": ..., "action": "login_failure", "user": "alice"}, ...] recent_failures := {e | some e in input.events e.user == input.user_id e.a....
vector_summary: # events: [{"ts": ..., "action": "login_failure", "user": "alice"}, ...] recent_failures := {e | some e in input.events e.user == input.user_id e.a...
chapter: CH-05
:::
# events: [{"ts": ..., "action": "login_failure", "user": "alice"}, ...] recent_failures := {e | some e in input.events e.user == input.user_id e.action == "login_failure" e.ts >= cutoff }
:::

::: concept
id: BLK-22ea3c1f6e7bd5de
summary: Temporary_allow if { o := data.overrides[input.resource_id] now := time.now_ns() expiry := time.parse_rfc3339_ns(o.expires_at) now < expiry } You e...
digest: c1e2a3a81b08487d00e45b0273c61f8bfb878707526aed29f67de072508139e8
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Temporary_allow if { o := data.overrides[input.resource_id] now := time.now_ns() expiry := time.parse_rfc3339_ns(o.expires_at) now < expiry } You e....
semantic_categories: [authz]
vector_summary: Temporary_allow if { o := data.overrides[input.resource_id] now := time.now_ns() expiry := time.parse_rfc3339_ns(o.expires_at) now < expiry } You e...
graph_neighbors: [CODE-1f681853ebf733fb, CODE-3152b6a89a146d23, CODE-4d2ad0d6df9f48c1, CODE-e3021412b7e801e0, CODE-e8a2139bac84c4a0, CODE-ff0c5e5c7e41a636, CODE-322fb8a04486fb51, CODE-22a3c940e76c1893, CODE-ae589d488d5196d2, CODE-4b643428b4f2edd0, CODE-f9165857ee2c0c68]
graph_degree: 11
graph_two_hop: []
graph_three_hop: []
chapter: CH-05
:::
temporary_allow if { o := data.overrides[input.resource_id] now := time.now_ns() expiry := time.parse_rfc3339_ns(o.expires_at) now < expiry } You encode exceptions in data.overrides, with explicit expiration timestamps. This keeps temporal logic in data, not code. ________________________________________ Chapter 16 – Data Policy Models (GraphQL, APIs, Data Filtering) OPA is particularly strong for data access policies because Rego is JSON-native. This chapter focuses on query-shaped inputs like GraphQL and REST. ________________________________________ 16.1 GraphQL AST Policies When a GraphQL query enters your gateway, you can: 1. Parse it into an AST. 2. Send AST + user context to OPA. 3. Enforce: o Field-level authorization. o Query depth/width limits. o Allowed operations. Example input (simplified): { "user": {"id": "alice", "roles": ["user"]}, "operation": "query", "query": { "name": "GetCustomer", "fields": [ {"path": ["customer", "email"]}, {"path": ["customer", "creditCardNumber"]} ] } } Policy: package gql.authz
:::

::: concept
id: BLK-eae51f08b14c25ab
summary: Default allow := false default violations := [].
digest: 25940778ae0be85b8330e06e3bdd23bf221d726636c1360ced9ae3feb3e6dcad
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Default allow := false default violations := []..
vector_summary: Default allow := false default violations := [].
chapter: CH-05
:::
default allow := false default violations := []
:::

::: concept
id: BLK-96cfa439c2ca2a38
summary: # data.gql.allowed_fields = {.
digest: 9a4674f00e1fa5887c6093e366dcf43970b2dcefa538d052122705a277c9a9f7
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that # data.gql.allowed_fields = {..
vector_summary: # data.gql.allowed_fields = {.
chapter: CH-05
:::
# data.gql.allowed_fields = {
:::

::: concept
id: BLK-8bb9ccc71d144b2c
summary: # "customer": ["id", "name", "email"].
digest: 44a7a3947e6e10f5370d8cb78a46c4808ad7b2af010060a0a98276de210f1f0d
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that # "customer": ["id", "name", "email"]..
vector_summary: # "customer": ["id", "name", "email"].
chapter: CH-05
:::
# "customer": ["id", "name", "email"]
:::

::: concept
id: BLK-476ba186ec97144b
summary: # "customer": ["*", "creditCardNumber"].
digest: fb5c31b70349f23ebe644a0d5ed4413bc8e80246039b31e3cda51f239f89df5c
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that # "customer": ["*", "creditCardNumber"]..
vector_summary: # "customer": ["*", "creditCardNumber"].
chapter: CH-05
:::
# "customer": ["*", "creditCardNumber"]
:::

::: concept
id: BLK-708c71e7c73e35f2
summary: Role := r if { r := input.user.roles[_] }.
digest: 04226b8568d12aa7f153592d2a76ff456fc495cc63b4b44da7c330ee5b463953
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Role := r if { r := input.user.roles[_] }..
vector_summary: Role := r if { r := input.user.roles[_] }.
chapter: CH-05
:::
role := r if { r := input.user.roles[_] }
:::

::: concept
id: BLK-b8ae9bf60f3a1989
summary: # Check each requested field violations contains v if { f := input.query.fields[_] path := f.path # ["customer", "creditCardNumber"].
digest: 5805bdfe2ba6c2a4877f0b5c8f182737c4ff96390f61c4d0c145322240d4a475
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that # Check each requested field violations contains v if { f := input.query.fields[_] path := f.path # ["customer", "creditCardNumber"]..
vector_summary: # Check each requested field violations contains v if { f := input.query.fields[_] path := f.path # ["customer", "creditCardNumber"].
chapter: CH-05
:::
# Check each requested field violations contains v if { f := input.query.fields[_] path := f.path # ["customer", "creditCardNumber"]
:::

::: concept
id: BLK-492bd318f6c337d0
summary: Resource := path[0] field := path[1].
digest: 0ecb886fe064571236de6ec651178a5b3c604dcb2a3e298da467510830cc9a6b
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Resource := path[0] field := path[1]..
vector_summary: Resource := path[0] field := path[1].
chapter: CH-05
:::
resource := path[0] field := path[1]
:::

::: concept
id: BLK-adc62466f65013a1
summary: Not field_allowed(role, resource, field).
digest: 13561d1e2cb0be85c871e88b70c4a06cc8d5fe281320a0d91fc73fb6812edf8f
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Not field_allowed(role, resource, field)..
vector_summary: Not field_allowed(role, resource, field).
chapter: CH-05
:::
not field_allowed(role, resource, field)
:::

::: concept
id: BLK-6fd70c9d544e887a
summary: V := { "path": path, "msg": sprintf("Field %v not allowed for role %v", [path, role]), } }.
digest: b118a156b79d71be6259fa0d968974305c58a2b8e014a90953fd5fffaaa711ae
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that V := { "path": path, "msg": sprintf("Field %v not allowed for role %v", [path, role]), } }..
vector_summary: V := { "path": path, "msg": sprintf("Field %v not allowed for role %v", [path, role]), } }.
chapter: CH-05
:::
v := { "path": path, "msg": sprintf("Field %v not allowed for role %v", [path, role]), } }
:::

::: concept
id: BLK-137c2fd546a4d073
summary: Field_allowed(role, resource, field) if { allowed := data.gql.allowed_fields[role][resource] allowed[_] == "*" # wildcard }.
digest: 09a26f2f2cb019da4e07972dd55efcac275f6a7afa21c7c95c616dd3f88ebd8e
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Field_allowed(role, resource, field) if { allowed := data.gql.allowed_fields[role][resource] allowed[_] == "*" # wildcard }..
vector_summary: Field_allowed(role, resource, field) if { allowed := data.gql.allowed_fields[role][resource] allowed[_] == "*" # wildcard }.
chapter: CH-05
:::
field_allowed(role, resource, field) if { allowed := data.gql.allowed_fields[role][resource] allowed[_] == "*" # wildcard }
:::

::: concept
id: BLK-2c687b2f253cfbe4
summary: Field_allowed(role, resource, field) if { allowed := data.gql.allowed_fields[role][resource] field in allowed }.
digest: a0e030479f93cc6b260182e49c179817a1f007b19b0bf99d29b7f15956ebf406
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Field_allowed(role, resource, field) if { allowed := data.gql.allowed_fields[role][resource] field in allowed }..
vector_summary: Field_allowed(role, resource, field) if { allowed := data.gql.allowed_fields[role][resource] field in allowed }.
chapter: CH-05
:::
field_allowed(role, resource, field) if { allowed := data.gql.allowed_fields[role][resource] field in allowed }
:::

::: concept
id: BLK-d016298bd014580e
summary: This chapter covers structural data policies and cost-based models, especially for GraphQL.
digest: bd55e5cb878e8d941192c395b44d2456909a2812eec677ef4145224c7b5a305f
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that This chapter covers structural data policies and cost-based models, especially for GraphQL..
vector_summary: This chapter covers structural data policies and cost-based models, especially for GraphQL.
chapter: CH-05
:::
This chapter covers structural data policies and cost-based models, especially for GraphQL.
:::

::: concept
id: BLK-e32fefe6aa6f262a
summary: Suppose you maintain per-field costs in data.gql.field_costs:.
digest: b3f153c390bf6a8225e77b86116ebfb9405d0b2b99f55f509408e258ea4bbc7b
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Suppose you maintain per-field costs in data.gql.field_costs:..
vector_summary: Suppose you maintain per-field costs in data.gql.field_costs:.
chapter: CH-05
:::
Suppose you maintain per-field costs in data.gql.field_costs:
:::

::: concept
id: BLK-e73b9199be66d077
summary: # data.gql.field_costs = {.
digest: 7eb9134dec90aea961f9252715345334f6208ba141ddde92512b7c6150727a52
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that # data.gql.field_costs = {..
vector_summary: # data.gql.field_costs = {.
chapter: CH-05
:::
# data.gql.field_costs = {
:::

::: concept
id: BLK-29afb65bc79a3e3b
summary: # "Query.users.email": 2,.
digest: c84d0fb959246a3bc259c3ac793c0094845577becbae187f990e4f1f15bc32b3
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that # "Query.users.email": 2,..
vector_summary: # "Query.users.email": 2,.
chapter: CH-05
:::
# "Query.users.email": 2,
:::

::: concept
id: BLK-da9d1cf4f0f47cfe
summary: # "Query.users.orders": 3,.
digest: ed2d1a0fa52cf09d678a8cabbd9b7f1fd436b91dcf3486f5ffd17bf39b351990
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that # "Query.users.orders": 3,..
vector_summary: # "Query.users.orders": 3,.
chapter: CH-05
:::
# "Query.users.orders": 3,
:::

::: concept
id: BLK-6d1f67793e063be6
summary: You want to compute a cost for each field given its path and leaf name.
digest: b5bb8de549d0fee17250a6baf1f702209c9b860e0f9d2d0ac1007e1555cc830d
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that You want to compute a cost for each field given its path and leaf name..
vector_summary: You want to compute a cost for each field given its path and leaf name.
chapter: CH-05
:::
You want to compute a cost for each field given its path and leaf name.
:::

::: concept
id: BLK-2e2e66e96d2b3f2e
summary: # field_cost([path, field]) := c.
digest: 200bee63745e897f5751ce092cd2127c5cfbbaa532380056c00e306d43fe1fe8
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that # field_cost([path, field]) := c..
vector_summary: # field_cost([path, field]) := c.
chapter: CH-05
:::
# field_cost([path, field]) := c
:::

::: concept
id: BLK-96475ac62d55d092
summary: # path = ["Query", "users"].
digest: 50ab1d4c1bcdf637b786e166dd03942ef62d2de10975632656552d35dd02578f
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that # path = ["Query", "users"]..
vector_summary: # path = ["Query", "users"].
chapter: CH-05
:::
# path = ["Query", "users"]
:::

::: concept
id: BLK-1d1bce0ed2b5d5f2
summary: # full = "Query.users.email".
digest: 3f0072153700f576b7460e78b4d3bf1d3841d51412c24f08e6ff37ff186993d3
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that # full = "Query.users.email"..
vector_summary: # full = "Query.users.email".
chapter: CH-05
:::
# full = "Query.users.email"
:::

::: concept
id: BLK-177acd5879ae1eb5
summary: Field_cost([path, field]) := c if { full := concat(".", array.concat(path, [field])) c := data.gql.field_costs[full] }.
digest: c425851a28eff033bbd76c06456eb8e2ddd8b7bd212d89e269c9c372513319d1
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Field_cost([path, field]) := c if { full := concat(".", array.concat(path, [field])) c := data.gql.field_costs[full] }..
vector_summary: Field_cost([path, field]) := c if { full := concat(".", array.concat(path, [field])) c := data.gql.field_costs[full] }.
chapter: CH-05
:::
field_cost([path, field]) := c if { full := concat(".", array.concat(path, [field])) c := data.gql.field_costs[full] }
:::

::: concept
id: BLK-073cbe3299458fca
summary: Use array.concat(path, [field]), not a non-existent append builtin.
digest: 2ef7020827982543af5f342716b873ffce1929fa6be239c8dc455fc697b66967
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Use array.concat(path, [field]), not a non-existent append builtin..
vector_summary: Use array.concat(path, [field]), not a non-existent append builtin.
chapter: CH-05
:::
Use array.concat(path, [field]), not a non-existent append builtin.
:::

::: concept
id: BLK-3f86fc771487f729
summary: Array.concat([1, 2], [3]) = [1, 2, 3].
digest: 8274c9b3c8d13fa16e7bf066bb1924fbf776bceb2586093e7050079131d44367
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Array.concat([1, 2], [3]) = [1, 2, 3]..
vector_summary: Array.concat([1, 2], [3]) = [1, 2, 3].
chapter: CH-05
:::
array.concat([1, 2], [3]) = [1, 2, 3].
:::

::: concept
id: BLK-daffda34523491fc
summary: Safe_field_cost([path, field]) := c if { is_array(path) is_string(field) full := concat(".", array.concat(path, [field])) c := data.gql.field_costs...
digest: d8042695ddcc2352478afda67cd8f6b240f185b20245624e542e683c267305d9
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Safe_field_cost([path, field]) := c if { is_array(path) is_string(field) full := concat(".", array.concat(path, [field])) c := data.gql.field_costs....
vector_summary: Safe_field_cost([path, field]) := c if { is_array(path) is_string(field) full := concat(".", array.concat(path, [field])) c := data.gql.field_costs...
chapter: CH-05
:::
safe_field_cost([path, field]) := c if { is_array(path) is_string(field) full := concat(".", array.concat(path, [field])) c := data.gql.field_costs[full] }
:::

::: concept
id: BLK-d766db30ebdfc849
summary: This function can be used inside a comprehension that walks a GraphQL AST:
digest: bf104acdd36da6af9f79b5119721c8a7dbdf4232051e5316c00ea6f711edfd31
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that This function can be used inside a comprehension that walks a GraphQL AST:.
vector_summary: This function can be used inside a comprehension that walks a GraphQL AST:
graph_neighbors: [CODE-2cbe0767daa4b7a0]
graph_degree: 1
graph_two_hop: []
graph_three_hop: []
chapter: CH-05
:::
This function can be used inside a comprehension that walks a GraphQL AST:
:::

::: concept
id: BLK-6b73a05c5f7af41e
summary: Total_cost := sum({ c | some i field := input.gql.fields[i] path := field.path # e.g., ["Query", "users"] name := field.name # e.g., "email" c := f...
digest: 267e7bdbd5a0cf21d8ae609cd8231ac6966c09785c6daba809eb6b71988878c2
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Total_cost := sum({ c | some i field := input.gql.fields[i] path := field.path # e.g., ["Query", "users"] name := field.name # e.g., "email" c := f....
vector_summary: Total_cost := sum({ c | some i field := input.gql.fields[i] path := field.path # e.g., ["Query", "users"] name := field.name # e.g., "email" c := f...
chapter: CH-05
:::
total_cost := sum({ c | some i field := input.gql.fields[i] path := field.path # e.g., ["Query", "users"] name := field.name # e.g., "email" c := field_cost([path, name]) })
:::

::: concept
id: BLK-95369408c55face3
summary: A compositional cost model (paths + leaves).
digest: d580de4ba5fb02baed0209db6910f9e048be45fb47f755c5592eb6ad86a6cc3d
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that A compositional cost model (paths + leaves)..
vector_summary: A compositional cost model (paths + leaves).
chapter: CH-05
:::
A compositional cost model (paths + leaves).
:::

::: concept
id: BLK-e23b8f98ae17ad67
summary: Defensive concatenation.
digest: d597e9d8bb818c46822fdd29ab8101a89e1ce6f218cc12d3bee70e9320ba445c
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Defensive concatenation..
vector_summary: Defensive concatenation.
chapter: CH-05
:::
Defensive concatenation.
:::

::: concept
id: BLK-95a4d919e71a1c12
summary: A clean hook for enforcing query limits:.
digest: 9a3455871c486dd7d4207697f1835ae993ae66d440c4799baee38c73fe44e625
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that A clean hook for enforcing query limits:..
vector_summary: A clean hook for enforcing query limits:.
chapter: CH-05
:::
A clean hook for enforcing query limits:
:::

::: concept
id: BLK-b9edbad05e484b05
summary: Deny_reason := sprintf("GraphQL query too expensive: cost=%v", [total_cost]) if { total_cost > data.gql.max_cost }.
digest: b2c80912bff26ffa976f7f8bd6477078c935d12395f1195e61a874229d36f1fd
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Deny_reason := sprintf("GraphQL query too expensive: cost=%v", [total_cost]) if { total_cost > data.gql.max_cost }..
vector_summary: Deny_reason := sprintf("GraphQL query too expensive: cost=%v", [total_cost]) if { total_cost > data.gql.max_cost }.
chapter: CH-05
:::
deny_reason := sprintf("GraphQL query too expensive: cost=%v", [total_cost]) if { total_cost > data.gql.max_cost }
:::

::: concept
id: BLK-f3552229f486fc05
summary: ________________________________________ 16.3 REST / SQL / Data Filtering For REST APIs, you can: 1.
digest: 519390d7b1ba4c8b4c79ea1ddf9442ace97b561e97272efdf29c0cb856d4363f
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that ________________________________________ 16.3 REST / SQL / Data Filtering For REST APIs, you can: 1..
vector_summary: ________________________________________ 16.3 REST / SQL / Data Filtering For REST APIs, you can: 1.
chapter: CH-05
:::
________________________________________ 16.3 REST / SQL / Data Filtering For REST APIs, you can: 1. Treat the request as input: method, path, query params, body. 2. Output a filter document: 3. { 4. "where": { 5. "tenant_id": "tenant-123", 6. "visibility": ["public", "shared_with_user"] 7. } 8. } 9. The service uses that filter to generate SQL. Example: package datafilter
:::

::: concept
id: BLK-393f7de2a0c944c2
summary: Default filter := {}.
digest: f50655a9046041c16387cfada223e754ade5db4fc7c9937b6cb5198a070d2f04
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Default filter := {}..
vector_summary: Default filter := {}.
chapter: CH-05
:::
default filter := {}
:::

::: concept
id: BLK-fbf68ce59d9c01f8
summary: Filter := { "tenant_id": input.tenant_id, "allowed_status": allowed_statuses, } if { user := input.user allowed_statuses := statuses_for(user) }.
digest: 51c2b60cf537b9aae48b0183fceba0298dca4cf9c183fbd44b1c8eec45ec1b6b
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Filter := { "tenant_id": input.tenant_id, "allowed_status": allowed_statuses, } if { user := input.user allowed_statuses := statuses_for(user) }..
vector_summary: Filter := { "tenant_id": input.tenant_id, "allowed_status": allowed_statuses, } if { user := input.user allowed_statuses := statuses_for(user) }.
chapter: CH-05
:::
filter := { "tenant_id": input.tenant_id, "allowed_status": allowed_statuses, } if { user := input.user allowed_statuses := statuses_for(user) }
:::

::: concept
id: BLK-2ee574aac09ad686
summary: Statuses_for(user) := {"active", "pending"} if { "admin" in user.roles }.
digest: c5e723183ede8b4a194a288096d359aaf6f05538219bb99090cd3561b6c654b5
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Statuses_for(user) := {"active", "pending"} if { "admin" in user.roles }..
vector_summary: Statuses_for(user) := {"active", "pending"} if { "admin" in user.roles }.
chapter: CH-05
:::
statuses_for(user) := {"active", "pending"} if { "admin" in user.roles }
:::

::: concept
id: BLK-85a476063d06921f
summary: [x, "world"] = ["hello", y].
digest: 60db3675ec37b4c23ce1a9b40903bfc9c953a01bdc9b6fef116ac7a402da3e6a
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that [x, "world"] = ["hello", y]..
vector_summary: [x, "world"] = ["hello", y].
chapter: CH-05
:::
[x, "world"] = ["hello", y]
:::

::: concept
id: BLK-2c5e711e15ee03f4
summary: # => x = "hello", y = "world" ________________________________________ 18.3 Collections • Array: [1, 2, 3] • Set: {1, 2, 3} (unordered, unique) • O...
digest: 5b11612898e7c9221c1af48f70c5f7aaf1c14b9f43c9d6b5955099b8572ac079
symbol_refs: [set(), {}]
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that # => x = "hello", y = "world" ________________________________________ 18.3 Collections • Array: [1, 2, 3] • Set: {1, 2, 3} (unordered, unique) • O....
vector_summary: # => x = "hello", y = "world" ________________________________________ 18.3 Collections • Array: [1, 2, 3] • Set: {1, 2, 3} (unordered, unique) • O...
chapter: CH-05
:::
# => x = "hello", y = "world" ________________________________________ 18.3 Collections • Array: [1, 2, 3] • Set: {1, 2, 3} (unordered, unique) • Object: {"k": 1, "v": 2} Special: • Empty set: `{}` (not `set()`, which is a type conversion function requiring an argument) • Empty object: `{}`
:::

::: concept
id: BLK-e0278fba1f055245
summary: Chapter 3 – Evaluation Flow (Diagram) 3.X Evaluation Flow: From Request to Decision.
digest: 65b75dd0f8a22149adfec15aaacd64e77769b49f64e3c28c5941e7ebc2fd2aaa
symbol_refs: []
semantic_role: decision-flow
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Chapter 3 – Evaluation Flow (Diagram) 3.X Evaluation Flow: From Request to Decision..
vector_summary: Chapter 3 – Evaluation Flow (Diagram) 3.X Evaluation Flow: From Request to Decision.
graph_neighbors: [TERM-77eaf07b79028829, TERM-2e68e77273483d64]
graph_degree: 2
graph_two_hop: []
graph_three_hop: []
chapter: CH-05
:::
Chapter 3 – Evaluation Flow (Diagram) 3.X Evaluation Flow: From Request to Decision
:::

::: concept
id: BLK-7572efde313bc676
summary: Subgraph POLICIES & DATA C D end.
digest: e9760cd6e15e1d468a7552378e8aaeed8c9b62240f93c5b82bc47a6e7f293707
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Subgraph POLICIES & DATA C D end..
vector_summary: Subgraph POLICIES & DATA C D end.
chapter: CH-05
:::
subgraph POLICIES & DATA C D end
:::

::: concept
id: BLK-f623d12ad47f73ed
summary: Subgraph INPUTS B end.
digest: a31f3f038a07b068659ba8fd8a7abfce2dc45a13386fc8cee236c0cb4f90e9db
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Subgraph INPUTS B end..
vector_summary: Subgraph INPUTS B end.
chapter: CH-05
:::
subgraph INPUTS B end
:::

::: concept
id: BLK-b0acb177781b0063
summary: F -->|JSON Response| A.
digest: 3a91481890d7329e791ebe55d05c141990187ee10da30f3aaa3f7699bd0e5fcd
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that F -->|JSON Response| A..
vector_summary: F -->|JSON Response| A.
chapter: CH-05
:::
F -->|JSON Response| A
:::

::: concept
id: BLK-74371f1f90bb0e83
summary: A more detailed view that includes partial evaluation and decision logging:.
digest: c2eb16836123e4d2a1a7d390ac59b73882bc2d7cfb1f49ef72d9f4926a0b585b
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that A more detailed view that includes partial evaluation and decision logging:..
semantic_categories: [observability, performance]
vector_summary: A more detailed view that includes partial evaluation and decision logging:.
graph_neighbors: [TERM-77eaf07b79028829, TERM-2e68e77273483d64]
graph_degree: 2
graph_two_hop: []
graph_three_hop: []
chapter: CH-05
:::
A more detailed view that includes partial evaluation and decision logging:
:::

::: concept
id: BLK-d20e8dfa86879fc7
summary: Subgraph Data Layer B1[Bundles] --> LD[Load Data into data.*] DS[Dynamic Data APIs] --> LD end.
digest: 24f16d66f4471689e601574ede426ba4a545cd803b9a337aa4b6b43d1a5e69be
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Subgraph Data Layer B1[Bundles] --> LD[Load Data into data.*] DS[Dynamic Data APIs] --> LD end..
semantic_categories: [distribution]
vector_summary: Subgraph Data Layer B1[Bundles] --> LD[Load Data into data.*] DS[Dynamic Data APIs] --> LD end.
chapter: CH-05
:::
subgraph Data Layer B1[Bundles] --> LD[Load Data into data.*] DS[Dynamic Data APIs] --> LD end
:::

::: concept
id: BLK-30ddfd3dd392bd32
summary: LD --> EV[Evaluate Query] D1 --> EV R --> EV.
digest: aac56bd77b17af75f9a13ec327f052ae962286a881d4d0b0614a9ba92a819c5a
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that LD --> EV[Evaluate Query] D1 --> EV R --> EV..
vector_summary: LD --> EV[Evaluate Query] D1 --> EV R --> EV.
chapter: CH-05
:::
LD --> EV[Evaluate Query] D1 --> EV R --> EV
:::

::: concept
id: BLK-2e5f3039527c7503
summary: EV --> RES[Decision Document] EV --> LOG[Decision Log Event].
digest: 6e4186507dbaaa9b4697c91909f2874194e42d3e76139520e7a831fa4548ebab
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that EV --> RES[Decision Document] EV --> LOG[Decision Log Event]..
semantic_categories: [observability]
vector_summary: EV --> RES[Decision Document] EV --> LOG[Decision Log Event].
chapter: CH-05
:::
EV --> RES[Decision Document] EV --> LOG[Decision Log Event]
:::

::: concept
id: BLK-d495a3815b3b05b9
summary: RES --> SVC[Caller / Service] LOG --> COL[Log Collector / Sidecar] --> OBS[SIEM / APM / Data Lake].
digest: d4bbde9201a71aed5bad469a1e1d4268a293840fedeccdb19bcbd8687afb9669
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that RES --> SVC[Caller / Service] LOG --> COL[Log Collector / Sidecar] --> OBS[SIEM / APM / Data Lake]..
vector_summary: RES --> SVC[Caller / Service] LOG --> COL[Log Collector / Sidecar] --> OBS[SIEM / APM / Data Lake].
chapter: CH-05
:::
RES --> SVC[Caller / Service] LOG --> COL[Log Collector / Sidecar] --> OBS[SIEM / APM / Data Lake]
:::

::: concept
id: BLK-35f656550b066ee3
summary: Policies are parsed and compiled once; optional partial evaluation moves static work out of the hot path.
digest: cc8dab99ebb6d5960b107aeb77b80870ce06a89739ceb361ebf02ccddf193323
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Policies are parsed and compiled once; optional partial evaluation moves static work out of the hot path..
semantic_categories: [performance]
vector_summary: Policies are parsed and compiled once; optional partial evaluation moves static work out of the hot path.
graph_neighbors: [TERM-77eaf07b79028829, TERM-2e68e77273483d64]
graph_degree: 2
graph_two_hop: []
graph_three_hop: []
chapter: CH-05
:::
Policies are parsed and compiled once; optional partial evaluation moves static work out of the hot path.
:::

::: concept
id: BLK-e06cf468a4849f5c
summary: Data from bundles and dynamic sources is loaded into data.*.
digest: 7ce90f39a7e68f97a3881cddca8d59c5c652e5c2308dcfefb1ea694040f598e7
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Data from bundles and dynamic sources is loaded into data.*..
semantic_categories: [distribution]
vector_summary: Data from bundles and dynamic sources is loaded into data.*.
chapter: CH-05
:::
Data from bundles and dynamic sources is loaded into data.*.
:::

::: concept
id: BLK-f223eb01cf8eba29
summary: Each incoming request passes input + compiled policies + current data snapshot into the evaluator.
digest: e7e1b8c0e3d762afc97483e1408a612121879cd054d7154b7634b9751a2524de
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Each incoming request passes input + compiled policies + current data snapshot into the evaluator..
vector_summary: Each incoming request passes input + compiled policies + current data snapshot into the evaluator.
chapter: CH-05
:::
Each incoming request passes input + compiled policies + current data snapshot into the evaluator.
:::

::: concept
id: BLK-312401e4a78cb757
summary: The evaluator returns a structured decision document and emits decision logs for observability and audits.
digest: ef2c6365d4a93392f81ed13aa04302f13a42fa77faf43b77c07227123647730f
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that The evaluator returns a structured decision document and emits decision logs for observability and audits..
semantic_categories: [observability]
vector_summary: The evaluator returns a structured decision document and emits decision logs for observability and audits.
chapter: CH-05
:::
The evaluator returns a structured decision document and emits decision logs for observability and audits.
:::

::: concept
id: BLK-b172f82260025d9b
summary: Chapter 8 – Deployment Topologies (Sidecar vs Central vs Embedded) 8.X Topology Overview Diagram.
digest: 66041c9a1c50fa65b6fe9c920756ca2b83e811d5bdec2d8c237be6d184d5dd97
symbol_refs: []
semantic_role: architecture
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Chapter 8 – Deployment Topologies (Sidecar vs Central vs Embedded) 8.X Topology Overview Diagram..
vector_summary: Chapter 8 – Deployment Topologies (Sidecar vs Central vs Embedded) 8.X Topology Overview Diagram.
chapter: CH-05
:::
Chapter 8 – Deployment Topologies (Sidecar vs Central vs Embedded) 8.X Topology Overview Diagram
:::

::: concept
id: BLK-b19700b3080dc69c
summary: Low latency (localhost).
digest: 6230cf0f36423d487d2386c3a2d240eba539ec1d100ce839ec02f66840b34707
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Low latency (localhost)..
vector_summary: Low latency (localhost).
chapter: CH-05
:::
Low latency (localhost).
:::

::: concept
id: BLK-37b6ab540b493df4
summary: Good for microservices and per-tenant tuning.
digest: e43180737fb82fa60cf3f5ff5ef05c5bf8e88b4e7fcb222994835ec2e1493ddb
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Good for microservices and per-tenant tuning..
vector_summary: Good for microservices and per-tenant tuning.
chapter: CH-05
:::
Good for microservices and per-tenant tuning.
:::

::: concept
id: BLK-2c956a537c865bff
summary: Great for shared policies and simple clients (like Nginx, legacy apps).
digest: 797b47cc976f4ae1e2f45dfbc7d3f89f4cdc2896f2847635e0267a0cd5fd5a02
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Great for shared policies and simple clients (like Nginx, legacy apps)..
vector_summary: Great for shared policies and simple clients (like Nginx, legacy apps).
chapter: CH-05
:::
Great for shared policies and simple clients (like Nginx, legacy apps).
:::

::: concept
id: BLK-7984539227277d1e
summary: No extra HTTP hop; ideal for edge, FaaS, or latency-critical paths.
digest: 0983b97011d3c4e72af24c875a60e413f71e70cf1b4d71d662f438aab95d2546
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that No extra HTTP hop; ideal for edge, FaaS, or latency-critical paths..
vector_summary: No extra HTTP hop; ideal for edge, FaaS, or latency-critical paths.
chapter: CH-05
:::
No extra HTTP hop; ideal for edge, FaaS, or latency-critical paths.
:::

::: concept
id: BLK-c6a16c819faf270c
summary: N --> Q[Final Decision].
digest: d0505589b7ced9e8ef4d99e6f997116686b9821d0a85fe80c55f2bf1c8d74e5b
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that N --> Q[Final Decision]..
vector_summary: N --> Q[Final Decision].
chapter: CH-05
:::
N --> Q[Final Decision]
:::

::: concept
id: BLK-ac0efa57c504e47d
summary: Domain: Variants per product/region (e.g., EU vs US data rules).
digest: 97f93dc4d29052c6c1a70923e9ea18f53bf0fe4237dc745f652d68a4b14b4f4b
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Domain: Variants per product/region (e.g., EU vs US data rules)..
vector_summary: Domain: Variants per product/region (e.g., EU vs US data rules).
chapter: CH-05
:::
Domain: Variants per product/region (e.g., EU vs US data rules).
:::

::: concept
id: BLK-9b47d89fb37632a4
summary: Team: Service-specific routes/resources (e.g., /billing/* vs /analytics/*).
digest: d30dc4b350bfda462e9cbfb0da2e50fb7688bd2843f30fc785c2417649e33527
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Team: Service-specific routes/resources (e.g., /billing/* vs /analytics/*)..
vector_summary: Team: Service-specific routes/resources (e.g., /billing/* vs /analytics/*).
chapter: CH-05
:::
Team: Service-specific routes/resources (e.g., /billing/* vs /analytics/*).
:::

::: concept
id: BLK-be239d14ac089893
summary: Tenant: Overrides and feature flags per customer (e.g., stricter IP allowlists).
digest: 41b7bb488b91ceb0012ae3be2d68f60cae1f1c12a49486824517c5c9dda67a4e
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Tenant: Overrides and feature flags per customer (e.g., stricter IP allowlists)..
vector_summary: Tenant: Overrides and feature flags per customer (e.g., stricter IP allowlists).
chapter: CH-05
:::
Tenant: Overrides and feature flags per customer (e.g., stricter IP allowlists).
:::

::: concept
id: BLK-fb9f85c09a41dacf
summary: 13.X.1 Layered Evaluation Example package authz.
digest: 1bdf889db7b032bc7091663577a5fbe5454eecb9b480d22732cc007ac46a34e0
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that 13.X.1 Layered Evaluation Example package authz..
vector_summary: 13.X.1 Layered Evaluation Example package authz.
graph_neighbors: [TERM-77eaf07b79028829, TERM-2e68e77273483d64]
graph_degree: 2
graph_two_hop: []
graph_three_hop: []
chapter: CH-05
:::
13.X.1 Layered Evaluation Example package authz
:::

::: concept
id: BLK-a6ad7c1547585e40
summary: # Global: no public write operations global_deny[reason] if { input.method == "POST" input.path == [ "public", _ ] reason := "Global: public writes...
digest: e326c92cebdb182728e55cef9e6bc19b0f82ab2b5b1208792dfc1cbcc8b82df2
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that # Global: no public write operations global_deny[reason] if { input.method == "POST" input.path == [ "public", _ ] reason := "Global: public writes....
vector_summary: # Global: no public write operations global_deny[reason] if { input.method == "POST" input.path == [ "public", _ ] reason := "Global: public writes...
chapter: CH-05
:::
# Global: no public write operations global_deny[reason] if { input.method == "POST" input.path == [ "public", _ ] reason := "Global: public writes forbidden" }
:::

::: concept
id: BLK-c37d51b33f8c33c7
summary: # Tenant: per-tenant overrides tenant_allow[reason] if { input.tenant == "tenant-123" input.path == ["beta", "feature-x"] reason := "Tenant overrid...
digest: bb78738aca2a3e680d7a1870743d507546af02e2e3c81ef12775029ab87b1196
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that # Tenant: per-tenant overrides tenant_allow[reason] if { input.tenant == "tenant-123" input.path == ["beta", "feature-x"] reason := "Tenant overrid....
vector_summary: # Tenant: per-tenant overrides tenant_allow[reason] if { input.tenant == "tenant-123" input.path == ["beta", "feature-x"] reason := "Tenant overrid...
chapter: CH-05
:::
# Tenant: per-tenant overrides tenant_allow[reason] if { input.tenant == "tenant-123" input.path == ["beta", "feature-x"] reason := "Tenant override: feature-x beta allow" }
:::

::: concept
id: BLK-26016fa8bb549e8a
summary: Allow := true if { count(deny) == 0 some r r := tenant_allow[r] # tenant can only *widen* within guardrails }.
digest: 39988e2bfa3bc9da6ce947b58ef1f9b8a1faf603fcb03f9168b1ede21a65ab1b
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Allow := true if { count(deny) == 0 some r r := tenant_allow[r] # tenant can only *widen* within guardrails }..
vector_summary: Allow := true if { count(deny) == 0 some r r := tenant_allow[r] # tenant can only *widen* within guardrails }.
chapter: CH-05
:::
allow := true if { count(deny) == 0 some r r := tenant_allow[r] # tenant can only *widen* within guardrails }
:::

::: concept
id: BLK-5ff9a90c174543e6
summary: This pattern makes layer provenance explicit and traceable.
digest: 502d87a9f72505a71fd5d0fdfa6ebf477bdc0e494b531e763acc8ca511d54d42
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that This pattern makes layer provenance explicit and traceable..
vector_summary: This pattern makes layer provenance explicit and traceable.
chapter: CH-05
:::
This pattern makes layer provenance explicit and traceable.
:::

::: concept
id: BLK-a1aba1f7c35dda91
summary: LOG --> COL[Log Collector / Sidecar] COL --> BUS[Message Bus / Stream] BUS --> SIEM[SIEM / Security Lake] BUS --> APM[APM / Metrics] BUS --> DWH[Da...
digest: d0f9c660cb57a8b0305b8b18906143c35f2012bf1b486b6a6ee191b425e7351c
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that LOG --> COL[Log Collector / Sidecar] COL --> BUS[Message Bus / Stream] BUS --> SIEM[SIEM / Security Lake] BUS --> APM[APM / Metrics] BUS --> DWH[Da....
semantic_categories: [observability]
vector_summary: LOG --> COL[Log Collector / Sidecar] COL --> BUS[Message Bus / Stream] BUS --> SIEM[SIEM / Security Lake] BUS --> APM[APM / Metrics] BUS --> DWH[Da...
chapter: CH-05
:::
LOG --> COL[Log Collector / Sidecar] COL --> BUS[Message Bus / Stream] BUS --> SIEM[SIEM / Security Lake] BUS --> APM[APM / Metrics] BUS --> DWH[Data Warehouse]
:::

::: concept
id: BLK-f13d3c0879266a61
summary: Typical fields in the decision log:.
digest: d25afe64508ceadca5ff11fb982c17490ec4d5905cbaf5fbbf0a133807408e21
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Typical fields in the decision log:..
semantic_categories: [observability]
vector_summary: Typical fields in the decision log:.
chapter: CH-05
:::
Typical fields in the decision log:
:::

::: concept
id: BLK-5d6ddaa19e8cfcaf
summary: Input (possibly redacted).
digest: 8a193a45a32b3963a44c8fee4751c82728dcbb3c3a7ef0c4395a28ccddde30c8
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Input (possibly redacted)..
vector_summary: Input (possibly redacted).
chapter: CH-05
:::
input (possibly redacted)
:::

::: concept
id: BLK-42e8f5f868517157
summary: Result (decision document).
digest: bd76cb3bad0cd521d325f2cd0709c5777fb860f104461487bb74e4e33ba240a9
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Result (decision document)..
vector_summary: Result (decision document).
chapter: CH-05
:::
result (decision document)
:::

::: concept
id: BLK-0e27cac7a34ed96c
summary: Labels (instance, version, tenant).
digest: f663549f53203c284723a5f8795f6951694c686f485ad7d9f099d76d1f0bb6c8
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Labels (instance, version, tenant)..
vector_summary: Labels (instance, version, tenant).
chapter: CH-05
:::
labels (instance, version, tenant)
:::

::: concept
id: BLK-9d3aeb0abc8fd54e
summary: This pipeline supports:
digest: c857081d20d6f8f891ac90752d92aea4d1b029a25b955cbec82c6e00dee82d69
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that This pipeline supports:.
vector_summary: This pipeline supports:
chapter: CH-05
:::
This pipeline supports:
:::

::: concept
id: BLK-56a7595a69adae94
summary: Real-time alerting (SIEM / SOC).
digest: 63af85b49e4a0f3d85019ed7487da283837f0edb0a607633d9bdeaaa3708545e
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Real-time alerting (SIEM / SOC)..
vector_summary: Real-time alerting (SIEM / SOC).
chapter: CH-05
:::
Real-time alerting (SIEM / SOC).
:::

::: concept
id: BLK-5e0ef2d16b64008e
summary: Dashboards (latency, volume, error rates).
digest: f25ed62d7de826cc0f0423a75fa9718301cda20341cd90219780f6a7228fcfc2
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Dashboards (latency, volume, error rates)..
vector_summary: Dashboards (latency, volume, error rates).
chapter: CH-05
:::
Dashboards (latency, volume, error rates).
:::

::: concept
id: BLK-81be0a89ed2bbdeb
summary: Audit trails (who allowed what, when, and why).
digest: 884407343b7ce02bf709d276f4c0a1d3d182ebefc9ada43d5b803f8523434f0d
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Audit trails (who allowed what, when, and why)..
vector_summary: Audit trails (who allowed what, when, and why).
chapter: CH-05
:::
Audit trails (who allowed what, when, and why).
:::

::: concept
id: BLK-976f4a3022f5c700
summary: Chapter 5 – Real-World Comprehension Examples 5.X Nested Comprehension with Filtering.
digest: 48cf191f57c33742b3b3567a079c3aef1396712d4984f8db55062f25369bfbbf
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Chapter 5 – Real-World Comprehension Examples 5.X Nested Comprehension with Filtering..
vector_summary: Chapter 5 – Real-World Comprehension Examples 5.X Nested Comprehension with Filtering.
graph_neighbors: [TERM-7189e73f44e918ef, CODE-2cbe0767daa4b7a0]
graph_degree: 2
graph_two_hop: []
graph_three_hop: []
chapter: CH-05
:::
Chapter 5 – Real-World Comprehension Examples 5.X Nested Comprehension with Filtering
:::

::: concept
id: BLK-2b29aec02bdf3804
summary: Scenario: You have data.resources listing projects and environments, and you want all production services owned by a user.
digest: ce2f75267cd79d92fbcb3b088e31f7bae007786730acedbb74f21f5816bf4574
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Scenario: You have data.resources listing projects and environments, and you want all production services owned by a user..
vector_summary: Scenario: You have data.resources listing projects and environments, and you want all production services owned by a user.
chapter: CH-05
:::
Scenario: You have data.resources listing projects and environments, and you want all production services owned by a user.
:::

::: concept
id: BLK-9ee40e622c0b8c69
summary: # data.resources.projects = [.
digest: c21abd873406d8ad553a30346e8d36982453dceb08584b8297890d7e096e94e5
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that # data.resources.projects = [..
vector_summary: # data.resources.projects = [.
chapter: CH-05
:::
# data.resources.projects = [
:::

::: concept
id: BLK-62df538504d93142
summary: # {"name": "svc-1", "env": "prod", "owners": ["alice"]},.
digest: 0ac5563e14b1ccaeeb7d8e8b79fb5b35f6617c9421a5d9bc4cecd172f886f4af
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that # {"name": "svc-1", "env": "prod", "owners": ["alice"]},..
vector_summary: # {"name": "svc-1", "env": "prod", "owners": ["alice"]},.
chapter: CH-05
:::
# {"name": "svc-1", "env": "prod", "owners": ["alice"]},
:::

::: concept
id: BLK-8564f950737ad167
summary: # {"name": "svc-2", "env": "dev", "owners": ["bob"]}.
digest: 730d9cad8dc68da05b493a7329a1c1b834a92de728838e5e4869b47f89d60482
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that # {"name": "svc-2", "env": "dev", "owners": ["bob"]}..
vector_summary: # {"name": "svc-2", "env": "dev", "owners": ["bob"]}.
chapter: CH-05
:::
# {"name": "svc-2", "env": "dev", "owners": ["bob"]}
:::

::: concept
id: BLK-81063a0c4670fed4
summary: # {"name": "svc-3", "env": "prod", "owners": ["alice", "carol"]}.
digest: 8e4842c279032788d623de316ecc550238af44d5ac160196f060cce769398352
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that # {"name": "svc-3", "env": "prod", "owners": ["alice", "carol"]}..
vector_summary: # {"name": "svc-3", "env": "prod", "owners": ["alice", "carol"]}.
chapter: CH-05
:::
# {"name": "svc-3", "env": "prod", "owners": ["alice", "carol"]}
:::

::: concept
id: BLK-710e9c5927914bb2
summary: Prod_services_owned_by(user) := result { result := [ { "project": proj.name, "service": svc.name, "env": svc.env } | proj := data.resources.project...
digest: 68f781d4707566a74dfea581a605890b4dd81eed2c5eb388caddcf00903ec758
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Prod_services_owned_by(user) := result { result := [ { "project": proj.name, "service": svc.name, "env": svc.env } | proj := data.resources.project....
vector_summary: Prod_services_owned_by(user) := result { result := [ { "project": proj.name, "service": svc.name, "env": svc.env } | proj := data.resources.project...
chapter: CH-05
:::
prod_services_owned_by(user) := result { result := [ { "project": proj.name, "service": svc.name, "env": svc.env } | proj := data.resources.projects[_] svc := proj.services[_]
:::

::: concept
id: BLK-a2f928d215b1d576
summary: Svc.env == "prod" svc.owners[_] == user ] }.
digest: 188437234e14d7849eb4c3552f8241f765b2fade291fcfa84f2337ce8052270a
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Svc.env == "prod" svc.owners[_] == user ] }..
vector_summary: Svc.env == "prod" svc.owners[_] == user ] }.
chapter: CH-05
:::
svc.env == "prod" svc.owners[_] == user ] }
:::

::: concept
id: BLK-35b8084f79c559ed
summary: Alice_prod := prod_services_owned_by("alice").
digest: ddcc77dad2aa0d65917dbd78d49ac7619ff128ec1cb3b89d04ec4e3f69dc9138
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Alice_prod := prod_services_owned_by("alice")..
vector_summary: Alice_prod := prod_services_owned_by("alice").
chapter: CH-05
:::
alice_prod := prod_services_owned_by("alice")
:::

::: concept
id: BLK-f51067adb203c9c1
summary: [ {"project": "proj-a", "service": "svc-1", "env": "prod"}, {"project": "proj-b", "service": "svc-3", "env": "prod"} ].
digest: b7ec0315c47e598683a71fccd7ec24e7107607238f874a1e2138e8bdc85d3a2e
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that [ {"project": "proj-a", "service": "svc-1", "env": "prod"}, {"project": "proj-b", "service": "svc-3", "env": "prod"} ]..
vector_summary: [ {"project": "proj-a", "service": "svc-1", "env": "prod"}, {"project": "proj-b", "service": "svc-3", "env": "prod"} ].
chapter: CH-05
:::
[ {"project": "proj-a", "service": "svc-1", "env": "prod"}, {"project": "proj-b", "service": "svc-3", "env": "prod"} ]
:::

::: concept
id: BLK-c947320997cd09cc
summary: Two nested comprehensions (projects[_], services[_]).
digest: 500bbbced5df1b89b29c9ae53781da7a038b2812ec9a263e55a14e630251572b
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Two nested comprehensions (projects[_], services[_])..
vector_summary: Two nested comprehensions (projects[_], services[_]).
graph_neighbors: [CODE-2cbe0767daa4b7a0]
graph_degree: 1
graph_two_hop: []
graph_three_hop: []
chapter: CH-05
:::
Two nested comprehensions (projects[_], services[_]).
:::

::: concept
id: BLK-bb993ad92ca88b76
summary: Inline filtering by environment and ownership.
digest: d83727c1fc89c8f7401db4ba80a17c046e0effaea5e059d2b0cc0a74b59a5394
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Inline filtering by environment and ownership..
vector_summary: Inline filtering by environment and ownership.
chapter: CH-05
:::
Inline filtering by environment and ownership.
:::

::: concept
id: BLK-813a09749e866fe6
summary: Structured result objects built inside the comprehension.
digest: 53e0f59dc5b064834ac3a9f24de6933ceeb60577e80b7849dcfafb7157458af1
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Structured result objects built inside the comprehension..
vector_summary: Structured result objects built inside the comprehension.
graph_neighbors: [CODE-2cbe0767daa4b7a0]
graph_degree: 1
graph_two_hop: []
graph_three_hop: []
chapter: CH-05
:::
Structured result objects built inside the comprehension.
:::

::: concept
id: BLK-2ceb4799a2c96bb9
summary: Chapter 6 – End-to-End JWT Validation Workflow 6.X Full JWT Validation Example.
digest: 0b75c1b3752d1622560f3c5447f74a7c02d5f25da664d247958ef6352b33933b
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Chapter 6 – End-to-End JWT Validation Workflow 6.X Full JWT Validation Example..
vector_summary: Chapter 6 – End-to-End JWT Validation Workflow 6.X Full JWT Validation Example.
chapter: CH-05
:::
Chapter 6 – End-to-End JWT Validation Workflow 6.X Full JWT Validation Example
:::

::: concept
id: BLK-fac5338924d4d432
summary: Complete pattern combining decode, verify, and claim checks.
digest: 2a91cafa1dd21b3fb13fd946acd08e8e65a5877bc8c0cb8d3b5315459a83fcfc
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Complete pattern combining decode, verify, and claim checks..
vector_summary: Complete pattern combining decode, verify, and claim checks.
chapter: CH-05
:::
Complete pattern combining decode, verify, and claim checks.
:::

::: concept
id: BLK-f5eae2ff1df643e4
summary: # Configuration in data.jwt:.
digest: 375e9b7f5c3413da77de6edd0b8c67f9be194ed7c46c0fdae6a8308870abb5c2
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that # Configuration in data.jwt:..
vector_summary: # Configuration in data.jwt:.
chapter: CH-05
:::
# Configuration in data.jwt:
:::

::: concept
id: BLK-9dd87631232b80f5
summary: # "issuer": "https://issuer.example.com/",.
digest: 9ee4df5bfedc48baa76cda7f93411532b1c0650c2bc805b3e0150f61447efe54
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that # "issuer": "https://issuer.example.com/",..
vector_summary: # "issuer": "https://issuer.example.com/",.
chapter: CH-05
:::
# "issuer": "https://issuer.example.com/",
:::

::: concept
id: BLK-b7a8495733a99b9e
summary: # "audience": "my-api",.
digest: 234f2b73406dea05b9dcaeb8ee57108e915dde9f47e54032cf305f6d898a5c16
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that # "audience": "my-api",..
vector_summary: # "audience": "my-api",.
chapter: CH-05
:::
# "audience": "my-api",
:::

::: concept
id: BLK-6e4d17c6138f8e98
summary: # "jwks": { ..
digest: 20862015340d522553a30d0ce28899b62cf5d4a78ac6829699cb8608c05c9841
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that # "jwks": { ...
vector_summary: # "jwks": { ..
chapter: CH-05
:::
# "jwks": { ... } # if using embedded JWKS
:::

::: concept
id: BLK-5a57193e78bc4589
summary: Allow if { token := input.headers.authorization startswith(token, "Bearer ").
digest: 64ec38e79634e0be5e4e82c8ff9c08d0a97cd3a8b8763450ec4e24981feffb43
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Allow if { token := input.headers.authorization startswith(token, "Bearer ")..
semantic_categories: [authz]
vector_summary: Allow if { token := input.headers.authorization startswith(token, "Bearer ").
graph_neighbors: [CODE-1f681853ebf733fb, CODE-3152b6a89a146d23, CODE-4d2ad0d6df9f48c1, CODE-e3021412b7e801e0, CODE-e8a2139bac84c4a0, CODE-ff0c5e5c7e41a636, CODE-322fb8a04486fb51, CODE-22a3c940e76c1893, CODE-ae589d488d5196d2, CODE-4b643428b4f2edd0, CODE-f9165857ee2c0c68]
graph_degree: 11
graph_two_hop: []
graph_three_hop: []
chapter: CH-05
:::
allow if { token := input.headers.authorization startswith(token, "Bearer ")
:::

::: concept
id: BLK-d4ff7978dd13cf56
summary: Raw := substring(token, count("Bearer "), -1).
digest: 8b0c16f605319d61e8baf4e250523776ea851548a6a186ed32d95ae03d7b83e4
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Raw := substring(token, count("Bearer "), -1)..
vector_summary: Raw := substring(token, count("Bearer "), -1).
chapter: CH-05
:::
raw := substring(token, count("Bearer "), -1)
:::

::: concept
id: BLK-c163d16de7a9a92c
summary: # Decode (header, payload, signature) [header, payload, signature] := io.jwt.decode(raw).
digest: ba6dbb43aad2c60f6b93c4356313d20292ed51e835998996a6e4c0292aad2e59
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that # Decode (header, payload, signature) [header, payload, signature] := io.jwt.decode(raw)..
vector_summary: # Decode (header, payload, signature) [header, payload, signature] := io.jwt.decode(raw).
chapter: CH-05
:::
# Decode (header, payload, signature) [header, payload, signature] := io.jwt.decode(raw)
:::

::: concept
id: BLK-477027788171287a
summary: Verify_signature(raw) verify_standard_claims(payload) verify_custom_claims(payload) }.
digest: 7c666df3c809e785e6213656e12f4be15735bba73d21db4b1931a77c073ba09f
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Verify_signature(raw) verify_standard_claims(payload) verify_custom_claims(payload) }..
vector_summary: Verify_signature(raw) verify_standard_claims(payload) verify_custom_claims(payload) }.
chapter: CH-05
:::
verify_signature(raw) verify_standard_claims(payload) verify_custom_claims(payload) }
:::

::: concept
id: BLK-1003fa1dd551feed
summary: Verify_signature(raw) if { # For symmetric key: # verified := io.jwt.verify_hs256(raw, data.jwt.hmac_secret) # verified == true.
digest: bec5664d5a45250390e1fa2249510c500af19f3fe0413a5c57a0a022567522f8
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Verify_signature(raw) if { # For symmetric key: # verified := io.jwt.verify_hs256(raw, data.jwt.hmac_secret) # verified == true..
vector_summary: Verify_signature(raw) if { # For symmetric key: # verified := io.jwt.verify_hs256(raw, data.jwt.hmac_secret) # verified == true.
chapter: CH-05
:::
verify_signature(raw) if { # For symmetric key: # verified := io.jwt.verify_hs256(raw, data.jwt.hmac_secret) # verified == true
:::

::: concept
id: BLK-a99828297e3dc974
summary: # For asymmetric key w/ JWKS: valid := io.jwt.verify_rs256(raw, data.jwt.jwks) valid == true }.
digest: 5e3323b0b73c4e1830cf599bb0f82173efe181bda2657c0fbc51832522296051
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that # For asymmetric key w/ JWKS: valid := io.jwt.verify_rs256(raw, data.jwt.jwks) valid == true }..
vector_summary: # For asymmetric key w/ JWKS: valid := io.jwt.verify_rs256(raw, data.jwt.jwks) valid == true }.
chapter: CH-05
:::
# For asymmetric key w/ JWKS: valid := io.jwt.verify_rs256(raw, data.jwt.jwks) valid == true }
:::

::: concept
id: BLK-ed618edd2a05c651
summary: Verify_standard_claims(payload) if { # iss payload.iss == data.jwt.issuer.
digest: 9e7517164c00622571233a5d550927552727a25b4c2406579f763a1d4435ec93
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Verify_standard_claims(payload) if { # iss payload.iss == data.jwt.issuer..
vector_summary: Verify_standard_claims(payload) if { # iss payload.iss == data.jwt.issuer.
chapter: CH-05
:::
verify_standard_claims(payload) if { # iss payload.iss == data.jwt.issuer
:::

::: concept
id: BLK-80e59217aeec7749
summary: # aud (can be string or array) – normalize to array aud := payload.aud ( is_string(aud) ; aud_array := [aud] ) or ( is_array(aud) ; aud_array := au...
digest: 18f047f6e3ca580fdad39c01ce3638dd791985f8ace2d769e4c36b805bd845e3
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that # aud (can be string or array) – normalize to array aud := payload.aud ( is_string(aud) ; aud_array := [aud] ) or ( is_array(aud) ; aud_array := au....
vector_summary: # aud (can be string or array) – normalize to array aud := payload.aud ( is_string(aud) ; aud_array := [aud] ) or ( is_array(aud) ; aud_array := au...
chapter: CH-05
:::
# aud (can be string or array) – normalize to array aud := payload.aud ( is_string(aud) ; aud_array := [aud] ) or ( is_array(aud) ; aud_array := aud )
:::

::: concept
id: BLK-2326d2661bb082c0
summary: Some i aud_array[i] == data.jwt.audience.
digest: c4e6f49a186b6e220784968949770de5ed72f0d2c480c461b9457475e4b47ff5
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Some i aud_array[i] == data.jwt.audience..
vector_summary: Some i aud_array[i] == data.jwt.audience.
chapter: CH-05
:::
some i aud_array[i] == data.jwt.audience
:::

::: concept
id: BLK-b4e88b76bdf8c0c0
summary: # exp (timestamp in seconds since epoch) now := time.now_ns() / 1000000000 payload.exp > now }.
digest: 7dfb97815ef8eb04e0dbc9bab57d3bec25d77cdb5038f488254d6c622e84de41
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that # exp (timestamp in seconds since epoch) now := time.now_ns() / 1000000000 payload.exp > now }..
vector_summary: # exp (timestamp in seconds since epoch) now := time.now_ns() / 1000000000 payload.exp > now }.
chapter: CH-05
:::
# exp (timestamp in seconds since epoch) now := time.now_ns() / 1000000000 payload.exp > now }
:::

::: concept
id: BLK-b75673f31a5a408f
summary: Verify_custom_claims(payload) if { # Example: require email_verified payload.email_verified == true.
digest: 2ed8cc8ce8afd9cff01543d047258eeb33b6f0ce7cf0757c57d55b9dbfdd87a5
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Verify_custom_claims(payload) if { # Example: require email_verified payload.email_verified == true..
vector_summary: Verify_custom_claims(payload) if { # Example: require email_verified payload.email_verified == true.
chapter: CH-05
:::
verify_custom_claims(payload) if { # Example: require email_verified payload.email_verified == true
:::

::: concept
id: BLK-05ff27cf94f0f286
summary: # Scope-based check some i payload.scope[i] == "read:orders" }.
digest: e52526e0dbd0d1fa04d9682941e62faebfc8332eae791e051d1db1418f7b88c7
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that # Scope-based check some i payload.scope[i] == "read:orders" }..
vector_summary: # Scope-based check some i payload.scope[i] == "read:orders" }.
chapter: CH-05
:::
# Scope-based check some i payload.scope[i] == "read:orders" }
:::

::: concept
id: BLK-441c9184c5a43cc2
summary: This example is realistic enough to drop into an API gateway or backend service.
digest: f9692be58a97f78140f359b6955b36f0f4f8ee4c4932344b840f520cd14b0829
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that This example is realistic enough to drop into an API gateway or backend service..
vector_summary: This example is realistic enough to drop into an API gateway or backend service.
chapter: CH-05
:::
This example is realistic enough to drop into an API gateway or backend service.
:::

::: concept
id: BLK-bda11239f7ba578b
summary: Chapter 9 – Full Bundle Structure with Manifest 9.X Bundle Layout Example.
digest: 47ee5e82ec754ff9254001bc49f2cbf55c730ae96b1a5bc51a4d8bc243e31f96
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Chapter 9 – Full Bundle Structure with Manifest 9.X Bundle Layout Example..
semantic_categories: [distribution]
vector_summary: Chapter 9 – Full Bundle Structure with Manifest 9.X Bundle Layout Example.
chapter: CH-05
:::
Chapter 9 – Full Bundle Structure with Manifest 9.X Bundle Layout Example
:::

::: concept
id: BLK-d34d0d419aa0c7e2
summary: A typical bundle layout on disk:.
digest: e9b64164882794dca4d2bd22279273d948c4e0230a0d113f4675a04a3e26ab94
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that A typical bundle layout on disk:..
semantic_categories: [distribution]
vector_summary: A typical bundle layout on disk:.
chapter: CH-05
:::
A typical bundle layout on disk:
:::

::: concept
id: BLK-69b6a886fdd31d76
summary: 9.X.1 Example .manifest File { "revision": "2025-12-05T10:00:00Z-abc123", "roots": [ "authz", "jwt", "config", "tenants" ] }.
digest: 042ceca72e8a6ea1907b6e10c31fbc98d78fe897175c5261461236e511115be3
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that 9.X.1 Example .manifest File { "revision": "2025-12-05T10:00:00Z-abc123", "roots": [ "authz", "jwt", "config", "tenants" ] }..
vector_summary: 9.X.1 Example .manifest File { "revision": "2025-12-05T10:00:00Z-abc123", "roots": [ "authz", "jwt", "config", "tenants" ] }.
chapter: CH-05
:::
9.X.1 Example .manifest File { "revision": "2025-12-05T10:00:00Z-abc123", "roots": [ "authz", "jwt", "config", "tenants" ] }
:::

::: concept
id: BLK-0ac25a2b767e2140
summary: Jwt → data.jwt.* (if any data).
digest: 0014f820df3dda04eaefe9839eac9c17c87fab2bbb2e1235c43dc2f40fbcc089
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Jwt → data.jwt.* (if any data)..
vector_summary: Jwt → data.jwt.* (if any data).
chapter: CH-05
:::
jwt → data.jwt.* (if any data)
:::

::: concept
id: BLK-c70f9f364e197266
summary: Config → data.config.* (from data/config.json).
digest: 4fbabd90aef6890e9ce9f55893d01fae5038cf921b51acab083d735838ec1618
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Config → data.config.* (from data/config.json)..
vector_summary: Config → data.config.* (from data/config.json).
chapter: CH-05
:::
config → data.config.* (from data/config.json)
:::

::: concept
id: BLK-f5381b4672ab8919
summary: Tenants → data.tenants.* (from data/tenants/*.json).
digest: bdd6fae6112f3972d37895358a6f2f2bfbcbb24cdb281924160573b1236bc59b
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Tenants → data.tenants.* (from data/tenants/*.json)..
vector_summary: Tenants → data.tenants.* (from data/tenants/*.json).
chapter: CH-05
:::
tenants → data.tenants.* (from data/tenants/*.json)
:::

::: concept
id: BLK-f65b10d7491c5a74
summary: You can layer bundles by:.
digest: a47a2a639ad52b1346270d5043264645ad6658a74675cd2076448f9da430975b
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that You can layer bundles by:..
semantic_categories: [distribution]
vector_summary: You can layer bundles by:.
chapter: CH-05
:::
You can layer bundles by:
:::

::: concept
id: BLK-0e8c5e2011dd4b9b
summary: Using disjoint roots (e.g., authz/ vs pricing/).
digest: 6f87e72f4aa083aaba9a0960049c128eb942cd787712993d1b44d2fa00363044
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Using disjoint roots (e.g., authz/ vs pricing/)..
vector_summary: Using disjoint roots (e.g., authz/ vs pricing/).
chapter: CH-05
:::
Using disjoint roots (e.g., authz/ vs pricing/).
:::

::: concept
id: BLK-c8f0e1b1efee8906
summary: Or orchestrating versioning in the bundle distribution system.
digest: 48bd33517b9f15f548f26f52df49d76f4fff85f01288f7b23c9e5d410137c077
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Or orchestrating versioning in the bundle distribution system..
semantic_categories: [distribution]
vector_summary: Or orchestrating versioning in the bundle distribution system.
chapter: CH-05
:::
Or orchestrating versioning in the bundle distribution system.
:::

::: concept
id: BLK-c1dbf3b38ab667e9
summary: Chapter 13 – Multi-Tenant Decision Aggregation (End-to-End) 13.Y Multi-Tenant Aggregated Decision Document.
digest: ac7e30a5be2b42b67a6ce1bd3d73b895ead080fcf05399a126ca26f8793b9bab
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Chapter 13 – Multi-Tenant Decision Aggregation (End-to-End) 13.Y Multi-Tenant Aggregated Decision Document..
vector_summary: Chapter 13 – Multi-Tenant Decision Aggregation (End-to-End) 13.Y Multi-Tenant Aggregated Decision Document.
graph_neighbors: [CODE-4522197481045bd4, CODEPAT-c4c47ef6c7df1e75, CODEPAT-3f603bb00d12d7e6, CODE-8cd9f756e7ad785f, CODEPAT-ce3111aa333c1369, CODE-704f6e731c295b92, CODE-6fd3a2913e47883e, CODEPAT-e3a1766e8b78df14, CODEPAT-190e5fc8d209ddec, CODE-1b4cef265aa6f5e3, CODEPAT-67fa0ef89ef6b03c, CODEPAT-a00d797a81733169, CODEPAT-f8e30e7deeeb39fa, CODEPAT-90bf40e525478abf, CODE-55a5cc5eed674559]
graph_degree: 15
graph_two_hop: []
graph_three_hop: []
chapter: CH-05
:::
Chapter 13 – Multi-Tenant Decision Aggregation (End-to-End) 13.Y Multi-Tenant Aggregated Decision Document
:::

::: concept
id: BLK-778e8e4ce5250571
summary: Goal: build a decision document that exposes per-layer decisions and the final result for a multi-tenant system.
digest: 58835a9bdb46faef9ccd91fa9f96611cf4bf012a9e71638bea45f6f9fe687216
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Goal: build a decision document that exposes per-layer decisions and the final result for a multi-tenant system..
vector_summary: Goal: build a decision document that exposes per-layer decisions and the final result for a multi-tenant system.
chapter: CH-05
:::
Goal: build a decision document that exposes per-layer decisions and the final result for a multi-tenant system.
:::

::: concept
id: BLK-35e5e00ecdd4703e
summary: Package authz.multi_tenant.
digest: 9543ba978863b4519dd6fe11f6629a39112da82e2e266d1db5e1ddb26900dd06
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Package authz.multi_tenant..
vector_summary: Package authz.multi_tenant.
chapter: CH-05
:::
package authz.multi_tenant
:::

::: concept
id: BLK-217a40a7d3f6722c
summary: Domain_decision := {"allow": allow, "reasons": reasons} { deny_reasons := {r | some r r := domain_deny[r] } reasons := sort(deny_reasons) allow := ...
digest: e0a01a438e43892f47a35f8fe93f087cbf908890b339eaa36cef9bbf24766fb0
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Domain_decision := {"allow": allow, "reasons": reasons} { deny_reasons := {r | some r r := domain_deny[r] } reasons := sort(deny_reasons) allow := ....
vector_summary: Domain_decision := {"allow": allow, "reasons": reasons} { deny_reasons := {r | some r r := domain_deny[r] } reasons := sort(deny_reasons) allow := ...
chapter: CH-05
:::
domain_decision := {"allow": allow, "reasons": reasons} { deny_reasons := {r | some r r := domain_deny[r] } reasons := sort(deny_reasons) allow := count(deny_reasons) == 0 }
:::

::: concept
id: BLK-5feaf7cf3b0268ba
summary: Tenant_decision := {"allow": allow, "reasons": reasons} { allow_reasons := {r | some r r := tenant_allow[r] } reasons := sort(allow_reasons) allow ...
digest: 1e3c5ff5185c882fff086232705996e9c874c4132d6d2eb5f4afda4d92c013c3
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Tenant_decision := {"allow": allow, "reasons": reasons} { allow_reasons := {r | some r r := tenant_allow[r] } reasons := sort(allow_reasons) allow ....
vector_summary: Tenant_decision := {"allow": allow, "reasons": reasons} { allow_reasons := {r | some r r := tenant_allow[r] } reasons := sort(allow_reasons) allow ...
chapter: CH-05
:::
tenant_decision := {"allow": allow, "reasons": reasons} { allow_reasons := {r | some r r := tenant_allow[r] } reasons := sort(allow_reasons) allow := count(allow_reasons) > 0 }
:::

::: concept
id: BLK-3632bbb69a6a4073
summary: # Final decision aggregates the layers decision := { "global": global_decision, "domain": domain_decision, "tenant": tenant_decision, "final": { "a...
digest: a795982b4270e7f504d4e587689ad04d902d1ac590cddcc05b61cd719177d587
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that # Final decision aggregates the layers decision := { "global": global_decision, "domain": domain_decision, "tenant": tenant_decision, "final": { "a....
vector_summary: # Final decision aggregates the layers decision := { "global": global_decision, "domain": domain_decision, "tenant": tenant_decision, "final": { "a...
chapter: CH-05
:::
# Final decision aggregates the layers decision := { "global": global_decision, "domain": domain_decision, "tenant": tenant_decision, "final": { "allow": final_allow, "source": final_source } } { not global_decision.allow final_allow := false final_source := "global" } { global_decision.allow not domain_decision.allow final_allow := false final_source := "domain" } { global_decision.allow domain_decision.allow tenant_decision.allow final_allow := true final_source := "tenant" } { global_decision.allow domain_decision.allow not tenant_decision.allow final_allow := true final_source := "domain/global" }
:::

::: concept
id: BLK-ecab223a7c0486a1
summary: Clients now get a rich decision document:.
digest: 5a0acd28d1dbf4f671f501ce984ef89dfcc9351bc1b24b9aa92460db4351e14a
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Clients now get a rich decision document:..
vector_summary: Clients now get a rich decision document:.
chapter: CH-05
:::
Clients now get a rich decision document:
:::

::: concept
id: BLK-09019c1063d48428
summary: { "global": {"allow": true, "reasons": []}, "domain": {"allow": true, "reasons": []}, "tenant": {"allow": true, "reasons": ["Tenant override: featu...
digest: 5385a6092c543d246a84f0ed35b0588905240d1ccfe1cd4a56dfc7c6e86f68ae
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that { "global": {"allow": true, "reasons": []}, "domain": {"allow": true, "reasons": []}, "tenant": {"allow": true, "reasons": ["Tenant override: featu....
vector_summary: { "global": {"allow": true, "reasons": []}, "domain": {"allow": true, "reasons": []}, "tenant": {"allow": true, "reasons": ["Tenant override: featu...
chapter: CH-05
:::
{ "global": {"allow": true, "reasons": []}, "domain": {"allow": true, "reasons": []}, "tenant": {"allow": true, "reasons": ["Tenant override: feature-x beta"]}, "final": {"allow": true, "source": "tenant"} }
:::

::: concept
id: BLK-5e538168da6683e7
summary: Chapter 16 – Complete GraphQL Authorization System 16.X GraphQL Schema, AST, and Field-Level Auth.
digest: a24389c9c75be4044de98fbf91110a5fc841b99eeb63649edd2fd4d8470a375a
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Chapter 16 – Complete GraphQL Authorization System 16.X GraphQL Schema, AST, and Field-Level Auth..
semantic_categories: [authz]
vector_summary: Chapter 16 – Complete GraphQL Authorization System 16.X GraphQL Schema, AST, and Field-Level Auth.
graph_neighbors: [CODE-1f681853ebf733fb, CODE-3152b6a89a146d23, CODE-4d2ad0d6df9f48c1, CODE-e3021412b7e801e0, CODE-e8a2139bac84c4a0, CODE-ff0c5e5c7e41a636, CODE-322fb8a04486fb51, CODE-22a3c940e76c1893, CODE-ae589d488d5196d2, CODE-4b643428b4f2edd0, CODE-f9165857ee2c0c68]
graph_degree: 11
graph_two_hop: []
graph_three_hop: []
chapter: CH-05
:::
Chapter 16 – Complete GraphQL Authorization System 16.X GraphQL Schema, AST, and Field-Level Auth
:::

::: concept
id: BLK-75950f14edf8397e
summary: API gateway parses GraphQL into an AST and passes it in input.gql.
digest: 25c97be25b385b60e04be5aba75e6a9918ab632965c72993fcc9f15abc452004
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that API gateway parses GraphQL into an AST and passes it in input.gql..
vector_summary: API gateway parses GraphQL into an AST and passes it in input.gql.
chapter: CH-05
:::
API gateway parses GraphQL into an AST and passes it in input.gql.
:::

::: concept
id: BLK-aa71c08475407014
summary: Schema-driven config is in data.gql.
digest: 001177726711664866d158bb53a52c05efd8af3b34cffed9f53d2e18bd22e4e5
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Schema-driven config is in data.gql..
vector_summary: Schema-driven config is in data.gql.
chapter: CH-05
:::
Schema-driven config is in data.gql.
:::

::: concept
id: BLK-1708ce308bfcfad0
summary: { "field_costs": { "Query.users": 1, "Query.users.email": 2, "Query.users.orders": 3 }, "max_cost": 20, "roles": { "Query.users": ["admin", "suppor...
digest: 0cd00a401c29b55e260be29d26db46599534d0fe40a2aca5d9d30ad2ca15be67
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that { "field_costs": { "Query.users": 1, "Query.users.email": 2, "Query.users.orders": 3 }, "max_cost": 20, "roles": { "Query.users": ["admin", "suppor....
vector_summary: { "field_costs": { "Query.users": 1, "Query.users.email": 2, "Query.users.orders": 3 }, "max_cost": 20, "roles": { "Query.users": ["admin", "suppor...
chapter: CH-05
:::
{ "field_costs": { "Query.users": 1, "Query.users.email": 2, "Query.users.orders": 3 }, "max_cost": 20, "roles": { "Query.users": ["admin", "support"], "Query.users.email": ["admin"], "Query.users.orders": ["admin", "billing"] } }
:::

::: concept
id: BLK-bb3abd47870bb2d7
summary: Import future.keywords.in.
digest: b1268e45ac0f7b9060df60f60145bd1c1a65d707c56d7421fee7d9dd4cdbfcdc
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Import future.keywords.in..
vector_summary: Import future.keywords.in.
chapter: CH-05
:::
import future.keywords.in
:::

::: concept
id: BLK-2a2bc1ccf807b459
summary: # input.gql example:.
digest: 8f176629f4787831357c8ad4fb72005d0df5ca3e63a87451384033b5d21f7901
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that # input.gql example:..
vector_summary: # input.gql example:.
chapter: CH-05
:::
# input.gql example:
:::

::: concept
id: BLK-3dc6f99a487983ea
summary: # "path": ["Query", "users"],.
digest: f1003e9600dae3493ae970c36aba4e460b8ff4c1d50304017664b999017c4c54
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that # "path": ["Query", "users"],..
vector_summary: # "path": ["Query", "users"],.
chapter: CH-05
:::
# "path": ["Query", "users"],
:::

::: concept
id: BLK-489f1a3e7b195d7f
summary: # {"path": ["Query", "users", "email"], "name": "email"},.
digest: 1ace821be7cf99a1e483b47a3027a8186349f5bc5922bba0d597366ea68275fb
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that # {"path": ["Query", "users", "email"], "name": "email"},..
vector_summary: # {"path": ["Query", "users", "email"], "name": "email"},.
chapter: CH-05
:::
# {"path": ["Query", "users", "email"], "name": "email"},
:::

::: concept
id: BLK-23d21738b0f1b56f
summary: # {"path": ["Query", "users", "orders"], "name": "orders"}.
digest: b695f6bf1fdf4c8cf53e1c6753dc26f8d491ac0cda36a2b6c112d23306973690
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that # {"path": ["Query", "users", "orders"], "name": "orders"}..
vector_summary: # {"path": ["Query", "users", "orders"], "name": "orders"}.
chapter: CH-05
:::
# {"path": ["Query", "users", "orders"], "name": "orders"}
:::

::: concept
id: BLK-d94d9a8b50f394c0
summary: # "roles": ["support"].
digest: e8393bd7b49e0c605cf147c68ba51cac748067af1bf7d756be0b63ce2bf5240c
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that # "roles": ["support"]..
vector_summary: # "roles": ["support"].
chapter: CH-05
:::
# "roles": ["support"]
:::

::: concept
id: BLK-84861e440fcba053
summary: User_roles := input.gql.user.roles.
digest: 383f673fd26c9c817b74aa1cbc319d3bac80c8dfa984da4de940ecda50293923
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that User_roles := input.gql.user.roles..
vector_summary: User_roles := input.gql.user.roles.
chapter: CH-05
:::
user_roles := input.gql.user.roles
:::

::: concept
id: BLK-baba7ac4a7b4d63d
summary: Field_cost([path, field]) := 0 if { full := concat(".", array.concat(path, [field])) not data.gql.field_costs[full] }.
digest: 0e04897c38f4d5375b3eb3a1172109c83f1d0d8d632ec6f74efead1a93f40508
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Field_cost([path, field]) := 0 if { full := concat(".", array.concat(path, [field])) not data.gql.field_costs[full] }..
vector_summary: Field_cost([path, field]) := 0 if { full := concat(".", array.concat(path, [field])) not data.gql.field_costs[full] }.
chapter: CH-05
:::
field_cost([path, field]) := 0 if { full := concat(".", array.concat(path, [field])) not data.gql.field_costs[full] }
:::

::: concept
id: BLK-e0c6ec40c537eb08
summary: # Flatten all selected fields (including nested subfields) all_fields := result { result := [ {"path": f.path, "name": f.name} | op := input.gql.op...
digest: c858c7f211d3d2b5948a551c167ef18e30f8aef7087214a538a5c10592183dd3
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that # Flatten all selected fields (including nested subfields) all_fields := result { result := [ {"path": f.path, "name": f.name} | op := input.gql.op....
vector_summary: # Flatten all selected fields (including nested subfields) all_fields := result { result := [ {"path": f.path, "name": f.name} | op := input.gql.op...
chapter: CH-05
:::
# Flatten all selected fields (including nested subfields) all_fields := result { result := [ {"path": f.path, "name": f.name} | op := input.gql.operations[_] f := op.fields[_] ] ++ [ {"path": sf.path, "name": sf.name} | op := input.gql.operations[_] f := op.fields[_] sf := f.subfields[_] ] }
:::

::: concept
id: BLK-1804a20482d1b343
summary: Total_cost := sum({ c | f := all_fields[_] c := field_cost([f.path, f.name]) }).
digest: 0250650fab8274d62e4ee8494dc58c629182b507b44591fe891cb5d0fdf26cf7
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Total_cost := sum({ c | f := all_fields[_] c := field_cost([f.path, f.name]) })..
vector_summary: Total_cost := sum({ c | f := all_fields[_] c := field_cost([f.path, f.name]) }).
chapter: CH-05
:::
total_cost := sum({ c | f := all_fields[_] c := field_cost([f.path, f.name]) })
:::

::: concept
id: BLK-39ed6f20348b8623
summary: Too_expensive if { total_cost > data.gql.max_cost }.
digest: a2b4d843e5bd65691c03c71f7085a2aa2419da14a94b8aa515ed4e26fb337e1b
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Too_expensive if { total_cost > data.gql.max_cost }..
vector_summary: Too_expensive if { total_cost > data.gql.max_cost }.
chapter: CH-05
:::
too_expensive if { total_cost > data.gql.max_cost }
:::

::: concept
id: BLK-2290e821ea646404
summary: Unauthorized_fields[full] if { f := all_fields[_] not field_allowed([f.path, f.name]) full := concat(".", array.concat(f.path, [f.name])) }.
digest: 9cac36125e487f102446fe5d27b04573a1bff9e43fa0e7638613b5b297676861
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Unauthorized_fields[full] if { f := all_fields[_] not field_allowed([f.path, f.name]) full := concat(".", array.concat(f.path, [f.name])) }..
vector_summary: Unauthorized_fields[full] if { f := all_fields[_] not field_allowed([f.path, f.name]) full := concat(".", array.concat(f.path, [f.name])) }.
chapter: CH-05
:::
unauthorized_fields[full] if { f := all_fields[_] not field_allowed([f.path, f.name]) full := concat(".", array.concat(f.path, [f.name])) }
:::

::: concept
id: BLK-0f57f72096c4c8a0
summary: Allow if { not too_expensive count(unauthorized_fields) == 0 }.
digest: c15c89cd9a6b24812248f6307afb7e8a80739cdc631eac432d9e4347091de4f8
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Allow if { not too_expensive count(unauthorized_fields) == 0 }..
vector_summary: Allow if { not too_expensive count(unauthorized_fields) == 0 }.
chapter: CH-05
:::
allow if { not too_expensive count(unauthorized_fields) == 0 }
:::

::: concept
id: BLK-4ce77748e8276750
summary: Decision := { "allow": allow, "total_cost": total_cost, "unauthorized_fields": unauthorized_fields }.
digest: cf610f121768f0beb3d007b0bf41576e322fccde05e3b56b2101068faeff4e67
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Decision := { "allow": allow, "total_cost": total_cost, "unauthorized_fields": unauthorized_fields }..
vector_summary: Decision := { "allow": allow, "total_cost": total_cost, "unauthorized_fields": unauthorized_fields }.
chapter: CH-05
:::
decision := { "allow": allow, "total_cost": total_cost, "unauthorized_fields": unauthorized_fields }
:::

::: concept
id: BLK-d936cb7e30a4ea67
summary: Field-level auth (field_allowed).
digest: 57a4e075cbde2f671ccb44835f37c34648469585d6aa22a3553c45bd4b7cb268
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Field-level auth (field_allowed)..
vector_summary: Field-level auth (field_allowed).
chapter: CH-05
:::
Field-level auth (field_allowed).
:::

::: concept
id: BLK-36ea9500bf4999b0
summary: Cost-based limiting (total_cost, too_expensive).
digest: ba34f4badc0c8a406a4a053d3960233a136d174f96c9efa8e78b2d7b196eb147
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Cost-based limiting (total_cost, too_expensive)..
vector_summary: Cost-based limiting (total_cost, too_expensive).
chapter: CH-05
:::
Cost-based limiting (total_cost, too_expensive).
:::

::: concept
id: BLK-d8cbad3b94589fdb
summary: A rich decision document for clients.
digest: cd77120bfeb93d1735be60c8be9e37a33bc7ecd14fb34e67a4402dad1ee2ed2c
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that A rich decision document for clients..
vector_summary: A rich decision document for clients.
chapter: CH-05
:::
A rich decision document for clients.
:::

::: concept
id: BLK-3ed64c8d88ca8eca
summary: 17.X.1 Validation Pipeline Steps.
digest: 874ee9881f058549420bab373c8955070098a8366575b23780f8ee44a1d31584
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that 17.X.1 Validation Pipeline Steps..
vector_summary: 17.X.1 Validation Pipeline Steps.
chapter: CH-05
:::
17.X.1 Validation Pipeline Steps
:::

::: concept
id: BLK-d10604b78eaedde3
summary: Human review for MAD (Major Action/Decision) changes.
digest: fdd15f1e81312a6d21254a7f8e4117d58eab543c4870f2fb769b997c170475ce
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Human review for MAD (Major Action/Decision) changes..
vector_summary: Human review for MAD (Major Action/Decision) changes.
chapter: CH-05
:::
Human review for MAD (Major Action/Decision) changes.
:::

::: concept
id: BLK-3cec2ea33dbc48c5
summary: 17.X.2 Example “LLM-Written” Policy + Tests.
digest: 9c8fcb2a60390b2aa95ff49b202c467fe359c917a667886767a704f282fc2652
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that 17.X.2 Example “LLM-Written” Policy + Tests..
vector_summary: 17.X.2 Example “LLM-Written” Policy + Tests.
chapter: CH-05
:::
17.X.2 Example “LLM-Written” Policy + Tests
:::

::: concept
id: BLK-33fa20a5d4c88b66
summary: Package authz.orders.
digest: 8110c131aed8b58e2e2dc91b946603d16673db3b989a214b055717c8cf853106
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Package authz.orders..
vector_summary: Package authz.orders.
chapter: CH-05
:::
package authz.orders
:::

::: concept
id: BLK-03fccd8e6d2155ad
summary: # Allow read if user owns order or is admin allow if { input.method == "GET" input.path == ["orders", order_id].
digest: 416e6d81d16269764f0db425d76c14aa1a376f67bf1903d336a68cb8ed1690e3
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that # Allow read if user owns order or is admin allow if { input.method == "GET" input.path == ["orders", order_id]..
vector_summary: # Allow read if user owns order or is admin allow if { input.method == "GET" input.path == ["orders", order_id].
chapter: CH-05
:::
# Allow read if user owns order or is admin allow if { input.method == "GET" input.path == ["orders", order_id]
:::

::: concept
id: BLK-270b38e64b2b00e3
summary: Some order order := data.orders[order_id].
digest: 83743a66e50b3576a1925b17716e9e80a9b9b3a63d043ba424dbc8396cb7d217
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Some order order := data.orders[order_id]..
vector_summary: Some order order := data.orders[order_id].
chapter: CH-05
:::
some order order := data.orders[order_id]
:::

::: concept
id: BLK-70a8f91f82a18e3d
summary: ( order.owner_id == input.user.id ) or ( input.user.roles[_] == "admin" ) }.
digest: 1c89ce5dd1b90996b85f1fdcaf4d55cfd7cf94f6f2c446837ba08d45fb5aa7c7
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that ( order.owner_id == input.user.id ) or ( input.user.roles[_] == "admin" ) }..
vector_summary: ( order.owner_id == input.user.id ) or ( input.user.roles[_] == "admin" ) }.
chapter: CH-05
:::
( order.owner_id == input.user.id ) or ( input.user.roles[_] == "admin" ) }
:::

::: concept
id: BLK-fbbe119189f2ab36
summary: Package authz.orders_test.
digest: f0b36be4962e785ade7643172d474237c574e34b767ccd60015a83b5b0dae864
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Package authz.orders_test..
vector_summary: Package authz.orders_test.
chapter: CH-05
:::
package authz.orders_test
:::

::: concept
id: BLK-54d277aeaababbe9
summary: Import data.authz.orders.
digest: 2157074d35f0d9bd405d7a5a66b958b690b0f26d5ff9eeec9e51ae21014025fc
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Import data.authz.orders..
vector_summary: Import data.authz.orders.
chapter: CH-05
:::
import data.authz.orders
:::

::: concept
id: BLK-405a975fd98ce06b
summary: Test_owner_can_read if { input := { "method": "GET", "path": ["orders", "o1"], "user": {"id": "alice", "roles": []} } data.orders["o1"].owner_id ==...
digest: 51665fbaf1db7e6102d4340532f922270557c9e90c55580722d6a346aeb01c32
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Test_owner_can_read if { input := { "method": "GET", "path": ["orders", "o1"], "user": {"id": "alice", "roles": []} } data.orders["o1"].owner_id ==....
vector_summary: Test_owner_can_read if { input := { "method": "GET", "path": ["orders", "o1"], "user": {"id": "alice", "roles": []} } data.orders["o1"].owner_id ==...
chapter: CH-05
:::
test_owner_can_read if { input := { "method": "GET", "path": ["orders", "o1"], "user": {"id": "alice", "roles": []} } data.orders["o1"].owner_id == "alice"
:::

::: concept
id: BLK-7f7b19bbfe9ca742
summary: Result := orders.allow with input as input result == true }.
digest: 4aa1f881f8979b982d4a444d882ca8e47c03c47e56e20774b62929110c353135
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Result := orders.allow with input as input result == true }..
vector_summary: Result := orders.allow with input as input result == true }.
chapter: CH-05
:::
result := orders.allow with input as input result == true }
:::

::: concept
id: BLK-09066e199d225e96
summary: Test_non_owner_cannot_read if { input := { "method": "GET", "path": ["orders", "o1"], "user": {"id": "bob", "roles": []} } data.orders["o1"].owner_...
digest: bcbf1498653df9810aa0c47307df83984af344db5ccaea7ce3900a33299895e2
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Test_non_owner_cannot_read if { input := { "method": "GET", "path": ["orders", "o1"], "user": {"id": "bob", "roles": []} } data.orders["o1"].owner_....
vector_summary: Test_non_owner_cannot_read if { input := { "method": "GET", "path": ["orders", "o1"], "user": {"id": "bob", "roles": []} } data.orders["o1"].owner_...
chapter: CH-05
:::
test_non_owner_cannot_read if { input := { "method": "GET", "path": ["orders", "o1"], "user": {"id": "bob", "roles": []} } data.orders["o1"].owner_id == "alice"
:::

::: concept
id: BLK-2ef9e325c3ede69b
summary: Result := orders.allow with input as input result == false }.
digest: fe3cec019ce00992cf9ac5de72d7468600606447f1106bf15bf2fd9510b10d21
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Result := orders.allow with input as input result == false }..
vector_summary: Result := orders.allow with input as input result == false }.
chapter: CH-05
:::
result := orders.allow with input as input result == false }
:::

::: concept
id: BLK-6c4f81cc9fa85914
summary: Test_admin_can_read_any if { input := { "method": "GET", "path": ["orders", "o1"], "user": {"id": "random", "roles": ["admin"]} }.
digest: a6c70f469a6dbd78217f9cdd9a4492e2f1317a0327288903a798e463980d374f
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Test_admin_can_read_any if { input := { "method": "GET", "path": ["orders", "o1"], "user": {"id": "random", "roles": ["admin"]} }..
vector_summary: Test_admin_can_read_any if { input := { "method": "GET", "path": ["orders", "o1"], "user": {"id": "random", "roles": ["admin"]} }.
chapter: CH-05
:::
test_admin_can_read_any if { input := { "method": "GET", "path": ["orders", "o1"], "user": {"id": "random", "roles": ["admin"]} }
:::

::: concept
id: BLK-a39d79842263ba83
summary: Run internal checks (e.g., no input.user.is_admin == true shortcuts, no unsafe wildcards in paths).
digest: fdd79f58e7c4bbce19f931604786fe01947af6c58a08634eafe144ae7ff5e8b0
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Run internal checks (e.g., no input.user.is_admin == true shortcuts, no unsafe wildcards in paths)..
vector_summary: Run internal checks (e.g., no input.user.is_admin == true shortcuts, no unsafe wildcards in paths).
chapter: CH-05
:::
Run internal checks (e.g., no input.user.is_admin == true shortcuts, no unsafe wildcards in paths).
:::

::: concept
id: BLK-8c30db71e7f93b4d
summary: If all pass, bundle and distribute.
digest: 834c320a1c6e16f5117fcbf23daf3b2ea3afd3f5f3ee6ce3a5a82389899798d3
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that If all pass, bundle and distribute..
semantic_categories: [distribution]
vector_summary: If all pass, bundle and distribute.
chapter: CH-05
:::
If all pass, bundle and distribute.
:::

::: concept
id: BLK-94f8c149d00a676c
summary: Inner blocks can rebind a variable name used in an outer block, changing meaning silently.
digest: cf3dc42ad108453f0a4c4d4da5b0fe7d38a1a2fb2725a12f8bd067bb10a8a9e3
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Inner blocks can rebind a variable name used in an outer block, changing meaning silently..
vector_summary: Inner blocks can rebind a variable name used in an outer block, changing meaning silently.
chapter: CH-05
:::
Inner blocks can rebind a variable name used in an outer block, changing meaning silently.
:::

::: concept
id: BLK-c1e1ad2a784b9961
summary: Allow if { user := data.override_user # shadows outer user user.id == "admin" }.
digest: 2f56e8c2427cee76db3209ff66197d11ba78d82c6116432d67abb539b6236f97
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Allow if { user := data.override_user # shadows outer user user.id == "admin" }..
vector_summary: Allow if { user := data.override_user # shadows outer user user.id == "admin" }.
chapter: CH-05
:::
allow if { user := data.override_user # shadows outer user user.id == "admin" }
:::

::: concept
id: BLK-e9a2a703bbdc8110
summary: The inner user hides the outer one.
digest: 0e943174f21bbc62cfcdae499d0d7395dcc77f36d3e0a690d5316dc9ee6ccf97
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that The inner user hides the outer one..
vector_summary: The inner user hides the outer one.
chapter: CH-05
:::
The inner user hides the outer one. Prefer distinct names unless you truly mean to shadow:
:::

::: concept
id: BLK-5fe91289cef7406b
summary: Allow if { override_user := data.override_user override_user.id == "admin" }.
digest: 5e0b7f9f9e5b8ce3390f891fa0fc9e6a438c720d82faadcdbee2135c47cd8ce1
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Allow if { override_user := data.override_user override_user.id == "admin" }..
vector_summary: Allow if { override_user := data.override_user override_user.id == "admin" }.
chapter: CH-05
:::
allow if { override_user := data.override_user override_user.id == "admin" }
:::

::: concept
id: BLK-66161b54f3ab4c92
summary: Use distinct names:.
digest: cfcecd7866a8db9543d4124538b1a8f840280a05c1fe71021f58f708747f74f0
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Use distinct names:..
vector_summary: Use distinct names:.
chapter: CH-05
:::
Here the second some i doesn’t “reuse” the first one; it introduces a new i but still scoped to the whole body in practice. Use distinct names:
:::

::: concept
id: BLK-633a4a5154649ed1
summary: Instead, build sets or arrays with comprehensions, then aggregate:.
digest: 83d2673fcec0bad229d5116fe642b49ab4cff8e04b39185a072dc141da31c910
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Instead, build sets or arrays with comprehensions, then aggregate:..
vector_summary: Instead, build sets or arrays with comprehensions, then aggregate:.
graph_neighbors: [CODE-2cbe0767daa4b7a0]
graph_degree: 1
graph_two_hop: []
graph_three_hop: []
chapter: CH-05
:::
Instead, build sets or arrays with comprehensions, then aggregate:
:::

::: concept
id: BLK-4504655151caa66a
summary: Violations := { v | some i v := input.items[i] v.level == "HIGH" }.
digest: be072b580e8ecd3043d49f1769a6c125538207d04854b8a61ae90415a359be70
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Violations := { v | some i v := input.items[i] v.level == "HIGH" }..
vector_summary: Violations := { v | some i v := input.items[i] v.level == "HIGH" }.
chapter: CH-05
:::
violations := { v | some i v := input.items[i] v.level == "HIGH" }
:::

::: concept
id: BLK-b7db79b559c9a8be
summary: Violation_count := count(violations).
digest: aa4d215711ba072684bcaecf9788498c79514d6e1eb50e619b4470cdf249b151
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Violation_count := count(violations)..
vector_summary: Violation_count := count(violations).
chapter: CH-05
:::
violation_count := count(violations)
:::

::: concept
id: BLK-dc69febaea17b4d4
summary: You can also provide a default:.
digest: c2b66acba521fd4996367628acfe017a100ab5d3430623c1fad0a41eadd0492c
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that You can also provide a default:..
vector_summary: You can also provide a default:.
chapter: CH-05
:::
You can also provide a default:
:::

::: concept
id: BLK-e47efc5955420f53
summary: User_email := email if { is_object(input.user) is_string(input.user.email) email := input.user.email }.
digest: cd2b725e9db623ce4b93a0d6c2e68c043d1ec3666f85e81123bdf1c2f71be1c5
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that User_email := email if { is_object(input.user) is_string(input.user.email) email := input.user.email }..
vector_summary: User_email := email if { is_object(input.user) is_string(input.user.email) email := input.user.email }.
chapter: CH-05
:::
user_email := email if { is_object(input.user) is_string(input.user.email) email := input.user.email }
:::

::: concept
id: BLK-7c1a3d4a579c38de
summary: User_email := "unknown" if { not is_string(user_email) }.
digest: 813cdad010ea58ebcae77333d9f1b42e2e9592f0fed58d0a567e907e7a8d475a
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that User_email := "unknown" if { not is_string(user_email) }..
vector_summary: User_email := "unknown" if { not is_string(user_email) }.
chapter: CH-05
:::
user_email := "unknown" if { not is_string(user_email) }
:::

::: concept
id: BLK-e4237f7442d9769a
summary: Null, missing, and “falsy” values are different:.
digest: 3d4a1e14e10c487ea7273a5c628bf2cb6307cc171d00b102fb88d62f99748a7c
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Null, missing, and “falsy” values are different:..
vector_summary: Null, missing, and “falsy” values are different:.
chapter: CH-05
:::
null, missing, and “falsy” values are different:
:::

::: concept
id: BLK-365c96c74e794ad8
summary: Missing: input.user.email → error if user missing or not object.
digest: 8e3a43a94baedceb0fdfa3b7337ac0f02fe6b90284cd7710d60407855bb7a9b4
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Missing: input.user.email → error if user missing or not object..
vector_summary: Missing: input.user.email → error if user missing or not object.
chapter: CH-05
:::
Missing: input.user.email → error if user missing or not object.
:::

::: concept
id: BLK-624f75dd97acc370
summary: Present but null: input.user.email == null is valid.
digest: a3c62d1d19c0eeb690e3afdef46d805f50af1d00a9d298775f668bcfe2ca3687
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Present but null: input.user.email == null is valid..
vector_summary: Present but null: input.user.email == null is valid.
chapter: CH-05
:::
Present but null: input.user.email == null is valid.
:::

::: concept
id: BLK-7b110b84bf4a7140
summary: Falsy (e.g., "", 0, false): normal values.
digest: cf54819e392b55f702b9d91939e05598e065ece83e33477af3bb71634b65a4f5
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Falsy (e.g., "", 0, false): normal values..
vector_summary: Falsy (e.g., "", 0, false): normal values.
chapter: CH-05
:::
Falsy (e.g., "", 0, false): normal values.
:::

::: concept
id: BLK-d4b34685c6fe166d
summary: Use guards to distinguish:.
digest: 72723658c27049a02018f1b21018d92ec917c5d1eac4988572b0799d2c8c0df5
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Use guards to distinguish:..
vector_summary: Use guards to distinguish:.
chapter: CH-05
:::
Use guards to distinguish:
:::

::: concept
id: BLK-21057b3108817270
summary: Has_email if { is_object(input.user) input.user.email != null }.
digest: 22b703f1bf5a1d6b56ec74aff58d3e66f2a25f857219f5b0455e503222b90695
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Has_email if { is_object(input.user) input.user.email != null }..
vector_summary: Has_email if { is_object(input.user) input.user.email != null }.
chapter: CH-05
:::
has_email if { is_object(input.user) input.user.email != null }
:::

::: concept
id: BLK-9c0b54c322f0cfd2
summary: Wrap in a safe helper or use guards:.
digest: 66c612c5791501e7e712808f4d46000f938bdbbef24d52ef71a70a1b8efb8fcf
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Wrap in a safe helper or use guards:..
vector_summary: Wrap in a safe helper or use guards:.
chapter: CH-05
:::
Wrap in a safe helper or use guards:
:::

::: concept
id: BLK-831a0270acb78581
summary: Full := concat(".", array.concat(path, [field])) if { is_array(path) is_string(field) }.
digest: 35eda475a49d874d3fa75cbcca5f0ae2426684cbb68fffe23a2b96653cace8cf
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Full := concat(".", array.concat(path, [field])) if { is_array(path) is_string(field) }..
vector_summary: Full := concat(".", array.concat(path, [field])) if { is_array(path) is_string(field) }.
chapter: CH-05
:::
full := concat(".", array.concat(path, [field])) if { is_array(path) is_string(field) }
:::

::: concept
id: BLK-55ada30082a8703f
summary: Allowed if { id := sprintf("%v", [input.user.id]) id == data.allowed_ids[_] }.
digest: d5eb7cd0abaa9f5cb5a421937ef00101a254cbc75aea38b30ada7a158806ab5d
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Allowed if { id := sprintf("%v", [input.user.id]) id == data.allowed_ids[_] }..
vector_summary: Allowed if { id := sprintf("%v", [input.user.id]) id == data.allowed_ids[_] }.
chapter: CH-05
:::
allowed if { id := sprintf("%v", [input.user.id]) id == data.allowed_ids[_] }
:::

::: concept
id: BLK-b5937dcce3d0252f
summary: X in y behaves differently depending on whether y is an array, set, or object.
digest: 1a2822f04291ef0bc337b3950ea8e421e044ec1e9f2bc7404e4600ba43410229
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that X in y behaves differently depending on whether y is an array, set, or object..
vector_summary: X in y behaves differently depending on whether y is an array, set, or object.
chapter: CH-05
:::
x in y behaves differently depending on whether y is an array, set, or object.
:::

::: concept
id: BLK-79448506eb420437
summary: Array: x in ["a", "b"].
digest: 4c7e75e7d1f31d58611e3fede8a5afa67757091290947a86624abdbd677bcedb
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Array: x in ["a", "b"]..
vector_summary: Array: x in ["a", "b"].
chapter: CH-05
:::
Array: x in ["a", "b"]
:::

::: concept
id: BLK-b7157bcb8e94b0ed
summary: Set: x in {"a", "b"}.
digest: 89d3f30e7ab6d4c658f7ef0ff520a357f4354eb780d4399f8b1f06f0b3b2a8cd
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Set: x in {"a", "b"}..
vector_summary: Set: x in {"a", "b"}.
chapter: CH-05
:::
Set: x in {"a", "b"}
:::

::: concept
id: BLK-2e17d5deecfb16e9
summary: Object: k in {"a": 1} matches keys, not values.
digest: 8d2da194a4568f23b534c429989b0ca16e03bf732347fe7f2c78e4e83b045348
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Object: k in {"a": 1} matches keys, not values..
vector_summary: Object: k in {"a": 1} matches keys, not values.
chapter: CH-05
:::
Object: k in {"a": 1} matches keys, not values.
:::

::: concept
id: BLK-d2517da8161f68a7
summary: Be explicit about what you mean:.
digest: caefbb767c1220c464d52c432363ffd1a62d373c4bc3910f11360e7eaa3106c8
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Be explicit about what you mean:..
vector_summary: Be explicit about what you mean:.
chapter: CH-05
:::
Be explicit about what you mean:
:::

::: concept
id: BLK-c6c12d42e06d1082
summary: # Key membership "k1" in {"k1": 1, "k2": 2}.
digest: 89c699542f51a7298523e1b98ced896673a4ef40c9c63ee4e9bb35165421a6f6
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that # Key membership "k1" in {"k1": 1, "k2": 2}..
vector_summary: # Key membership "k1" in {"k1": 1, "k2": 2}.
chapter: CH-05
:::
# Key membership "k1" in {"k1": 1, "k2": 2}
:::

::: concept
id: BLK-352021e25dd18271
summary: # Value membership – convert to set/array some v in {v | some k; v := obj[k]; v == "needle"}.
digest: 87a7c2e5a6fd57a39e05eb954e8150c1d02753914e0b1c7d2067c32ca4b04e87
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that # Value membership – convert to set/array some v in {v | some k; v := obj[k]; v == "needle"}..
vector_summary: # Value membership – convert to set/array some v in {v | some k; v := obj[k]; v == "needle"}.
chapter: CH-05
:::
# Value membership – convert to set/array some v in {v | some k; v := obj[k]; v == "needle"}
:::

::: concept
id: BLK-5178d3c470aafde0
summary: Pre-index large data sets offline (e.g., data.events_by_ip[ip]).
digest: c392cafb15fc51402c65c9cd167e2caac4758a8731d641ee24562fd1734fe7b3
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Pre-index large data sets offline (e.g., data.events_by_ip[ip])..
vector_summary: Pre-index large data sets offline (e.g., data.events_by_ip[ip]).
chapter: CH-05
:::
Pre-index large data sets offline (e.g., data.events_by_ip[ip]).
:::

::: concept
id: BLK-99693fd9c0631dc9
summary: Use sets for membership checks.
digest: 1ddd194407ab3b5e68483451f57b0ed0075b93934769cb416130d949b3fa6835
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Use sets for membership checks..
vector_summary: Use sets for membership checks.
chapter: CH-05
:::
Use sets for membership checks.
:::

::: concept
id: BLK-89b4222f574f5bd8
summary: # Precomputed: data.events_by_ip = { "1.2.3.4": true, ..
digest: 9ef8a9534a708b909f60eefab4315757a44fde07056764d1a94dfeb3ee15d72f
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that # Precomputed: data.events_by_ip = { "1.2.3.4": true, ...
vector_summary: # Precomputed: data.events_by_ip = { "1.2.3.4": true, ..
chapter: CH-05
:::
# Precomputed: data.events_by_ip = { "1.2.3.4": true, ... }
:::

::: concept
id: BLK-2b4b1821e0d0db43
summary: Deny if { data.events_by_ip[input.client_ip] }.
digest: f70625e43c93643bb2f4837c294f701681555d23fc44754eadf13d48bf41e824
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Deny if { data.events_by_ip[input.client_ip] }..
vector_summary: Deny if { data.events_by_ip[input.client_ip] }.
chapter: CH-05
:::
deny if { data.events_by_ip[input.client_ip] }
:::

::: concept
id: BLK-b992c588b72a15d0
summary: Push pattern constraints into data modeling if possible.
digest: bb87d62f1338705cc00a5e3a1b4c4a115a7910af77c802441462335018c81bde
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Push pattern constraints into data modeling if possible..
vector_summary: Push pattern constraints into data modeling if possible.
chapter: CH-05
:::
Push pattern constraints into data modeling if possible.
:::

::: concept
id: BLK-a62e5ffefca78bb2
summary: Limit regex to narrow fields and avoid complex patterns.
digest: fc7a4f0c119df49e9c65e902320aaaa0da7a30d7cd077ed5a4623d19cf3cc4b5
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Limit regex to narrow fields and avoid complex patterns..
vector_summary: Limit regex to narrow fields and avoid complex patterns.
chapter: CH-05
:::
Limit regex to narrow fields and avoid complex patterns.
:::

::: concept
id: BLK-a0d6a6b70fe5fdb9
summary: Precompile filters into simpler checks (startswith, contains equivalent logic).
digest: 82ef46460bbd40f12ae62350e012a1ed3fe6116231ce806ed8b20f77b50b1ec6
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Precompile filters into simpler checks (startswith, contains equivalent logic)..
vector_summary: Precompile filters into simpler checks (startswith, contains equivalent logic).
chapter: CH-05
:::
Precompile filters into simpler checks (startswith, contains equivalent logic).
:::

::: concept
id: BLK-d2bdd9db4aebc3a8
summary: Bind once and reuse:.
digest: 11ea54608b8203a565645aa0ee7026ba6364646e40cdc08475fdf9ba2ea6f483
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Bind once and reuse:..
vector_summary: Bind once and reuse:.
chapter: CH-05
:::
Bind once and reuse:
:::

::: concept
id: BLK-637e77339c5814ec
summary: Deny if { name := input.user.name re_match("admin", name) some p in data.profiles # reuse name without extra call }.
digest: 37aff4f01cad3bd485cdb87c1e351e80cc4737c46df4df2365dc3b28edb11932
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Deny if { name := input.user.name re_match("admin", name) some p in data.profiles # reuse name without extra call }..
vector_summary: Deny if { name := input.user.name re_match("admin", name) some p in data.profiles # reuse name without extra call }.
chapter: CH-05
:::
deny if { name := input.user.name re_match("admin", name) some p in data.profiles # reuse name without extra call }
:::

::: concept
id: BLK-8824da1c32a641ad
summary: You can also use helper functions for complex computations.
digest: 509b26879c4d5be41fe33a4390569a098cf988b69b79020fa8ce9828b95696c5
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that You can also use helper functions for complex computations..
vector_summary: You can also use helper functions for complex computations.
chapter: CH-05
:::
You can also use helper functions for complex computations.
:::

::: concept
id: BLK-13991d114e5dea7e
summary: Evaluating large, mostly static policies at runtime:.
digest: da5d71e852efa8434611d7712f7454df9aab4b058989191f61f28233d48914da
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Evaluating large, mostly static policies at runtime:..
vector_summary: Evaluating large, mostly static policies at runtime:.
chapter: CH-05
:::
Evaluating large, mostly static policies at runtime:
:::

::: concept
id: BLK-52bb492156ce1912
summary: If most config is static, bake it into data and use partial evaluation:.
digest: 0184be72b6bcdff87280ed45e2e41785b6ca3102eb92ea49e8e65d95c483a8e9
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that If most config is static, bake it into data and use partial evaluation:..
semantic_categories: [performance]
vector_summary: If most config is static, bake it into data and use partial evaluation:.
graph_neighbors: [TERM-77eaf07b79028829, TERM-2e68e77273483d64]
graph_degree: 2
graph_two_hop: []
graph_three_hop: []
chapter: CH-05
:::
If most config is static, bake it into data and use partial evaluation:
:::

::: concept
id: BLK-0ce0885ddcf9ff4e
summary: Then pass only request-specific input and reap the performance benefits.
digest: 658d7510f4afe2dd690b2c5fcdcb16dc98603b29a0cee94a5a731f791ee64341
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Then pass only request-specific input and reap the performance benefits..
vector_summary: Then pass only request-specific input and reap the performance benefits.
graph_neighbors: [TERM-fa93cc1275da4b1d]
graph_degree: 1
graph_two_hop: []
graph_three_hop: []
chapter: CH-05
:::
Then pass only request-specific input and reap the performance benefits.
:::

::: concept
id: BLK-1b7adba70540b67a
summary: Walk is powerful but traverses entire trees.
digest: 44291cbc0014dce918a97775deacb39ee04c1b9e588e4d6b7f492e70351c0e61
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Walk is powerful but traverses entire trees..
vector_summary: Walk is powerful but traverses entire trees.
chapter: CH-05
:::
walk is powerful but traverses entire trees. Instead:
:::

::: concept
id: BLK-a7dbd4176f57e16c
summary: Narrow the search to known subtrees.
digest: a17d3f25e1a11b2bba018caf9a74b7928531158a5c69631852388e74616a3cc4
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Narrow the search to known subtrees..
vector_summary: Narrow the search to known subtrees.
chapter: CH-05
:::
Narrow the search to known subtrees.
:::

::: concept
id: BLK-223e103f0ca5d229
summary: Maintain dedicated indexes for sensitive values.
digest: 0073f43efaf0f3222903c4bddc9b751dc847ce44d815135369000a44fe3d9f4f
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Maintain dedicated indexes for sensitive values..
vector_summary: Maintain dedicated indexes for sensitive values.
chapter: CH-05
:::
Maintain dedicated indexes for sensitive values.
:::

::: concept
id: BLK-f467d2011eab9dfc
summary: Use more structured queries instead of full traversal.
digest: 62e6370e0f60cc34002000095751f3bf7505c07b75e7219dec9cef9bf13e4328
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Use more structured queries instead of full traversal..
vector_summary: Use more structured queries instead of full traversal.
chapter: CH-05
:::
Use more structured queries instead of full traversal.
:::

::: concept
id: BLK-981ffefdcd4afb94
summary: Import data.utils as u.
digest: 3a3dcb90aa9b35fb024b4fcc68411fb37953655dc2edf356f1642853f0d14045
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Import data.utils as u..
vector_summary: Import data.utils as u.
chapter: CH-05
:::
import data.utils as u
:::

::: concept
id: BLK-bc5639f652d5d406
summary: This is your best current built-in tool.
digest: fb26d700eeca89ceca3a85ce09ef256489d4f79c55e4eb09ef8ac0596de71f5c
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that This is your best current built-in tool..
vector_summary: This is your best current built-in tool.
chapter: CH-05
:::
This is your best current built-in tool.
:::

::: concept
id: BLK-b9153a25532c29d8
summary: Unused function parameters.
digest: b9cf914deb8b68395b42c06b53854f53f6023a2a646ffa13ceebe5fc775938b6
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Unused function parameters..
vector_summary: Unused function parameters.
chapter: CH-05
:::
unused function parameters
:::

::: concept
id: BLK-eca62ba9be73fa32
summary: …but NOT unused imports.
digest: 1fa6da6fa5b4f4bba69bfd2e86351430be83a699b3d9fa3135728ee99d9f7c99
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that …but NOT unused imports..
vector_summary: …but NOT unused imports.
chapter: CH-05
:::
…but NOT unused imports.
:::

::: concept
id: BLK-677d05531da1a273
summary: Still, it improves safety and catches 80% of redundant logic issues.
digest: 55014ed0d9d055b3ac83e01e238046860a45226a50668a3f4a5d5886971ad616
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Still, it improves safety and catches 80% of redundant logic issues..
vector_summary: Still, it improves safety and catches 80% of redundant logic issues.
chapter: CH-05
:::
Still, it improves safety and catches 80% of redundant logic issues.
:::

::: concept
id: BLK-1a7182fdc95d78a0
summary: Several teams build a custom linter using rgl, conftest, or their own parser.
digest: ef48127ad0395f426c3b49ef5d6e78f6014649aa0741e48690b5f013da8ac152
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Several teams build a custom linter using rgl, conftest, or their own parser..
vector_summary: Several teams build a custom linter using rgl, conftest, or their own parser.
chapter: CH-05
:::
Several teams build a custom linter using rgl, conftest, or their own parser.
:::

::: concept
id: BLK-15363c301ec7d7cb
summary: The best available tool today is:.
digest: 767d68ceaedb59ec9ef7625c94fb6c7fb4b5c3a0e7ad9f38bf31dac829870273
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that The best available tool today is:..
vector_summary: The best available tool today is:.
chapter: CH-05
:::
The best available tool today is:
:::

::: concept
id: BLK-c888ec6fcbcc9a8d
summary: GitHub: https://github.com/GearPlug/rgl (community linter).
digest: 24a3c1f567a3fb65e229263826ca9c0d50d4a2e3b2a72fd611f8e60bd5111c37
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that GitHub: https://github.com/GearPlug/rgl (community linter)..
vector_summary: GitHub: https://github.com/GearPlug/rgl (community linter).
chapter: CH-05
:::
GitHub: https://github.com/GearPlug/rgl (community linter)
:::

::: concept
id: BLK-1e5b7b422e5753f5
summary: Unused local variables.
digest: 3fb9f808b14bdecf82b93aac0ec3754fddb4193faa4f11ee693b479a22b96623
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Unused local variables..
vector_summary: Unused local variables.
chapter: CH-05
:::
unused local variables
:::

::: concept
id: BLK-96e5ec08b719db94
summary: Recommend adding this to CI.
digest: 2857e98445564d345afc939b0c580b58d98ab11c4378e87af6ea5b202dfaf073
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Recommend adding this to CI..
vector_summary: Recommend adding this to CI.
chapter: CH-05
:::
Recommend adding this to CI.
:::

::: concept
id: BLK-8aab5191c0a4c854
summary: Unnecessary negations.
digest: 1a9c92e9051189cd204d22c623e614cac2612ed4affa9907918ce3c9c3163082
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Unnecessary negations..
semantic_categories: [negation]
vector_summary: Unnecessary negations.
chapter: CH-05
:::
unnecessary negations
:::

::: concept
id: BLK-e671dc0247adca2d
summary: Inefficient comprehensions.
digest: 1cad3ce7e8a9c61cb4f4a4209adc231e9258f06467d1a653787b6c7182447bed
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Inefficient comprehensions..
vector_summary: Inefficient comprehensions.
graph_neighbors: [CODE-2cbe0767daa4b7a0]
graph_degree: 1
graph_two_hop: []
graph_three_hop: []
chapter: CH-05
:::
inefficient comprehensions
:::

::: concept
id: BLK-88cc3f7309a3f03e
summary: This is the gold standard for production environments but requires paid DAS.
digest: 8df6c0cea1ebe5830659a09218e59c94ed71df0f360bde95926ef0ccd344e2bb
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that This is the gold standard for production environments but requires paid DAS..
vector_summary: This is the gold standard for production environments but requires paid DAS.
chapter: CH-05
:::
This is the gold standard for production environments but requires paid DAS.
:::

::: concept
id: BLK-3ded27af0667e46d
summary: If you’re using Cursor, the best workflow is:.
digest: 1d030f6a4cef62eea64bf26fb1a3ff8990254388be8686c93ba8e6155b9fac52
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that If you’re using Cursor, the best workflow is:..
vector_summary: If you’re using Cursor, the best workflow is:.
chapter: CH-05
:::
If you’re using Cursor, the best workflow is:
:::

::: concept
id: BLK-01855145c4052297
summary: Import ([^ ]+)( as [^ ]+)? // highlight if alias is unused.
digest: 889de90d613eda7cc335c91329a8fa6998357083a3ffad7330aeb1008e90f147
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Import ([^ ]+)( as [^ ]+)? // highlight if alias is unused..
vector_summary: Import ([^ ]+)( as [^ ]+)? // highlight if alias is unused.
chapter: CH-05
:::
import ([^ ]+)( as [^ ]+)? // highlight if alias is unused
:::

::: concept
id: BLK-e91de7f88c47fe02
summary: Cursor can highlight this dynamically.
digest: 37eb878f5682725e4f6d48923ed5c5b9c52a5f6f14c94a6f8b7dc5673fceb43b
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Cursor can highlight this dynamically..
vector_summary: Cursor can highlight this dynamically.
chapter: CH-05
:::
Cursor can highlight this dynamically.
:::

::: concept
id: BLK-27062c2f2ad4bea0
summary: Import data.services.*.
digest: 11f1209f73dc1fa78b09c19b4636215d18de30214e0345c8a5f2bbf7949f8d3d
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Import data.services.*..
vector_summary: Import data.services.*.
chapter: CH-05
:::
import data.services.*
:::

::: concept
id: BLK-bf8a85428b528a50
summary: Harder to detect unused segments.
digest: fc2845ab4213d1f885f9cedd04279cfe3a21d800a8bfde4a66dc82cbb1b65b0f
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Harder to detect unused segments..
vector_summary: Harder to detect unused segments.
chapter: CH-05
:::
Harder to detect unused segments
:::

::: concept
id: BLK-9a8c8c3ad33b8ee2
summary: Harder to find where names come from.
digest: a1377d5eb07eeef9b84ac07048e599da537a7a5f4682ddfe2e0dd959e5248cfc
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Harder to find where names come from..
vector_summary: Harder to find where names come from.
chapter: CH-05
:::
Harder to find where names come from
:::

::: concept
id: BLK-0fc3cbba44a5ab8b
summary: Encourages shotgun imports.
digest: 58f556c7ccade87fdae348acd63356f53542cf3ef4a3d95601d4a9a32ee22679
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Encourages shotgun imports..
vector_summary: Encourages shotgun imports.
chapter: CH-05
:::
Encourages shotgun imports
:::

::: concept
id: BLK-a55c36241eba7524
summary: Import data.services.crm.allow import data.shared.strings as str import data.shared.constants.
digest: 6f60436d5f1ac893c6a2d73912ded8b0e79ddb003cd3c412bfcf10a6f23bc675
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Import data.services.crm.allow import data.shared.strings as str import data.shared.constants..
vector_summary: Import data.services.crm.allow import data.shared.strings as str import data.shared.constants.
chapter: CH-05
:::
import data.services.crm.allow import data.shared.strings as str import data.shared.constants
:::

::: concept
id: BLK-442aa4acd401c5ce
summary: Here is the enterprise-grade script:
digest: bb74d20cd6a7b4766beb68a0788c50dcb3ed61972678eec7451458c9cb4b15ef
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Here is the enterprise-grade script:.
vector_summary: Here is the enterprise-grade script:
chapter: CH-05
:::
Here is the enterprise-grade script:
:::

::: concept
id: BLK-befcf2864cbe4ba2
summary: .ci/lint_unused_imports.sh #!/usr/bin/env bash.
digest: 539a41e3c30e12a1d0fdb34fb41aecd31673b846c2513bd550e115dad89e9419
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that .ci/lint_unused_imports.sh #!/usr/bin/env bash..
vector_summary: .ci/lint_unused_imports.sh #!/usr/bin/env bash.
chapter: CH-05
:::
.ci/lint_unused_imports.sh #!/usr/bin/env bash
:::

::: concept
id: BLK-4e06b56bed56546c
summary: Echo "✓ No unused imports".
digest: b07160ecfcd17ce8b5f6bf60752f9e821ee48324be2ecdc4f6a3387dbd2f2363
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Echo "✓ No unused imports"..
vector_summary: Echo "✓ No unused imports".
chapter: CH-05
:::
echo "✓ No unused imports"
:::

::: concept
id: BLK-bd36eb180f9a0870
summary: A small jq filter to detect unused imports.
digest: ae28c04efb016bccc12d398a96a869319e4e1a1d104f53a91e4047ebc93d1a27
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that A small jq filter to detect unused imports..
vector_summary: A small jq filter to detect unused imports.
chapter: CH-05
:::
a small jq filter to detect unused imports
:::

::: concept
id: BLK-0f79a0a4b3796507
summary: This is currently the single best approach that works reliably as of 2024–2025.
digest: c35f1ef219280ea494e2426182ce8bbabff3e554abd1f95c5b5dfa08f75e3586
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that This is currently the single best approach that works reliably as of 2024–2025..
vector_summary: This is currently the single best approach that works reliably as of 2024–2025.
chapter: CH-05
:::
This is currently the single best approach that works reliably as of 2024–2025.
:::

::: concept
id: BLK-6f78ccb1a2aa0db5
summary: The best lifecycle is:.
digest: 7cc2c76fb5bd499d18a308cde35b05629f5aaea33083d05cd0312c2a096bd0ba
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that The best lifecycle is:..
vector_summary: The best lifecycle is:.
chapter: CH-05
:::
The best lifecycle is:
:::

::: concept
id: BLK-fe348bf4a59d3eca
summary: Confusing during refactors.
digest: 610b3326a12ee3c32b31ec5c95536e889563ef0f71aead1f313d85beb143f15f
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Confusing during refactors..
vector_summary: Confusing during refactors.
chapter: CH-05
:::
confusing during refactors
:::

::: concept
id: BLK-8bcbd5638e8f2f52
summary: ✔️ I would keep the import ✔️ and update the test to reference it explicitly: import data.compliance.tech_debt.
digest: 86dec04dad635dfe973d29d37c8d7d097a3f000e61f29b8e3daf3ee54ff25297
symbol_refs: []
semantic_role: reference
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that ✔️ I would keep the import ✔️ and update the test to reference it explicitly: import data.compliance.tech_debt..
vector_summary: ✔️ I would keep the import ✔️ and update the test to reference it explicitly: import data.compliance.tech_debt.
chapter: CH-05
:::
✔️ I would keep the import ✔️ and update the test to reference it explicitly: import data.compliance.tech_debt
:::

::: concept
id: BLK-811010e43f08ad56
summary: Count(tech_debt.warn) == 0 with input as mock_input.
digest: d8e5864bc061b514f5652aa80a6ff6b3dfe9a31014fc7a2f96ffad1cc6bcb9c2
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Count(tech_debt.warn) == 0 with input as mock_input..
vector_summary: Count(tech_debt.warn) == 0 with input as mock_input.
chapter: CH-05
:::
count(tech_debt.warn) == 0 with input as mock_input
:::

::: concept
id: BLK-402d3ae84b7a6ec5
summary: This is the safest, clearest, least ambiguous long-term behavior.
digest: 346045c06dd883933cb428997906ef3d489992a7330b4fa3cc86235323635480
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that This is the safest, clearest, least ambiguous long-term behavior..
vector_summary: This is the safest, clearest, least ambiguous long-term behavior.
chapter: CH-05
:::
This is the safest, clearest, least ambiguous long-term behavior.
:::

::: concept
id: BLK-8912a891da49a895
summary: 🧠 Short Answer You Requested (Concise Explanation).
digest: 06635f550ce94944b247270c01578b1ee6fefb5b8cc854663e416877dbfd424a
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that 🧠 Short Answer You Requested (Concise Explanation)..
vector_summary: 🧠 Short Answer You Requested (Concise Explanation).
chapter: CH-05
:::
🧠 Short Answer You Requested (Concise Explanation)
:::

::: concept
id: BLK-a0487d3cbb802b3d
summary: However, the better practice is to reference the import explicitly (e.g., tech_debt.warn) to avoid ambiguity with other packages that might define ...
digest: 0acb7a7ceeb8e896a848ac78bd12972c0f7c73c20ecffd27bc5e7cb81431f12e
symbol_refs: []
semantic_role: reference
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that However, the better practice is to reference the import explicitly (e.g., tech_debt.warn) to avoid ambiguity with other packages that might define ....
vector_summary: However, the better practice is to reference the import explicitly (e.g., tech_debt.warn) to avoid ambiguity with other packages that might define ...
chapter: CH-05
:::
However, the better practice is to reference the import explicitly (e.g., tech_debt.warn) to avoid ambiguity with other packages that might define warn.
:::

::: concept
id: BLK-46c7fbb1283483ac
summary: Every test module in tests/ → evaluated with the loaded data.
digest: 951ee766592a2201d343a7ece8caad4385a868becb990dd3dcd7aa7b88ea07a4
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Every test module in tests/ → evaluated with the loaded data..
vector_summary: Every test module in tests/ → evaluated with the loaded data.
chapter: CH-05
:::
every test module in tests/ → evaluated with the loaded data
:::

::: concept
id: BLK-f4849492414ac27e
summary: How warn is resolved.
digest: 552080ced40cc2d7f27fc1e864b8510b4f961cfc6982565e9d33dfe51bd57ffb
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that How warn is resolved..
vector_summary: How warn is resolved.
chapter: CH-05
:::
2. How warn is resolved
:::

::: concept
id: BLK-e496ef913bfa6596
summary: When the test evaluates:.
digest: c6efe386626afa394a254570adcd68d672f30be902e833be8dba0be941aa160e
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that When the test evaluates:..
vector_summary: When the test evaluates:.
chapter: CH-05
:::
When the test evaluates:
:::

::: concept
id: BLK-c83570b0bab95162
summary: Does the test file define a local variable named warn? No.
digest: b3b48fff41012fc1e4f83c7d2ee698796b94bf26cc4bc6513cca6e3a4c46c715
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Does the test file define a local variable named warn? No..
vector_summary: Does the test file define a local variable named warn? No.
chapter: CH-05
:::
Does the test file define a local variable named warn? No.
:::

::: concept
id: BLK-cdba5783ce8acf92
summary: Does the file import something named warn? No.
digest: 19f45efc7a98f2f88446c0150a50cc9058931110fe54116047297fc18c6de8fb
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Does the file import something named warn? No..
vector_summary: Does the file import something named warn? No.
chapter: CH-05
:::
Does the file import something named warn? No.
:::

::: concept
id: BLK-522dcd428818f34e
summary: Thus, the test works, but….
digest: a634820b3ba8ac0171afab8f3e682c90c572102f5c5947428a52209c3d36ba06
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Thus, the test works, but…..
vector_summary: Thus, the test works, but….
chapter: CH-05
:::
Thus, the test works, but…
:::

::: concept
id: BLK-87787a835dbfdc8d
summary: ⚠️ Why this is risky.
digest: 6a9c12065922d1f9cf261ce857db15b6837e534548ba5147eb64a40fb2e5ea4f
symbol_refs: []
semantic_role: warning
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that ⚠️ Why this is risky..
vector_summary: ⚠️ Why this is risky.
chapter: CH-05
:::
⚠️ Why this is risky
:::

::: concept
id: BLK-03e7fcc4768817d5
summary: If tomorrow someone adds:.
digest: 2214caaaebf7ed44295f044f055221355ee64a39b55b1f3bd95e5e081d822a77
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that If tomorrow someone adds:..
vector_summary: If tomorrow someone adds:.
chapter: CH-05
:::
If tomorrow someone adds:
:::

::: concept
id: BLK-8751d75b24bfe192
summary: Package compliance.sample warn { ..
digest: 2df839e245162c45464ef9a9d8a219826c8093173afe9b118a484546686056a9
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Package compliance.sample warn { ...
vector_summary: Package compliance.sample warn { ..
chapter: CH-05
:::
package compliance.sample warn { ... }
:::

::: concept
id: BLK-b78146783f0378c4
summary: Warn becomes ambiguous,.
digest: 3dce23ad3981cfc04041f726019b5abfbb845db555f239491a2e07a443a30f37
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Warn becomes ambiguous,..
vector_summary: Warn becomes ambiguous,.
chapter: CH-05
:::
warn becomes ambiguous,
:::

::: concept
id: BLK-0677b2d89a2bb634
summary: Tests start failing, or.
digest: 38424ec2c3d4e60d1e25eea8aef15958108c3f10d8c9a5bdc8add84798711708
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Tests start failing, or..
vector_summary: Tests start failing, or.
chapter: CH-05
:::
tests start failing, or
:::

::: concept
id: BLK-c93c5530af136464
summary: Count(tech_debt.warn) == 0.
digest: 21375de034bfc32cdd9a6c2b26c70a38af924d3139d599c144010f94e8df898f
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Count(tech_debt.warn) == 0..
vector_summary: Count(tech_debt.warn) == 0.
chapter: CH-05
:::
count(tech_debt.warn) == 0
:::

::: concept
id: BLK-d0196af4f922ba99
summary: ✔️ Even safer if using as.
digest: 77673db38f6e4c0b73096486ece4130ab1d508e01989444ad9fddbf6dfd3c4cf
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that ✔️ Even safer if using as..
vector_summary: ✔️ Even safer if using as.
chapter: CH-05
:::
✔️ Even safer if using as
:::

::: concept
id: BLK-471eebb35854e544
summary: Import data.compliance.tech_debt as td.
digest: 8f20534809d47c9c8e1d50734293b660df0a7d250f0ac2005024ef8762cb14a8
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Import data.compliance.tech_debt as td..
vector_summary: Import data.compliance.tech_debt as td.
chapter: CH-05
:::
import data.compliance.tech_debt as td
:::

::: concept
id: BLK-033ecc50bad86de4
summary: You removed it, and the tests still worked.
digest: bba23add2515489813fb6ec835f51f5f49b9b45cf092abf06e5243c3622887ca
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that You removed it, and the tests still worked..
vector_summary: You removed it, and the tests still worked.
chapter: CH-05
:::
You removed it, and the tests still worked.
:::

::: concept
id: BLK-56fc64cdaff7a3ab
summary: ✔️ Why tests still work.
digest: e0658add533a10ea9a2597d5ab8655b64e8d6f69be641f98c85f5d79e5d1bd30
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that ✔️ Why tests still work..
vector_summary: ✔️ Why tests still work.
chapter: CH-05
:::
✔️ Why tests still work
:::

::: concept
id: BLK-2c1d51f4e5a960ff
summary: The tests reference warn without a package prefix:.
digest: 583de269a9259f9ab93ccc685ef52ddff36c19b68d9666782d9b3c300995d039
symbol_refs: []
semantic_role: reference
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that The tests reference warn without a package prefix:..
vector_summary: The tests reference warn without a package prefix:.
chapter: CH-05
:::
The tests reference warn without a package prefix:
:::

::: concept
id: BLK-c332a68f35c8a3ec
summary: data.compliance.tech_debt.warn
digest: 381079c58d59529311201c9324d821b7f98bb07eca26c132fdc4e49fcdf835f9
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that data.compliance.tech_debt.warn.
vector_summary: data.compliance.tech_debt.warn
chapter: CH-05
:::
data.compliance.tech_debt.warn
:::

::: concept
id: BLK-1601cc39b76cae1a
summary: So the import is indeed unused, and removing it does not break the test in the current setup.
digest: 5861eed5e2f075a9dffb01e360ca379999a3999785fd7c2ddc7a0404c8b0b121
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that So the import is indeed unused, and removing it does not break the test in the current setup..
vector_summary: So the import is indeed unused, and removing it does not break the test in the current setup.
chapter: CH-05
:::
So the import is indeed unused, and removing it does not break the test in the current setup.
:::

::: concept
id: BLK-2c388bc6691a4f51
summary: ⚠️ But removing it is NOT the best practice.
digest: b75275091703a15efd9ee17cd65f03a78ca72d216b1bd28404d5ead6491723e8
symbol_refs: []
semantic_role: warning
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that ⚠️ But removing it is NOT the best practice..
vector_summary: ⚠️ But removing it is NOT the best practice.
chapter: CH-05
:::
⚠️ But removing it is NOT the best practice
:::

::: concept
id: BLK-dead8fc635007af0
summary: Even though the import is unused now, this approach is fragile.
digest: 1bcd6a1450d9a7d3f9dca09ca03533381303213c592fbd7feed618b34e4ac60d
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Even though the import is unused now, this approach is fragile..
vector_summary: Even though the import is unused now, this approach is fragile.
chapter: CH-05
:::
Even though the import is unused now, this approach is fragile.
:::

::: concept
id: BLK-b0975f5a5f83bad3
summary: Example: If another policy someday adds:.
digest: 3a953ba8439564ab53d7ff4729296a01725d960ee9ddeaf752764f54d0ab1ad2
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Example: If another policy someday adds:..
vector_summary: Example: If another policy someday adds:.
chapter: CH-05
:::
Example: If another policy someday adds:
:::

::: concept
id: BLK-98a5e27b479b7275
summary: Package compliance.security warn { ..
digest: 70492af4f601752d521fb93bffd05f12a5d4fa36549bb1240f2637945e84e4dc
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Package compliance.security warn { ...
vector_summary: Package compliance.security warn { ..
chapter: CH-05
:::
package compliance.security warn { ... }
:::

::: concept
id: BLK-c16b774f244e504a
summary: Give unpredictable results.
digest: 5dc304509268cf0ccd78ff45a454d2519e275d572e4a5930edf850f3c31b6745
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Give unpredictable results..
vector_summary: Give unpredictable results.
chapter: CH-05
:::
give unpredictable results
:::

::: concept
id: BLK-cf07614973daa160
summary: Tests become context‐dependent.
digest: 1071cae6b0f1f6377d9ee61176cfe077d5e503649c1662e7c3f7c9d062c1a43b
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Tests become context‐dependent..
vector_summary: Tests become context‐dependent.
chapter: CH-05
:::
2. Tests become context‐dependent
:::

::: concept
id: BLK-f3ae62e558c8b1ba
summary: Not explicit → Not safe in enterprise systems.
digest: 796b07bdbd3d2e93d6fde9233423447770c1577a798be18f19497bf60801971b
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Not explicit → Not safe in enterprise systems..
vector_summary: Not explicit → Not safe in enterprise systems.
chapter: CH-05
:::
3. Not explicit → Not safe in enterprise systems
:::

::: concept
id: BLK-1e9f46006e81b12b
summary: Instead: Use explicit, namespaced references in all tests.
digest: f9ab630f9664483d9eaa25771e43a26b32d5166c9f61dedfceecbbda12871a97
symbol_refs: []
semantic_role: reference
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Instead: Use explicit, namespaced references in all tests..
vector_summary: Instead: Use explicit, namespaced references in all tests.
chapter: CH-05
:::
Instead: Use explicit, namespaced references in all tests.
:::

::: concept
id: BLK-6f8c40f9057e8541
summary: Formal Recommendation (Chapter 7.2.1):.
digest: 2d74bf6a47ca1ddb792b801920d9912e16791aeb5df48e117ed8831c69f2552b
symbol_refs: [Formal Recommendation (Chapter 7.2.1):]
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Formal Recommendation (Chapter 7.2.1):..
vector_summary: Formal Recommendation (Chapter 7.2.1):.
chapter: CH-05
:::
**Formal Recommendation (Chapter 7.2.1):**
:::

::: concept
id: BLK-065b5e4f94f9236b
summary: 🛠️ Recommended Final Fix for your file Instead of removing the unused import: Fix the test to reference it: package compliance.tech_debt_r14_test.
digest: b09e9b494404eb1d15b4d5a0860b4b29200522d16772698925e2b26ca7b37c3d
symbol_refs: []
semantic_role: reference
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that 🛠️ Recommended Final Fix for your file Instead of removing the unused import: Fix the test to reference it: package compliance.tech_debt_r14_test..
vector_summary: 🛠️ Recommended Final Fix for your file Instead of removing the unused import: Fix the test to reference it: package compliance.tech_debt_r14_test.
chapter: CH-05
:::
🛠️ Recommended Final Fix for your file Instead of removing the unused import: Fix the test to reference it: package compliance.tech_debt_r14_test
:::

::: concept
id: BLK-18bcb7950f8dcf72
summary: Does not produce a newline.
digest: a4a1ea296cb01b19e600da876c6fbfb33be3528ccd8983949ed33267693eb6ed
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Does not produce a newline..
vector_summary: Does not produce a newline.
chapter: CH-05
:::
does not produce a newline.
:::

::: concept
id: BLK-a75307e7442dd9e9
summary: \n is literal backslash + “n”.
digest: a54fa6ad40d0d8c1349fc9a0175da67a71045e12bc27795d0dd1fdcc204c461d
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that \n is literal backslash + “n”..
vector_summary: \n is literal backslash + “n”.
chapter: CH-05
:::
\n is literal backslash + “n”
:::

::: concept
id: BLK-c91a17469e570904
summary: NOT matched by regex patterns expecting real newlines or multi-line content.
digest: 4613249a8c32494b12bc759d0c2a94a823930e80c0362b33fefabf98322f0531
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that NOT matched by regex patterns expecting real newlines or multi-line content..
vector_summary: NOT matched by regex patterns expecting real newlines or multi-line content.
chapter: CH-05
:::
NOT matched by regex patterns expecting real newlines or multi-line content
:::

::: concept
id: BLK-2a6fca36dc1d9152
summary: NOT iterated the same way.
digest: 92bbf29816eb6d26da379fa21052f007770a920eae1fea2fdea741d9f9309024
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that NOT iterated the same way..
vector_summary: NOT iterated the same way.
chapter: CH-05
:::
NOT iterated the same way
:::

::: concept
id: BLK-db4ad97b2c59bf89
summary: So your regex patterns such as:.
digest: e6dcf869197e70d4abe513332c9b4310f0914b3120425a60c3571cd688aea2d7
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that So your regex patterns such as:..
vector_summary: So your regex patterns such as:.
chapter: CH-05
:::
So your regex patterns such as:
:::

::: concept
id: BLK-533b2ce56a96a5b1
summary: Regex.match("//\\s*TODO:", file.diff) regex.match("-.*TODO:", file.diff) regex.match("TODO:[\\s\\S]*TODO:", file.diff).
digest: 30eaa4e13653d001f25baaf893f56cddc99b761d4fd7a29cbb97dd5e16c90584
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Regex.match("//\\s*TODO:", file.diff) regex.match("-.*TODO:", file.diff) regex.match("TODO:[\\s\\S]*TODO:", file.diff)..
vector_summary: Regex.match("//\\s*TODO:", file.diff) regex.match("-.*TODO:", file.diff) regex.match("TODO:[\\s\\S]*TODO:", file.diff).
chapter: CH-05
:::
regex.match("//\\s*TODO:", file.diff) regex.match("-.*TODO:", file.diff) regex.match("TODO:[\\s\\S]*TODO:", file.diff)
:::

::: concept
id: BLK-6b3973c5adc77112
summary: This perfectly explains your trace output:
digest: 6ba3d57b375fe805b47bfe09cf5100be698559c137999fafbd0429b4e3ecec24
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that This perfectly explains your trace output:.
vector_summary: This perfectly explains your trace output:
chapter: CH-05
:::
This perfectly explains your trace output:
:::

::: concept
id: BLK-83a2499bac0ee44d
summary: 🔥 Proof: Why the three affected tests fail 1.
digest: 588b194792dc2379d5cf750bfa8337f0084c074d750a505f24bf14a5c5aab991
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that 🔥 Proof: Why the three affected tests fail 1..
vector_summary: 🔥 Proof: Why the three affected tests fail 1.
chapter: CH-05
:::
🔥 Proof: Why the three affected tests fail 1. test_todo_without_clear_action
:::

::: concept
id: BLK-6143e7b8d21b076b
summary: TODO: <newline> function().
digest: e24eb2ad15aae2e37a2a6ff7ac49883fd67f67189ed82f2c0f554c37817df424
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that TODO: <newline> function()..
vector_summary: TODO: <newline> function().
chapter: CH-05
:::
TODO: <newline> function()
:::

::: concept
id: BLK-8124b98cebb7344a
summary: "T O D O : \ n f u n c t i o n".
digest: 13ee0c46755b0b3f116f1aea3f1b08e0d29319b1be52a7caf7f2ac0097f4bd5f
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that "T O D O : \ n f u n c t i o n"..
vector_summary: "T O D O : \ n f u n c t i o n".
chapter: CH-05
:::
"T O D O : \ n f u n c t i o n"
:::

::: concept
id: BLK-1c354b57ee22967c
summary: …but the newline is missing → FAIL.
digest: 779db94fe142d17277cf2724bda41dc845a93e2d5e6b96168fd09c4e6e8b5457
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that …but the newline is missing → FAIL..
vector_summary: …but the newline is missing → FAIL.
chapter: CH-05
:::
…but the newline is missing → FAIL.
:::

::: concept
id: BLK-365b36bfe5904699
summary: test_fixme_added_without_reference
digest: 2390c8457cf3df1fd7334c0b6955c7194214d5c200457d361ec75454c4d468f5
symbol_refs: []
semantic_role: reference
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that test_fixme_added_without_reference.
vector_summary: test_fixme_added_without_reference
chapter: CH-05
:::
2. test_fixme_added_without_reference
:::

::: concept
id: BLK-9cb0813090319e09
summary: "+ // FIXME: Temporary hack...".
digest: 1653000801f34a28ff11eac98f230608a71c33f8f627186c5f6c7f84b03ad755
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that "+ // FIXME: Temporary hack..."..
vector_summary: "+ // FIXME: Temporary hack...".
chapter: CH-05
:::
"+ // FIXME: Temporary hack..."
:::

::: concept
id: BLK-ae9cdf2a87e2849e
summary: Contains(diff, "FIXME:").
digest: d4c91ff5c5df7d2424c38b2804e9474ee1c80ec62fdcf79d7f8969c158f79f50
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Contains(diff, "FIXME:")..
vector_summary: Contains(diff, "FIXME:").
chapter: CH-05
:::
contains(diff, "FIXME:")
:::

::: concept
id: BLK-63c154a8c410ed16
summary: "+ // FIXME: Temporary...".
digest: 9b3edff243ce6080efd3c47f5b83a6101aaa0e75ebcd65458fa3b47c2fe1134e
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that "+ // FIXME: Temporary..."..
vector_summary: "+ // FIXME: Temporary...".
chapter: CH-05
:::
"+ // FIXME: Temporary..."
:::

::: concept
id: BLK-930cbcf639591aef
summary: Because your test framework wraps the diff in a JSON string inside Rego, so additional escaping happens, e.g.
digest: 1860345ca2b75aa20d9de38b9e20c8ad2e5b599ed802dada4f1f725daae9dc87
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Because your test framework wraps the diff in a JSON string inside Rego, so additional escaping happens, e.g..
vector_summary: Because your test framework wraps the diff in a JSON string inside Rego, so additional escaping happens, e.g.
chapter: CH-05
:::
Because your test framework wraps the diff in a JSON string inside Rego, so additional escaping happens, e.g.
:::

::: concept
id: BLK-b5f2b2e0022c070b
summary: "+ // FIXME: Temporary hack for authentication".
digest: 64b87f85f2aa688cc528d276c92787be7ab24316d0f09219c722e49445774cea
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that "+ // FIXME: Temporary hack for authentication"..
vector_summary: "+ // FIXME: Temporary hack for authentication".
chapter: CH-05
:::
"+ // FIXME: Temporary hack for authentication"
:::

::: concept
id: BLK-8c1f028fe1d5059b
summary: test_meaningful_todo_not_logged
digest: ad1c01366ce3358dd0b2df568a41bf637589dbf4f267ca489fb751cf12d020a0
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that test_meaningful_todo_not_logged.
vector_summary: test_meaningful_todo_not_logged
chapter: CH-05
:::
3. test_meaningful_todo_not_logged
:::

::: concept
id: BLK-de1b194932f56032
summary: TODO: Fix N+1 query (workaround).
digest: cf657088fbdded1a1a6f47fb11e7e6bdafca1c71824854df566c4fa5b20fd6de
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that TODO: Fix N+1 query (workaround)..
vector_summary: TODO: Fix N+1 query (workaround).
chapter: CH-05
:::
TODO: Fix N+1 query (workaround)
:::

::: concept
id: BLK-b8e54938be458fcb
summary: T O D O : \ s F i x ...
digest: 2f5302e295bb43897fb15ee46f001478e1a1b1ca8542b1470c612be51232faa7
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that T O D O : \ s F i x ....
vector_summary: T O D O : \ s F i x ...
chapter: CH-05
:::
T O D O : \ s F i x ...
:::

::: concept
id: BLK-661d723e70c87b2f
summary: Diff := + // TODO: + function getUsers() {.
digest: 9e50fac696b42308feb82c27615cd03bb7b3c1bc00e6888b58fc5d895921c8f1
symbol_refs: [+ // TODO: + function getUsers() {]
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Diff := + // TODO: + function getUsers() {..
vector_summary: Diff := + // TODO: + function getUsers() {.
chapter: CH-05
:::
diff := `+ // TODO: + function getUsers() {`
:::

::: concept
id: BLK-3018dbc1695a1713
summary: Update all test inputs to use multi-line raw strings.
digest: 10e5f7abb8b49293abbc21419282c407b5f6f0099430c94a613a07584a0ad459
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Update all test inputs to use multi-line raw strings..
vector_summary: Update all test inputs to use multi-line raw strings.
chapter: CH-05
:::
Update all test inputs to use multi-line raw strings.
:::

::: concept
id: BLK-54e698b7ae1d69f6
summary: "diff": "+ // TODO:\n+ function getUsers() {".
digest: 67f15a4a20cd7e7945296cde23b8281855e140f0599d294392a168ebb1706956
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that "diff": "+ // TODO:\n+ function getUsers() {"..
vector_summary: "diff": "+ // TODO:\n+ function getUsers() {".
chapter: CH-05
:::
"diff": "+ // TODO:\n+ function getUsers() {"
:::

::: concept
id: BLK-62b84bd110ac2fbb
summary: "diff": "+ // TODO: + function getUsers() {".
digest: cdb892c4b04106a0501d6cc9f0027857aa4a9457eb57f24481da16f5030efbe4
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that "diff": "+ // TODO: + function getUsers() {"..
vector_summary: "diff": "+ // TODO: + function getUsers() {".
chapter: CH-05
:::
"diff": "+ // TODO: + function getUsers() {"
:::

::: concept
id: BLK-0906546a75dd84e2
summary: This is the simplest solution.
digest: 54a14aca19baa1d2e47924126cd931893d745e6e7d9567f2462cd2c0f4b354bc
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that This is the simplest solution..
vector_summary: This is the simplest solution.
chapter: CH-05
:::
This is the simplest solution.
:::

::: concept
id: BLK-694a2f9470d0042f
summary: ⚠️ Third Fix: Change all regex patterns to handle literal "\n".
digest: c0066eaeb7237197a0fffcd1e4b935a3f1677bd517e208d82a7d0fdacd5736c7
symbol_refs: []
semantic_role: warning
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that ⚠️ Third Fix: Change all regex patterns to handle literal "\n"..
vector_summary: ⚠️ Third Fix: Change all regex patterns to handle literal "\n".
chapter: CH-05
:::
⚠️ Third Fix: Change all regex patterns to handle literal "\n"
:::

::: concept
id: BLK-22ef61310b55ff98
summary: Regex.match("TODO:(\n|\\\\n)", diff).
digest: 078001c5120edb4fbe77949f371477ef8b721dc9245135258353183b15169f5a
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Regex.match("TODO:(\n|\\\\n)", diff)..
vector_summary: Regex.match("TODO:(\n|\\\\n)", diff).
chapter: CH-05
:::
regex.match("TODO:(\n|\\\\n)", diff)
:::

::: concept
id: BLK-42ef9188bb22552f
summary: But this becomes ugly and error-prone.
digest: 11b98fa02c718668d305698b5083c175d4d1dd6bd634025a12b612756fc02e03
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that But this becomes ugly and error-prone..
vector_summary: But this becomes ugly and error-prone.
chapter: CH-05
:::
But this becomes ugly and error-prone.
:::

::: concept
id: BLK-23099cfd845b535f
summary: Diff_unescaped := string.replace(file.diff, "\\n", "\n").
digest: 61cce5435bfe4a7de6c598add7fb5a1c63ec69a2d7a0bb0b62b1bf5dc7e210c4
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Diff_unescaped := string.replace(file.diff, "\\n", "\n")..
vector_summary: Diff_unescaped := string.replace(file.diff, "\\n", "\n").
chapter: CH-05
:::
diff_unescaped := string.replace(file.diff, "\\n", "\n")
:::

::: concept
id: BLK-c511802d86d94661
summary: Because you’re building an enterprise system:.
digest: b0bf45bef9953f68184fc039cd1ccb106adbe13fb31b57006437ecf868b0f779
symbol_refs: []
semantic_role: concept
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Because you’re building an enterprise system:..
vector_summary: Because you’re building an enterprise system:.
chapter: CH-05
:::
Because you’re building an enterprise system:
:::

::: fact
id: BLK-c179f5c2a30f1d7c
summary: Metadata & Introspection: rego.metadata.rule, rego.metadata.chain.
digest: ca79be9c91dd2137daf102b8b68ec3b613ba982e9f9ab992facb6fb3eb0eeb9e
symbol_refs: []
semantic_role: assertion
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Metadata & Introspection: rego.metadata.rule, rego.metadata.chain..
vector_summary: Metadata & Introspection: rego.metadata.rule, rego.metadata.chain.
chapter: CH-05
:::
Metadata & Introspection: rego.metadata.rule, rego.metadata.chain
:::

::: fact
id: BLK-eb3d6c96d1f72a4a
summary: # All servers must be healthy all_healthy if { all([s.healthy | some s in input.servers]) }.
digest: 870e4061440b77ce9994524726a36455cdc16f9a9f4dfeaf027a4519f3852268
symbol_refs: []
semantic_role: assertion
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that # All servers must be healthy all_healthy if { all([s.healthy | some s in input.servers]) }..
vector_summary: # All servers must be healthy all_healthy if { all([s.healthy | some s in input.servers]) }.
chapter: CH-05
:::
# All servers must be healthy all_healthy if { all([s.healthy | some s in input.servers]) }
:::

::: fact
id: BLK-0c491778be16cb9f
summary: OPA has no direct a[1:3] slicing syntax; use array.slice.
digest: 7d22386abefbcfb7b17f8541ab9f7d368809371857a18232f461e16b9f5ca99d
symbol_refs: []
semantic_role: assertion
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that OPA has no direct a[1:3] slicing syntax; use array.slice..
vector_summary: OPA has no direct a[1:3] slicing syntax; use array.slice.
chapter: CH-05
:::
OPA has no direct a[1:3] slicing syntax; use array.slice.
:::

::: fact
id: BLK-f73cb48d2abbbafb
summary: Rego sets are unordered, unique collections.
digest: 0a798700bce70820c8528de13a1d20ab01f05d36640dda7d023ce390ca64d74a
symbol_refs: []
semantic_role: assertion
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Rego sets are unordered, unique collections..
vector_summary: Rego sets are unordered, unique collections.
chapter: CH-05
:::
Rego sets are unordered, unique collections.
:::

::: fact
id: BLK-b6de378fb521f3e5
summary: Rego strings are Unicode text; built-ins operate on code points (not bytes).
digest: 430d5f4f3af9209f004e112b59e43d1098f1de9574c598b255c1673f6fed68b7
symbol_refs: []
semantic_role: assertion
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Rego strings are Unicode text; built-ins operate on code points (not bytes)..
vector_summary: Rego strings are Unicode text; built-ins operate on code points (not bytes).
chapter: CH-05
:::
Rego strings are Unicode text; built-ins operate on code points (not bytes).
:::

::: fact
id: BLK-9c591fac4dfe8baf
summary: # May not work in all OPA versions is_hex if regex.match(^[0-9a-fA-F]+$, input.value).
digest: 74fdc9b324c7f7d0a14af20f4bbc508799c53fcbff3e24609162fdba8bcbe27e
symbol_refs: []
semantic_role: assertion
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that # May not work in all OPA versions is_hex if regex.match(^[0-9a-fA-F]+$, input.value)..
vector_summary: # May not work in all OPA versions is_hex if regex.match(^[0-9a-fA-F]+$, input.value).
chapter: CH-05
:::
# May not work in all OPA versions is_hex if regex.match(`^[0-9a-fA-F]+$`, input.value)
:::

::: fact
id: BLK-154238569cc2d740
summary: Best Practice: Always use double-quoted strings with escaped backslashes for regex patterns.
digest: ab0c7e2d43f36e80cd070c0d936876b528d5f03902197185ce9312a2d9dd65fc
symbol_refs: []
semantic_role: assertion
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Best Practice: Always use double-quoted strings with escaped backslashes for regex patterns..
vector_summary: Best Practice: Always use double-quoted strings with escaped backslashes for regex patterns.
chapter: CH-05
:::
**Best Practice:** Always use double-quoted strings with escaped backslashes for regex patterns. Test with `opa check` to verify compatibility with your OPA version.
:::

::: fact
id: BLK-a3e1adeda4bf400c
summary: When to Use Raw Strings: - Test inputs containing multi-line content (file diffs, code blocks) - Regex patterns that need to match actual newline c...
digest: ae2cf4b28183f8c65e6e105d3c588d591e24bfc8719fe82d67aa26e6150edb14
symbol_refs: []
semantic_role: assertion
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that When to Use Raw Strings: - Test inputs containing multi-line content (file diffs, code blocks) - Regex patterns that need to match actual newline c....
vector_summary: When to Use Raw Strings: - Test inputs containing multi-line content (file diffs, code blocks) - Regex patterns that need to match actual newline c...
chapter: CH-05
:::
**When to Use Raw Strings:** - Test inputs containing multi-line content (file diffs, code blocks) - Regex patterns that need to match actual newline characters - Content that must preserve line breaks exactly as written
:::

::: fact
id: BLK-faa6749892163657
summary: Difference: to_* is generally more permissive; cast_* may be stricter (implementation details can vary by version—always verify against your target...
digest: 2f583727d16f7b0b33726b1c95837627c4e2433c94baad47f559cdc275735ce6
symbol_refs: []
semantic_role: assertion
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Difference: to_* is generally more permissive; cast_* may be stricter (implementation details can vary by version—always verify against your target....
vector_summary: Difference: to_* is generally more permissive; cast_* may be stricter (implementation details can vary by version—always verify against your target...
chapter: CH-05
:::
Difference: to_* is generally more permissive; cast_* may be stricter (implementation details can vary by version—always verify against your target OPA).
:::

::: fact
id: BLK-539d7bec736ce9fa
summary: Always guard access to optional or potentially missing input fields:.
digest: 19a68fba6376f5b5e9e207b6427896670cb63f8f0896ea42518d095ad4f33665
symbol_refs: []
semantic_role: assertion
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Always guard access to optional or potentially missing input fields:..
vector_summary: Always guard access to optional or potentially missing input fields:.
chapter: CH-05
:::
Always guard access to optional or potentially missing input fields:
:::

::: fact
id: BLK-f1a5006e2f61d559
summary: Common Patterns: - Check is_string() before contains(), startswith(), endswith() - Check is_array() before iteration with some ..
digest: e67ab670a44c56e520ce2d3ce93ac27722238972b6aff04ac06be8d026dd4e41
symbol_refs: []
semantic_role: assertion
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Common Patterns: - Check is_string() before contains(), startswith(), endswith() - Check is_array() before iteration with some ...
vector_summary: Common Patterns: - Check is_string() before contains(), startswith(), endswith() - Check is_array() before iteration with some ..
chapter: CH-05
:::
**Common Patterns:** - Check `is_string()` before `contains()`, `startswith()`, `endswith()` - Check `is_array()` before iteration with `some ... in` - Check `is_object()` before property access - Check `is_number()` before arithmetic operations - Create a top-level `input_valid` guard and use it in all rules that access input
:::

::: fact
id: BLK-5c33fbfabf3e6fb4
summary: Never bake secrets into Rego source; pass via data or environment.
digest: f6d14efc4ce76fe14ec85ae8e3df67c24a52268a5f79c7ff59c2c5a50972e614
symbol_refs: []
semantic_role: assertion
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Never bake secrets into Rego source; pass via data or environment..
vector_summary: Never bake secrets into Rego source; pass via data or environment.
chapter: CH-05
:::
Never bake secrets into Rego source; pass via data or environment.
:::

::: fact
id: BLK-c09ef369e7bd778c
summary: 6.14 This chapter catalogs core built-ins and corrects a few subtle points (arrays, JSON filtering, time, UUIDs/ULIDs).
digest: a6d774331d07641a91f59ba500d1539f5f217493b6f8236aad1a34cd4b6760e4
symbol_refs: []
semantic_role: assertion
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that 6.14 This chapter catalogs core built-ins and corrects a few subtle points (arrays, JSON filtering, time, UUIDs/ULIDs)..
vector_summary: 6.14 This chapter catalogs core built-ins and corrects a few subtle points (arrays, JSON filtering, time, UUIDs/ULIDs).
chapter: CH-05
:::
6.14 This chapter catalogs core built-ins and corrects a few subtle points (arrays, JSON filtering, time, UUIDs/ULIDs).
:::

::: fact
id: BLK-01f8eba873aaef46
summary: Both arguments must be arrays.
digest: b6c896578175dd1312368c816c624684fd5da324449d2ab07bc2140966dbdb77
symbol_refs: []
semantic_role: assertion
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Both arguments must be arrays..
vector_summary: Both arguments must be arrays.
chapter: CH-05
:::
Both arguments must be arrays.
:::

::: fact
id: BLK-c93efe6db0a5e1b6
summary: If either argument is null (or not an array), OPA raises a type error.
digest: ff4a54e3fc324b5d2e39cd6c9073a7276737f42257d6f3033332c73a02a87978
symbol_refs: []
semantic_role: assertion
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that If either argument is null (or not an array), OPA raises a type error..
vector_summary: If either argument is null (or not an array), OPA raises a type error.
chapter: CH-05
:::
If either argument is null (or not an array), OPA raises a type error.
:::

::: fact
id: BLK-f1886568bc74ebd4
summary: Important corrections:.
digest: 005ac5270ad6c878576cdeaadfc410af4102731f7cab63496693dc9c2300669a
symbol_refs: []
semantic_role: assertion
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Important corrections:..
vector_summary: Important corrections:.
chapter: CH-05
:::
Important corrections:
:::

::: fact
id: BLK-1f946628820928af
summary: There is no standard time.diff builtin in OPA.
digest: 097dab5ae3864a349ce714129f2e4a912d0c64594d5e09f11d5dd9e57eb833fe
symbol_refs: []
semantic_role: assertion
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that There is no standard time.diff builtin in OPA..
vector_summary: There is no standard time.diff builtin in OPA.
chapter: CH-05
:::
There is no standard time.diff builtin in OPA.
:::

::: fact
id: BLK-f214eb556e8a953e
summary: Test_http_policy if { result := policy.check with http.send as mock_http_send }.
digest: da7b8debc7e5abe84813c156a3e6dba24c971309c0a7c25e9f365ec2fdac6d48
symbol_refs: []
semantic_role: assertion
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Test_http_policy if { result := policy.check with http.send as mock_http_send }..
vector_summary: Test_http_policy if { result := policy.check with http.send as mock_http_send }.
chapter: CH-05
:::
test_http_policy if { result := policy.check with http.send as mock_http_send }
:::

::: fact
id: BLK-0df20cfb2ff67a77
summary: Rego exposes rule metadata at evaluation time:.
digest: 3159c92b078db6010d1d60106749c3f192b235eb2eb2cc382f16a87bd764bbcf
symbol_refs: []
semantic_role: assertion
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Rego exposes rule metadata at evaluation time:..
vector_summary: Rego exposes rule metadata at evaluation time:.
chapter: CH-05
:::
Rego exposes rule metadata at evaluation time:
:::

::: fact
id: BLK-22d542254fb4e430
summary: Rule_meta := rego.metadata.rule() # metadata of current rule chain_meta := rego.metadata.chain() # stack of rule metadata along evaluation chain.
digest: 9929626a3d309f7163a3152091eccecaf305bdc8e9a47685ad134d2f7688ecd3
symbol_refs: []
semantic_role: assertion
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Rule_meta := rego.metadata.rule() # metadata of current rule chain_meta := rego.metadata.chain() # stack of rule metadata along evaluation chain..
vector_summary: Rule_meta := rego.metadata.rule() # metadata of current rule chain_meta := rego.metadata.chain() # stack of rule metadata along evaluation chain.
chapter: CH-05
:::
rule_meta := rego.metadata.rule() # metadata of current rule chain_meta := rego.metadata.chain() # stack of rule metadata along evaluation chain
:::

::: fact
id: BLK-75f34843f2caa056
summary: Enrich decision logs with rule IDs, owners, severity.
digest: a6165474e27f0dcb8574970b056f6d70cfb54a25ff5aef5b8cb6dfdb3640a792
symbol_refs: []
semantic_role: assertion
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Enrich decision logs with rule IDs, owners, severity..
semantic_categories: [observability]
vector_summary: Enrich decision logs with rule IDs, owners, severity.
chapter: CH-05
:::
Enrich decision logs with rule IDs, owners, severity.
:::

::: fact
id: BLK-2a123209b43ae5ad
summary: Deny[msg] if { violation_condition m := rego.metadata.rule() msg := { "msg": "Violation detected", "rule_id": m.id, "owner": m.owner, } }.
digest: 981715640d0c553dd113c0423be2bdcf81732e21daf397525fb8f47edee54b30
symbol_refs: []
semantic_role: assertion
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Deny[msg] if { violation_condition m := rego.metadata.rule() msg := { "msg": "Violation detected", "rule_id": m.id, "owner": m.owner, } }..
vector_summary: Deny[msg] if { violation_condition m := rego.metadata.rule() msg := { "msg": "Violation detected", "rule_id": m.id, "owner": m.owner, } }.
chapter: CH-05
:::
deny[msg] if { violation_condition m := rego.metadata.rule() msg := { "msg": "Violation detected", "rule_id": m.id, "owner": m.owner, } }
:::

::: fact
id: BLK-d9889415e47b56cf
summary: Print is the primary debugging tool for Rego:.
digest: 1ace847a500453e95d80516bee412fab1f8d47fce6110bb850deb131e0410b0f
symbol_refs: []
semantic_role: assertion
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Print is the primary debugging tool for Rego:..
vector_summary: Print is the primary debugging tool for Rego:.
chapter: CH-05
:::
print is the primary debugging tool for Rego:
:::

::: fact
id: BLK-1095ee34dfae7aed
summary: Debug_rule if { x := input.value print("The value of x is:", x) x > 10 }.
digest: 38aea5f00d479d1fdefb56e65a765e5db8dce82a5fea65d7d26a541e759bd43f
symbol_refs: []
semantic_role: assertion
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Debug_rule if { x := input.value print("The value of x is:", x) x > 10 }..
vector_summary: Debug_rule if { x := input.value print("The value of x is:", x) x > 10 }.
chapter: CH-05
:::
debug_rule if { x := input.value print("The value of x is:", x) x > 10 }
:::

::: fact
id: BLK-0d4a08a0bff4d6d5
summary: Output appears in OPA logs or opa eval --explain trace output depending on environment.
digest: 672a32fe340e715dc78763e3649faafb5c50a0ac6e288602f6ed5859bafff46c
symbol_refs: []
semantic_role: assertion
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Output appears in OPA logs or opa eval --explain trace output depending on environment..
vector_summary: Output appears in OPA logs or opa eval --explain trace output depending on environment.
chapter: CH-05
:::
Output appears in OPA logs or opa eval --explain trace output depending on environment.
:::

::: fact
id: BLK-36aac4923d6e8a11
summary: # If to_number fails, rule body is undefined is_valid if { n := to_number(input.score) n >= 0 }.
digest: 8136b327183cf18a0e05d40f87f0f9bf4cb2d1efabee2d9614e83c12bc8f9063
symbol_refs: []
semantic_role: assertion
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that # If to_number fails, rule body is undefined is_valid if { n := to_number(input.score) n >= 0 }..
vector_summary: # If to_number fails, rule body is undefined is_valid if { n := to_number(input.score) n >= 0 }.
chapter: CH-05
:::
# If to_number fails, rule body is undefined is_valid if { n := to_number(input.score) n >= 0 }
:::

::: fact
id: BLK-7723dfb7493646b4
summary: Opa eval --strict-builtin-errors ...
digest: 33b79c10e4039c92372721cea467d0822edd8e3eb0198573ac3ba6941f86ebf4
symbol_refs: []
semantic_role: assertion
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Opa eval --strict-builtin-errors ....
vector_summary: Opa eval --strict-builtin-errors ...
chapter: CH-05
:::
opa eval --strict-builtin-errors ...
:::

::: fact
id: BLK-721972a19dbe3e46
summary: Validation helpers: Make dedicated rules using type and conversion built-ins (is_valid_request, normalize_email) and reuse everywhere.
digest: b7fc57702066d573fad9daae65d14ae19f807ab11b7d01747a08b73be779c126
symbol_refs: []
semantic_role: assertion
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Validation helpers: Make dedicated rules using type and conversion built-ins (is_valid_request, normalize_email) and reuse everywhere..
vector_summary: Validation helpers: Make dedicated rules using type and conversion built-ins (is_valid_request, normalize_email) and reuse everywhere.
chapter: CH-05
:::
Validation helpers: Make dedicated rules using type and conversion built-ins (is_valid_request, normalize_email) and reuse everywhere.
:::

::: fact
id: BLK-2105253d138563cb
summary: Canonicalization: Always lowercase/trim user-identifiers before comparison.
digest: a5ddb3d6d3defb25fbd7aa9916a721f264f59120f89833f2f16ebba75327eaee
symbol_refs: []
semantic_role: assertion
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Canonicalization: Always lowercase/trim user-identifiers before comparison..
vector_summary: Canonicalization: Always lowercase/trim user-identifiers before comparison.
chapter: CH-05
:::
Canonicalization: Always lowercase/trim user-identifiers before comparison.
:::

::: fact
id: BLK-7b0b481d4c3ce520
summary: Non-mocked time in tests: Using time.now_ns() directly in tests causes flakiness; always with time.now_ns as ...
digest: 59c03799b6afa44be32437ccf65ae541a952e269ea18ae634920123a6ba9bf3d
symbol_refs: []
semantic_role: assertion
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Non-mocked time in tests: Using time.now_ns() directly in tests causes flakiness; always with time.now_ns as ....
vector_summary: Non-mocked time in tests: Using time.now_ns() directly in tests causes flakiness; always with time.now_ns as ...
chapter: CH-05
:::
Non-mocked time in tests: Using time.now_ns() directly in tests causes flakiness; always with time.now_ns as ...
:::

::: fact
id: BLK-da85b2ab78e71372
summary: Chapter 7 – Testing, Debugging & Troubleshooting (From Hello-World to PhD) Testing is not an afterthought in Rego/OPA; it is the mechanism by which...
digest: b7ea3a8246b13e3f6fc54c5a613d82f00b61a7c08a7c68d807dea87f4db0dca3
symbol_refs: []
semantic_role: architecture
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Chapter 7 – Testing, Debugging & Troubleshooting (From Hello-World to PhD) Testing is not an afterthought in Rego/OPA; it is the mechanism by which....
semantic_categories: [testing]
vector_summary: Chapter 7 – Testing, Debugging & Troubleshooting (From Hello-World to PhD) Testing is not an afterthought in Rego/OPA; it is the mechanism by which...
chapter: CH-05
:::
Chapter 7 – Testing, Debugging & Troubleshooting (From Hello-World to PhD) Testing is not an afterthought in Rego/OPA; it is the mechanism by which you prove that your policies are correct, stable, and maintainable. This chapter builds from basic _test rules up to full-blown policy test architectures, fuzzing, and debugging strategies. ________________________________________ 7.1 Testing Fundamentals Where tests live Tests are Rego modules whose package names end in _test. Convention: Production package: package authz.api Test package: package authz.api_test Naming rules Test rules must start with test_. A test passes if its body can be satisfied (i.e., is true); it fails otherwise. package authz.api_test
:::

::: fact
id: BLK-f1a56ec6ccdf9d8f
summary: # All tests in current tree opa test .
digest: 632c10049f6a3904945a85393f562a38db02f752610582d01a65643b53a8713f
symbol_refs: []
semantic_role: assertion
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that # All tests in current tree opa test ..
vector_summary: # All tests in current tree opa test .
chapter: CH-05
:::
# All tests in current tree opa test .
:::

::: fact
id: BLK-537801bd1cd367b5
summary: # Verbose (see individual test names) opa test.
digest: f781a423932b0556d803d6973aaf06169f72efa047b308946d2a131bd03269d9
symbol_refs: []
semantic_role: assertion
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that # Verbose (see individual test names) opa test..
vector_summary: # Verbose (see individual test names) opa test.
chapter: CH-05
:::
# Verbose (see individual test names) opa test . -v
:::

::: fact
id: BLK-fa854a9140894ca2
summary: # Specific path or file opa test policies/ authz_test.rego.
digest: 96bf309d4c8f8564e092522be764148ffbdf6c3c4468e7c5aa121f1787725373
symbol_refs: []
semantic_role: assertion
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that # Specific path or file opa test policies/ authz_test.rego..
vector_summary: # Specific path or file opa test policies/ authz_test.rego.
chapter: CH-05
:::
# Specific path or file opa test policies/ authz_test.rego
:::

::: fact
id: BLK-a57fac63b249febb
summary: Override input test_non_admin_denied if { authz.allow with input as { "user": {"id": "bob", "roles": ["user"]}, "action": "delete", "resource": {"i...
digest: e985127304e6c58277288011a71e179f29f5f50eb058932e7daaf9c667b13172
symbol_refs: []
semantic_role: assertion
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Override input test_non_admin_denied if { authz.allow with input as { "user": {"id": "bob", "roles": ["user"]}, "action": "delete", "resource": {"i....
semantic_categories: [testing]
vector_summary: Override input test_non_admin_denied if { authz.allow with input as { "user": {"id": "bob", "roles": ["user"]}, "action": "delete", "resource": {"i...
chapter: CH-05
:::
# With coverage reporting opa test . --coverage --format=json > coverage.json ________________________________________ 7.2 The with Keyword for Mocking with is the cornerstone of Rego testing. It temporarily overrides input, data, or even built-ins for a single evaluation. Override input test_non_admin_denied if { authz.allow with input as { "user": {"id": "bob", "roles": ["user"]}, "action": "delete", "resource": {"id": "123"} } } Override data test_role_from_data if { authz.allow with input as {"user": "alice", "action": "read"} with data.roles as {"alice": ["admin"]} } Override built-ins (time, http, etc.)
:::

::: fact
id: BLK-b3c956e83dd2d9b9
summary: # in policy: within_business_hours if { now := time.now_ns() [hour, _, _] := time.clock(now) hour >= 9 hour < 17 }.
digest: 4ed501019572266144e6ab14f882953ac90fbc4bee0b583a8b4ae72697b99329
symbol_refs: []
semantic_role: assertion
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that # in policy: within_business_hours if { now := time.now_ns() [hour, _, _] := time.clock(now) hour >= 9 hour < 17 }..
vector_summary: # in policy: within_business_hours if { now := time.now_ns() [hour, _, _] := time.clock(now) hour >= 9 hour < 17 }.
chapter: CH-05
:::
# in policy: within_business_hours if { now := time.now_ns() [hour, _, _] := time.clock(now) hour >= 9 hour < 17 }
:::

::: fact
id: BLK-f2f11d384f628fdd
summary: 7.3 Golden Tests & File I/O (Corrected).
digest: 40b140c842521cc18eef2f3233df321e16fd6d9d5e8963637abb414cfa213781
symbol_refs: []
semantic_role: assertion
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that 7.3 Golden Tests & File I/O (Corrected)..
vector_summary: 7.3 Golden Tests & File I/O (Corrected).
chapter: CH-05
:::
7.3 Golden Tests & File I/O (Corrected)
:::

::: fact
id: BLK-7834e0c249b42a27
summary: Rego itself has no read_file builtin and cannot perform file I/O. All file reading is handled by the test harness (shell, Go, Python, etc.).
digest: 693a84b8548504f32be805e71118d686e571e30d21d00172b7597e11ba5d3131
symbol_refs: []
semantic_role: assertion
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Rego itself has no read_file builtin and cannot perform file I/O. All file reading is handled by the test harness (shell, Go, Python, etc.)..
vector_summary: Rego itself has no read_file builtin and cannot perform file I/O. All file reading is handled by the test harness (shell, Go, Python, etc.).
chapter: CH-05
:::
Rego itself has no read_file builtin and cannot perform file I/O. All file reading is handled by the test harness (shell, Go, Python, etc.).
:::

::: fact
id: BLK-f8692f6179728f8b
summary: Populate data.tests["pr_large"] before invoking opa test or the OPA SDK.
digest: d268a639a5d8277269849980b5e4554e261657a85485450695108ed92c6d9957
symbol_refs: []
semantic_role: assertion
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Populate data.tests["pr_large"] before invoking opa test or the OPA SDK..
vector_summary: Populate data.tests["pr_large"] before invoking opa test or the OPA SDK.
chapter: CH-05
:::
Populate data.tests["pr_large"] before invoking opa test or the OPA SDK.
:::

::: fact
id: BLK-00e38f5a2f7efa75
summary: Rego: pure data and rules; no file system.
digest: 713066482991a232858a5e502d8700b2aefdf885267a5eb02319c6ceddd20f80
symbol_refs: []
semantic_role: assertion
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Rego: pure data and rules; no file system..
vector_summary: Rego: pure data and rules; no file system.
chapter: CH-05
:::
Rego: pure data and rules; no file system.
:::

::: fact
id: BLK-a8d9de9cf30c1fc4
summary: A critical distinction exists between how string literals are interpreted in JSON inputs versus Rego test files.
digest: 3ee2352c0d14c210c8647d528b204ce5c4aabef0045fae48a594d8708d704d4e
symbol_refs: []
semantic_role: assertion
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that A critical distinction exists between how string literals are interpreted in JSON inputs versus Rego test files..
vector_summary: A critical distinction exists between how string literals are interpreted in JSON inputs versus Rego test files.
chapter: CH-05
:::
A critical distinction exists between how string literals are interpreted in JSON inputs versus Rego test files. This difference frequently causes test failures that are difficult to diagnose.
:::

::: fact
id: BLK-cb3db7a529ef9313
summary: JSON Input (via opa eval --input):.
digest: e3aef5ef974d787208caf539561a59b06cb3f2e85ee21a332bb76eda00a5b873
symbol_refs: []
semantic_role: assertion
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that JSON Input (via opa eval --input):..
vector_summary: JSON Input (via opa eval --input):.
chapter: CH-05
:::
**JSON Input (via `opa eval --input`):**
:::

::: fact
id: BLK-1b920d632bac61fa
summary: In JSON, \n is interpreted as an actual newline character during JSON parsing.
digest: 7a181a2817461b6ec3fc0b72d2a798982ee3ea200ebc12aeb2808959f85df989
symbol_refs: []
semantic_role: assertion
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that In JSON, \n is interpreted as an actual newline character during JSON parsing..
vector_summary: In JSON, \n is interpreted as an actual newline character during JSON parsing.
chapter: CH-05
:::
In JSON, `\n` is interpreted as an actual newline character during JSON parsing. The policy receives a string containing a real line break.
:::

::: fact
id: BLK-8c6da53a0dea320a
summary: Rego Test File (inline string literal):.
digest: fab20ad7a3ba79c49bb5c2d636c77f9bd6c9551b0338908aac5d582eedfa665b
symbol_refs: []
semantic_role: assertion
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Rego Test File (inline string literal):..
vector_summary: Rego Test File (inline string literal):.
chapter: CH-05
:::
**Rego Test File (inline string literal):**
:::

::: fact
id: BLK-1a8bc26591bda96c
summary: In Rego test files, \n within double-quoted strings is treated as a literal two-character sequence: backslash followed by 'n'.
digest: 73f0a239924a3cb7e9ae56fbcdd1cc7efee5b45e7cd7c63e5436a0d99e5f9550
symbol_refs: []
semantic_role: assertion
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that In Rego test files, \n within double-quoted strings is treated as a literal two-character sequence: backslash followed by 'n'..
vector_summary: In Rego test files, \n within double-quoted strings is treated as a literal two-character sequence: backslash followed by 'n'.
chapter: CH-05
:::
In Rego test files, `\n` within double-quoted strings is treated as a literal two-character sequence: backslash followed by 'n'. It is not decoded to an actual newline.
:::

::: fact
id: BLK-ded8c7f03a6d2763
summary: Symptoms: - Tests fail with opa test but pass with opa eval --input <json-file> - Regex patterns that work with JSON inputs fail in test files - Mu...
digest: ddfe4b908af3745bdf8b9bd8a21deddd7c5796b4b099c0c03a06bdf80ca2729c
symbol_refs: []
semantic_role: assertion
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Symptoms: - Tests fail with opa test but pass with opa eval --input <json-file> - Regex patterns that work with JSON inputs fail in test files - Mu....
vector_summary: Symptoms: - Tests fail with opa test but pass with opa eval --input <json-file> - Regex patterns that work with JSON inputs fail in test files - Mu...
chapter: CH-05
:::
**Symptoms:** - Tests fail with `opa test` but pass with `opa eval --input <json-file>` - Regex patterns that work with JSON inputs fail in test files - Multi-line matching fails unexpectedly
:::

::: fact
id: BLK-e47c0f553000bb39
summary: Best Practice: When testing policies that process multi-line content (diffs, code, logs), always use raw strings in test files to match the behavio...
digest: 38947f701e8c7607a7b7eab8530abfe52df15258567ac03e297ef7a42e3e3789
symbol_refs: []
semantic_role: assertion
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Best Practice: When testing policies that process multi-line content (diffs, code, logs), always use raw strings in test files to match the behavio....
semantic_categories: [testing]
vector_summary: Best Practice: When testing policies that process multi-line content (diffs, code, logs), always use raw strings in test files to match the behavio...
chapter: CH-05
:::
**Best Practice:** When testing policies that process multi-line content (diffs, code, logs), always use raw strings in test files to match the behavior of JSON inputs.
:::

::: fact
id: BLK-6f609bd8fd8f15c6
summary: The evaluation context of with clauses in tests can affect how rule results are accessed.
digest: 047fde531ac8c78c52273737dd14da8555909619b32c07f698a1b1977288ee6c
symbol_refs: []
semantic_role: assertion
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that The evaluation context of with clauses in tests can affect how rule results are accessed..
vector_summary: The evaluation context of with clauses in tests can affect how rule results are accessed.
chapter: CH-05
:::
The evaluation context of `with` clauses in tests can affect how rule results are accessed. Understanding these patterns prevents subtle test failures.
:::

::: fact
id: BLK-8329ea621be0fbe8
summary: When a rule returns a set (partial rule with contains), accessing elements requires proper iteration:.
digest: 45ce7e2e9e446585c94b9adf064df9e77179191472b2120dfe1651b44b7f34ee
symbol_refs: []
semantic_role: assertion
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that When a rule returns a set (partial rule with contains), accessing elements requires proper iteration:..
vector_summary: When a rule returns a set (partial rule with contains), accessing elements requires proper iteration:.
chapter: CH-05
:::
When a rule returns a set (partial rule with `contains`), accessing elements requires proper iteration:
:::

::: fact
id: BLK-eb983ec34e7f2afd
summary: 7.8.3 Rule Precedence and Overlapping Conditions.
digest: 48fad5fee72883b10affa5489143b9557089b7623693eaa89014b16b9139efa5
symbol_refs: []
semantic_role: assertion
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that 7.8.3 Rule Precedence and Overlapping Conditions..
vector_summary: 7.8.3 Rule Precedence and Overlapping Conditions.
chapter: CH-05
:::
7.8.3 Rule Precedence and Overlapping Conditions
:::

::: fact
id: BLK-87dcc1797078ce96
summary: When multiple rules can match the same input, understanding evaluation order is critical for test design.
digest: 4f52d5edd989c7e78bb18c91ea78972d9f615b65b24fb908513e625b8f0e1803
symbol_refs: []
semantic_role: assertion
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that When multiple rules can match the same input, understanding evaluation order is critical for test design..
vector_summary: When multiple rules can match the same input, understanding evaluation order is critical for test design.
chapter: CH-05
:::
When multiple rules can match the same input, understanding evaluation order is critical for test design.
:::

::: fact
id: BLK-38a3d8f94378e0d5
summary: Problem: Overlapping Rule Conditions.
digest: b3acf89998ee538360b1b282d3660ea8eb87869046f8d1c005f32d33ab94a1fc
symbol_refs: []
semantic_role: assertion
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Problem: Overlapping Rule Conditions..
vector_summary: Problem: Overlapping Rule Conditions.
chapter: CH-05
:::
**Problem: Overlapping Rule Conditions**
:::

::: fact
id: BLK-716c7db7881919b2
summary: Best Practice: Design tests to verify policy behavior (what warnings are produced) rather than implementation details (which specific rule triggered).
digest: c65752d09f20213ffa8613137a27ac41cfe4eb1223b5d0807ec7295ea010c50f
symbol_refs: []
semantic_role: warning
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Best Practice: Design tests to verify policy behavior (what warnings are produced) rather than implementation details (which specific rule triggered)..
vector_summary: Best Practice: Design tests to verify policy behavior (what warnings are produced) rather than implementation details (which specific rule triggered).
chapter: CH-05
:::
**Best Practice:** Design tests to verify policy behavior (what warnings are produced) rather than implementation details (which specific rule triggered). This makes tests more resilient to policy refactoring.
:::

::: fact
id: BLK-be379cbe8b085069
summary: String matching functions in Rego are case-sensitive, which can cause test failures when test inputs don't match policy expectations.
digest: 547561564b516f7193acd60ead3ff4dd604be642e4c14170edc7b3f3add5a661
symbol_refs: []
semantic_role: assertion
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that String matching functions in Rego are case-sensitive, which can cause test failures when test inputs don't match policy expectations..
vector_summary: String matching functions in Rego are case-sensitive, which can cause test failures when test inputs don't match policy expectations.
chapter: CH-05
:::
String matching functions in Rego are case-sensitive, which can cause test failures when test inputs don't match policy expectations.
:::

::: fact
id: BLK-4976548b8700b298
summary: Option 2: Policy-Level Normalization (Recommended for Production).
digest: e88c54742ebb790812ccf0ef566a049b00e1e2ef1c144ac946668f48a6d79b8a
symbol_refs: []
semantic_role: assertion
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Option 2: Policy-Level Normalization (Recommended for Production)..
vector_summary: Option 2: Policy-Level Normalization (Recommended for Production).
chapter: CH-05
:::
**Option 2: Policy-Level Normalization (Recommended for Production)**
:::

::: fact
id: BLK-815e807463d05340
summary: Option 3: Explicit Case Variants in Policy.
digest: cd4b343538634d500d83909756dde91fd6013f8aaf0cf5016252860be7714a42
symbol_refs: []
semantic_role: assertion
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Option 3: Explicit Case Variants in Policy..
vector_summary: Option 3: Explicit Case Variants in Policy.
chapter: CH-05
:::
**Option 3: Explicit Case Variants in Policy**
:::

::: fact
id: BLK-e18f935c97d3ec3d
summary: Best Practice: For production policies, prefer normalization (Option 2) to handle case variations gracefully.
digest: a68f6059fb72e6cbb9f964deefcd7c939ddf99c07bbad5e260916b1d58e7a907
symbol_refs: []
semantic_role: assertion
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Best Practice: For production policies, prefer normalization (Option 2) to handle case variations gracefully..
vector_summary: Best Practice: For production policies, prefer normalization (Option 2) to handle case variations gracefully.
chapter: CH-05
:::
**Best Practice:** For production policies, prefer normalization (Option 2) to handle case variations gracefully. For tests, ensure inputs match policy expectations exactly, or document case sensitivity requirements clearly.
:::

::: fact
id: BLK-2a66a03314f167f4
summary: Decision rule: data.envoy.authz.allow.
digest: 57fd402da7468ee3ca8935812f34582949e96a6442b0790fd40d76c529eadcc0
symbol_refs: []
semantic_role: assertion
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Decision rule: data.envoy.authz.allow..
semantic_categories: [authz]
vector_summary: Decision rule: data.envoy.authz.allow.
chapter: CH-05
:::
deny[msg] if { input.request.kind.kind == "Pod" some c in input.request.object.spec.containers c.image == "latest" msg := "Images must not use :latest tag" } Envoy / API Gateway Envoy external authorization filter calls OPA with HTTP headers, method, path, source IP. Decision rule: data.envoy.authz.allow. Example: package envoy.authz
:::

::: fact
id: BLK-ff682021c825f473
summary: Bundles: main: service: policy resource: /bundles/crm-main.tar.gz polling: min_delay_seconds: 10 max_delay_seconds: 60 OPA periodically pulls bundl...
digest: 3ff632583c325e2e70da2bccde7bccea5928e5f79757010c43ff6726ed4d37de
symbol_refs: []
semantic_role: assertion
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Bundles: main: service: policy resource: /bundles/crm-main.tar.gz polling: min_delay_seconds: 10 max_delay_seconds: 60 OPA periodically pulls bundl....
semantic_categories: [distribution]
vector_summary: Bundles: main: service: policy resource: /bundles/crm-main.tar.gz polling: min_delay_seconds: 10 max_delay_seconds: 60 OPA periodically pulls bundl...
chapter: CH-05
:::
bundles: main: service: policy resource: /bundles/crm-main.tar.gz polling: min_delay_seconds: 10 max_delay_seconds: 60 OPA periodically pulls bundles, verifies them, and updates its data and policy set. ________________________________________ 9.2 Bundle Layering & Tenancy You can have multiple bundles: global-baseline.tar.gz → data.global org-security.tar.gz → data.org crm-team.tar.gz → data.crm tenant-123.tar.gz → data.tenants["123"] OPA merges them in the data document. Patterns: Tenant-specific overrides are just data: package authz
:::

::: fact
id: BLK-fc4d408a0b120c15
summary: Allow if { base_allow not data.tenants[input.tenant_id].deny_all } Canary rollout: Serve new bundle under /bundles/crm-main-canary.tar.gz to subset...
digest: b44ee95a2cfce097f83265724e65b0e57a38da8283c5ee02dd30406ce216d0cb
symbol_refs: []
semantic_role: assertion
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Allow if { base_allow not data.tenants[input.tenant_id].deny_all } Canary rollout: Serve new bundle under /bundles/crm-main-canary.tar.gz to subset....
semantic_categories: [distribution]
vector_summary: Allow if { base_allow not data.tenants[input.tenant_id].deny_all } Canary rollout: Serve new bundle under /bundles/crm-main-canary.tar.gz to subset...
chapter: CH-05
:::
allow if { base_allow not data.tenants[input.tenant_id].deny_all } Canary rollout: Serve new bundle under /bundles/crm-main-canary.tar.gz to subset of OPAs. Compare decisions vs stable. ________________________________________ 9.3 Release Engineering & Versioning Use semantic versioning for bundles: vMAJOR.MINOR.PATCH. Track: Git commit SHA. Build ID. CI pipeline run. Typical pipeline: opa fmt + lint + opa test + opa check --strict. opa build / custom bundler to produce bundle.tar.gz. Sign bundle (e.g., Sigstore, GPG). Upload to bundle server / CDN. Tag release in Git. ________________________________________ Chapter 10 – Linting, Style & CI Even perfect policies are useless if they’re unreadable or unmaintainable. This chapter merges style guides, linting, and CI patterns into an enforceable system. ________________________________________ 10.1 Style Principles (Based on Styra + Enterprise Practice) Readability first Prefer clear, small rules over clever one-liners. Use opa fmt always Standardizes indentation, spacing, and layout. Enforce via CI. Use modern syntax (Rego v1) if, contains, every, some ... in .... Import rego.v1 or future.keywords when needed. Naming conventions Packages: domain.service.component crm.authz.http, infra.k8s.admission. Rules & functions: snake_case. Helper rules: prefix with _ (convention). package crm.authz.http
:::

::: fact
id: BLK-452d175adcd847c7
summary: Allow if { _is_admin(input.user) input.request.method == "GET" } Rule organization Top of file: Package.
digest: 10ec83097c1743291659efdca0d60a05cc03f6f9348c1273ae2443b5a89b0bca
symbol_refs: []
semantic_role: assertion
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Allow if { _is_admin(input.user) input.request.method == "GET" } Rule organization Top of file: Package..
semantic_categories: [negation]
vector_summary: Allow if { _is_admin(input.user) input.request.method == "GET" } Rule organization Top of file: Package.
chapter: CH-05
:::
allow if { _is_admin(input.user) input.request.method == "GET" } Rule organization Top of file: Package. Imports. Constants/defaults. Then: Helper rules (unexported). Public rules (allow, deny, violation, etc.). ________________________________________ 10.2 Regal (Linter) & Custom Lint Rules Regal is a dedicated Rego linter. Example config (.regal/config.yaml): rules: naming-convention: snake_case: true unused-decls: error no-var-shadowing: error require-some: error no-ambiguous-negation: warn max-rule-size: severity: warn limit: 10 avoid-inline-comprehensions: warn package-path-alignment: error no-import-input: error Typical checks: Snake_case for everything. No unused variables (except _). No variable shadowing. Explicit some declarations. Package name alignment with file path. Metadata required on certain rules (e.g., deny rules). ________________________________________ 10.3 CI Pipeline: From Formatting to Enforcement Lint & format stage – GitHub Actions example name: Rego Linting on: [push, pull_request]
:::

::: fact
id: BLK-24debc49b4b7f143
summary: Name: Install OPA run: | curl -L -o opa https://openpolicyagent.org/downloads/latest/opa_linux_amd64 chmod +x opa sudo mv opa /usr/local/bin/opa.
digest: eb4957efba28088062e024fabc1c06963142a6080aaa1fceaa4f385673e46789
symbol_refs: []
semantic_role: assertion
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Name: Install OPA run: | curl -L -o opa https://openpolicyagent.org/downloads/latest/opa_linux_amd64 chmod +x opa sudo mv opa /usr/local/bin/opa..
vector_summary: Name: Install OPA run: | curl -L -o opa https://openpolicyagent.org/downloads/latest/opa_linux_amd64 chmod +x opa sudo mv opa /usr/local/bin/opa.
chapter: CH-05
:::
- name: Install OPA run: | curl -L -o opa https://openpolicyagent.org/downloads/latest/opa_linux_amd64 chmod +x opa sudo mv opa /usr/local/bin/opa
:::

::: fact
id: BLK-cc6f290305561e56
summary: Name: Check formatting run: opa fmt --fail .
digest: bb205e01aa1001015a2ab47afbf00bf4bb2fcbf74d67b3fcb8a8ab4aa1279810
symbol_refs: []
semantic_role: assertion
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Name: Check formatting run: opa fmt --fail ..
vector_summary: Name: Check formatting run: opa fmt --fail .
chapter: CH-05
:::
- name: Check formatting run: opa fmt --fail .
:::

::: fact
id: BLK-d5f021f01e8b32e6
summary: Name: Lint (Regal) run: regal lint --format=github.
digest: f30861ea8d6b7edcb027d05978f974675674e80ab5fe6d25ed87bf26e21c37ce
symbol_refs: []
semantic_role: assertion
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Name: Lint (Regal) run: regal lint --format=github..
vector_summary: Name: Lint (Regal) run: regal lint --format=github.
chapter: CH-05
:::
- name: Lint (Regal) run: regal lint --format=github . Test stage name: Rego Tests on: [push, pull_request]
:::

::: fact
id: BLK-545646192799e4a9
summary: Use Rego-specific patterns (no inline comprehensions in allow/deny, etc.) in your rules system.
digest: b31ecb7fcdde5a7149b501dfa8f48e7709cbd4c68ae4299754fe9c59346d816a
symbol_refs: []
semantic_role: assertion
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Use Rego-specific patterns (no inline comprehensions in allow/deny, etc.) in your rules system..
vector_summary: Use Rego-specific patterns (no inline comprehensions in allow/deny, etc.) in your rules system.
chapter: CH-05
:::
jobs: test: runs-on: ubuntu-latest steps: - uses: actions/checkout@v4 - name: Install OPA run: | curl -L -o opa https://openpolicyagent.org/downloads/latest/opa_linux_amd64 chmod +x opa sudo mv opa /usr/local/bin/opa - name: Run tests run: opa test policies/ tests/ --verbose --timeout 30s Compliance evaluation stage (optional) Run opa eval with CI inputs (like PR diffs) to enforce policy gates. ________________________________________ 10.4 Editor & Developer Experience .editorconfig: [*.rego] indent_style = tab indent_size = 4 Editor extensions: Syntax highlighting, opa fmt on save. Regal integration where possible. For Cursor / custom AI agents: Auto-run opa fmt in pre-commit hooks. Use Rego-specific patterns (no inline comprehensions in allow/deny, etc.) in your rules system. ________________________________________ Chapter 11 – Performance Engineering (From Heuristics to Formal Bounds) OPA is fast, but bad policies can be slow. This chapter formalizes the performance story. ________________________________________ 11.1 Complexity Mental Model Roughly: Lookup in objects/sets: ~O(1) Array iteration: O(n) Nested iteration: O(n²) or worse Graph-like recursion: O(depth × fan-out), potentially exponential without care Your goal: rewrite policies such that most operations become hash lookups, not brute-force scans. ________________________________________ 11.2 Expression Ordering OPA evaluates rule bodies top to bottom, left to right within that body. Rearranging expressions can dramatically change performance.
:::

::: fact
id: BLK-4ae88044f166e17a
summary: # Slow pattern deny[msg] if { some u in data.users u.id == input.user_id not u.active msg := "User is inactive" } Instead, structure data.users as ...
digest: 3d1ad8ab54e06a428d7de35590de4c66066c7d3b6a3b5cb5df7f7a1b7f4210bf
symbol_refs: []
semantic_role: assertion
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that # Slow pattern deny[msg] if { some u in data.users u.id == input.user_id not u.active msg := "User is inactive" } Instead, structure data.users as ....
vector_summary: # Slow pattern deny[msg] if { some u in data.users u.id == input.user_id not u.active msg := "User is inactive" } Instead, structure data.users as ...
chapter: CH-05
:::
# Slow pattern deny[msg] if { some u in data.users u.id == input.user_id not u.active msg := "User is inactive" } Instead, structure data.users as a map keyed by ID: { "users": { "alice": {"id": "alice", "active": true}, "bob": {"id": "bob", "active": false} } } Then: user := data.users[input.user_id] deny[msg] if { user.active == false msg := "User is inactive" } OPA can automatically index these object lookups, giving near O(1) access. ________________________________________ 11.4 Avoiding Redundant Computation Bad: inefficient if { sum(numbers) > 100 sum(numbers) < 1000 result := sum(numbers) } Good: efficient if { total := sum(numbers) total > 100 total < 1000 result := total } OPA memoizes built-ins within a query, but you still pay the call overhead and it hurts readability. ________________________________________ 11.5 Comprehension Patterns Prefer existential patterns over building large intermediate sets:
:::

::: fact
id: BLK-bebdc8068b9afba0
summary: # Build a WebAssembly module for a specific entrypoint opa build -t wasm -e 'data.authz.allow' policies/.
digest: f80cd61503e05f4cdf26e5cad1a8921d378a6cdef29988ea90c2b9807c475ee6
symbol_refs: []
semantic_role: assertion
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that # Build a WebAssembly module for a specific entrypoint opa build -t wasm -e 'data.authz.allow' policies/..
vector_summary: # Build a WebAssembly module for a specific entrypoint opa build -t wasm -e 'data.authz.allow' policies/.
chapter: CH-05
:::
# Build a WebAssembly module for a specific entrypoint opa build -t wasm -e 'data.authz.allow' policies/
:::

::: fact
id: BLK-fd34e8211928ad97
summary: # Build a bundle for a specific entrypoint without WASM opa build -e 'data.authz.allow' policies/.
digest: 3e0f9d8a0278f4c951f57c572d5d2cc302feb58cb909cf88c43491f4c06998ff
symbol_refs: []
semantic_role: assertion
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that # Build a bundle for a specific entrypoint without WASM opa build -e 'data.authz.allow' policies/..
semantic_categories: [distribution]
vector_summary: # Build a bundle for a specific entrypoint without WASM opa build -e 'data.authz.allow' policies/.
chapter: CH-05
:::
# Build a bundle for a specific entrypoint without WASM opa build -e 'data.authz.allow' policies/
:::

::: fact
id: BLK-504b0b84d9f07aaf
summary: An optimized bundle (policy + data),.
digest: b1ac40efd62b8666b28a6cc82dff445ab6ca6b0b720234c2d1d20a9751b4cf6d
symbol_refs: []
semantic_role: assertion
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that An optimized bundle (policy + data),..
semantic_categories: [distribution]
vector_summary: An optimized bundle (policy + data),.
chapter: CH-05
:::
An optimized bundle (policy + data),
:::

::: fact
id: BLK-79a5d70928584f27
summary: Suitable for the standard OPA runtime, with partial eval already applied for that entrypoint.
digest: 117b270b66a0be1336f518e9ba9c25e5cb7f207ce61d7de2c54c687dc5649800
symbol_refs: []
semantic_role: assertion
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Suitable for the standard OPA runtime, with partial eval already applied for that entrypoint..
vector_summary: Suitable for the standard OPA runtime, with partial eval already applied for that entrypoint.
chapter: CH-05
:::
Suitable for the standard OPA runtime, with partial eval already applied for that entrypoint.
:::

::: fact
id: BLK-139c3fe74060a52b
summary: Opa eval --partial \ -d policies/ \ 'data.authz.allow'.
digest: 9a153c71c926f071a775260f7474898254b5766a042f04682fdfa7265688bf5e
symbol_refs: []
semantic_role: assertion
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Opa eval --partial \ -d policies/ \ 'data.authz.allow'..
vector_summary: Opa eval --partial \ -d policies/ \ 'data.authz.allow'.
chapter: CH-05
:::
opa eval --partial \ -d policies/ \ 'data.authz.allow'
:::

::: fact
id: BLK-cbf7f28fee540782
summary: Returns residual policy expressions capturing unknowns,.
digest: 7e0682fe70f7b85e98bf7b06fcb048fe11bf8592793533e3b4dcdd8d93acd27d
symbol_refs: []
semantic_role: assertion
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Returns residual policy expressions capturing unknowns,..
vector_summary: Returns residual policy expressions capturing unknowns,.
chapter: CH-05
:::
Returns residual policy expressions capturing unknowns,
:::

::: fact
id: BLK-5769859e9bd59db9
summary: Opa build -t wasm ..
digest: 018bb154559ebb406ea3acbc4354cb0adad3b308e61cd51cd5490299fa8fd11c
symbol_refs: []
semantic_role: assertion
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Opa build -t wasm ...
vector_summary: Opa build -t wasm ..
chapter: CH-05
:::
opa build -t wasm ... → WASM module for embedded/edge.
:::

::: fact
id: BLK-061653364bae9a32
summary: Opa build ..
digest: 154a02c5cedeeebc3499d4826f1434dc9e230f1b7fe32a36986c08833cc9bd72
symbol_refs: []
semantic_role: assertion
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Opa build ...
semantic_categories: [distribution]
vector_summary: Opa build ..
chapter: CH-05
:::
opa build ... → optimized bundle for standard OPA.
:::

::: fact
id: BLK-2f18848e7865b628
summary: Opa eval --partial ..
digest: 7f585895c832409a2ea0ec02af3e21b910099fe4cbf589064f545c6633f2098a
symbol_refs: []
semantic_role: assertion
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Opa eval --partial ...
vector_summary: Opa eval --partial ..
chapter: CH-05
:::
opa eval --partial ... → interactive partial eval for debugging and design. ________________________________________ Chapter 12 – Formal Semantics (Doctorate-Level View) Now we go under the hood. You don’t need this to use Rego, but you do need it to design new policy frameworks, reason about correctness, or write academic work. ________________________________________ 12.1 Rego as a Datalog Variant At its core, a Rego program is a set of Horn clauses (rules) over a Herbrand universe of JSON-like terms. A rule: h(t̄) if { b₁ ... bₙ } corresponds to: b_1∧⋯∧b_n⇒h(t ˉ)
:::

::: fact
id: BLK-f0e250b1b329925b
summary: Require that cycles with negation are disallowed or handled carefully.
digest: 207f1ce8885c4529456976767102df4d298e297b9555f5f413bfc935f1d1044c
symbol_refs: []
semantic_role: assertion
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Require that cycles with negation are disallowed or handled carefully..
semantic_categories: [negation]
vector_summary: Require that cycles with negation are disallowed or handled carefully.
chapter: CH-05
:::
To avoid paradoxes (like p :- not p), Rego effectively works in the space of stratified programs (or well-founded semantics): Build a dependency graph between predicates (rules). Require that cycles with negation are disallowed or handled carefully. This is why variables in negated expressions must be grounded elsewhere; otherwise, the semantics become ill-defined. ________________________________________ 12.5 Partial vs Complete Rules: Semantic Interpretation Complete rule (one final value): max_memory := 4 if ... max_memory := 8 if ... default max_memory := 1 Interpreted as a function max_memory : Input → Scalar such that: If multiple definitions apply and yield same value → OK. If they yield different values → conflict (no model). Partial rules (sets/objects): deny[msg] if ... deny[msg] if ... Interpreted as: deny={msg∣∃" body s.t." body⇒msg}
:::

::: fact
id: BLK-21f4fa8659b7887a
summary: Key points: P^'is smaller and more specialized.
digest: e512bfb7a5d64114555acb95a50c11c29ffe6148c626205589ab226c4163bee7
symbol_refs: []
semantic_role: assertion
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Key points: P^'is smaller and more specialized..
vector_summary: Key points: P^'is smaller and more specialized.
chapter: CH-05
:::
Key points: P^'is smaller and more specialized. OPA uses this to generate WASM or pre-compiled forms that execute efficiently for fixed queries.
:::

::: fact
id: BLK-1a2433cf2e7dd787
summary: Chapter 13 – Multi-Layer Policy Architecture Multi-layer policy architecture is how you scale from one clever Rego file to hundreds of policy owner...
digest: 60c9572589a100b73ab7e7ed53e7f509096a231240c7b82313d13a8b6fa5fc59
symbol_refs: []
semantic_role: architecture
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Chapter 13 – Multi-Layer Policy Architecture Multi-layer policy architecture is how you scale from one clever Rego file to hundreds of policy owner....
semantic_categories: [distribution]
vector_summary: Chapter 13 – Multi-Layer Policy Architecture Multi-layer policy architecture is how you scale from one clever Rego file to hundreds of policy owner...
chapter: CH-05
:::
Chapter 13 – Multi-Layer Policy Architecture Multi-layer policy architecture is how you scale from one clever Rego file to hundreds of policy owners, bundles, and tenants without descending into chaos. At scale, you need: • Layers: global → domain → team → tenant. • Ownership metadata: who owns what, and how severe is it. • Override semantics: how do layers combine, and who wins on conflict. ________________________________________ 13.1 Layer Model: Global → Domain → Team → Tenant Think of policies as a stack of overlays: 1. Global Baseline (Organization Level) o Owned by: security/compliance. o Guarantees non-negotiable invariants:  “No public S3 buckets”  “All admin actions must be audited” o Usually has the highest precedence for denies (security wins). 2. Domain Policies (Product / Platform Level) o Example domains:  crm.*, billing.*, identity.*. o Define domain-specific invariants:  “An Opportunity must have an associated Account”  “A Subscription must have a plan and billing cycle” 3. Team / Service Policies o Local teams add guardrails and UX-level rules:  “This API must include X-Request-Id”  “This microservice cannot call that microservice directly” 4. Tenant Overlays (Customer-Specific) o Per-tenant exceptions and configuration:  “Tenant A enforces stricter password rules”  “Tenant B has a special approval workflow” OPA sees all of these as data + Rego modules merged into a single virtual data tree. ________________________________________ 13.2 Encoding Layers in Data and Packages One robust pattern: • Global policies: package global.* • Domains: package domain.<name>.* • Teams/services: package svc.<service_name>.* • Tenant overlays: data.tenants[tenant_id].* Example structure: policies/ global/ baseline.rego # package global.baseline crm/ authz.rego # package domain.crm.authz schema.rego # package domain.crm.schema svc/ accounts.rego # package svc.accounts.rules tenants/ 123/ overrides.json # data.tenants["123"] 456/ overrides.json ________________________________________ 13.3 Policy Ownership Metadata Every rule that matters should be self-describing. You can store metadata as: • A dedicated rule (__meta__) • Rego annotations (via rego.metadata.rule()) • Comments (less machine-friendly) Example: package crm.policies.account_lifecycle
:::

::: fact
id: BLK-ffa5f256037b8448
summary: __meta__ := { "rule_id": "ACCT_001", "owner": "team-crm-platform", "service": "accounts-api", "layer": "domain", "severity": "BLOCK", # BLOCK | OVE...
digest: d1e93a894127fd56f732e34e932e094a8399ef7e5fbbeac8622c54898387b664
symbol_refs: []
semantic_role: assertion
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that __meta__ := { "rule_id": "ACCT_001", "owner": "team-crm-platform", "service": "accounts-api", "layer": "domain", "severity": "BLOCK", # BLOCK | OVE....
vector_summary: __meta__ := { "rule_id": "ACCT_001", "owner": "team-crm-platform", "service": "accounts-api", "layer": "domain", "severity": "BLOCK", # BLOCK | OVE...
chapter: CH-05
:::
__meta__ := { "rule_id": "ACCT_001", "owner": "team-crm-platform", "service": "accounts-api", "layer": "domain", "severity": "BLOCK", # BLOCK | OVERRIDE | WARN | INFO "version": "1.0.0", "tags": ["lifecycle", "compliance"] }
:::

::: fact
id: BLK-af753aeced1226aa
summary: Deny[msg] if { input.account.status == "closed" input.action == "reopen" msg := { "rule_id": __meta__.rule_id, "owner": __meta__.owner, "msg": "Clo...
digest: 5e67af4148923b8482b9158b4b7944e1572225e542293f96f9956dd409f1cdb4
symbol_refs: []
semantic_role: assertion
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Deny[msg] if { input.account.status == "closed" input.action == "reopen" msg := { "rule_id": __meta__.rule_id, "owner": __meta__.owner, "msg": "Clo....
vector_summary: Deny[msg] if { input.account.status == "closed" input.action == "reopen" msg := { "rule_id": __meta__.rule_id, "owner": __meta__.owner, "msg": "Clo...
chapter: CH-05
:::
deny[msg] if { input.account.status == "closed" input.action == "reopen" msg := { "rule_id": __meta__.rule_id, "owner": __meta__.owner, "msg": "Closed accounts cannot be reopened", } } For global policies: package global.network
:::

::: fact
id: BLK-9917457deaa0fcf0
summary: __meta__ := { "rule_id": "NET_001", "layer": "global", "severity": "BLOCK", "owner": "sec-net", }.
digest: bd2cb430d9efdfadd982163903683d32f305f760356e2518a71bb263d600f5e9
symbol_refs: []
semantic_role: assertion
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that __meta__ := { "rule_id": "NET_001", "layer": "global", "severity": "BLOCK", "owner": "sec-net", }..
vector_summary: __meta__ := { "rule_id": "NET_001", "layer": "global", "severity": "BLOCK", "owner": "sec-net", }.
chapter: CH-05
:::
__meta__ := { "rule_id": "NET_001", "layer": "global", "severity": "BLOCK", "owner": "sec-net", }
:::

::: fact
id: BLK-eccf109bc4dfb522
summary: Effects[eff] if { eff := data.svc.accounts.rules.effects[_] }.
digest: f1d1d87a52369a0d8398a07b14dff0df892a371512f14c3780b8679e25627976
symbol_refs: []
semantic_role: assertion
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Effects[eff] if { eff := data.svc.accounts.rules.effects[_] }..
vector_summary: Effects[eff] if { eff := data.svc.accounts.rules.effects[_] }.
chapter: CH-05
:::
effects[eff] if { eff := data.svc.accounts.rules.effects[_] }
:::

::: fact
id: BLK-c10db066c498a48d
summary: Result := { "allow": allow, "effects": all_effects, } if { all_effects := [e | e := effects[_]].
digest: cb81451c81ec5b562bfadd4887deb024940e40e12db26534a9fcddd7df91995c
symbol_refs: []
semantic_role: assertion
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Result := { "allow": allow, "effects": all_effects, } if { all_effects := [e | e := effects[_]]..
vector_summary: Result := { "allow": allow, "effects": all_effects, } if { all_effects := [e | e := effects[_]].
chapter: CH-05
:::
effects[eff] if { tenant := input.tenant_id eff := data.tenants[tenant].overlays.effects[_] } Each eff looks like: { "effect": "deny", "layer": "global", "rule_id": "NET_001", "severity": "BLOCK", "msg": "Public S3 bucket forbidden" } Now: compute final decision. result := { "allow": allow, "effects": all_effects, } if { all_effects := [e | e := effects[_]]
:::

::: fact
id: BLK-af46131c6bb3a8ce
summary: # Fallback: if no BLOCK denies, then allow if explicit allow exists or default rules say so.
digest: fd0c39f68a2f97eba0d820631a5b6a8e4196380599d466792fc3d0f854243b41
symbol_refs: []
semantic_role: assertion
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that # Fallback: if no BLOCK denies, then allow if explicit allow exists or default rules say so..
vector_summary: # Fallback: if no BLOCK denies, then allow if explicit allow exists or default rules say so.
chapter: CH-05
:::
# Fallback: if no BLOCK denies, then allow if explicit allow exists or default rules say so. result := { "allow": allow_flag, "effects": all_effects, } if { all_effects := [e | e := effects[_]] not some e in all_effects { e.effect == "deny"; e.severity == "BLOCK" }
:::

::: fact
id: BLK-3fe483d8d3a22e99
summary: Allow_flag := some e in all_effects { e.effect == "allow" } } You can refine this by: • Picking highest-ranked deny by layer rank.
digest: 2dd891decc3aa2b7cc31eb7bca2ae2ecc34bbfce4a4e2710308a22a0d89df16e
symbol_refs: []
semantic_role: assertion
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Allow_flag := some e in all_effects { e.effect == "allow" } } You can refine this by: • Picking highest-ranked deny by layer rank..
vector_summary: Allow_flag := some e in all_effects { e.effect == "allow" } } You can refine this by: • Picking highest-ranked deny by layer rank.
chapter: CH-05
:::
allow_flag := some e in all_effects { e.effect == "allow" } } You can refine this by: • Picking highest-ranked deny by layer rank. • Allowing tenant to tighten, but never to weaken global invariants. ________________________________________ 13.5 Tenant Overlays and Safe Customization Tenant-specific rules should be additive and tightening, not weakening: • Allowed: o Tenant can restrict their own behavior further. • Forbidden: o Tenant cannot bypass global security invariants. Pattern: package authz
:::

::: fact
id: BLK-1a8da57b7485efda
summary: Allow if { base_allow not tenant_extra_deny[_] } This gives global → domain final say on allow, and tenant extra ways to say “no.” ________________...
digest: be8372d2eb294efefbb175c2938510c486d5065801fbf16f2432482f17f4122b
symbol_refs: []
semantic_role: assertion
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Allow if { base_allow not tenant_extra_deny[_] } This gives global → domain final say on allow, and tenant extra ways to say “no.” ________________....
semantic_categories: [distribution, observability]
vector_summary: Allow if { base_allow not tenant_extra_deny[_] } This gives global → domain final say on allow, and tenant extra ways to say “no.” ________________...
chapter: CH-05
:::
allow if { base_allow not tenant_extra_deny[_] } This gives global → domain final say on allow, and tenant extra ways to say “no.” ________________________________________ Chapter 14 – Observability & Audit OPA is not only a decision engine; it’s an evidence generator. Observability and audit are how you prove that decisions are: • Correct • Consistent • Explainable • Compliant with regulation ________________________________________ 14.1 Decision Logs Every OPA decision should be treatable as a replayable event: Minimum recommended fields: • decision_id (UUID) • timestamp • path (e.g., data.authz.allow) • input_hash or input (with PII scrubbing) • result (decision doc: allow/deny/effects) • bundle_revision • metrics (evaluation time, rule count) • correlation_id (to tie into tracing) Conceptual log: { "decision_id": "3f7b9b1a-0ee2-4e52-9f39-4edb8b6a3a01", "timestamp": "2025-12-05T10:02:45Z", "path": "data.authz.allow", "input_hash": "sha256:abcd...", "result": { "allow": false, "effects": [ { "effect": "deny", "rule_id": "ACCT_001", "layer": "domain", "msg": "Closed accounts cannot be reopened" } ] }, "bundle_revision": "git:1234abcd", "metrics": { "eval_time_ns": 45321, "num_rules_evaluated": 37 }, "correlation_id": "trace-xyz-123" } OPA supports decision logs via configuration; your host system should stream them to: • Kafka / Kinesis • ELK / Loki • Datadog / Prometheus / Grafana ________________________________________ 14.2 Metrics and SLOs To treat OPA like a production service, track at least: • Latency: o p50 / p95 / p99 evaluation time. • Throughput: o decisions per second. • Decision deltas: o How often outcomes change after a new bundle. • Error rate: o Number of evaluation failures (e.g., built-in errors in strict mode). Define SLOs like: • 99.9% of policy decisions complete in < 10 ms. • < 0.1% of decisions result in evaluation error. • Decision delta after bundle rollout < 1% for stable inputs (in shadow mode). ________________________________________ 14.3 Correlation IDs and Tracing Policy evaluations rarely stand alone; they’re part of a larger request trace: • HTTP header: o X-Request-Id o traceparent (W3C Trace Context) • PEP should pass correlation ID in: o input.trace_id o or embed as part of input.request.headers. Then decision logs include correlation_id, which lets you: • Trace a single user’s journey across services. • Root-cause analyze unauthorized/denied requests quickly. Example pattern: package authz
:::

::: fact
id: BLK-28e58a316e04a314
summary: # decision doc decision := { "allow": allow, "trace_id": trace_id, } ________________________________________ 14.4 PII and Redaction in Logs Golden...
digest: a1d59c7b409c593324d72e15e37d41355ec3b9a9bcb30eb34868512ea94786a6
symbol_refs: []
semantic_role: assertion
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that # decision doc decision := { "allow": allow, "trace_id": trace_id, } ________________________________________ 14.4 PII and Redaction in Logs Golden....
semantic_categories: [distribution, observability]
vector_summary: # decision doc decision := { "allow": allow, "trace_id": trace_id, } ________________________________________ 14.4 PII and Redaction in Logs Golden...
chapter: CH-05
:::
# decision doc decision := { "allow": allow, "trace_id": trace_id, } ________________________________________ 14.4 PII and Redaction in Logs Golden rule: logs must not become a data breach. • Do not log entire input if it contains PII. • Instead: o Log hashed fields (hash(email)) o Log ids / foreign keys o Redact sensitive values (e.g., use "redacted") Pattern: safe_input := { "user_id": input.user.id, "tenant_id": input.tenant_id, "resource_id": input.resource.id, "action": input.action, } Your decision logger uses safe_input rather than raw input. ________________________________________ 14.5 Reproducibility & Auditability A compliant audit story usually needs: • Given: o bundle_revision o policy_version o input (or hash + associated fixture) • You can re-evaluate the decision and get the same result. To achieve this: • Store: o Bundle artifacts (bundle.tar.gz) o Manifest metadata (revision, version) o Decision logs + input fixtures (or deterministic reconstruction) • Avoid: o Non-deterministic calls in Rego (e.g., random, uncontrolled http.send) When you must use time.now_ns or external data: • Either: o Snapshot it in the input used to evaluate. o Or store enough context to reconstruct. ________________________________________ Chapter 15 – Stateful & Temporal Extensions OPA itself is stateless: each query sees input and data as immutable snapshots. Yet many policies are stateful or temporal: • Rate limits (N requests per unit time) • “No more than 5 failed logins in 10 minutes” • “This migration must be rolled out only after all canaries pass” The trick: Move state and time into data + input, not inside Rego. ________________________________________ Stateful & Temporal Extensions
:::

::: fact
id: BLK-20e31440afe0e8ca
summary: OPA is logically stateless: every evaluation sees a snapshot of policy + data.
digest: 8b4d598e26c1c3496a715ac8ae81ad01402c926b0f7c4524723556cbb204b336
symbol_refs: []
semantic_role: assertion
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that OPA is logically stateless: every evaluation sees a snapshot of policy + data..
vector_summary: OPA is logically stateless: every evaluation sees a snapshot of policy + data.
chapter: CH-05
:::
OPA is logically stateless: every evaluation sees a snapshot of policy + data. Stateful or temporal behaviors must be modeled via external systems that write to data or pass state through input.
:::

::: fact
id: BLK-8a79fd9ce8c38157
summary: OPA never mutates data.state.login_counts.
digest: 054787df486a86010171840e840723c81c36c164eab11423eecdcf5cfffb4a5a
symbol_refs: []
semantic_role: assertion
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that OPA never mutates data.state.login_counts..
vector_summary: OPA never mutates data.state.login_counts.
chapter: CH-05
:::
OPA never mutates data.state.login_counts.
:::

::: fact
id: BLK-bbdc4627b644d8c5
summary: Or an in-memory structure via the OPA Go SDK,.
digest: c9486134cb3ed8c27b91dcb086d67ef4429848eb2dd49f3796750d0d8e3503b1
symbol_refs: []
semantic_role: assertion
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Or an in-memory structure via the OPA Go SDK,..
vector_summary: Or an in-memory structure via the OPA Go SDK,.
chapter: CH-05
:::
or an in-memory structure via the OPA Go SDK,
:::

::: fact
id: BLK-7b4eb1a9e305379f
summary: Or a shared cache that OPA reads from.
digest: eb0ce55423bd34dd124cfed4a8bbd612c614835dabe1f57707da0553b51a8ce5
symbol_refs: []
semantic_role: assertion
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Or a shared cache that OPA reads from..
vector_summary: Or a shared cache that OPA reads from.
chapter: CH-05
:::
or a shared cache that OPA reads from.
:::

::: fact
id: BLK-1cb53c48958ecdaa
summary: OPA Policy → reads data.state.* as a pure input.
digest: f970dc0f9ad4b0c317b1830bbc9b40ed69f36020f29369c82ed4226e91290c3d
symbol_refs: []
semantic_role: assertion
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that OPA Policy → reads data.state.* as a pure input..
vector_summary: OPA Policy → reads data.state.* as a pure input.
chapter: CH-05
:::
OPA Policy → reads data.state.* as a pure input.
:::

::: fact
id: BLK-97da80a1bfbb763f
summary: OPA remains a pure decision engine; all state transitions happen outside.
digest: aac700f26f9933c7d517a7693ad0cab9f5905a7855c4933fa1ef88af47e01fd1
symbol_refs: []
semantic_role: assertion
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that OPA remains a pure decision engine; all state transitions happen outside..
vector_summary: OPA remains a pure decision engine; all state transitions happen outside.
chapter: CH-05
:::
OPA remains a pure decision engine; all state transitions happen outside. ________________________________________ 15.2 Temporal Logic Using time.* OPA has: • time.now_ns() • time.parse_ns(layout, string) • time.clock(ns) and time.date(ns) • time.weekday(ns) Patterns: 1. Business hours 2. package business 3. 4. within_business_hours if { 5. now := time.now_ns() 6. [hour, _, _] := time.clock(now) 7. hour >= 9 8. hour < 17 9. } 10. Sliding window from event log in input Suppose input.events contains last 1 hour of events (pre-filtered by upstream system): package limits
:::

::: fact
id: BLK-ddb2b91d0cd87295
summary: OPA uses that state to decide: o Allow or deny new events.
digest: 670e1badeab48c6816b448b593d4a6c23bec815ef7835a98fcfc497515f36e68
symbol_refs: []
semantic_role: architecture
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that OPA uses that state to decide: o Allow or deny new events..
semantic_categories: [distribution]
vector_summary: OPA uses that state to decide: o Allow or deny new events.
chapter: CH-05
:::
count(recent_failures) > 5 msg := "Too many recent login failures" } OPA sees only a subset; the window is curated by your stateful event pipeline. ________________________________________ 15.3 Event-Driven Architectures with OPA Typical pattern: 1. Events flow into Kafka / Kinesis. 2. A stream processor: o Maintains aggregates:  counts, sums, last-seen times, sliding windows. o Writes materialized state to:  Redis, DB, or data-bundles for OPA. 3. OPA uses that state to decide: o Allow or deny new events. o Trigger downstream actions/alerts. OPA remains pure — no long-lived state, no hidden mutable variables. ________________________________________ 15.4 Time-Scoped Exceptions Sometimes you want: • “Allow this temporary override until 2025-12-05.” Pattern: package overrides
:::

::: fact
id: BLK-239395e2f35c1d1c
summary: Allow if { count(violations) == 0 } ________________________________________ Data Policy Models & GraphQL Costing.
digest: b965e5ca38509dce23b24d3774cfeaa819553640411e8f264ee5ba5a590ba94d
symbol_refs: []
semantic_role: assertion
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Allow if { count(violations) == 0 } ________________________________________ Data Policy Models & GraphQL Costing..
vector_summary: Allow if { count(violations) == 0 } ________________________________________ Data Policy Models & GraphQL Costing.
chapter: CH-05
:::
allow if { count(violations) == 0 } ________________________________________ Data Policy Models & GraphQL Costing
:::

::: fact
id: BLK-780f6a8ebb08e0bf
summary: 16.2 Field Cost Calculation (Corrected array.concat).
digest: 5332e984600a050c4586a23c3908b5084a216fa12b9b99860bfc92d048de301b
symbol_refs: []
semantic_role: assertion
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that 16.2 Field Cost Calculation (Corrected array.concat)..
vector_summary: 16.2 Field Cost Calculation (Corrected array.concat).
chapter: CH-05
:::
16.2 Field Cost Calculation (Corrected array.concat)
:::

::: fact
id: BLK-07f8a2771f295779
summary: Corrections and nuances:.
digest: b01ba3743cd626967bd113e26801c5e7272ef84cc94c62ba73d0e3c2c4cd9397
symbol_refs: []
semantic_role: assertion
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Corrections and nuances:..
vector_summary: Corrections and nuances:.
chapter: CH-05
:::
Corrections and nuances:
:::

::: fact
id: BLK-1606d5d3769853a7
summary: If either argument is null or non-array, OPA throws a type error, so in more defensive code:.
digest: d725fbecf51830efb17364bca108b7e7fcf608e85c1d5e8ff32e3108f14966f5
symbol_refs: []
semantic_role: assertion
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that If either argument is null or non-array, OPA throws a type error, so in more defensive code:..
vector_summary: If either argument is null or non-array, OPA throws a type error, so in more defensive code:.
chapter: CH-05
:::
If either argument is null or non-array, OPA throws a type error, so in more defensive code:
:::

::: fact
id: BLK-c191fd1bb522212a
summary: • Allows multiple services to enforce the same logic.
digest: 08b853ab68fa3dbde69f0a05e01f0fea3be0c16e733b69eea01a7c850e578983
symbol_refs: []
semantic_role: reference
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that • Allows multiple services to enforce the same logic..
semantic_categories: [distribution, unification]
vector_summary: • Allows multiple services to enforce the same logic.
chapter: CH-05
:::
statuses_for(user) := {"active"} if { not "admin" in user.roles } This pattern: • Keeps data access rules central. • Allows multiple services to enforce the same logic. ________________________________________ Chapter 17 – LLM & Agentic Integration with OPA LLMs are good at generating Rego, OPA is good at executing and verifying Rego. Together they form: “AI drafts policy, OPA and tests keep it safe.” ________________________________________ 17.1 The Agentic Workflow Canonical pipeline: 1. Requirements in natural language: o “API keys must not be visible in logs” o “Admin role modifications require approval” 2. LLM drafts: o Rego module. o Test suite (_test.rego). o Metadata (owner, rule_id). 3. Static checks: o opa fmt o Regal lint o opa check --strict 4. Dynamic checks: o opa test (unit + integration tests). o Fuzz/Golden tests for critical policies. 5. Human review: o Security / Policy engineers review diff, semantics. 6. Bundle build & rollout: o Standard policy SDLC. OPA becomes the execution and verification back-end for LLM-authored policy. ________________________________________ 17.2 Guardrails for LLM-Generated Rego When you let an LLM write Rego, you must: • Enforce style & safety: o Modern syntax only (import rego.v1 or future.keywords). o No http.send in production rules (unless explicitly allowed). o No secrets in code. o Type guards for all input.* references. • Require tests: o At least one positive and one negative case. o Use with overrides instead of real network/time. You can encode this as Rego that reviews Rego: • Use rego.metadata.chain() and AST analysis to enforce rules. • Or use external tools (Regal) plus your own AST/grep rules. ________________________________________ 17.3 “Policy Copilot” Pattern A typical agentic stack: 1. Authoring agent: o Generates initial Rego module + tests from description and examples. 2. Critic agent: o Reads module, runs static analysis (Regal messages, opa check). o Suggests improvements and simplifications. 3. Tester agent: o Proposes additional tests (edge cases, negative paths). o Extends _test.rego. 4. Reviewer agent: o Summarizes behavior in human language. o Flags risky constructs, ambiguous cases. 5. Bundle builder: o Once human approves, compiles into bundle artifact. OPA is the deterministic core all these agents orbit around. ________________________________________ 17.4 LLM Self-Checking with Rego LLMs can call OPA during prompt execution: • Use examples like: o “Write a policy such that opa eval returns allow=true for these inputs and false for others.” • LLM loops: 1. Generate candidate Rego. 2. Invoke opa test programmatically. 3. If tests fail, update policy and try again (up to N iterations). 4. Present final Rego + test report. This turns Rego into a ground truth oracle inside an agentic system. ________________________________________ Chapter 18 – Rego Cheat Sheet (Condensed) This chapter is intentionally tight – it’s the 2-page desk reference. ________________________________________ 18.1 Core Rule Types Type Syntax Example Boolean name if { ... } allow if { is_admin } Complete name := value if { ... } max_conns := 10 if is_admin Partial Set name contains x if { ... } deny contains msg if { ... } Partial Obj name[key] := value if { ... } roles[user] := role if { ... } Function f(x) := y if { ... } double(x) := x * 2 Default default name = value default allow = false ________________________________________ 18.2 Assignments & Comparisons • := – assignment (one-way) • == – equality (no binding) • = – unification (binds if unbound, else compares) Examples: x := 10 # assignment ok if x == 10 # comparison
:::

::: fact
id: BLK-b1c0d736416df0fe
summary: Test_admin_can_read if { authz.allow with input as {"user": "alice", "role": "admin"} } Run: opa test .
digest: 4697f441aa914d829310f71452b5c403d63591a28de5c725a7e496eba2fd5240
symbol_refs: []
semantic_role: architecture
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Test_admin_can_read if { authz.allow with input as {"user": "alice", "role": "admin"} } Run: opa test ..
semantic_categories: [authz, distribution, negation, observability, performance, testing, theory]
vector_summary: Test_admin_can_read if { authz.allow with input as {"user": "alice", "role": "admin"} } Run: opa test .
chapter: CH-05
:::
**Important:** `set()` is a type conversion function (e.g., `set([1,2,3])` → `{1,2,3}`) and requires an argument. To create an empty set, use `{}` directly. Using `set()` without arguments will cause a runtime error. ________________________________________ 18.4 Iteration Implicit: arr[_] # all values obj[k] # binds k to each key set[v] # binds v to each member Explicit with some ... in: some x in arr # values some i, x in arr # index, value some k, v in obj # key, value some v in set # members ________________________________________ 18.5 Quantifiers • Existential: some x in xs { ... } • Universal: o Using every: o all_valid if { o every x in xs { o x.valid == true o } o } o Or via negation: o all_valid if not any_invalid o any_invalid if { o some x in xs o not x.valid o } ________________________________________ 18.6 Negation not cond = “cannot prove cond.” Safety: variables in cond must be bound beforehand. deny if { user := input.user not blacklisted[user] } ________________________________________ 18.7 Built-in Highlights • Aggregates: count, sum, max, min • Strings: concat, contains, startswith, endswith, split, replace • Regex: regex.match, regex.split • JSON: json.marshal, json.unmarshal • Time: time.now_ns, time.parse_rfc3339_ns, time.clock • Crypto: crypto.sha256, io.jwt.* ________________________________________ 18.8 Testing • Tests: package ending in _test, rules starting with test_. • Use with to override input, data, or built-ins. test_admin_can_read if { authz.allow with input as {"user": "alice", "role": "admin"} } Run: opa test . ________________________________________ 18.9 Best Practices (Ultra Condensed) • Always opa fmt and lint. • Use modern syntax (import rego.v1 or future.keywords). • Prefer sets/objects for membership tests. • Avoid inline comprehensions in complex allow/deny. • Use helper rules with clear names. • Always have tests for deny/allow semantics. ________________________________________ Chapter 19 – Glossary (Rigorous) Alphabetical list of core terms. ________________________________________ ABAC (Attribute-Based Access Control) Access model where decisions are based on attributes of subject, resource, action, and environment, not just roles. Allow / Deny (Effects) Canonical authorization decision outcomes. Frequently modeled via Rego rules like allow and deny or decision documents with effects. AST (Abstract Syntax Tree) Tree representation of parsed input (e.g., GraphQL query), often passed to OPA as input for fine-grained policies. Baseline Policy (Global Baseline) Organization-wide invariant policy layer that lower layers cannot override or weaken (e.g., “No public S3 buckets”). Bundle A versioned tarball containing Rego policies, data, and a .manifest file. Used by OPA to load and update policies in production. Complete Rule A Rego rule that defines a single final value (e.g., max_conns := 10 or allow := true). Multiple definitions that produce different values for the same input cause conflicts. ConstraintTemplate (Gatekeeper) Kubernetes CRD that defines reusable OPA policies for Gatekeeper. Users instantiate constraints based on templates. Correlation ID Identifier used to tie together logs and traces across systems, included in OPA decision logs for observability. Data (in OPA) Persistent, relatively static information (loaded from bundles or in-memory), accessed as data.*. May mirror configuration, schemas, user roles, etc. Decision Document The JSON result of an OPA query (e.g., data.authz.allow or a more complex document with allow, deny, effects, risk_score). Decision Log Structured record of each OPA evaluation: includes path, input (or hash), result, metrics, and bundle revision, used for audit and observability. Datalog A subset of Prolog used for declarative logic programming, without complex function symbols. Rego is inspired by Datalog and extends it with JSON-like structures. Deny Rule A partial rule (often deny[msg] or deny contains msg) that accumulates violation messages, typically used in compliance and validation policies. Effect The semantic outcome of a policy evaluation (e.g., "allow", "deny", "warn", "override"), often encoded in decision documents. Fixpoint A stable interpretation of a logic program where applying the immediate consequence operator (deriving new facts) produces no new facts. Rego’s semantics can be described via least fixpoints. Future Keywords The future.keywords import (Rego v0.x) that enables newer language constructs like if, in, contains, every. In OPA 1.0+ this is replaced by import rego.v1. Global Baseline See Baseline Policy: global layer of policies applied to all services/tenants, usually with highest precedence for security. GraphQL Policy Policy that operates on GraphQL queries represented as AST; can enforce field-level auth, query depth, or cost. HTTP Sidecar Deployment pattern where OPA runs as a sidecar container next to a service, receiving authorization queries over localhost. Input (in OPA) Per-request JSON document provided by the caller to OPA, containing details like user, action, resource, HTTP request, etc. Accessed as input.*. LLM (Large Language Model) Neural network model (like ChatGPT) used to generate or refactor Rego; OPA then validates and executes resulting policies. NAF (Negation-as-Failure) Logic programming semantics where not p(X) means “p(X) cannot be proven.” Used in Rego for negation. OPA (Open Policy Agent) General-purpose policy decision engine that evaluates Rego policies against JSON inputs and data. PDP (Policy Decision Point) Component that computes policy decisions (e.g., OPA). PEP (Policy Enforcement Point) Component that enforces decisions (e.g., API gateway, Kubernetes admission controller). Partial Evaluation (PE) Technique where OPA specializes policies with respect to known input and data, producing an optimized, often smaller program or WASM artifact. Partial Rule A Rego rule that defines members of a virtual set or object incrementally (e.g., deny[msg] or roles[user] := role). Rego OPA’s declarative policy language, inspired by Datalog and designed for reasoning over JSON-like documents. Regal A dedicated linter for Rego, enforcing style and correctness rules beyond opa fmt. Rule Conflict Runtime error when multiple complete rules or function rules with the same name and arguments produce different values. Schema (JSON Schema) Formal type definition for JSON documents. OPA can use schemas to perform type checking on input or data. Sidecar Deployment pattern where OPA runs alongside an application in the same Pod/host, reducing network latency for policy queries. Stateful Policy Policy whose decision depends on past events or accumulated state. Implemented in OPA by passing state snapshots as data or input, not by mutability in Rego. Stratification Property of a logic program whereby cycles through negation are avoided, enabling well-defined semantics for negation-as-failure. Temporal Policy Policy that involves time (e.g., deadlines, windows, schedules), typically implemented with time.* built-ins and time-stamped state. Tenant Overlay Per-tenant policy or configuration that tightens (but does not weaken) global/domain rules, often stored under data.tenants[tenant_id]. Virtual Document A Rego rule or package that behaves like a JSON document when queried (e.g., data.authz.allow), although it is computed on demand rather than stored. WASM (WebAssembly) Portable binary format that can run Rego policies compiled from OPA in multiple environments (browsers, proxies, services). With (Keyword) Rego keyword that allows overriding input, data, or built-ins for the scope of an expression; heavily used in testing and mocking. Zero-Trust Architecture Security model where no implicit trust is granted to assets or user accounts based solely on network location; OPA policies often implement zero-trust authorization logic.
:::

::: fact
id: BLK-a6843e981cac13eb
summary: The full decision path for a typical OPA evaluation looks like this:.
digest: ac187abb001917df73da6e38931b144bad4522b20bffea1a6d7e184ac7e22d78
symbol_refs: []
semantic_role: assertion
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that The full decision path for a typical OPA evaluation looks like this:..
vector_summary: The full decision path for a typical OPA evaluation looks like this:.
chapter: CH-05
:::
The full decision path for a typical OPA evaluation looks like this:
:::

::: fact
id: BLK-a81ca863b9a3b7d5
summary: Flowchart LR A[Client / Service] -->|HTTP/SDK| B[OPA] B --> C[Parse & Compile Policies] C --> D[Load Data Bundles] D --> E[Evaluate Query] E --> F[...
digest: 195e5dcbe49cd67bc4887479f5a981f363e6a9a5b4db21ac766dbc192e6af54e
symbol_refs: []
semantic_role: decision-flow
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Flowchart LR A[Client / Service] -->|HTTP/SDK| B[OPA] B --> C[Parse & Compile Policies] C --> D[Load Data Bundles] D --> E[Evaluate Query] E --> F[....
semantic_categories: [distribution]
vector_summary: Flowchart LR A[Client / Service] -->|HTTP/SDK| B[OPA] B --> C[Parse & Compile Policies] C --> D[Load Data Bundles] D --> E[Evaluate Query] E --> F[...
chapter: CH-05
:::
flowchart LR A[Client / Service] -->|HTTP/SDK| B[OPA] B --> C[Parse & Compile Policies] C --> D[Load Data Bundles] D --> E[Evaluate Query] E --> F[Decision Document]
:::

::: fact
id: BLK-75ee5ef88004b802
summary: Flowchart TD R[Request: input] --> OPA[OPA Engine].
digest: ad4f13027aa76b5a3a227477990ea35157134531195579f67adc0b778bb3ef49
symbol_refs: []
semantic_role: assertion
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Flowchart TD R[Request: input] --> OPA[OPA Engine]..
vector_summary: Flowchart TD R[Request: input] --> OPA[OPA Engine].
chapter: CH-05
:::
flowchart TD R[Request: input] --> OPA[OPA Engine]
:::

::: fact
id: BLK-3a12d7c2cc6d03a1
summary: Subgraph Policy Lifecycle P[Parse Rego] --> Q[Compile to IR] Q --> PE[Optional: Partial Eval] end.
digest: 6647fad3434cca2f54f686be98f38f3477fcfbe6a8aacd6f442c4850517d0ae1
symbol_refs: []
semantic_role: assertion
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Subgraph Policy Lifecycle P[Parse Rego] --> Q[Compile to IR] Q --> PE[Optional: Partial Eval] end..
vector_summary: Subgraph Policy Lifecycle P[Parse Rego] --> Q[Compile to IR] Q --> PE[Optional: Partial Eval] end.
chapter: CH-05
:::
subgraph Policy Lifecycle P[Parse Rego] --> Q[Compile to IR] Q --> PE[Optional: Partial Eval] end
:::

::: fact
id: BLK-bfc749d64868bc9b
summary: OPA --> P PE --> D1[Optimized Policy Set].
digest: 2613f11f4a1489984642a66971c6e474ab9396755ccc4ad5bde2c8d535e9f896
symbol_refs: []
semantic_role: assertion
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that OPA --> P PE --> D1[Optimized Policy Set]..
vector_summary: OPA --> P PE --> D1[Optimized Policy Set].
chapter: CH-05
:::
OPA --> P PE --> D1[Optimized Policy Set]
:::

::: fact
id: BLK-6a5cb055b34e7cb6
summary: OPA can be deployed in three canonical modes: sidecar, central service, and embedded.
digest: f85bdd3fbd63dfcb175411575f5066dfd49b00120b9ec836a0678a1240e9a714
symbol_refs: []
semantic_role: assertion
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that OPA can be deployed in three canonical modes: sidecar, central service, and embedded..
vector_summary: OPA can be deployed in three canonical modes: sidecar, central service, and embedded.
chapter: CH-05
:::
OPA can be deployed in three canonical modes: sidecar, central service, and embedded.
:::

::: fact
id: BLK-5be303f8619ebc37
summary: Flowchart LR subgraph Sidecar Mode A1[App Pod] --- O1[OPA Sidecar] end.
digest: f4c0bd4c951ae3c4245876c267e50d3524a55227fde30de281ca4bfd1fc78ca1
symbol_refs: []
semantic_role: assertion
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Flowchart LR subgraph Sidecar Mode A1[App Pod] --- O1[OPA Sidecar] end..
vector_summary: Flowchart LR subgraph Sidecar Mode A1[App Pod] --- O1[OPA Sidecar] end.
chapter: CH-05
:::
flowchart LR subgraph Sidecar Mode A1[App Pod] --- O1[OPA Sidecar] end
:::

::: fact
id: BLK-f3d455506a6b7cc8
summary: Subgraph Central Service A2[Apps / Gateways] --> O2[OPA Cluster] end.
digest: 8bcf6e2fde2d1f05c4c402e4d6e1603b491e0898bfd0b32593807e7d41c63183
symbol_refs: []
semantic_role: assertion
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Subgraph Central Service A2[Apps / Gateways] --> O2[OPA Cluster] end..
vector_summary: Subgraph Central Service A2[Apps / Gateways] --> O2[OPA Cluster] end.
chapter: CH-05
:::
subgraph Central Service A2[Apps / Gateways] --> O2[OPA Cluster] end
:::

::: fact
id: BLK-a164ce803bbdb95f
summary: Subgraph Embedded Library A3[App Process with OPA SDK] end.
digest: d0839eb5ccc9da1e0e5257e70f69cf3a1bb017516c744b63352b47242e45a9b7
symbol_refs: []
semantic_role: assertion
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Subgraph Embedded Library A3[App Process with OPA SDK] end..
vector_summary: Subgraph Embedded Library A3[App Process with OPA SDK] end.
chapter: CH-05
:::
subgraph Embedded Library A3[App Process with OPA SDK] end
:::

::: fact
id: BLK-0917a2a8dc7a41ce
summary: 8.X.1 Sidecar Mode flowchart LR SVC[Service Container] -->|localhost:8181 /v1/data/...| OPA[OPA Sidecar].
digest: a647ab4714e3a37c5a92192a5ede75076109fe5f51f88dacf2ef5d6286ed2636
symbol_refs: []
semantic_role: assertion
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that 8.X.1 Sidecar Mode flowchart LR SVC[Service Container] -->|localhost:8181 /v1/data/...| OPA[OPA Sidecar]..
vector_summary: 8.X.1 Sidecar Mode flowchart LR SVC[Service Container] -->|localhost:8181 /v1/data/...| OPA[OPA Sidecar].
chapter: CH-05
:::
8.X.1 Sidecar Mode flowchart LR SVC[Service Container] -->|localhost:8181 /v1/data/...| OPA[OPA Sidecar]
:::

::: fact
id: BLK-b08121aaef4efdfc
summary: B[BUNDLE Server] --> OPA.
digest: 0e3f4c9a306576a1214ae7ff3d9c59b199ad4f937895391c718e056ec6f28f5d
symbol_refs: []
semantic_role: assertion
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that B[BUNDLE Server] --> OPA..
semantic_categories: [distribution]
vector_summary: B[BUNDLE Server] --> OPA.
chapter: CH-05
:::
B[BUNDLE Server] --> OPA
:::

::: fact
id: BLK-f133e19232661cc2
summary: Each app pod has its own OPA.
digest: 43a00173c975a9600351bccfa0fa216ad70c572991f45191a05d63b9723640ff
symbol_refs: []
semantic_role: assertion
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Each app pod has its own OPA..
vector_summary: Each app pod has its own OPA.
chapter: CH-05
:::
Each app pod has its own OPA.
:::

::: fact
id: BLK-bf480b6db9e70e26
summary: 8.X.2 Central Policy Service flowchart LR GW[API Gateway] -->|batched queries| OPA_CLUSTER[Central OPA] AUTH[IdP / Token Service] --> GW B[BUNDLE S...
digest: 0cc45123385a5717dc95bf1346fb43a0f9808a74e2593d0c6472b395be0d45c1
symbol_refs: []
semantic_role: assertion
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that 8.X.2 Central Policy Service flowchart LR GW[API Gateway] -->|batched queries| OPA_CLUSTER[Central OPA] AUTH[IdP / Token Service] --> GW B[BUNDLE S....
semantic_categories: [distribution]
vector_summary: 8.X.2 Central Policy Service flowchart LR GW[API Gateway] -->|batched queries| OPA_CLUSTER[Central OPA] AUTH[IdP / Token Service] --> GW B[BUNDLE S...
chapter: CH-05
:::
8.X.2 Central Policy Service flowchart LR GW[API Gateway] -->|batched queries| OPA_CLUSTER[Central OPA] AUTH[IdP / Token Service] --> GW B[BUNDLE Server] --> OPA_CLUSTER
:::

::: fact
id: BLK-e3c06649001ac7cb
summary: One or a few OPA instances serve many clients.
digest: ae3b98f428abcf9b850fa492a1c04afc60a79edac5de68c52175dab738f79968
symbol_refs: []
semantic_role: assertion
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that One or a few OPA instances serve many clients..
vector_summary: One or a few OPA instances serve many clients.
chapter: CH-05
:::
One or a few OPA instances serve many clients.
:::

::: fact
id: BLK-d17bf7dff7e2687d
summary: 8.X.3 Embedded OPA flowchart LR APP[Application Process] -->|in-process call| LIB[OPA SDK / WASM] B[BUNDLE Source] --> APP.
digest: 268b2ecb8b47b34d386b452dc3ea796b481d0f1119fc30c4e9f50b1e580c0029
symbol_refs: []
semantic_role: assertion
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that 8.X.3 Embedded OPA flowchart LR APP[Application Process] -->|in-process call| LIB[OPA SDK / WASM] B[BUNDLE Source] --> APP..
semantic_categories: [distribution]
vector_summary: 8.X.3 Embedded OPA flowchart LR APP[Application Process] -->|in-process call| LIB[OPA SDK / WASM] B[BUNDLE Source] --> APP.
chapter: CH-05
:::
8.X.3 Embedded OPA flowchart LR APP[Application Process] -->|in-process call| LIB[OPA SDK / WASM] B[BUNDLE Source] --> APP
:::

::: fact
id: BLK-00aae760c3f524cb
summary: OPA compiled to WASM or linked via Go library.
digest: a14c0464103a842b5fb73cedf19a190c81c6f895cec89393ae0237dad45de4d3
symbol_refs: []
semantic_role: assertion
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that OPA compiled to WASM or linked via Go library..
vector_summary: OPA compiled to WASM or linked via Go library.
chapter: CH-05
:::
OPA compiled to WASM or linked via Go library.
:::

::: fact
id: BLK-88897c889d38315b
summary: Chapter 13 – Multi-Layer Policy Architecture Visualization 13.X Multi-Layer Policy Stack flowchart TB G[Global Layer\n(org-wide baselines)] --> D[D...
digest: cd7eb6dd68f9099838f9c9efc3dd16539b1fb95baf0e6d77d4cdd93b5a7b3a07
symbol_refs: []
semantic_role: architecture
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Chapter 13 – Multi-Layer Policy Architecture Visualization 13.X Multi-Layer Policy Stack flowchart TB G[Global Layer\n(org-wide baselines)] --> D[D....
vector_summary: Chapter 13 – Multi-Layer Policy Architecture Visualization 13.X Multi-Layer Policy Stack flowchart TB G[Global Layer\n(org-wide baselines)] --> D[D...
chapter: CH-05
:::
Chapter 13 – Multi-Layer Policy Architecture Visualization 13.X Multi-Layer Policy Stack flowchart TB G[Global Layer\n(org-wide baselines)] --> D[Domain Layer\n(product / region)] D --> T[Team Layer\nservice / app] T --> N[Tenant Layer\ncustomer-specific]
:::

::: fact
id: BLK-5051a10ae5706b97
summary: Global: Non-negotiable baselines (e.g., MFA required, PII rules, legal holds).
digest: f33ef6b17dafa56197b4b1f6148afb7f5ee56d295f1861887713d09aa216f911
symbol_refs: []
semantic_role: assertion
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Global: Non-negotiable baselines (e.g., MFA required, PII rules, legal holds)..
vector_summary: Global: Non-negotiable baselines (e.g., MFA required, PII rules, legal holds).
chapter: CH-05
:::
Global: Non-negotiable baselines (e.g., MFA required, PII rules, legal holds).
:::

::: fact
id: BLK-24e160a1846f69ab
summary: # Domain: EU requires additional consent domain_deny[reason] if { input.region == "eu" not input.user.consented reason := "Domain(EU): consent requ...
digest: 43912b51b670fa9b7987025f6bfe3971d38dd0462758c56cc9c7db5094b7e208
symbol_refs: []
semantic_role: assertion
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that # Domain: EU requires additional consent domain_deny[reason] if { input.region == "eu" not input.user.consented reason := "Domain(EU): consent requ....
vector_summary: # Domain: EU requires additional consent domain_deny[reason] if { input.region == "eu" not input.user.consented reason := "Domain(EU): consent requ...
chapter: CH-05
:::
# Domain: EU requires additional consent domain_deny[reason] if { input.region == "eu" not input.user.consented reason := "Domain(EU): consent required" }
:::

::: fact
id: BLK-05d76e22769680a5
summary: # Team: service-specific checks team_deny[reason] if { input.service == "billing" not input.user.roles[_] == "billing_admin" reason := "Team(Billin...
digest: 96e02623aadcae203edd2d07ec489046b7bf8e390d5b847a4e30f9277e6f700b
symbol_refs: []
semantic_role: assertion
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that # Team: service-specific checks team_deny[reason] if { input.service == "billing" not input.user.roles[_] == "billing_admin" reason := "Team(Billin....
vector_summary: # Team: service-specific checks team_deny[reason] if { input.service == "billing" not input.user.roles[_] == "billing_admin" reason := "Team(Billin...
chapter: CH-05
:::
# Team: service-specific checks team_deny[reason] if { input.service == "billing" not input.user.roles[_] == "billing_admin" reason := "Team(Billing): admin role required" }
:::

::: fact
id: BLK-3797e2670efc01ec
summary: Deny[reason] := reason if { some r r := global_deny[r] # global always first } or { some r r := domain_deny[r] } or { some r r := team_deny[r] }.
digest: d1c98374374f9b3c5a8988793ad20b07ceb4d7e8533878493c20cfd923a7f9f8
symbol_refs: []
semantic_role: assertion
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Deny[reason] := reason if { some r r := global_deny[r] # global always first } or { some r r := domain_deny[r] } or { some r r := team_deny[r] }..
vector_summary: Deny[reason] := reason if { some r r := global_deny[r] # global always first } or { some r r := domain_deny[r] } or { some r r := team_deny[r] }.
chapter: CH-05
:::
deny[reason] := reason if { some r r := global_deny[r] # global always first } or { some r r := domain_deny[r] } or { some r r := team_deny[r] }
:::

::: fact
id: BLK-c90e38cedbdc43d1
summary: Chapter 14 – Decision Log Flow Diagram 14.X Decision Log Pipeline flowchart LR REQ[Incoming Request] --> OPA[OPA] OPA --> DEC[Decision Response] OP...
digest: 7bb235482dc1de968cefa477f791278fcb392670fe119cdfdc58d057a7247efa
symbol_refs: []
semantic_role: decision-flow
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Chapter 14 – Decision Log Flow Diagram 14.X Decision Log Pipeline flowchart LR REQ[Incoming Request] --> OPA[OPA] OPA --> DEC[Decision Response] OP....
semantic_categories: [observability]
vector_summary: Chapter 14 – Decision Log Flow Diagram 14.X Decision Log Pipeline flowchart LR REQ[Incoming Request] --> OPA[OPA] OPA --> DEC[Decision Response] OP...
chapter: CH-05
:::
Chapter 14 – Decision Log Flow Diagram 14.X Decision Log Pipeline flowchart LR REQ[Incoming Request] --> OPA[OPA] OPA --> DEC[Decision Response] OPA --> LOG[Decision Log JSON]
:::

::: fact
id: BLK-04f8b905633b2c5f
summary: Metrics (eval time, number of rules evaluated).
digest: d44445d77cdeb17d8556448273022bf3070bf5740d6af4c1bea2ead1281b9ae2
symbol_refs: []
semantic_role: assertion
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Metrics (eval time, number of rules evaluated)..
semantic_categories: [observability]
vector_summary: Metrics (eval time, number of rules evaluated).
chapter: CH-05
:::
metrics (eval time, number of rules evaluated)
:::

::: fact
id: BLK-5bbfded757016e50
summary: Bundle/ ├── .manifest ├── policies/ │ ├── authz.rego │ ├── jwt.rego │ └── resources.rego └── data/ ├── config.json └── tenants/ ├── tenant-1.json └...
digest: 2b17bae1cc3a7ab3ace332a808bee7fd9c1ec6dc5c3f18868f2065483b802581
symbol_refs: []
semantic_role: assertion
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Bundle/ ├── .manifest ├── policies/ │ ├── authz.rego │ ├── jwt.rego │ └── resources.rego └── data/ ├── config.json └── tenants/ ├── tenant-1.json └....
semantic_categories: [distribution]
vector_summary: Bundle/ ├── .manifest ├── policies/ │ ├── authz.rego │ ├── jwt.rego │ └── resources.rego └── data/ ├── config.json └── tenants/ ├── tenant-1.json └...
chapter: CH-05
:::
bundle/ ├── .manifest ├── policies/ │ ├── authz.rego │ ├── jwt.rego │ └── resources.rego └── data/ ├── config.json └── tenants/ ├── tenant-1.json └── tenant-2.json
:::

::: fact
id: BLK-faf25efc6ab6024c
summary: Revision is an opaque version string for debugging/rollback.
digest: e517d007142ef3e834ae793bb4156c1393ed3910d36191b103689e850e90d2e6
symbol_refs: []
semantic_role: assertion
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Revision is an opaque version string for debugging/rollback..
vector_summary: Revision is an opaque version string for debugging/rollback.
chapter: CH-05
:::
revision is an opaque version string for debugging/rollback.
:::

::: fact
id: BLK-cc9220c066084a66
summary: Roots tell OPA which prefixes in data this bundle owns:.
digest: 022eeb108c58c3146eb725e9ddc69b8b390e0f0fbd0a17a1677e49378d27f68a
symbol_refs: []
semantic_role: assertion
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Roots tell OPA which prefixes in data this bundle owns:..
semantic_categories: [distribution]
vector_summary: Roots tell OPA which prefixes in data this bundle owns:.
chapter: CH-05
:::
roots tell OPA which prefixes in data this bundle owns:
:::

::: fact
id: BLK-ae2f270b91be8579
summary: Authz → data.authz.* (from authz.rego).
digest: 48bb9322cf0f8703d1f3b11072131da193626a8dc3e3fe7496cf1cb72e078fa5
symbol_refs: []
semantic_role: assertion
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Authz → data.authz.* (from authz.rego)..
vector_summary: Authz → data.authz.* (from authz.rego).
chapter: CH-05
:::
authz → data.authz.* (from authz.rego)
:::

::: fact
id: BLK-561e364c0bc56c05
summary: # Layer rules return {allow: bool, reasons: [string]} global_decision := {"allow": allow, "reasons": reasons} { deny_reasons := {r | some r r := gl...
digest: 091b6c50352eccc50c86a53c564f2e98967d54216f03e9496263a7d5ef987798
symbol_refs: []
semantic_role: assertion
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that # Layer rules return {allow: bool, reasons: [string]} global_decision := {"allow": allow, "reasons": reasons} { deny_reasons := {r | some r r := gl....
vector_summary: # Layer rules return {allow: bool, reasons: [string]} global_decision := {"allow": allow, "reasons": reasons} { deny_reasons := {r | some r r := gl...
chapter: CH-05
:::
# Layer rules return {allow: bool, reasons: [string]} global_decision := {"allow": allow, "reasons": reasons} { deny_reasons := {r | some r r := global_deny[r] } reasons := sort(deny_reasons) allow := count(deny_reasons) == 0 }
:::

::: fact
id: BLK-42ff1a2ed90a4135
summary: # Check if user has required role for a field field_allowed([path, field]) if { full := concat(".", array.concat(path, [field])) required := data.g...
digest: 9dec2ca99903fb39971914d37a70082255e244b5edbc5824aaa717043545bd07
symbol_refs: []
semantic_role: assertion
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that # Check if user has required role for a field field_allowed([path, field]) if { full := concat(".", array.concat(path, [field])) required := data.g....
vector_summary: # Check if user has required role for a field field_allowed([path, field]) if { full := concat(".", array.concat(path, [field])) required := data.g...
chapter: CH-05
:::
# Check if user has required role for a field field_allowed([path, field]) if { full := concat(".", array.concat(path, [field])) required := data.gql.roles[full] some r in user_roles r in required }
:::

::: fact
id: BLK-f234f625c8beddfc
summary: Chapter 17 – Full LLM → OPA Workflow with Validation 17.X Architecture Diagram flowchart LR REQ[User / Dev Describes Policy] --> LLM[LLM / Copilot]...
digest: 8129f5fd7830d1da077eb7a83e1539406e312ca8d34bca9bdf92ba43caa1a087
symbol_refs: []
semantic_role: architecture
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Chapter 17 – Full LLM → OPA Workflow with Validation 17.X Architecture Diagram flowchart LR REQ[User / Dev Describes Policy] --> LLM[LLM / Copilot]....
semantic_categories: [distribution]
vector_summary: Chapter 17 – Full LLM → OPA Workflow with Validation 17.X Architecture Diagram flowchart LR REQ[User / Dev Describes Policy] --> LLM[LLM / Copilot]...
chapter: CH-05
:::
Chapter 17 – Full LLM → OPA Workflow with Validation 17.X Architecture Diagram flowchart LR REQ[User / Dev Describes Policy] --> LLM[LLM / Copilot] LLM --> CAND[Candidate Rego Policy] CAND --> PIPE[Validation Pipeline] PIPE -->|fail| FEEDBACK[Errors / Suggestions] PIPE -->|pass| BUNDLE[Signed Policy Bundle] BUNDLE --> OPA[OPA Deployments]
:::

::: fact
id: BLK-21b409432e66beb2
summary: Syntactic checks: opa fmt, opa check.
digest: f68aa4fcfbdb616b87ebbf9d6e91017e6fcfcc45e02e1ea114b1e820fc5660b2
symbol_refs: []
semantic_role: assertion
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Syntactic checks: opa fmt, opa check..
vector_summary: Syntactic checks: opa fmt, opa check.
chapter: CH-05
:::
Syntactic checks: opa fmt, opa check.
:::

::: fact
id: BLK-97ebf04ed742eadc
summary: Unit tests: opa test.
digest: 5fe0ccad684f88d385f0358b21a7bbc7b57df82112927ad8e750119be8aad1e0
symbol_refs: []
semantic_role: assertion
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Unit tests: opa test..
vector_summary: Unit tests: opa test.
chapter: CH-05
:::
Unit tests: opa test.
:::

::: fact
id: BLK-56ab8a64b9bbcf14
summary: Static analysis: internal style & safety rules.
digest: b9ec29522f586072c845e7016c184153a8800d3212b7b1e131846466b3cede37
symbol_refs: []
semantic_role: assertion
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Static analysis: internal style & safety rules..
vector_summary: Static analysis: internal style & safety rules.
chapter: CH-05
:::
Static analysis: internal style & safety rules.
:::

::: fact
id: BLK-980f1c312cf40eb8
summary: Staging OPA: run candidate policy against recorded traffic (shadow mode).
digest: 0a797c5102f9f6e4c0b3bf8998dd440e4e3b1aa991fe250bcb0884675e6e1853
symbol_refs: []
semantic_role: assertion
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Staging OPA: run candidate policy against recorded traffic (shadow mode)..
vector_summary: Staging OPA: run candidate policy against recorded traffic (shadow mode).
chapter: CH-05
:::
Staging OPA: run candidate policy against recorded traffic (shadow mode).
:::

::: fact
id: BLK-b808b17ee8a689c6
summary: Candidate Rego (generated by LLM):.
digest: ade293245e9ff13b109fa15c9b2e4beadedca8e5e66780b0e26995ee3918b3db
symbol_refs: []
semantic_role: assertion
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Candidate Rego (generated by LLM):..
vector_summary: Candidate Rego (generated by LLM):.
chapter: CH-05
:::
Candidate Rego (generated by LLM):
:::

::: fact
id: BLK-0b9f5a2396b4bc82
summary: Run opa fmt → ensure style.
digest: d126d8cb920871f32be8453d6588e44532793837121d6132b55e923190f4818e
symbol_refs: []
semantic_role: assertion
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Run opa fmt → ensure style..
vector_summary: Run opa fmt → ensure style.
chapter: CH-05
:::
Run opa fmt → ensure style.
:::

::: fact
id: BLK-b23aa9257026f9c0
summary: Run opa check → catch unknown refs, unsafe vars.
digest: 536e997aa5250b1325486fdb708620be8214f4c8a5cbe9954db9a662787b3ef0
symbol_refs: []
semantic_role: assertion
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Run opa check → catch unknown refs, unsafe vars..
vector_summary: Run opa check → catch unknown refs, unsafe vars.
chapter: CH-05
:::
Run opa check → catch unknown refs, unsafe vars.
:::

::: fact
id: BLK-8b09faf1219c8625
summary: Run opa test → ensure behavior matches expectations.
digest: 378bf7343c14ce75ab8bef15556022cbe1e14e37a0fd19609ba53305c6e9e9cd
symbol_refs: []
semantic_role: assertion
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Run opa test → ensure behavior matches expectations..
vector_summary: Run opa test → ensure behavior matches expectations.
chapter: CH-05
:::
Run opa test → ensure behavior matches expectations.
:::

::: fact
id: BLK-2757c170b17bf0a0
summary: Rego’s scoping rules are simple but unforgiving.
digest: 455c19138323cae810663d70cca73e6c94c4318fe1da419843bb6fd5129a8a1f
symbol_refs: []
semantic_role: assertion
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Rego’s scoping rules are simple but unforgiving..
vector_summary: Rego’s scoping rules are simple but unforgiving.
chapter: CH-05
:::
Rego’s scoping rules are simple but unforgiving. Most “mysterious” bugs in policies stem from variable scope and safety issues.
:::

::: fact
id: BLK-3062214c3efb9bc9
summary: # ❌ Unsafe: r is not always bound deny[r] if { input.violations[_] == v v.level == "HIGH" r := v.reason } else { # no binding for r here }.
digest: b7e6e6cbe55806a7b23797d743c863722cc75dfe5a982e7d1e38f3cc485b8fec
symbol_refs: []
semantic_role: assertion
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that # ❌ Unsafe: r is not always bound deny[r] if { input.violations[_] == v v.level == "HIGH" r := v.reason } else { # no binding for r here }..
vector_summary: # ❌ Unsafe: r is not always bound deny[r] if { input.violations[_] == v v.level == "HIGH" r := v.reason } else { # no binding for r here }.
chapter: CH-05
:::
# ❌ Unsafe: r is not always bound deny[r] if { input.violations[_] == v v.level == "HIGH" r := v.reason } else { # no binding for r here }
:::

::: fact
id: BLK-01dc213f722cd9db
summary: Use opa check to detect this and refactor to ensure all head variables are always bound:.
digest: cd1dd7a7617cf53b823b4516f008470d5028281c8b9d12b27b2042922039fba8
symbol_refs: []
semantic_role: assertion
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Use opa check to detect this and refactor to ensure all head variables are always bound:..
vector_summary: Use opa check to detect this and refactor to ensure all head variables are always bound:.
chapter: CH-05
:::
Use opa check to detect this and refactor to ensure all head variables are always bound:
:::

::: fact
id: BLK-7e368e0110cc4ce5
summary: # ✅ r always derived from same comprehension deny[r] if { r := v.reason some v in input.violations v.level == "HIGH" }.
digest: d228ed0aed5ef52ecc2d5839f6d3a1a8e8f553eff5abe03799328b18acb378e7
symbol_refs: []
semantic_role: assertion
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that # ✅ r always derived from same comprehension deny[r] if { r := v.reason some v in input.violations v.level == "HIGH" }..
vector_summary: # ✅ r always derived from same comprehension deny[r] if { r := v.reason some v in input.violations v.level == "HIGH" }.
chapter: CH-05
:::
# ✅ r always derived from same comprehension deny[r] if { r := v.reason some v in input.violations v.level == "HIGH" }
:::

::: fact
id: BLK-bd9cc15be97aaac3
summary: Some x introduces a new variable local to the current expression.
digest: df70b71dc0ef38505f600f3f441c1f18961e95873a6444230beabda9e9be4704
symbol_refs: []
semantic_role: assertion
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Some x introduces a new variable local to the current expression..
vector_summary: Some x introduces a new variable local to the current expression.
chapter: CH-05
:::
some x introduces a new variable local to the current expression. Using it incorrectly can over-constrain or under-constrain rules.
:::

::: fact
id: BLK-d72d3ae58221ff67
summary: # ✅ Clear indices good if { some i arr[i] == "a" some j arr[j] == "b" }.
digest: 1f72c331100e845339403d84e6f1346a3d3b68fb76b060215724f56a8d13dfa8
symbol_refs: []
semantic_role: assertion
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that # ✅ Clear indices good if { some i arr[i] == "a" some j arr[j] == "b" }..
vector_summary: # ✅ Clear indices good if { some i arr[i] == "a" some j arr[j] == "b" }.
chapter: CH-05
:::
# ✅ Clear indices good if { some i arr[i] == "a" some j arr[j] == "b" }
:::

::: fact
id: BLK-47e95b45cc5edf3c
summary: Each rule evaluation is pure and has no hidden global state.
digest: 116cc3cb4a3bb72c39c3ab525b1dd7c18802ca3519c017c22a4771b69a79f89c
symbol_refs: []
semantic_role: assertion
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Each rule evaluation is pure and has no hidden global state..
vector_summary: Each rule evaluation is pure and has no hidden global state.
chapter: CH-05
:::
Each rule evaluation is pure and has no hidden global state. Avoid writing rules as if they “accumulate” across calls:
:::

::: fact
id: BLK-36c3bcd5e1134f4f
summary: Rego is strict about types, but JSON inputs are often messy.
digest: 39fa819c9147aa39ba77c12606b797bf43f0f6435d39fb512ca9398a72774e73
symbol_refs: []
semantic_role: assertion
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Rego is strict about types, but JSON inputs are often messy..
vector_summary: Rego is strict about types, but JSON inputs are often messy.
chapter: CH-05
:::
Rego is strict about types, but JSON inputs are often messy. Nulls and missing fields are a frequent source of runtime errors.
:::

::: fact
id: BLK-b7d90967e18de369
summary: Always guard when reading from untrusted inputs:.
digest: 6ca517fe19a45c9db2c1996bcdd4441f9aaa2a3e678294fcd3a1cf27af2c4ad5
symbol_refs: []
semantic_role: assertion
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Always guard when reading from untrusted inputs:..
vector_summary: Always guard when reading from untrusted inputs:.
chapter: CH-05
:::
Always guard when reading from untrusted inputs:
:::

::: fact
id: BLK-e35261e5caf2b447
summary: # ✅ Safe pattern with guards user_email := email if { is_object(input.user) is_string(input.user.email) email := input.user.email }.
digest: 98b24cedeaa8c019fd96f852797cc9ed54406a103517da263e30c3b97eebf57a
symbol_refs: []
semantic_role: assertion
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that # ✅ Safe pattern with guards user_email := email if { is_object(input.user) is_string(input.user.email) email := input.user.email }..
vector_summary: # ✅ Safe pattern with guards user_email := email if { is_object(input.user) is_string(input.user.email) email := input.user.email }.
chapter: CH-05
:::
# ✅ Safe pattern with guards user_email := email if { is_object(input.user) is_string(input.user.email) email := input.user.email }
:::

::: fact
id: BLK-67a3905c24c8c0ec
summary: If input.user.id is a number and data.allowed_ids are strings, this will never match.
digest: 713c3eb78b07a91bcbdb3f91dfd45242465f1ad825b99f764163ee597466e69e
symbol_refs: []
semantic_role: assertion
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that If input.user.id is a number and data.allowed_ids are strings, this will never match..
vector_summary: If input.user.id is a number and data.allowed_ids are strings, this will never match.
chapter: CH-05
:::
If input.user.id is a number and data.allowed_ids are strings, this will never match. Normalize types first:
:::

::: fact
id: BLK-05f8217e07cce144
summary: Performance problems in OPA usually come from data modeling and unbounded searches, not from individual built-ins.
digest: 1e69c65f8fd9a39600f35d77dc7958f96a30c03b6f27de6fed8be02eb12e5dbc
symbol_refs: []
semantic_role: assertion
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Performance problems in OPA usually come from data modeling and unbounded searches, not from individual built-ins..
vector_summary: Performance problems in OPA usually come from data modeling and unbounded searches, not from individual built-ins.
chapter: CH-05
:::
Performance problems in OPA usually come from data modeling and unbounded searches, not from individual built-ins.
:::

::: fact
id: BLK-322b0467c2590b89
summary: # ✅ Precompute static parts into a bundle or WASM opa build -e 'data.authz.allow' policies/.
digest: d5a75e1279066484d911a32d164c84f953c7e6f113ce3b2e5e386ec3920c7805
symbol_refs: []
semantic_role: assertion
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that # ✅ Precompute static parts into a bundle or WASM opa build -e 'data.authz.allow' policies/..
semantic_categories: [distribution]
vector_summary: # ✅ Precompute static parts into a bundle or WASM opa build -e 'data.authz.allow' policies/.
chapter: CH-05
:::
# ✅ Precompute static parts into a bundle or WASM opa build -e 'data.authz.allow' policies/
:::

::: fact
id: BLK-dc6be62dc0d450eb
summary: # ✅ Narrowed search deny if { some path, value walk(data.tenants, [path, value]) value == "secret" }.
digest: 298d2176652a32cf29ccb844a98732e2e96f0c80f71cb7f15ad31cfb8340b6ce
symbol_refs: []
semantic_role: assertion
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that # ✅ Narrowed search deny if { some path, value walk(data.tenants, [path, value]) value == "secret" }..
vector_summary: # ✅ Narrowed search deny if { some path, value walk(data.tenants, [path, value]) value == "secret" }.
chapter: CH-05
:::
# ✅ Narrowed search deny if { some path, value walk(data.tenants, [path, value]) value == "secret" }
:::

::: fact
id: BLK-84a9bbab21a7036f
summary: Use opa fmt --skip-constraints (most reliable built-in).
digest: 31f649fd58e848a89efc7cbe492a72685b5efbc6716806835679f74ccb0fc00a
symbol_refs: []
semantic_role: assertion
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Use opa fmt --skip-constraints (most reliable built-in)..
vector_summary: Use opa fmt --skip-constraints (most reliable built-in).
chapter: CH-05
:::
1. Use opa fmt --skip-constraints (most reliable built-in)
:::

::: fact
id: BLK-de4bad29442a85ab
summary: Opa fmt removes unused aliases but NOT unused imports.
digest: f5ec60fb3de94cfd7a94c494ec93c17b4ac5d5fb74fcd532ba6bdc652b373f50
symbol_refs: []
semantic_role: assertion
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Opa fmt removes unused aliases but NOT unused imports..
vector_summary: Opa fmt removes unused aliases but NOT unused imports.
chapter: CH-05
:::
opa fmt removes unused aliases but NOT unused imports.
:::

::: fact
id: BLK-9124fbb631e1cbb3
summary: If u is never referenced, opa fmt will not remove it.
digest: 0179787b0c2a6931b4e23b8a51cc307ffceb5251e24e7ecb749e404140be8ea8
symbol_refs: []
semantic_role: reference
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that If u is never referenced, opa fmt will not remove it..
vector_summary: If u is never referenced, opa fmt will not remove it.
chapter: CH-05
:::
If u is never referenced, opa fmt will not remove it.
:::

::: fact
id: BLK-d0f4b36469b3fdf9
summary: Some versions of opa fmt will rewrite it to:.
digest: 13987489a3420ae7245166ce0173d438afe28ce2e87219bbf1b6a211e47b663d
symbol_refs: []
semantic_role: assertion
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Some versions of opa fmt will rewrite it to:..
vector_summary: Some versions of opa fmt will rewrite it to:.
chapter: CH-05
:::
Some versions of opa fmt will rewrite it to:
:::

::: fact
id: BLK-a51da1defba3faaf
summary: …and will not remove it.
digest: 090a47fa457984d936fe537757797c03251e8252314fe6602e1cbc7bee9fc9ed
symbol_refs: []
semantic_role: assertion
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that …and will not remove it..
vector_summary: …and will not remove it.
chapter: CH-05
:::
…and will not remove it. Bottom line: opa fmt alone cannot solve unused imports reliably, but helps a bit with alias trimming.
:::

::: fact
id: BLK-5a847029cb16e01b
summary: Use opa check --strict.
digest: 57e036759b828eb851be114e82c6ed8bcc2b60f52446a7bddcdef8ab09e9915e
symbol_refs: []
semantic_role: assertion
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Use opa check --strict..
vector_summary: Use opa check --strict.
chapter: CH-05
:::
✅ 2. Use opa check --strict
:::

::: fact
id: BLK-05e28689781336be
summary: Opa check --strict .
digest: 04308296f68ee10c8f2004f283f53757d30404570bf54140f0a5e10fde6e8e99
symbol_refs: []
semantic_role: assertion
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Opa check --strict ..
vector_summary: Opa check --strict .
chapter: CH-05
:::
opa check --strict .
:::

::: fact
id: BLK-93ffa0f5a38427e7
summary: Use Rego Linter Plugins (best solution).
digest: 89330481986a2b78365f0b04579126685ed632968b809adb71d0c27e2a833154
symbol_refs: []
semantic_role: assertion
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Use Rego Linter Plugins (best solution)..
vector_summary: Use Rego Linter Plugins (best solution).
chapter: CH-05
:::
✅ 3. Use Rego Linter Plugins (best solution)
:::

::: fact
id: BLK-a18f52daf68b5951
summary: This is the closest to ESLint/flake8 for Rego.
digest: be2edaae7e4c251ee49224f23f06af9693452901dadecce97b6ad331856a0f74
symbol_refs: []
semantic_role: assertion
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that This is the closest to ESLint/flake8 for Rego..
vector_summary: This is the closest to ESLint/flake8 for Rego.
chapter: CH-05
:::
This is the closest to ESLint/flake8 for Rego.
:::

::: fact
id: BLK-d1deb4055bd6abbf
summary: Use Styra DAS Rego Analyzer (if enterprise budget exists).
digest: 5e77bde43e344f03b1d5075d87828a8f920864cf62dcc4d2e2f4f5441e9f8c08
symbol_refs: []
semantic_role: assertion
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Use Styra DAS Rego Analyzer (if enterprise budget exists)..
vector_summary: Use Styra DAS Rego Analyzer (if enterprise budget exists).
chapter: CH-05
:::
✅ 4. Use Styra DAS Rego Analyzer (if enterprise budget exists)
:::

::: fact
id: BLK-ea1b59903a6ee23e
summary: Styra’s Rego Style/Structure Analyzer (in DAS) flags:.
digest: 8ca2ecc5f36ff10f8e970e65a17e162900110c9d12e6f184913444ed7a35cd8b
symbol_refs: []
semantic_role: assertion
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Styra’s Rego Style/Structure Analyzer (in DAS) flags:..
vector_summary: Styra’s Rego Style/Structure Analyzer (in DAS) flags:.
chapter: CH-05
:::
Styra’s Rego Style/Structure Analyzer (in DAS) flags:
:::

::: fact
id: BLK-ff117af14d974338
summary: Policy design smells.
digest: 90611d322efdca9eabf4dbe1c4d9afecc904cdff792bea813a5b6ef2f4f0d478
symbol_refs: []
semantic_role: assertion
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Policy design smells..
vector_summary: Policy design smells.
chapter: CH-05
:::
policy design smells
:::

::: fact
id: BLK-288854f032dcf91b
summary: Use editor extensions (Cursor, VSCode, JetBrains).
digest: 5aa9888cf5356834a0430deef7cb0649281c8995fb3a684693f074b9640d7e7f
symbol_refs: []
semantic_role: assertion
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Use editor extensions (Cursor, VSCode, JetBrains)..
vector_summary: Use editor extensions (Cursor, VSCode, JetBrains).
chapter: CH-05
:::
✅ 5. Use editor extensions (Cursor, VSCode, JetBrains)
:::

::: fact
id: BLK-1a1e1d4534d9231d
summary: Add a Rego post-save hook // .cursor/rules.json { "onSave": ["opa fmt -w", "opa check --strict"] }.
digest: 74fb7b21fb5182e41b0dc6445615ad5b33af27fc57c74f56a78e5b655117ed19
symbol_refs: []
semantic_role: assertion
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Add a Rego post-save hook // .cursor/rules.json { "onSave": ["opa fmt -w", "opa check --strict"] }..
vector_summary: Add a Rego post-save hook // .cursor/rules.json { "onSave": ["opa fmt -w", "opa check --strict"] }.
chapter: CH-05
:::
Add a Rego post-save hook // .cursor/rules.json { "onSave": ["opa fmt -w", "opa check --strict"] }
:::

::: fact
id: BLK-0700523bfa0d00a5
summary: Then configure a custom linter rule using a regex:.
digest: 32d557e30c8007847f87d8ba430b17d0a4c0b82b1e6698b3f3f4f014073d3012
symbol_refs: []
semantic_role: assertion
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Then configure a custom linter rule using a regex:..
vector_summary: Then configure a custom linter rule using a regex:.
chapter: CH-05
:::
Then configure a custom linter rule using a regex:
:::

::: fact
id: BLK-05bf15ca8721ad44
summary: Organizational best practice: Avoid wildcard imports.
digest: 9af95062611b758eef7eec605683ece00d3c96130dec684daaa11deedb46986f
symbol_refs: []
semantic_role: assertion
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Organizational best practice: Avoid wildcard imports..
vector_summary: Organizational best practice: Avoid wildcard imports.
chapter: CH-05
:::
✅ 6. Organizational best practice: Avoid wildcard imports
:::

::: fact
id: BLK-1d0b9f66d47eaeaf
summary: Always prefer small, explicit imports:.
digest: 0a6a8df429f6595dbc297c843ac9082f97fe45b960117fdd9b2cc4ef7e56f771
symbol_refs: []
semantic_role: assertion
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Always prefer small, explicit imports:..
vector_summary: Always prefer small, explicit imports:.
chapter: CH-05
:::
Always prefer small, explicit imports:
:::

::: fact
id: BLK-ad7f2ed6a6987d63
summary: Recommended CI rule: Reject files containing unused imports.
digest: 4aee7f3a647c900ce5091b98311b4552c7614f63fd9412101a1521f7c468316e
symbol_refs: []
semantic_role: assertion
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Recommended CI rule: Reject files containing unused imports..
vector_summary: Recommended CI rule: Reject files containing unused imports.
chapter: CH-05
:::
✅ 7. Recommended CI rule: Reject files containing unused imports
:::

::: fact
id: BLK-b24e880e43548028
summary: --format json | \ jq -r '.imports[] | select(.used == false) | .file + ":" + .path').
digest: 96c0ebc57e66bcfa7e8ecf806ee2947bb6ff4bdb4c662d95171968bd993881ba
symbol_refs: []
semantic_role: assertion
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that --format json | \ jq -r '.imports[] | select(.used == false) | .file + ":" + .path')..
vector_summary: --format json | \ jq -r '.imports[] | select(.used == false) | .file + ":" + .path').
chapter: CH-05
:::
unused=$(opa inspect . --format json | \ jq -r '.imports[] | select(.used == false) | .file + ":" + .path')
:::

::: fact
id: BLK-3364104f50f32b25
summary: Opa inspect (which parses import graph).
digest: e6a61da3af8fe1ab03a0559efbbe72e2056079af413ce3ad0938f210b0859734
symbol_refs: []
semantic_role: assertion
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Opa inspect (which parses import graph)..
vector_summary: Opa inspect (which parses import graph).
chapter: CH-05
:::
opa inspect (which parses import graph)
:::

::: fact
id: BLK-916a2b733c75da32
summary: 🧩 Summary — Best Way to Handle Rego Unused Imports Method Effectiveness Recommended opa fmt ❌ Does not remove unused imports Useful, but not enough...
digest: 7887893ac6db46b8438aee40d2bebc8fbda97814bc5c6e0da59be4941bc51a01
symbol_refs: []
semantic_role: assertion
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that 🧩 Summary — Best Way to Handle Rego Unused Imports Method Effectiveness Recommended opa fmt ❌ Does not remove unused imports Useful, but not enough....
vector_summary: 🧩 Summary — Best Way to Handle Rego Unused Imports Method Effectiveness Recommended opa fmt ❌ Does not remove unused imports Useful, but not enough...
chapter: CH-05
:::
🧩 Summary — Best Way to Handle Rego Unused Imports Method Effectiveness Recommended opa fmt ❌ Does not remove unused imports Useful, but not enough opa check --strict 🔶 Detects unused variables, not imports Use always rgl (Rego Lint) ✅ Detects unused imports Best open-source option Styra DAS 🔥 Enterprise-grade policy analyzer Best paid option CI + opa inspect + jq 🔥 Fully reliable in CI Recommended Cursor/VSCode rules 🔶 Helps devs during coding Recommended
:::

::: fact
id: BLK-055762078b24cd0d
summary: Cursor lint → opa fmt → opa check → CI lint w/ opa inspect → Styra Analyzer (optional).
digest: 69950ba95eeaab46d3ab9779416144c7b096b8f72cc3c1bb1c4216ba2f7f6a50
symbol_refs: []
semantic_role: assertion
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Cursor lint → opa fmt → opa check → CI lint w/ opa inspect → Styra Analyzer (optional)..
vector_summary: Cursor lint → opa fmt → opa check → CI lint w/ opa inspect → Styra Analyzer (optional).
chapter: CH-05
:::
Cursor lint → opa fmt → opa check → CI lint w/ opa inspect → Styra Analyzer (optional)
:::

::: fact
id: BLK-1e753a25a214b3ee
summary: ✅ What I Would Do (Best Practice) I would choose Option 2: Use the import explicitly, not rely on OPA’s global data-tree search.
digest: 0fc20bfa7a758e8856f5cd97983e97265a87a83c73468692cfb4c3b2a3596b63
symbol_refs: []
semantic_role: assertion
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that ✅ What I Would Do (Best Practice) I would choose Option 2: Use the import explicitly, not rely on OPA’s global data-tree search..
vector_summary: ✅ What I Would Do (Best Practice) I would choose Option 2: Use the import explicitly, not rely on OPA’s global data-tree search.
chapter: CH-05
:::
✅ What I Would Do (Best Practice) I would choose Option 2: Use the import explicitly, not rely on OPA’s global data-tree search.
:::

::: fact
id: BLK-91376980b3497347
summary: Because tests that depend on bare rule names (warn, deny, allow, audit, etc.) become:.
digest: 761922e6309e38bc9d930161279653a949bdd6437b938e511c5dc9745f426b95
symbol_refs: []
semantic_role: assertion
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Because tests that depend on bare rule names (warn, deny, allow, audit, etc.) become:..
vector_summary: Because tests that depend on bare rule names (warn, deny, allow, audit, etc.) become:.
chapter: CH-05
:::
Because tests that depend on bare rule names (warn, deny, allow, audit, etc.) become:
:::

::: fact
id: BLK-de0aa65f66c9c2e5
summary: Conflicting when multiple packages define the same rule.
digest: c44ea71caf0c4c45698a4b83eac0cc892f365dae5a4130fefe9b0719e90d6ed6
symbol_refs: []
semantic_role: assertion
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Conflicting when multiple packages define the same rule..
vector_summary: Conflicting when multiple packages define the same rule.
chapter: CH-05
:::
conflicting when multiple packages define the same rule
:::

::: fact
id: BLK-4bbc8cdf4775092d
summary: Answer: The warn reference comes from the data tree, not from the import.
digest: 167cd5220fb43ebb61317fcf5de414d8c858ee0c99501390fab1bd774fd28fba
symbol_refs: []
semantic_role: reference
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Answer: The warn reference comes from the data tree, not from the import..
vector_summary: Answer: The warn reference comes from the data tree, not from the import.
chapter: CH-05
:::
Answer: The warn reference comes from the data tree, not from the import. During opa test, OPA loads all policies under services/opa/policies/ into the data namespace. When the test references warn, OPA resolves it by searching all packages for a rule named warn, which finds data.compliance.tech_debt.warn. Because the test never uses tech_debt.warn, the import data.compliance.tech_debt is unused and can be removed.
:::

::: fact
id: BLK-904181a17b9dcc04
summary: 🔍 Full Explanation (What’s Happening Under the Hood) 1.
digest: 44b88cfe853df2713821fd7758191423859b4969911c1dede35c487784df3834
symbol_refs: []
semantic_role: assertion
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that 🔍 Full Explanation (What’s Happening Under the Hood) 1..
vector_summary: 🔍 Full Explanation (What’s Happening Under the Hood) 1.
chapter: CH-05
:::
🔍 Full Explanation (What’s Happening Under the Hood) 1. How OPA loads data during tests
:::

::: fact
id: BLK-8e593dfe4228799c
summary: Opa test services/opa/policies/ services/opa/tests/.
digest: d1e98a0829c43aba40f49a566204cff8570b8e3ce7da9a0744fe1d93c5475438
symbol_refs: []
semantic_role: assertion
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Opa test services/opa/policies/ services/opa/tests/..
vector_summary: Opa test services/opa/policies/ services/opa/tests/.
chapter: CH-05
:::
opa test services/opa/policies/ services/opa/tests/
:::

::: fact
id: BLK-cf1cf42e9d5ccf61
summary: Every .rego file from policies/ → into the data tree.
digest: 5572207edd7bb2d422ca4b95cca78b3c6bc2f66d3979dc320d03585102fdea5e
symbol_refs: []
semantic_role: assertion
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Every .rego file from policies/ → into the data tree..
vector_summary: Every .rego file from policies/ → into the data tree.
chapter: CH-05
:::
every .rego file from policies/ → into the data tree
:::

::: fact
id: BLK-a3d9d649abe9ea27
summary: This means all rule names become visible under data.*.
digest: 9b990d8b74985b01c2cd6fa05c2f8e6320205bc1d89a5c41a4c64c50eda35486
symbol_refs: []
semantic_role: assertion
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that This means all rule names become visible under data.*..
vector_summary: This means all rule names become visible under data.*.
chapter: CH-05
:::
This means all rule names become visible under data.*.
:::

::: fact
id: BLK-b34b8dd3cc79096e
summary: OPA resolves warn like this:.
digest: 2eec3086a5c80964b2d7163ae9f68b3c40c1c619a2d9b88e3e1892c673068dc2
symbol_refs: []
semantic_role: assertion
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that OPA resolves warn like this:..
vector_summary: OPA resolves warn like this:.
chapter: CH-05
:::
OPA resolves warn like this:
:::

::: fact
id: BLK-66c781d55a92faaf
summary: Search the global data tree for any rule named warn.
digest: 252c4ebe6a76bf5d1c9a6770d87681e7fd044780ed9bb1c5a9dad0f19fa978c5
symbol_refs: []
semantic_role: assertion
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Search the global data tree for any rule named warn..
vector_summary: Search the global data tree for any rule named warn.
chapter: CH-05
:::
Search the global data tree for any rule named warn. Finds: data.compliance.tech_debt.warn
:::

::: fact
id: BLK-95ca2e72cd741b4e
summary: The import is unused because OPA never needs the alias tech_debt to find the rule.
digest: 94826253a4f81ec1be4c716e1ce9793b2dcbb6802c47175fa857fb2dbc1afc88
symbol_refs: []
semantic_role: assertion
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that The import is unused because OPA never needs the alias tech_debt to find the rule..
vector_summary: The import is unused because OPA never needs the alias tech_debt to find the rule.
chapter: CH-05
:::
The import is unused because OPA never needs the alias tech_debt to find the rule.
:::

::: fact
id: BLK-0f7eb6e9110cfd7d
summary: This is how critical bugs enter policy codebases.
digest: f1d99094dd60b532bff5bbfbce76a95f64e54eb7414be84e93b0b7a24a71c924
symbol_refs: []
semantic_role: assertion
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that This is how critical bugs enter policy codebases..
vector_summary: This is how critical bugs enter policy codebases.
chapter: CH-05
:::
This is how critical bugs enter policy codebases.
:::

::: fact
id: BLK-dc195421896fae6e
summary: 🧩 Therefore: Best Practice for Enterprise Codebases 📌 Always reference rules with namespaced imports.
digest: 3a39793f318e25b9cd5e3d77b792302e41cdb7e08008f4a47219b0dd4ec665ec
symbol_refs: []
semantic_role: reference
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that 🧩 Therefore: Best Practice for Enterprise Codebases 📌 Always reference rules with namespaced imports..
vector_summary: 🧩 Therefore: Best Practice for Enterprise Codebases 📌 Always reference rules with namespaced imports.
chapter: CH-05
:::
🧩 Therefore: Best Practice for Enterprise Codebases 📌 Always reference rules with namespaced imports
:::

::: fact
id: BLK-c769e5e37ddda8d1
summary: Never rely on bare rule names:.
digest: 7ecbac30f7ba5d52f57c5ca58b89908f0085dbe01c4cc56b204e13b721277a37
symbol_refs: []
semantic_role: assertion
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Never rely on bare rule names:..
vector_summary: Never rely on bare rule names:.
chapter: CH-05
:::
Never rely on bare rule names:
:::

::: fact
id: BLK-f2d6de3be5108863
summary: The import data.compliance.tech_debt on line 3 of tech_debt_r14_test.rego is unused.
digest: 72d7836f5a6d55bcd3a4367f4b1e97fc5be09c2a3b6f1d859aafdaf1e0f5d2cd
symbol_refs: []
semantic_role: assertion
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that The import data.compliance.tech_debt on line 3 of tech_debt_r14_test.rego is unused..
vector_summary: The import data.compliance.tech_debt on line 3 of tech_debt_r14_test.rego is unused.
chapter: CH-05
:::
The import data.compliance.tech_debt on line 3 of tech_debt_r14_test.rego is unused.
:::

::: fact
id: BLK-2602fdd8c51b5938
summary: OPA loads all policy packages in /policies/**.
digest: e2b3be11ebc08d09a5e2e4b3714cb1774fc48e843df5ad386ba969e38b45839d
symbol_refs: []
semantic_role: assertion
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that OPA loads all policy packages in /policies/**..
vector_summary: OPA loads all policy packages in /policies/**.
chapter: CH-05
:::
OPA loads all policy packages in /policies/**
:::

::: fact
id: BLK-440f2e7d6df53450
summary: So the rule warn is available at:.
digest: ed37336eb6114f0b81292b2dc1d66b8e8e05648a67553b1536aa627a958b4440
symbol_refs: []
semantic_role: assertion
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that So the rule warn is available at:..
vector_summary: So the rule warn is available at:.
chapter: CH-05
:::
So the rule warn is available at:
:::

::: fact
id: BLK-146721aedc728fd8
summary: OPA resolves bare rule names by doing a global search in data.
digest: 81aa7cb8b46461cb7342d113af1f48737db5d3df92843aae91e26d1300e1a23b
symbol_refs: []
semantic_role: assertion
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that OPA resolves bare rule names by doing a global search in data..
vector_summary: OPA resolves bare rule names by doing a global search in data.
chapter: CH-05
:::
OPA resolves bare rule names by doing a global search in data.
:::

::: fact
id: BLK-1896739847a942b1
summary: Bare rule names (warn) are ambiguous.
digest: 9ee14a45400bcb86a7f98bbe5219385f11e21663cb8e75f0a138f684953d060c
symbol_refs: []
semantic_role: assertion
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Bare rule names (warn) are ambiguous..
vector_summary: Bare rule names (warn) are ambiguous.
chapter: CH-05
:::
Why? 1. Bare rule names (warn) are ambiguous
:::

::: fact
id: BLK-4cf1d9d3379ed5ab
summary: Becomes ambiguous and OPA may:.
digest: c55f1a0c8bb93d3e85b429ee648f7056c12d4e0cd4c1228264a6ee891be7463d
symbol_refs: []
semantic_role: assertion
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Becomes ambiguous and OPA may:..
vector_summary: Becomes ambiguous and OPA may:.
chapter: CH-05
:::
becomes ambiguous and OPA may:
:::

::: fact
id: BLK-ee4b87e1821ec277
summary: OPA test behavior depends on all loaded policies.
digest: 1fe9279495b05b09a40807fd75fb26761eafa8a9ef907795dae4876f3c692d9b
symbol_refs: []
semantic_role: assertion
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that OPA test behavior depends on all loaded policies..
vector_summary: OPA test behavior depends on all loaded policies.
chapter: CH-05
:::
OPA test behavior depends on all loaded policies. If someone changes folder structure or adds a new rule, this test may start failing.
:::

::: fact
id: BLK-d0319c48162006d3
summary: Implicit resolution is one of the most common sources of bugs in OPA deployments.
digest: 20d4c41da5c0bdc24e25a99c41ba8a4e92c2d8dcba5dcb2b8ca69c41d491b39f
symbol_refs: []
semantic_role: architecture
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Implicit resolution is one of the most common sources of bugs in OPA deployments..
vector_summary: Implicit resolution is one of the most common sources of bugs in OPA deployments.
chapter: CH-05
:::
Implicit resolution is one of the most common sources of bugs in OPA deployments.
:::

::: fact
id: BLK-40bec3306bf43c74
summary: This matches the pattern in your other test file (tech_debt_r15_test.rego) and is the correct...
digest: f860ce545b7cf1ea5693481c859610d5851eaceb7b416d1d3f60385acb2efa40
symbol_refs: []
semantic_role: assertion
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that This matches the pattern in your other test file (tech_debt_r15_test.rego) and is the correct....
vector_summary: This matches the pattern in your other test file (tech_debt_r15_test.rego) and is the correct...
chapter: CH-05
:::
This matches the pattern in your other test file (tech_debt_r15_test.rego) and is the correct pattern for all enterprise-grade policy suites.
:::

::: fact
id: BLK-ddd5bab848658cd1
summary: 🧩 Best Practice for Enterprise Rego Test Suites Do NOT rely on bare rule names like: warn deny audit allow validate.
digest: 78c779040c4618c026ac7b21bf1c3495bb91b8331f472317ba92a01225e62139
symbol_refs: []
semantic_role: assertion
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that 🧩 Best Practice for Enterprise Rego Test Suites Do NOT rely on bare rule names like: warn deny audit allow validate..
vector_summary: 🧩 Best Practice for Enterprise Rego Test Suites Do NOT rely on bare rule names like: warn deny audit allow validate.
chapter: CH-05
:::
🧩 Best Practice for Enterprise Rego Test Suites Do NOT rely on bare rule names like: warn deny audit allow validate
:::

::: fact
id: BLK-4a3213cba6c14203
summary: ❗ Never let OPA resolve a rule through the global data tree — always reference it explicitly.
digest: 000fb51d074c876d0a127d4eec4eac5cb5fae6104bc6147af8cd9417023d79d7
symbol_refs: []
semantic_role: reference
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that ❗ Never let OPA resolve a rule through the global data tree — always reference it explicitly..
vector_summary: ❗ Never let OPA resolve a rule through the global data tree — always reference it explicitly.
chapter: CH-05
:::
❗ Never let OPA resolve a rule through the global data tree — always reference it explicitly.
:::

::: fact
id: BLK-5fe7ad67431a1a6b
summary: In test files, always use explicit package-qualified rule references:.
digest: 45e44bf835702e8b9dbec5420bede5913c7f3c8618118024f75200d5468dbeb8
symbol_refs: []
semantic_role: reference
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that In test files, always use explicit package-qualified rule references:..
vector_summary: In test files, always use explicit package-qualified rule references:.
chapter: CH-05
:::
In test files, always use explicit package-qualified rule references:
:::

::: fact
id: BLK-5a5fb3b6a6feb291
summary: Ambiguity Prevention: Multiple packages may define rules with common names (warn, deny, allow).
digest: 31f0aecfc94244a23f9da0fcfa226aecaff1b6b13b6940b07f23f27330244898
symbol_refs: []
semantic_role: reference
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Ambiguity Prevention: Multiple packages may define rules with common names (warn, deny, allow)..
vector_summary: Ambiguity Prevention: Multiple packages may define rules with common names (warn, deny, allow).
chapter: CH-05
:::
**Rationale:** 1. **Ambiguity Prevention**: Multiple packages may define rules with common names (`warn`, `deny`, `allow`). Explicit references eliminate ambiguity. 2. **Maintainability**: Tests remain stable when new policies are added that might introduce naming conflicts. 3. **Clarity**: Explicit references make test intent clear and reduce cognitive load during code review. 4. **Refactoring Safety**: Policy package reorganization doesn't break tests that use explicit references.
:::

::: fact
id: BLK-7eb95260235a09c0
summary: Import rego.v1 import data.compliance.tech_debt # ← keep this.
digest: 2ad74df3c8f0472e00655f36c4d6f404080fd0678dafcae51fefb20768f7670f
symbol_refs: []
semantic_role: assertion
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Import rego.v1 import data.compliance.tech_debt # ← keep this..
vector_summary: Import rego.v1 import data.compliance.tech_debt # ← keep this.
chapter: CH-05
:::
import rego.v1 import data.compliance.tech_debt # ← keep this
:::

::: fact
id: BLK-94b0c6d4242ec932
summary: How your test diff strings are represented inside Rego test files.
digest: a33d7eff217e1f8411b162bc2084a6aff4742643cdcef7e7c12b49c714f3048e
symbol_refs: []
semantic_role: assertion
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that How your test diff strings are represented inside Rego test files..
vector_summary: How your test diff strings are represented inside Rego test files.
chapter: CH-05
:::
how your test diff strings are represented inside Rego test files.
:::

::: fact
id: BLK-2692a565a55bc811
summary: ✔️ When using opa eval with JSON, your inputs contain: "+ // TODO:\n+ function getUsers() {".
digest: 9dfeec344651b358596a2dc33379b3dde1673f1ff8a91fa7af307c924d8a73f2
symbol_refs: []
semantic_role: assertion
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that ✔️ When using opa eval with JSON, your inputs contain: "+ // TODO:\n+ function getUsers() {"..
vector_summary: ✔️ When using opa eval with JSON, your inputs contain: "+ // TODO:\n+ function getUsers() {".
chapter: CH-05
:::
✔️ When using opa eval with JSON, your inputs contain: "+ // TODO:\n+ function getUsers() {"
:::

::: fact
id: BLK-4b75100e9c1723da
summary: …and OPA treats \n as an actual newline because JSON escapes it as a newline character.
digest: 49363a677d21f592973744b2d22f6f9729678352b52fc04c84dd5f3e5bdd9bcc
symbol_refs: []
semantic_role: assertion
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that …and OPA treats \n as an actual newline because JSON escapes it as a newline character..
vector_summary: …and OPA treats \n as an actual newline because JSON escapes it as a newline character.
chapter: CH-05
:::
…and OPA treats \n as an actual newline because JSON escapes it as a newline character.
:::

::: fact
id: BLK-5034a2914309672a
summary: Never see the newline, so they fail.
digest: 4d97bdef2128d6eec6e89ae268bec68f98109f6d3701707d6029560f78fba250
symbol_refs: []
semantic_role: assertion
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Never see the newline, so they fail..
vector_summary: Never see the newline, so they fail.
chapter: CH-05
:::
never see the newline, so they fail.
:::

::: fact
id: BLK-d61d9d1a25742a7b
summary: __local3132__, __local3138__ variables suggest file.diff is not being accessed correctly in the test context.
digest: 72c829827d13e2848586a7c72b8c9f2023eedbe6faf639d6e5289b32cd6fbb4d
symbol_refs: []
semantic_role: assertion
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that __local3132__, __local3138__ variables suggest file.diff is not being accessed correctly in the test context..
vector_summary: __local3132__, __local3138__ variables suggest file.diff is not being accessed correctly in the test context.
chapter: CH-05
:::
__local3132__, __local3138__ variables suggest file.diff is not being accessed correctly in the test context.
:::

::: fact
id: BLK-bf4723cba99361ab
summary: They are being accessed — the content is just different from what your rules assume.
digest: ffc1c9561773b65a44ae0805eda733fbfcf70599dc73fc9ae0a1fefa91f54ad3
symbol_refs: []
semantic_role: assertion
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that They are being accessed — the content is just different from what your rules assume..
vector_summary: They are being accessed — the content is just different from what your rules assume.
chapter: CH-05
:::
They are being accessed — the content is just different from what your rules assume.
:::

::: fact
id: BLK-b2462fef40f9e1a3
summary: But your policy expects diff lines beginning with + or matching exact patterns that assume multi-line context.
digest: c34980609a223a014ffea10644dfb6f8c75a72f9d562d334b5bc9d514d04df97
symbol_refs: []
semantic_role: assertion
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that But your policy expects diff lines beginning with + or matching exact patterns that assume multi-line context..
vector_summary: But your policy expects diff lines beginning with + or matching exact patterns that assume multi-line context.
chapter: CH-05
:::
But your policy expects diff lines beginning with + or matching exact patterns that assume multi-line context.
:::

::: fact
id: BLK-7224d1b50de33c99
summary: Same issue: Your rule expects:.
digest: 32f186ea2b355c5073c645e1e429987c8b0d9c1a9d22fa272f9ec68672de7694
symbol_refs: []
semantic_role: assertion
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Same issue: Your rule expects:..
vector_summary: Same issue: Your rule expects:.
chapter: CH-05
:::
Same issue: Your rule expects:
:::

::: fact
id: BLK-9ab409739c58aced
summary: OPA evaluates the Rego test literal as:.
digest: d3bbfce6b558775d16fa8e20b3f4696cf1b436b6f1dbf155a847ec06b0b5c1cd
symbol_refs: []
semantic_role: assertion
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that OPA evaluates the Rego test literal as:..
vector_summary: OPA evaluates the Rego test literal as:.
chapter: CH-05
:::
OPA evaluates the Rego test literal as:
:::

::: fact
id: BLK-475ae3ca4b662fcb
summary: The pattern never matches because whitespace escaping does NOT behave like in JSON.
digest: 7512dee00aa2450d32cd4550d5ffa1f76d33ba0a41f3b9cc6fc5451bd4d4e550
symbol_refs: []
semantic_role: assertion
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that The pattern never matches because whitespace escaping does NOT behave like in JSON..
vector_summary: The pattern never matches because whitespace escaping does NOT behave like in JSON.
chapter: CH-05
:::
The pattern never matches because whitespace escaping does NOT behave like in JSON.
:::

::: fact
id: BLK-ec33c76e3eda42a5
summary: 🧠 Why direct opa eval --input JSON works.
digest: c8567072c83b2ce7faa90eda34443eb6460c1c56190c396432b762e287c2902e
symbol_refs: []
semantic_role: assertion
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that 🧠 Why direct opa eval --input JSON works..
vector_summary: 🧠 Why direct opa eval --input JSON works.
chapter: CH-05
:::
🧠 Why direct opa eval --input JSON works
:::

::: fact
id: BLK-fe580d36f95ecec0
summary: Because JSON → OPA decoding translates \n into real newlines.
digest: 9a2e06315ec416bed350674611e5285c2b918bc95ae866875894c31075813ebf
symbol_refs: []
semantic_role: assertion
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Because JSON → OPA decoding translates \n into real newlines..
vector_summary: Because JSON → OPA decoding translates \n into real newlines.
chapter: CH-05
:::
Because JSON → OPA decoding translates \n into real newlines.
:::

::: fact
id: BLK-914d3ab30c1cbcd0
summary: Rego test files do NOT.
digest: 12b1484fb1ba6f242e5b124abe4c1874fcd367ea688f6345c826cc54d3efdf55
symbol_refs: []
semantic_role: assertion
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Rego test files do NOT..
vector_summary: Rego test files do NOT.
chapter: CH-05
:::
Rego test files do NOT.
:::

::: fact
id: BLK-91b98d897aa10bbe
summary: 🧩 Fix Options (Ranked Best → Acceptable) ✅ Best Fix: Convert test diff strings to multi-line Rego strings.
digest: 5a5a5bebbd0edeedaaf428ded81ffaef5b593bba7c8b9db19a8275e14c768538
symbol_refs: []
semantic_role: assertion
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that 🧩 Fix Options (Ranked Best → Acceptable) ✅ Best Fix: Convert test diff strings to multi-line Rego strings..
vector_summary: 🧩 Fix Options (Ranked Best → Acceptable) ✅ Best Fix: Convert test diff strings to multi-line Rego strings.
chapter: CH-05
:::
🧩 Fix Options (Ranked Best → Acceptable) ✅ Best Fix: Convert test diff strings to multi-line Rego strings
:::

::: fact
id: BLK-f190297a6c64fecc
summary: Rego supports multi-line raw strings:.
digest: d337c6b01d20cb05cc3e4d5d2bebe644e5e8bdcd5d883029bb99035a044e2141
symbol_refs: []
semantic_role: assertion
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that Rego supports multi-line raw strings:..
vector_summary: Rego supports multi-line raw strings:.
chapter: CH-05
:::
Rego supports multi-line raw strings:
:::

::: fact
id: BLK-a9c05c7f62d3cb54
summary: This will perfectly match the policy expectations.
digest: b32ed641dc19d34e572b3877673d28616a49e09aa168558953ba52e33cb4762f
symbol_refs: []
semantic_role: assertion
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that This will perfectly match the policy expectations..
vector_summary: This will perfectly match the policy expectations.
chapter: CH-05
:::
This will perfectly match the policy expectations.
:::

::: fact
id: BLK-99ded45841e99ee9
summary: ✅ Second Best Fix: Convert \n to actual newline inside the test file.
digest: eefa733fa817716bb142498d6bbb1ca4fc4f953a5f6c6a4219323451383aa447
symbol_refs: []
semantic_role: assertion
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that ✅ Second Best Fix: Convert \n to actual newline inside the test file..
vector_summary: ✅ Second Best Fix: Convert \n to actual newline inside the test file.
chapter: CH-05
:::
✅ Second Best Fix: Convert \n to actual newline inside the test file
:::

::: fact
id: BLK-bf3d83b7e8b7048b
summary: ⚠️ Temporary Fix (Not recommended): Decode the string inside policy.
digest: 587a7495e2be928c04a13bac337e98e5490414bb1abc908455a8ddf86c5bd037
symbol_refs: []
semantic_role: warning
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that ⚠️ Temporary Fix (Not recommended): Decode the string inside policy..
vector_summary: ⚠️ Temporary Fix (Not recommended): Decode the string inside policy.
chapter: CH-05
:::
⚠️ Temporary Fix (Not recommended): Decode the string inside policy
:::

::: fact
id: BLK-44a8a9caa5e043ee
summary: But this will add noise to all rules.
digest: 3f06f0025f1b0fa5632a3069f1f0bb4fcc642a22fcad5ed1c22bcedd0ab7d6a0
symbol_refs: []
semantic_role: assertion
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that But this will add noise to all rules..
vector_summary: But this will add noise to all rules.
chapter: CH-05
:::
But this will add noise to all rules.
:::

::: fact
id: BLK-f707e7c8060ca885
summary: → Fix the tests → Keep the policy pure → Avoid hacks in Rego logic → Use real multi-line diffs.
digest: 9486c28f54cbaada448a80525aef8ef345104176b49758774f39f22ec0f00c87
symbol_refs: []
semantic_role: assertion
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
intuition: This explains that → Fix the tests → Keep the policy pure → Avoid hacks in Rego logic → Use real multi-line diffs..
vector_summary: → Fix the tests → Keep the policy pure → Avoid hacks in Rego logic → Use real multi-line diffs.
chapter: CH-05
:::
→ Fix the tests → Keep the policy pure → Avoid hacks in Rego logic → Use real multi-line diffs
:::

::: example
id: CODE-66aab2e8459d4f6c
language: rego
chapter: CH-05
source: term:Negation-as-Failure Semantics
purpose: definition-example
digest: c633f9658b70eb3aaea8b16029ed12285e7bed2c718a98a0e0369f8e806d6e23
symbol_refs: [startswith]
semantic_role: example
embedding_hint_importance: medium
embedding_hint_scope: local
embedding_hint_chunk: auto
semantic_categories: [negation]
:::
# Simple negation
unauthorized if not authorized

# Negation with expressions
invalid if not startswith(input.name, "valid_")

# Check non-membership
not_admin if not "admin" in input.user.roles
:::

::: example
id: CODE-fafaf716cd6b4cab
language: rego
chapter: CH-05
source: term:Safety Requirements
purpose: definition-example
digest: 92b37a1f2ad42f55af21a74cf795dd7836e0f5ee56cc483b2bd91c43f6e82ed6
symbol_refs: [user]
semantic_role: example
embedding_hint_importance: medium
embedding_hint_scope: local
embedding_hint_chunk: auto
code_smell_probability: 0.7
:::
# ❌ Unsafe: user not grounded
unsafe if {
    not blacklisted[user]
}

# ✅ Safe: user grounded first
safe if {
    user := input.user.id
    not blacklisted[user]
}
:::

::: example
id: CODE-b684bf6989cea9a6
language: rego
chapter: CH-05
source: term:Common Pitfall — Existential vs Universal
purpose: definition-example
digest: 169416aa65c12214f4e412d7ed2d17342e31aaaa3af16d45c2e03116264de36e
symbol_refs: [diff_content, implementation, mock_input]
semantic_role: example
embedding_hint_importance: medium
embedding_hint_scope: local
embedding_hint_chunk: auto
:::
# ✅ CORRECT: Raw string for multi-line test data
test_diff_parsing if {
    diff_content := `+ // TODO: Fix issue
+ function implementation() {`
    # Contains actual newline between lines
    
    mock_input := {"diff": diff_content}
    # Policy regex patterns can now match newlines correctly
}

# ❌ PROBLEMATIC: Double-quoted string with \n literal
test_diff_parsing if {
    diff_content := "+ // TODO: Fix issue\n+ function implementation() {"
    # \n is literal backslash + 'n', NOT a newline
    # Regex patterns expecting newlines will fail
}
:::

::: example
id: CODE-c32ae32281054ef6
language: json
chapter: CH-05
source: term:Common Pitfall — Existential vs Universal
purpose: definition-example
digest: 37bd43e430b16f58696e00fa5b2dfdce3c10109aeb40aac5e77e1ba51dc26d88
symbol_refs: [getUsers]
semantic_role: example
embedding_hint_importance: medium
embedding_hint_scope: local
embedding_hint_chunk: auto
:::
{
  "diff": "+ // TODO:\n+ function getUsers() {"
}
:::

::: example
id: CODE-dc69b72659931d14
language: rego
chapter: CH-05
source: term:Common Pitfall — Existential vs Universal
purpose: definition-example
digest: dc608789ef0070c36ca965169effe067dbde1d338e223daa2c297101f79b1853
symbol_refs: [getUsers, mock_input, literal]
semantic_role: example
embedding_hint_importance: medium
embedding_hint_scope: local
embedding_hint_chunk: auto
:::
test_example if {
    mock_input := {"diff": "+ // TODO:\n+ function getUsers() {"}
    # \n here is literal: backslash + 'n', NOT a newline
}
:::

::: example
id: CODE-b8169cb998dc89c3
language: rego
chapter: CH-05
source: term:Common Pitfall — Existential vs Universal
purpose: definition-example
digest: 24d1165c6b6e286ccb9b5559c944ef86c5c58f4e814db2537ddb8c049366bccb
symbol_refs: []
semantic_role: example
embedding_hint_importance: medium
embedding_hint_scope: local
embedding_hint_chunk: auto
:::
# Policy expects actual newline
regex.match("TODO:\\s*\\n", file.diff)  # Fails in tests with \n literal

# Test input with \n literal
"diff": "+ // TODO:\n+ function()"  # Contains literal "\n", not newline
:::

::: example
id: CODE-85bb3e27a6049cb8
language: rego
chapter: CH-05
source: term:Common Pitfall — Existential vs Universal
purpose: definition-example
digest: dc67bc2d4bda5f155b9d6aa734866f978c2885e6caea83c5443c5f8e31106e7b
symbol_refs: [diff, contains, newline, count]
semantic_role: example
embedding_hint_importance: medium
embedding_hint_scope: local
embedding_hint_chunk: auto
:::
test_debug if {
       diff := "+ // TODO:\n+ function()"
       print("Length:", count(diff))  # Check if \n is one char or two
       print("Contains newline:", contains(diff, "\n"))  # May fail if literal
   }
:::

::: example
id: CODE-fae08d2b1cea57f4
language: rego
chapter: CH-05
source: term:Common Pitfall — Existential vs Universal
purpose: definition-example
digest: 99794f263851531840e3d8c83148297f8b75379f6e73ee9e6b53f67ae5315dfe
symbol_refs: [match, check, checks]
semantic_role: reference
embedding_hint_importance: medium
embedding_hint_scope: local
embedding_hint_chunk: auto
:::
# Policy has two rules that can both match:
# R15-W02: Meaningful TODO not logged (general check)
# R15-W03: TODO added without reference (specific check for +.*TODO:)

# Both rules check:
# - has_meaningful_todo_keywords(file)
# - not has_tech_debt_reference(file)
# R15-W03 also checks: regex.match("\\+.*TODO:", file.diff)
:::

::: example
id: CODE-17a287dc7511837c
language: rego
chapter: CH-05
source: term:Common Pitfall — Existential vs Universal
purpose: definition-example
digest: 0408cf686a7ffa118b96aada14b30d67fe7104f79ccea87edd6d2a6b98e723db
symbol_refs: [contains, mock_input]
semantic_role: warning
embedding_hint_importance: medium
embedding_hint_scope: local
embedding_hint_chunk: auto
:::
# Policy checks for lowercase "temporary"
has_meaningful_todo_keywords(file) if {
    contains(file.diff, "FIXME:")
    contains(file.diff, "temporary")  # Lowercase required
}

# ❌ TEST FAILS: Test uses "Temporary" (capital T)
test_example if {
    mock_input := {"diff": "+ // FIXME: Temporary hack"}
    # Policy doesn't match "Temporary" (capital T)
    # Test expects warning but gets none
}

# ✅ TEST PASSES: Test uses "temporary" (lowercase)
test_example if {
    mock_input := {"diff": "+ // FIXME: temporary hack"}
    # Policy matches "temporary" correctly
}
:::

::: example
id: CODE-0f5614d39d1277bb
language: rego
chapter: CH-05
source: term:Common Pitfall — Existential vs Universal
purpose: definition-example
digest: c039af2051e6fe8f2c1322a84d8ab9524c4b75fafe6028eeb9879addfbb60b21
symbol_refs: [mock_input]
semantic_role: example
embedding_hint_importance: medium
embedding_hint_scope: local
embedding_hint_chunk: auto
:::
# Normalize keywords in test inputs to match policy expectations
test_example if {
    # Use lowercase to match policy checks
    mock_input := {"diff": "+ // FIXME: temporary hack"}
    # ...
}
:::

::: example
id: CODE-4332090fdd6f776f
language: rego
chapter: CH-05
source: term:Common Pitfall — Existential vs Universal
purpose: definition-example
digest: 8cbedc3fbe112e7524c029cedfc5ea53796ffbb9d51db67d466e930123cf381a
symbol_refs: [contains, diff_lower]
semantic_role: example
embedding_hint_importance: medium
embedding_hint_scope: local
embedding_hint_chunk: auto
:::
# Policy normalizes input before checking
has_meaningful_todo_keywords(file) if {
    contains(file.diff, "FIXME:")
    diff_lower := lower(file.diff)
    contains(diff_lower, "temporary")  # Case-insensitive check
}
:::

::: example
id: CODE-4786957d3260209a
language: rego
chapter: CH-05
source: term:Common Pitfall — Existential vs Universal
purpose: definition-example
digest: e02082de3584f3b2a4a8f8fa7bf16ed99f7468cbd68079ec39ac8e44f60ba4b8
symbol_refs: [contains]
semantic_role: example
embedding_hint_importance: medium
embedding_hint_scope: local
embedding_hint_chunk: auto
:::
# Policy checks multiple case variants
has_meaningful_todo_keywords(file) if {
    contains(file.diff, "FIXME:")
    contains(file.diff, "temporary")
}

has_meaningful_todo_keywords(file) if {
    contains(file.diff, "FIXME:")
    contains(file.diff, "Temporary")
}
:::

::: example
id: CODE-1ff94d92ec772887
chapter: CH-05
language: rego
role: code-pattern:comprehension:array
tags: [comprehension, array]
explanation: Format: [ <term> | <query> ]
confidence: 0.9
digest: e5a2d3a8605d2b742c29e2dc511d52e764c6ef4fb0ddf066bd00cb09a5895823
symbol_refs: []
semantic_role: example
embedding_hint_importance: medium
embedding_hint_scope: local
embedding_hint_chunk: auto
:::
:::

::: example
id: CODE-7253f980452b3d90
chapter: CH-05
language: rego
role: code-pattern:comprehension:array
tags: [comprehension, array]
explanation: Simple transformation
confidence: 0.9
digest: 624bc0da84a13eb996b55dd52676eea0767d0ea1632da36a562076349c5b7ebb
symbol_refs: [squares]
semantic_role: example
embedding_hint_importance: medium
embedding_hint_scope: local
embedding_hint_chunk: auto
:::
squares := [x * x | some x in numbers]

:::

::: example
id: CODE-075e6d66583c29fd
chapter: CH-05
language: rego
role: code-pattern:comprehension:array
tags: [comprehension, array]
explanation: With filtering
confidence: 0.9
digest: 3dbcad787d1357393fb9d861c57596ee20f8441d10eb9bbb3f5b2d959ddc0253
symbol_refs: [evens]
semantic_role: example
embedding_hint_importance: medium
embedding_hint_scope: local
embedding_hint_chunk: auto
:::
evens := [x | some x in numbers; x % 2 == 0]

:::

::: example
id: CODE-027f30f7323719cb
chapter: CH-05
language: rego
role: code-pattern:comprehension:array
tags: [comprehension, array]
explanation: Nested iteration
confidence: 0.9
digest: a5919068b44999f886bc68e63df7d088c2ec2e0f2c5c7f6dd1c961b219d7ff33
symbol_refs: [pairs]
semantic_role: example
embedding_hint_importance: medium
embedding_hint_scope: local
embedding_hint_chunk: auto
:::
pairs := [[x, y] |
    some x in [1, 2, 3]
    some y in ["a", "b", "c"]
]
:::

::: example
id: CODE-d3df87bc2896f26f
chapter: CH-05
language: rego
role: code-pattern:generic
tags: [generic]
explanation: Remove duplicates
confidence: 0.9
digest: aee4ae932f306f1c1a9031265f9c59006a396727fb20b9ff9cf9b74ff2fc3efb
symbol_refs: [unique]
semantic_role: example
embedding_hint_importance: medium
embedding_hint_scope: local
embedding_hint_chunk: auto
:::
unique := {x | some x in items}

:::

::: example
id: CODE-c00ff67815d07c70
chapter: CH-05
language: rego
role: code-pattern:generic
tags: [generic]
explanation: Extract unique properties
confidence: 0.9
digest: 62ea6841e1f582adfeff9d16cfae3f0628ef744174483a7b5b0db471cb79c0a0
symbol_refs: [departments]
semantic_role: example
embedding_hint_importance: medium
embedding_hint_scope: local
embedding_hint_chunk: auto
:::
departments := {user.dept | some user in users}

:::

::: example
id: CODE-67adfcbe8b718b84
chapter: CH-05
language: rego
role: code-pattern:comprehension:array
tags: [comprehension, array]
explanation: Create mapping
confidence: 0.9
digest: 99f76db46f63c3adf37ca878bde919ff96874530d65b6182fbafed5975ae4644
symbol_refs: [name, name_to_age]
semantic_role: example
embedding_hint_importance: medium
embedding_hint_scope: local
embedding_hint_chunk: auto
:::
name_to_age := {person.name: person.age |
    some person in people
}

:::

::: example
id: CODE-9eb004b39032d0fd
chapter: CH-05
language: rego
role: code-pattern:comprehension:array
tags: [comprehension, array]
explanation: With transformation
confidence: 0.9
digest: c44393cafe3b331e39b302dc56e458612d1402472b2bdea0680a4097769cdea7
symbol_refs: [doubled, k]
semantic_role: example
embedding_hint_importance: medium
embedding_hint_scope: local
embedding_hint_chunk: auto
:::
doubled := {k: v * 2 |
    some k, v in original
}

:::

::: example
id: CODE-ebc014a7b8a1a105
chapter: CH-05
language: rego
role: code-pattern:comprehension:array
tags: [comprehension, array]
explanation: Aggregation
confidence: 0.9
digest: c3bd05aa3df18915f081bd64261086530fa7373ffc061dba8c90f55808e1b79b
symbol_refs: [user_counts, users_in_dept, dept, count]
semantic_role: example
embedding_hint_importance: medium
embedding_hint_scope: local
embedding_hint_chunk: auto
:::
user_counts := {dept: count |
    some dept in departments
    users_in_dept := [u | some u in users; u.dept == dept]
    count := array.length(users_in_dept)
}
:::

::: example
id: CODE-58dccd21760016f7
chapter: CH-05
language: rego
role: code-pattern:quantification:every-loop
tags: [quantification, every-loop]
explanation: All items must satisfy condition
confidence: 0.9
digest: d5ec31fcb621ba7307a07a7e91925768548ea6bd5aee640f90b19ef38cc016bb
symbol_refs: [status]
semantic_role: example
embedding_hint_importance: medium
embedding_hint_scope: local
embedding_hint_chunk: auto
:::
all_approved if {
    every item in items {
        item.status == "approved"
    }
}

:::

::: example
id: CODE-e301f61ef709e3ed
chapter: CH-05
language: rego
role: code-pattern:quantification:every-loop
tags: [quantification, every-loop]
explanation: With index
confidence: 0.9
digest: 80c6977c72f644aca77a498228f328f4f9da064b11f84c3454d4d9a3698f91ee
symbol_refs: [valid, id]
semantic_role: example
embedding_hint_importance: medium
embedding_hint_scope: local
embedding_hint_chunk: auto
:::
all_valid if {
    every i, item in items {
        item.id == i
        item.valid == true
    }
}

:::

::: example
id: CODE-3ca99b7af209eabd
chapter: CH-05
language: rego
role: code-pattern:quantification:every-loop
tags: [quantification, every-loop]
explanation: Multiple conditions
confidence: 0.9
digest: 0547722e1c8893992de772e7cb9eb7751a7e372f4d4dfa7bb933f02bc8314d9f
symbol_refs: [status]
semantic_role: example
embedding_hint_importance: medium
embedding_hint_scope: local
embedding_hint_chunk: auto
:::
all_healthy if {
    every server in servers {
        server.status == "up"
        server.cpu < 80
        server.memory < 90
    }
}
:::

::: example
id: CODE-e1d030959c9b4c69
chapter: CH-05
language: rego
role: code-pattern:generic
tags: [generic]
explanation: Simple negation
confidence: 0.9
digest: a55c58fe83634b7321ed3cfe1f28ec5045c2621101b53bc26245224cefbf3101
symbol_refs: []
semantic_role: example
embedding_hint_importance: medium
embedding_hint_scope: local
embedding_hint_chunk: auto
semantic_categories: [negation]
:::
unauthorized if not authorized

:::

::: example
id: CODE-0e097b308f02ae50
chapter: CH-05
language: rego
role: code-pattern:generic
tags: [generic]
explanation: This is true if ANY element is not "foo"
confidence: 0.9
digest: be757475deef2ee23ff193f20602dbd4a99a6685fb5ba7e216cc90541d35d052
symbol_refs: []
semantic_role: example
embedding_hint_importance: medium
embedding_hint_scope: local
embedding_hint_chunk: auto
:::
has_non_foo if {
    items[_] != "foo"  # Existential quantification
}

:::

::: example
id: CODE-4d54dbe1e7b7ea19
chapter: CH-05
language: rego
role: code-pattern:generic
tags: [generic]
explanation: ✅ CORRECT: "Is 'foo' not in array?"
confidence: 0.9
digest: 3e4de0b5124f4ca9e4c20e6843f2d136154604793e177fd754ed5a9ad0e3a7e9
symbol_refs: []
semantic_role: example
embedding_hint_importance: medium
embedding_hint_scope: local
embedding_hint_chunk: auto
:::
foo_not_present if {
    not "foo" in items
}

:::

::: example
id: CODE-80484760297e8033
chapter: CH-05
language: rego
role: code-pattern:generic
tags: [generic]
explanation: ✅ CORRECT: "Are all elements not foo?"
confidence: 0.9
digest: 7ad8b19e7ebf43f99021784b6c34d837d1f5f7c5500db1afb9370abbf612e920
symbol_refs: [item]
semantic_role: example
embedding_hint_importance: medium
embedding_hint_scope: local
embedding_hint_chunk: auto
:::
all_non_foo if not any_foo

any_foo if {
    some item in items
    item == "foo"
}
:::

::: example
id: CODE-19e8ca92363c99b4
chapter: CH-05
language: rego
role: code-pattern:generic
tags: [generic]
explanation: ✅ CORRECT: Raw string for multi-line test data
confidence: 0.9
digest: 1da74c9139739bff97bfbca12d5f0470559f5e88f2dd65564a96dea0d3106cbe
symbol_refs: [diff_content, implementation]
semantic_role: example
embedding_hint_importance: medium
embedding_hint_scope: local
embedding_hint_chunk: auto
:::
test_diff_parsing if {
    diff_content := `+ // TODO: Fix issue
+ function implementation() {`
:::

::: example
id: CODE-a69cd2a181869da7
chapter: CH-05
language: rego
role: code-pattern:generic
tags: [generic]
explanation: Contains actual newline between lines
confidence: 0.9
digest: faae1aaa2b5dbce922a6469a5e0315797b9ad7af333098750c3ab74fbd169153
symbol_refs: [mock_input]
semantic_role: example
embedding_hint_importance: medium
embedding_hint_scope: local
embedding_hint_chunk: auto
:::
    
    mock_input := {"diff": diff_content}
:::

::: example
id: CODE-0163524bc818bbf6
chapter: CH-05
language: rego
role: code-pattern:generic
tags: [generic]
explanation: Policy regex patterns can now match newlines correctly
confidence: 0.9
digest: 82b87122368277d7b16b47363cab8661760fe449416a0c18c4d4570f58271dc3
symbol_refs: []
semantic_role: example
embedding_hint_importance: medium
embedding_hint_scope: local
embedding_hint_chunk: auto
:::
}

:::

::: example
id: CODE-6341a88e54c5ab2c
chapter: CH-05
language: rego
role: code-pattern:generic
tags: [generic]
explanation: ❌ PROBLEMATIC: Double-quoted string with \n literal
confidence: 0.9
digest: f56fd8095489b58c7399ad94fdf55e4049a78b54f8fa941b47ef271fba418a92
symbol_refs: [diff_content, implementation]
semantic_role: example
embedding_hint_importance: medium
embedding_hint_scope: local
embedding_hint_chunk: auto
:::
test_diff_parsing if {
    diff_content := "+ // TODO: Fix issue\n+ function implementation() {"
:::

::: example
id: CODE-3cedc546c93f6d04
chapter: CH-05
language: rego
role: code-pattern:generic
tags: [generic]
explanation: Policy expects actual newline
confidence: 0.9
digest: 529d3c8cd36ae8fb90ca1dcefbc228d8b31451f83f180cd122e56f35b93b905b
symbol_refs: []
semantic_role: example
embedding_hint_importance: medium
embedding_hint_scope: local
embedding_hint_chunk: auto
:::
regex.match("TODO:\\s*\\n", file.diff)  # Fails in tests with \n literal

:::

::: example
id: CODE-f2c6e10d8a9dfbd4
chapter: CH-05
language: rego
role: code-pattern:generic
tags: [generic]
explanation: Test input with \n literal
confidence: 0.9
digest: 12e96a69205253477e10e3141745f2e1486f614e31d5e245a26077046d63e3cd
symbol_refs: []
semantic_role: example
embedding_hint_importance: medium
embedding_hint_scope: local
embedding_hint_chunk: auto
:::
"diff": "+ // TODO:\n+ function()"  # Contains literal "\n", not newline
:::

::: example
id: CODE-cdfe82df6bf4edc7
chapter: CH-05
language: rego
role: code-pattern:testing:mock-input
tags: [testing, mock-input]
explanation: ✅ CORRECT: Iterate set to get first element
confidence: 0.9
digest: f13046136f13d81a0501c760e60faaf9ef4337dcc146d8779503a57ca58880df
symbol_refs: [mock_input, warnings, count]
semantic_role: warning
embedding_hint_importance: medium
embedding_hint_scope: local
embedding_hint_chunk: auto
semantic_categories: [testing]
:::
test_get_warning_message if {
    mock_input := {"changed_files": [...]}
    warnings := policy.warn with input as mock_input
    count(warnings) >= 1
    
:::

::: example
id: CODE-b0f12fe1d633b3bd
chapter: CH-05
language: rego
role: code-pattern:testing:mock-input
tags: [testing, mock-input]
explanation: Get first warning message
confidence: 0.9
digest: f9b7dc6131174f2f2f9637fe668aab085756323a068808022e19e257d9012b34
symbol_refs: [warning, contains, msg]
semantic_role: warning
embedding_hint_importance: medium
embedding_hint_scope: local
embedding_hint_chunk: auto
semantic_categories: [testing]
:::
    warning := [msg | msg := warnings[_]][0]
    contains(warning, "expected text")
}

:::

::: example
id: CODE-6402f67efd628235
chapter: CH-05
language: rego
role: code-pattern:testing:mock-input
tags: [testing, mock-input]
explanation: ❌ WRONG: Sets don't support index access
confidence: 0.9
digest: 130d44cf011709b0de3c34248e16f01861566a3f8f2c7b5eaab9e4436f95f302
symbol_refs: [warning]
semantic_role: warning
embedding_hint_importance: medium
embedding_hint_scope: local
embedding_hint_chunk: auto
code_smell_probability: 0.3
semantic_categories: [testing]
:::
warning := warnings[0]  # Error: sets don't have indices
:::

::: example
id: CODE-f662804cf33dcb67
chapter: CH-05
language: rego
role: code-pattern:testing:mock-input
tags: [testing, mock-input]
explanation: Check all warnings
confidence: 0.9
digest: d207c9e1343e9d45fa430e910da4fdcb6cf836927fabc70119d5fdc7afd3481c
symbol_refs: [warnings, count]
semantic_role: warning
embedding_hint_importance: medium
embedding_hint_scope: local
embedding_hint_chunk: auto
semantic_categories: [testing]
:::
test_multiple_assertions if {
    warnings := policy.warn with input as mock_input
    count(warnings) >= 1
    
:::

::: example
id: CODE-0b2590a50bc33a47
chapter: CH-05
language: rego
role: code-pattern:testing:mock-input
tags: [testing, mock-input]
explanation: Check all warnings
confidence: 0.9
digest: 3a55c39b7d1d841ec2f4fbe179a1b3b03cad312e267a17320cda64c89ff5c7b8
symbol_refs: [contains]
semantic_role: warning
embedding_hint_importance: medium
embedding_hint_scope: local
embedding_hint_chunk: auto
semantic_categories: [testing]
:::
    some warning in warnings
    contains(warning, "pattern1")
    
:::

::: example
id: CODE-9a1a759e4ddf610a
chapter: CH-05
language: rego
role: code-pattern:testing:mock-input
tags: [testing, mock-input]
explanation: Or check specific warning
confidence: 0.9
digest: 3b3f4f049ff2e31725d283c0b068edb8ce5eb4b7a52874afb665d5fb2b05d274
symbol_refs: [contains, msg, specific_warning]
semantic_role: warning
embedding_hint_importance: medium
embedding_hint_scope: local
embedding_hint_chunk: auto
semantic_categories: [testing]
:::
    specific_warning := [msg | msg := warnings[_]; contains(msg, "pattern2")][0]
    contains(specific_warning, "pattern2")
}
:::

::: example
id: CODE-81597c2a6c7d76f5
chapter: CH-05
language: rego
role: code-pattern:testing:mock-input
tags: [testing, mock-input]
explanation: ✅ CORRECT: Test for either rule, or check for common message pattern
confidence: 0.9
digest: 898a292e570fbe656d51104ab7c8165b98feb8db63290fee0b917c96a537b819
symbol_refs: [mock_input, warnings, count]
semantic_role: warning
embedding_hint_importance: medium
embedding_hint_scope: local
embedding_hint_chunk: auto
semantic_categories: [testing]
:::
test_meaningful_todo_not_logged if {
    mock_input := {"changed_files": [{
        "diff": "+ // TODO: Fix issue (workaround)"
    }]}
    
    warnings := policy.warn with input as mock_input
    count(warnings) >= 1
    
:::

::: example
id: CODE-1ad5dbfa9ab9da67
chapter: CH-05
language: rego
role: code-pattern:testing:mock-input
tags: [testing, mock-input]
explanation: Check for message pattern common to both rules
confidence: 0.9
digest: 58dfee96f77de9c1162037bca46ffbdc0984846c2f788e4dda61db14e079e904
symbol_refs: [contains]
semantic_role: warning
embedding_hint_importance: medium
embedding_hint_scope: local
embedding_hint_chunk: auto
semantic_categories: [testing]
:::
    some warning in warnings
    contains(warning, "meaningful TODO/FIXME")
    contains(warning, "tech-debt.md")
}

:::

::: example
id: CODE-b3b44232df7d7ede
chapter: CH-05
language: rego
role: code-pattern:testing:mock-input
tags: [testing, mock-input]
explanation: ❌ FRAGILE: Testing for specific rule ID
confidence: 0.9
digest: 28a0784a4c875695834352e4e95909b19e7fbcbd7e4541cd31f6a567caba7d69
symbol_refs: []
semantic_role: example
embedding_hint_importance: medium
embedding_hint_scope: local
embedding_hint_chunk: auto
semantic_categories: [testing]
:::
test_specific_rule if {
:::

::: example
id: CODE-8425d8ead18f3dfd
chapter: CH-05
language: rego
role: example
tags: []
explanation: Policy checks for lowercase "temporary"
confidence: 0.9
digest: 820207f17a390bb4666f0d353d1248b3b5c6d6b91dc4245084c5737257191369
symbol_refs: [contains]
semantic_role: example
embedding_hint_importance: medium
embedding_hint_scope: local
embedding_hint_chunk: auto
:::
has_meaningful_todo_keywords(file) if {
    contains(file.diff, "FIXME:")
    contains(file.diff, "temporary")  # Lowercase required
}

:::

::: example
id: CODE-323d21f08df10217
chapter: CH-05
language: rego
role: example
tags: []
explanation: ❌ TEST FAILS: Test uses "Temporary" (capital T)
confidence: 0.9
digest: 85bc526189a98bcd8e9f73941188160d592fe1b0965c0864521b55e606382ddc
symbol_refs: [mock_input]
semantic_role: example
embedding_hint_importance: medium
embedding_hint_scope: local
embedding_hint_chunk: auto
:::
test_example if {
    mock_input := {"diff": "+ // FIXME: Temporary hack"}
:::

::: example
id: CODE-f8d70d047eae7fcc
chapter: CH-05
language: rego
role: example
tags: []
explanation: Normalize keywords in test inputs to match policy expectations
confidence: 0.9
digest: b81484486e76ee620807cd81e97514e2f1a90734ccfb88e58a03fe373d063ef9
symbol_refs: []
semantic_role: example
embedding_hint_importance: medium
embedding_hint_scope: local
embedding_hint_chunk: auto
:::
test_example if {
:::

::: example
id: CODE-90bf9a86fe5a6225
chapter: CH-05
language: rego
role: example
tags: []
explanation: Use lowercase to match policy checks
confidence: 0.9
digest: 0bf2ed59abf06287751a54f331e0d53cf5d8705eb53cdb99cbb3b81e03c7d55e
symbol_refs: [mock_input]
semantic_role: example
embedding_hint_importance: medium
embedding_hint_scope: local
embedding_hint_chunk: auto
:::
    mock_input := {"diff": "+ // FIXME: temporary hack"}
:::

::: example
id: BLK-5e2db20e80752257
summary: Diagnostic Steps: 1.
digest: 9fbb350918dc84c58ef1e9b5b8ea623b03fbf238692db7c616a862fdd1545770
symbol_refs: [content, count, diff, contains, newline]
semantic_role: example
embedding_hint_importance: medium
embedding_hint_scope: local
embedding_hint_chunk: auto
chapter: CH-05
:::
**Diagnostic Steps:** 1. Compare test input structure with working JSON input 2. Check if regex patterns expect actual newlines vs `\n` literals 3. Use `print()` to inspect actual string content: ```rego test_debug if { diff := "+ // TODO:\n+ function()" print("Length:", count(diff)) # Check if \n is one char or two print("Contains newline:", contains(diff, "\n")) # May fail if literal } ``` 4. Convert test strings to raw strings (backticks) if multi-line content is needed
:::

::: code-pattern
id: CODE-a23e9086072f5ce3
language: rego
chapter: CH-05
source: term:Multiple expressions in a rule body
purpose: definition-example
pattern_type: rule_head
pattern_subtype: allow
tags: [rule_head, allow]
pattern_metadata: {'rule_type': 'allow'}
digest: 7fac9cef4333057328160a595f5b529d50e97479be92f5ccba3c6d8246539ad6
symbol_refs: [sensitive, role, active]
semantic_role: pattern
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
:::
allow if {
    input.user.role == "admin"       # Must be true AND
    input.user.active == true         # Must be true AND
    input.resource.sensitive == false # Must be true
}
:::

::: code-pattern
id: CODE-ab9dfd453065e279
language: rego
chapter: CH-05
source: term:Multiple rule bodies
purpose: definition-example
pattern_type: rule_head
pattern_subtype: allow
tags: [rule_head, allow]
pattern_metadata: {'rule_type': 'allow'}
digest: b28ffd2e541747302095a595a0002ccb6ad85efea5957fcf7a25ccdc6eca09d0
symbol_refs: [action, role, public]
semantic_role: pattern
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
:::
allow if {
    input.user.role == "admin"
}

allow if {
    input.action == "read"
    input.resource.public == true
}
:::

::: code-pattern
id: CODE-d5560fa7f4081a20
language: rego
chapter: CH-05
source: term:Array Comprehensions
purpose: definition-example
pattern_type: quantifier
pattern_subtype: existential
tags: [quantifier, existential]
pattern_metadata: {'quantifier': 'some'}
digest: 01b57b177f383b4f1b8e77b76533760a00c1cbea039ddde5816d913a7f9a4db4
symbol_refs: [squares, evens, admin_emails, pairs, active]
semantic_role: pattern
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
:::
# Format: [ <term> | <query> ]

# Simple transformation
squares := [x * x | some x in numbers]

# With filtering
evens := [x | some x in numbers; x % 2 == 0]

# Complex example
admin_emails := [user.email |
    some user in data.users
    "admin" in user.roles
    user.active == true
]

# Nested iteration
pairs := [[x, y] |
    some x in [1, 2, 3]
    some y in ["a", "b", "c"]
]
# Result: [[1, "a"], [1, "b"], [1, "c"], [2, "a"], ...]
:::

::: code-pattern
id: CODE-d4b2dcce40fd1ab3
language: rego
chapter: CH-05
source: term:Set Comprehensions
purpose: definition-example
pattern_type: quantifier
pattern_subtype: existential
tags: [quantifier, existential]
pattern_metadata: {'quantifier': 'some'}
digest: 658c0a282052e383a03c3c7aae371773dacad12e845548019400ad86e96d2772
symbol_refs: [unique, valid_ips, departments]
semantic_role: pattern
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
:::
# Format: { <term> | <query> }

# Remove duplicates
unique := {x | some x in items}

# Extract unique properties
departments := {user.dept | some user in users}

# Complex filtering
valid_ips := {addr |
    some addr in input.addresses
    net.cidr_contains("10.0.0.0/8", addr)
}
:::

::: code-pattern
id: CODE-0b9eaa6e4b63cd31
language: rego
chapter: CH-05
source: term:Object Comprehensions
purpose: definition-example
pattern_type: quantifier
pattern_subtype: existential
tags: [quantifier, existential]
pattern_metadata: {'quantifier': 'some'}
digest: 8e03128d1783a065fb0c1f2d62b1693341b7ef23ed512e43f7bf1f8254cb500e
symbol_refs: [doubled, count, name_to_age, user_counts, dept, users_in_dept, name, k]
semantic_role: pattern
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
:::
# Format: { <key>: <value> | <query> }

# Create mapping
name_to_age := {person.name: person.age |
    some person in people
}

# With transformation
doubled := {k: v * 2 |
    some k, v in original
}

# Aggregation
user_counts := {dept: count |
    some dept in departments
    users_in_dept := [u | some u in users; u.dept == dept]
    count := array.length(users_in_dept)
}
:::

::: code-pattern
id: CODE-2548413c59110b36
language: rego
chapter: CH-05
source: term:Common Pitfall — Existential vs Universal
purpose: definition-example
pattern_type: quantifier
pattern_subtype: existential
tags: [quantifier, existential]
pattern_metadata: {'quantifier': 'some'}
digest: 8219ad3f7b83545f73a4d9775158c80cd44c26d9204def753d70ff8e7b99136c
symbol_refs: [item]
semantic_role: pattern
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
code_smell_probability: 0.3
:::
# ❌ WRONG: "Is there any element != 'foo'?"
# This is true if ANY element is not "foo"
has_non_foo if {
    items[_] != "foo"  # Existential quantification
}

# ✅ CORRECT: "Is 'foo' not in array?"
foo_not_present if {
    not "foo" in items
}

# ✅ CORRECT: "Are all elements not foo?"
all_non_foo if not any_foo

any_foo if {
    some item in items
    item == "foo"
}
:::

::: code-pattern
id: CODE-0d18d72d3e70f617
language: rego
chapter: CH-05
source: term:Common Pitfall — Existential vs Universal
purpose: definition-example
pattern_type: quantifier
pattern_subtype: existential
tags: [quantifier, existential]
pattern_metadata: {'quantifier': 'some'}
digest: 7d718ab330d3b8801048ad262329acc201dc022242ff66d63ade8e8ebd8a7758
symbol_refs: [contains]
semantic_role: pattern
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
code_smell_probability: 0.7
:::
# ❌ UNSAFE: May error if input.pr_body is missing or not a string
has_override(marker) if {
    contains(input.pr_body, marker)  # Type error if pr_body missing
}

# ✅ SAFE: Type guard before access
has_override(marker) if {
    is_string(input.pr_body)
    contains(input.pr_body, marker)
}

# ✅ SAFE: Guard array access
input_valid if {
    is_array(input.changed_files)
}

# Then use guard in all rules
deny[msg] if {
    input_valid
    some file in input.changed_files
    # ... rest of logic
}
:::

::: code-pattern
id: CODE-1b4cef265aa6f5e3
language: rego
chapter: CH-05
source: term:Common Pitfall — Existential vs Universal
purpose: definition-example
pattern_type: aggregation
pattern_subtype: count
tags: [aggregation, count]
pattern_metadata: {'function': 'count'}
digest: 4b49955727b1a453ac52d631f09d416a11c3e370f50603409593c74dc2efa0e7
symbol_refs: [diff_content, mock_input, warnings, count, getUsers]
semantic_role: warning
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
:::
# ✅ CORRECT: Raw string preserves actual newlines
test_todo_with_newline if {
    diff_content := `+ // TODO:
+ function getUsers() {`
    
    mock_input := {"changed_files": [{
        "path": "file.ts",
        "diff": diff_content
    }]}
    
    # Policy regex now matches correctly
    warnings := policy.warn with input as mock_input
    count(warnings) >= 1
}
:::

::: code-pattern
id: CODE-8cd9f756e7ad785f
language: rego
chapter: CH-05
source: term:Common Pitfall — Existential vs Universal
purpose: definition-example
pattern_type: aggregation
pattern_subtype: count
tags: [aggregation, count]
pattern_metadata: {'function': 'count'}
digest: b3f9811874345a85d6b026e14963f6c3c0ecc2f341f34e00b7b935f681ddb305
symbol_refs: [mock_input, count]
semantic_role: pattern
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
:::
# ❌ PROBLEMATIC: Direct count() with with clause
test_example if {
    mock_input := {"changed_files": [...]}
    count(policy.warn) >= 1 with input as mock_input
}
:::

::: code-pattern
id: CODE-55a5cc5eed674559
language: rego
chapter: CH-05
source: term:Common Pitfall — Existential vs Universal
purpose: definition-example
pattern_type: aggregation
pattern_subtype: count
tags: [aggregation, count]
pattern_metadata: {'function': 'count'}
digest: 9242f78711f4feeb2239a3e692ddf3afa68f366a1932ddb5186f669048bdbb7a
symbol_refs: [mock_input, warnings, count]
semantic_role: warning
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
:::
# ✅ CORRECT: Bind result to variable first
test_example if {
    mock_input := {"changed_files": [...]}
    warnings := policy.warn with input as mock_input
    count(warnings) >= 1
}
:::

::: code-pattern
id: CODE-6fd3a2913e47883e
language: rego
chapter: CH-05
source: term:Common Pitfall — Existential vs Universal
purpose: definition-example
pattern_type: aggregation
pattern_subtype: count
tags: [aggregation, count]
pattern_metadata: {'function': 'count'}
digest: 0e8171a1399323381ecc9e06dbc83db8a49abfa3799ca29e7852a49fb3afa3e4
symbol_refs: [mock_input, warnings, count, msg, warning, contains]
semantic_role: warning
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
code_smell_probability: 0.3
:::
# ✅ CORRECT: Iterate set to get first element
test_get_warning_message if {
    mock_input := {"changed_files": [...]}
    warnings := policy.warn with input as mock_input
    count(warnings) >= 1
    
    # Get first warning message
    warning := [msg | msg := warnings[_]][0]
    contains(warning, "expected text")
}

# ❌ WRONG: Sets don't support index access
warning := warnings[0]  # Error: sets don't have indices
:::

::: code-pattern
id: CODE-51be79b1bf6bc8cb
language: rego
chapter: CH-05
source: term:Common Pitfall — Existential vs Universal
purpose: definition-example
pattern_type: quantifier
pattern_subtype: existential
tags: [quantifier, existential]
pattern_metadata: {'quantifier': 'some'}
digest: 21e5ada939a1cf5636cc6b8834bf63489b5d7b1e44b3986080a379a5cc110d0d
symbol_refs: [warnings, count, msg, contains, specific_warning]
semantic_role: warning
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
:::
test_multiple_assertions if {
    warnings := policy.warn with input as mock_input
    count(warnings) >= 1
    
    # Check all warnings
    some warning in warnings
    contains(warning, "pattern1")
    
    # Or check specific warning
    specific_warning := [msg | msg := warnings[_]; contains(msg, "pattern2")][0]
    contains(specific_warning, "pattern2")
}
:::

::: code-pattern
id: CODE-0fd84a9d259091b1
language: rego
chapter: CH-05
source: term:Common Pitfall — Existential vs Universal
purpose: definition-example
pattern_type: quantifier
pattern_subtype: existential
tags: [quantifier, existential]
pattern_metadata: {'quantifier': 'some'}
digest: 729bf8901665794cbbed1820d820a9fe8068851079d78d636036cfb38703b08f
symbol_refs: [ID, triggers, mock_input, warnings, count, precedence, contains]
semantic_role: warning
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
semantic_categories: [testing]
:::
# ✅ CORRECT: Test for either rule, or check for common message pattern
test_meaningful_todo_not_logged if {
    mock_input := {"changed_files": [{
        "diff": "+ // TODO: Fix issue (workaround)"
    }]}
    
    warnings := policy.warn with input as mock_input
    count(warnings) >= 1
    
    # Check for message pattern common to both rules
    some warning in warnings
    contains(warning, "meaningful TODO/FIXME")
    contains(warning, "tech-debt.md")
}

# ❌ FRAGILE: Testing for specific rule ID
test_specific_rule if {
    # This may fail if rule precedence changes
    # or if a more specific rule triggers first
}
:::

::: code-pattern
id: CODE-704f6e731c295b92
language: rego
chapter: CH-05
source: term:Common Pitfall — Existential vs Universal
purpose: definition-example
pattern_type: aggregation
pattern_subtype: count
tags: [aggregation, count]
pattern_metadata: {'function': 'count'}
digest: 5f4c36bce22679fd54648cdf31640f15a92be21180f4498abc377f45876b53c2
symbol_refs: [mock_input, warnings, count, and, rego.v1, data.compliance.tech_debt, compliance.tech_debt_test]
semantic_role: warning
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
:::
# ✅ CORRECT: Explicit import and qualified reference
package compliance.tech_debt_test

import data.compliance.tech_debt
import rego.v1

test_example if {
    mock_input := {...}
    warnings := tech_debt.warn with input as mock_input
    count(warnings) >= 1
}
:::

::: code-pattern
id: CODE-4522197481045bd4
language: rego
chapter: CH-05
source: term:Common Pitfall — Existential vs Universal
purpose: definition-example
pattern_type: aggregation
pattern_subtype: count
tags: [aggregation, count]
pattern_metadata: {'function': 'count'}
digest: b4a119667d20463a0bbe5d223e0832c86e65ba24ac839c17a373cc99c560374b
symbol_refs: [name, count]
semantic_role: pattern
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
:::
# ❌ AVOID: Bare rule name resolution
test_example if {
    count(warn) >= 1 with input as mock_input
    # Relies on global data tree search - fragile and ambiguous
}
:::

::: code-pattern
id: CODE-2cbe0767daa4b7a0
chapter: CH-05
language: rego
role: code-pattern:comprehension:array
tags: [comprehension, array]
explanation: Complex example
confidence: 0.9
pattern_type: comprehension
pattern_subtype: array
digest: d7e5bf0be390a9f5260879cb368bde9c966164b0bbcc2fba97fcdf71d676aac6
symbol_refs: [admin_emails, active]
semantic_role: pattern
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
:::
admin_emails := [user.email |
    some user in data.users
    "admin" in user.roles
    user.active == true
]

:::

::: code-pattern
id: CODE-189eb42d4e1567c5
chapter: CH-05
language: rego
role: code-pattern:generic
tags: [generic]
explanation: Complex filtering
confidence: 0.9
pattern_type: generic
digest: f432fc30d55e9ea5cb7cc5d0847fa3b0c5dfcbfa294586ead99fb84e75ecab89
symbol_refs: [valid_ips]
semantic_role: pattern
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
:::
valid_ips := {addr |
    some addr in input.addresses
    net.cidr_contains("10.0.0.0/8", addr)
}
:::

::: code-pattern
id: CODE-b26cad8701529876
chapter: CH-05
language: rego
role: code-pattern:generic
tags: [generic, quantifier, existential]
pattern_type: quantifier
pattern_subtype: existential
pattern_metadata: {'quantifier': 'some'}
digest: ab57310f72d6215d82789b2103fa034ce910cdb103f0eeaef24d843c3a435e1b
symbol_refs: []
semantic_role: pattern
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
:::
all_valid if not any_invalid

any_invalid if {
    some item in items
    item.status != "approved"
}
:::

::: code-pattern
id: CODE-86b8ff6d6c92f117
chapter: CH-05
language: rego
role: code-pattern:generic
tags: [generic, quantifier, existential]
pattern_type: quantifier
pattern_subtype: existential
pattern_metadata: {'quantifier': 'some'}
digest: 7dd31133e5d3f997c82c5cee8c26f9e689db217bd22580f0336d31150ff91609
symbol_refs: [violations, status, count, approved]
semantic_role: pattern
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
:::
all_approved if {
    approved := {i | some i in items; i.status == "approved"}
    count(approved) == count(items)
}

# Or check for violations
all_valid if {
    violations := {i | some i in items; i.status != "valid"}
    count(violations) == 0
}
:::

::: code-pattern
id: CODE-b916c9b490f90d5d
chapter: CH-05
language: rego
role: code-pattern:generic
tags: [generic]
explanation: Negation with expressions
confidence: 0.9
pattern_type: generic
digest: 69ab4d80d0347e9c9932106d4d681d3a5f7789aabaca7f36e04cdaa8a55b2c42
symbol_refs: [startswith]
semantic_role: pattern
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
semantic_categories: [authz, negation]
:::
invalid if not startswith(input.name, "valid_")

:::

::: code-pattern
id: CODE-4a2be09c33beac7b
chapter: CH-05
language: rego
role: code-pattern:generic
tags: [generic]
explanation: Check non-membership
confidence: 0.9
pattern_type: generic
digest: e538fccebf0aa342de570b059bea91199f82069fcf68937b3be2546b972c5757
symbol_refs: []
semantic_role: pattern
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
:::
not_admin if not "admin" in input.user.roles
:::

::: code-pattern
id: CODE-62ae1147b658428b
chapter: CH-05
language: rego
role: code-pattern:generic
tags: [generic]
pattern_type: generic
digest: 3e494e88f016d6e51c1f0695d400fe6c80c592a61bf92728741e276a06e0f979
symbol_refs: [user]
semantic_role: pattern
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
code_smell_probability: 0.7
:::
# ❌ Unsafe: user not grounded
unsafe if {
    not blacklisted[user]
}

# ✅ Safe: user grounded first
safe if {
    user := input.user.id
    not blacklisted[user]
}
:::

::: code-pattern
id: CODE-ee17c3fb697fd027
chapter: CH-05
language: rego
role: code-pattern:generic
tags: [generic]
explanation: ❌ UNSAFE: May error if input.pr_body is missing or not a string
confidence: 0.9
pattern_type: generic
digest: ff1112ca70da49012a25305b760f6c380642f1ffb71eddc5add0ad38cf99703a
symbol_refs: [contains]
semantic_role: pattern
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
code_smell_probability: 0.7
:::
has_override(marker) if {
    contains(input.pr_body, marker)  # Type error if pr_body missing
}

:::

::: code-pattern
id: CODE-0dde4ffacad2f8a3
chapter: CH-05
language: rego
role: code-pattern:generic
tags: [generic]
explanation: ✅ SAFE: Type guard before access
confidence: 0.9
pattern_type: generic
digest: 23de84d422214257a44870b53079941a8290cd8afdf464368a49b285a30c9fe5
symbol_refs: [contains]
semantic_role: pattern
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
:::
has_override(marker) if {
    is_string(input.pr_body)
    contains(input.pr_body, marker)
}

:::

::: code-pattern
id: CODE-a0d0469e0feedab3
chapter: CH-05
language: rego
role: code-pattern:generic
tags: [generic]
explanation: ✅ SAFE: Guard array access
confidence: 0.9
pattern_type: generic
digest: 228577b7185208bf72fea54903f8aaca3710abf9937bd55de9a3e2c023a0dc40
symbol_refs: []
semantic_role: pattern
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
:::
input_valid if {
    is_array(input.changed_files)
}

:::

::: code-pattern
id: CODE-6f138445d33c3682
chapter: CH-05
language: rego
role: code-pattern:generic
tags: [generic]
explanation: Then use guard in all rules
confidence: 0.9
pattern_type: generic
digest: 9957d1b6bb05bfc668195cf6ccf47f9b5ff5209afe66b829db5dad7e450a02ab
symbol_refs: []
semantic_role: pattern
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
:::
deny[msg] if {
    input_valid
    some file in input.changed_files
:::

::: code-pattern
id: CODE-c0b73abf2e85dc27
chapter: CH-05
language: rego
role: code-pattern:generic
tags: [generic]
pattern_type: generic
digest: d53f0e39607380d4d34d37cbd17ee172943ef363133cf47ee7d022cb24268c2d
symbol_refs: [getUsers, mock_input, literal]
semantic_role: pattern
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
:::
test_example if {
    mock_input := {"diff": "+ // TODO:\n+ function getUsers() {"}
    # \n here is literal: backslash + 'n', NOT a newline
}
:::

::: code-pattern
id: CODE-bff1347a219a35b9
chapter: CH-05
language: rego
role: code-pattern:generic
tags: [generic]
pattern_type: generic
digest: f967e9fde4f8eeccedce4441797c30ecaeb21802240e8b00a1b5b7e94ce68d22
symbol_refs: [match, check, checks]
semantic_role: pattern
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
:::
# Policy has two rules that can both match:
# R15-W02: Meaningful TODO not logged (general check)
# R15-W03: TODO added without reference (specific check for +.*TODO:)

# Both rules check:
# - has_meaningful_todo_keywords(file)
# - not has_tech_debt_reference(file)
# R15-W03 also checks: regex.match("\\+.*TODO:", file.diff)
:::

::: code-pattern
id: CODEPAT-ce265669a80bad75
language: rego
pattern_type: quantifier
pattern_subtype: universal
tags: [quantifier, universal, quantifier, universal]
chapter: CH-05
metadata: {'quantifier': 'every'}
pattern_metadata: {'quantifier': 'every'}
digest: 23960f798f56d1af5d48eb118692655645ef38306f04fae96ba591713c99ace4
symbol_refs: [valid, status, id]
semantic_role: pattern
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
code_smell_probability: 0.3
:::
# All items must satisfy condition
all_approved if {
    every item in items {
        item.status == "approved"
    }
}

# With index
all_valid if {
    every i, item in items {
        item.id == i
        item.valid == true
    }
}

# Multiple conditions
all_healthy if {
    every server in servers {
        server.status == "up"
        server.cpu < 80
        server.memory < 90
    }
}
:::

::: common-mistake
id: BLK-dddf66d1e26e2d28
summary: Pitfall: contains is substring, not set membership (for that use in).
digest: 4a364ce197bf5e7f244d710ee685b2d36baa211977f5477237e59190cfe185df
symbol_refs: []
semantic_role: content
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
code_smell_probability: 0.8
pattern_role: anti-pattern
severity: high
chapter: CH-05
:::
Pitfall: contains is substring, not set membership (for that use in).
:::

::: common-mistake
id: BLK-4381bc060dd7cf78
summary: 6.24 Design Patterns & Anti-Patterns.
digest: 56b13bfeccc6cb28493782760185cc284afde4785307428ccc3c589406bf53fc
symbol_refs: []
semantic_role: content
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
code_smell_probability: 0.8
pattern_role: anti-pattern
severity: high
chapter: CH-05
:::
6.24 Design Patterns & Anti-Patterns
:::

::: common-mistake
id: BLK-85303cba34b3037c
summary: Explain modes opa eval --explain=notes -d policy.rego -i input.json 'data.authz.allow' opa eval --explain=full ...
digest: ea753c0d15a967c7e298b22e0ffdb11d4d7310811dc37c714e99da0c46781093
symbol_refs: []
semantic_role: content
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
code_smell_probability: 1.0
pattern_role: anti-pattern
severity: high
semantic_categories: [negation, performance]
chapter: CH-05
:::
Harness: performs all file I/O and passes JSON into Rego as input or data. ________________________________________ 7.4 Debugging with print and opa eval print is your printf. Signature: print(x1, x2, ...) Always returns true, so you can drop it directly inside rule bodies. debug_threshold if { t := input.threshold print("Threshold is:", t) t > 10 } Where output appears opa eval → printed to stderr / logs. Embedded OPA → appears in OPA logs; your host system should capture these. Key points print doesn’t alter semantics (just like adding true). Good for: Inspecting variable bindings. Confirming which rule body is being hit. Bad for: Production policies with PII. Flooding logs; use sparingly or behind a debug flag. ________________________________________ 7.5 opa eval Explain & Profile Modes opa eval is both a REPL and microscope. Explain modes opa eval --explain=notes -d policy.rego -i input.json 'data.authz.allow' opa eval --explain=full ... notes = high-level reasoning (rule success/failure). full = full derivation tree; great for debugging, painful for huge queries. Profile mode opa eval --profile -d . -i input.json 'data.compliance' You get: Per-rule evaluation counts and cumulative time. A ranking of “hot” rules (the ones to optimize or refactor). Typical workflow Problem: “Policy is slow for large PRs / big cluster.” Run: opa eval --profile ... Identify rules with: Many evaluations (thousands or millions). High total time. Refactor: Use sets/objects instead of scanning arrays. Add guard conditions (cheap predicates before expensive ones). Use partial evaluation (§11). ________________________________________ 7.6 Common Errors and How to Diagnose Them rego_unsafe_var_error – unsafe variables # ❌ Unsafe: user appears only under negation deny if { not blacklisted[user] } Fix: Bind user outside negation. deny if { user := input.user not blacklisted[user] } rego_type_error – type mismatch Example: using to_number on an object, or sum over [1, "two"]. Fix: Guard with is_* built-ins (is_number(x), is_array(x)). Normalize incoming data. Rule conflict errors Multiple complete rules with same name produce different values for same input. f(1) := 2 f(1) := 3 # conflict For sets/partial objects this is okay (results are merged); for complete rules & functions it’s an error. Infinite or pathological recursion Patterns that refer back to themselves without a base case. OPA has guardrails, but logic errors can still create huge evaluation trees. Mitigate with: Explicit depth counters. Clear base rules. ________________________________________ 7.7 String Literal Handling in Tests: JSON vs Rego String Semantics
:::

::: common-mistake
id: BLK-698947aa7bfd5b86
summary: 7.9.1 The Case Sensitivity Trap.
digest: 8e9b5fd9f2cd2558a1b37b98a92f4332111710b07e8563a8b5e56e5aefd1988b
symbol_refs: []
semantic_role: content
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
code_smell_probability: 0.8
pattern_role: anti-pattern
severity: high
chapter: CH-05
:::
7.9.1 The Case Sensitivity Trap
:::

::: common-mistake
id: BLK-12c670283b218471
summary: Common Pitfalls: Variable Scoping & Safety 4.X Common Pitfalls: Variable Scoping & Safety.
digest: 7dfe5c7fd390b5024e8c39262af42a3ed37bc383ca54858c9a8d057f8fb889ac
symbol_refs: []
semantic_role: content
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
code_smell_probability: 0.8
pattern_role: anti-pattern
severity: high
chapter: CH-05
:::
Common Pitfalls: Variable Scoping & Safety 4.X Common Pitfalls: Variable Scoping & Safety
:::

::: common-mistake
id: BLK-dd2368c95d175c31
summary: Pitfall 1: Accidental Variable Shadowing.
digest: a2d3ff21eb411a35df4c8d9405db921db04bb2ce42bf98305cbfdcc4378bdf69
symbol_refs: []
semantic_role: content
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
code_smell_probability: 0.8
pattern_role: anti-pattern
severity: high
chapter: CH-05
:::
Pitfall 1: Accidental Variable Shadowing
:::

::: common-mistake
id: BLK-ba9a0ebe18957928
summary: Pitfall 2: Unsafe Variables in Rules.
digest: f63aab2fcce6645d74a1dc3e006d980f7a8f7226f61fdb11ed3460e8380a2e04
symbol_refs: []
semantic_role: content
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
code_smell_probability: 0.8
pattern_role: anti-pattern
severity: high
chapter: CH-05
:::
Pitfall 2: Unsafe Variables in Rules
:::

::: common-mistake
id: BLK-09947c35894f257f
summary: A variable is unsafe if it’s used in a rule head or expression but not bound on all paths in the body.
digest: 0df172f31b355620d4fe16fd88a770fff83fa6e1f652a372de7d773d25e295fd
symbol_refs: []
semantic_role: content
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
code_smell_probability: 0.8
pattern_role: anti-pattern
severity: high
chapter: CH-05
:::
A variable is unsafe if it’s used in a rule head or expression but not bound on all paths in the body.
:::

::: common-mistake
id: BLK-d98f97c6793e5ee8
summary: Pitfall 3: Misusing some in Comprehensions.
digest: cd1ce7fe1fbbd078a936096a24f9ed0672c5cafb42cdf3906d2fce948b5e0776
symbol_refs: []
semantic_role: content
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
code_smell_probability: 0.8
pattern_role: anti-pattern
severity: high
chapter: CH-05
:::
Pitfall 3: Misusing some in Comprehensions
:::

::: common-mistake
id: BLK-0462888a4dbfb353
summary: # ❌ Over-constrained: 'some i' appears twice, but you really wanted two different indices bad if { some i arr[i] == "a" some i arr[i] == "b" }.
digest: 1f525f06a8232825809110a9c8879a22a15c4a82d076dce0e182d4b5f79f991e
symbol_refs: []
semantic_role: content
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
code_smell_probability: 0.8
pattern_role: anti-pattern
severity: high
chapter: CH-05
:::
# ❌ Over-constrained: 'some i' appears twice, but you really wanted two different indices bad if { some i arr[i] == "a" some i arr[i] == "b" }
:::

::: common-mistake
id: BLK-1040e7752fd74e64
summary: Pitfall 4: Assuming Global State in Rules.
digest: 6a6249086769b0b91c56102e77e970a981c0a340ad19d238f44a5796a696105e
symbol_refs: []
semantic_role: content
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
code_smell_probability: 0.8
pattern_role: anti-pattern
severity: high
chapter: CH-05
:::
Pitfall 4: Assuming Global State in Rules
:::

::: common-mistake
id: BLK-1eebddc2ae2256d2
summary: # ❌ Misleading mental model: this does not "increment" anything counter := counter + 1 if { ..
digest: 0102c967a849e92a6c48e9bcc05b0ae28bb851dde0cd88e86b2d7c3bbed044aa
symbol_refs: []
semantic_role: content
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
code_smell_probability: 0.8
pattern_role: anti-pattern
severity: high
chapter: CH-05
:::
# ❌ Misleading mental model: this does not "increment" anything counter := counter + 1 if { ... } # invalid and unsafe
:::

::: common-mistake
id: BLK-729a9fcd5572a97e
summary: Chapter 6 – Common Pitfalls: Nulls, Missing Fields, and Type Guards 6.X Common Pitfalls: Nulls, Missing Fields, and Type Guards.
digest: 022163f168cdfd98c7052023eeace96f8ab26f79c4ad8d42088dfef6e234a724
symbol_refs: []
semantic_role: content
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
code_smell_probability: 0.8
pattern_role: anti-pattern
severity: high
chapter: CH-05
:::
Chapter 6 – Common Pitfalls: Nulls, Missing Fields, and Type Guards 6.X Common Pitfalls: Nulls, Missing Fields, and Type Guards
:::

::: common-mistake
id: BLK-8f3c429e92d14caa
summary: Pitfall 1: Accessing Missing Fields Directly.
digest: 25145834f3cc5d374e91bbf7c4ac39657628686a17d40b2cee06f91a0c79b6a0
symbol_refs: []
semantic_role: content
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
code_smell_probability: 0.8
pattern_role: anti-pattern
severity: high
chapter: CH-05
:::
Pitfall 1: Accessing Missing Fields Directly
:::

::: common-mistake
id: BLK-8d49bd98cea35156
summary: # ❌ Panics if input.user is null or missing email := input.user.email.
digest: 1dedf7af7c0197dd7e1bcd8677606876db045630f19b87d9910a871768271566
symbol_refs: []
semantic_role: content
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
code_smell_probability: 0.8
pattern_role: anti-pattern
severity: high
chapter: CH-05
:::
# ❌ Panics if input.user is null or missing email := input.user.email
:::

::: common-mistake
id: BLK-c8f90fb1fd5c7a7c
summary: Pitfall 2: Null vs Missing vs Falsy.
digest: 6d12260b1d7e6df044f6fcea70260ae2c662092f4184cc49e416582a2f224c85
symbol_refs: []
semantic_role: content
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
code_smell_probability: 0.8
pattern_role: anti-pattern
severity: high
chapter: CH-05
:::
Pitfall 2: Null vs Missing vs Falsy
:::

::: common-mistake
id: BLK-f8ec56bf27309156
summary: Pitfall 3: Using array.concat on Non-Arrays.
digest: 53207b88093a3bd8d0b7566bb9d0bb87acc091cdfb68c1274ab0f8cf0df53d12
symbol_refs: []
semantic_role: content
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
code_smell_probability: 0.8
pattern_role: anti-pattern
severity: high
chapter: CH-05
:::
Pitfall 3: Using array.concat on Non-Arrays
:::

::: common-mistake
id: BLK-bb3e0508397aa2ad
summary: # ❌ Panics if path is null or not an array full := concat(".", array.concat(path, [field])).
digest: 329a7d2cb13a0668052a2bd4a25c0b9b764cd758cb0672e217bc6d3602981f8a
symbol_refs: []
semantic_role: content
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
code_smell_probability: 0.8
pattern_role: anti-pattern
severity: high
chapter: CH-05
:::
# ❌ Panics if path is null or not an array full := concat(".", array.concat(path, [field]))
:::

::: common-mistake
id: BLK-0f33462feb34e48a
summary: Pitfall 4: Equality Checks with Mixed Types.
digest: 6463d0f4a93d113ebbbc2e1a0ae0ef5b47787fea35ca737bd8a1c92963cddadf
symbol_refs: []
semantic_role: content
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
code_smell_probability: 0.8
pattern_role: anti-pattern
severity: high
chapter: CH-05
:::
Pitfall 4: Equality Checks with Mixed Types
:::

::: common-mistake
id: BLK-330f79b92b8aba7c
summary: # ❌ May silently fail if left/right have different types allowed if input.user.id == data.allowed_ids[_].
digest: 5443af728d68cfb5fd37f6124097fe6b5fa0e8d9435cf1155712b811017bdae3
symbol_refs: []
semantic_role: content
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
code_smell_probability: 0.8
pattern_role: anti-pattern
severity: high
chapter: CH-05
:::
# ❌ May silently fail if left/right have different types allowed if input.user.id == data.allowed_ids[_]
:::

::: common-mistake
id: BLK-5ed33926d8aec1d7
summary: Pitfall 5: Assuming in Works Like SQL for All Types.
digest: 1da396d0ec9a3dfa3f69a9707988f4847104cfa83de3cd3eeb7625f903f8a7f4
symbol_refs: []
semantic_role: content
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
code_smell_probability: 0.8
pattern_role: anti-pattern
severity: high
chapter: CH-05
:::
Pitfall 5: Assuming in Works Like SQL for All Types
:::

::: common-mistake
id: BLK-76c27d5ad47d6dd3
summary: Chapter 11 – Common Pitfalls: Performance Anti-Patterns 11.X Common Pitfalls: Performance Anti-Patterns.
digest: e10b8c1f4f69f121a72168e68b052ba776e8c604f0b3c139906d2fdf1b7472f1
symbol_refs: []
semantic_role: content
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
code_smell_probability: 0.8
pattern_role: anti-pattern
severity: high
chapter: CH-05
:::
Chapter 11 – Common Pitfalls: Performance Anti-Patterns 11.X Common Pitfalls: Performance Anti-Patterns
:::

::: common-mistake
id: BLK-d4c141e7faf930a8
summary: Pitfall 1: Unbounded Linear Scans on Huge Collections.
digest: 3cd0e0a78abd3b5d1d75bc073f89c4b9adcecca3d26dfe94c929ad6e91551911
symbol_refs: []
semantic_role: content
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
code_smell_probability: 0.8
pattern_role: anti-pattern
severity: high
chapter: CH-05
:::
Pitfall 1: Unbounded Linear Scans on Huge Collections
:::

::: common-mistake
id: BLK-69f70113ccbfdbaf
summary: # ❌ Potentially O(N) scan on large data set every request deny if { some i data.events[i].ip == input.client_ip }.
digest: 83b9ef5a06e9e889a9d7617641fea5ca14344744f2c344fc41e34ecc4fd07be9
symbol_refs: []
semantic_role: content
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
code_smell_probability: 0.8
pattern_role: anti-pattern
severity: high
chapter: CH-05
:::
# ❌ Potentially O(N) scan on large data set every request deny if { some i data.events[i].ip == input.client_ip }
:::

::: common-mistake
id: BLK-56eee991d49f2f74
summary: Pitfall 2: Heavy Regex in Hot Paths.
digest: 48dee515485bf35d901c8f3c577fa98c66af41c88af75806ee1b244a30600ae2
symbol_refs: []
semantic_role: content
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
code_smell_probability: 0.8
pattern_role: anti-pattern
severity: high
chapter: CH-05
:::
Pitfall 2: Heavy Regex in Hot Paths
:::

::: common-mistake
id: BLK-71badd79374ac20d
summary: # ❌ Expensive regex on every request deny if re_match(".*(admin|root).*", input.user.name).
digest: 4ae07157c1d694b741958ba5bbd9b45bc71222a5574ff31728001f852fc23d34
symbol_refs: []
semantic_role: content
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
code_smell_probability: 0.8
pattern_role: anti-pattern
severity: high
chapter: CH-05
:::
# ❌ Expensive regex on every request deny if re_match(".*(admin|root).*", input.user.name)
:::

::: common-mistake
id: BLK-5cf9708436f56691
summary: Pitfall 3: Recomputing the Same Expression Repeatedly.
digest: a4f30604de3a4a55822b67d9369faff69f700d691bd6a1244acc8e2c5a6b0ecf
symbol_refs: []
semantic_role: content
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
code_smell_probability: 0.8
pattern_role: anti-pattern
severity: high
chapter: CH-05
:::
Pitfall 3: Recomputing the Same Expression Repeatedly
:::

::: common-mistake
id: BLK-8c26af7bbbb8934f
summary: # ❌ Recomputes parse for each use deny if { re_match("admin", input.user.name) some p in data.profiles re_match("admin", input.user.name) # repeate...
digest: da45824d995a80dc3b26f89cea8222cea462160e84dd602a867e3f0e4f1677fc
symbol_refs: []
semantic_role: content
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
code_smell_probability: 0.8
pattern_role: anti-pattern
severity: high
chapter: CH-05
:::
# ❌ Recomputes parse for each use deny if { re_match("admin", input.user.name) some p in data.profiles re_match("admin", input.user.name) # repeated }
:::

::: common-mistake
id: BLK-ee24a61881531dd4
summary: Pitfall 4: Ignoring Partial Evaluation Opportunities.
digest: 08e800336c564e123d6e4d16f3b1c9c03554a0bbb3c1f87e679f0b0e6167dc27
symbol_refs: []
semantic_role: content
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
code_smell_probability: 0.8
pattern_role: anti-pattern
severity: high
semantic_categories: [performance]
chapter: CH-05
:::
Pitfall 4: Ignoring Partial Evaluation Opportunities
:::

::: common-mistake
id: BLK-a93ea38f3eeb27c0
summary: # ❌ CLI call with huge static config in input opa eval -d policies/ -i big_config.json 'data.authz.allow'.
digest: f1cf291cd1d34e524ea6d289de139604a5c77cfaecb511da731bc83ee59bcd25
symbol_refs: []
semantic_role: content
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
code_smell_probability: 0.8
pattern_role: anti-pattern
severity: high
chapter: CH-05
:::
# ❌ CLI call with huge static config in input opa eval -d policies/ -i big_config.json 'data.authz.allow'
:::

::: common-mistake
id: BLK-d8b81e49338056c4
summary: Pitfall 5: Overusing walk on Large Trees.
digest: 09b2a0473233b33fd8c6635dab416c014fe0239499493d902c0c27657ab5041d
symbol_refs: []
semantic_role: content
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
code_smell_probability: 0.8
pattern_role: anti-pattern
severity: high
chapter: CH-05
:::
Pitfall 5: Overusing walk on Large Trees
:::

::: common-mistake
id: BLK-f730628e59f13a75
summary: # ❌ walk(data) over a huge universe deny if { some path, value walk(data, [path, value]) value == "secret" }.
digest: b117bb7c913497d9fb15f1a5878e12a91d39437d95d96c6e4312f94598d90bcd
symbol_refs: []
semantic_role: content
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
code_smell_probability: 0.8
pattern_role: anti-pattern
severity: high
chapter: CH-05
:::
# ❌ walk(data) over a huge universe deny if { some path, value walk(data, [path, value]) value == "secret" }
:::

::: common-mistake
id: BLK-afce364a62b525b6
summary: If [ -n "$unused" ]; then echo "❌ Unused imports detected:" echo "$unused" exit 1 fi.
digest: 1ce9fd8c91df104acfe7447abcf054cfe83dbcc5b9663caee4cd5fc0615a3fd4
symbol_refs: []
semantic_role: content
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
code_smell_probability: 0.8
pattern_role: anti-pattern
severity: high
chapter: CH-05
:::
if [ -n "$unused" ]; then echo "❌ Unused imports detected:" echo "$unused" exit 1 fi
:::

::: common-mistake
id: BLK-1e1f5439ddf1252a
summary: And the moment two rule names collide, OPA will throw a conflict or silently evaluate the wrong rule — both are terrible in production policy systems.
digest: 3c9893c379e9b5aba5de5dc8148b3c03547ab2a612a9567686f8c40847f76a07
symbol_refs: []
semantic_role: content
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
code_smell_probability: 0.8
pattern_role: anti-pattern
severity: high
chapter: CH-05
:::
And the moment two rule names collide, OPA will throw a conflict or silently evaluate the wrong rule — both are terrible in production policy systems.
:::

::: common-mistake
id: BLK-be2d957171219dc8
summary: Worse: OPA selects the wrong one depending on rule type.
digest: 4491e4de16a41bd32f0e3ee082dffccb7a068e416238f06ed320c59e0a02ac43
symbol_refs: []
semantic_role: content
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
code_smell_probability: 0.8
pattern_role: anti-pattern
severity: high
chapter: CH-05
:::
worse: OPA selects the wrong one depending on rule type.
:::

::: common-mistake
id: BLK-3ddf8d1dfd449b3b
summary: 🧠 The Better Fix (What I Would Do) ❌ Instead of removing the import ✔️ Fix the test to use the import explicitly import data.compliance.tech_debt.
digest: 7b3eba79b0bcfcf5f7561365edd904348310f0b72c911da5900bf133eed58347
symbol_refs: []
semantic_role: content
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
code_smell_probability: 0.8
pattern_role: anti-pattern
severity: high
chapter: CH-05
:::
🧠 The Better Fix (What I Would Do) ❌ Instead of removing the import ✔️ Fix the test to use the import explicitly import data.compliance.tech_debt
:::

::: common-mistake
id: BLK-e5a06967afb6c7a8
summary: ❌ But in Rego test files, a string such as: "diff": "+ // TODO:\n+ function getUsers() {".
digest: af524623e8718e26567ee8d03e8f9abe79f3f56a88ce8719235d3111666c4421
symbol_refs: []
semantic_role: content
embedding_hint_importance: high
embedding_hint_scope: section
embedding_hint_chunk: auto
code_smell_probability: 0.8
pattern_role: anti-pattern
severity: high
chapter: CH-05
:::
❌ But in Rego test files, a string such as: "diff": "+ // TODO:\n+ function getUsers() {"
:::

::: constraint
id: CONSTR-d28f2f165c62dac0
chapter: CH-05
source_id: TERM-61b8c1a83d1cdbdd
type: forbidden
digest: e168f29f55b62a0a99532bc004791ab66517457d63888366194329aa7ad65e58
symbol_refs: []
semantic_role: content
:::
This block describes a forbidden or disallowed behavior.
:::

::: table
id: TABLE-f3829f7c85d60ef1
chapter: CH-05
type: dos-donts
headers: [Do, Don't]
rows: [['Metadata & Introspection: rego.metadata.rule, rego.metadata.chain.', 'Pitfall: contains is substring, not set membership (for that use in).'], ['# All servers must be healthy all_healthy if { all([s.healthy | some s in input.servers]) }.', '6.24 Design Patterns & Anti-Patterns.'], ['OPA has no direct a[1:3] slicing syntax; use array.slice.', "Explain modes opa eval --explain=notes -d policy.rego -i input.json 'data.authz.allow' opa eval --explain=full ..."], ['Rego sets are unordered, unique collections.', '7.9.1 The Case Sensitivity Trap.'], ['Rego strings are Unicode text; built-ins operate on code points (not bytes).', 'Common Pitfalls: Variable Scoping & Safety 4.X Common Pitfalls: Variable Scoping & Safety.'], ['# May not work in all OPA versions is_hex if regex.match(^[0-9a-fA-F]+$, input.value).', 'Pitfall 1: Accidental Variable Shadowing.'], ['Best Practice: Always use double-quoted strings with escaped backslashes for regex patterns.', 'Pitfall 2: Unsafe Variables in Rules.'], ['When to Use Raw Strings: - Test inputs containing multi-line content (file diffs, code blocks) - Regex patterns that need to match actual newline c...', 'A variable is unsafe if it’s used in a rule head or expression but not bound on all paths in the body.'], ['Difference: to_* is generally more permissive; cast_* may be stricter (implementation details can vary by version—always verify against your target...', 'Pitfall 3: Misusing some in Comprehensions.'], ['Always guard access to optional or potentially missing input fields:.', '# ❌ Over-constrained: \'some i\' appears twice, but you really wanted two different indices bad if { some i arr[i] == "a" some i arr[i] == "b" }.'], ['Common Patterns: - Check is_string() before contains(), startswith(), endswith() - Check is_array() before iteration with some ..', 'Pitfall 4: Assuming Global State in Rules.'], ['Never bake secrets into Rego source; pass via data or environment.', '# ❌ Misleading mental model: this does not "increment" anything counter := counter + 1 if { ..'], ['6.14 This chapter catalogs core built-ins and corrects a few subtle points (arrays, JSON filtering, time, UUIDs/ULIDs).', 'Chapter 6 – Common Pitfalls: Nulls, Missing Fields, and Type Guards 6.X Common Pitfalls: Nulls, Missing Fields, and Type Guards.'], ['Both arguments must be arrays.', 'Pitfall 1: Accessing Missing Fields Directly.'], ['If either argument is null (or not an array), OPA raises a type error.', '# ❌ Panics if input.user is null or missing email := input.user.email.'], ['Important corrections:.', 'Pitfall 2: Null vs Missing vs Falsy.'], ['There is no standard time.diff builtin in OPA.', 'Pitfall 3: Using array.concat on Non-Arrays.'], ['Test_http_policy if { result := policy.check with http.send as mock_http_send }.', '# ❌ Panics if path is null or not an array full := concat(".", array.concat(path, [field])).'], ['Rego exposes rule metadata at evaluation time:.', 'Pitfall 4: Equality Checks with Mixed Types.'], ['Rule_meta := rego.metadata.rule() # metadata of current rule chain_meta := rego.metadata.chain() # stack of rule metadata along evaluation chain.', '# ❌ May silently fail if left/right have different types allowed if input.user.id == data.allowed_ids[_].'], ['Enrich decision logs with rule IDs, owners, severity.', 'Pitfall 5: Assuming in Works Like SQL for All Types.'], ['Deny[msg] if { violation_condition m := rego.metadata.rule() msg := { "msg": "Violation detected", "rule_id": m.id, "owner": m.owner, } }.', 'Chapter 11 – Common Pitfalls: Performance Anti-Patterns 11.X Common Pitfalls: Performance Anti-Patterns.'], ['Print is the primary debugging tool for Rego:.', 'Pitfall 1: Unbounded Linear Scans on Huge Collections.'], ['Debug_rule if { x := input.value print("The value of x is:", x) x > 10 }.', '# ❌ Potentially O(N) scan on large data set every request deny if { some i data.events[i].ip == input.client_ip }.'], ['Output appears in OPA logs or opa eval --explain trace output depending on environment.', 'Pitfall 2: Heavy Regex in Hot Paths.'], ['# If to_number fails, rule body is undefined is_valid if { n := to_number(input.score) n >= 0 }.', '# ❌ Expensive regex on every request deny if re_match(".*(admin|root).*", input.user.name).'], ['Opa eval --strict-builtin-errors ...', 'Pitfall 3: Recomputing the Same Expression Repeatedly.'], ['Validation helpers: Make dedicated rules using type and conversion built-ins (is_valid_request, normalize_email) and reuse everywhere.', '# ❌ Recomputes parse for each use deny if { re_match("admin", input.user.name) some p in data.profiles re_match("admin", input.user.name) # repeate...'], ['Canonicalization: Always lowercase/trim user-identifiers before comparison.', 'Pitfall 4: Ignoring Partial Evaluation Opportunities.'], ['Non-mocked time in tests: Using time.now_ns() directly in tests causes flakiness; always with time.now_ns as ...', "# ❌ CLI call with huge static config in input opa eval -d policies/ -i big_config.json 'data.authz.allow'."], ['Chapter 7 – Testing, Debugging & Troubleshooting (From Hello-World to PhD) Testing is not an afterthought in Rego/OPA; it is the mechanism by which...', 'Pitfall 5: Overusing walk on Large Trees.'], ['# All tests in current tree opa test .', '# ❌ walk(data) over a huge universe deny if { some path, value walk(data, [path, value]) value == "secret" }.'], ['# Verbose (see individual test names) opa test.', 'If [ -n "$unused" ]; then echo "❌ Unused imports detected:" echo "$unused" exit 1 fi.'], ['# Specific path or file opa test policies/ authz_test.rego.', 'And the moment two rule names collide, OPA will throw a conflict or silently evaluate the wrong rule — both are terrible in production policy systems.'], ['Override input test_non_admin_denied if { authz.allow with input as { "user": {"id": "bob", "roles": ["user"]}, "action": "delete", "resource": {"i...', 'Worse: OPA selects the wrong one depending on rule type.'], ['# in policy: within_business_hours if { now := time.now_ns() [hour, _, _] := time.clock(now) hour >= 9 hour < 17 }.', '🧠 The Better Fix (What I Would Do) ❌ Instead of removing the import ✔️ Fix the test to use the import explicitly import data.compliance.tech_debt.'], ['7.3 Golden Tests & File I/O (Corrected).', '❌ But in Rego test files, a string such as: "diff": "+ // TODO:\\n+ function getUsers() {".'], ['Rego itself has no read_file builtin and cannot perform file I/O. All file reading is handled by the test harness (shell, Go, Python, etc.).', ''], ['Populate data.tests["pr_large"] before invoking opa test or the OPA SDK.', ''], ['Rego: pure data and rules; no file system.', ''], ['A critical distinction exists between how string literals are interpreted in JSON inputs versus Rego test files.', ''], ['JSON Input (via opa eval --input):.', ''], ['In JSON, \\n is interpreted as an actual newline character during JSON parsing.', ''], ['Rego Test File (inline string literal):.', ''], ["In Rego test files, \\n within double-quoted strings is treated as a literal two-character sequence: backslash followed by 'n'.", ''], ['Symptoms: - Tests fail with opa test but pass with opa eval --input <json-file> - Regex patterns that work with JSON inputs fail in test files - Mu...', ''], ['Best Practice: When testing policies that process multi-line content (diffs, code, logs), always use raw strings in test files to match the behavio...', ''], ['The evaluation context of with clauses in tests can affect how rule results are accessed.', ''], ['When a rule returns a set (partial rule with contains), accessing elements requires proper iteration:.', ''], ['7.8.3 Rule Precedence and Overlapping Conditions.', ''], ['When multiple rules can match the same input, understanding evaluation order is critical for test design.', ''], ['Problem: Overlapping Rule Conditions.', ''], ['Best Practice: Design tests to verify policy behavior (what warnings are produced) rather than implementation details (which specific rule triggered).', ''], ["String matching functions in Rego are case-sensitive, which can cause test failures when test inputs don't match policy expectations.", ''], ['Option 2: Policy-Level Normalization (Recommended for Production).', ''], ['Option 3: Explicit Case Variants in Policy.', ''], ['Best Practice: For production policies, prefer normalization (Option 2) to handle case variations gracefully.', ''], ['Decision rule: data.envoy.authz.allow.', ''], ['Bundles: main: service: policy resource: /bundles/crm-main.tar.gz polling: min_delay_seconds: 10 max_delay_seconds: 60 OPA periodically pulls bundl...', ''], ['Allow if { base_allow not data.tenants[input.tenant_id].deny_all } Canary rollout: Serve new bundle under /bundles/crm-main-canary.tar.gz to subset...', ''], ['Allow if { _is_admin(input.user) input.request.method == "GET" } Rule organization Top of file: Package.', ''], ['Name: Install OPA run: | curl -L -o opa https://openpolicyagent.org/downloads/latest/opa_linux_amd64 chmod +x opa sudo mv opa /usr/local/bin/opa.', ''], ['Name: Check formatting run: opa fmt --fail .', ''], ['Name: Lint (Regal) run: regal lint --format=github.', ''], ['Use Rego-specific patterns (no inline comprehensions in allow/deny, etc.) in your rules system.', ''], ['# Slow pattern deny[msg] if { some u in data.users u.id == input.user_id not u.active msg := "User is inactive" } Instead, structure data.users as ...', ''], ["# Build a WebAssembly module for a specific entrypoint opa build -t wasm -e 'data.authz.allow' policies/.", ''], ["# Build a bundle for a specific entrypoint without WASM opa build -e 'data.authz.allow' policies/.", ''], ['An optimized bundle (policy + data),.', ''], ['Suitable for the standard OPA runtime, with partial eval already applied for that entrypoint.', ''], ["Opa eval --partial \\ -d policies/ \\ 'data.authz.allow'.", ''], ['Returns residual policy expressions capturing unknowns,.', ''], ['Opa build -t wasm ..', ''], ['Opa build ..', ''], ['Opa eval --partial ..', ''], ['Require that cycles with negation are disallowed or handled carefully.', ''], ["Key points: P^'is smaller and more specialized.", ''], ['Chapter 13 – Multi-Layer Policy Architecture Multi-layer policy architecture is how you scale from one clever Rego file to hundreds of policy owner...', ''], ['__meta__ := { "rule_id": "ACCT_001", "owner": "team-crm-platform", "service": "accounts-api", "layer": "domain", "severity": "BLOCK", # BLOCK | OVE...', ''], ['Deny[msg] if { input.account.status == "closed" input.action == "reopen" msg := { "rule_id": __meta__.rule_id, "owner": __meta__.owner, "msg": "Clo...', ''], ['__meta__ := { "rule_id": "NET_001", "layer": "global", "severity": "BLOCK", "owner": "sec-net", }.', ''], ['Effects[eff] if { eff := data.svc.accounts.rules.effects[_] }.', ''], ['Result := { "allow": allow, "effects": all_effects, } if { all_effects := [e | e := effects[_]].', ''], ['# Fallback: if no BLOCK denies, then allow if explicit allow exists or default rules say so.', ''], ['Allow_flag := some e in all_effects { e.effect == "allow" } } You can refine this by: • Picking highest-ranked deny by layer rank.', ''], ['Allow if { base_allow not tenant_extra_deny[_] } This gives global → domain final say on allow, and tenant extra ways to say “no.” ________________...', ''], ['# decision doc decision := { "allow": allow, "trace_id": trace_id, } ________________________________________ 14.4 PII and Redaction in Logs Golden...', ''], ['OPA is logically stateless: every evaluation sees a snapshot of policy + data.', ''], ['OPA never mutates data.state.login_counts.', ''], ['Or an in-memory structure via the OPA Go SDK,.', ''], ['Or a shared cache that OPA reads from.', ''], ['OPA Policy → reads data.state.* as a pure input.', ''], ['OPA remains a pure decision engine; all state transitions happen outside.', ''], ['OPA uses that state to decide: o Allow or deny new events.', ''], ['Allow if { count(violations) == 0 } ________________________________________ Data Policy Models & GraphQL Costing.', ''], ['16.2 Field Cost Calculation (Corrected array.concat).', ''], ['Corrections and nuances:.', ''], ['If either argument is null or non-array, OPA throws a type error, so in more defensive code:.', ''], ['• Allows multiple services to enforce the same logic.', ''], ['Test_admin_can_read if { authz.allow with input as {"user": "alice", "role": "admin"} } Run: opa test .', ''], ['The full decision path for a typical OPA evaluation looks like this:.', ''], ['Flowchart LR A[Client / Service] -->|HTTP/SDK| B[OPA] B --> C[Parse & Compile Policies] C --> D[Load Data Bundles] D --> E[Evaluate Query] E --> F[...', ''], ['Flowchart TD R[Request: input] --> OPA[OPA Engine].', ''], ['Subgraph Policy Lifecycle P[Parse Rego] --> Q[Compile to IR] Q --> PE[Optional: Partial Eval] end.', ''], ['OPA --> P PE --> D1[Optimized Policy Set].', ''], ['OPA can be deployed in three canonical modes: sidecar, central service, and embedded.', ''], ['Flowchart LR subgraph Sidecar Mode A1[App Pod] --- O1[OPA Sidecar] end.', ''], ['Subgraph Central Service A2[Apps / Gateways] --> O2[OPA Cluster] end.', ''], ['Subgraph Embedded Library A3[App Process with OPA SDK] end.', ''], ['8.X.1 Sidecar Mode flowchart LR SVC[Service Container] -->|localhost:8181 /v1/data/...| OPA[OPA Sidecar].', ''], ['B[BUNDLE Server] --> OPA.', ''], ['Each app pod has its own OPA.', ''], ['8.X.2 Central Policy Service flowchart LR GW[API Gateway] -->|batched queries| OPA_CLUSTER[Central OPA] AUTH[IdP / Token Service] --> GW B[BUNDLE S...', ''], ['One or a few OPA instances serve many clients.', ''], ['8.X.3 Embedded OPA flowchart LR APP[Application Process] -->|in-process call| LIB[OPA SDK / WASM] B[BUNDLE Source] --> APP.', ''], ['OPA compiled to WASM or linked via Go library.', ''], ['Chapter 13 – Multi-Layer Policy Architecture Visualization 13.X Multi-Layer Policy Stack flowchart TB G[Global Layer\\n(org-wide baselines)] --> D[D...', ''], ['Global: Non-negotiable baselines (e.g., MFA required, PII rules, legal holds).', ''], ['# Domain: EU requires additional consent domain_deny[reason] if { input.region == "eu" not input.user.consented reason := "Domain(EU): consent requ...', ''], ['# Team: service-specific checks team_deny[reason] if { input.service == "billing" not input.user.roles[_] == "billing_admin" reason := "Team(Billin...', ''], ['Deny[reason] := reason if { some r r := global_deny[r] # global always first } or { some r r := domain_deny[r] } or { some r r := team_deny[r] }.', ''], ['Chapter 14 – Decision Log Flow Diagram 14.X Decision Log Pipeline flowchart LR REQ[Incoming Request] --> OPA[OPA] OPA --> DEC[Decision Response] OP...', ''], ['Metrics (eval time, number of rules evaluated).', ''], ['Bundle/ ├── .manifest ├── policies/ │ ├── authz.rego │ ├── jwt.rego │ └── resources.rego └── data/ ├── config.json └── tenants/ ├── tenant-1.json └...', ''], ['Revision is an opaque version string for debugging/rollback.', ''], ['Roots tell OPA which prefixes in data this bundle owns:.', ''], ['Authz → data.authz.* (from authz.rego).', ''], ['# Layer rules return {allow: bool, reasons: [string]} global_decision := {"allow": allow, "reasons": reasons} { deny_reasons := {r | some r r := gl...', ''], ['# Check if user has required role for a field field_allowed([path, field]) if { full := concat(".", array.concat(path, [field])) required := data.g...', ''], ['Chapter 17 – Full LLM → OPA Workflow with Validation 17.X Architecture Diagram flowchart LR REQ[User / Dev Describes Policy] --> LLM[LLM / Copilot]...', ''], ['Syntactic checks: opa fmt, opa check.', ''], ['Unit tests: opa test.', ''], ['Static analysis: internal style & safety rules.', ''], ['Staging OPA: run candidate policy against recorded traffic (shadow mode).', ''], ['Candidate Rego (generated by LLM):.', ''], ['Run opa fmt → ensure style.', ''], ['Run opa check → catch unknown refs, unsafe vars.', ''], ['Run opa test → ensure behavior matches expectations.', ''], ['Rego’s scoping rules are simple but unforgiving.', ''], ['# ❌ Unsafe: r is not always bound deny[r] if { input.violations[_] == v v.level == "HIGH" r := v.reason } else { # no binding for r here }.', ''], ['Use opa check to detect this and refactor to ensure all head variables are always bound:.', ''], ['# ✅ r always derived from same comprehension deny[r] if { r := v.reason some v in input.violations v.level == "HIGH" }.', ''], ['Some x introduces a new variable local to the current expression.', ''], ['# ✅ Clear indices good if { some i arr[i] == "a" some j arr[j] == "b" }.', ''], ['Each rule evaluation is pure and has no hidden global state.', ''], ['Rego is strict about types, but JSON inputs are often messy.', ''], ['Always guard when reading from untrusted inputs:.', ''], ['# ✅ Safe pattern with guards user_email := email if { is_object(input.user) is_string(input.user.email) email := input.user.email }.', ''], ['If input.user.id is a number and data.allowed_ids are strings, this will never match.', ''], ['Performance problems in OPA usually come from data modeling and unbounded searches, not from individual built-ins.', ''], ["# ✅ Precompute static parts into a bundle or WASM opa build -e 'data.authz.allow' policies/.", ''], ['# ✅ Narrowed search deny if { some path, value walk(data.tenants, [path, value]) value == "secret" }.', ''], ['Use opa fmt --skip-constraints (most reliable built-in).', ''], ['Opa fmt removes unused aliases but NOT unused imports.', ''], ['If u is never referenced, opa fmt will not remove it.', ''], ['Some versions of opa fmt will rewrite it to:.', ''], ['…and will not remove it.', ''], ['Use opa check --strict.', ''], ['Opa check --strict .', ''], ['Use Rego Linter Plugins (best solution).', ''], ['This is the closest to ESLint/flake8 for Rego.', ''], ['Use Styra DAS Rego Analyzer (if enterprise budget exists).', ''], ['Styra’s Rego Style/Structure Analyzer (in DAS) flags:.', ''], ['Policy design smells.', ''], ['Use editor extensions (Cursor, VSCode, JetBrains).', ''], ['Add a Rego post-save hook // .cursor/rules.json { "onSave": ["opa fmt -w", "opa check --strict"] }.', ''], ['Then configure a custom linter rule using a regex:.', ''], ['Organizational best practice: Avoid wildcard imports.', ''], ['Always prefer small, explicit imports:.', ''], ['Recommended CI rule: Reject files containing unused imports.', ''], ['--format json | \\ jq -r \'.imports[] | select(.used == false) | .file + ":" + .path\').', ''], ['Opa inspect (which parses import graph).', ''], ['🧩 Summary — Best Way to Handle Rego Unused Imports Method Effectiveness Recommended opa fmt ❌ Does not remove unused imports Useful, but not enough...', ''], ['Cursor lint → opa fmt → opa check → CI lint w/ opa inspect → Styra Analyzer (optional).', ''], ['✅ What I Would Do (Best Practice) I would choose Option 2: Use the import explicitly, not rely on OPA’s global data-tree search.', ''], ['Because tests that depend on bare rule names (warn, deny, allow, audit, etc.) become:.', ''], ['Conflicting when multiple packages define the same rule.', ''], ['Answer: The warn reference comes from the data tree, not from the import.', ''], ['🔍 Full Explanation (What’s Happening Under the Hood) 1.', ''], ['Opa test services/opa/policies/ services/opa/tests/.', ''], ['Every .rego file from policies/ → into the data tree.', ''], ['This means all rule names become visible under data.*.', ''], ['OPA resolves warn like this:.', ''], ['Search the global data tree for any rule named warn.', ''], ['The import is unused because OPA never needs the alias tech_debt to find the rule.', ''], ['This is how critical bugs enter policy codebases.', ''], ['🧩 Therefore: Best Practice for Enterprise Codebases 📌 Always reference rules with namespaced imports.', ''], ['Never rely on bare rule names:.', ''], ['The import data.compliance.tech_debt on line 3 of tech_debt_r14_test.rego is unused.', ''], ['OPA loads all policy packages in /policies/**.', ''], ['So the rule warn is available at:.', ''], ['OPA resolves bare rule names by doing a global search in data.', ''], ['Bare rule names (warn) are ambiguous.', ''], ['Becomes ambiguous and OPA may:.', ''], ['OPA test behavior depends on all loaded policies.', ''], ['Implicit resolution is one of the most common sources of bugs in OPA deployments.', ''], ['This matches the pattern in your other test file (tech_debt_r15_test.rego) and is the correct...', ''], ['🧩 Best Practice for Enterprise Rego Test Suites Do NOT rely on bare rule names like: warn deny audit allow validate.', ''], ['❗ Never let OPA resolve a rule through the global data tree — always reference it explicitly.', ''], ['In test files, always use explicit package-qualified rule references:.', ''], ['Ambiguity Prevention: Multiple packages may define rules with common names (warn, deny, allow).', ''], ['Import rego.v1 import data.compliance.tech_debt # ← keep this.', ''], ['How your test diff strings are represented inside Rego test files.', ''], ['✔️ When using opa eval with JSON, your inputs contain: "+ // TODO:\\n+ function getUsers() {".', ''], ['…and OPA treats \\n as an actual newline because JSON escapes it as a newline character.', ''], ['Never see the newline, so they fail.', ''], ['__local3132__, __local3138__ variables suggest file.diff is not being accessed correctly in the test context.', ''], ['They are being accessed — the content is just different from what your rules assume.', ''], ['But your policy expects diff lines beginning with + or matching exact patterns that assume multi-line context.', ''], ['Same issue: Your rule expects:.', ''], ['OPA evaluates the Rego test literal as:.', ''], ['The pattern never matches because whitespace escaping does NOT behave like in JSON.', ''], ['🧠 Why direct opa eval --input JSON works.', ''], ['Because JSON → OPA decoding translates \\n into real newlines.', ''], ['Rego test files do NOT.', ''], ['🧩 Fix Options (Ranked Best → Acceptable) ✅ Best Fix: Convert test diff strings to multi-line Rego strings.', ''], ['Rego supports multi-line raw strings:.', ''], ['This will perfectly match the policy expectations.', ''], ['✅ Second Best Fix: Convert \\n to actual newline inside the test file.', ''], ['⚠️ Temporary Fix (Not recommended): Decode the string inside policy.', ''], ['But this will add noise to all rules.', ''], ['→ Fix the tests → Keep the policy pure → Avoid hacks in Rego logic → Use real multi-line diffs.', '']]
semantic_categories: [distribution, negation, observability, performance, testing]
digest: b6433a0a16f08b71c79173c9f4feaf1d11dbe1ef8436631eee846958265750f3
symbol_refs: []
semantic_role: architecture
:::
| Do | Don't |
| --- | --- |
| Metadata & Introspection: rego.metadata.rule, rego.metadata.chain. | Pitfall: contains is substring, not set membership (for that use in). |
| # All servers must be healthy all_healthy if { all([s.healthy | some s in input.servers]) }. | 6.24 Design Patterns & Anti-Patterns. |
| OPA has no direct a[1:3] slicing syntax; use array.slice. | Explain modes opa eval --explain=notes -d policy.rego -i input.json 'data.authz.allow' opa eval --explain=full ... |
| Rego sets are unordered, unique collections. | 7.9.1 The Case Sensitivity Trap. |
| Rego strings are Unicode text; built-ins operate on code points (not bytes). | Common Pitfalls: Variable Scoping & Safety 4.X Common Pitfalls: Variable Scoping & Safety. |
| # May not work in all OPA versions is_hex if regex.match(^[0-9a-fA-F]+$, input.value). | Pitfall 1: Accidental Variable Shadowing. |
| Best Practice: Always use double-quoted strings with escaped backslashes for regex patterns. | Pitfall 2: Unsafe Variables in Rules. |
| When to Use Raw Strings: - Test inputs containing multi-line content (file diffs, code blocks) - Regex patterns that need to match actual newline c... | A variable is unsafe if it’s used in a rule head or expression but not bound on all paths in the body. |
| Difference: to_* is generally more permissive; cast_* may be stricter (implementation details can vary by version—always verify against your target... | Pitfall 3: Misusing some in Comprehensions. |
| Always guard access to optional or potentially missing input fields:. | # ❌ Over-constrained: 'some i' appears twice, but you really wanted two different indices bad if { some i arr[i] == "a" some i arr[i] == "b" }. |
| Common Patterns: - Check is_string() before contains(), startswith(), endswith() - Check is_array() before iteration with some .. | Pitfall 4: Assuming Global State in Rules. |
| Never bake secrets into Rego source; pass via data or environment. | # ❌ Misleading mental model: this does not "increment" anything counter := counter + 1 if { .. |
| 6.14 This chapter catalogs core built-ins and corrects a few subtle points (arrays, JSON filtering, time, UUIDs/ULIDs). | Chapter 6 – Common Pitfalls: Nulls, Missing Fields, and Type Guards 6.X Common Pitfalls: Nulls, Missing Fields, and Type Guards. |
| Both arguments must be arrays. | Pitfall 1: Accessing Missing Fields Directly. |
| If either argument is null (or not an array), OPA raises a type error. | # ❌ Panics if input.user is null or missing email := input.user.email. |
| Important corrections:. | Pitfall 2: Null vs Missing vs Falsy. |
| There is no standard time.diff builtin in OPA. | Pitfall 3: Using array.concat on Non-Arrays. |
| Test_http_policy if { result := policy.check with http.send as mock_http_send }. | # ❌ Panics if path is null or not an array full := concat(".", array.concat(path, [field])). |
| Rego exposes rule metadata at evaluation time:. | Pitfall 4: Equality Checks with Mixed Types. |
| Rule_meta := rego.metadata.rule() # metadata of current rule chain_meta := rego.metadata.chain() # stack of rule metadata along evaluation chain. | # ❌ May silently fail if left/right have different types allowed if input.user.id == data.allowed_ids[_]. |
| Enrich decision logs with rule IDs, owners, severity. | Pitfall 5: Assuming in Works Like SQL for All Types. |
| Deny[msg] if { violation_condition m := rego.metadata.rule() msg := { "msg": "Violation detected", "rule_id": m.id, "owner": m.owner, } }. | Chapter 11 – Common Pitfalls: Performance Anti-Patterns 11.X Common Pitfalls: Performance Anti-Patterns. |
| Print is the primary debugging tool for Rego:. | Pitfall 1: Unbounded Linear Scans on Huge Collections. |
| Debug_rule if { x := input.value print("The value of x is:", x) x > 10 }. | # ❌ Potentially O(N) scan on large data set every request deny if { some i data.events[i].ip == input.client_ip }. |
| Output appears in OPA logs or opa eval --explain trace output depending on environment. | Pitfall 2: Heavy Regex in Hot Paths. |
| # If to_number fails, rule body is undefined is_valid if { n := to_number(input.score) n >= 0 }. | # ❌ Expensive regex on every request deny if re_match(".*(admin|root).*", input.user.name). |
| Opa eval --strict-builtin-errors ... | Pitfall 3: Recomputing the Same Expression Repeatedly. |
| Validation helpers: Make dedicated rules using type and conversion built-ins (is_valid_request, normalize_email) and reuse everywhere. | # ❌ Recomputes parse for each use deny if { re_match("admin", input.user.name) some p in data.profiles re_match("admin", input.user.name) # repeate... |
| Canonicalization: Always lowercase/trim user-identifiers before comparison. | Pitfall 4: Ignoring Partial Evaluation Opportunities. |
| Non-mocked time in tests: Using time.now_ns() directly in tests causes flakiness; always with time.now_ns as ... | # ❌ CLI call with huge static config in input opa eval -d policies/ -i big_config.json 'data.authz.allow'. |
| Chapter 7 – Testing, Debugging & Troubleshooting (From Hello-World to PhD) Testing is not an afterthought in Rego/OPA; it is the mechanism by which... | Pitfall 5: Overusing walk on Large Trees. |
| # All tests in current tree opa test . | # ❌ walk(data) over a huge universe deny if { some path, value walk(data, [path, value]) value == "secret" }. |
| # Verbose (see individual test names) opa test. | If [ -n "$unused" ]; then echo "❌ Unused imports detected:" echo "$unused" exit 1 fi. |
| # Specific path or file opa test policies/ authz_test.rego. | And the moment two rule names collide, OPA will throw a conflict or silently evaluate the wrong rule — both are terrible in production policy systems. |
| Override input test_non_admin_denied if { authz.allow with input as { "user": {"id": "bob", "roles": ["user"]}, "action": "delete", "resource": {"i... | Worse: OPA selects the wrong one depending on rule type. |
| # in policy: within_business_hours if { now := time.now_ns() [hour, _, _] := time.clock(now) hour >= 9 hour < 17 }. | 🧠 The Better Fix (What I Would Do) ❌ Instead of removing the import ✔️ Fix the test to use the import explicitly import data.compliance.tech_debt. |
| 7.3 Golden Tests & File I/O (Corrected). | ❌ But in Rego test files, a string such as: "diff": "+ // TODO:\n+ function getUsers() {". |
| Rego itself has no read_file builtin and cannot perform file I/O. All file reading is handled by the test harness (shell, Go, Python, etc.). |  |
| Populate data.tests["pr_large"] before invoking opa test or the OPA SDK. |  |
| Rego: pure data and rules; no file system. |  |
| A critical distinction exists between how string literals are interpreted in JSON inputs versus Rego test files. |  |
| JSON Input (via opa eval --input):. |  |
| In JSON, \n is interpreted as an actual newline character during JSON parsing. |  |
| Rego Test File (inline string literal):. |  |
| In Rego test files, \n within double-quoted strings is treated as a literal two-character sequence: backslash followed by 'n'. |  |
| Symptoms: - Tests fail with opa test but pass with opa eval --input <json-file> - Regex patterns that work with JSON inputs fail in test files - Mu... |  |
| Best Practice: When testing policies that process multi-line content (diffs, code, logs), always use raw strings in test files to match the behavio... |  |
| The evaluation context of with clauses in tests can affect how rule results are accessed. |  |
| When a rule returns a set (partial rule with contains), accessing elements requires proper iteration:. |  |
| 7.8.3 Rule Precedence and Overlapping Conditions. |  |
| When multiple rules can match the same input, understanding evaluation order is critical for test design. |  |
| Problem: Overlapping Rule Conditions. |  |
| Best Practice: Design tests to verify policy behavior (what warnings are produced) rather than implementation details (which specific rule triggered). |  |
| String matching functions in Rego are case-sensitive, which can cause test failures when test inputs don't match policy expectations. |  |
| Option 2: Policy-Level Normalization (Recommended for Production). |  |
| Option 3: Explicit Case Variants in Policy. |  |
| Best Practice: For production policies, prefer normalization (Option 2) to handle case variations gracefully. |  |
| Decision rule: data.envoy.authz.allow. |  |
| Bundles: main: service: policy resource: /bundles/crm-main.tar.gz polling: min_delay_seconds: 10 max_delay_seconds: 60 OPA periodically pulls bundl... |  |
| Allow if { base_allow not data.tenants[input.tenant_id].deny_all } Canary rollout: Serve new bundle under /bundles/crm-main-canary.tar.gz to subset... |  |
| Allow if { _is_admin(input.user) input.request.method == "GET" } Rule organization Top of file: Package. |  |
| Name: Install OPA run: | curl -L -o opa https://openpolicyagent.org/downloads/latest/opa_linux_amd64 chmod +x opa sudo mv opa /usr/local/bin/opa. |  |
| Name: Check formatting run: opa fmt --fail . |  |
| Name: Lint (Regal) run: regal lint --format=github. |  |
| Use Rego-specific patterns (no inline comprehensions in allow/deny, etc.) in your rules system. |  |
| # Slow pattern deny[msg] if { some u in data.users u.id == input.user_id not u.active msg := "User is inactive" } Instead, structure data.users as ... |  |
| # Build a WebAssembly module for a specific entrypoint opa build -t wasm -e 'data.authz.allow' policies/. |  |
| # Build a bundle for a specific entrypoint without WASM opa build -e 'data.authz.allow' policies/. |  |
| An optimized bundle (policy + data),. |  |
| Suitable for the standard OPA runtime, with partial eval already applied for that entrypoint. |  |
| Opa eval --partial \ -d policies/ \ 'data.authz.allow'. |  |
| Returns residual policy expressions capturing unknowns,. |  |
| Opa build -t wasm .. |  |
| Opa build .. |  |
| Opa eval --partial .. |  |
| Require that cycles with negation are disallowed or handled carefully. |  |
| Key points: P^'is smaller and more specialized. |  |
| Chapter 13 – Multi-Layer Policy Architecture Multi-layer policy architecture is how you scale from one clever Rego file to hundreds of policy owner... |  |
| __meta__ := { "rule_id": "ACCT_001", "owner": "team-crm-platform", "service": "accounts-api", "layer": "domain", "severity": "BLOCK", # BLOCK | OVE... |  |
| Deny[msg] if { input.account.status == "closed" input.action == "reopen" msg := { "rule_id": __meta__.rule_id, "owner": __meta__.owner, "msg": "Clo... |  |
| __meta__ := { "rule_id": "NET_001", "layer": "global", "severity": "BLOCK", "owner": "sec-net", }. |  |
| Effects[eff] if { eff := data.svc.accounts.rules.effects[_] }. |  |
| Result := { "allow": allow, "effects": all_effects, } if { all_effects := [e | e := effects[_]]. |  |
| # Fallback: if no BLOCK denies, then allow if explicit allow exists or default rules say so. |  |
| Allow_flag := some e in all_effects { e.effect == "allow" } } You can refine this by: • Picking highest-ranked deny by layer rank. |  |
| Allow if { base_allow not tenant_extra_deny[_] } This gives global → domain final say on allow, and tenant extra ways to say “no.” ________________... |  |
| # decision doc decision := { "allow": allow, "trace_id": trace_id, } ________________________________________ 14.4 PII and Redaction in Logs Golden... |  |
| OPA is logically stateless: every evaluation sees a snapshot of policy + data. |  |
| OPA never mutates data.state.login_counts. |  |
| Or an in-memory structure via the OPA Go SDK,. |  |
| Or a shared cache that OPA reads from. |  |
| OPA Policy → reads data.state.* as a pure input. |  |
| OPA remains a pure decision engine; all state transitions happen outside. |  |
| OPA uses that state to decide: o Allow or deny new events. |  |
| Allow if { count(violations) == 0 } ________________________________________ Data Policy Models & GraphQL Costing. |  |
| 16.2 Field Cost Calculation (Corrected array.concat). |  |
| Corrections and nuances:. |  |
| If either argument is null or non-array, OPA throws a type error, so in more defensive code:. |  |
| • Allows multiple services to enforce the same logic. |  |
| Test_admin_can_read if { authz.allow with input as {"user": "alice", "role": "admin"} } Run: opa test . |  |
| The full decision path for a typical OPA evaluation looks like this:. |  |
| Flowchart LR A[Client / Service] -->|HTTP/SDK| B[OPA] B --> C[Parse & Compile Policies] C --> D[Load Data Bundles] D --> E[Evaluate Query] E --> F[... |  |
| Flowchart TD R[Request: input] --> OPA[OPA Engine]. |  |
| Subgraph Policy Lifecycle P[Parse Rego] --> Q[Compile to IR] Q --> PE[Optional: Partial Eval] end. |  |
| OPA --> P PE --> D1[Optimized Policy Set]. |  |
| OPA can be deployed in three canonical modes: sidecar, central service, and embedded. |  |
| Flowchart LR subgraph Sidecar Mode A1[App Pod] --- O1[OPA Sidecar] end. |  |
| Subgraph Central Service A2[Apps / Gateways] --> O2[OPA Cluster] end. |  |
| Subgraph Embedded Library A3[App Process with OPA SDK] end. |  |
| 8.X.1 Sidecar Mode flowchart LR SVC[Service Container] -->|localhost:8181 /v1/data/...| OPA[OPA Sidecar]. |  |
| B[BUNDLE Server] --> OPA. |  |
| Each app pod has its own OPA. |  |
| 8.X.2 Central Policy Service flowchart LR GW[API Gateway] -->|batched queries| OPA_CLUSTER[Central OPA] AUTH[IdP / Token Service] --> GW B[BUNDLE S... |  |
| One or a few OPA instances serve many clients. |  |
| 8.X.3 Embedded OPA flowchart LR APP[Application Process] -->|in-process call| LIB[OPA SDK / WASM] B[BUNDLE Source] --> APP. |  |
| OPA compiled to WASM or linked via Go library. |  |
| Chapter 13 – Multi-Layer Policy Architecture Visualization 13.X Multi-Layer Policy Stack flowchart TB G[Global Layer\n(org-wide baselines)] --> D[D... |  |
| Global: Non-negotiable baselines (e.g., MFA required, PII rules, legal holds). |  |
| # Domain: EU requires additional consent domain_deny[reason] if { input.region == "eu" not input.user.consented reason := "Domain(EU): consent requ... |  |
| # Team: service-specific checks team_deny[reason] if { input.service == "billing" not input.user.roles[_] == "billing_admin" reason := "Team(Billin... |  |
| Deny[reason] := reason if { some r r := global_deny[r] # global always first } or { some r r := domain_deny[r] } or { some r r := team_deny[r] }. |  |
| Chapter 14 – Decision Log Flow Diagram 14.X Decision Log Pipeline flowchart LR REQ[Incoming Request] --> OPA[OPA] OPA --> DEC[Decision Response] OP... |  |
| Metrics (eval time, number of rules evaluated). |  |
| Bundle/ ├── .manifest ├── policies/ │ ├── authz.rego │ ├── jwt.rego │ └── resources.rego └── data/ ├── config.json └── tenants/ ├── tenant-1.json └... |  |
| Revision is an opaque version string for debugging/rollback. |  |
| Roots tell OPA which prefixes in data this bundle owns:. |  |
| Authz → data.authz.* (from authz.rego). |  |
| # Layer rules return {allow: bool, reasons: [string]} global_decision := {"allow": allow, "reasons": reasons} { deny_reasons := {r | some r r := gl... |  |
| # Check if user has required role for a field field_allowed([path, field]) if { full := concat(".", array.concat(path, [field])) required := data.g... |  |
| Chapter 17 – Full LLM → OPA Workflow with Validation 17.X Architecture Diagram flowchart LR REQ[User / Dev Describes Policy] --> LLM[LLM / Copilot]... |  |
| Syntactic checks: opa fmt, opa check. |  |
| Unit tests: opa test. |  |
| Static analysis: internal style & safety rules. |  |
| Staging OPA: run candidate policy against recorded traffic (shadow mode). |  |
| Candidate Rego (generated by LLM):. |  |
| Run opa fmt → ensure style. |  |
| Run opa check → catch unknown refs, unsafe vars. |  |
| Run opa test → ensure behavior matches expectations. |  |
| Rego’s scoping rules are simple but unforgiving. |  |
| # ❌ Unsafe: r is not always bound deny[r] if { input.violations[_] == v v.level == "HIGH" r := v.reason } else { # no binding for r here }. |  |
| Use opa check to detect this and refactor to ensure all head variables are always bound:. |  |
| # ✅ r always derived from same comprehension deny[r] if { r := v.reason some v in input.violations v.level == "HIGH" }. |  |
| Some x introduces a new variable local to the current expression. |  |
| # ✅ Clear indices good if { some i arr[i] == "a" some j arr[j] == "b" }. |  |
| Each rule evaluation is pure and has no hidden global state. |  |
| Rego is strict about types, but JSON inputs are often messy. |  |
| Always guard when reading from untrusted inputs:. |  |
| # ✅ Safe pattern with guards user_email := email if { is_object(input.user) is_string(input.user.email) email := input.user.email }. |  |
| If input.user.id is a number and data.allowed_ids are strings, this will never match. |  |
| Performance problems in OPA usually come from data modeling and unbounded searches, not from individual built-ins. |  |
| # ✅ Precompute static parts into a bundle or WASM opa build -e 'data.authz.allow' policies/. |  |
| # ✅ Narrowed search deny if { some path, value walk(data.tenants, [path, value]) value == "secret" }. |  |
| Use opa fmt --skip-constraints (most reliable built-in). |  |
| Opa fmt removes unused aliases but NOT unused imports. |  |
| If u is never referenced, opa fmt will not remove it. |  |
| Some versions of opa fmt will rewrite it to:. |  |
| …and will not remove it. |  |
| Use opa check --strict. |  |
| Opa check --strict . |  |
| Use Rego Linter Plugins (best solution). |  |
| This is the closest to ESLint/flake8 for Rego. |  |
| Use Styra DAS Rego Analyzer (if enterprise budget exists). |  |
| Styra’s Rego Style/Structure Analyzer (in DAS) flags:. |  |
| Policy design smells. |  |
| Use editor extensions (Cursor, VSCode, JetBrains). |  |
| Add a Rego post-save hook // .cursor/rules.json { "onSave": ["opa fmt -w", "opa check --strict"] }. |  |
| Then configure a custom linter rule using a regex:. |  |
| Organizational best practice: Avoid wildcard imports. |  |
| Always prefer small, explicit imports:. |  |
| Recommended CI rule: Reject files containing unused imports. |  |
| --format json | \ jq -r '.imports[] | select(.used == false) | .file + ":" + .path'). |  |
| Opa inspect (which parses import graph). |  |
| 🧩 Summary — Best Way to Handle Rego Unused Imports Method Effectiveness Recommended opa fmt ❌ Does not remove unused imports Useful, but not enough... |  |
| Cursor lint → opa fmt → opa check → CI lint w/ opa inspect → Styra Analyzer (optional). |  |
| ✅ What I Would Do (Best Practice) I would choose Option 2: Use the import explicitly, not rely on OPA’s global data-tree search. |  |
| Because tests that depend on bare rule names (warn, deny, allow, audit, etc.) become:. |  |
| Conflicting when multiple packages define the same rule. |  |
| Answer: The warn reference comes from the data tree, not from the import. |  |
| 🔍 Full Explanation (What’s Happening Under the Hood) 1. |  |
| Opa test services/opa/policies/ services/opa/tests/. |  |
| Every .rego file from policies/ → into the data tree. |  |
| This means all rule names become visible under data.*. |  |
| OPA resolves warn like this:. |  |
| Search the global data tree for any rule named warn. |  |
| The import is unused because OPA never needs the alias tech_debt to find the rule. |  |
| This is how critical bugs enter policy codebases. |  |
| 🧩 Therefore: Best Practice for Enterprise Codebases 📌 Always reference rules with namespaced imports. |  |
| Never rely on bare rule names:. |  |
| The import data.compliance.tech_debt on line 3 of tech_debt_r14_test.rego is unused. |  |
| OPA loads all policy packages in /policies/**. |  |
| So the rule warn is available at:. |  |
| OPA resolves bare rule names by doing a global search in data. |  |
| Bare rule names (warn) are ambiguous. |  |
| Becomes ambiguous and OPA may:. |  |
| OPA test behavior depends on all loaded policies. |  |
| Implicit resolution is one of the most common sources of bugs in OPA deployments. |  |
| This matches the pattern in your other test file (tech_debt_r15_test.rego) and is the correct... |  |
| 🧩 Best Practice for Enterprise Rego Test Suites Do NOT rely on bare rule names like: warn deny audit allow validate. |  |
| ❗ Never let OPA resolve a rule through the global data tree — always reference it explicitly. |  |
| In test files, always use explicit package-qualified rule references:. |  |
| Ambiguity Prevention: Multiple packages may define rules with common names (warn, deny, allow). |  |
| Import rego.v1 import data.compliance.tech_debt # ← keep this. |  |
| How your test diff strings are represented inside Rego test files. |  |
| ✔️ When using opa eval with JSON, your inputs contain: "+ // TODO:\n+ function getUsers() {". |  |
| …and OPA treats \n as an actual newline because JSON escapes it as a newline character. |  |
| Never see the newline, so they fail. |  |
| __local3132__, __local3138__ variables suggest file.diff is not being accessed correctly in the test context. |  |
| They are being accessed — the content is just different from what your rules assume. |  |
| But your policy expects diff lines beginning with + or matching exact patterns that assume multi-line context. |  |
| Same issue: Your rule expects:. |  |
| OPA evaluates the Rego test literal as:. |  |
| The pattern never matches because whitespace escaping does NOT behave like in JSON. |  |
| 🧠 Why direct opa eval --input JSON works. |  |
| Because JSON → OPA decoding translates \n into real newlines. |  |
| Rego test files do NOT. |  |
| 🧩 Fix Options (Ranked Best → Acceptable) ✅ Best Fix: Convert test diff strings to multi-line Rego strings. |  |
| Rego supports multi-line raw strings:. |  |
| This will perfectly match the policy expectations. |  |
| ✅ Second Best Fix: Convert \n to actual newline inside the test file. |  |
| ⚠️ Temporary Fix (Not recommended): Decode the string inside policy. |  |
| But this will add noise to all rules. |  |
| → Fix the tests → Keep the policy pure → Avoid hacks in Rego logic → Use real multi-line diffs. |  |
:::

::: qa
id: QA-6d360af85dc91dcf
chapter: CH-05
q: What is Multiple expressions in a rule body in the context of Rego/OPA?
a: ```rego allow if { input.user.role == "admin" # Must be true AND input.user.active == true # Must be true AND input.resource.sensitive == false # Must be true } ```
reference: TERM-b522fb509bee52d0
digest: 5378ba12945e5c21acec2ccd9ccc47d988331bd054ff0dbeb6e14abfb2790316
symbol_refs: []
semantic_role: explanation
:::
:::

::: qa
id: QA-f5cf7ef0c45b36b7
chapter: CH-05
q: What is 6.2 Built-in Function Categories (Overview). in the context of Rego/OPA?
a: 6.2 Built-in Function Categories (Overview)
reference: BLK-ef0eb00e6bda8ba3
digest: c773cd8df0c38273142395dbf049b80ba35c441078f96c5c950270efcc2c76e1
symbol_refs: []
semantic_role: explanation
:::
:::

::: reasoning-chain
id: CHAIN-0ce2a2bf9dd58daf
chapter: CH-05
qa_id: QA-6d360af85dc91dcf
reference: TERM-b522fb509bee52d0
semantic_categories: [truth-values]
digest: f76fb846b0a6db687230f0f46636f39af9583cff5a93921ba7e4547058398165
symbol_refs: []
semantic_role: content
:::
- Read the question carefully.
- Recall the relevant definition or rule.
- Match the question scenario to the rule.
- Consider edge cases (e.g., undefined vs false).
- Summarize the conclusion clearly.
:::

::: role-note
id: ROLE-c7a31b3503b589a9
chapter: CH-05
role: Policy Author
guidance: Focus on correctness & clarity of rules in this chapter.
digest: e5f5610a7e5cbc9fb4afd8ad097c29cc8c855836199ff142159f8edb5a9a5b36
symbol_refs: []
semantic_role: content
:::
:::

::: diagram
id: DIAG-a658e81e493859cb
chapter: CH-05
language: ascii
diagram_type: diagram
summary: diagram diagram
nodes: []
edges: []
normalized_content: 
digest: a33b5fac8a1f26c217ed50c22692724b27fbb65699a95f76357837ee0eded1cf
symbol_refs: []
semantic_role: visualization
embedding_hint_importance: medium
embedding_hint_scope: local
embedding_hint_chunk: auto
:::
# ✅ CORRECT: Raw string for multi-line test data
test_diff_parsing if {
    diff_content := `+ // TODO: Fix issue
+ function implementation() {`
    # Contains actual newline between lines
    
    mock_input := {"diff": diff_content}
    # Policy regex patterns can now match newlines correctly
}

# ❌ PROBLEMATIC: Double-quoted string with \n literal
test_diff_parsing if {
    diff_content := "+ // TODO: Fix issue\n+ function implementation() {"
    # \n is literal backslash + 'n', NOT a newline
    # Regex patterns expecting newlines will fail
}
:::

::: diagram
id: DIAG-5b5a5ff15f029eaf
chapter: CH-05
language: ascii
diagram_type: diagram
summary: diagram diagram
nodes: []
edges: []
normalized_content: 
digest: 6f36f21d43d5aca5dd681bd835d5b2760abf076aa574032ef0bad0fa4d6ce962
symbol_refs: []
semantic_role: visualization
embedding_hint_importance: medium
embedding_hint_scope: local
embedding_hint_chunk: auto
:::
{
  "diff": "+ // TODO:\n+ function getUsers() {"
}
:::

::: diagram
id: DIAG-3ee6e81678baa6a8
chapter: CH-05
language: ascii
diagram_type: diagram
summary: diagram diagram
nodes: []
edges: []
normalized_content: 
digest: 62546e2bbc6bfa0924828399730f6dcd6e598d8e4bcddaaad5c526558cfd30fb
symbol_refs: []
semantic_role: visualization
embedding_hint_importance: medium
embedding_hint_scope: local
embedding_hint_chunk: auto
:::
test_example if {
    mock_input := {"diff": "+ // TODO:\n+ function getUsers() {"}
    # \n here is literal: backslash + 'n', NOT a newline
}
:::

::: diagram
id: DIAG-58fbbb6531000c82
chapter: CH-05
language: ascii
diagram_type: diagram
summary: diagram diagram
nodes: []
edges: []
normalized_content: 
digest: b91fd16cc8b66447f4f357b282d651eb415386d4bd054f9918f6ad845ceff440
symbol_refs: []
semantic_role: visualization
embedding_hint_importance: medium
embedding_hint_scope: local
embedding_hint_chunk: auto
:::
# Policy expects actual newline
regex.match("TODO:\\s*\\n", file.diff)  # Fails in tests with \n literal

# Test input with \n literal
"diff": "+ // TODO:\n+ function()"  # Contains literal "\n", not newline
:::

::: diagram
id: DIAG-3b2b07639a5f7865
chapter: CH-05
language: ascii
diagram_type: diagram
summary: diagram diagram
nodes: []
edges: []
normalized_content: 
digest: b6c94b8bbecb42280cf5306cbe940d708919ab69be7e1b563afc6db1f4694384
symbol_refs: []
semantic_role: warning
embedding_hint_importance: medium
embedding_hint_scope: local
embedding_hint_chunk: auto
:::
# ✅ CORRECT: Raw string preserves actual newlines
test_todo_with_newline if {
    diff_content := `+ // TODO:
+ function getUsers() {`
    
    mock_input := {"changed_files": [{
        "path": "file.ts",
        "diff": diff_content
    }]}
    
    # Policy regex now matches correctly
    warnings := policy.warn with input as mock_input
    count(warnings) >= 1
}
:::

::: diagram
id: DIAG-dfbdeb8fe429a0c2
chapter: CH-05
language: ascii
diagram_type: diagram
summary: diagram diagram
nodes: []
edges: []
normalized_content: 
digest: 8fc9749a5432dbf278450b5021134493b71a522ba58d2e1ae78f866c02488af2
symbol_refs: []
semantic_role: reference
embedding_hint_importance: medium
embedding_hint_scope: local
embedding_hint_chunk: auto
:::
# Policy has two rules that can both match:
# R15-W02: Meaningful TODO not logged (general check)
# R15-W03: TODO added without reference (specific check for +.*TODO:)

# Both rules check:
# - has_meaningful_todo_keywords(file)
# - not has_tech_debt_reference(file)
# R15-W03 also checks: regex.match("\\+.*TODO:", file.diff)
:::

::: diagram
id: DIAG-203f84dfe465d870
chapter: CH-05
language: ascii
diagram_type: diagram
summary: diagram diagram
nodes: []
edges: []
normalized_content: 
digest: bb445a3ebd297b2e2c8cab31730bc046e26ffcf6dc68ed8f908eb01e7faf45d2
symbol_refs: []
semantic_role: warning
embedding_hint_importance: medium
embedding_hint_scope: local
embedding_hint_chunk: auto
semantic_categories: [testing]
:::
# ✅ CORRECT: Test for either rule, or check for common message pattern
test_meaningful_todo_not_logged if {
    mock_input := {"changed_files": [{
        "diff": "+ // TODO: Fix issue (workaround)"
    }]}
    
    warnings := policy.warn with input as mock_input
    count(warnings) >= 1
    
    # Check for message pattern common to both rules
    some warning in warnings
    contains(warning, "meaningful TODO/FIXME")
    contains(warning, "tech-debt.md")
}

# ❌ FRAGILE: Testing for specific rule ID
test_specific_rule if {
    # This may fail if rule precedence changes
    # or if a more specific rule triggers first
}
:::

::: diagram
id: DIAG-2a39a10520ec912e
chapter: CH-05
language: ascii
diagram_type: diagram
summary: diagram diagram
nodes: []
edges: []
normalized_content: 
digest: 1ef3fd1a0826a14094e3dacee3db840eb886ac67f74e19bb09e166e0c60b2339
symbol_refs: []
semantic_role: warning
embedding_hint_importance: medium
embedding_hint_scope: local
embedding_hint_chunk: auto
:::
# Policy checks for lowercase "temporary"
has_meaningful_todo_keywords(file) if {
    contains(file.diff, "FIXME:")
    contains(file.diff, "temporary")  # Lowercase required
}

# ❌ TEST FAILS: Test uses "Temporary" (capital T)
test_example if {
    mock_input := {"diff": "+ // FIXME: Temporary hack"}
    # Policy doesn't match "Temporary" (capital T)
    # Test expects warning but gets none
}

# ✅ TEST PASSES: Test uses "temporary" (lowercase)
test_example if {
    mock_input := {"diff": "+ // FIXME: temporary hack"}
    # Policy matches "temporary" correctly
}
:::

::: diagram
id: DIAG-d27a8f07fb101aa7
chapter: CH-05
language: ascii
diagram_type: diagram
summary: diagram diagram
nodes: []
edges: []
normalized_content: 
digest: 5efb444059955d2c4b2f406f4207a475441934e987d1ae78190b3f9a4c1b4800
symbol_refs: []
semantic_role: visualization
embedding_hint_importance: medium
embedding_hint_scope: local
embedding_hint_chunk: auto
:::
# Normalize keywords in test inputs to match policy expectations
test_example if {
    # Use lowercase to match policy checks
    mock_input := {"diff": "+ // FIXME: temporary hack"}
    # ...
}
:::

::: test-hint
id: TEST-1e8f37bdbcac526b
chapter: CH-05
source_id: CODE-a23e9086072f5ce3
digest: af87b30ab7a30af25a44b9b5ba4b3656b71d38b9197f2bec57858a161a0b96f3
symbol_refs: []
semantic_role: content
:::
Convert this snippet into a unit test by constructing input and asserting allow/deny.
:::

::: uncertainty
id: UNCERT-d28f2f165c62dac0
chapter: CH-05
source_id: TERM-61b8c1a83d1cdbdd
digest: 66725fd14c5476d928a9551433545c96f7df74009cc367a6c62e1511aa4d9814
symbol_refs: []
semantic_role: content
:::
This content may have ambiguous or context-dependent interpretation.
:::

::: section-meta
id: SECMETA-df291acabf6ba89a
title: 5.1 Logical Conjunction (AND)
level: 3
chapter: CH-05
parent_section: None
line_no: 1021
digest: a9f4024be8baab3bcd8ef927df2cd6a48600bf3d69e1ca8f46e436d5c07a43da
symbol_refs: []
semantic_role: structure
token_range: (1021, 1021)
char_offset: (81600, 81629)
source_ref: {'line': 1021, 'column': 0}
embedding_hint_importance: low
embedding_hint_scope: local
embedding_hint_chunk: auto
:::
:::

::: pattern
id: PATTERN-acaafdb314522854
name: use count for guardrails:
description: Pattern: Use count for guardrails:
category: generic
chapter: CH-05
pattern_type: conceptual
digest: 3f7cbba943fdc3bd9c0bcddab777c1d516470ce8f74348f32db030d094b77490
symbol_refs: [use count for guardrails:]
semantic_role: pattern
embedding_hint_importance: low
embedding_hint_scope: local
embedding_hint_chunk: auto
:::
Pattern: Use count for guardrails:
:::

::: pattern
id: PATTERN-b81bfed5cf7205a0
name: prefer sets for membership:
description: Performance pattern: Prefer sets for membership:
category: generic
chapter: CH-05
pattern_type: conceptual
digest: 809312db0fffc20064cfea87963de65b15c389c92e4e6c16eb8cc6719fceff65
symbol_refs: [prefer sets for membership:]
semantic_role: pattern
embedding_hint_importance: low
embedding_hint_scope: local
embedding_hint_chunk: auto
:::
Performance pattern: Prefer sets for membership:
:::

::: pattern
id: PATTERN-91cc7814e0bc3fbf
name: defensive guards before deeper logic:
description: Pattern: Defensive guards before deeper logic:
category: generic
chapter: CH-05
pattern_type: conceptual
digest: 9dd25029b528124f50ad175724d52f55ace15a482ad6e100c63c18076f42f92e
symbol_refs: [defensive guards before deeper logic:]
semantic_role: pattern
embedding_hint_importance: low
embedding_hint_scope: local
embedding_hint_chunk: auto
:::
Pattern: Defensive guards before deeper logic:
:::

::: pattern
id: PATTERN-f556c9b66fafbb39
name: combine strict mode in tests with non-strict mode in production, or vice versa, depending on risk posture.
description: Pattern: Combine strict mode in tests with non-strict mode in production, or vice versa, depending on risk posture.
category: generic
chapter: CH-05
pattern_type: conceptual
digest: bcca16561bdd12ba72aadb8c8083211c8bea539c5f1b831c8518c6dc3dc5d0db
symbol_refs: [combine strict mode in tests with non-strict mode in production, or vice versa, depending on risk posture.]
semantic_role: pattern
embedding_hint_importance: low
embedding_hint_scope: local
embedding_hint_chunk: auto
:::
Pattern: Combine strict mode in tests with non-strict mode in production, or vice versa, depending on risk posture.
:::

::: pattern
id: PATTERN-92bc59ecda5c846e
name: Multiple Assertions
description: **Pattern for Multiple Assertions:**
category: generic
chapter: CH-05
pattern_type: conceptual
digest: bdd9b06a0d4ee762ce624b4d8298dfa3e27bc6b76808117cdab51c16a29246b2
symbol_refs: [Multiple Assertions]
semantic_role: pattern
embedding_hint_importance: low
embedding_hint_scope: local
embedding_hint_chunk: auto
:::
**Pattern for Multiple Assertions:**
:::

::: pattern
id: PATTERN-00f465586b86e538
name: •	global policies: package global.*
description: Chapter 13 – Multi-Layer Policy Architecture
Multi-layer policy architecture is how you scale from one clever Rego file to hundreds of policy owners, bundles, and tenants without descending into chaos.
At scale, you need:
•	Layers: global → domain → team → tenant.
•	Ownership metadata: who owns what, and how severe is it.
•	Override semantics: how do layers combine, and who wins on conflict.
________________________________________
13.1 Layer Model: Global → Domain → Team → Tenant
Think of policies as a stack of overlays:
1.	Global Baseline (Organization Level)
o	Owned by: security/compliance.
o	Guarantees non-negotiable invariants:
	“No public S3 buckets”
	“All admin actions must be audited”
o	Usually has the highest precedence for denies (security wins).
2.	Domain Policies (Product / Platform Level)
o	Example domains:
	crm.*, billing.*, identity.*.
o	Define domain-specific invariants:
	“An Opportunity must have an associated Account”
	“A Subscription must have a plan and billing cycle”
3.	Team / Service Policies
o	Local teams add guardrails and UX-level rules:
	“This API must include X-Request-Id”
	“This microservice cannot call that microservice directly”
4.	Tenant Overlays (Customer-Specific)
o	Per-tenant exceptions and configuration:
	“Tenant A enforces stricter password rules”
	“Tenant B has a special approval workflow”
OPA sees all of these as data + Rego modules merged into a single virtual data tree.
________________________________________
13.2 Encoding Layers in Data and Packages
One robust pattern:
•	Global policies: package global.*
•	Domains: package domain.<name>.*
•	Teams/services: package svc.<service_name>.*
•	Tenant overlays: data.tenants[tenant_id].*
Example structure:
policies/
  global/
    baseline.rego          # package global.baseline
  crm/
    authz.rego             # package domain.crm.authz
    schema.rego            # package domain.crm.schema
  svc/
    accounts.rego          # package svc.accounts.rules
  tenants/
    123/
      overrides.json       # data.tenants["123"]
    456/
      overrides.json
________________________________________
13.3 Policy Ownership Metadata
Every rule that matters should be self-describing.
You can store metadata as:
•	A dedicated rule (__meta__)
•	Rego annotations (via rego.metadata.rule())
•	Comments (less machine-friendly)
Example:
package crm.policies.account_lifecycle
category: architecture
chapter: CH-05
pattern_type: conceptual
digest: 41a3e402102e7c311cee6ca7ebab691161e6a76271b64bd9c0eb47ad7d12a70a
symbol_refs: [•	global policies: package global.*]
semantic_role: architecture
embedding_hint_importance: low
embedding_hint_scope: local
embedding_hint_chunk: auto
semantic_categories: [distribution]
:::
Chapter 13 – Multi-Layer Policy Architecture
Multi-layer policy architecture is how you scale from one clever Rego file to hundreds of policy owners, bundles, and tenants without descending into chaos.
At scale, you need:
•	Layers: global → domain → team → tenant.
•	Ownership metadata: who owns what, and how severe is it.
•	Override semantics: how do layers combine, and who wins on conflict.
________________________________________
13.1 Layer Model: Global → Domain → Team → Tenant
Think of policies as a stack of overlays:
1.	Global Baseline (Organization Level)
o	Owned by: security/compliance.
o	Guarantees non-negotiable invariants:
	“No public S3 buckets”
	“All admin actions must be audited”
o	Usually has the highest precedence for denies (security wins).
2.	Domain Policies (Product / Platform Level)
o	Example domains:
	crm.*, billing.*, identity.*.
o	Define domain-specific invariants:
	“An Opportunity must have an associated Account”
	“A Subscription must have a plan and billing cycle”
3.	Team / Service Policies
o	Local teams add guardrails and UX-level rules:
	“This API must include X-Request-Id”
	“This microservice cannot call that microservice directly”
4.	Tenant Overlays (Customer-Specific)
o	Per-tenant exceptions and configuration:
	“Tenant A enforces stricter password rules”
	“Tenant B has a special approval workflow”
OPA sees all of these as data + Rego modules merged into a single virtual data tree.
________________________________________
13.2 Encoding Layers in Data and Packages
One robust pattern:
•	Global policies: package global.*
•	Domains: package domain.<name>.*
•	Teams/services: package svc.<service_name>.*
•	Tenant overlays: data.tenants[tenant_id].*
Example structure:
policies/
  global/
    baseline.rego          # package global.baseline
  crm/
    authz.rego             # package domain.crm.authz
    schema.rego            # package domain.crm.schema
  svc/
    accounts.rego          # package svc.accounts.rules
  tenants/
    123/
      overrides.json       # data.tenants["123"]
    456/
      overrides.json
________________________________________
13.3 Policy Ownership Metadata
Every rule that matters should be self-describing.
You can store metadata as:
•	A dedicated rule (__meta__)
•	Rego annotations (via rego.metadata.rule())
•	Comments (less machine-friendly)
Example:
package crm.policies.account_lifecycle
:::

::: pattern
id: PATTERN-eeb5c30a9b540572
name: package authz
description: allow_flag := some e in all_effects { e.effect == "allow" }
}
You can refine this by:
•	Picking highest-ranked deny by layer rank.
•	Allowing tenant to tighten, but never to weaken global invariants.
________________________________________
13.5 Tenant Overlays and Safe Customization
Tenant-specific rules should be additive and tightening, not weakening:
•	Allowed:
o	Tenant can restrict their own behavior further.
•	Forbidden:
o	Tenant cannot bypass global security invariants.
Pattern:
package authz
category: generic
chapter: CH-05
pattern_type: conceptual
digest: 2a87e13595467973f95fc1543dcb695fe117e3b8cb74d2411e44e7fc7e2fcab2
symbol_refs: [package authz]
semantic_role: pattern
embedding_hint_importance: low
embedding_hint_scope: local
embedding_hint_chunk: auto
:::
allow_flag := some e in all_effects { e.effect == "allow" }
}
You can refine this by:
•	Picking highest-ranked deny by layer rank.
•	Allowing tenant to tighten, but never to weaken global invariants.
________________________________________
13.5 Tenant Overlays and Safe Customization
Tenant-specific rules should be additive and tightening, not weakening:
•	Allowed:
o	Tenant can restrict their own behavior further.
•	Forbidden:
o	Tenant cannot bypass global security invariants.
Pattern:
package authz
:::

::: pattern
id: PATTERN-27d0f036b9933e43
name: package authz
description: allow if {
  base_allow
  not tenant_extra_deny[_]
}
This gives global → domain final say on allow, and tenant extra ways to say “no.”
________________________________________
Chapter 14 – Observability & Audit
OPA is not only a decision engine; it’s an evidence generator. Observability and audit are how you prove that decisions are:
•	Correct
•	Consistent
•	Explainable
•	Compliant with regulation
________________________________________
14.1 Decision Logs
Every OPA decision should be treatable as a replayable event:
Minimum recommended fields:
•	decision_id (UUID)
•	timestamp
•	path (e.g., data.authz.allow)
•	input_hash or input (with PII scrubbing)
•	result (decision doc: allow/deny/effects)
•	bundle_revision
•	metrics (evaluation time, rule count)
•	correlation_id (to tie into tracing)
Conceptual log:
{
  "decision_id": "3f7b9b1a-0ee2-4e52-9f39-4edb8b6a3a01",
  "timestamp": "2025-12-05T10:02:45Z",
  "path": "data.authz.allow",
  "input_hash": "sha256:abcd...",
  "result": {
    "allow": false,
    "effects": [
      {
        "effect": "deny",
        "rule_id": "ACCT_001",
        "layer": "domain",
        "msg": "Closed accounts cannot be reopened"
      }
    ]
  },
  "bundle_revision": "git:1234abcd",
  "metrics": {
    "eval_time_ns": 45321,
    "num_rules_evaluated": 37
  },
  "correlation_id": "trace-xyz-123"
}
OPA supports decision logs via configuration; your host system should stream them to:
•	Kafka / Kinesis
•	ELK / Loki
•	Datadog / Prometheus / Grafana
________________________________________
14.2 Metrics and SLOs
To treat OPA like a production service, track at least:
•	Latency:
o	p50 / p95 / p99 evaluation time.
•	Throughput:
o	decisions per second.
•	Decision deltas:
o	How often outcomes change after a new bundle.
•	Error rate:
o	Number of evaluation failures (e.g., built-in errors in strict mode).
Define SLOs like:
•	99.9% of policy decisions complete in < 10 ms.
•	< 0.1% of decisions result in evaluation error.
•	Decision delta after bundle rollout < 1% for stable inputs (in shadow mode).
________________________________________
14.3 Correlation IDs and Tracing
Policy evaluations rarely stand alone; they’re part of a larger request trace:
•	HTTP header:
o	X-Request-Id
o	traceparent (W3C Trace Context)
•	PEP should pass correlation ID in:
o	input.trace_id
o	or embed as part of input.request.headers.
Then decision logs include correlation_id, which lets you:
•	Trace a single user’s journey across services.
•	Root-cause analyze unauthorized/denied requests quickly.
Example pattern:
package authz
category: generic
chapter: CH-05
pattern_type: conceptual
digest: 6113fbce8b5923b403d45a356fce68c82f23576dc7dc86cd4ca6960aa045e5d9
symbol_refs: [package authz]
semantic_role: pattern
embedding_hint_importance: low
embedding_hint_scope: local
embedding_hint_chunk: auto
semantic_categories: [distribution, observability]
:::
allow if {
  base_allow
  not tenant_extra_deny[_]
}
This gives global → domain final say on allow, and tenant extra ways to say “no.”
________________________________________
Chapter 14 – Observability & Audit
OPA is not only a decision engine; it’s an evidence generator. Observability and audit are how you prove that decisions are:
•	Correct
•	Consistent
•	Explainable
•	Compliant with regulation
________________________________________
14.1 Decision Logs
Every OPA decision should be treatable as a replayable event:
Minimum recommended fields:
•	decision_id (UUID)
•	timestamp
•	path (e.g., data.authz.allow)
•	input_hash or input (with PII scrubbing)
•	result (decision doc: allow/deny/effects)
•	bundle_revision
•	metrics (evaluation time, rule count)
•	correlation_id (to tie into tracing)
Conceptual log:
{
  "decision_id": "3f7b9b1a-0ee2-4e52-9f39-4edb8b6a3a01",
  "timestamp": "2025-12-05T10:02:45Z",
  "path": "data.authz.allow",
  "input_hash": "sha256:abcd...",
  "result": {
    "allow": false,
    "effects": [
      {
        "effect": "deny",
        "rule_id": "ACCT_001",
        "layer": "domain",
        "msg": "Closed accounts cannot be reopened"
      }
    ]
  },
  "bundle_revision": "git:1234abcd",
  "metrics": {
    "eval_time_ns": 45321,
    "num_rules_evaluated": 37
  },
  "correlation_id": "trace-xyz-123"
}
OPA supports decision logs via configuration; your host system should stream them to:
•	Kafka / Kinesis
•	ELK / Loki
•	Datadog / Prometheus / Grafana
________________________________________
14.2 Metrics and SLOs
To treat OPA like a production service, track at least:
•	Latency:
o	p50 / p95 / p99 evaluation time.
•	Throughput:
o	decisions per second.
•	Decision deltas:
o	How often outcomes change after a new bundle.
•	Error rate:
o	Number of evaluation failures (e.g., built-in errors in strict mode).
Define SLOs like:
•	99.9% of policy decisions complete in < 10 ms.
•	< 0.1% of decisions result in evaluation error.
•	Decision delta after bundle rollout < 1% for stable inputs (in shadow mode).
________________________________________
14.3 Correlation IDs and Tracing
Policy evaluations rarely stand alone; they’re part of a larger request trace:
•	HTTP header:
o	X-Request-Id
o	traceparent (W3C Trace Context)
•	PEP should pass correlation ID in:
o	input.trace_id
o	or embed as part of input.request.headers.
Then decision logs include correlation_id, which lets you:
•	Trace a single user’s journey across services.
•	Root-cause analyze unauthorized/denied requests quickly.
Example pattern:
package authz
:::

::: pattern
id: PATTERN-e80876fd79a2e88f
name: safe_input := {
description: # decision doc
decision := {
  "allow": allow,
  "trace_id": trace_id,
}
________________________________________
14.4 PII and Redaction in Logs
Golden rule: logs must not become a data breach.
•	Do not log entire input if it contains PII.
•	Instead:
o	Log hashed fields (hash(email))
o	Log ids / foreign keys
o	Redact sensitive values (e.g., use "redacted")
Pattern:
safe_input := {
  "user_id": input.user.id,
  "tenant_id": input.tenant_id,
  "resource_id": input.resource.id,
  "action": input.action,
}
Your decision logger uses safe_input rather than raw input.
________________________________________
14.5 Reproducibility & Auditability
A compliant audit story usually needs:
•	Given:
o	bundle_revision
o	policy_version
o	input (or hash + associated fixture)
•	You can re-evaluate the decision and get the same result.
To achieve this:
•	Store:
o	Bundle artifacts (bundle.tar.gz)
o	Manifest metadata (revision, version)
o	Decision logs + input fixtures (or deterministic reconstruction)
•	Avoid:
o	Non-deterministic calls in Rego (e.g., random, uncontrolled http.send)
When you must use time.now_ns or external data:
•	Either:
o	Snapshot it in the input used to evaluate.
o	Or store enough context to reconstruct.
________________________________________
Chapter 15 – Stateful & Temporal Extensions
OPA itself is stateless: each query sees input and data as immutable snapshots. Yet many policies are stateful or temporal:
•	Rate limits (N requests per unit time)
•	“No more than 5 failed logins in 10 minutes”
•	“This migration must be rolled out only after all canaries pass”
The trick: Move state and time into data + input, not inside Rego.
________________________________________
Stateful & Temporal Extensions
category: generic
chapter: CH-05
pattern_type: conceptual
digest: c2048461755f174464ae35968b52994e9a4674f24d0bb17e81247681cddbb84e
symbol_refs: [safe_input := {]
semantic_role: pattern
embedding_hint_importance: low
embedding_hint_scope: local
embedding_hint_chunk: auto
semantic_categories: [distribution, observability]
:::
# decision doc
decision := {
  "allow": allow,
  "trace_id": trace_id,
}
________________________________________
14.4 PII and Redaction in Logs
Golden rule: logs must not become a data breach.
•	Do not log entire input if it contains PII.
•	Instead:
o	Log hashed fields (hash(email))
o	Log ids / foreign keys
o	Redact sensitive values (e.g., use "redacted")
Pattern:
safe_input := {
  "user_id": input.user.id,
  "tenant_id": input.tenant_id,
  "resource_id": input.resource.id,
  "action": input.action,
}
Your decision logger uses safe_input rather than raw input.
________________________________________
14.5 Reproducibility & Auditability
A compliant audit story usually needs:
•	Given:
o	bundle_revision
o	policy_version
o	input (or hash + associated fixture)
•	You can re-evaluate the decision and get the same result.
To achieve this:
•	Store:
o	Bundle artifacts (bundle.tar.gz)
o	Manifest metadata (revision, version)
o	Decision logs + input fixtures (or deterministic reconstruction)
•	Avoid:
o	Non-deterministic calls in Rego (e.g., random, uncontrolled http.send)
When you must use time.now_ns or external data:
•	Either:
o	Snapshot it in the input used to evaluate.
o	Or store enough context to reconstruct.
________________________________________
Chapter 15 – Stateful & Temporal Extensions
OPA itself is stateless: each query sees input and data as immutable snapshots. Yet many policies are stateful or temporal:
•	Rate limits (N requests per unit time)
•	“No more than 5 failed logins in 10 minutes”
•	“This migration must be rolled out only after all canaries pass”
The trick: Move state and time into data + input, not inside Rego.
________________________________________
Stateful & Temporal Extensions
:::

::: pattern
id: PATTERN-16422769bea3fb75
name: 1.	events flow into kafka / kinesis.
description: count(recent_failures) > 5
  msg := "Too many recent login failures"
}
OPA sees only a subset; the window is curated by your stateful event pipeline.
________________________________________
15.3 Event-Driven Architectures with OPA
Typical pattern:
1.	Events flow into Kafka / Kinesis.
2.	A stream processor:
o	Maintains aggregates:
	counts, sums, last-seen times, sliding windows.
o	Writes materialized state to:
	Redis, DB, or data-bundles for OPA.
3.	OPA uses that state to decide:
o	Allow or deny new events.
o	Trigger downstream actions/alerts.
OPA remains pure — no long-lived state, no hidden mutable variables.
________________________________________
15.4 Time-Scoped Exceptions
Sometimes you want:
•	“Allow this temporary override until 2025-12-05.”
Pattern:
package overrides
category: architecture
chapter: CH-05
pattern_type: conceptual
digest: 607d54af899fa3d43126bf1b8ec65ff9e1634b05ef13730381463b0fe6194803
symbol_refs: [1.	events flow into kafka / kinesis.]
semantic_role: architecture
embedding_hint_importance: low
embedding_hint_scope: local
embedding_hint_chunk: auto
semantic_categories: [distribution]
:::
count(recent_failures) > 5
  msg := "Too many recent login failures"
}
OPA sees only a subset; the window is curated by your stateful event pipeline.
________________________________________
15.3 Event-Driven Architectures with OPA
Typical pattern:
1.	Events flow into Kafka / Kinesis.
2.	A stream processor:
o	Maintains aggregates:
	counts, sums, last-seen times, sliding windows.
o	Writes materialized state to:
	Redis, DB, or data-bundles for OPA.
3.	OPA uses that state to decide:
o	Allow or deny new events.
o	Trigger downstream actions/alerts.
OPA remains pure — no long-lived state, no hidden mutable variables.
________________________________________
15.4 Time-Scoped Exceptions
Sometimes you want:
•	“Allow this temporary override until 2025-12-05.”
Pattern:
package overrides
:::

::: pattern
id: PATTERN-7bab973cb8c529c8
name: •	keeps data access rules central.
description: statuses_for(user) := {"active"} if {
  not "admin" in user.roles
}
This pattern:
•	Keeps data access rules central.
•	Allows multiple services to enforce the same logic.
________________________________________
Chapter 17 – LLM & Agentic Integration with OPA
LLMs are good at generating Rego, OPA is good at executing and verifying Rego. Together they form:
“AI drafts policy, OPA and tests keep it safe.”
________________________________________
17.1 The Agentic Workflow
Canonical pipeline:
1.	Requirements in natural language:
o	“API keys must not be visible in logs”
o	“Admin role modifications require approval”
2.	LLM drafts:
o	Rego module.
o	Test suite (_test.rego).
o	Metadata (owner, rule_id).
3.	Static checks:
o	opa fmt
o	Regal lint
o	opa check --strict
4.	Dynamic checks:
o	opa test (unit + integration tests).
o	Fuzz/Golden tests for critical policies.
5.	Human review:
o	Security / Policy engineers review diff, semantics.
6.	Bundle build & rollout:
o	Standard policy SDLC.
OPA becomes the execution and verification back-end for LLM-authored policy.
________________________________________
17.2 Guardrails for LLM-Generated Rego
When you let an LLM write Rego, you must:
•	Enforce style & safety:
o	Modern syntax only (import rego.v1 or future.keywords).
o	No http.send in production rules (unless explicitly allowed).
o	No secrets in code.
o	Type guards for all input.* references.
•	Require tests:
o	At least one positive and one negative case.
o	Use with overrides instead of real network/time.
You can encode this as Rego that reviews Rego:
•	Use rego.metadata.chain() and AST analysis to enforce rules.
•	Or use external tools (Regal) plus your own AST/grep rules.
________________________________________
17.3 “Policy Copilot” Pattern
A typical agentic stack:
1.	Authoring agent:
o	Generates initial Rego module + tests from description and examples.
2.	Critic agent:
o	Reads module, runs static analysis (Regal messages, opa check).
o	Suggests improvements and simplifications.
3.	Tester agent:
o	Proposes additional tests (edge cases, negative paths).
o	Extends _test.rego.
4.	Reviewer agent:
o	Summarizes behavior in human language.
o	Flags risky constructs, ambiguous cases.
5.	Bundle builder:
o	Once human approves, compiles into bundle artifact.
OPA is the deterministic core all these agents orbit around.
________________________________________
17.4 LLM Self-Checking with Rego
LLMs can call OPA during prompt execution:
•	Use examples like:
o	“Write a policy such that opa eval returns allow=true for these inputs and false for others.”
•	LLM loops:
1.	Generate candidate Rego.
2.	Invoke opa test programmatically.
3.	If tests fail, update policy and try again (up to N iterations).
4.	Present final Rego + test report.
This turns Rego into a ground truth oracle inside an agentic system.
________________________________________
Chapter 18 – Rego Cheat Sheet (Condensed)
This chapter is intentionally tight – it’s the 2-page desk reference.
________________________________________
18.1 Core Rule Types
Type	Syntax	Example
Boolean	name if { ... }	allow if { is_admin }
Complete	name := value if { ... }	max_conns := 10 if is_admin
Partial Set	name contains x if { ... }	deny contains msg if { ... }
Partial Obj	name[key] := value if { ... }	roles[user] := role if { ... }
Function	f(x) := y if { ... }	double(x) := x * 2
Default	default name = value	default allow = false
________________________________________
18.2 Assignments & Comparisons
•	:= – assignment (one-way)
•	== – equality (no binding)
•	= – unification (binds if unbound, else compares)
Examples:
x := 10               # assignment
ok if x == 10         # comparison
category: generic
chapter: CH-05
pattern_type: conceptual
digest: ac3291460e0398eff785298520d978d7849655dbc7adadd9d7220eac70c0b3b9
symbol_refs: [•	keeps data access rules central.]
semantic_role: pattern
embedding_hint_importance: low
embedding_hint_scope: local
embedding_hint_chunk: auto
semantic_categories: [distribution, unification]
:::
statuses_for(user) := {"active"} if {
  not "admin" in user.roles
}
This pattern:
•	Keeps data access rules central.
•	Allows multiple services to enforce the same logic.
________________________________________
Chapter 17 – LLM & Agentic Integration with OPA
LLMs are good at generating Rego, OPA is good at executing and verifying Rego. Together they form:
“AI drafts policy, OPA and tests keep it safe.”
________________________________________
17.1 The Agentic Workflow
Canonical pipeline:
1.	Requirements in natural language:
o	“API keys must not be visible in logs”
o	“Admin role modifications require approval”
2.	LLM drafts:
o	Rego module.
o	Test suite (_test.rego).
o	Metadata (owner, rule_id).
3.	Static checks:
o	opa fmt
o	Regal lint
o	opa check --strict
4.	Dynamic checks:
o	opa test (unit + integration tests).
o	Fuzz/Golden tests for critical policies.
5.	Human review:
o	Security / Policy engineers review diff, semantics.
6.	Bundle build & rollout:
o	Standard policy SDLC.
OPA becomes the execution and verification back-end for LLM-authored policy.
________________________________________
17.2 Guardrails for LLM-Generated Rego
When you let an LLM write Rego, you must:
•	Enforce style & safety:
o	Modern syntax only (import rego.v1 or future.keywords).
o	No http.send in production rules (unless explicitly allowed).
o	No secrets in code.
o	Type guards for all input.* references.
•	Require tests:
o	At least one positive and one negative case.
o	Use with overrides instead of real network/time.
You can encode this as Rego that reviews Rego:
•	Use rego.metadata.chain() and AST analysis to enforce rules.
•	Or use external tools (Regal) plus your own AST/grep rules.
________________________________________
17.3 “Policy Copilot” Pattern
A typical agentic stack:
1.	Authoring agent:
o	Generates initial Rego module + tests from description and examples.
2.	Critic agent:
o	Reads module, runs static analysis (Regal messages, opa check).
o	Suggests improvements and simplifications.
3.	Tester agent:
o	Proposes additional tests (edge cases, negative paths).
o	Extends _test.rego.
4.	Reviewer agent:
o	Summarizes behavior in human language.
o	Flags risky constructs, ambiguous cases.
5.	Bundle builder:
o	Once human approves, compiles into bundle artifact.
OPA is the deterministic core all these agents orbit around.
________________________________________
17.4 LLM Self-Checking with Rego
LLMs can call OPA during prompt execution:
•	Use examples like:
o	“Write a policy such that opa eval returns allow=true for these inputs and false for others.”
•	LLM loops:
1.	Generate candidate Rego.
2.	Invoke opa test programmatically.
3.	If tests fail, update policy and try again (up to N iterations).
4.	Present final Rego + test report.
This turns Rego into a ground truth oracle inside an agentic system.
________________________________________
Chapter 18 – Rego Cheat Sheet (Condensed)
This chapter is intentionally tight – it’s the 2-page desk reference.
________________________________________
18.1 Core Rule Types
Type	Syntax	Example
Boolean	name if { ... }	allow if { is_admin }
Complete	name := value if { ... }	max_conns := 10 if is_admin
Partial Set	name contains x if { ... }	deny contains msg if { ... }
Partial Obj	name[key] := value if { ... }	roles[user] := role if { ... }
Function	f(x) := y if { ... }	double(x) := x * 2
Default	default name = value	default allow = false
________________________________________
18.2 Assignments & Comparisons
•	:= – assignment (one-way)
•	== – equality (no binding)
•	= – unification (binds if unbound, else compares)
Examples:
x := 10               # assignment
ok if x == 10         # comparison
:::

::: pattern
id: PATTERN-ff12b39da5d9a966
name: all enterprise-grade policy suites
description: This matches the pattern in your other test file (tech_debt_r15_test.rego) and is the correct pattern for all enterprise-grade policy suites.
category: generic
chapter: CH-05
pattern_type: conceptual
digest: 8046ce664afe536bf0720c34d4eda25677f1f417fe3c086350d4af52496f4da3
symbol_refs: [all enterprise-grade policy suites]
semantic_role: pattern
embedding_hint_importance: low
embedding_hint_scope: local
embedding_hint_chunk: auto
:::
This matches the pattern in your other test file (tech_debt_r15_test.rego) and is the correct pattern for all enterprise-grade policy suites.
:::

::: pattern
id: PATTERN-47647a18e70d4d1a
name: **
description: **Anti-Pattern:**
category: generic
chapter: CH-05
pattern_type: conceptual
digest: c43b71782a54d837e64dab737d1baa099ee3edb272d5e91138b0522f62840408
symbol_refs: [**]
semantic_role: pattern
embedding_hint_importance: low
embedding_hint_scope: local
embedding_hint_chunk: auto
:::
**Anti-Pattern:**
:::
