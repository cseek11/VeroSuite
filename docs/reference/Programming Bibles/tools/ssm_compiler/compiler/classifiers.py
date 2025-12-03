from __future__ import annotations

from typing import List, Dict, Any, Optional

import re

from .utils import (

    normalize_whitespace,

    make_id,

    TERM_PATTERNS,

    ALIAS_PATTERN,

    GENERIC_SECTION_TERMS,

)

# -------- Difficulty inference --------

INTERMEDIATE_MARKERS = [

    "comprehension",

    "partial evaluation",

    "bundle distribution",

    "decision logging",

]

ADVANCED_MARKERS = [

    "multi-tenant architecture",

    "stateful policy",

    "temporal logic",

    "graph reachability",

]

PHD_MARKERS = [

    "fixpoint",

    "horn clause",

    "stratified negation",

    "immediate consequence operator",

    "herbrand universe",

    "denotational semantics",

]

def infer_difficulty(chapter_num: int, content: str) -> List[str]:

    levels: List[str] = []

    # Structural defaults per chapter

    if chapter_num <= 2:

        levels += ["beginner", "intermediate"]

    elif chapter_num <= 8:

        levels += ["intermediate"]

    else:

        levels += ["advanced"]

    # Only add phd if multiple strong markers present

    lc = content.lower()

    hits = sum(1 for m in PHD_MARKERS if m.lower() in lc)

    if hits >= 2:

        levels.append("phd")

    return sorted(set(levels))

# -------- Term + alias extraction (with noise filtering) --------

def extract_terms(content: str) -> List[Dict[str, Any]]:

    terms: Dict[str, Dict[str, Any]] = {}

    def key_for(name: str, definition: str) -> str:

        return f"{name.strip().lower()}||{definition.strip().lower()}"

    for pat in TERM_PATTERNS:

        for m in pat.finditer(content):

            raw_name = m.group(1)

            name = normalize_whitespace(raw_name)

            definition = normalize_whitespace(m.group(2))

            # Filter: skip generic headings

            if name.strip().lower() in GENERIC_SECTION_TERMS:

                continue

            # Filter: definition must contain at least some real text

            if len(definition) < 8:

                continue

            if not re.search(r"[A-Za-z]{3,}", definition):

                continue

            # Skip definitions starting with diagram/table markers

            if definition.lstrip().startswith(("┌", "|", "{", "```", "#", "- **")):

                continue

            key = key_for(name, definition)

            if key not in terms:

                terms[key] = {

                    "name": name,

                    "definition": definition,

                    "aliases": set(),

                }

    # Aliases

    for m in ALIAS_PATTERN.finditer(content):

        name = normalize_whitespace(m.group(1))

        alias_str = m.group(2)

        aliases = [normalize_whitespace(a) for a in alias_str.split(",")]

        for data in terms.values():

            if data["name"].lower() == name.lower():

                data["aliases"].update(aliases)

    out: List[Dict[str, Any]] = []

    for data in terms.values():

        name = data["name"]

        definition = data["definition"]

        aliases = sorted(data["aliases"]) if data["aliases"] else []

        out.append(

            {

                "name": name,

                "definition": definition,

                "aliases": aliases,

                "id": make_id("TERM", f"{name}:{definition}", length=16),

            }

        )

    return out

# -------- Paragraph classification --------

def classify_paragraph(text: str) -> str:

    t = text.lower()

    scores = {

        "concept": 0,

        "fact": 0,

        "example": 0,

        "common-mistake": 0,

    }

    # Mistakes / anti-patterns

    if "unsafe" in t and "variable" in t:

        scores["common-mistake"] += 3

    if any(k in t for k in ["common mistake", "anti-pattern", "pitfall", "trap"]):

        scores["common-mistake"] += 2

    # Theory

    if any(m in t for m in ["unification", "evaluation model", "semantics", "fixpoint"]):

        scores["concept"] += 2

    # Normative → fact

    if any(m in t for m in ["must", "should", "shall", "required", "never", "always"]):

        scores["fact"] += 2

    if any(m in t for m in ["opa", "rego", "rule"]):

        scores["fact"] += 1

    # Example-ish

    if any(m in t for m in ["example", "for instance", "e.g.", "consider:"]):

        scores["example"] += 2

    if "```" in text:

        scores["example"] += 2

    label, best = max(scores.items(), key=lambda kv: kv[1])

    return label if best > 0 else "concept"

# -------- Mistake + "X vs Y" helpers --------

def looks_like_mistake_heading(text: str) -> bool:

    t = text.lower()

    return any(

        kw in t

        for kw in [

            "common mistake",

            "common mistakes",

            "anti-pattern",

            "anti pattern",

            "pitfall",

            "trap",

            "🚫",

            "❌",

        ]

    )

def looks_like_vs_heading(text: str) -> bool:

    return bool(re.search(r"\bvs\b", text, flags=re.IGNORECASE))

def normalize_heading_for_qa(heading: str) -> str:

    m = re.match(r"^\s*\d+(\.\d+)*\s+(.*)$", heading)

    return m.group(2) if m else heading

def generate_vs_qa(heading: str, body: str) -> Dict[str, str]:

    core = normalize_heading_for_qa(heading)

    m = re.search(r"(.+?)\s+vs\.?\s+(.+)", core, re.IGNORECASE)

    if m:

        x, y = m.group(1).strip(), m.group(2).strip()

        q = f"What is the difference between {x} and {y} in Rego?"

    else:

        q = f'What is explained in the section "{core}"?'

    sentences = re.split(r"[.!?]\s+", body.strip())

    answer = ". ".join(sentences[:2]).strip()

    if answer and not answer.endswith("."):

        answer += "."

    if not answer:

        answer = body.strip()

    return {

        "q": q,

        "a": normalize_whitespace(answer),

    }

# -------- Diagram classification --------

def classify_mermaid_diagram(text: str) -> Dict[str, Any]:

    body = text.lower()

    if "sequencediagram" in body:

        return {"diagram_type": "sequence", "tags": ["sequence", "flow"]}

    if "graph td" in body or "graph lr" in body:

        return {"diagram_type": "flowchart", "tags": ["flowchart", "graph"]}

    if "classdiagram" in body:

        return {"diagram_type": "class", "tags": ["class", "uml"]}

    if "statediagram" in body:

        return {"diagram_type": "state", "tags": ["state", "fsm"]}

    if "gantt" in body:

        return {"diagram_type": "timeline", "tags": ["timeline", "gantt"]}

    return {"diagram_type": "mermaid", "tags": []}

def detect_ascii_diagram(text: str) -> Optional[Dict[str, Any]]:

    stripped = text.strip()

    lines = stripped.splitlines()

    if len(lines) < 3:

        return None

    box_chars = ["+", "-", "|", "╔", "╗", "╚", "╝", "═", "║", "┌", "┐", "└", "┘"]

    box_lines = sum(1 for line in lines if any(c in line for c in box_chars))

    arrows = sum(1 for line in lines if "->" in line or "→" in line or "⇨" in line)

    if box_lines >= 3 or arrows >= 3:

        return {"diagram_type": "ascii", "tags": ["ascii", "diagram"]}

    return None

# -------- Code classification / pattern taxonomy --------

def guess_unlabeled_language(code: str) -> str:

    head = "\n".join(code.strip().splitlines()[:5]).lower()

    if "package " in head or "default " in head or "allow if" in head or "deny if" in head:

        return "rego"

    if re.search(r"\bdef\s+\w+\s*\(", head):

        return "python"

    if "@controller(" in head or "@module(" in head or "export " in head or "async " in head:

        return "typescript"

    return "rego"

def get_rego_pattern_taxonomy(code: str) -> Dict[str, Any]:

    t = code

    if "allow if" in t or "deny if" in t:

        return {"pattern_category": "authorization", "pattern_type": "allow-deny", "pattern_tags": ["auth", "rbac", "policy"]}

    if "not any_" in t or "every " in t:

        return {"pattern_category": "quantification", "pattern_type": "universal-via-negation", "pattern_tags": ["quantification", "negation"]}

    if "[ " in t and "|" in t and "]" in t:

        return {"pattern_category": "comprehension", "pattern_type": "array-comprehension", "pattern_tags": ["comprehension", "array"]}

    if "{ " in t and "|" in t and "}" in t and ":" in t:

        return {"pattern_category": "comprehension", "pattern_type": "object-comprehension", "pattern_tags": ["comprehension", "object"]}

    if "{ " in t and "|" in t and "}" in t and ":" not in t:

        return {"pattern_category": "comprehension", "pattern_type": "set-comprehension", "pattern_tags": ["comprehension", "set"]}

    if "with input as" in t or "with data as" in t:

        return {"pattern_category": "testing", "pattern_type": "with-mock", "pattern_tags": ["testing", "mock", "with"]}

    return {"pattern_category": "", "pattern_type": "", "pattern_tags": []}

def classify_rego_code(code: str) -> str:

    t = code

    if "allow if" in t or "deny if" in t:

        return "code-pattern"

    if "every " in t or "all_" in t or "any_" in t:

        return "code-pattern"

    if "[ " in t and "|" in t and "]" in t:

        return "code-pattern"

    if "{ " in t and "|" in t and "}" in t:

        return "code-pattern"

    if "not any_" in t:

        return "code-pattern"

    if "contains" in t and " if {" in t:

        return "code-pattern"

    return "example"

def classify_ts_code(code: str) -> str:

    return "example"

def classify_python_code(code: str) -> str:

    return "example"

def classify_go_code(code: str) -> str:

    return "example"

LANGUAGE_CONFIG: Dict[str, Dict[str, Any]] = {

    "rego": {"names": ["rego", "policy", "opa"], "classifier": classify_rego_code},

    "typescript": {"names": ["ts", "typescript"], "classifier": classify_ts_code},

    "python": {"names": ["py", "python"], "classifier": classify_python_code},

    "go": {"names": ["go", "golang"], "classifier": classify_go_code},

}

def classify_code(lang: str, code: str) -> str:

    l = (lang or "").strip().lower()

    if not l:

        guessed = guess_unlabeled_language(code)

        if guessed == "python":

            return classify_python_code(code)

        if guessed == "typescript":

            return classify_ts_code(code)

        return classify_rego_code(code)

    for _lname, cfg in LANGUAGE_CONFIG.items():

        if l in cfg.get("names", []):

            return cfg["classifier"](code)

    return "example"

